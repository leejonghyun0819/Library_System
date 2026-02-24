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
import { AuthContext } from '../_layout';

export default function LoginScreen() {
    const router = useRouter();
    const { setIsLoggedIn } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('알림', '아이디와 비밀번호를 입력해주세요.');
            return;
        }

        const loginData = {
            username: email,
            password: password,
        };

        try {
            console.log('백엔드 전송 데이터:', loginData);

            const response = await fetch('http://172.29.98.71/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('로그인 성공:', result);
                setIsLoggedIn(true);
                router.replace('/(tabs)');
            } else {
                Alert.alert('로그인 실패', result.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            console.error('연결 에러:', error);
            Alert.alert('에러', '서버와 연결할 수 없습니다. IP 주소와 와이파이 연결을 확인해주세요.');
        }
    };

    // 게스트 모드 진입 함수
    const handleGuestLogin = () => {
        // [핵심] _layout.tsx의 가드를 통과시키기 위해 true로 변경
        setIsLoggedIn(true);
        // (tabs)의 _layout으로 이동
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>회원인증</Text>
                </View>

                <View style={styles.content}>
                    <Text style={styles.infoText}>
                        로그인을 하시면 홈페이지 서비스 및 대출/예약신청 등의 도서 서비스를 이용하실 수 있습니다.
                    </Text>

                    {/* 아이디 입력창 */}
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

                    {/* 비밀번호 입력창 */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="key-outline" size={24} color="#333" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="비밀번호를 입력해주세요"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            textContentType="oneTimeCode"
                        />
                    </View>

                    {/* 로그인 버튼 */}
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>로그인</Text>
                    </TouchableOpacity>

                    {/* 하단 보조 메뉴 */}
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

                    {/* 게스트 모드 버튼 추가 */}
                    <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
                        <Text style={styles.guestButtonText}>게스트 모드</Text>
                        <Ionicons name="chevron-forward" size={16} color="#666" />
                    </TouchableOpacity>
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
        backgroundColor: '#F7E695',
        height: 60,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    footerMenu: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 30 },
    footerText: { fontSize: 14, fontWeight: 'bold', color: '#000' },
    divider: { width: 1, height: 14, backgroundColor: '#ccc' },
    // 게스트 버튼 스타일
    guestButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        padding: 10,
    },
    guestButtonText: {
        fontSize: 14,
        color: '#666',
        marginRight: 5,
        textDecorationLine: 'underline',
    },
});
