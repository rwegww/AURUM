# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## AURUM Mobile with Expo

The mobile app lives in `mobile/` and targets Expo SDK 54.

For local phone testing, expose the API on your LAN and point Expo at that same IP:

```powershell
$env:API_HOST='0.0.0.0'; npm run server
```

```env
# mobile/.env.local
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:5000

# root .env.local, optional homepage CTA
VITE_EXPO_GO_URL=exp://192.168.1.10:8082
```

Start Expo from the repo root:

```powershell
npm run mobile:dev
```

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
