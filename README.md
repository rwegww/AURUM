# AURUM - Nền Tảng Học Tập & Thực Hành Hóa Học Trực Quan

AURUM là hệ thống quản lý học tập (LMS) và nền tảng thực hành Hóa học tương tác thế hệ mới dành cho học sinh từ **Lớp 6 đến Lớp 12**, giáo viên và quản trị viên. Hệ thống kết hợp mô phỏng thí nghiệm trực quan sinh động, đấu trường học tập thời gian thực (Real-time Arena), cơ chế trò chơi hóa (Gamification) và Trợ lý Aurum nhằm mang lại trải nghiệm tiếp thu kiến thức khoa học trực quan, an toàn và hấp dẫn.

---

## 1. Tổng Quan Hệ Thống

AURUM được thiết kế với 3 phân quyền người dùng chuyên biệt, tối ưu theo từng mục tiêu giáo dục:

*   **Học sinh (Student):**
    *   **Hành trình bài học (Grade Journey):** Lộ trình học tập chuẩn hóa từ Lớp 6 đến Lớp 12. Mỗi bài học được cấu trúc theo 5 giai đoạn sư phạm tương tác:
        1. *Khởi động (Intro)*: Giới thiệu mục tiêu và khái niệm cốt lõi.
        2. *Khám phá (Story)*: Tiếp cận kiến thức qua ngữ cảnh thực tế và video minh họa.
        3. *Thử thách (Challenge)*: Tương tác trực tiếp, thao tác mô hình và giải quyết tình huống hóa học.
        4. *Luyện tập (Quiz)*: Đánh giá kiến thức nhanh và tích lũy điểm kinh nghiệm (XP).
        5. *Thành tựu (Reward)*: Nhận thưởng nguyên tố, mở khóa chặng kế tiếp và tăng streak học tập.
    *   **Phòng thực hành ảo (Virtual Lab):**
        *   *Lab Simulator*: Tương tác với dụng cụ thí nghiệm, hóa chất, quan sát biến đổi hiện tượng (đổi màu, kết tủa, khí thoát ra).
        *   *Mô hình phân tử (Molecule Viewer)*: Khám phá không gian cấu trúc nguyên tử, liên kết phân tử và quay góc nhìn trực quan.
        *   *Điều chế hợp chất (Crafting Hub)*: Kết hợp các chất và nguyên tố đã mở khóa để tạo ra hợp chất mới.
        *   *Cân bằng phương trình (Equation Balancer)*: Hỗ trợ cân bằng phản ứng hóa học từ cơ bản đến phức tạp.
        *   *Sổ tay khám phá (Discovery Journal)*: Lưu trữ danh mục chất đã mở khóa, tích hợp dạng modal linh hoạt.
        *   *Bảng tuần hoàn (Periodic Table)*: Tra cứu chi tiết thông số các nguyên tố hóa học.
    *   **Đấu trường hóa học (Arena PK):**
        *   Thi đấu tương tác thời gian thực với các chế độ: Solo 1vs1, Tổ đội 3vs3, 5vs5 và Sinh tồn Battle Royale (1vs100).
        *   Tùy biến nhân vật, màu đại diện (aura) và danh hiệu học viên.
        *   Chấm điểm thời gian thực dựa trên độ chính xác, tốc độ và chuỗi đúng (combo streak).
    *   **Trò chơi hóa & Nhiệm vụ học tập (Gamification):**
        *   Hệ thống cấp độ (Level), điểm kinh nghiệm (XP), chuỗi ngày học tập liên tục (Streak).
        *   Nhiệm vụ hàng ngày tự động ưu tiên các nhiệm vụ đủ điều kiện nhận thưởng lên đầu.
        *   Bảng xếp hạng (Leaderboard) vinh danh học viên xuất sắc.
    *   **Trợ lý Aurum & Hộp phản hồi (Floating Widget):** Luôn hiển thị góc màn hình, nhắc nhở nhiệm vụ học tập, hỗ trợ gửi góp ý/báo lỗi kèm chụp và dán trực tiếp ảnh màn hình từ clipboard (`Ctrl+V`).

