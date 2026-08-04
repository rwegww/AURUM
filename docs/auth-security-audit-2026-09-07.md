# Rà soát đăng nhập và khôi phục mật khẩu — 06–07/09/2026

Đã sửa mã nguồn web/API/mobile và áp dụng **3 migration bảo mật** lên Supabase project `Doan2026_SG` (`mwtrcaadhnjhrzcrntou`). Database đã được kiểm chứng trực tiếp. Mã web/API trong workspace chưa được triển khai lên website production.

## Vấn đề và cách xử lý

| Vấn đề trước khi sửa | Thay đổi |
| --- | --- |
| Web chưa có chức năng quên/đặt lại mật khẩu | Thêm màn hình khôi phục bằng email và OTP trên web/mobile; liên kết từ trang đăng nhập |
| OTP lưu trong `Map`, mất khi khởi động lại và không đồng bộ giữa các instance | Lưu hash HMAC trong schema riêng `aurum_auth`; hạn 10 phút, tối đa 5 lần thử, chờ 60 giây trước khi gửi lại |
| Có thể thử mật khẩu liên tục | Giới hạn theo IP và tài khoản trong database; không bỏ qua giới hạn nếu database gặp lỗi |
| OTP có thể bị dùng đồng thời trước khi xóa khỏi bộ nhớ | Khóa bản ghi và tiêu thụ mã trong cùng transaction; mã đăng nhập và mã đặt lại mật khẩu có mục đích riêng |
| Cập nhật hồ sơ nhận trường `password` mà không xác minh mật khẩu cũ | Loại trường này khỏi API hồ sơ; endpoint đổi mật khẩu yêu cầu mật khẩu hiện tại |
| Đổi mật khẩu không thu hồi phiên đang hoạt động | Trigger vô hiệu hóa phiên ứng dụng và các mã chưa dùng; API/RLS kiểm tra phiên OAuth tạo trước mốc thu hồi |
| JWT đăng nhập nhanh của email duyệt giáo viên dùng lại được trong 7 ngày | Dừng trao đổi các link cũ; email duyệt mới trỏ tới trang đăng nhập thông thường |
| Liên kết Google tin vào ID/email do client gửi | Xác minh access token bằng Supabase Auth, kiểm tra danh tính Google và email đã xác nhận; ID/email giả không được dùng |
| Tự ghép tài khoản Google với tài khoản mật khẩu chỉ dựa vào email | Yêu cầu đăng nhập tài khoản hiện tại rồi liên kết rõ ràng, tránh tài khoản đăng ký trước giữ quyền truy cập |
| Client có quyền SELECT cột hash mật khẩu trong hồ sơ của mình | Thu hồi quyền đọc hash và trạng thái phiên; backend vẫn giữ quyền cần thiết |
| GET hồ sơ cho phép client ghi lại mã phiên | Xóa thao tác `claim`; mã phiên được server cấp, mobile dùng mã server trả về |
| Web không cập nhật token Express khi Supabase tự refresh | Đồng bộ token theo sự kiện Auth; thao tác chạy ngoài callback lock của SDK |
| API/RLS có thể chấp nhận token cũ sau khi khôi phục | Thêm policy hạn chế trên 25 bảng public; token Realtime mới gắn với phiên nguồn |

Mật khẩu cũ không được đọc hoặc gửi lại. Người dùng chứng minh quyền sở hữu email rồi đặt mật khẩu mới. Tài khoản dùng Google có thể thiết lập mật khẩu **AURUM** bằng luồng này; mật khẩu của tài khoản Google không bị thay đổi.

Mật khẩu mới cần ít nhất 12 ký tự, tối đa 72 byte UTF-8 để tránh bcrypt âm thầm cắt chuỗi. Quy tắc dùng chung cho API, web và mobile; mật khẩu cũ vẫn được xác thực để người dùng có thể chuyển đổi. Bản ghi tài khoản hiện có không bị đổi mật khẩu trong quá trình rà soát.

## API và giới hạn

| Endpoint | Hành vi |
| --- | --- |
| `POST /api/auth/login` | Xác minh mật khẩu, tạo phiên bằng cập nhật có điều kiện để chống đua với thao tác reset |
| `POST /api/auth/request-otp` | Gửi mã đăng nhập; không trả preview email hoặc lỗi SMTP cho client |
| `POST /api/auth/verify-otp` | Tiêu thụ mã và tạo mã phiên nguyên tử |
| `POST /api/auth/forgot-password` | Nhận `{ email }`; phản hồi chung cho tài khoản tồn tại, không tồn tại, bị khóa và đang cooldown |
| `POST /api/auth/reset-password` | Nhận `{ email, otp, newPassword }`; cập nhật mật khẩu và thu hồi phiên/mã trong transaction; không tự đăng nhập |
| `POST /api/auth/change-password` | Cần Bearer token cùng `{ currentPassword, newPassword }` |
| `POST /api/auth/logout` | Thu hồi phiên server; client xóa trạng thái đăng nhập cục bộ |

