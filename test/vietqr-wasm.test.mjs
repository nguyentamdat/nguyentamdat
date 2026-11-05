import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const assets = new URL("../vietqr/wasm/", import.meta.url);
const glue = await readFile(new URL("vietqr_wasm.js", assets), "utf8");
const qr = await import(`data:text/javascript;base64,${Buffer.from(glue).toString("base64")}`);
await qr.default({ module_or_path: await readFile(new URL("vietqr_wasm_bg.wasm", assets)) });
const fixture = { bank_bin: "970436", account: "0000000000", service: "account", amount: 50000, name: "Tên giả", memo: "Đóng tiền ăn" };

test("vietqr/wasm: bank snapshot, both profiles, SVG and parse round-trip", () => {
  assert.ok(JSON.parse(qr.banks()).some(bank => bank.bin === fixture.bank_bin));
  for (const profile of ["npm", "strict"]) {
    const payload = qr.generate(JSON.stringify({ ...fixture, profile }));
    const parsed = JSON.parse(qr.parse(payload));
    assert.equal(parsed.bank_bin, fixture.bank_bin);
    assert.equal(parsed.account, fixture.account);
    assert.equal(parsed.amount, fixture.amount);
    assert.equal(parsed.name, "Ten gia");
    assert.equal(parsed.memo, "Dong tien an");
    assert.match(qr.render_svg(payload), /<svg/);
    const corrupted = payload.slice(0, -1) + (payload.endsWith("0") ? "1" : "0");
    assert.throws(() => qr.parse(corrupted), /InvalidCrc/);
  }
});

test("vietqr/wasm: optional amount, card validation and strict text limit", () => {
  const payload = qr.generate(JSON.stringify({ ...fixture, amount: null }));
  assert.equal(JSON.parse(qr.parse(payload)).amount, null);
  assert.throws(() => qr.generate(JSON.stringify({ ...fixture, amount: 0 })), /InvalidAmount/);
  assert.throws(() => qr.generate(JSON.stringify({ ...fixture, service: "card", account: "NOT-A-CARD" })), /InvalidAccount/);
  assert.throws(() => qr.generate(JSON.stringify({ ...fixture, profile: "strict", memo: "A".repeat(26) })), /InvalidMemo/);
  assert.ok(qr.generate(JSON.stringify({ ...fixture, memo: "A".repeat(26) })));
});

test("assets/vietqr-sample.svg: reproducible fake-account demo", async () => {
  const payload = qr.generate(JSON.stringify({ ...fixture, name: null, memo: "Demo VietQR", profile: "npm" }));
  assert.equal(await readFile(new URL("../assets/vietqr-sample.svg", import.meta.url), "utf8"), qr.render_svg(payload));
});
