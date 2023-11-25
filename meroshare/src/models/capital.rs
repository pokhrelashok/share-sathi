use serde::Deserialize;

#[derive(Deserialize, Debug, Clone)]
pub struct Capital {
    pub code: String,
    pub id: usize,
    pub name: String,
}
