import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState, createContext, useContext } from 'react';

// 1. 로그인 상태를 관리할 '통로(Context)'를 만듭니다.
// 다른 파일(login.tsx, setting.tsx 등)에서 이 Context를 불러와 상태를 바꿀 겁니다.
export const AuthContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: (val: boolean) => {},
});

export default function RootLayout() {
    const segments = useSegments();
    const router = useRouter();

    // [중요] 실제 로그인 상태를 담는 변수입니다.
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isNavigationReady, setIsNavigationReady] = useState(false);

    // 레이아웃이 마운트(준비)되었는지 확인합니다.
    useEffect(() => {
        setIsNavigationReady(true);
    }, []);

    useEffect(() => {
        // 네비게이터가 준비되지 않았으면 이동 로직을 실행하지 않습니다.
        if (!isNavigationReady) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!isLoggedIn && !inAuthGroup) {
            // 로그인이 안 되어 있는데 로그인 페이지가 아니면 -> 로그인으로 강제 이동
            router.replace('/(auth)/login');
        } else if (isLoggedIn && inAuthGroup) {
            // 로그인이 되었는데 아직 로그인/회원가입 페이지면 -> 메인 탭으로 강제 이동
            router.replace('/(tabs)');
        }
    }, [isLoggedIn, segments, isNavigationReady]);

    return (
        // 2. Provider로 감싸서 자식 컴포넌트들이 로그인 상태에 접근하게 합니다.
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </AuthContext.Provider>
    );
}
