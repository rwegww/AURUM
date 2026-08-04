# Kết quả đồng bộ Supabase — 06/09/2026

Đã áp dụng thành công 3 migration lên project **Doan2026_SG** (`mwtrcaadhnjhrzcrntou`) và kiểm chứng lại database thực tế. Các sai lệch cấu trúc và dữ liệu có thể sửa theo mã nguồn hiện tại đã được xử lý.

## Migration đã triển khai

| Phiên bản | Nội dung |
| --- | --- |
| [20260906171402_lab_rpc_and_api_permissions](../supabase/migrations/20260906171402_lab_rpc_and_api_permissions.sql) | Bổ sung RPC Lab, giới hạn quyền client, điều chỉnh policy đọc Arena, gỡ webhook không còn đích xử lý |
| [20260906171421_schema_integrity_alignment](../supabase/migrations/20260906171421_schema_integrity_alignment.sql) | Đồng bộ khóa ngoại, NOT NULL, kiểu dữ liệu, giá trị mặc định và timestamp bài học |
| [20260906171438_legacy_data_and_query_indexes](../supabase/migrations/20260906171438_legacy_data_and_query_indexes.sql) | Sửa cấp độ, bổ sung HClO, cân bằng phản ứng NH₃ và hoàn thiện index |

Tên và phiên bản trên đã được đối chiếu với lịch sử migration của Supabase. [schema.sql](../supabase/schema.sql) cũng được cập nhật để phản ánh cấu trúc sau triển khai.

## Những thay đổi đã thực hiện

| Hạng mục | Trước | Sau |
| --- | --- | --- |
| RPC Lab | Thiếu 3 hàm được API sử dụng | Đủ hàm tăng tiến độ, nhận thưởng và chế tạo; chỉ `service_role` được thực thi |
| Khóa ngoại | 19 hành vi xóa khác schema, thiếu 2 quan hệ phản hồi–người dùng | Đủ 38 FK, hành vi xóa khớp schema |
| Ràng buộc cột | Thiếu 71 khai báo NOT NULL | Đã bổ sung sau khi kiểm tra dữ liệu hiện có |
| Kiểu cột bài học | `khoi_id`, `thu_tu` là bigint | Đồng bộ về integer, dữ liệu nằm trong giới hạn |
| Timestamp bài học | 129 bài thiếu cả hai timestamp | Không còn NULL; có mặc định và trigger cập nhật `updated_at` |
| Cấp độ | 7 tài khoản lệch công thức hiện tại | Khớp `floor(XP / 1000) + 1`, giữ nguyên XP |
| Hóa chất | Có lượt mở khóa HClO nhưng thiếu danh mục | Bổ sung HClO từ dữ liệu biên soạn; tổng 181 hóa chất |
| Phản ứng NH₃ | Hệ số NH₃ bằng 1 | Sửa thành `2NH₃ + H₂SO₄ → (NH₄)₂SO₄` |
| Index | Thiếu index cho một số FK, có index trùng | Thêm 4 index, bỏ 1 index trùng |

Đã thu hồi quyền ghi trực tiếp của client đối với tiến độ, phản hồi, yêu cầu duyệt admin và dữ liệu Arena được API quản lý. Client không còn đọc trực tiếp bảng chứa đáp án Arena; backend vẫn có quyền xử lý. Quyền đọc phòng chờ được giữ lại theo từng vai trò. Trigger `aurumhook` trên bài nộp đã được gỡ vì trỏ tới Edge Function không tồn tại.

**Lưu ý về lịch sử bài học:** timestamp được điền cho 129 bài là thời điểm chuẩn hóa dữ liệu khi không còn giá trị cũ để kế thừa. Đây không phải ngày tạo/cập nhật lịch sử đã được khôi phục. Migration và comment trên cột ghi rõ điều này.

Số bản ghi nghiệp vụ trước/sau được giữ nguyên, ngoại trừ danh mục hóa chất tăng từ 180 lên 181. Các trường sẽ sửa và metadata trước triển khai được lưu cục bộ trong `.cache/db-sync-20260906/`, được Git bỏ qua; đây là ảnh chụp phục vụ đối chiếu các thay đổi, không phải bản sao lưu toàn bộ database.

## Kết quả kiểm chứng

- **176 phép kiểm tra dữ liệu:** không còn báo sai lệch trong các điều kiện đã kiểm tra, bao gồm NULL, quan hệ và trạng thái dữ liệu. Các phép đếm dùng để đối chiếu quy mô bảng.
- **18/18 kiểm tra trực tiếp trên Supabase đạt:** tiến độ và chống cộng trùng; thưởng, kho và XP; chế tạo; từ chối thao tác trùng/thiếu nguyên liệu; cascade xóa lớp/học liệu; timestamp; quyền client và quyền đọc phòng chờ.
- Bộ kiểm tra trực tiếp dùng dữ liệu thử trong transaction rồi **ROLLBACK**; đã xác nhận không còn tài khoản thử. Không gửi thông báo và không sử dụng tài khoản/bài nộp thật.
- Đối chiếu 25 bảng, 242 cột, 38 FK, 16 định nghĩa hàm và 64 index được khai báo rõ trong schema: không còn sai lệch về tên/kiểu cột, NOT NULL, hành vi FK, thân hàm hay index bị thiếu.
- **123/123 test trong 15 tệp đạt** khi chạy lại bộ kiểm thử hiện có.
- Dùng chính bộ chuẩn hóa và bộ lọc Lab: 181 hóa chất duy nhất, 316/318 phản ứng sử dụng được, không còn công thức đã mở khóa bị thiếu khỏi danh mục.
- Performance Advisor không còn cảnh báo thiếu index FK, index trùng hoặc policy permissive chồng nhau. Còn 39 thông báo `unused_index` mức INFO; chưa đủ bằng chứng tải thực tế để xóa các index này.

Truy vấn có thể chạy lại: [kiểm tra chỉ đọc](database-audit-2026-09-06.sql) và [kiểm tra chức năng có ROLLBACK](../scripts/db/verifyDatabaseSync.sql). Những kiểm tra này không thay thế kiểm thử toàn bộ giao diện bằng tài khoản triển khai thật.

## Phần còn giới hạn

- Hai phản ứng `rx_full_310`, `rx_full_318` dùng polymer/phức tinh bột chưa được engine hỗ trợ. Nội dung được giữ nguyên và bộ lọc Lab tiếp tục loại chúng; không tự sửa nội dung hóa học để vượt bộ lọc.
- Security Advisor còn cảnh báo **Leaked Password Protection** chưa bật. Đây là cấu hình Supabase Auth; Dashboard đang yêu cầu đăng nhập và connector hiện tại không có công cụ chỉnh cấu hình này nên chưa thay đổi được.
- Hai thông báo `rls_enabled_no_policy` mức INFO thuộc bảng chỉ cho backend truy cập (`cau_hoi_dau`, `phan_hoi`); đây là trạng thái có chủ đích sau khi thu hồi quyền client.
- Không thay đổi cấu hình bucket `clips` khi chưa có căn cứ rằng cấu hình hiện tại sai. Workspace không có `.env`/`.env.local`, nên chưa xác minh môi trường web/mobile đang triển khai có trỏ đúng project này hay không.

[Báo cáo rà soát ban đầu](database-audit-2026-09-06.md) được giữ lại làm lịch sử trước khi sửa. Khi triển khai các thay đổi này sang môi trường khác, dùng các migration theo thứ tự và kiểm tra dữ liệu của môi trường đích trước khi áp dụng.
