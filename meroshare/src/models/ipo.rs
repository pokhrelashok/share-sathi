use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct IPOResult {
    pub user: String,
    pub status: String,
}

#[derive(Debug, Deserialize, Serialize)]

pub struct IPOAppliedResult {
    pub message: String,
    pub status: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct IPOResultResponse {
    #[serde(rename = "statusName", default = "default_status")]
    pub status: String,
}

fn default_status() -> String {
    "Failed to fetch".to_string()
}
