# AURUM

Một nền tảng học tập tương tác (front-end + serverless API) được xây dựng bằng Vite, React và Supabase.

README này tóm tắt mục tiêu dự án, cách cài đặt, chạy, đóng góp và thông tin triển khai.

## Tổng quan

- **Mục tiêu:** Cung cấp hệ thống luyện tập, bài giảng và phòng lab ảo cho học sinh/giáo viên.
- **Các phần chính:** giao diện (`src/`), API serverless (`api/` hoặc `netlify/functions/`), scripts hỗ trợ (`scripts/`), cơ sở dữ liệu (`supabase/`).

## Tính năng chính

- Quản lý người dùng (đăng nhập, phân quyền)
- Bài học, bài tập, nhiệm vụ và thảo luận
- Phòng thí nghiệm ảo và mô phỏng
- Hệ thống mission/achievement và streak
- Tích hợp Supabase để lưu trữ và xác thực

## Yêu cầu trước

- Node.js >= 18
- npm hoặc yarn
- Tài khoản Supabase (nếu sử dụng môi trường production hoặc local với Supabase)
- (Tùy chọn) Netlify CLI nếu triển khai trên Netlify Functions

## Cài đặt nhanh (phát triển)

1. Clone repo:

```bash
git clone <repo-url>
cd AURUM
```

2. Cài dependencies:

```bash
npm install
# hoặc
# yarn install
```

3. Tạo file cấu hình môi trường (ví dụ `.env.local`) dựa trên `api/env.js` hoặc hướng dẫn trong repo. Ví dụ biến thường dùng:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (chỉ dùng server)

4. Chạy môi trường phát triển:

```bash
npm run dev
# hoặc nếu frontend/backend tách:
# npm run dev:client
# npm run dev:server
```

Sau khi chạy, mở `http://localhost:5173` (hoặc địa chỉ Vite hiển thị).

## Chạy API (nếu cần)

- Nếu API được triển khai dưới `api/` (serverless), có thể dùng Netlify CLI hoặc môi trường tương tự:

```bash
npx netlify dev
```

- Hoặc chạy file độc lập trong `api/` (nếu có script trong `package.json`):

```bash
npm run start:api
```

## Cấu trúc dự án (tóm tắt)

- `src/` — mã nguồn frontend (React, Vite)
- `api/` — serverless endpoints & middleware
- `scripts/` — các tiện ích cục bộ (migrates, seeds...)
- `supabase/` — file SQL và migration liên quan DB
- `public/` — tài sản tĩnh, curriculum
- `tests/` — test tự động

## Kiểm thử

Chạy tập lệnh kiểm thử (nếu có):

```bash
npm test
# hoặc
# npm run test:unit
```

## Triển khai

- Triển khai frontend: Netlify / Vercel / Surge (build bằng `npm run build`).
- Triển khai API: Netlify Functions / Vercel Serverless / Edge Functions.

Ví dụ build & preview:

```bash
npm run build
npm run preview
```

## Đóng góp

- Fork repo, tạo branch tính năng `feat/my-feature`, làm thay đổi và gửi Pull Request.
- Tuân thủ quy ước code, viết test cho logic quan trọng.
- Mô tả rõ ràng issue/PR: mục tiêu, cách chạy, kết quả mong đợi.

## Bảo mật

- Không đẩy secrets (service role keys, mật khẩu) lên Git.
- Sử dụng biến môi trường trong CI/CD và secret manager của nhà cung cấp.

## Liên hệ

- Người duy trì: (thêm tên/địa chỉ liên hệ hoặc email ở đây)
- Slack/Discord/Teams: (nếu có)

## License

Nêu license của dự án (ví dụ MIT):

```
MIT License
```

---

Nếu bạn muốn, tôi có thể:

- Chỉnh README sang tiếng Anh,
- Thêm phần hướng dẫn triển khai chi tiết cho Netlify/Supabase,
- Hoặc cá nhân hoá lại các lệnh dựa trên `package.json` thực tế.
