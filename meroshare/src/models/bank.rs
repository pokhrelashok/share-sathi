use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug, Serialize)]
pub struct Bank {
    pub id: u32,
    pub name: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct BankDetails {
    #[serde(rename = "accountBranchId")]
    pub account_branch_id: u32,
    #[serde(rename = "accountNumber")]
    pub account_number: String,
    #[serde(rename = "bankId")]
    pub bank_id: u32,
    #[serde(rename = "branchID")]
    pub branch_id: u32,
    #[serde(rename = "branchName")]
    pub branch_name: String,
    pub id: u32,
}
