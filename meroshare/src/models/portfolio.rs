use prettytable::{color, Attr, Cell, Row, Table};
use serde::{Deserialize, Serialize};
use thousands::Separable;

use crate::{currency::CURR_FORMAT, user::User};

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct Portfolio {
    #[serde(rename = "totalItems")]
    pub total_items: f32,
    #[serde(rename = "totalValueOfLastTransPrice")]
    pub total_value_of_last_trans_price: f64,
    #[serde(rename = "totalValueOfPrevClosingPrice")]
    pub total_value_of_prev_closing_price: f64,
    #[serde(rename = "meroShareMyPortfolio")]
    pub items: Vec<PortfolioItem>,
}
impl Portfolio {
    pub fn print_table(&self, user: &User) {
        let mut table = Table::new();
        table.add_row(Row::new(vec![Cell::new(
            format!("Portfolio of {}", user.name).as_str(),
        )
        .with_style(Attr::Bold)
        .with_hspan(5)
        .style_spec("cb")]));
        table.add_row(Row::new(vec![
            Cell::new("Script").with_style(Attr::Bold),
            Cell::new("Current Balance").with_style(Attr::Bold),
            Cell::new("LTP").with_style(Attr::Bold),
            Cell::new("Previous Value").with_style(Attr::Bold),
            Cell::new("Latest Value").with_style(Attr::Bold),
            Cell::new("Profit/Loss").with_style(Attr::Bold),
        ]));

        for item in &self.items {
            let gains = &item.value_of_last_trans_price - &item.value_of_prev_closing_price;
            table.add_row(Row::new(vec![
                Cell::new(&item.script),
                Cell::new(&item.current_balance.to_string()),
                Cell::new(&item.last_transaction_price),
                Cell::new(
                    &item
                        .value_of_prev_closing_price
                        .separate_by_policy(CURR_FORMAT)
                        .to_string(),
                ),
                Cell::new(
                    &item
                        .value_of_last_trans_price
                        .separate_by_policy(CURR_FORMAT)
                        .to_string(),
                ),
                Cell::new(
                    format!("{:.1}", gains.abs())
                        .separate_by_policy(CURR_FORMAT)
                        .as_str(),
                )
                .with_style(Attr::Bold)
                .with_style(Attr::ForegroundColor(if gains > 0.0 {
                    color::GREEN
                } else {
                    color::RED
                })),
            ]));
        }
        let gains = &self.total_value_of_last_trans_price - &self.total_value_of_prev_closing_price;
        table.add_row(Row::new(vec![
            Cell::new(&self.items.len().to_string()).with_style(Attr::Bold),
            Cell::new(
                &self
                    .items
                    .iter()
                    .map(|item| item.current_balance)
                    .sum::<f32>()
                    .to_string(),
            ),
            Cell::new(""),
            Cell::new(
                &self
                    .total_value_of_prev_closing_price
                    .separate_by_policy(CURR_FORMAT)
                    .to_string(),
            )
            .with_style(Attr::Bold),
            Cell::new(
                &self
                    .total_value_of_last_trans_price
                    .separate_by_policy(CURR_FORMAT)
                    .to_string(),
            )
            .with_style(Attr::Bold),
            Cell::new(
                format!("{:.1}", gains.abs())
                    .separate_by_policy(CURR_FORMAT)
                    .as_str(),
            )
            .with_style(Attr::Bold)
            .with_style(Attr::ForegroundColor(if gains > 0.0 {
                color::GREEN
            } else {
                color::RED
            })),
        ]));
        table.printstd();
    }
}

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct PortfolioItem {
    #[serde(rename = "currentBalance")]
    pub current_balance: f32,
    #[serde(rename = "lastTransactionPrice")]
    pub last_transaction_price: String,
    #[serde(rename = "previousClosingPrice")]
    pub previous_closing_price: String,
    pub script: String,
    #[serde(rename = "scriptDesc")]
    pub script_desc: String,
    #[serde(rename = "valueAsOfLastTransactionPrice")]
    pub value_as_of_last_transaction_price: String,
    #[serde(rename = "valueAsOfPreviousClosingPrice")]
    pub value_as_of_previous_closing_price: String,
    #[serde(rename = "valueOfLastTransPrice")]
    pub value_of_last_trans_price: f64,
    #[serde(rename = "valueOfPrevClosingPrice")]
    pub value_of_prev_closing_price: f64,
}
