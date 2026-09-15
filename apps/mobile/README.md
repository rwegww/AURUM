# AURUM Mobile

Mobile app scaffold for the existing AURUM backend. The app uses Expo Router and calls the current Express API under `/api/*`.

## Run

```bash
cd apps/mobile
npm install
npm run start
```

For Android emulator with the local backend:

```bash
$env:EXPO_PUBLIC_API_URL="http://10.0.2.2:5000"
npm run android
```

For iOS simulator or physical devices, set `EXPO_PUBLIC_API_URL` to the reachable backend URL.

## Đồng bộ Hành trình với website

Màn hình chọn lớp, bản đồ hành trình, ba vòng câu hỏi, sổ tay và cây kiến thức dùng các hàm chung trong `../../shared`. Giữ các quy tắc mở khóa, tách câu hỏi, chấm đáp án và cấu trúc bản đồ tại đó để web và ứng dụng không bị lệch nhau.

Ứng dụng dùng Nunito/Quicksand, SVG, Expo Video và WebView để hiển thị công thức KaTeX. Sau khi cài các phụ thuộc mới, cần build lại ứng dụng native; chỉ cập nhật JavaScript cho bản APK cũ chưa có các module này là chưa đủ.

Khi nâng phiên bản KaTeX hoặc đổi font, tạo lại CSS/font nhúng dùng ngoại tuyến:

```bash
npm run build:math-styles
```

Kết quả kiểm tra và giới hạn xác nhận giao diện được ghi tại `../../docs/mobile-journey-parity.md`.
