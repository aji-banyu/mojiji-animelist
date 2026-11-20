const http = require("http");
const assert = require("assert");
const app = require("../src/index");

function doRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on("error", (err) => reject(err));
    req.end();
  });
}

async function runTests() {
  const TEST_PORT = 4197;
  const server = app.listen(TEST_PORT, async () => {
    console.log(`\n[TEST] Memulai pengujian unit Notification Service (: ${TEST_PORT})...`);

    try {
      // 1. Health Check
      const r1 = await doRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/health",
        method: "GET",
      });
      assert.strictEqual(r1.status, 200, "Health check status harus 200");
      assert.strictEqual(r1.body.status, "ok", "Status body harus 'ok'");
      assert.strictEqual(r1.body.service, "notification-service", "Service name harus 'notification-service'");
      console.log("  [PASS] 1. GET /health -> 200 OK");

      // 2. 404 Route Check
      const r2 = await doRequest({
        hostname: "localhost",
        port: TEST_PORT,
        path: "/non-existent-route",
        method: "GET",
      });
      assert.strictEqual(r2.status, 404, "Unknown route harus 404");
      assert.strictEqual(r2.body.error.code, "NOT_FOUND");
      console.log("  [PASS] 2. GET /non-existent-route -> 404 NOT_FOUND");

      console.log("\n[SUCCESS] Pengujian Notification Service starter berhasil 100%!\n");
    } catch (err) {
      console.error("\n[FAIL] Pengujian gagal:", err.message);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

runTests();
