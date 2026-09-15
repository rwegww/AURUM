# Đối chiếu Hành trình giữa ứng dụng và website

Ngày kiểm tra: 28–29/09/2026. Phạm vi là ứng dụng Expo trong `apps/mobile`, lấy giao diện và hành vi website trong cùng repository làm tham chiếu.

## Những phần đã đồng bộ

- Chọn lớp 6–12, ảnh và nội dung giới thiệu, luồng xếp lớp ban đầu, liên kết vào đúng lớp và quay lại màn hình chọn lớp.
- Bản đồ dùng chung tọa độ chặng và đường cong với web; màu từng lớp, font Nunito/Quicksand, nền, bảng tiêu đề, tiến độ, sao, trạng thái khóa và mốc sổ tay.
- Quy tắc mở chặng và chọn vòng tiếp theo nằm trong `shared/journeyProgress.js`; xử lý cả mã lớp dạng số và chuỗi. Chuyển lớp không hiển thị dữ liệu cũ trong lúc tải.
- Video phát trong ứng dụng; nút vào vòng 1 chờ sự kiện phát hết. Bài chưa có video dùng phần giới thiệu mục tiêu và nhiệm vụ tương ứng web.
- Ba vòng học dùng chung bộ câu hỏi chuẩn hóa và cách kiểm tra đáp án. Hỗ trợ trắc nghiệm, chọn ảnh, điền đáp án, sắp xếp, ghép cặp và nhiệm vụ thực hành.
- Chỉ hiển thị nhận sao sau khi lưu thành công; có thử lại khi lỗi mạng. Kết thúc vòng quay về lộ trình để học vòng tiếp theo; đủ ba sao mới mở chặng tiếp.
- Công thức dùng cùng KaTeX với web. Font/CSS công thức nhúng sẵn để WebView native không phụ thuộc CDN; nội dung HTML được escape và KaTeX không cho phép nội dung tin cậy tùy ý.
- Sổ tay dùng chung bìa và URL infographic, tải dữ liệu đầy đủ, lật trang, khóa trang chưa hoàn thành, phóng to ảnh; có tóm tắt từ bài học nếu ảnh lỗi.
- Cây kiến thức dùng chung dữ liệu phân nhánh từ `shared/knowledgeMapData.js`, tiến độ chủ đề, các nhánh lớp/bài/chủ đề và nút mở infographic.
- Bài giảng từ cây kiến thức mở đúng màn hình đọc lại: tiêu đề/nhãn SGK dùng chung, chuyển bài, lý thuyết với Markdown/bảng/công thức, khung ghi nhớ/cảnh báo và video. Có ghi chú riêng từng bài, hỏi đáp, phân trang, thích và trả lời; chỉ báo lưu thành công sau phản hồi máy chủ.
- Sắp xếp và ghép cặp hỗ trợ kéo thanh tay nắm để đổi thứ tự. Các nút lên/xuống vẫn có thể dùng thay cho cử chỉ.
- Workflow Android theo dõi cả thay đổi trong `shared/`.

## Kiểm tra đã chạy

- 63 kiểm thử đạt trong 10 tập tin: journeyLayout, journeyLessonData, journeyParity, mobileMathMarkup, videoLinks, missionModal, studentPlacementRendering, knowledgeMapData, lessonLabels, mobileTheoryMarkup.
- ESLint các tập tin thay đổi và `git diff --check` đạt. Git có cảnh báo tự chuyển LF/CRLF trên Windows, không phải lỗi khoảng trắng.
- Build production website bằng Vite và xuất bundle Expo cho Android, iOS, web.
- Kiểm tra tương tác trên Expo web preview và website với API giả lập cục bộ, cùng hồ sơ/tiến độ; không ghi dữ liệu kiểm thử lên máy chủ thật.
- Bản đồ ở chiều rộng 320, 390 và 768 px không tràn ngang. Cây kiến thức cố ý cuộn ngang bên trong khung, tương tự web.
- Đi hết ba vòng bằng câu hỏi trắc nghiệm, ảnh, điền, sắp xếp và ghép; kiểm tra đáp án sai, lưu lỗi lần đầu rồi thử lại, nhận sao, mở chặng tiếp theo; lật sổ tay và phóng ảnh 150%.
- Kiểm tra chuyển lớp 8 sang 10, trạng thái khóa, bài học vượt và kết quả với phản hồi giả lập. Chưa xác nhận giao dịch xếp lớp với backend thật.
- Video Cloudinary tải được, nút bắt đầu ban đầu bị khóa và mở sau sự kiện kết thúc. Trong kiểm tra trình duyệt có tua gần cuối video; đây không phải lượt xem đầy đủ trên thiết bị native.
- Preview không ghi nhận lỗi JavaScript chưa được xử lý trong các luồng trên.
- Ngày 29/09: xem bài giảng có bảng/công thức, ghi chú lỗi lần đầu rồi thử lưu lại thành công, chuyển bài không lẫn ghi chú, tải thêm thảo luận, thích và trả lời. Đã thao tác kéo thả để sắp xếp và ghép cặp đúng trên preview.

Ảnh kiểm tra cục bộ nằm trong thư mục `artifacts/` (được gitignore), gồm bản đồ các kích thước, chọn lớp, các dạng câu hỏi, lỗi lưu, kết quả, video, công thức, sổ tay và cây kiến thức.

## Giới hạn và khác biệt còn lại

Chưa thể chứng nhận giao diện toàn bộ ứng dụng giống website 100%. Môi trường kiểm tra không có thiết bị/emulator Android và iOS; xuất bundle thành công không tương đương build APK/IPA hoặc kiểm thử native thực tế.

- Thanh điều hướng native, vùng an toàn, điều khiển video và modal khác nền tảng. Cần đối chiếu ảnh Android/iOS thực, cả máy nhỏ, tablet và cỡ chữ hệ thống lớn.
- Sổ tay chuyển trang bằng nút, chưa có hiệu ứng lật trang 3D như web. Cần kiểm tra cử chỉ kéo thả bằng cảm ứng thật; kết quả preview dùng chuột trình duyệt.
- Bài giảng native dùng danh sách chuyển bài cuộn ngang thay cho sidebar cố định 320 px của web để đọc được trên màn hình điện thoại. Video nhúng bên ngoài cần kiểm tra chính sách phát của từng nhà cung cấp trên WebView thiết bị thật.
- Các màn hình ngoài luồng Hành trình (đấu trường, công cụ, hồ sơ, thư viện, lớp học quản lý...) chưa được đối chiếu toàn diện trong đợt này.
- Cần build lại binary native với các module SVG, Video, WebView và kiểm tra tải công thức, phát video, phóng ảnh, bàn phím/scroll và nút quay lại Android trên thiết bị thật.
