import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const guideItems = [
  { title: '자료검색', body: '통합자료검색 메뉴에서 제목, 저자, 출판사, 분류, ISBN으로 도서를 검색할 수 있습니다.' },
  { title: '예약', body: '대출 가능한 도서는 예약할 수 있습니다. 예약한 도서는 내 도서이용정보에서 확인하고 취소할 수 있습니다.' },
  { title: '대출', body: '대출 가능한 도서는 바로 대출할 수 있습니다. 내가 예약한 도서도 대출할 수 있습니다.' },
  { title: '반납', body: '반납은 도서이용정보 또는 프로필 화면의 대출 중인 도서 목록에서 진행합니다.' },
  { title: '인기순위', body: '대출/예약 이력이 쌓이면 인기순위 메뉴에서 자동으로 순위가 계산됩니다.' },
];

export default function LibraryGuideScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>이용안내</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {guideItems.map((item) => (
          <View key={item.title} style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        ))}
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
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 16, padding: 16, marginBottom: 12, backgroundColor: '#fff' },
  title: { fontSize: 17, fontWeight: '900', color: '#111', marginBottom: 8 },
  body: { color: '#555', lineHeight: 22 },
});
