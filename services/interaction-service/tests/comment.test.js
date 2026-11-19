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

      // 2. Auth Check (Wajib Login)
      const r2 = await doRequest(
        {
          hostname: "localhost",
          port: TEST_PORT,
          path: "/api/comments/anime/20",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
        { content: "Komentar tanpa login" }
      );
      assert.strictEqual(r2.status, 401, "Harus mengembalikan 401 jika header auth tidak ada");
      assert.strictEqual(r2.body.error.code, "UNAUTHENTICATED");
      console.log("  [PASS] 2. POST /api/comments/:mediaType/:malId (Tanpa Auth) -> 401 UNAUTHENTICATED");

      // 3. Validasi mediaType (Harus anime atau manga)
      const r3 = await doRequest(
        {
          hostname: "localhost",
          port: TEST_PORT,
          path: "/api/comments/novel/20",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "user-uuid-1",
            "x-user-name": "syafii",
          },
        },
        { content: "Komentar valid" }
      );
      assert.strictEqual(r3.status, 400, "Harus mengembalikan 400 jika mediaType bukan anime/manga");
      assert.strictEqual(r3.body.error.code, "VALIDATION_ERROR");
      console.log("  [PASS] 3. POST /api/comments/novel/20 (Invalid mediaType) -> 400 VALIDATION_ERROR");

      // 4. Validasi malId (Harus positif integer)
      const r4 = await doRequest(
        {
          hostname: "localhost",
          port: TEST_PORT,
          path: "/api/comments/anime/-99",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "user-uuid-1",
            "x-user-name": "syafii",
          },
        },
        { content: "Komentar valid" }
      );
      assert.strictEqual(r4.status, 400, "Harus mengembalikan 400 jika malId negatif");
      assert.strictEqual(r4.body.error.code, "VALIDATION_ERROR");
      console.log("  [PASS] 4. POST /api/comments/anime/-99 (Negative malId) -> 400 VALIDATION_ERROR");

      // 5. Validasi Content (Tolak Whitespace Only)
      const r5 = await doRequest(
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
      assert.strictEqual(r5.status, 400, "Harus mengembalikan 400 jika konten hanya spasi");
      assert.strictEqual(r5.body.error.code, "VALIDATION_ERROR");
      console.log("  [PASS] 5. POST /api/comments/anime/20 (Whitespace only) -> 400 VALIDATION_ERROR");

      // 6. Validasi Content (Maksimal 500 Karakter)
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
        { content: "x".repeat(501) }
      );
      assert.strictEqual(r6.status, 400, "Harus mengembalikan 400 jika konten > 500 karakter");
      assert.strictEqual(r6.body.error.code, "VALIDATION_ERROR");
      console.log("  [PASS] 6. POST /api/comments/anime/20 (Content > 500 chars) -> 400 VALIDATION_ERROR");

      // 7. Sukses Tambah Komentar (201 Created)
      const r7 = await doRequest(
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
      assert.strictEqual(r7.status, 201, "Status harus 201 Created");
      assert.strictEqual(r7.body.success, true);
      assert.strictEqual(r7.body.data.mediaType, "anime");
      assert.strictEqual(r7.body.data.malId, 20);
      assert.strictEqual(r7.body.data.content, "Pertarungan Naruto vs Sasuke di Lembah Akhir bener-bener legendaris!");
      assert.ok(r7.body.data.id, "ID komentar harus ada");
      assert.ok(r7.body.data.createdAt, "createdAt harus ada");
      console.log("  [PASS] 7. POST /api/comments/anime/20 (Valid & Auth) -> 201 Created (ID:", r7.body.data.id, ")");

      // 8. Rate Limiting (Maksimal 5 komentar per menit per user)
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
      console.log("  [PASS] 8. Anti-Spam Rate Limiter (Request ke-6) -> 429 RATE_LIMITED");

      console.log("\n[SUCCESS] Semua 8 skenario pengujian unit & integrasi MJ-118 berhasil 100%!\n");
    } catch (err) {
      console.error("\n[FAIL] Pengujian gagal:", err.message);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

runTests();
