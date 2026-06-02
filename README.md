# 🧪 AURUM - Nền tảng Học tập Hóa học Tương tác

## 📋 Tổng quan dự án

AURUM là một nền tảng học tập tương tác chuyên sâu về Hóa học được thiết kế theo kiến trúc **Serverless** hiện đại với 3 tầng rõ rệt:

- ✅ **Frontend**: React 19, Vite, Tailwind CSS v4, Three.js (cho phòng Lab 3D)
- ✅ **Backend**: ExpressJS chạy trên hạ tầng Vercel Serverless
- ✅ **Database**: PostgreSQL quản lý hoàn toàn qua nền tảng Supabase

### 🎯 Tính năng chính

- 📝 Quản lý bài học và tài liệu lý thuyết tương tác
- 🎮 Hệ thống Đấu trường (Arena) thời gian thực và Minigames (Cân bằng phương trình)
- 🧪 Phòng thí nghiệm ảo (Virtual Lab 3D) với tương tác vật lý trực quan
- 🏆 Hệ thống nhiệm vụ (Missions), Thử thách (Challenges) và Chuỗi (Streak)
- 📊 Tracking tiến trình học tập chi tiết (XP, Level, Analytics)
- 🤖 Phân tích tài liệu PDF/Docx bằng AI và tự động sinh câu hỏi
- 🏫 Hệ thống Lớp học ảo (Virtual Classes) và Giao bài tập
- 📚 Mạng xã hội học tập: Thảo luận, Phản hồi, Tán dương công khai

## 🏗️ Kiến trúc hệ thống

```
AURUM/
├── api/                        # Backend Serverless Logic
│   ├── _routes/                # Endpoints (user, auth, lab, lessons, arena, classes...)
│   ├── _middleware/            # Authentication (JWT) & RBAC Utilities
│   ├── models/                 # Database models & queries wrapper
│   ├── lib/                    # Cấu hình Supabase Client
│   └── index.js                # API Entry point
├── src/                        # Frontend React SPA
│   ├── components/             # Reusable UI components (ui/, lab/, arena/...)
│   ├── pages/                  # Main pages (Home, Dashboard, Lab, Arena...)
│   ├── lib/                    # Supabase client & utilities
│   └── main.jsx                # Web app entry point
├── supabase/                   # Cấu hình Database & Migrations
│   └── V2.sql                  # ⭐ Full Database Schema (RLS, Functions, Tables)
├── scripts/                    # Scripts tiện ích (Seed data, Migrate, Backup)
└── public/                     # Static assets (3D models, textures, PDFs)
```

## 🗄️ Cấu trúc Database

Hệ thống sử dụng cơ sở dữ liệu quan hệ mạnh mẽ trên Supabase (PostgreSQL).

### Core DB (Dữ liệu cốt lõi)
| Bảng | Mục đích |
| --- | --- |
| `users` | Tài khoản, role, XP, level, stats, streak, inventory |
| `grade_levels` | Danh mục khối lớp học (8, 9, 10...) |
| `lessons` | Quản lý nội dung bài giảng, modules, video, quizzes |
| `user_progress` | Theo dõi tiến độ học tập (lesson, chemical, balancing) |
| `feedback` | Thu thập phản hồi, báo lỗi, tán dương từ người dùng |

### Lab & Arena DB (Phòng thí nghiệm & Đấu trường)
| Bảng | Mục đích |
| --- | --- |
| `lab_chemicals` | Danh sách hóa chất, công thức, trạng thái, màu sắc |
| `lab_reactions` | Dữ liệu phản ứng hóa học, phương trình, điều kiện, hiện tượng |
| `balancing_questions` | Ngân hàng câu hỏi cân bằng phương trình |
| `arena_questions` | Ngân hàng câu hỏi trắc nghiệm cho Đấu trường |
| `arena_rooms` | Quản lý phòng chơi Arena thời gian thực |
| `arena_match_history` | Lịch sử thi đấu, kết quả, biến động điểm |

