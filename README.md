# 🧪 AURUM - Nền tảng Học tập Hóa học Tương tác

## 📋 Tổng quan dự án

AURUM là một nền tảng học tập tương tác chuyên sâu về Hóa học được xây dựng trên kiến trúc **hiện đại**:

- ✅ **Frontend**: React 19, Vite, Tailwind CSS v4, Three.js (cho phòng Lab 3D)
- ✅ **Backend**: Express (Serverless API trên Vercel)
- ✅ **Database**: Supabase (PostgreSQL)

### 🎯 Tính năng chính

- 📝 Quản lý bài học và câu hỏi trắc nghiệm (MCQ)
- 🎮 Phòng thí nghiệm ảo (Virtual Lab 3D) với tương tác vật lý
- 🏆 Hệ thống nhiệm vụ (Missions) và Thử thách (Challenges) hàng ngày
- 📊 Tracking tiến độ học tập chi tiết (Balancing progress, XP, Level)
- 🤖 Phân tích tài liệu & Trích xuất câu hỏi bằng AI (Document Analysis)
- 🏅 Gamification: Bảng xếp hạng (Leaderboard), Chuỗi học tập (Streak), Achievements
- 📚 Mạng xã hội học tập: Thảo luận, Lớp học, Tán dương công khai (Public Praises)

## 🏗️ Kiến trúc hệ thống

```
AURUM/
├── api/                        # Server-side logic (Serverless)
│   ├── _routes/                # API Endpoints (user, auth, lab, lessons...)
│   ├── _middleware/            # Authentication & Utilities
│   ├── models/                 # Database models & queries
│   ├── lib/                    # Supabase backend client
│   └── index.js                # API Entry point
├── src/                        # Frontend React
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Main SPA pages
│   ├── lib/                    # Frontend utilities & Supabase client
│   └── main.jsx                # Web app entry point
├── supabase/                   # Cấu hình & Database migrations
├── scripts/                    # Utility scripts (Seed, Migrate, Backup)
└── public/                     # Static assets (3D models, textures, curriculum)
```

## 🗄️ Cấu trúc Database

Hệ thống sử dụng cơ sở dữ liệu quan hệ mạnh mẽ trên Supabase (PostgreSQL).

### Bảng dữ liệu chính

| Bảng | Mục đích |
| --- | --- |
| Users | Lưu trữ tài khoản, XP, Level, Avatar, Preferences, Inventory |
| Lessons | Danh sách bài học, nội dung lý thuyết |
| MCQ_Questions | Ngân hàng câu hỏi trắc nghiệm đa dạng |
| Materials | Danh mục vật liệu và hóa chất cho phòng lab ảo |
| Elements | Bảng tuần hoàn các nguyên tố hóa học chi tiết |
| Missions | Hệ thống nhiệm vụ hàng ngày và phần thưởng |
| Classes | Quản lý lớp học, giáo viên và học sinh |
| Discussions | Bài đăng thảo luận cộng đồng của người dùng |
| Game_History | Lịch sử làm bài tập và thực hành thí nghiệm |

### 📋 Quy tắc thiết kế:

Khác với các hệ thống cũ dùng prefix chuỗi, AURUM áp dụng quy chuẩn bảo mật và hiệu suất cao nhất:
- **Primary Keys**: 100% sử dụng **UUID v4** để đảm bảo bảo mật định danh, tránh lộ số lượng bản ghi và dễ dàng mở rộng, đồng bộ dữ liệu.
- **Data Integrity**: Áp dụng chặt chẽ các ràng buộc Foreign Keys (ON DELETE CASCADE/SET NULL).
- **Row Level Security (RLS)**: Được kích hoạt trên Supabase để bảo mật dữ liệu cấp độ dòng.

## 🚀 Quick Start

### 1. Khởi tạo môi trường

```bash
# Clone repository
git clone <repo-url>
cd AURUM

# Cài đặt dependencies
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env.local` ở thư mục gốc và cung cấp các thông số kết nối:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key_for_analysis
```

### 3. Chạy hệ thống

Mở 2 terminal để chạy song song Frontend và Backend:

```bash
# Terminal 1: Chạy Frontend (Vite) ở http://localhost:5173
npm run dev