- Đăng nhập/đổi mật khẩu: 10 yêu cầu cho mỗi định danh và 50 yêu cầu/IP trong 15 phút, theo từng nhóm endpoint.
- Yêu cầu mã: 5 yêu cầu/email và 20 yêu cầu/IP trong một giờ, tách mục đích đăng nhập/khôi phục. Mỗi lần gọi được tính vào giới hạn, kể cả trong cooldown.
- Xác minh mã: 20 yêu cầu/email và 60 yêu cầu/IP trong 15 phút, ngoài giới hạn 5 lần thử của từng mã.
- Thông tin định danh trong khóa rate limit được HMAC; không lưu IP/email dạng rõ trong khóa. OTP chỉ lưu hash có khóa, không có mã rõ.
- Phản hồi yêu cầu mã có khoảng chờ tối thiểu 4 giây để giảm chênh lệch thời gian; gửi mail xác thực có timeout 3 giây. Đây không phải bảo đảm thời gian phản hồi tuyệt đối khi hạ tầng chậm.
- Vercel dùng header IP do nền tảng cung cấp; host khác mặc định dùng địa chỉ kết nối Express, không tin tùy ý `X-Forwarded-For`.

## Migration đã áp dụng

1. [20260906223716_auth_recovery_and_session_hardening.sql](../supabase/migrations/20260906223716_auth_recovery_and_session_hardening.sql): kho OTP/rate limit, RPC, ràng buộc email/Google duy nhất, trigger thu hồi phiên và quyền cột.
2. [20260906224947_enforce_session_revocation_in_data_api.sql](../supabase/migrations/20260906224947_enforce_session_revocation_in_data_api.sql): kiểm tra phiên trong RLS và tương thích token Arena cũ có hạn tối đa 15 phút.
3. [20260907054337_keep_session_policy_helper_private.sql](../supabase/migrations/20260907054337_keep_session_policy_helper_private.sql): chuyển helper RLS vào schema riêng, giữ quyền thực thi cần cho policy và loại khỏi RPC public.

Nội dung các tệp đã được đối chiếu với lịch sử migration remote. [schema.sql](../supabase/schema.sql) phản ánh trạng thái cuối; không cần chạy lại schema hoặc seed lên project đã cập nhật.

## Kiểm chứng

- **152/152 test, 17 tệp đạt**, bao gồm 29 test mới cho khôi phục, thay đổi mật khẩu, liên kết Google, phiên và helper bảo mật.
- Chạy lại test và build web ngày **08/09** đều đạt. ESLint trên `api` và `src`: **0 lỗi, 37 cảnh báo**; `git diff --check` đạt.
- **17 kiểm tra trực tiếp trên Supabase đạt** bằng [verifyAuthSecurity.sql](../scripts/db/verifyAuthSecurity.sql): mã sai/hết hạn/dùng lại, giới hạn thử, reset nguyên tử, phiên OAuth/Realtime, quyền cột, vùng lưu mã riêng và RLS. Toàn bộ dữ liệu thử trong script được ROLLBACK.
- Kiểm tra riêng hai transaction đồng thời dùng cùng OTP: **1 thành công, 1 bị từ chối**. Tài khoản fixture tạm đã được xóa sau kiểm tra; không còn dữ liệu thử.
- Trong đợt kiểm thử 06–07/09, số tài khoản trước và sau đều là **22**. Kiểm tra lại ngày 08/09 ghi nhận **23 tài khoản và 0 tài khoản thử**. Không đổi mật khẩu, gửi email hoặc đăng nhập thay cho tài khoản thật trong quá trình kiểm thử.
- Giao diện web được thao tác qua trình duyệt local với API giả lập: yêu cầu mã, cooldown, mật khẩu yếu, xác nhận không khớp, mã sai và chuyển về `/login?reset=success` đều đúng.
- Build web production đạt. Các tệp mobile/shared đã kiểm tra cú pháp; chưa chạy ứng dụng native hoặc build Expo vì workspace không có bộ dependency mobile đã cài.
- Security Advisor còn cảnh báo cấu hình **Leaked Password Protection** có sẵn từ trước; helper RLS không còn nằm trong nhóm RPC public cho client gọi. Hai thông báo RLS không có policy thuộc bảng nội bộ trong schema riêng; client không có quyền truy cập chúng.

## Phần cần triển khai/xác minh ngoài workspace

- **Deploy mã web/API mới** để các endpoint, kiểm tra liên kết Google và giao diện mới có hiệu lực trên website đang chạy. Workspace không có cấu hình đăng nhập/link project Vercel để thực hiện deploy trong phiên này.
- Kiểm chứng gửi email thật cần cấu hình `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` trên backend. Phiên này không có `.env`/`.env.local`, nên chưa xác nhận SMTP production hoặc thử hộp thư thật.
- Backend cần `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` và `JWT_SECRET`; Realtime cần `SUPABASE_JWT_SECRET`. Không đưa secret/service-role key vào biến `VITE_*` hay bundle mobile.
- Leaked Password Protection của Supabase Auth vẫn cần bật qua Dashboard có phiên đăng nhập. Connector hiện tại không có công cụ sửa cấu hình Auth này. Thiết lập đó bảo vệ mật khẩu do Supabase Auth quản lý; nó không tự áp dụng cho bcrypt trong bảng tài khoản AURUM.

Tham chiếu: [OWASP về khôi phục mật khẩu](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html), [Supabase về phiên và thu hồi](https://supabase.com/docs/guides/auth/sessions), [quyền truy cập cột](https://supabase.com/docs/guides/database/postgres/column-level-security), [header IP của Vercel](https://vercel.com/docs/headers/request-headers#x-vercel-forwarded-for).
