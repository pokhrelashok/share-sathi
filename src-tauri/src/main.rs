// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use controller::UserDetailWithBank;
use meroshare::{Capital, Company, IPOAppliedResult, Prospectus, User};

#[derive(Default)]
struct MyState {}

#[tauri::command]
async fn list_open_shares() -> Result<Vec<Company>, &'static str> {
    let mut controller = controller::Controller::new();
    let shares = controller.list_open_shares().await;
    return Ok(shares.unwrap());
}
#[tauri::command]
async fn get_company_prospectus(id: i32) -> Result<Prospectus, &'static str> {
    let mut controller = controller::Controller::new();
    let prospectus = controller.get_company_prospectus(id).await;
    return Ok(prospectus.unwrap());
}
#[tauri::command]
async fn apply_share(id: i32, units: i32) -> Vec<IPOAppliedResult> {
    let mut controller = controller::Controller::new();
    let prospectus = controller.apply_share(id, units).await;
    return prospectus;
}
#[tauri::command]
async fn get_users() -> Vec<User> {
    let controller = controller::Controller::new();
    let user_result = controller.get_users();
    match user_result {
        Ok(users) => users,
        Err(_) => vec![],
    }
}
#[tauri::command]
async fn update_user(data: String) -> bool {
    let controller = controller::Controller::new();
    let res = controller.update_user(data);
    return res;
}
#[tauri::command]
async fn get_capitals() -> Result<Vec<Capital>, &'static str> {
    let controller = controller::Controller::new();
    let res = controller.get_capitals().await;
    return res;
}
#[tauri::command]
async fn get_user_details(user: User) -> Result<UserDetailWithBank, &'static str> {
    let mut controller = controller::Controller::new();
    let res = controller.get_user_details(user).await;
    return res;
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_open_shares,
            get_company_prospectus,
            apply_share,
            get_users,
            update_user,
            get_capitals,
            get_user_details
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
