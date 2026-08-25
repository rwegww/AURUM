# Rà soát database AURUM — 06/09/2026

> Cập nhật sau rà soát: đã triển khai 3 migration và kiểm chứng trên Supabase. Xem [kết quả đồng bộ](database-sync-2026-09-06.md). Nội dung bên dưới ghi nhận trạng thái trước khi sửa.

**Kết luận tại thời điểm rà soát: database chưa đồng bộ hoàn toàn với mã nguồn hiện tại.** Các migration ngày 05/09 đã được áp dụng, nhưng còn thiếu 3 RPC của bản cập nhật Lab ngày 06/09 và nhiều khóa ngoại chưa có hành vi xóa như schema. Đây là các sai lệch có ảnh hưởng chức năng, dù bộ kiểm thử hiện tại vẫn đạt.

## Phạm vi và cách kiểm chứng

- Mã nguồn: commit `22f9f33`; thay đổi Lab: `1d0eae4`.
- Supabase đang kết nối: `Doan2026_SG`, project `mwtrcaadhnjhrzcrntou`, PostgreSQL 17.6.
- Đối chiếu 25 bảng, 242 cột, 88 constraint, 98 index, 12 hàm nghiệp vụ đang tồn tại, RLS/quyền bảng và cột, trigger, publication Realtime và lịch sử migration.
- Phân tích 193 điểm khởi tạo truy vấn trong mã nguồn web/mobile/API, kiểm tra các tên bảng, cột, quan hệ và tham số RPC xác định được tĩnh. 14 trường hợp payload động được đọc bổ sung; đây không phải kiểm chứng toàn bộ payload có thể có khi chạy.
- Chạy 176 phép kiểm tra đếm bản ghi, quan hệ, NULL và trạng thái dữ liệu trong transaction chỉ đọc; kiểm tra riêng dữ liệu Lab bằng chính bộ chuẩn hóa và bộ lọc trong mã nguồn.
- Chạy bộ kiểm thử hiện có: **15 tệp, 123/123 test đạt**. Các test ghi nghiệp vụ dùng mock, không chứng minh schema thật đã có đủ RPC.
- Không sửa database, không chạy seed, không gửi email, không gọi các RPC ghi. Truy vấn thử quyền `anon` chỉ đếm số câu hỏi/đáp án đọc được.
- Workspace không có `.env`/`.env.local`. Project được nhận diện qua connector cùng các bảng và migration khớp dự án; chưa xác minh cấu hình môi trường triển khai web/mobile có trỏ đến đúng project này hay không.

Tệp [database-audit-2026-09-06.sql](database-audit-2026-09-06.sql) lưu các truy vấn chỉ đọc để kiểm tra lại dữ liệu và các cấu hình trọng yếu. Số liệu là ảnh chụp trong phiên rà soát, không phải số liệu cố định.

## Những phần đã khớp

| Hạng mục | Kết quả |
| --- | --- |
| Bảng/cột | Đủ 25 bảng và 242 cột theo khai báo bảng hiện tại; không thiếu tên bảng/cột |
| Migration trong repository | Đủ 5/5 phiên bản ngày 05/09 trên remote |
| RPC đã tồn tại | Thân 12 hàm khớp mã nguồn sau khi bỏ khác biệt khoảng trắng/comment |
| Index được khai báo rõ trong schema | Có đủ 60/60; cấu trúc tương đương, gồm các index phân trang admin/giáo viên |
| RLS | Bật trên 25/25 bảng |
| Quyền ghi phân hệ giáo viên/học liệu | 7 bảng đã thu hồi INSERT/UPDATE/DELETE của anon và authenticated; service_role còn quyền ghi |
| Quyền cập nhật tài khoản từ client | Chỉ avatar_seed và ke_hoach_hoc; không được tự sửa role, XP, password_hash, trạng thái khóa hoặc session |
| Quyền RPC hiện có | 12/12 hàm nghiệp vụ không cho anon/authenticated thực thi |
| Xóa học liệu | FK phan_hoi_hoc_lieu.hoc_lieu_id đã có ON DELETE CASCADE |
| Dữ liệu theo FK hiện có | Không có bản ghi mồ côi trong 36 quan hệ được kiểm tra; các constraint đều đã validate |
| Trạng thái index | Không có index invalid/chưa ready |
| Realtime Arena | Có phong_dau và nguoi_choi trong publication; cả hai dùng REPLICA IDENTITY FULL |
| Cấu trúc kho Lab | 7 bản ghi inventory và 10 bản ghi crafting_tasks có cấu trúc chính hợp lệ |

