use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct IPOResult {
    // #[serde(rename = "appliedKitta")]
    // pub applied_kitta: i32,
    #[serde(rename = "statusName")]
    #[serde(default = "default_status")]
    pub status: String,
}
fn default_status() -> String {
    "Not Filled".to_string()
}

#[derive(Debug, Deserialize, Serialize)]

pub struct IPOAppliedResult {
    pub message: String,
    pub status: String,
}
