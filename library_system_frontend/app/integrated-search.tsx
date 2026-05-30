import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book, User, borrowBook, cancelReservation, getMe, reserveBook, searchBooks } from '@/constants/api';

function statusLabel(status?: Book['status']) {
  if (status === 'AVAILABLE') return '대출 가능';
  if (status === 'RESERVED') return '예약 중';
  if (status === 'BORROWED') return '대출 중';
  return '-';
}

export default function IntegratedSearchScreen() {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [lastKeyword, setLastKeyword] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionBookId, setActionBookId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      getMe().then(setUser).catch(() => setUser(null));
    }, [])
  );

  const runSearch = async (value = keyword) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setMessage('검색어를 입력해주세요.');
      setBooks([]);
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const result = await searchBooks(trimmed);
      setBooks(result);
      setLastKeyword(trimmed);
      if (result.length === 0) setMessage('검색 결과가 없습니다.');
    } catch (error) {
      setBooks([]);
      setMessage(error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (lastKeyword) {
      const result = await searchBooks(lastKeyword);
      setBooks(result);
    }
  };

  const requireLogin = () => {
    if (user) return true;
    Alert.alert('로그인 필요', '프로필 탭에서 먼저 로그인해주세요.');
    return false;
  };

  const handleAction = async (bookId: number, action: 'reserve' | 'cancel' | 'borrow') => {
    if (!requireLogin()) return;
    try {
      setActionBookId(bookId);
      if (action === 'reserve') await reserveBook(bookId);
      if (action === 'cancel') await cancelReservation(bookId);
      if (action === 'borrow') await borrowBook(bookId);
      await refresh();
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
        <Text style={styles.headerTitle}>통합자료검색</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.description}>실제 DB의 제목, 저자, 출판사, 분류, ISBN을 한 번에 검색합니다.</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="검색어를 입력해주세요"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={() => runSearch()}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => runSearch()}>
            <Text style={styles.searchButtonText}>검색</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator style={styles.loading} />}
        {!!message && <Text style={styles.message}>{message}</Text>}

        {books.map((book) => {
          const isMyReservation = !!user && book.reservedByUserId === user.id;
          const busy = actionBookId === book.id;
          return (
            <View key={book.id} style={styles.card}>
              <View style={styles.bookRow}>
                {!!book.imageurl && <Image source={{ uri: book.imageurl }} style={styles.cover} />}
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.meta}>저자: {book.author || '-'}</Text>
                  <Text style={styles.meta}>출판사: {book.publisher || '-'}</Text>
                  <Text style={styles.meta}>분류: {book.category || '-'}</Text>
                  <Text style={styles.meta}>ISBN: {book.isbn || '-'}</Text>
                  <Text style={styles.status}>상태: {statusLabel(book.status)}</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                {book.status === 'AVAILABLE' && (
                  <>
                    <TouchableOpacity style={styles.outlineButton} disabled={busy} onPress={() => handleAction(book.id, 'reserve')}>
                      <Text style={styles.outlineButtonText}>예약</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.blackButton} disabled={busy} onPress={() => handleAction(book.id, 'borrow')}>
                      <Text style={styles.blackButtonText}>대출</Text>
                    </TouchableOpacity>
                  </>
                )}
                {book.status === 'RESERVED' && isMyReservation && (
                  <>
                    <TouchableOpacity style={styles.outlineButton} disabled={busy} onPress={() => handleAction(book.id, 'cancel')}>
                      <Text style={styles.outlineButtonText}>예약취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.blackButton} disabled={busy} onPress={() => handleAction(book.id, 'borrow')}>
                      <Text style={styles.blackButtonText}>대출</Text>
                    </TouchableOpacity>
                  </>
                )}
                {book.status === 'RESERVED' && !isMyReservation && <Text style={styles.info}>다른 사용자가 예약 중입니다.</Text>}
                {book.status === 'BORROWED' && <Text style={styles.info}>현재 대출 중입니다.</Text>}
              </View>
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
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 12, paddingHorizontal: 14, height: 48, backgroundColor: '#fff' },
  searchButton: { width: 72, height: 48, borderRadius: 12, backgroundColor: '#111', alignItems: 'center', justifyContent: 'center' },
  searchButtonText: { color: '#fff', fontWeight: '900' },
  loading: { marginVertical: 20 },
  message: { color: '#666', backgroundColor: '#fff7cc', padding: 12, borderRadius: 12, marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 14, padding: 14, marginBottom: 12, backgroundColor: '#fff' },
  bookRow: { flexDirection: 'row', gap: 12 },
  cover: { width: 54, height: 76, borderRadius: 8, backgroundColor: '#f1f1f1' },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 6 },
  meta: { fontSize: 13, color: '#555', lineHeight: 20 },
  status: { marginTop: 6, fontSize: 13, color: '#111', fontWeight: '900' },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' },
  outlineButton: { minWidth: 86, borderWidth: 1, borderColor: '#111', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' },
  outlineButtonText: { color: '#111', fontWeight: '900' },
  blackButton: { minWidth: 86, backgroundColor: '#111', borderRadius: 12, paddingVertical: 11, paddingHorizontal: 12, alignItems: 'center' },
  blackButtonText: { color: '#fff', fontWeight: '900' },
  info: { color: '#666', fontWeight: '700', lineHeight: 20 },
});
