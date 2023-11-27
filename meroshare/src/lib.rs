use ipo::IPOResultResponse;
use reqwest::Error;
use reqwest::Method;
use reqwest::StatusCode;
use response::ApiResponseApplicationReport;
use response::ApiResponseCurrentIssue;
use serde_json::json;
use std::collections::HashMap;
use tokio::sync::Mutex;

#[path = "models/bank.rs"]
mod bank;
#[path = "models/capital.rs"]
mod capital;
#[path = "models/company.rs"]
mod company;
#[path = "utils/currency.rs"]
mod currency;
#[path = "models/ipo.rs"]
mod ipo;
#[path = "models/portfolio.rs"]
mod portfolio;
#[path = "utils/request.rs"]
mod request;
#[path = "models/response.rs"]
mod response;
#[path = "models/transaction.rs"]
mod transaction;
#[path = "models/user.rs"]
pub mod user;

pub use crate::bank::Bank;
pub use crate::bank::BankDetails;
pub use crate::capital::Capital;
pub use crate::company::Company;
pub use crate::company::CompanyApplication;
pub use crate::company::Prospectus;
pub use crate::currency::CURR_FORMAT;
pub use crate::ipo::IPOAppliedResult;
pub use crate::ipo::IPOResult;
pub use crate::portfolio::Portfolio;
use crate::request::make_request;
pub use crate::transaction::TransactionView;
pub use crate::user::User;
use crate::user::UserDetails;
use crate::user::UserStatus;

const PORTFOLIO_URL: &str = "https://webbackend.cdsc.com.np/api/meroShareView/";
const MERO_SHARE_URL: &str = "https://webbackend.cdsc.com.np/api/meroShare/";

pub struct Meroshare {
    capitals: Mutex<Vec<Capital>>,
    tokens: Mutex<HashMap<String, String>>,
}
impl Meroshare {
    pub fn new() -> Meroshare {
        Meroshare {
            capitals: Mutex::new(vec![]),
            tokens: Mutex::new(HashMap::new()),
        }
    }
    pub async fn get_auth_header(
        &mut self,
        user: &User,
    ) -> Result<HashMap<String, String>, String> {
        let mut token = String::from("");
        let mut token_guard = self.tokens.lock().await;
        // let mut capital_guard = self.capitals.lock().await;
        match token_guard.get(&user.username) {
            Some(t) => {
                token = t.clone();
            }
            None => {
                let body = json!({
                    "clientId":user.dp,
                    "username":user.username,
                    "password":user.password,
                });
                let url = MERO_SHARE_URL.to_string() + "auth/";
                let result = make_request(&url, Method::POST, Some(body), None).await;
                match result {
                    Ok(value) => {
                        let status_code = value.status();
                        if status_code != StatusCode::OK {
                            return Err("Failed To Login".to_string());
                        }
                        // Extract headers
                        let headers = value.headers().clone();
                        let status: UserStatus = value.json().await.unwrap();

                        if status.password_expired || status.demat_expired || status.account_expired
                        {
                            let msg = status.message.clone();
                            return Err(msg);
                        }

                        token = headers
                            .get("authorization")
                            .unwrap()
                            .to_str()
                            .unwrap()
                            .to_owned();
                        token_guard.insert(user.username.clone(), token.clone());
                    }
                    Err(_error) => {
                        return Err("Failed To Login".to_string());
                    }
                }
            }
        }
        let mut headers = HashMap::new();
        headers.insert(String::from("Authorization"), token.as_str().to_string());
        Ok(headers)
    }

    pub async fn get_capitals(&self) -> Result<Vec<Capital>, Error> {
        let url = MERO_SHARE_URL.to_string() + "capital/";
        let result = make_request(&url, Method::GET, None, None).await;
        match result {
            Ok(value) => {
                let banks: Vec<Capital> = value.json().await?;
                Ok(banks)
            }
            Err(error) => Err(error),
        }
    }

    #[allow(dead_code)]

