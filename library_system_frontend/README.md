# Library System Frontend

Expo React Native 기반 프론트엔드입니다.

## 실행

```bash
npm install
npx expo start -c
```

웹에서 먼저 확인하려면:

```bash
npx expo start -c --web
```

## API 서버 주소

기본적으로 Expo host IP를 추정해서 `http://PC_IP:8080`으로 접속합니다.

직접 지정하려면 `.env` 파일을 만들고 아래처럼 입력하세요.

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.0.10:8080
```

백엔드 서버가 먼저 켜져 있어야 합니다.
