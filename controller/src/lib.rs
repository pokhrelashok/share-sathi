extern crate prettytable;

use meroshare::user::{User, UserDetails};
use meroshare::{
    Bank, Capital, Company, CompanyApplication, IPOAppliedResult, Meroshare, Portfolio, Prospectus,
    TransactionView,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::fs::{File, OpenOptions};
use std::io::Read;
use std::io::Write;
use std::vec;

pub struct Controller {
    meroshare: Meroshare,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UserDetailWithBank {
    details: UserDetails,
    banks: Vec<Bank>,
}

impl Controller {
    pub fn new() -> Controller {
        Controller {
            meroshare: Meroshare::new(),
        }
    }
    pub fn get_users(&self) -> Result<Vec<User>, String> {
        match File::open("users.json") {
            Ok(mut file) => {
                let mut contents = String::new();
                file.read_to_string(&mut contents)
                    .expect("Failed to read file");
                let users: Vec<User> = serde_json::from_str(&contents).expect("Invalid JSON");
                Ok(users)
            }
            Err(_) => Err("Couldn't fetch data".to_string()),
        }
    }
    pub fn update_user(&self, data: String) -> bool {
        let mut file = OpenOptions::new()
            .write(true)
            .truncate(true)
            .create(true)
            .open("users.json")
            .expect("Could not open file");
        file.set_len(0).unwrap();
        file.write_all(data.as_bytes()).unwrap();
        true
    }

    pub async fn get_user_details(&mut self, user: User) -> Result<UserDetailWithBank, String> {
        match self.meroshare.get_user_details(&user).await {
            Ok(details) => {
                let banks = self.meroshare.get_user_banks(&user).await.unwrap();
                Ok(UserDetailWithBank {
                    details: details,
                    banks: banks,
                })
            }
            Err(e) => Err(e),
        }
    }

    pub async fn get_capitals(&self) -> Result<Vec<Capital>, String> {
        match self.meroshare.get_capitals().await {
            Ok(banks) => Ok(banks),
            Err(e) => Err(e),
        }
    }

    pub async fn list_open_shares(&mut self) -> Result<Vec<Company>, String> {
        let users = self.get_users().unwrap();
        let user = users.get(0).unwrap();
        match self.meroshare.get_current_issue(user).await {
            Ok(shares) => Ok(shares),
            Err(e) => Err(e),
        }
    }

    pub async fn get_company_prospectus(&mut self, id: i32) -> Result<Prospectus, String> {
        let users: Vec<User> = self.get_users().unwrap();
        let user = users.get(0).unwrap();
        match self.meroshare.get_company_prospectus(user, id).await {
            Ok(prospectus) => Ok(prospectus),
            Err(e) => Err(e),
        }
    }

    pub async fn apply_share(
        &mut self,
        id: i32,
        user: User,
        units: i32,
        is_reapply: bool,
    ) -> IPOAppliedResult {
        // let users: Vec<User> = self.get_users().unwrap();
        // let mut results: Vec<IPOAppliedResult> = vec![];
        // for user in users.iter() {
        let result = self
            .meroshare
            .apply_share(&user, id, units, is_reapply)
            .await
            .unwrap();
        return result;
        // }
        // return results;
    }

    pub async fn get_application_report(&mut self) -> Result<Vec<CompanyApplication>, String> {
        let users: Vec<User> = self.get_users().unwrap();
        let user = users.get(0).unwrap();
        match self.meroshare.get_application_report(user).await {
            Ok(shares) => Ok(shares),
            Err(e) => Err(e),
        }
    }

    pub async fn get_results(&mut self, script: String, user: &User) -> String {
        // let mut results: Vec<IPOResult> = vec![];
        // let users: Vec<User> = self.get_users().unwrap();
        // for user in users.iter() {
        let result = self
            .meroshare
            .get_company_result(user, script.as_str())
            .await;
        // results.push(IPOResult {
        //     user: user.name.clone(),
        //     status: result,
        // });
        // }
        // return results;
        return result;
    }

    pub async fn get_user_portfolio(&mut self, id: String) -> Portfolio {
        let users: Vec<User> = self.get_users().unwrap();
        let user = users
            .iter()
            .find(|&user| user.id == id)
            .expect("Invalid id");
        match self.meroshare.get_portfolio(user).await {
            Ok(items) => items,
            Err(_) => Portfolio {
                total_items: 0.0,
                total_value_of_last_trans_price: 0.0,
                total_value_of_prev_closing_price: 0.0,
                items: vec![],
            },
        }
    }

    pub async fn get_transactions(&mut self, id: String) -> Result<TransactionView, String> {
        let users: Vec<User> = self.get_users().unwrap();
        let user = users
            .iter()
            .find(|&user| user.id == id)
            .expect("Invalid id");
        return self.meroshare.get_transactions(user).await;
    }

    pub async fn change_password(
        &mut self,
        id: String,
        password: String,
    ) -> Result<String, String> {
        let mut users: Vec<User> = self.get_users().unwrap();
        if let Some(index) = users.iter().position(|user| user.id == id) {
            let user = &mut users[index];
            let res = self.meroshare.change_password(user, &password).await;
            if res.is_ok() {
                user.password = password.clone();
                users[index] = user.clone();
                self.update_user(serde_json::to_string(&users).expect("Something went wrong"));
            }
            return res;
        }

        Err("User not found".to_string())
    }
}
