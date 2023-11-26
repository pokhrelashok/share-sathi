use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct User {
    pub id: String,
    pub dp: String,
    pub username: String,
    pub password: String,
    pub crn: String,
    pub pin: String,
    pub name: String,
    pub bank: String,
    // #[serde(default = "default_tag")]
    // pub tags: Vec<String>,
}

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct UserDetails {
    #[serde(default = "default_address")]
    pub address: String,
    pub boid: String,
    #[serde(rename = "clientCode")]
    pub client_code: String,
    pub contact: String,
    #[serde(rename = "createdApproveDate")]
    pub created_approve_date: String,
    #[serde(rename = "createdApproveDateStr")]
    pub created_approve_date_str: String,
    #[serde(rename = "customerTypeCode")]
    pub customer_type_code: String,
    pub demat: String,
    #[serde(rename = "dematExpiryDate")]
    pub demat_expiry_date: String,
    pub email: String,
    #[serde(rename = "expiredDate")]
    pub expired_date: String,
    #[serde(rename = "expiredDateStr")]
    pub expired_date_str: String,
    pub gender: String,
    pub id: u32,
    #[serde(rename = "imagePath")]
    pub image_path: String,
    #[serde(rename = "meroShareEmail")]
    pub mero_share_email: String,
    pub name: String,
    #[serde(rename = "passwordChangeDate")]
    pub password_change_date: String,
    #[serde(rename = "passwordChangedDateStr")]
    pub password_changed_date_str: String,
    #[serde(rename = "passwordExpiryDate")]
    pub password_expiry_date: String,
    #[serde(rename = "passwordExpiryDateStr")]
    pub password_expiry_date_str: String,
    #[serde(rename = "profileName")]
    pub profile_name: String,
    #[serde(rename = "renewedDate", default = "default_renew_date")]
    pub renewed_date: String,
    #[serde(rename = "renewedDateStr", default = "default_renew_date")]
    pub renewed_date_str: String,
    pub username: String,
}

fn default_renew_date() -> String {
    String::from("Lifetime")
}
fn default_address() -> String {
    String::from("")
}
