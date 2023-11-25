use serde::Deserialize;

use crate::company::{Company, CompanyApplication};

#[derive(Debug, Deserialize)]

pub struct ApiResponseApplicationReport {
    pub object: Vec<CompanyApplication>,
}
#[derive(Debug, Deserialize)]
pub struct ApiResponseCurrentIssue {
    pub object: Vec<Company>,
}