Các migration đã xác nhận:

- `20260905152942_teacher_system_hardening`
- `20260905153041_remove_duplicate_teacher_index`
- `20260905160357_cascade_material_feedback_delete`
- `20260905162139_admin_query_indexes`
- `20260905162232_feedback_tab_pagination_indexes`

## 1. Cần ưu tiên: thiếu 3 RPC của Lab

| Hàm thiếu trên remote | Nơi ứng dụng gọi | Hệ quả |
| --- | --- | --- |
| increment_crafting_task_progress(text, text, jsonb, jsonb) | [User.js](../api/_models/User.js), cập nhật/reset nhiệm vụ | Tiến độ nhiệm vụ không được cập nhật qua giao dịch mới |
| claim_crafting_task_reward(text, text, integer, jsonb, integer) | [User.js](../api/_models/User.js), nhận thưởng | Thao tác nhận thưởng không thể hoàn tất qua RPC |
| craft_lab_item(text, text, text, jsonb, integer) | [lab.js](../api/_routes/lab.js), POST /api/lab/craft | Thao tác chế tạo thất bại khi gọi RPC |

Định nghĩa đã có trong [schema.sql](../supabase/schema.sql), bắt đầu ở các dòng 882, 987 và 1139, nhưng không có migration triển khai tương ứng trong repository hoặc remote. Có 11 tên RPC được ứng dụng gọi trực tiếp; remote mới đáp ứng 8 tên trong số đó.

Luồng reset nhiệm vụ khi đọc hồ sơ có fallback để giữ đăng nhập hoạt động. Vì vậy đăng nhập vẫn có thể thành công dù chức năng chế tạo/nhận thưởng chưa hoạt động đúng.

**Hướng xử lý:** tạo migration riêng cho đúng 3 định nghĩa hiện tại, gồm REVOKE quyền thực thi của PUBLIC/anon/authenticated và GRANT cho service_role; kiểm tra schema cache cùng các luồng nhiệm vụ/nhận thưởng/chế tạo sau triển khai.

## 2. Cần ưu tiên: xóa lớp bị chặn bởi khóa ngoại chưa đồng bộ

[API xóa lớp](../api/_routes/classes.js) tại dòng 972 chỉ xóa bản ghi trong `lop`, trông chờ database xóa các bản ghi con theo schema.

Remote đang dùng NO ACTION cho FK từ `thanh_vien_lop`, `bai_dang_lop` và `lich_lop` đến `lop`. Trong khi đó, schema khai báo ON DELETE CASCADE. Đã đếm được **8/9 lớp** có bản ghi con, nên việc xóa các lớp này theo API hiện tại sẽ bị FK chặn. Kết luận dựa trên định nghĩa FK và số bản ghi phụ thuộc, không thực hiện xóa thử.

Tổng cộng có **19 FK khác hành vi xóa**:

| Bảng.cột | Schema mong đợi | Remote |
| --- | --- | --- |
| `phan_hoi.nguoi_dung_id` | SET NULL | NO ACTION |
| `phan_ung.khoi_id` | CASCADE | NO ACTION |
| `cau_hoi_dau.khoi_id` | CASCADE | NO ACTION |
| `phong_dau.chu_phong_id` | CASCADE | NO ACTION |
| `lich_su_dau.nguoi_dung_id` | CASCADE | NO ACTION |
| `lop.khoi_id` | CASCADE | NO ACTION |
| `lop.giao_vien_id` | CASCADE | NO ACTION |
| `thanh_vien_lop.lop_id` | CASCADE | NO ACTION |
| `thanh_vien_lop.hoc_sinh_id` | CASCADE | NO ACTION |
| `bai_dang_lop.lop_id` | CASCADE | NO ACTION |
| `bai_dang_lop.tac_gia_id` | CASCADE | NO ACTION |
| `bai_dang_lop.hoc_sinh_nhan_id` | CASCADE | NO ACTION |
| `bai_nop.hoc_sinh_id` | CASCADE | NO ACTION |
| `lich_lop.lop_id` | CASCADE | NO ACTION |
| `nhiem_vu_nguoi_dung.nguoi_dung_id` | CASCADE | NO ACTION |
| `nhiem_vu_nguoi_dung.nhiem_vu_id` | CASCADE | NO ACTION |
| `thao_luan.nguoi_dung_id` | CASCADE | NO ACTION |
| `thao_luan.cha_id` | CASCADE | NO ACTION |
| `ghi_chu.nguoi_dung_id` | CASCADE | NO ACTION |

