// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use controller::{Controller, UserDetailWithBank};
use lazy_static::lazy_static;
use meroshare::{
    Capital, Company, CompanyApplication, IPOAppliedResult, IPOResult, Portfolio, Prospectus,
    TransactionView, User,
};
use std::sync::Arc;
use tokio::sync::Mutex as AsyncMutex;

type SharedController = Arc<AsyncMutex<Controller>>;

lazy_static! {
    static ref CONTROLLER: SharedController = Arc::new(AsyncMutex::new(Controller::new()));
}

#[tauri::command]
async fn list_open_shares() -> Result<Vec<Company>, String> {
    let controller = CONTROLLER.clone();
    let mut controller_lock = controller.lock().await;
    let shares = controller_lock.list_open_shares().await;
    return shares;
}
#[tauri::command]
async fn get_company_prospectus(id: i32) -> Result<Prospectus, String> {
    let controller = CONTROLLER.clone();
    let mut controller_lock = controller.lock().await;
    let prospectus = controller_lock.get_company_prospectus(id).await;
    return Ok(prospectus.unwrap());
}
#[tauri::command]
async fn apply_share(id: i32, user: User, units: i32, is_reapply: bool) -> IPOAppliedResult {
    let controller = CONTROLLER.clone();
    let mut controller_lock = controller.lock().await;
    let prospectus = controller_lock
        .apply_share(id, user, units, is_reapply)
        .await;
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
async fn get_capitals() -> Result<Vec<Capital>, String> {
    let controller = CONTROLLER.clone();
    let controller_lock = controller.lock().await;
    let res = controller_lock.get_capitals().await;
    return res;
}
#[tauri::command]
async fn get_user_details(user: User) -> Result<UserDetailWithBank, String> {
    let controller = CONTROLLER.clone();
    let mut controller_lock = controller.lock().await;
    let res = controller_lock.get_user_details(user).await;
    return res;
}
#[tauri::command]
async fn get_application_report() -> Result<Vec<CompanyApplication>, String> {
    let controller = CONTROLLER.clone();
    let mut controller_lock = controller.lock().await;
    let res = controller_lock.get_application_report().await;
    return res;
}
#[tauri::command]
async fn get_share_results(script: String, user: User) -> String {
    let controller = CONTROLLER.clone();
    let mut controller_lock = controller.lock().await;
    let res = controller_lock.get_results(script, &user).await;
    return res;
}
#[tauri::command]
async fn get_user_portfolio(id: String) -> Portfolio {
    let controller = CONTROLLER.clone();
    let mut controller_lock = controller.lock().await;
    let res = controller_lock.get_user_portfolio(id).await;
    return res;
}
#[tauri::command]
async fn get_user_transactions(id: String) -> Result<TransactionView, String> {
    let controller = CONTROLLER.clone();
    let mut controller_lock = controller.lock().await;
    let res = controller_lock.get_transactions(id).await;
    return res;
}
#[tauri::command]
async fn change_password(id: String, password: String) -> Result<String, String> {
    let controller = CONTROLLER.clone();
    let mut controller_lock = controller.lock().await;
    let res = controller_lock.change_password(id, password).await;
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
            get_user_details,
            get_application_report,
            get_share_results,
            get_user_portfolio,
            get_user_transactions,
            change_password
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