# Terminal 2: Chạy Backend API cục bộ ở http://localhost:5000
npm run server
```

## 🎯 Key Features

### ✅ Gamification System

- Level progression (Tiến trình cấp độ không giới hạn)
- Hệ thống kinh nghiệm (XP) cho mọi tương tác
- Chuỗi ngày học tập (Streak) khích lệ truy cập hàng ngày
- Inventory & Vật phẩm tùy chỉnh Avatar
- Global Leaderboard (Bảng xếp hạng toàn máy chủ)

### ✅ Virtual Lab & 3D Integration

- Môi trường 3D tương tác xây dựng bằng `@react-three/fiber`
- Mô phỏng phản ứng hóa học thời gian thực
- Tương tác vật lý với dụng cụ thí nghiệm
- Cân bằng phương trình hóa học (Equation Balancer)

### ✅ AI Integration

- Tích hợp Engine AI trích xuất tài liệu (PDF, DOCX)
- Tự động nhận diện và trích xuất câu hỏi MCQ từ đề thi
- Hỗ trợ giải đáp và kiến nghị tài liệu học tập
- Tích hợp nhận diện biểu thức toán học (KaTeX/Math)

## 🔗 Database Schema (Một phần cốt lõi)

### 👥 Users

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Định danh duy nhất của người dùng |
| username | String | Tên hiển thị trong ứng dụng |
| email | String | Email đăng nhập |
| role | String | student / teacher / admin |
| xp | Integer | Tổng điểm kinh nghiệm hiện tại |
| level | Integer | Cấp độ hiện tại |
| streak_count | Integer | Chuỗi ngày đăng nhập liên tiếp |
| is_locked | Boolean | Trạng thái khóa tài khoản |

### 📚 Lessons

| Field | Type | Description |
| --- | --- | --- |
| id | UUID | Định danh bài học |
| title | String | Tiêu đề bài học |
| grade | Integer | Khối lớp (VD: 8, 9, 10...) |
| topic | String | Chủ đề chính |
| content | JSONB | Nội dung bài học (Rich Text, Modules) |
| difficulty | String | Easy, Medium, Hard |
| is_active | Boolean | Trạng thái hiển thị |

## 🔗 Database Relationships & Foreign Keys

### 📋 Sơ đồ Relationships cơ bản:

```
Users (Học sinh/Giáo viên)
  ↓ (user_id)
  ├── Discussions (Bài đăng)
  │     ↓ (discussion_id)
  │     └── Discussion_Replies (Phản hồi)
  ├── Game_History (Lịch sử)
  └── User_Missions (Tiến trình nhiệm vụ)
        ↑ (mission_id)
        └── Missions (Danh sách nhiệm vụ hệ thống)
```

## 🚀 Getting Started

### Yêu cầu hệ thống:
- **Node.js**: >= 20.x
- **Package Manager**: npm v10+
- Tài khoản Supabase (Dành cho Database, Auth, Storage)
- Nền tảng Deploy (Khuyến nghị: Vercel cho Backend, Netlify/Vercel cho Frontend)

---

*Cập nhật lần cuối: Tháng 6, 2026*

# Lịch sử phát triển dự án

- **02/06/2026**: Tái cấu trúc toàn bộ dự án, gỡ bỏ cấu trúc Monorepo (Workspace), chuyển hẳn về Web App chuẩn để tối ưu hóa hiệu suất deploy.
- **02/06/2026**: Khắc phục thành công sự cố sập server (lỗi 500) trên Node 20 tại Vercel do thiếu thư viện native `WebSocket` bằng cách tích hợp trực tiếp thư viện `ws`.
- **02/06/2026**: Tích hợp công cụ đo lường hiệu suất `@vercel/speed-insights` vào Entry Point của React để theo dõi Web Vitals.
- **Tháng 5/2026**: Phát triển và hoàn thiện các module 3D Virtual Lab (Phòng thí nghiệm ảo) và tích hợp hệ thống Gamification.
