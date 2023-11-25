use thousands::{digits, SeparatorPolicy};

pub const CURR_FORMAT: SeparatorPolicy = SeparatorPolicy {
    separator: ",",
    groups: &[3, 2],
    digits: digits::ASCII_DECIMAL,
};