*   **Giáo viên (Teacher Portal):**
    *   Giao diện thiết kế hiện đại theo chuẩn EduPro.
    *   Quản lý danh sách lớp học, cấp mã tham gia và duyệt học viên.
    *   Tạo và giao bài tập (Assignments), tiếp nhận bài nộp và chấm điểm trực tuyến.
    *   Quản lý lịch học của từng lớp và chia sẻ tài liệu vào kho học liệu giáo viên.
    *   Hỗ trợ bộ lọc và sắp xếp nâng cao trên từng cột dữ liệu.

*   **Quản trị viên (Admin Portal):**
    *   Dashboard quản trị tổng quan toàn diện hệ thống: tiến độ học viên, lượng bài học, yêu cầu xét duyệt.
    *   Quản lý bài học và video minh họa theo từng khối lớp.
    *   Quản lý người dùng: tìm kiếm, phân quyền, khóa/mở khóa tài khoản, liên kết tài khoản Google OAuth.
    *   Cơ chế phê duyệt hai bước (Two-Admin Verification) cho các thao tác quản trị trọng yếu.
    *   Xử lý phản hồi, báo lỗi và đề xuất từ học sinh và giáo viên.

---

## 2. Kiến Trúc Hệ Thống (System Architecture)

```mermaid
graph TD
    subgraph Client_Layer ["Client Layer (Giao diện người dùng)"]
        SPA["React SPA (React 19, Vite 8, Tailwind CSS v4)"]
        Motion["Motion System (Framer Motion 12)"]
        I18n["Đa ngôn ngữ (i18next - Tiếng Việt & Tiếng Anh)"]
        SPA --> Motion
        SPA --> I18n
    end

    subgraph API_Layer ["API Layer (Express 4 Serverless)"]
        Express["Express API Server (/api)"]
        AuthGuard["Auth Guard (JWT, Dual-Login Prevention)"]
        DocService["Document Analysis Service (Lazy-loaded)"]
        Express --> AuthGuard
        Express --> DocService
    end

    subgraph Data_Storage ["Cơ sở dữ liệu & Dịch vụ ngoài"]
        Supabase["Supabase PostgreSQL (Database, RLS & Realtime)"]
        Cloudinary["Cloudinary (Lưu trữ ảnh & video tài nguyên)"]
        SMTP["SMTP Mail Service (Xác thực & khôi phục mật khẩu)"]
    end

    SPA -->|HTTPS / REST API| Express
    SPA -->|Realtime Channels (Arena PK)| Supabase
    AuthGuard -->|Kiểm tra phiên & quyền hạn| Supabase
    Express -->|CRUD dữ liệu nghiệp vụ| Supabase
    Express -->|Chữ ký upload an toàn| Cloudinary
    Express -->|Gửi email hệ thống| SMTP
```

### Điểm nhấn kiến trúc:
1. **Chống đăng nhập đồng thời (Dual-Login Prevention):** Khi người dùng đăng nhập trên thiết bị mới, `current_session_id` trong cơ sở dữ liệu được làm mới. Token cũ trên thiết bị trước sẽ bị từ chối ngay lập tức ở tầng middleware.
2. **Đồng bộ thời gian thực (Supabase Realtime):** Quản lý trạng thái phòng đấu trường Arena (người chơi vào phòng, sẵn sàng, nộp đáp án, tính điểm) tự động không qua polling.
3. **Lazy-loading & Dynamic Imports:** Tối ưu hóa cold start và bundle size; các thư viện phân tích tài liệu nặng (`pdf-parse`, `mammoth`, `word-extractor`) chỉ được nạp khi có request trích xuất tài liệu.
4. **Hệ thống chuyển động mượt mà (Motion System):** Thiết kế với token chuyển động đồng nhất, tự động nhận diện và tôn trọng cài đặt trợ năng `prefers-reduced-motion` của người dùng.

---

## 3. Ngăn Xếp Công Nghệ (Tech Stack)

