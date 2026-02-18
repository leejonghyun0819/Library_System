import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
// RootLayout에서 정의한 AuthContext 임포트
import { AuthContext } from '../_layout';

export default function LoginScreen() {
    const router = useRouter();
    // RootLayout의 로그인 상태 변경 함수 가져오기
    const { setIsLoggedIn } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 로그인 로직 병합
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
            return;
        }

        const loginData = { email, password };

        try {
            console.log('백엔드 전송 데이터:', loginData);

            // 가입 정보(0819... / lock7136@) 또는 테스트용(admin/1234) 체크
            if (
                (email === 'admin' && password === '1234') ||
                (email === '0819ljh@gmail.com' && password === 'lock7136@')
            ) {
                // 1. 전역 로그인 상태를 true로 변경 (튕김 방지 핵심)
                setIsLoggedIn(true);

                // 2. 메인 탭으로 이동
                router.replace('/(tabs)');
            } else {
                Alert.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            Alert.alert('에러', '서버와 연결할 수 없습니다.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                {/* 상단 헤더 영역 */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back-circle" size={32} color="#E0C36B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>회원인증</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.infoText}>
                        로그인을 하시면 홈페이지 서비스 및 대출/예약신청 등의 도서 서비스를 이용하실 수 있습니다.
                    </Text>

                    {/* 아이디 입력창 (UI 병합) */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-circle-outline" size={24} color="#333" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="아이디를 입력해주세요"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* 비밀번호 입력창 (UI 병합) */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="key-outline" size={24} color="#333" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="비밀번호를 입력해주세요"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            textContentType="oneTimeCode" // iOS 자동 비밀번호 제안 방지
                        />
                    </View>

                    {/* 로그인 버튼 (병합된 로직 연결) */}
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>로그인</Text>
                    </TouchableOpacity>

                    {/* 하단 메뉴 */}
                    <View style={styles.footerMenu}>
                        <TouchableOpacity>
                            <Text style={styles.footerText}>아이디 찾기</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity>
                            <Text style={styles.footerText}>비밀번호 재발급</Text>
                        </TouchableOpacity>
                        <View style={styles.divider} />
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.footerText}>회원가입</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginHorizontal: 20,
    },
    backButton: { position: 'absolute', left: 0 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    content: { flex: 1, paddingHorizontal: 30, paddingTop: 40 },
    infoText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 20,
        marginBottom: 40,
        color: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#000',
        borderRadius: 4,
        marginBottom: 15,
        height: 60,
        paddingHorizontal: 15,
    },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16, fontWeight: '500' },
    loginButton: {
        backgroundColor: '#F7E695', // 도서관 스타일 노란색
        height: 60,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    footerMenu: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 40,
    },
    footerText: { fontSize: 14, fontWeight: 'bold', color: '#000' },
    divider: { width: 1, height: 14, backgroundColor: '#ccc' },
});


            //    const response = await fetch('http://백엔드주소/login', {
            //        method: 'POST',
            //        headers: { 'Content-Type': 'application/json' },
            //        body: JSON.stringify(loginData)
            //    });
            //    const result = await response.json();

