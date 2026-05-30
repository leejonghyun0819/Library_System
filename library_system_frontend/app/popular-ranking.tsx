import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PopularBook, User, borrowBook, getMe, getPopularBooks, reserveBook } from '@/constants/api';

function statusLabel(status?: PopularBook['status']) {
  if (status === 'AVAILABLE') return '대출 가능';
  if (status === 'RESERVED') return '예약 중';
  if (status === 'BORROWED') return '대출 중';
  return '-';
}

export default function PopularRankingScreen() {
  const router = useRouter();
  const [ranking, setRanking] = useState<PopularBook[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionBookId, setActionBookId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setMessage('');
      const [items, meResult] = await Promise.allSettled([getPopularBooks(30), getMe()]);
      if (items.status === 'fulfilled') {
        setRanking(items.value);
        if (items.value.length === 0) {
          setMessage('아직 대출/예약 이력이 없습니다. 사용자가 예약하거나 대출하면 이 화면에 자동으로 순위가 표시됩니다.');
        }
      } else {
        setRanking([]);
        setMessage(items.reason instanceof Error ? items.reason.message : '인기순위를 불러오지 못했습니다.');
      }
      setUser(meResult.status === 'fulfilled' ? meResult.value : null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  const requireLogin = () => {
    if (user) return true;
    Alert.alert('로그인 필요', '프로필 탭에서 먼저 로그인해주세요.');
    return false;
  };

  const handleAction = async (bookId: number, action: 'reserve' | 'borrow') => {
    if (!requireLogin()) return;
    try {
      setActionBookId(bookId);
      if (action === 'reserve') await reserveBook(bookId);
      if (action === 'borrow') await borrowBook(bookId);
      await load();
      Alert.alert('완료', '요청이 정상 처리되었습니다.');
    } catch (error) {
      Alert.alert('처리 실패', error instanceof Error ? error.message : '요청 처리 중 오류가 발생했습니다.');
    } finally {
      setActionBookId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>인기순위</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>대출 이력과 예약 이력을 집계해 순위를 계산합니다. 점수는 대출 2점, 예약 1점 기준입니다.</Text>
        {loading && <ActivityIndicator style={styles.loading} />}
        {!!message && <Text style={styles.message}>{message}</Text>}

        {ranking.map((book, index) => {
          const busy = actionBookId === book.bookId;
          return (
            <View key={book.bookId} style={styles.card}>
              <View style={styles.rankBadge}><Text style={styles.rankText}>{index + 1}</Text></View>
              <View style={styles.bookRow}>
                {!!book.imageurl && <Image source={{ uri: book.imageurl }} style={styles.cover} />}
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.meta}>저자: {book.author || '-'}</Text>
                  <Text style={styles.meta}>분류: {book.category || '-'}</Text>
                  <Text style={styles.meta}>상태: {statusLabel(book.status)}</Text>
                  <Text style={styles.score}>대출 {book.loanCount}회 · 예약 {book.reservationCount}회 · 점수 {book.popularityScore}</Text>
                </View>
              </View>
              {book.status === 'AVAILABLE' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.outlineButton} disabled={busy} onPress={() => handleAction(book.bookId, 'reserve')}>
                    <Text style={styles.outlineButtonText}>예약</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.blackButton} disabled={busy} onPress={() => handleAction(book.bookId, 'borrow')}>
                    <Text style={styles.blackButtonText}>대출</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
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
  description: { color: '#555', lineHeight: 21, marginBottom: 14 },
  loading: { marginVertical: 20 },
  message: { color: '#666', backgroundColor: '#fff7cc', padding: 12, borderRadius: 12, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 16, padding: 14, marginBottom: 12, backgroundColor: '#fff' },
  rankBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  rankText: { color: '#fff', fontWeight: '900' },
  bookRow: { flexDirection: 'row', gap: 12 },
  cover: { width: 54, height: 76, borderRadius: 8, backgroundColor: '#f1f1f1' },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 6 },
  meta: { fontSize: 13, color: '#555', lineHeight: 20 },
  score: { marginTop: 8, fontSize: 13, color: '#111', fontWeight: '900' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  outlineButton: { minWidth: 86, borderWidth: 1, borderColor: '#111', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
  outlineButtonText: { color: '#111', fontWeight: '900' },
  blackButton: { minWidth: 86, backgroundColor: '#111', borderRadius: 12, paddingVertical: 11, paddingHorizontal: 12, alignItems: 'center' },
  blackButtonText: { color: '#fff', fontWeight: '900' },
});
