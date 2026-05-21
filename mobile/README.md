# AURUM Mobile

Expo SDK 54 mobile shell for AURUM.

## Local Development

1. Copy `.env.example` to `.env.local`.
2. Replace the IP in `EXPO_PUBLIC_API_BASE_URL` with your LAN IPv4 address.
3. From the repo root, run the API so phones can reach it:

```powershell
$env:API_HOST='0.0.0.0'; npm run server
```

4. Start Expo:

```powershell
npm run mobile:dev
```

5. Set the web homepage link in the root `.env.local` when you want the web CTA:

```env
VITE_EXPO_GO_URL=exp://192.168.1.10:8082
```

