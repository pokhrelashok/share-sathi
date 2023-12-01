use prettytable::{color, Attr, Cell, Row, Table};
use serde::{Deserialize, Serialize};
use thousands::Separable;

use crate::{currency::CURR_FORMAT, user::User};

#[derive(Debug, Deserialize, Serialize)]
pub struct TransactionView {
    #[serde(rename = "totalItems")]
    pub total_items: u32,
    #[serde(rename = "transactionView")]
    pub items: Vec<Transaction>,
}

impl TransactionView {
    pub fn print_table(&self, user: &User) {
        let mut table = Table::new();
        table.add_row(Row::new(vec![Cell::new(
            format!("Transactions of {}", user.name).as_str(),
        )
        .with_style(Attr::Bold)
        .with_hspan(5)
        .style_spec("cb")]));
        table.add_row(Row::new(vec![
            Cell::new("Script").with_style(Attr::Bold),
            Cell::new("Total").with_style(Attr::Bold),
            Cell::new("Description").with_style(Attr::Bold),
            Cell::new("Quantity").with_style(Attr::Bold),
            Cell::new("Type").with_style(Attr::Bold),
            Cell::new("Date").with_style(Attr::Bold),
        ]));

        for entry in &self.items {
            let t_type = &entry.transaction_type();
            table.add_row(Row::new(vec![
                Cell::new(&entry.script),
                Cell::new(
                    &entry
                        .bal_after_trans
                        .separate_by_policy(CURR_FORMAT)
                        .to_string(),
                ),
                Cell::new(&entry.history_desc),
                Cell::new(&entry.transaction_qty.to_string()),
                Cell::new(&t_type).with_style(Attr::ForegroundColor(if t_type == "Removed" {
                    color::RED
                } else {
                    color::GREEN
                })),
                Cell::new(
                    &entry
                        .transaction_date
                        .split("T")
                        .collect::<Vec<&str>>()
                        .get(0)
                        .unwrap(),
                ),
            ]));
        }

        table.printstd();
    }
}
#[derive(Debug, Deserialize, Serialize)]
pub struct Transaction {
    #[serde(rename = "balAfterTrans")]
    pub bal_after_trans: f32,
    #[serde(rename = "creditQty")]
    pub credit_qty: String,
    #[serde(rename = "debitQty")]
    pub debit_qty: String,
    #[serde(rename = "historyDesc")]
    pub history_desc: String,
    pub script: String,
    #[serde(rename = "scriptDesc")]
    pub script_desc: String,
    #[serde(rename = "tranactionQty")]
    pub transaction_qty: f32,
    #[serde(rename = "transCode")]
    pub trans_code: String,
    #[serde(rename = "transactionDate")]
    pub transaction_date: String,
}
impl Transaction {
    pub fn transaction_type(&self) -> String {
        if &self.debit_qty == "-" {
            return "Added".to_string();
        } else {
            return "Removed".to_string();
        }
    }
}