### Classroom & Social DB (Lớp học & Tương tác)
| Bảng | Mục đích |
| --- | --- |
| `classes` & `class_members` | Quản lý lớp học, giáo viên và học sinh |
| `class_posts` | Bài đăng, thông báo, bài tập trong lớp |
| `class_assignment_submissions`| Bài nộp của học sinh và điểm số |
| `missions` & `user_missions`| Hệ thống nhiệm vụ hàng ngày và tiến trình của user |
| `lesson_discussions` | Bình luận, hỏi đáp đa cấp (nested comments) trong bài học |
| `materials` & `material_feedback`| Tài nguyên học tập mở rộng và đánh giá |
| `user_activities` | Log toàn bộ hoạt động của hệ thống |

### 📋 Quy tắc tạo ID & Khóa:

- 100% các bảng (trừ `grade_levels` và `balancing_questions`) sử dụng **UUID v4** hoặc **văn bản định danh không đoán được (non-sequential text)** làm Primary Key để đảm bảo an toàn bảo mật (Chống IDOR).
- Dữ liệu cấu trúc không đồng nhất (như `options`, `reactants`, `theory_modules`) được lưu trữ tối ưu dưới dạng **JSONB**.

## 🚀 Quick Start

### 1. Khởi tạo Database (Supabase)

```sql
-- Mở SQL Editor trên Supabase và chạy toàn bộ nội dung file:
-- supabase/V2.sql
-- Kịch bản này sẽ tự động tạo Tables, Indexes, RLS Policies và Functions
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local` ở thư mục gốc:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
```

### 3. Khởi chạy hệ thống

```bash
# Cài đặt dependencies
npm install

# Terminal 1: Chạy Frontend (Vite) ở http://localhost:5173
npm run dev

# Terminal 2: Chạy Backend API ở http://localhost:5000
npm run server
```

## 🎯 Key Features

### ✅ Gamification System
- **Level progression**: Tính toán cấp độ dựa trên XP không giới hạn.
- **Streak & Daily Missions**: Nhiệm vụ thay đổi mỗi ngày, khuyến khích học viên duy trì chuỗi học.
- **Arena (Đấu trường)**: Thi đấu thời gian thực (Solo/Multiplayer) với điểm Elo (pts_change).
- **Achievements & Badges**: Gắn với `user_progress` để mở khóa vật phẩm.

### ✅ Virtual Lab & 3D Integration
- **Môi trường 3D**: Xây dựng bằng `@react-three/fiber`, hiển thị phân tử 3D và dụng cụ.
- **Phản ứng thời gian thực**: Tra cứu `lab_reactions` để giả lập hiện tượng, màu sắc, cháy nổ, tỏa nhiệt.
- **Cân bằng phương trình**: Minigame với cơ chế node-based cho học sinh từ lớp 8.

### ✅ AI Document Analysis (V3)
- Sử dụng mô hình LLM tiên tiến (GPT-4o-mini) để phân tích tài liệu học tập tải lên.
- Tự động bóc tách lý thuyết và sinh bộ câu hỏi trắc nghiệm MCQ lưu thẳng vào ngân hàng đề.

## 🔗 Database Relationships & Foreign Keys

### ✨ Tính năng Relationships & Bảo mật:
- **ON DELETE CASCADE**: Xóa bài học sẽ tự động xóa tất cả thảo luận, ghi chú liên quan. Rời lớp học sẽ tự động gỡ các bài nộp.
- **Row Level Security (RLS)**: Bật 100% trên Supabase. Người dùng chỉ xem được thông tin lớp học họ tham gia, chỉ sửa được bài nộp của chính mình.
- **Database Functions**: Các hành vi tính điểm (Ví dụ: `claim_mission_reward`, `increment_likes`) được viết bằng PL/pgSQL chạy trực tiếp trên Server DB để chống gian lận.

### 📋 Sơ đồ Relationships (Tiêu biểu):
```
Users (role: teacher)
  ↓ (teacher_id)
  ├── Classes (Lớp học)
  │     ↓ (class_id)
  │     ├── Class_Members (Học sinh)
  │     │     ↑ (student_id) --> Users (role: student)
  │     ├── Class_Posts (Bài tập)
  │     │     ↓ (post_id)
  │     │     └── Class_Assignment_Submissions (Bài làm)
  │     └── Class_Schedules (Lịch học)
