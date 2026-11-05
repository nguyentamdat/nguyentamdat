import init, { banks, generate, parse, render_svg } from "./wasm/vietqr_wasm.js";

const $ = (id) => document.getElementById(id);
let ready = false;

function validationMessage(error) {
  const message = String(error);
  const errors = {
    InvalidBin: "Mã ngân hàng phải gồm 6 chữ số.",
    InvalidAccount: "Tài khoản cần 1–50 ký tự chữ/số; số thẻ chỉ gồm 1–19 chữ số.",
    InvalidAmount: "Số tiền phải là số nguyên từ 1 đến 9.999.999.999.999 VND.",
    InvalidName: "Tên không hợp lệ: tối đa 50 ký tự (npm) hoặc 25 (strict), chỉ ký tự ASCII hợp lệ sau khi bỏ dấu.",
    InvalidMemo: "Nội dung không hợp lệ: tối đa 50 ký tự (npm) hoặc 25 (strict), chỉ chữ/số, dấu cách và -.,_@/(): sau khi bỏ dấu.",
    PayloadTooLong: "Payload quá dài (tối đa 512 byte).",
    InvalidCrc: "CRC không hợp lệ. Payload có thể đã bị thay đổi.",
  };
  return Object.entries(errors).find(([code]) => message.includes(code))?.[1]
    ?? "Không xử lý được dữ liệu. Hãy kiểm tra định dạng VietQR.";
}

try {
  await init({ module_or_path: "./wasm/vietqr_wasm_bg.wasm" });
  for (const bank of JSON.parse(banks())) {
    $("bank").add(new Option(`${bank.code} · ${bank.bin} · ${bank.name}`, bank.bin));
  }
  ready = true;
  for (const id of ["bank", "generate-button", "check-button"]) $(id).disabled = false;
  $("load-status").textContent = "WASM đã sẵn sàng · xử lý cục bộ";
} catch {
  $("load-status").textContent = "Không tải được WASM. Hãy tải lại trang và kiểm tra kết nối.";
}

$("generate-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!ready) return;
  $("generation-error").textContent = "";
  $("result").hidden = true;
  $("copy-status").textContent = "";
  const data = new FormData(event.currentTarget);
  const amount = data.get("amount").trim();
  try {
    if (amount && (!/^\d+$/.test(amount) || !Number.isSafeInteger(Number(amount)))) {
      throw new Error("InvalidAmount");
    }
    const payload = generate(JSON.stringify({
      bank_bin: data.get("bank"),
      account: data.get("account").trim(),
      service: data.get("service"),
      name: data.get("name").trim() || null,
      amount: amount ? Number(amount) : null,
      memo: data.get("memo").trim() || null,
      profile: data.get("profile"),
    }));
    const image = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(render_svg(payload))}`;
    $("qr-image").src = image;
    $("download").href = image;
    $("generated-payload").value = payload;
    $("result").hidden = false;
  } catch (error) {
    $("generation-error").textContent = validationMessage(error);
  }
});

$("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("generated-payload").value);
    $("copy-status").textContent = "Đã sao chép payload.";
  } catch {
    $("copy-status").textContent = "Không sao chép được. Hãy chọn và sao chép payload bên trên.";
  }
});

$("check-payload").addEventListener("input", () => {
  $("checked-result").hidden = true;
  $("check-error").textContent = "";
});

$("check-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!ready) return;
  $("checked-result").hidden = true;
  $("check-error").textContent = "";
  const payload = $("check-payload").value.trim();
  if (!payload) {
    $("check-error").textContent = "Vui lòng dán payload VietQR cần kiểm tra.";
    return;
  }
  try {
    const parsed = JSON.parse(parse(payload));
    $("parsed-fields").replaceChildren();
    for (const [label, value] of Object.entries({
      "Mã ngân hàng": parsed.bank_bin,
      "Số tài khoản / thẻ": parsed.account,
      "Loại": parsed.service === "card" ? "Thẻ" : "Tài khoản",
      "Số tiền VND": parsed.amount?.toLocaleString("vi-VN"),
      "Tên": parsed.name,
      "Nội dung": parsed.memo,
    })) {
      const field = document.createElement("div");
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = label;
      description.textContent = value ?? "Không có";
      field.append(term, description);
      $("parsed-fields").append(field);
    }
    $("checked-result").hidden = false;
  } catch (error) {
    $("check-error").textContent = validationMessage(error);
  }
});
