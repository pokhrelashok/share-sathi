use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug, Clone, Serialize)]
pub struct Capital {
    pub code: String,
    pub id: usize,
    pub name: String,
}
