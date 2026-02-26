import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BookData {
  id: string; category: string; number: string; title: string; author: string; publisher: string; isbn: string;
}

export default function InterestListScreen() {
  const router = useRouter();
  const [savedBooks, setSavedBooks] = useState<BookData[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const storedBooks = await AsyncStorage.getItem('interestBooks');
        if (storedBooks) {
          setSavedBooks(JSON.parse(storedBooks));
        }
      } catch (error) {
        console.error("관심자료를 불러오는 중 에러 발생", error);
      }
    };
    loadBooks();
  }, []);

  const handleRemoveBook = async (id: string) => {
    const newBooks = savedBooks.filter(book => book.id !== id);
    setSavedBooks(newBooks);
    await AsyncStorage.setItem('interestBooks', JSON.stringify(newBooks));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-circle" size={30} color="#e5b05c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>관심자료목록</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.countSection}>
          <Text style={styles.countText}>총 <Text style={{ fontWeight: 'bold', color: '#e5b05c' }}>{savedBooks.length}</Text>건의 관심자료가 있습니다.</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.listSection}>
          {savedBooks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bookmark-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>담아둔 관심자료가 없습니다.</Text>
            </View>
          ) : (
            savedBooks.map((item) => (
              <View key={item.id} style={styles.bookItem}>
                <View style={styles.bookTitleRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                  <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
                  <TouchableOpacity onPress={() => handleRemoveBook(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                </View>

                <View style={styles.bookInfoRow}>
                  <View style={styles.bookDetails}>
                     <Text style={styles.detailText}>저자: <Text style={{fontWeight:'bold'}}>{item.author}</Text></Text>
                     <Text style={styles.detailText}>출판사: <Text style={{fontWeight:'bold'}}>{item.publisher}</Text></Text>
                     <Text style={styles.detailText}>ISBN: <Text style={{fontWeight:'bold'}}>{item.isbn}</Text></Text>
                  </View>
                </View>
                <View style={styles.bottomGrayBox} />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backBtn: { position: 'absolute', left: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  countSection: { padding: 15 },
  countText: { fontSize: 14, color: '#333' },
  divider: { height: 1, backgroundColor: '#000' },
  listSection: { padding: 15 },
  bookItem: { marginBottom: 20, padding: 15, borderWidth: 1, borderColor: '#eee', borderRadius: 8 },
  bookTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  bookTitle: { fontSize: 14, fontWeight: 'bold', flex: 1 },
  categoryBadge: { borderWidth: 1, borderColor: '#000', paddingHorizontal: 4, paddingVertical: 2 },
  categoryBadgeText: { fontSize: 10, fontWeight: 'bold' },
  bookInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bookDetails: { flex: 1, gap: 5 },
  detailText: { fontSize: 12, color: '#555' },
  bottomGrayBox: { height: 5, backgroundColor: '#D9D9D9', marginTop: 15, borderRadius: 5 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyText: { marginTop: 15, fontSize: 16, color: '#999', fontWeight: 'bold' },
});