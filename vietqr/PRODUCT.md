# VietQR demo

<!-- impeccable:product-schema 1 -->

## Platform
web

## Users
Đã được xác nhận: lập trình viên và cộng đồng đánh giá thư viện Rust + WebAssembly mã nguồn mở; đối tượng phụ là cá nhân và cửa hàng nhỏ muốn tạo nhanh VietQR cho tài khoản của mình.

## Product Purpose
Cho phép tạo QR và kiểm tra/giải mã payload để trải nghiệm thư viện. Đây không phải dịch vụ thanh toán; không thực hiện hay xác nhận giao dịch.

## Positioning
Thư viện Rust `vietqr-core` chạy trong trình duyệt qua `vietqr-wasm`; không gửi dữ liệu nhập đến máy chủ.

## Operating Context
Trang tĩnh trên GitHub Pages dưới `/nguyentamdat/vietqr/`; dùng được trên máy tính và điện thoại, giao diện tiếng Việt, sáng/tối theo thiết bị.

## Capabilities and Constraints
- Danh sách ngân hàng từ `banks()`, tài khoản/thẻ, tên, số tiền tùy chọn, nội dung.
- npm-compatible mặc định và EMVCo strict; bỏ dấu tiếng Việt; giới hạn tên/nội dung 50/25 ký tự.
- QR SVG trong ảnh data URL, payload, sao chép và tải SVG; kiểm tra payload và CRC.
- HTML/CSS/JS thuần, không build, không CDN hay font mạng. WASM giữ nguyên, đường dẫn tương đối.
- CRC đúng không xác minh người nhận hay thanh toán. Strict không phải chứng nhận EMVCo/NAPAS. Danh sách ngân hàng là bản chụp ngoại tuyến.

## Brand Commitments
Community showcase đáng tin cậy của dự án mã nguồn mở; tiếng Việt rõ ràng, không quảng bá quá mức. Giữ liên kết GitHub, crates.io và npm.

## Evidence on Hand
`wasm/`, `../test/vietqr-wasm.test.mjs`, `../assets/vietqr-sample.svg`. Chỉ dùng tài khoản giả `0000000000` để thử; không có bằng chứng chứng nhận hay số liệu người dùng.

## Product Principles
Giữ dữ liệu cục bộ; hiển thị rõ giới hạn; ưu tiên thao tác hoàn chỉnh; không nhầm demo với công cụ xác nhận giao dịch.
