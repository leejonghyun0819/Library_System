import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import {
    Loan,
    Reservation,
    User,
    cancelReservation,
    getMe,
    getMyLoans,
    getMyReservations,
    login,
    logout,
    returnBook,
    signup,
    updateMe,
} from '@/constants/api';

type Mode = 'login' | 'signup';

function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
}

export default function ProfileScreen() {
    const [mode, setMode] = useState<Mode>('login');
    const [user, setUser] = useState<User | null>(null);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');

    const [editNickname, setEditNickname] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const refreshMe = async () => {
        try {
            setLoading(true);
            setMessage('');
            const me = await getMe();
            setUser(me);
            setEditNickname(me.nickname);
            setEditEmail(me.email);
            const [loanResult, reservationResult] = await Promise.all([getMyLoans(), getMyReservations()]);
            setLoans(loanResult);
            setReservations(reservationResult);
        } catch {
            setUser(null);
            setLoans([]);
            setReservations([]);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            refreshMe();
        }, [])
    );

    const handleLogin = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert('입력 확인', '아이디와 비밀번호를 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setMessage('');
            const loggedInUser = await login({ username: username.trim(), password });
            setUser(loggedInUser);
            setEditNickname(loggedInUser.nickname);
            setEditEmail(loggedInUser.email);
            setPassword('');
            const [loanResult, reservationResult] = await Promise.all([getMyLoans(), getMyReservations()]);
            setLoans(loanResult);
            setReservations(reservationResult);
            setMessage('로그인되었습니다.');
        } catch (error) {
            Alert.alert('로그인 실패', error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        if (!username.trim() || !password.trim() || !nickname.trim() || !email.trim()) {
            Alert.alert('입력 확인', '회원가입 정보를 모두 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            setMessage('');
            await signup({
                username: username.trim(),
                password,
                nickname: nickname.trim(),
                email: email.trim(),
            });
            const loggedInUser = await login({ username: username.trim(), password });
            setUser(loggedInUser);
            setEditNickname(loggedInUser.nickname);
            setEditEmail(loggedInUser.email);
            setPassword('');
            setNickname('');
            setEmail('');
            setLoans([]);
            setReservations([]);
            setMessage('회원가입 후 로그인되었습니다.');
        } catch (error) {
            Alert.alert('회원가입 실패', error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            await logout();
        } catch {
            // 이미 세션이 끊긴 경우에도 프론트 상태는 로그아웃 처리합니다.
        } finally {
            setUser(null);
            setLoans([]);
            setReservations([]);
            setMessage('로그아웃되었습니다.');
            setLoading(false);
        }
    };

    const handleUpdateMe = async () => {
        try {
            setLoading(true);
            const updated = await updateMe({ nickname: editNickname.trim(), email: editEmail.trim() });
            setUser(updated);
            setMessage('회원정보가 수정되었습니다.');
        } catch (error) {
            Alert.alert('수정 실패', error instanceof Error ? error.message : '회원정보 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (bookId: number) => {
        try {
            setLoading(true);
            await returnBook(bookId);
            await refreshMe();
            Alert.alert('완료', '도서가 반납되었습니다.');
        } catch (error) {
            Alert.alert('반납 실패', error instanceof Error ? error.message : '반납 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelReservation = async (bookId: number) => {
        try {
            setLoading(true);
            await cancelReservation(bookId);
            await refreshMe();
            Alert.alert('완료', '예약이 취소되었습니다.');
        } catch (error) {
            Alert.alert('예약취소 실패', error instanceof Error ? error.message : '예약취소 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerBackground}>
                <View style={styles.headerContent}>
                    <View style={styles.userRow}>
                        <Icon name="account-circle-outline" size={32} color="#101010" />
                        <Text style={styles.loginText}>{user ? `${user.nickname}님` : '로그인을 해주세요'}</Text>
                    </View>
                    {loading && <ActivityIndicator />}
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {!!message && <Text style={styles.messageText}>{message}</Text>}

                {!user ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{mode === 'login' ? '자체 로그인' : '회원가입'}</Text>
                        <View style={styles.thickLine} />

                        <TextInput
                            style={styles.input}
                            placeholder="아이디"
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                        />
                        {mode === 'signup' && (
                            <>
                                <TextInput style={styles.input} placeholder="닉네임" value={nickname} onChangeText={setNickname} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="이메일"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </>
                        )}
                        <TextInput
                            style={styles.input}
                            placeholder="비밀번호"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={mode === 'login' ? handleLogin : handleSignup}
                            disabled={loading}
                        >
                            <Text style={styles.primaryButtonText}>{mode === 'login' ? '로그인' : '가입하고 로그인'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.linkButton} onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
                            <Text style={styles.linkButtonText}>
                                {mode === 'login' ? '계정이 없나요? 회원가입' : '이미 계정이 있나요? 로그인'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>기본정보</Text>
                            <View style={styles.thickLine} />
                            <Text style={styles.infoText}>아이디: {user.username}</Text>
                            <Text style={styles.infoText}>이메일: {user.email}</Text>

                            <TextInput style={styles.input} placeholder="닉네임" value={editNickname} onChangeText={setEditNickname} />
                            <TextInput
                                style={styles.input}
                                placeholder="이메일"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                value={editEmail}
                                onChangeText={setEditEmail}
                            />
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.primaryButtonSmall} onPress={handleUpdateMe} disabled={loading}>
                                    <Text style={styles.primaryButtonText}>정보 수정</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.secondaryButtonSmall} onPress={handleLogout} disabled={loading}>
                                    <Text style={styles.secondaryButtonText}>로그아웃</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>대출 중인 도서</Text>
                            <View style={styles.thickLine} />
                            {loans.length === 0 ? (
                                <Text style={styles.emptyText}>현재 대출 중인 도서가 없습니다.</Text>
                            ) : (
                                loans.map((loan) => (
                                    <View key={loan.loanId} style={styles.card}>
                                        <Text style={styles.cardTitle}>{loan.bookTitle}</Text>
                                        <Text style={styles.cardMeta}>저자: {loan.bookAuthor}</Text>
                                        <Text style={styles.cardMeta}>대출일: {formatDate(loan.borrowedAt)}</Text>
                                        <TouchableOpacity style={styles.secondaryButtonSmall} onPress={() => handleReturn(loan.bookId)}>
                                            <Text style={styles.secondaryButtonText}>반납하기</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>예약 중인 도서</Text>
                            <View style={styles.thickLine} />
                            {reservations.length === 0 ? (
                                <Text style={styles.emptyText}>현재 예약 중인 도서가 없습니다.</Text>
                            ) : (
                                reservations.map((reservation) => (
                                    <View key={reservation.reservationId} style={styles.card}>
                                        <Text style={styles.cardTitle}>{reservation.bookTitle}</Text>
                                        <Text style={styles.cardMeta}>저자: {reservation.bookAuthor}</Text>
                                        <Text style={styles.cardMeta}>예약일: {formatDate(reservation.createdAt)}</Text>
                                        <TouchableOpacity
                                            style={styles.secondaryButtonSmall}
                                            onPress={() => handleCancelReservation(reservation.bookId)}
                                        >
                                            <Text style={styles.secondaryButtonText}>예약취소</Text>
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 28 },
    headerBackground: { height: 80, backgroundColor: '#ffe787', justifyContent: 'center', paddingHorizontal: 20 },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    userRow: { flexDirection: 'row', alignItems: 'center' },
    loginText: { fontSize: 20, fontWeight: 'bold', color: '#101010', marginLeft: 10 },
    section: { marginTop: 25, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#000', marginBottom: 8 },
    thickLine: { height: 2, backgroundColor: '#000', marginBottom: 18 },
    input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 14, height: 48, marginBottom: 10, fontSize: 15, backgroundColor: '#fff' },
    primaryButton: { backgroundColor: '#111', borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
    primaryButtonSmall: { flex: 1, backgroundColor: '#111', borderRadius: 12, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
    primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '900' },
    secondaryButtonSmall: { borderWidth: 1, borderColor: '#111', borderRadius: 12, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, marginTop: 10 },
    secondaryButtonText: { color: '#111', fontSize: 15, fontWeight: '900' },
    linkButton: { alignItems: 'center', paddingVertical: 16 },
    linkButtonText: { color: '#333', fontWeight: '800' },
    messageText: { marginHorizontal: 20, marginTop: 18, backgroundColor: '#fff7cc', color: '#333', padding: 12, borderRadius: 12, fontWeight: '700' },
    infoText: { fontSize: 15, color: '#333', marginBottom: 8 },
    buttonRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
    emptyText: { color: '#777', lineHeight: 20 },
    card: { borderWidth: 1, borderColor: '#eee', borderRadius: 14, padding: 14, marginBottom: 10, backgroundColor: '#fff' },
    cardTitle: { fontSize: 16, color: '#111', fontWeight: '900', marginBottom: 6 },
    cardMeta: { fontSize: 13, color: '#555', lineHeight: 20 },
});
