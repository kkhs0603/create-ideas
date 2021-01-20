const admin = require("firebase-admin");
admin.initializeApp();
const functions = require("firebase-functions");
const { default: next } = require("next");
const cors = require("cors");
const express = require("express");
const { fetchUsers } = require("./firestore");

// Declare HTTP Request Function for Next.js App
const app = next({ dev: false, conf: { distDir: ".next" } });
const handle = app.getRequestHandler();
exports.nextApp = functions.https.onRequest((req, res) => {
  console.log("File: " + req.originalUrl);
  return app.prepare().then(() => handle(req, res));
});

// APIのレスポンス用関数
const sendResponse = (response, statusCode, body) => {
  response.send({
    statusCode,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(body),
  });
};

// Declare HTTP Function for API request
const server = express();
server.use(cors({ origin: true }));
// getリクエストを作成。fetchUsers関数の実行結果をレスポンスのbodyとして返す
server.get("/v1/users", async (req, res) =>
  sendResponse(res, 200, await fetchUsers())
);

exports.api = functions.https.onRequest(server);