Ngoài ra, remote **thiếu 2 FK** của `phan_hoi_hoc_lieu`:

- `nguoi_dung_id → nguoi_dung.id ON DELETE CASCADE`.
- `nguoi_tra_loi_id → nguoi_dung.id ON DELETE SET NULL`.

Bảng phản hồi học liệu hiện rỗng, nên chưa phát sinh dữ liệu mồ côi cho hai quan hệ thiếu này.

**Hướng xử lý:** dùng migration ALTER CONSTRAINT riêng để đưa các quan hệ về hành vi đã thống nhất. Cần ưu tiên các quan hệ chặn xóa lớp. Chạy lại toàn bộ schema không đảm bảo sửa được FK của bảng đã tồn tại vì phần CREATE TABLE IF NOT EXISTS sẽ bỏ qua chúng.

## 3. Quyền Data API chưa bảo vệ đầy đủ các quy tắc nghiệp vụ

Đây là các vấn đề trong thiết kế quyền hiện tại, đồng thời cũng có trong schema; không phải do 5 migration gần đây chưa chạy.

### Tiến độ và kho nguyên liệu vẫn cho client tự ghi

`authenticated` có INSERT/UPDATE trên `tien_do_nguoi_dung`; policy chỉ kiểm tra `nguoi_dung_id = auth.uid()`. Nó cho phép chủ tài khoản thay đổi trực tiếp các dòng `chemical`, `achievement/inventory`, `achievement/crafting_tasks`, bỏ qua API kiểm tra phản ứng, nguyên liệu và phần thưởng.

Có 3 hồ sơ hiện khớp trực tiếp ID của Supabase Auth, nên mô hình quyền này có tài khoản thực tế có thể sử dụng. Chưa thực hiện ghi thử. Việc khóa quyền sửa XP trên `nguoi_dung` không ngăn sửa dữ liệu tiến độ/kho mà API nhận thưởng sử dụng.

