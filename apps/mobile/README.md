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
