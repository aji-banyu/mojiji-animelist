const http = require("http");
const assert = require("assert");
const app = require("../src/index");

function doRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) { json = data; }
        resolve({ status: res.statusCode, headers: res.headers, body: json });
      });
    });

    req.on("error", (err) => reject(err));
    if (postData) {
      req.write(typeof postData === "string" ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  const TEST_PORT = 4199;
  const server = app.listen(TEST_PORT, async () => {
    console.log(`\n[TEST] Memulai pengujian unit & integrasi Interaction Service (: ${TEST_PORT})...`);

    try {
      // 1. Health Check
      const r1 = await doRequest({ hostname: "localhost", port: TEST_PORT, path: "/health", method: "GET" });
      assert.strictEqual(r1.status, 200, "Health check status harus 200");
      assert.strictEqual(r1.body.status, "ok", "Status body harus 'ok'");
      console.log("  [PASS] 1. GET /health -> 200 OK");

      // 2. GET Komentar saat belum ada data (200 OK dengan list kosong)
      const r2 = await doRequest({ hostname: "localhost", port: TEST_PORT, path: "/api/comments/anime/9999", method: "GET" });
      assert.strictEqual(r2.status, 200, "Status harus 200");
      assert.strictEqual(r2.body.success, true);
      assert.strictEqual(Array.isArray(r2.body.data.comments), true);
      assert.strictEqual(r2.body.data.pagination.total, 0);
      console.log("  [PASS] 2. GET /api/comments/anime/9999 (Komentar Kosong) -> 200 OK (Empty list & pagination)");

      // 3. GET Komentar dengan mediaType tidak valid
      const r3 = await doRequest({ hostname: "localhost", port: TEST_PORT, path: "/api/comments/novel/20", method: "GET" });
      assert.strictEqual(r3.status, 400, "Status harus 400 jika mediaType bukan anime/manga");
      assert.strictEqual(r3.body.error.code, "VALIDATION_ERROR");
      console.log("  [PASS] 3. GET /api/comments/novel/20 (Invalid mediaType) -> 400 VALIDATION_ERROR");

      // 4. GET Komentar dengan malId tidak valid (negatif)
      const r4 = await doRequest({ hostname: "localhost", port: TEST_PORT, path: "/api/comments/anime/-10", method: "GET" });
      assert.strictEqual(r4.status, 400, "Status harus 400 jika malId negatif");
      assert.strictEqual(r4.body.error.code, "VALIDATION_ERROR");
      console.log("  [PASS] 4. GET /api/comments/anime/-10 (Negative malId) -> 400 VALIDATION_ERROR");

      // 5. POST Komentar Tanpa Login (401 UNAUTHENTICATED)
      const r5 = await doRequest(
        {
          hostname: "localhost",
          port: TEST_PORT,
          path: "/api/comments/anime/20",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        { content: "Komentar tanpa login" }
      );
      assert.strictEqual(r5.status, 401, "Harus mengembalikan 401 jika header auth tidak ada");
      assert.strictEqual(r5.body.error.code, "UNAUTHENTICATED");
      console.log("  [PASS] 5. POST /api/comments/anime/20 (Tanpa Auth) -> 401 UNAUTHENTICATED");

      // 6. POST Komentar Whitespace Only (400 VALIDATION_ERROR)
      const r6 = await doRequest(
        {
          hostname: "localhost",
          port: TEST_PORT,
          path: "/api/comments/anime/20",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "user-uuid-1",
            "x-user-name": "syafii",
          },
        },
        { content: "       " }
      );
      assert.strictEqual(r6.status, 400, "Harus mengembalikan 400 jika konten hanya spasi");
      assert.strictEqual(r6.body.error.code, "VALIDATION_ERROR");
      console.log("  [PASS] 6. POST /api/comments/anime/20 (Whitespace only) -> 400 VALIDATION_ERROR");

      // 7. POST Komentar > 500 Karakter (400 VALIDATION_ERROR)
      const r7 = await doRequest(
        {
          hostname: "localhost",
          port: TEST_PORT,
          path: "/api/comments/anime/20",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "user-uuid-1",
            "x-user-name": "syafii",
          },
        },
        { content: "x".repeat(501) }
      );
      assert.strictEqual(r7.status, 400, "Harus mengembalikan 400 jika konten > 500 karakter");
      assert.strictEqual(r7.body.error.code, "VALIDATION_ERROR");
      console.log("  [PASS] 7. POST /api/comments/anime/20 (Content > 500 chars) -> 400 VALIDATION_ERROR");

      // 8. POST Komentar Berhasil (201 Created)
      const r8 = await doRequest(
        {
          hostname: "localhost",
          port: TEST_PORT,
          path: "/api/comments/anime/20",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "user-uuid-101",
            "x-user-name": "syafii_dev",
          },
        },
        { content: "Pertarungan Naruto vs Sasuke di Lembah Akhir bener-bener legendaris!" }
      );
      assert.strictEqual(r8.status, 201, "Status harus 201 Created");
      assert.strictEqual(r8.body.success, true);
      assert.strictEqual(r8.body.data.mediaType, "anime");
      assert.strictEqual(r8.body.data.malId, 20);
      assert.strictEqual(r8.body.data.content, "Pertarungan Naruto vs Sasuke di Lembah Akhir bener-bener legendaris!");
      console.log("  [PASS] 8. POST /api/comments/anime/20 (Valid & Auth) -> 201 Created (ID:", r8.body.data.id, ")");

      // 9. GET Komentar Setelah Ditambahkan (Harus menemukan komentar yang baru dibuat)
      const r9 = await doRequest({ hostname: "localhost", port: TEST_PORT, path: "/api/comments/anime/20", method: "GET" });
      assert.strictEqual(r9.status, 200, "Status harus 200");
      assert.strictEqual(r9.body.success, true);
      assert.ok(r9.body.data.comments.length >= 1, "Harus ada minimal 1 komentar");
      assert.strictEqual(r9.body.data.comments[0].content, "Pertarungan Naruto vs Sasuke di Lembah Akhir bener-bener legendaris!");
      console.log("  [PASS] 9. GET /api/comments/anime/20 (Baca Komentar Publik) -> 200 OK (Total:", r9.body.data.pagination.total, ")");

      // 10. GET Komentar via Query String (?type=anime&malId=20)
      const r10 = await doRequest({ hostname: "localhost", port: TEST_PORT, path: "/api/comments?type=anime&malId=20", method: "GET" });
      assert.strictEqual(r10.status, 200, "Status harus 200 via query string");
      assert.strictEqual(r10.body.success, true);
      console.log("  [PASS] 10. GET /api/comments?type=anime&malId=20 (Query String) -> 200 OK");

      // 11. GET Komentar dengan Paginasi (?page=1&limit=1)
      const r11 = await doRequest({ hostname: "localhost", port: TEST_PORT, path: "/api/comments/anime/20?page=1&limit=1", method: "GET" });
      assert.strictEqual(r11.status, 200, "Status harus 200");
      assert.strictEqual(r11.body.data.pagination.limit, 1);
      assert.strictEqual(r11.body.data.comments.length, 1);
      console.log("  [PASS] 11. GET /api/comments/anime/20?page=1&limit=1 (Paginasi) -> 200 OK (Limit 1 terpenuhi)");

      // 12. Rate Limiting (Maksimal 5 komentar per menit per user)
      const spamId = "spammer-" + Date.now();
      let rateLimitBlocked = false;
      for (let i = 1; i <= 6; i++) {
        const rSpam = await doRequest(
          {
            hostname: "localhost",
            port: TEST_PORT,
            path: "/api/comments/anime/20",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": spamId,
              "x-user-name": "spammer",
            },
          },
          { content: "Spam ke-" + i }
        );

        if (i === 6) {
          assert.strictEqual(rSpam.status, 429, "Request ke-6 harus di-rate limit (429)");
          assert.strictEqual(rSpam.body.error.code, "RATE_LIMITED");
          rateLimitBlocked = true;
        }
      }
      assert.strictEqual(rateLimitBlocked, true);
      console.log("  [PASS] 12. Anti-Spam Rate Limiter (Request ke-6) -> 429 RATE_LIMITED");

      console.log("\n[SUCCESS] Semua 12 skenario pengujian unit & integrasi (GET & POST) berhasil 100%!\n");
    } catch (err) {
      console.error("\n[FAIL] Pengujian gagal:", err.message);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

runTests();