    pub async fn get_user_banks(&mut self, user: &User) -> Result<Vec<Bank>, String> {
        // let headers = .unwrap();
        match self.get_auth_header(user).await {
            Ok(headers) => {
                let url = MERO_SHARE_URL.to_string() + "bank/";
                let result = make_request(&url, Method::GET, None, Some(headers)).await;
                match result {
                    Ok(value) => {
                        let banks: Vec<Bank> = value.json().await.unwrap();
                        Ok(banks)
                    }
                    Err(_) => Err("Something went wrong".to_string()),
                }
            }
            Err(e) => Err(e),
        }
    }

    pub async fn get_bank_details(&mut self, id: &str, user: &User) -> Result<BankDetails, Error> {
        let headers = self.get_auth_header(user).await.unwrap();
        let url = MERO_SHARE_URL.to_string() + "bank/" + id;
        let result = make_request(&url, Method::GET, None, Some(headers)).await;
        match result {
            Ok(value) => {
                let banks: BankDetails = value.json().await?;
                Ok(banks)
            }
            Err(error) => Err(error),
        }
    }
    pub async fn get_user_details(&mut self, user: &User) -> Result<UserDetails, String> {
        match self.get_auth_header(user).await {
            Ok(headers) => {
                let url = MERO_SHARE_URL.to_string() + "ownDetail/";
                let result = make_request(&url, Method::GET, None, Some(headers)).await;
                match result {
                    Ok(value) => {
                        let user: UserDetails = value.json().await.unwrap();
                        Ok(user)
                    }
                    Err(_) => Err("something went wrong".to_string()),
                }
            }
            Err(e) => Err(e),
        }
    }

    #[allow(dead_code)]

    pub async fn get_current_issue(&mut self, user: &User) -> Result<Vec<Company>, String> {
        match self.get_auth_header(user).await {
            Ok(headers) => {
                let url = MERO_SHARE_URL.to_string() + "companyShare/currentIssue/";
                let body = json!({
                    "filterFieldParams": [
                        {"key": "companyIssue.companyISIN.script", "alias":"Scrip"},
                        {"key": "companyIssue.companyISIN.company.name", "alias": "Company Name"},
                        {"key": "companyIssue.assignedToClient.name", "value":"", "alias": "Issue Manager"}
                    ],
                    "page":1,
                    "size":4,
                    "searchRoleViewConstants":"VIEW_OPEN_SHARE",
                    "filterDateParams":[
                        {"key": "minIssueOpenDate", "condition": "", "alias": "", "value": ""},
                        {"key": "maxIssueCloseDate", "condition": "", "alias":"", "value": ""}
                    ]
                });
                let result = make_request(&url, Method::POST, Some(body), Some(headers)).await;
                match result {
                    Ok(value) => {
                        let response: ApiResponseCurrentIssue = value.json().await.unwrap();
                        Ok(response.object)
                    }
                    Err(_) => Err("Something went wrong".to_string()),
                }
            }
            Err(e) => return Err(e),
        }
    }

    #[allow(dead_code)]

    pub async fn get_application_report(
        &mut self,
        user: &User,
    ) -> Result<Vec<CompanyApplication>, String> {
        match self.get_auth_header(user).await {
            Ok(headers) => {
                let url = MERO_SHARE_URL.to_string() + "applicantForm/active/search/";
                let body = json!({"filterFieldParams":[{"key":"companyShare.companyIssue.companyISIN.script","alias":"Scrip"},{"key":"companyShare.companyIssue.companyISIN.company.name","alias":"Company Name"}],"page":1,"size":200,"searchRoleViewConstants":"VIEW_APPLICANT_FORM_COMPLETE","filterDateParams":[{"key":"appliedDate","condition":"","alias":"","value":""},{"key":"appliedDate","condition":"","alias":"","value":""}]});
                let result = make_request(&url, Method::POST, Some(body), Some(headers)).await;
                match result {
                    Ok(value) => {
                        let response: ApiResponseApplicationReport = value.json().await.unwrap();
                        Ok(response.object)
                    }
                    Err(_) => Err("Something went wrong".to_string()),
                }
            }
            Err(err) => Err(err),
        }
    }

