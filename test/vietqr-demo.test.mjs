import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const source = await readFile(new URL("../vietqr/app.js", import.meta.url), "utf8");
const html = await readFile(new URL("../vietqr/index.html", import.meta.url), "utf8");
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function demo({ failInit = false, failGenerate = false } = {}) {
  const elements = new Map();
  const element = () => ({
    hidden: false, disabled: true, value: "", textContent: "", dataset: {}, children: [], handlers: {},
    addEventListener(type, handler) { this.handlers[type] = handler; },
    add(option) { this.children.push(option); },
    append(child) { this.children.push(child); },
    replaceChildren() { this.children = []; },
    focus() { this.focused = true; },
    scrollIntoView() { this.scrolled = true; },
  });
  const document = {
    getElementById(id) {
      assert.ok(html.includes(`id="${id}"`), `Missing UI element ${id}`);
      if (!elements.has(id)) elements.set(id, element());
      return elements.get(id);
    },
    createElement: element,
  };
  const values = { bank: "970436", account: "0000000000", service: "account", name: "", amount: "50000", memo: "", profile: "npm" };
  let generated;
  await new AsyncFunction("document", "init", "banks", "generate", "parse", "render_svg", "Option", "FormData", "navigator", source.replace(/^import .*;\n/, ""))(
    document,
    async () => { if (failInit) throw new Error("offline"); },
    () => JSON.stringify([{ code: "VCB", bin: "970436", name: "Vietcombank" }]),
    (input) => { if (failGenerate) throw new Error("InvalidMemo"); generated = JSON.parse(input); return "fixture-payload"; },
    () => JSON.stringify({ bank_bin: "970436", account: "0000000000", service: "account", amount: 50000 }),
    () => '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    class { constructor(text, value) { this.text = text; this.value = value; } },
    class { get(key) { return values[key]; } },
    { clipboard: { writeText: async () => { throw new Error("permission denied"); } } },
  );
  const get = document.getElementById;
  return { get, generated: () => generated, submit: () => get("generate-form").handlers.submit({ preventDefault() {}, currentTarget: {} }) };
}

test("vietqr/app.js: local SVG result and checker handoff reset old feedback", async () => {
  const ui = await demo();
  assert.equal(ui.get("load-status").dataset.state, "ready");
  assert.equal(ui.get("generate-button").disabled, false);
  ui.submit();
  assert.equal(ui.generated().amount, 50000);
  assert.equal(ui.generated().account, "0000000000");
  assert.match(ui.get("qr-image").src, /^data:image\/svg\+xml/);
  assert.equal(ui.get("download").href, ui.get("qr-image").src);
  assert.equal(ui.get("result").hidden, false);
  assert.equal(ui.get("empty-result").hidden, true);
  ui.get("check-error").textContent = "old error";
  ui.get("use-payload").handlers.click();
  assert.equal(ui.get("check-payload").value, "fixture-payload");
  assert.equal(ui.get("checked-result").hidden, true);
  assert.equal(ui.get("check-error").textContent, "");
  assert.equal(ui.get("check-payload").focused, true);
  await ui.get("copy").handlers.click();
  assert.match(ui.get("copy-status").textContent, /Hãy chọn và sao chép/);
});

test("vietqr/app.js: invalid generation restores empty state and focuses error", async () => {
  const ui = await demo({ failGenerate: true });
  ui.submit();
  assert.equal(ui.get("result").hidden, true);
  assert.equal(ui.get("empty-result").hidden, false);
  assert.match(ui.get("generation-error").textContent, /Nội dung không hợp lệ/);
  assert.equal(ui.get("generation-error").focused, true);
});

test("vietqr/app.js: WASM failure keeps actions disabled and explains recovery", async () => {
  const ui = await demo({ failInit: true });
  assert.equal(ui.get("load-status").dataset.state, "error");
  assert.match(ui.get("load-status").textContent, /Hãy tải lại trang/);
  assert.equal(ui.get("generate-button").disabled, true);
});
