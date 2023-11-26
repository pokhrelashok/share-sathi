use prettytable::{Cell, Row, Table};
use serde::Deserialize;
use serde::Serialize;
use thousands::Separable;

use crate::currency::CURR_FORMAT;

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct Company {
    #[serde(rename = "companyName")]
    pub company_name: String,
    #[serde(rename = "companyShareId")]
    pub company_share_id: i32,
    #[serde(rename = "issueCloseDate")]
    pub issue_close_date: String,
    #[serde(rename = "issueOpenDate")]
    pub issue_open_date: String,
    // #[serde(rename = "reservationTypeName")]
    // reservation_type_name: String,
    #[serde(rename = "scrip")]
    pub script: String,
    #[serde(rename = "shareGroupName")]
    pub share_group_name: String,
    #[serde(rename = "shareTypeName")]
    pub share_type_name: String,
    #[serde(rename = "statusName")]
    pub status_name: String,
    #[serde(rename = "subGroup")]
    pub sub_group: String,
}
#[derive(Debug, Deserialize, Serialize)]

pub struct CompanyApplication {
    #[serde(rename = "applicantFormId")]
    pub id: u64,
    #[serde(rename = "companyName")]
    pub company_name: String,
    #[serde(rename = "companyShareId")]
    pub company_share_id: i32,
    #[serde(rename = "scrip")]
    pub script: String,
    #[serde(rename = "shareGroupName")]
    pub share_group_name: String,
    #[serde(rename = "shareTypeName")]
    pub share_type_name: String,
    #[serde(rename = "statusName")]
    pub status_name: String,
    #[serde(rename = "subGroup")]
    pub sub_group: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Prospectus {
    #[serde(rename = "clientName")]
    pub client_name: String,
    #[serde(rename = "companyCode")]
    pub company_code: String,
    #[serde(rename = "companyName")]
    pub company_name: String,
    #[serde(rename = "companyShareId")]
    pub company_share_id: u32,
    #[serde(rename = "maxIssueCloseDate")]
    pub max_issue_close_date: String,
    #[serde(rename = "maxIssueCloseDateStr")]
    pub max_issue_close_date_str: String,
    #[serde(rename = "maxUnit")]
    pub max_unit: u32,
    #[serde(rename = "minIssueOpenDate")]
    pub min_issue_open_date: String,
    #[serde(rename = "minIssueOpenDateStr")]
    pub min_issue_open_date_str: String,
    #[serde(rename = "minUnit")]
    pub min_unit: u32,
    pub scrip: String,
    #[serde(rename = "shareGroupName")]
    pub share_group_name: String,
    #[serde(rename = "sharePerUnit")]
    pub share_per_unit: f32,
    #[serde(rename = "shareTypeName")]
    pub share_type_name: String,
    #[serde(rename = "shareValue")]
    pub share_value: f32,
}

impl Prospectus {
    pub fn print_table(&self) {
        let mut table = Table::new();
        table.add_row(Row::new(vec![
            Cell::new("Company Name"),
            Cell::new(&self.company_name),
        ]));
        table.add_row(Row::new(vec![
            Cell::new("Max Issue Close Date"),
            Cell::new(&self.max_issue_close_date),
        ]));
        table.add_row(Row::new(vec![
            Cell::new("Share Type"),
            Cell::new(&self.share_type_name),
        ]));
        table.add_row(Row::new(vec![
            Cell::new("Price Per Unit"),
            Cell::new(
                &self
                    .share_per_unit
                    .separate_by_policy(CURR_FORMAT)
                    .to_string(),
            ),
        ]));
        table.add_row(Row::new(vec![
            Cell::new("Min Unit"),
            Cell::new(&self.min_unit.to_string()),
        ]));
        table.printstd();
    }
}