    pub async fn get_company_result(&mut self, user: &User, script: &str) -> String {
        match self.get_auth_header(user).await {
            Ok(headers) => {
                let shares = self.get_application_report(user).await.unwrap();
                let application_search = shares
                    .iter()
                    .find(|&application| application.script == script);

                if let Some(application) = application_search {
                    let url = MERO_SHARE_URL.to_string()
                        + "applicantForm/report/detail/"
                        + (application.id).to_string().as_str();
                    let result = make_request(&url, Method::GET, None, Some(headers)).await;
                    match result {
                        Ok(value) => {
                            let result: IPOResultResponse = value.json().await.unwrap();
                            result.status
                        }
                        Err(_) => "Failed to Fetch".to_string(),
                    }
                } else {
                    "Not Applied".to_string()
                }
            }
            Err(_) => "Failed to Fetch".to_string(),
        }
    }

    pub async fn get_company_prospectus(
        &mut self,
        user: &User,
        id: i32,
    ) -> Result<Prospectus, Error> {
        let headers = self.get_auth_header(user).await.unwrap();
        let url = MERO_SHARE_URL.to_string() + "active/" + (id).to_string().as_str();
        let result = make_request(&url, Method::GET, None, Some(headers)).await;
        match result {
            Ok(value) => {
                let result: Prospectus = value.json().await?;
                Ok(result)
            }
            Err(error) => Err(error),
        }
    }

    pub async fn get_portfolio(&mut self, user: &User) -> Result<Portfolio, String> {
        match self.get_auth_header(user).await {
            Ok(headers) => {
                let user_details = self.get_user_details(&user).await.unwrap();
                let url = PORTFOLIO_URL.to_string() + "myPortfolio";
                let body = json!({
                    "clientCode":user.dpcode,
                    "demat":[user_details.demat],
                    "page":1,
                    "size":500,
                    "sortAsc":true,
                    "sortBy":"script",
                });
                let result = make_request(&url, Method::POST, Some(body), Some(headers)).await;
                match result {
                    Ok(value) => {
                        let result: Portfolio = value.json().await.unwrap();
                        Ok(result)
                    }
                    Err(_) => Err("Something went wrong".to_string()),
                }
            }
            Err(e) => Err(e),
        }
    }

    pub async fn get_transactions(&mut self, user: &User) -> Result<TransactionView, String> {
        match self.get_auth_header(user).await {
            Ok(headers) => {
                let user_details = self.get_user_details(&user).await.unwrap();
                let url = PORTFOLIO_URL.to_string() + "myTransaction";
                let body = json!({
                    "boid":user_details.demat,
                    "clientCode":user.dp,
                    "page":1,
                    "requestTypeScript":false,
                    "script":null,
                    "size":200,
                });
                let result = make_request(&url, Method::POST, Some(body), Some(headers)).await;
                match result {
                    Ok(value) => {
                        let result: TransactionView = value.json().await.unwrap();
                        Ok(result)
                    }
                    Err(_) => Err("Something went wrong".to_string()),
                }
            }
            Err(e) => Err(e),
        }
    }

    pub async fn apply_share(
        &mut self,
        user: &User,
        id: i32,
        units: i32,
    ) -> Result<IPOAppliedResult, Error> {
        let headers = self.get_auth_header(user).await.unwrap();
        let bank_details = self
            .get_bank_details(user.bank.as_str(), user)
            .await
            .unwrap();
        let user_details = self.get_user_details(user).await.unwrap();
        let url = MERO_SHARE_URL.to_string() + "applicantForm/share/apply/";
        let body = json!({
            "accountBranchId":bank_details.account_branch_id,
            "accountNumber":bank_details.account_number,
            "appliedKitta":units,
            "bankId":user.bank,
            "boid":user_details.boid,
            "companyShareId":id,
            "crnNumber":user.crn,
            "customerId":bank_details.id,
            "demat":user_details.demat,
            "transactionPIN":user.pin,
        });
        let result = make_request(&url, Method::POST, Some(body), Some(headers)).await;
        match result {
            Ok(value) => {
                let result: IPOAppliedResult = value.json().await?;
                Ok(result)
            }
            Err(_) => {
                let result: IPOAppliedResult = IPOAppliedResult {
                    message: String::from("Something went wrong"),
                    status: String::from("APPLICATION_FAILED"),
                };
                Ok(result)
            }
        }
    }
}