```

## 🔗 Database Schema Chi Tiết

### 👥 Users
| Field | Type | Description |
| --- | --- | --- |
| id | TEXT | UUID (được cast thành text) - Khóa chính |
| username | TEXT | Tên định danh (Unique) |
| email | TEXT | Email đăng nhập (Unique) |
| role | TEXT | `student`, `teacher`, `admin` |
| xp | INTEGER | Điểm kinh nghiệm tích lũy |
| level | INTEGER | Cấp độ học tập hiện tại |
| active_minutes | INTEGER | Tổng số phút đã học |
| streak_count | INTEGER | Chuỗi ngày học liên tục |
| current_session_id | TEXT | Quản lý phiên đăng nhập (Ngăn Dual-Login) |
| study_plan | JSONB | Mục tiêu học tập hàng ngày |

### 📚 Lessons
| Field | Type | Description |
| --- | --- | --- |
| id | TEXT | Khóa chính (Ví dụ: `less_abc123`) |
| class_id | INTEGER | Foreign Key -> `grade_levels(id)` |
| title | TEXT | Tên bài học |
| theory_modules | JSONB | Cấu trúc lý thuyết dạng khối (Rich Text, H5P) |
| quizzes | JSONB | Cấu trúc câu hỏi nhúng trong bài |
| game | JSONB | Cấu hình minigame cuối bài học |
| is_premium | BOOLEAN | Giới hạn quyền truy cập |

### 🧪 Lab Reactions
| Field | Type | Description |
| --- | --- | --- |
| id | TEXT | Khóa chính |
| equation | TEXT | Phương trình hóa học chuẩn |
| reactants | JSONB | Mảng hóa chất tham gia (cần có trong `lab_chemicals`) |
| products | JSONB | Mảng hóa chất tạo thành |
| observation | TEXT | Hiện tượng quan sát (màu sắc, kết tủa, khí) |
| danger_level | INTEGER | Mức độ nguy hiểm (0-5) để kích hoạt hiệu ứng cảnh báo |

### ⚔️ Arena Rooms
| Field | Type | Description |
| --- | --- | --- |
| id | TEXT | Khóa chính phòng đấu |
| host_id | TEXT | Người tạo phòng (Foreign Key -> `users`) |
| mode | TEXT | `solo`, `pvp`, `team` |
| status | TEXT | `waiting`, `playing`, `finished` |
| current_players| INTEGER | Số lượng người chơi hiện tại trong phòng |

## 🚀 Getting Started

### Yêu cầu hệ thống:
- **Node.js**: Phiên bản >= 20.x (Bắt buộc cho Vercel Serverless)
- **NPM**: Phiên bản 10.x trở lên
- Trình duyệt hỗ trợ WebGL (Chrome/Firefox/Edge) cho Virtual Lab.

### Cài đặt:
1. Đảm bảo cấu hình môi trường `.env.local` đã đầy đủ khóa API.
2. Kiểm tra lại việc cấp phát quyền (Grant) cho `service_role` trên Supabase nếu thay đổi schema.
3. Nếu deploy lên Vercel, đảm bảo Root Directory được set tại thư mục gốc (không phải `/api`).

---

*Cập nhật lần cuối: 02/06/2026*

# Lịch sử phát triển dự án

- **02/06/2026**: Hoàn thiện toàn bộ V2 Database Schema (Drop các bảng dư thừa, áp dụng JSONB chuẩn hóa, viết lại RLS Policies). Phân tích lại hệ thống thành file README hoàn chỉnh.
- **02/06/2026**: Khắc phục thành công sự cố sập server (lỗi 500) trên Node 20 tại Vercel do thiếu thư viện native `WebSocket` bằng cách tích hợp trực tiếp thư viện `ws`.
- **02/06/2026**: Tái cấu trúc toàn bộ dự án, gỡ bỏ cấu trúc Monorepo (Workspace), chuyển hẳn về Web App chuẩn để tối ưu hóa hiệu suất deploy. Tích hợp Speed Insights.
- **Tháng 5/2026**: Phát triển và hoàn thiện các module cốt lõi: 3D Virtual Lab (Phòng thí nghiệm ảo), Hệ thống Gamification (Missions, XP, Streak) và Lớp học (Classrooms).
