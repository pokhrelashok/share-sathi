use reqwest::{
    header::{HeaderMap, HeaderName, HeaderValue},
    Client, Error, Response,
};
use serde_json::Value;
use std::{collections::HashMap, str::FromStr};

#[allow(dead_code)]
pub async fn make_request(
    url: &str,
    method: reqwest::Method,
    body: Option<Value>,
    headers: Option<HashMap<String, String>>,
) -> Result<Response, Error> {
    let client = Client::new();
    let mut request_builder = client.request(method, url);
    let mut headers_map = HeaderMap::new();
    headers_map.insert(
        "Accept",
        HeaderValue::from_static("application/json, text/plain, */*"),
    );
    headers_map.insert(
        "Accept-Encoding",
        HeaderValue::from_static("gzip, deflate, br"),
    );
    headers_map.insert(
        "Accept-Language",
        HeaderValue::from_static("en-US,en;q=0.9"),
    );
    headers_map.insert("Connection", HeaderValue::from_static("keep-alive"));
    headers_map.insert("Host", HeaderValue::from_static("webbackend.cdsc.com.np"));
    headers_map.insert(
        "Origin",
        HeaderValue::from_static("https://meroshare.cdsc.com.np"),
    );
    headers_map.insert(
        "Referer",
        HeaderValue::from_static("https://meroshare.cdsc.com.np/"),
    );
    headers_map.insert("Sec-Fetch-Dest", HeaderValue::from_static("empty"));
    headers_map.insert("Sec-Fetch-Mode", HeaderValue::from_static("cors"));
    headers_map.insert("Sec-Fetch-Site", HeaderValue::from_static("same-site"));
    headers_map.insert("Content-Type", HeaderValue::from_static("application/json"));
    headers_map.insert("User-Agent", HeaderValue::from_static("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36"));
    headers_map.insert("Pragma", HeaderValue::from_static("no-cache"));
    headers_map.insert("Cache-Control", HeaderValue::from_static("no-cache"));

    if let Some(headers) = headers {
        for (key, value) in headers.iter() {
            headers_map.insert(
                HeaderName::from_str(key).unwrap(),
                HeaderValue::from_str(value).unwrap(),
            );
        }
    }

    request_builder = request_builder.headers(headers_map);

    if let Some(body) = body {
        let request = request_builder.json(&body).build()?;
        client.execute(request).await
    } else {
        let request = request_builder.build()?;
        client.execute(request).await
    }
}
