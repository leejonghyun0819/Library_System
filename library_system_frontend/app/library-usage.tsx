import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Loan, Reservation, User, cancelReservation, getMe, getMyLoans, getMyReservations, returnBook } from '@/constants/api';

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString('ko-KR');
}

export default function LibraryUsageScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const me = await getMe();
      setUser(me);
      const [loanList, reservationList] = await Promise.all([getMyLoans(), getMyReservations()]);
      setLoans(loanList);
      setReservations(reservationList);
      setMessage('');
    } catch {
      setUser(null);
      setLoans([]);
      setReservations([]);
      setMessage('로그인이 필요합니다. 프로필 탭에서 로그인해주세요.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  const handleReturn = async (bookId: number) => {
    try {
      await returnBook(bookId);
      await load();
      Alert.alert('완료', '반납되었습니다.');
    } catch (error) {
      Alert.alert('반납 실패', error instanceof Error ? error.message : '반납 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = async (bookId: number) => {
    try {
      await cancelReservation(bookId);
      await load();
      Alert.alert('완료', '예약이 취소되었습니다.');
    } catch (error) {
      Alert.alert('예약취소 실패', error instanceof Error ? error.message : '예약취소 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>도서이용정보</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!!message && (
          <View style={styles.card}>
            <Text style={styles.description}>{message}</Text>
            <TouchableOpacity style={styles.blackButton} onPress={() => router.push('/profile' as any)}>
              <Text style={styles.blackButtonText}>프로필에서 로그인</Text>
            </TouchableOpacity>
          </View>
        )}

        {!!user && (
          <>
            <Text style={styles.userText}>{user.nickname}님의 이용정보</Text>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>대출 중인 도서</Text>
              {loans.length === 0 ? <Text style={styles.empty}>현재 대출 중인 도서가 없습니다.</Text> : loans.map((loan) => (
                <View key={loan.loanId} style={styles.card}>
                  <Text style={styles.bookTitle}>{loan.bookTitle}</Text>
                  <Text style={styles.meta}>저자: {loan.bookAuthor}</Text>
                  <Text style={styles.meta}>대출일: {formatDate(loan.borrowedAt)}</Text>
                  <TouchableOpacity style={styles.outlineButton} onPress={() => handleReturn(loan.bookId)}>
                    <Text style={styles.outlineButtonText}>반납하기</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>예약 중인 도서</Text>
              {reservations.length === 0 ? <Text style={styles.empty}>현재 예약 중인 도서가 없습니다.</Text> : reservations.map((reservation) => (
                <View key={reservation.reservationId} style={styles.card}>
                  <Text style={styles.bookTitle}>{reservation.bookTitle}</Text>
                  <Text style={styles.meta}>저자: {reservation.bookAuthor}</Text>
                  <Text style={styles.meta}>예약일: {formatDate(reservation.createdAt)}</Text>
                  <TouchableOpacity style={styles.outlineButton} onPress={() => handleCancel(reservation.bookId)}>
                    <Text style={styles.outlineButtonText}>예약취소</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  header: { height: 64, backgroundColor: '#ffe787', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  headerButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#111' },
  content: { padding: 20, paddingBottom: 40 },
  userText: { fontSize: 17, fontWeight: '900', color: '#111', marginBottom: 12 },
  section: { marginBottom: 22 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#111', marginBottom: 10 },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 16, padding: 14, marginBottom: 12, backgroundColor: '#fff' },
  description: { color: '#666', lineHeight: 21, marginBottom: 14 },
  empty: { color: '#777', lineHeight: 20 },
  bookTitle: { fontSize: 16, color: '#111', fontWeight: '900', marginBottom: 6 },
  meta: { fontSize: 13, color: '#555', lineHeight: 20 },
  outlineButton: { marginTop: 10, borderWidth: 1, borderColor: '#111', borderRadius: 12, minHeight: 44, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  outlineButtonText: { color: '#111', fontWeight: '900' },
  blackButton: { backgroundColor: '#111', borderRadius: 12, minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  blackButtonText: { color: '#fff', fontWeight: '900' },
});
