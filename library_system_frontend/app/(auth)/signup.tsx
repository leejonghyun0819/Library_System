import React, { useState } from 'react';
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

export default function SignupScreen() {
    const router = useRouter();

    // 상태 관리: 이름, 아이디(username), 비밀번호
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // UI상 아이디
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async () => {
        // 1. 유효성 검사
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('알림', '모든 항목을 입력해주세요.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
            return;
        }

        // 2. 백엔드 전송 데이터 구성 (username 필드 준수)
        const signupData = {
            name: name,
            username: email,
            password: password,
        };

        try {
            console.log('회원가입 요청 데이터:', signupData);

            // 3. 백엔드 API 호출 (동일 와이파이 주소)
            const response = await fetch('http://172.29.98.71/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData),
            });

            if (response.ok) {
                // 4. 가입 성공 시 알림 후 로그인 화면으로 이동
                Alert.alert('성공', '회원가입이 완료되었습니다.', [
                    {
                        text: '확인',
                        onPress: () => router.replace('/(auth)/login'),
                    },
                ]);
            } else {
                const result = await response.json();
                Alert.alert('가입 실패', result.message || '이미 사용 중인 아이디입니다.');
            }
        } catch (error) {
            console.error('회원가입 에러:', error);
            Alert.alert('에러', '서버와 연결할 수 없습니다. IP 주소와 네트워크를 확인해주세요.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
                {/* 상단 헤더: 뒤로가기 버튼 포함 */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back-circle" size={32} color="#E0C36B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>회원가입</Text>
                </View>

                <View style={styles.content}>
                    {/* 이름 입력 */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={24} color="#333" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="이름을 입력해주세요"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* 아이디(Username) 입력 */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color="#333" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="아이디(이메일)를 입력해주세요"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* 비밀번호 입력 */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={24} color="#333" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="비밀번호"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            textContentType="oneTimeCode" // iOS 자동저장 방지
                            autoCorrect={false}
                        />
                    </View>

                    {/* 비밀번호 확인 입력 */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="checkmark-done-outline" size={24} color="#333" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="비밀번호 확인"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            textContentType="oneTimeCode"
                            autoCorrect={false}
                        />
                    </View>

                    {/* 가입하기 버튼 */}
                    <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                        <Text style={styles.signupButtonText}>가입하기</Text>
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
    backButton: { position: 'absolute', left: 0 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
    content: { flex: 1, paddingHorizontal: 30, paddingTop: 30 },
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
    signupButton: {
        backgroundColor: '#F7E695', // 도서관 테마 노란색
        height: 60,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    signupButtonText: { fontSize: 20, fontWeight: 'bold', color: '#000' },
});
