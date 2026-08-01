# Rà soát và sửa phân hệ quản trị — 05/09/2026

## Phạm vi

Rà soát mã nguồn các màn hình quản trị, API liên quan, xác thực/phân quyền, duyệt hai quản trị viên, quản lý bài học/hành trình, người dùng, phản hồi, tải tệp và truy vấn thống kê. Các sửa đổi đã có trong workspace. Phiên rà soát không chủ động tạo commit, đẩy mã hoặc triển khai production; trong lúc kiểm chứng, HEAD đã được cập nhật bên ngoài sang `a33ab26` chứa các sửa đổi.

## Các lỗi đã xử lý

- **Trắng trang Hành trình:** biểu tượng `Map` che khuất constructor `Map` của JavaScript. Đổi tên biểu tượng và thêm test render hồi quy.
- **Sai hoặc mất nội dung bài học:** giữ nguyên mô-đun lý thuyết và video phụ không được chỉnh sửa; đồng bộ `classId`/`gradeLevelId`; nhận cả quiz cũ dạng mảng và quiz chia nhóm.
- **Sai thứ tự hành trình:** lọc riêng bộ sách/khối lớp, chuẩn hóa khi thứ tự cũ bị trùng; chỉ gửi trường thứ tự để không ghi đè nội dung mới ở máy chủ.
- **Duyệt trùng và trạng thái thành công sai:** giành quyền thực thi bằng cập nhật có điều kiện, phân biệt lỗi thao tác với lỗi ghi nhận kết quả; không để lỗi đến muộn ghi đè thành công. Hiển thị rõ yêu cầu đã bắt đầu nhưng chưa chốt kết quả.
- **Quyết định duyệt thiếu thông tin:** có chi tiết nội dung thay đổi đã lọc dữ liệu nhạy cảm, tên người tạo, kết quả và thông báo lỗi; tránh kết quả tải cũ ghi đè tab hiện tại.
- **Danh sách bị cắt và thống kê thiếu:** phân trang bằng con trỏ cho người dùng/phản hồi/yêu cầu duyệt; thống kê học sinh đọc hết các trang, kể cả khi máy chủ giới hạn dưới kích thước yêu cầu.
- **Hồ sơ giáo viên phụ thuộc truy vấn trực tiếp từ trình duyệt:** API trả số liệu lớp và thành viên theo quan hệ dữ liệu; không truy vấn từng lớp riêng từ frontend.
- **Đăng nhập và tài khoản bị khóa:** kiểm tra phiên/vai trò, chặn tài khoản khóa, không tự ghép email OAuth vào tài khoản quản trị/giáo viên; không trả hash mật khẩu hoặc mã phiên trong dữ liệu quản trị.
- **Mật khẩu mặc định OAuth dùng chung:** tài khoản mới dùng giá trị ngẫu nhiên; endpoint mật khẩu từ chối giá trị mặc định cũ cho cả tài khoản đã tồn tại. Không thay đổi bản ghi người dùng thật; đăng nhập Google/email vẫn dùng luồng xác thực tương ứng.
- **UX đăng nhập:** chấp nhận tên đăng nhập lẫn email, không giải mã lỗi URL hai lần, giữ đường dẫn quay lại đúng quyền, sửa liên kết trợ giúp và nhãn truy cập.
- **Upload admin:** chữ ký cấp bởi máy chủ và giới hạn thư mục; kiểm tra MIME/dung lượng/tệp rỗng; sửa vòng đời StrictMode, hủy request và thu hồi preview; chặn lưu khi upload chưa xong.
- **Thông báo và điều hướng:** thay alert bằng thông báo trên trang, có retry/loading/empty state, bảo vệ tài khoản admin khỏi khóa, sửa menu không tồn tại và trạng thái mục đang chọn; bảng và bộ lọc cuộn trong phạm vi màn hình nhỏ.
- **Kiểm tra dữ liệu đầu vào:** xác thực mã bài học, URL, quiz, tài khoản khóa, lớp học, yêu cầu giáo viên trước khi tạo hoặc thực thi yêu cầu duyệt. Email đăng nhập dùng URL môi trường và escape nội dung HTML.

## Kiểm chứng

- Kết quả cuối: **82/82 test đạt**, 10 tệp kiểm thử; `npm test -- --reporter=dot` và `npm run build` thành công.
- Test tự động bao gồm bảo mật API, điều hướng, xử lý dữ liệu bài học/video, tranh chấp duyệt đồng thời, thống kê 1.001 học sinh với giới hạn trang 150 và render ban đầu của tám màn hình admin.
- Kiểm tra UI cục bộ bằng dữ liệu giả lập: dashboard, duyệt thay đổi, hành trình, học liệu, người dùng và hồ sơ giáo viên. Đã thao tác lọc bộ sách, đổi thứ tự và gửi yêu cầu duyệt giả lập.
- Màn hình Hành trình và hồ sơ giáo viên ở chiều rộng 375 px có chiều rộng nội dung bằng chiều rộng viewport.
- Kiểm tra Supabase thật chỉ dùng truy vấn đọc: số học sinh thống kê khớp số bản ghi (19 tại thời điểm kiểm tra).
- Build production chạy thành công. Lint toàn dự án không có lỗi, còn 68 cảnh báo ở các phần ngoài admin; các tệp sửa trong admin/API được kiểm tra riêng không có cảnh báo.

## Giới hạn và bước triển khai còn lại

- Chưa thử thao tác ghi dữ liệu production, gửi email thật, hoặc duyệt bằng hai tài khoản thật. Test các thao tác ghi dùng mock.
- Công cụ trình duyệt không mở được hộp chọn tệp, nên chưa xác minh upload Cloudinary đầu-cuối bằng tệp thật. Kiểm tra phân quyền endpoint chữ ký đã có test tự động.
- Áp dụng `supabase/migrations/20260905_admin_query_indexes.sql` qua quy trình triển khai database. Tệp chỉ thêm năm chỉ mục, chưa được chạy trên database thật.
- Máy chủ cần `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`; thiết lập `PUBLIC_APP_URL` theo môi trường. Không đưa khóa bí mật vào biến `VITE_`.
- Nếu yêu cầu duyệt hiển thị “Chưa chốt kết quả”, kiểm tra dữ liệu nghiệp vụ và log trước khi tạo lại. Không tự động chạy lại một thao tác có thể đã được áp dụng.
- Đây là kết quả rà soát và kiểm chứng trong phạm vi nêu trên, không phải cam kết hệ thống production không còn lỗi.