| Hạng mục | Công nghệ / Thư viện | Mục đích & Ứng dụng |
| :--- | :--- | :--- |
| **Nền tảng Frontend** | React 19.1, Vite 8.0 | Ứng dụng Single Page Application (SPA) hiệu năng cao |
| **Định tuyến** | React Router 7.14 | Điều hướng phân cấp theo vai trò (Student, Teacher, Admin, Public) |
| **Giao diện & Chuyển động** | Tailwind CSS v4, Framer Motion 12 | Thiết kế responsive hiện đại, hiệu ứng vi tương tác mượt mà |
| **Công thức Khoa học** | KaTeX, rehype-katex, remark-math | Kết xuất công thức hóa học, phương trình toán học chuẩn xác |
| **Đồ họa & Phân tử** | Three.js, React Three Fiber | Hiển thị mô hình phân tử không gian và tương tác đồ họa |
| **Đa ngôn ngữ** | i18next, react-i18next | Hỗ trợ song ngữ Tiếng Việt và Tiếng Anh |
| **Trạng thái & Avatar** | Zustand 5, Dicebear, Multiavatar | Quản lý state toàn cục và bộ tạo avatar nhân vật học viên |
| **Biểu đồ & Phân tích** | Recharts 3.8 | Trực quan hóa dữ liệu trên Dashboard giáo viên và quản trị viên |
| **Backend API** | Express 4.19, serverless-http | API RESTful module hóa, tương thích môi trường Serverless |
| **Môi trường chạy** | Node.js 24.x | Môi trường thực thi JavaScript hiện đại nhất |
| **Cơ sở dữ liệu** | Supabase PostgreSQL | RLS, Realtime Websockets và lưu trữ dữ liệu an toàn |
| **Bảo mật & Mã hóa** | JWT, bcryptjs | Bảo mật phiên đăng nhập, băm mật khẩu chuẩn mã hóa |
| **Xử lý Tài liệu** | pdf-parse v2, mammoth, word-extractor | Trích xuất nội dung văn bản từ tệp PDF và Word (.doc, .docx) |
| **Lưu trữ Đa phương tiện** | Cloudinary | Lưu trữ và phân phối tài liệu, hình ảnh, video học liệu |
| **Dịch vụ Email** | Nodemailer | Gửi thư thông báo và liên kết đặt lại mật khẩu |
| **Kiểm thử tự động** | Vitest 4.1, Supertest | Bộ kiểm thử tự động toàn diện (Unit & Integration Tests) |

---

## 4. Cơ Sở Dữ Liệu & Quy Ước Bảng Tiếng Việt

Cơ sở dữ liệu sử dụng **Supabase PostgreSQL** với Row Level Security (RLS) bảo vệ từng bản ghi. Toàn bộ bảng và cột nghiệp vụ được chuẩn hóa sang **tiếng Việt không dấu dạng `snake_case`**:

| Tên bảng trong Database | Ý nghĩa & Nghiệp vụ |
| :--- | :--- |
| `nguoi_dung` | Thông tin tài khoản, vai trò (`student`, `teacher`, `admin`), điểm thưởng, session ID |
| `khoi` | Danh mục khối lớp học (Lớp 6 đến Lớp 12) |
| `bai_hoc` | Danh mục bài học chính khóa theo từng khối lớp |
| `tien_do_nguoi_dung` | Lưu vết tiến độ hoàn thành từng chặng (stage) của học sinh |
| `thao_luan` | Hệ thống hỏi đáp, bình luận trao đổi dưới bài học |
| `ghi_chu` | Sổ tay ghi chú cá nhân của học sinh trong bài học |
| `hoat_dong_nguoi_dung` | Nhật ký hoạt động tài khoản phục vụ thống kê và bảo mật |
| `nhiem_vu` | Danh sách nhiệm vụ học tập hệ thống |
| `nhiem_vu_nguoi_dung` | Trạng thái tiến độ và nhận thưởng nhiệm vụ của học sinh |
| `hoc_lieu` | Thư viện tài liệu học tập tham khảo |
| `phan_hoi_hoc_lieu` | Đánh giá, phản hồi tài liệu học tập |
| `phan_hoi` | Ý kiến đóng góp, phản hồi, báo cáo lỗi từ người dùng |
| `lop` | Thông tin lớp học do giáo viên quản lý |
| `thanh_vien_lop` | Danh sách học sinh thuộc các lớp học |
| `bai_dang_lop` | Bản tin trao đổi nội bộ trong lớp học |
| `lich_lop` | Lịch biểu học tập và kiểm tra của lớp |
| `bai_nop` | Bài tập học sinh nộp kèm điểm số và nhận xét của giáo viên |
| `hoa_chat` | Cơ sở dữ liệu hóa chất trong phòng thí nghiệm |
| `phan_ung` | Danh mục phản ứng hóa học hỗ trợ mô phỏng |
| `cau_hoi_can` | Ngân hàng câu hỏi mini game cân bằng phương trình |
| `cau_hoi_dau` | Ngân hàng câu hỏi minigame phục vụ đấu trường Arena PK |
| `phong_dau` | Phiên phòng đấu Arena đang hoạt động hoặc đã kết thúc |
| `nguoi_choi` | Trạng thái người chơi và điểm số theo phòng đấu |
| `tra_loi_vong` | Lịch sử nộp câu trả lời từng lượt đấu |
| `lich_su_dau` | Kết quả chung cuộc sau khi trận đấu kết thúc |

