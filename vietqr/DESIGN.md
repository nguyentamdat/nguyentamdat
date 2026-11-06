---
name: VietQR demo
description: Không gian thử nghiệm thư viện Rust + WebAssembly cho cộng đồng
colors:
  action-lime: "#d8f36a"
  action-hover: "#c5e747"
  forest-ink: "#163c32"
  page: "#f7f9f6"
  panel: "#ffffff"
  preview-mint: "#e7efe5"
  field: "#fcfdfb"
  muted: "#52675f"
  border: "#becdc3"
  control-border: "#7b9385"
  dark-control-border: "#64816c"
  focus: "#286750"
  error: "#a62c26"
  error-bg: "#fff0eb"
  success: "#206342"
  dark-page: "#101e19"
  dark-panel: "#182a22"
  dark-preview: "#21392c"
  dark-text: "#e2ece2"
  dark-muted: "#a3b6a9"
  dark-border: "#4a6052"
  dark-field: "#14251c"
  dark-focus: "#b9da9a"
  dark-error: "#ffb4a4"
  dark-error-bg: "#3c2620"
  dark-success: "#b8dba3"
typography:
  display:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "clamp(2rem, 4.1vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "clamp(1.5rem, 2.2vw, 1.9rem)"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Be Vietnam Pro, sans-serif"
    fontSize: "14px"
    fontWeight: 600
  payload:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.8
rounded:
  control: "7px"
  workbench: "16px"
  mobile-workbench: "12px"
  qr-sheet: "3px"
spacing:
  small: "8px"
  medium: "16px"
  large: "24px"
  panel: "32px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.action-lime}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-secondary:
    backgroundColor: "{colors.forest-ink}"
    textColor: "{colors.panel}"
    rounded: "{rounded.control}"
    padding: "12px 18px"
---

# Design System: VietQR demo

## Overview
**Creative North Star: "Community open-studio workbench"**

Một giao diện thao tác yên tĩnh để cộng đồng khám phá thư viện. Mực xanh rừng tạo cảm giác chắc chắn; các vùng mint phân biệt đầu vào và đầu ra, không giả lập ứng dụng ngân hàng. Lime dành cho hành động tạo QR.

Thiết kế ưu tiên sử dụng ban ngày trên điện thoại hoặc laptop; theme tối theo thiết bị phục vụ môi trường ít sáng. Không thêm công tắc theme hay lưu dữ liệu nhập. Đây là quyết định thiết kế đã được supervisor ủy quyền.

**Key Characteristics:**
- Không gian làm việc chia vùng thay vì nhiều thẻ lồng nhau.
- QR đen trên trắng nguyên bản, không tint theo theme.
- Nhãn tiếng Việt rõ ràng và trạng thái có nội dung chữ.

## Colors
Palette restrained: forest ink, nền trung tính xanh nhẹ và một accent lime. Theme tối đổi nền, chữ và màu ngữ nghĩa; lime giữ nguyên. Giá trị chuẩn nằm ở frontmatter và biến trong `style.css`.

**The QR Contrast Rule.** Tờ QR luôn trắng; không áp filter hoặc blend lên SVG.

## Typography
Be Vietnam Pro Regular/SemiBold tự host từ Google Fonts, giấy phép OFL ở `fonts/OFL.txt`; không gọi dịch vụ font ngoài. Heading 600, body 400. H1 desktop dùng display clamp, mobile `clamp(1.8rem, 7.4vw, 2.7rem)`; h3 24px. Control 16px; nhãn 14px; trợ giúp/meta tối thiểu 12px. Mono chỉ dùng cho payload; số tiền kết quả dùng tabular numerals.

## Layout
Container tối đa 1184px, lề 32px desktop / 20px dưới 1000px. Workbench chia 1.35fr/1fr; padding 32px. Form grid hai cột, gap 19px/16px, chuyển một cột dưới 1000px. Dưới 720px, tất cả vùng chính xếp dọc; padding form 24px/20px, button tạo full-width. Checker và disclaimer có cấu trúc mở, không thêm card. Khoảng cách section 64px desktop, 40px mobile. `min-width: 0` cho grid children; payload và trường parse wrap, không ép chiều rộng trang.

## Elevation & Depth
Phân lớp bằng nền và đường viền 1px, không có halo. Chỉ tờ QR có bóng ambient `0 8px 26px #163c3210`. Không dùng bóng cho form hay checker.

## Shapes
Control radius 7px; workbench 16px desktop / 12px mobile; tờ QR 3px. Border nhạt nhưng trường nhập có nền riêng. Icon nhận diện là SVG tự vẽ, không phải mã QR để quét.

## Components
- **Buttons:** min-height 48px, primary lime/ink; secondary đảo màu text/panel theo theme; disabled opacity .5; focus outline 3px, offset 4px. Text actions min-height 44px và underline.
- **Fields:** input/select 48px, padding 11px/12px; textarea mono, resize dọc. Lỗi có chữ, nền và border ngữ nghĩa; focus chuyển tới lỗi khi tạo thất bại. Viền control tương phản 3.24:1 ở theme sáng, 3.74:1 ở theme tối với nền trường.
- **Navigation:** link tới hai công cụ, mã nguồn desktop; mobile vẫn có GitHub ở footer. Skip link đầu trang dành cho bàn phím.
- **Preview:** mẫu dùng tài khoản giả, ghi rõ minh họa. Thành công thay bằng SVG data URL, tải SVG, copy payload và handoff tới checker. Chuyển trạng thái reveal 400ms ease-out, tắt bằng prefers-reduced-motion. Cuộn đến kết quả không smooth để tránh mục tiêu dịch chuyển khi thao tác.
- **Checker:** CRC hợp lệ có giải thích phạm vi, kết quả dl hai cột; dữ liệu dùng textContent, không innerHTML. Nhập lại payload xóa trạng thái cũ.

## Do's and Don'ts
- **Do** giữ QR trắng/đen và cảnh báo không xác nhận thanh toán.
- **Do** kiểm tra 360px, 390px, desktop và cả hai theme khi thay đổi layout.
- **Do** dùng focus rõ, control 16px và meta tối thiểu 12px.
- **Don't** dùng màu success thay cho bằng chứng giao dịch.
- **Don't** thêm font mạng, API hay telemetry cho demo.
- **Don't** biến monospace thành phong cách trang trí cho toàn bộ giao diện.