**Hướng xử lý:** thu hồi quyền ghi trực tiếp các tiến độ do server quản lý; giữ việc ghi qua Express/service_role, hoặc tách rõ các loại tiến độ được client phép ghi. RLS giới hạn hàng, không tự bảo vệ từng cột hay từng loại nghiệp vụ. [Tài liệu quyền theo cột của Supabase](https://supabase.com/docs/guides/database/postgres/column-level-security).

### Đáp án Arena đang đọc được khi chưa đăng nhập

`cau_hoi_dau` có SELECT cho anon và policy USING(true), bao gồm `dap_an`, `chi_so_dap_an_dung`, `giai_thich`. Truy vấn trong transaction chỉ đọc với `SET LOCAL ROLE anon` xác nhận đọc được **16/16 câu hỏi có trường đáp án**. Người chơi có thể bỏ qua API đã lọc đáp án.

**Hướng xử lý:** chỉ để server đọc bảng chứa đáp án, hoặc cung cấp một giao diện đọc riêng với các trường được phép công khai.

### Phản hồi và yêu cầu duyệt vẫn có đường ghi trực tiếp

- `phan_hoi`: anon có INSERT; policy chấp nhận `nguoi_dung_id IS NULL` và không ràng buộc `type`, `status`, `da_duyet` theo quy trình API. Client có thể gửi giá trị hợp lệ theo CHECK nhưng chưa qua quy trình kiểm duyệt/đăng ký giáo viên.
- `yeu_cau_duyet_admin`: authenticated có INSERT/UPDATE toàn bảng, policy chỉ kiểm tra người hiện tại là admin. Nếu có admin dùng Supabase Auth với ID trùng hồ sơ, họ có thể sửa `approver_ids`/`payload` trực tiếp, trong khi API dựa vào danh sách này để xác nhận đủ hai người duyệt. Hiện chưa có tài khoản admin khớp ID Auth, nên đây là lỗ hổng thiết kế chưa xác nhận có tài khoản khai thác trong dữ liệu hiện tại.

**Hướng xử lý:** để API thực hiện ghi vào hai bảng này, hoặc triển khai policy/constraint thể hiện đầy đủ các quy tắc chuyển trạng thái và duyệt. Kết luận về quyền ghi dựa trên catalog và mã nguồn; không tạo dữ liệu thử.

## 4. Schema và dữ liệu cũ còn lệch

- **71 cột** được khai báo NOT NULL trong schema tạo mới nhưng remote vẫn nullable. Tại thời điểm kiểm tra, hai cột có NULL thực tế trong nhóm này là `bai_hoc.created_at` và `bai_hoc.updated_at`: **129/129 bài học thiếu cả hai giá trị**. Remote cũng không có DEFAULT now() cho hai cột này; model Lesson không tự gán timestamp khi insert/update.
- `bai_hoc.khoi_id` và `bai_hoc.thu_tu` đang là bigint, trong schema là integer. Chưa thấy ảnh hưởng dữ liệu hiện tại.
- **7 tài khoản** có cấp độ khác công thức đang dùng trong API/RPC: `floor(XP / 1000) + 1`. Ví dụ XP 1.620 đang lưu cấp 6, trong khi công thức cho cấp 2; XP 99.000 đang lưu cấp 99 thay vì 100. Chưa tự điều chỉnh vì có thể là dữ liệu seed hoặc mức được gán trước đây.
- **3/318 phản ứng** không qua bộ lọc cấu trúc mới của Lab: `rx_full_283`, `rx_full_310`, `rx_full_318`. API hiện chỉ trả **315 phản ứng**. Bộ lọc kiểm tra cân bằng/khả năng phân tích công thức; kết quả này không đồng nghĩa đã thẩm định tính đúng khoa học của toàn bộ nội dung.
- Danh mục có **180 hóa chất**, không trùng công thức sau chuẩn hóa và không có tham chiếu hóa chất thiếu trong các phản ứng. Tuy nhiên có **1 dòng tiến độ của 1 người dùng** mở khóa `HClO`, chưa có trong danh mục.

**Hướng xử lý:** đồng bộ các ràng buộc và default bằng migration; xử lý timestamp thiếu theo nguồn có thể xác minh, không tự coi ngày sửa là ngày tạo lịch sử. Đối chiếu nguồn seed và dữ liệu biên soạn trước khi chỉnh cấp độ/công thức/tiến độ.

## 5. Trigger thông báo bài nộp đang trỏ đến chức năng không được triển khai

Remote có trigger `aurumhook` AFTER INSERT trên `bai_nop`, gọi Edge Function `send-submission-notification`. Connector liệt kê **0 Edge Function** trong project.

Đường thông báo này chưa có đích triển khai tương ứng; chưa gửi request hoặc nộp bài thật để thử. Đây không phải lỗi mọi thông báo giáo viên, vì API còn tổng hợp thông báo từ dữ liệu bài nộp. Trigger này cũng không nằm trong schema repository.

**Hướng xử lý:** xác nhận còn sử dụng cơ chế webhook này hay không, rồi triển khai chức năng tương ứng hoặc bỏ cấu hình cũ theo thiết kế được chọn.

## 6. Index, cấu hình bảo mật và tài liệu

Supabase Advisors trả về:

- **3 FK chưa có index bao phủ:** `phong_dau.nguoi_thang_id`, `tra_loi_vong.cau_hoi_id`, `tra_loi_vong.nguoi_dung_id`. [Hướng dẫn index FK](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys).
- **1 cặp index trùng** trên `nhiem_vu_nguoi_dung`: `idx_nhiem_vu_nguoi_dung_nguoi_dung_id` và `idx_nhiem_vu_nguoi_dung_user`. [Hướng dẫn xử lý index trùng](https://supabase.com/docs/guides/database/database-linter?lint=0009_duplicate_index).
- **1 cảnh báo nhiều policy SELECT** cho authenticated trên `phong_dau`. Hai policy đang phục vụ phòng chờ công khai và người tham gia; không tự kết luận sai phân quyền. [Tài liệu cảnh báo](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies).
- **40 index chưa có lượt sử dụng** trong thống kê hiện tại. Không coi đây là lý do tự xóa, vì nhiều bảng ít/rỗng hoặc index vừa được thêm. [Tài liệu thống kê index](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).
- **Supabase Auth chưa bật Leaked Password Protection.** Cảnh báo này áp dụng cho Supabase Auth, không thay thế kiểm tra mật khẩu tự quản lý trong bảng nguoi_dung. [Tài liệu Supabase](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

Bucket `clips` đang public, chưa giới hạn kích thước/MIME và có policy upload cho authenticated. Chưa có thông tin đủ để kết luận cấu hình này sai yêu cầu sản phẩm; cần đối chiếu việc bucket còn được sử dụng khi hệ thống đã chuyển nhiều luồng upload sang Cloudinary.

[README](../README.md) và [báo cáo admin cũ](admin-audit-2026-09-05.md) vẫn nhắc tên `20260905_admin_query_indexes.sql` và trạng thái chưa áp dụng. Tên hiện tại là `20260905162139_admin_query_indexes.sql`, đã có trên remote.

## Những dấu hiệu đã kiểm tra lại và không tính là lỗi

- 19 bài học lưu quiz dưới dạng object `level1/level2/level3`, 110 bài lưu array. Bộ chuẩn hóa hiện tại hỗ trợ cả hai.
- 3 announcement có người nhận không phải thành viên học sinh của lớp thực ra là tin học sinh gửi giáo viên phụ trách. Cả 3 đều trỏ đúng giáo viên của lớp.
- 7 tài khoản Auth không có hồ sơ cùng ID nhưng đều có ánh xạ qua liên kết/email. Hệ thống hỗ trợ đăng nhập nội bộ và OAuth, nên không buộc mọi hồ sơ phải trùng ID Auth.
- 3 yêu cầu admin đều pending, chưa hết hạn; chưa có dấu hiệu yêu cầu executed bị thiếu thời điểm kết thúc.
- Không thấy email trùng sau chuyển chữ thường hoặc liên kết Google trùng trong kiểm tra tổng hợp.

## Số bản ghi thực tế

| Bảng | Số bản ghi |
| --- | ---: |
| `bai_dang_lop` | 11 |
| `bai_hoc` | 129 |
| `bai_nop` | 0 |
| `cau_hoi_dau` | 16 |
| `ghi_chu` | 1 |
| `hoa_chat` | 180 |
| `hoat_dong_nguoi_dung` | 39 |
| `hoc_lieu` | 388 |
| `khoi` | 7 |
| `lich_lop` | 1 |
| `lich_su_dau` | 0 |
| `lop` | 9 |
| `nguoi_choi` | 5 |
| `nguoi_dung` | 22 |
| `nhiem_vu` | 14 |
| `nhiem_vu_nguoi_dung` | 15 |
| `phan_hoi` | 15 |
| `phan_hoi_hoc_lieu` | 0 |
| `phan_ung` | 318 |
| `phong_dau` | 2 |
| `thanh_vien_lop` | 6 |
| `thao_luan` | 6 |
| `tien_do_nguoi_dung` | 359 |
| `tra_loi_vong` | 0 |
| `yeu_cau_duyet_admin` | 3 |

## Thứ tự xử lý đề xuất

1. Triển khai 3 RPC Lab và sửa các FK đang chặn xóa lớp.
2. Khóa đường ghi tiến độ/phản hồi/duyệt ngoài API và chặn truy cập đáp án Arena trực tiếp.
3. Đồng bộ các FK, NULL/default còn lệch; xử lý dữ liệu Lab và cấp độ cũ theo nguồn đối chiếu.
4. Xử lý trigger không có đích, index trùng/thiếu, cập nhật tài liệu triển khai.
5. Kiểm tra chức năng trên môi trường thử nghiệm có schema và quyền giống remote: xóa lớp có dữ liệu con, nhận thưởng đồng thời, chế tạo đồng thời, phân quyền Data API và luồng hai admin.

Phiên này hoàn thành việc rà soát và lập bằng chứng; các thay đổi sửa database nêu trên chưa được áp dụng.