---

## 5. Sơ Đồ Định Tuyến (Sitemap)

### 5.1. Phân hệ Frontend Routes
*   **Công khai (Public):**
    *   `/` : Trang chủ giới thiệu nền tảng AURUM.
    *   `/about` : Giới thiệu đội ngũ và tầm nhìn giáo dục.
    *   `/contact` : Thông tin liên hệ và gửi thư phản hồi.
    *   `/terms` : Điều khoản dịch vụ và chính sách bảo mật.
    *   `/lectures` : Thư viện bài giảng mở.
    *   `/bai_hoc`, `/bai_hoc/:grade`, `/bai_hoc/:grade/:lessonId` : Danh sách và trang chi tiết bài học.
*   **Xác thực (Auth):**
    *   `/login` : Đăng nhập tài khoản.
    *   `/register` : Đăng ký tài khoản học sinh / giáo viên.
    *   `/forgot-password`, `/reset-password` : Khôi phục mật khẩu qua email.
    *   `/auth/callback` : Tiếp nhận xác thực từ Google OAuth.
*   **Học sinh (Student - Yêu cầu đăng nhập):**
    *   `/classroom` : Không gian học tập cá nhân.
    *   `/my-class` : Lớp học của tôi (bản tin, bài tập, bạn cùng lớp).
    *   `/classroom/:grade/journey` : Bản đồ lộ trình học tập theo khối lớp.
    *   `/classroom/:grade/journey/:lessonId/[intro|story|challenge|quiz|reward]` : 5 chặng bài học tương tác.
    *   `/lab`, `/lab/simulator` : Phòng thí nghiệm hóa học tương tác.
    *   `/lab/molecules` : Mô hình cấu trúc phân tử không gian.
    *   `/lab/crafting` : Bàn điều chế hợp chất hóa học.
    *   `/lab/solver` : Công cụ gợi ý công thức và liên kết chất.
    *   `/lab/discovery` : Sổ tay khám phá khoa học.
    *   `/arena` : Đấu trường kiến thức PK thời gian thực.
    *   `/periodic-table` : Bảng tuần hoàn nguyên tố hóa học.
    *   `/library`, `/library/:id` : Thư viện tài liệu học tập hỗ trợ AI tóm tắt.
    *   `/calculator` : Máy tính hóa học chuyên dụng.
    *   `/knowledge-map` : Bản đồ tổng quan tri thức hóa học.
    *   `/profile`, `/settings` : Hồ sơ học viên và cài đặt tài khoản cá nhân.
*   **Giáo viên (Teacher Portal - Yêu cầu vai trò `teacher` hoặc `admin`):**
    *   `/teacher` : Dashboard tổng quan chỉ số dạy và học.
    *   `/teacher/lop`, `/teacher/lop/:id` : Quản lý danh sách lớp và học viên.
    *   `/teacher/assignments` : Quản lý bài tập, theo dõi bài nộp và chấm điểm.
    *   `/teacher/library` : Kho tài liệu dùng riêng của giáo viên.
