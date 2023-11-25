extern crate prettytable;

use meroshare::user::User;
use meroshare::{Company, IPOAppliedResult, Meroshare, Prospectus};
use std::fs::{File, OpenOptions};
use std::io::Read;
use std::io::Write;
pub struct Controller {
    meroshare: Meroshare,
}

impl Controller {
    pub fn new() -> Controller {
        Controller {
            meroshare: Meroshare::new(),
        }
    }
    pub fn get_users(&self) -> Result<Vec<User>, &str> {
        match File::open("users.json") {
            Ok(mut file) => {
                let mut contents = String::new();
                file.read_to_string(&mut contents)
                    .expect("Failed to read file");
                let users: Vec<User> = serde_json::from_str(&contents).expect("Invalid JSON");
                Ok(users)
            }
            Err(_) => Err("Couldn't fetch data"),
        }
    }
    pub fn update_user(&self, data: String) -> bool {
        let mut file = OpenOptions::new()
            .write(true)
            .truncate(true)
            .create(true)
            .open("users.json")
            .expect("Coould not open file");
        file.set_len(0).unwrap();
        file.write_all(data.as_bytes()).unwrap();
        true
    }

    pub async fn list_open_shares(&mut self) -> Result<Vec<Company>, &str> {
        let users = self.get_users().unwrap();
        let user = users.get(0).unwrap();
        match self.meroshare.get_current_issue(user).await {
            Ok(shares) => Ok(shares),
            Err(_) => Err("Something went wrong!"),
        }
    }

    pub async fn get_company_prospectus(&mut self, id: i32) -> Result<Prospectus, &str> {
        let users: Vec<User> = self.get_users().unwrap();
        let user = users.get(0).unwrap();
        match self.meroshare.get_company_prospectus(user, id).await {
            Ok(prospectus) => Ok(prospectus),
            Err(_) => Err("Something went wrong!"),
        }
    }

    pub async fn apply_share(&mut self, id: i32, units: i32) -> Vec<IPOAppliedResult> {
        let users: Vec<User> = self.get_users().unwrap();
        let mut results: Vec<IPOAppliedResult> = vec![];
        for user in users.iter() {
            results.push(self.meroshare.apply_share(user, id, units).await.unwrap());
        }
        return results;
    }
}