*   **Quản trị viên (Admin Portal - Yêu cầu vai trò `admin`):**
    *   `/admin` : Dashboard quản trị toàn hệ thống.
    *   `/admin/journey`, `/admin/journey/:lessonId` : Quản lý lộ trình và cấu hình chặng học tập.
    *   `/admin/bai_hoc` : Quản lý danh mục và video bài học.
    *   `/admin/nguoi_dung`, `/admin/nguoi_dung/:id` : Quản lý tài khoản và phân quyền người dùng.
    *   `/admin/approvals` : Phê duyệt yêu cầu quản trị hai bước.
    *   `/admin/feedback`, `/admin/phan_hoi` : Tiếp nhận và xử lý phản hồi người dùng.

### 5.2. Phân hệ Backend API Endpoints (`/api/*`)
*   `/api/auth` : Đăng ký, đăng nhập, Google OAuth, kiểm tra phiên làm việc.
*   `/api/user` : Hồ sơ người dùng, tính toán streak, cập nhật tiến độ học tập.
*   `/api/lessons` : Dữ liệu bài học và nội dung 5 giai đoạn học tập.
*   `/api/classes` : Tạo lớp, cấp mã mời, quản lý thành viên, đăng bài, chấm điểm bài tập.
*   `/api/materials` : Upload học liệu, phân loại tài liệu, quản lý phản hồi tài liệu.
*   `/api/analyze` : Phân tích và trích xuất tài liệu từ tệp tin PDF/Word.
*   `/api/lab` : Dữ liệu hóa chất, phản ứng và bài tập cân bằng phương trình.
*   `/api/arena` : Khởi tạo phòng đấu, ghép trận (matchmaking), ghi nhận đáp án.
*   `/api/missions` : Danh sách nhiệm vụ ngày, kiểm tra điều kiện và nhận thưởng.
*   `/api/discussions` : Bình luận, giải đáp thảo luận trong từng bài học.
*   `/api/elements` : Cung cấp dữ liệu chi tiết bảng tuần hoàn nguyên tố.
*   `/api/admin` : Thống kê hệ thống, phê duyệt quản trị, danh sách người dùng phân trang.

---

## 6. Hướng Dẫn Cài Đặt & Phát Triển

### 6.1. Yêu cầu môi trường
*   **Node.js:** Phiên bản `24.x` (khuyến nghị dùng [nvm](https://github.com/nvm-sh/nvm))
*   **npm:** Đi kèm Node.js

### 6.2. Cài đặt các gói phụ thuộc
```bash
git clone https://github.com/rwegww/AURUM.git
cd AURUM
npm install
```



## 7. Quy Ước Đóng Góp & Thông Điệp Commit (Commit Guidelines)

Để duy trì lịch sử Git rõ ràng và thống nhất, mọi commit đều bắt buộc viết bằng **tiếng Việt** theo chuẩn:

```
<type>: <mô tả ngắn gọn bằng tiếng Việt>
```

### Các tiền tố (`type`) hợp lệ:
*   `feat`: Thêm chức năng mới (Ví dụ: `feat: thêm chức năng tạo câu hỏi bằng AI`)
*   `fix`: Sửa lỗi (Ví dụ: `fix: sửa lỗi lưu trạng thái bài học`)
*   `refactor`: Tối ưu hóa hoặc cấu trúc lại mã nguồn mà không đổi hành vi (Ví dụ: `refactor: tách logic xử lý quiz trong trang admin`)
*   `style`: Tinh chỉnh giao diện, định dạng code mà không ảnh hưởng logic (Ví dụ: `style: chỉnh màu giao diện phù hợp chế độ sáng tối`)
*   `docs`: Cập nhật tài liệu, hướng dẫn (Ví dụ: `docs: cập nhật hướng dẫn sử dụng hệ thống`)
*   `test`: Thêm mới hoặc bổ sung kiểm thử tự động (Ví dụ: `test: bổ sung kiểm thử điều kiện nhận thưởng nhiệm vụ`)
*   `chore`: Thay đổi nhỏ, cấu hình, cập nhật thư viện hoặc dọn dẹp dự án (Ví dụ: `chore: cập nhật dependencies trong package.json`)

---

## 8. Giấy Phép & Bản Quyền

Dự án được bảo hộ bản quyền bởi **AURUM Chemistry Learning Hub** © 2026. Mọi quyền được bảo lưu.
