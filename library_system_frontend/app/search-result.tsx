import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BookData {
  id: string;
  category: string;
  number: string;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
}

export default function SearchResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // --- 상태 관리 ---
  const [searchText, setSearchText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchCategory, setSearchCategory] = useState("전체");
  const [submittedCategory, setSubmittedCategory] = useState("전체");
  const [selectedSort, setSelectedSort] = useState("정확도순");
  const [selectedType, setSelectedType] = useState("전체도서");
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // --- 메인 연동 로직 ---
  useEffect(() => {
    if (params.q !== undefined || params.cat !== undefined) {
      const qValue = (params.q as string) || "";
      const catValue = (params.cat as string) || "전체";
      setSearchText(qValue);
      setSearchCategory(catValue);
      setSubmittedText(qValue);
      setSubmittedCategory(catValue);
      setHasSearched(true);
    }
  }, [params.q, params.cat]);

  const closeAllMenus = () => {
    setIsCategoryOpen(false);
    setIsSortOpen(false);
  };

  const allBooks: BookData[] = [
    { id: '1', category: '아동도서', number: '101', title: '해리포터와 마법사의 돌', author: 'J.K. 롤링', publisher: '문학수첩', isbn: '9788983920677' },
    { id: '2', category: '일반도서', number: '102', title: '채식주의자', author: '한강', publisher: '창비', isbn: '9788936433598' },
    { id: '3', category: '일반도서', number: '103', title: '리액트 네이티브 정석', author: '홍길동', publisher: '이지스퍼블리싱', isbn: '1234567890123' },
    { id: '4', category: '아동도서', number: '104', title: '강아지똥', author: '권정생', publisher: '길벗어린이', isbn: '9788973010444' },
    { id: '5', category: '일반도서', number: '105', title: '개발자의 품격', author: '김개발', publisher: '가나출판사', isbn: '9788911111111' },
  ];

  const handleSearch = () => {
    setSubmittedText(searchText);
    setSubmittedCategory(searchCategory);
    setHasSearched(true);
    closeAllMenus();
  };

  const filteredBooks = allBooks.filter((book) => {
    if (!hasSearched) return false;
    const lowerSearch = submittedText.toLowerCase();
    let matchText = false;
    if (submittedText.trim() === "") matchText = true;
    else {
      if (submittedCategory === "전체") {
        matchText = book.title.toLowerCase().includes(lowerSearch) || 
                  book.author.toLowerCase().includes(lowerSearch) || 
                  book.publisher.toLowerCase().includes(lowerSearch);
      } else if (submittedCategory === "서명") {
        matchText = book.title.toLowerCase().includes(lowerSearch);
      } else if (submittedCategory === "저자") {
        matchText = book.author.toLowerCase().includes(lowerSearch);
      } else if (submittedCategory === "출판사") {
        matchText = book.publisher.toLowerCase().includes(lowerSearch);
      }
    }
    const matchType = selectedType === "전체도서" || book.category === selectedType;
    return matchText && matchType;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (selectedSort === "저자순") return a.author.localeCompare(b.author);
    if (selectedSort === "출판사순") return a.publisher.localeCompare(b.publisher);
    return 0;
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* 1. 최상단 터치 레이어 (메뉴 닫기용) */}
      {(isCategoryOpen || isSortOpen) && (
        <TouchableOpacity 
          style={styles.fullOverlay} 
          activeOpacity={1} 
          onPress={closeAllMenus} 
        />
      )}

      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={30} color="#e5b05c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>검색결과</Text>
          <View style={{ width: 30 }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
        {/* 검색 섹션 */}
        <View style={[styles.searchSection, { zIndex: 100 }]}>
          <View style={styles.searchBox}>
            <TouchableOpacity 
              style={styles.searchDropdown} 
              onPress={() => { setIsCategoryOpen(!isCategoryOpen); setIsSortOpen(false); }}
            >
              <Text style={styles.dropdownText}>{searchCategory}</Text>
              <Ionicons name="caret-down" size={12} color="#e5b05c" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="검색어를 입력해주세요"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.countText}>
            검색건수 : <Text style={{ fontWeight: 'bold' }}>{sortedBooks.length}</Text> 건
          </Text>
        </View>

        <View style={styles.divider} />

        {/* 정렬 섹션 */}
        <View style={styles.sortSection}>
          <TouchableOpacity 
            style={styles.sortButton} 
            onPress={() => { setIsSortOpen(!isSortOpen); setIsCategoryOpen(false); }}
          >
            <Text style={styles.sortButtonText}>{selectedSort}</Text>
            <Ionicons name="caret-down" size={12} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* 필터 섹션 */}
        <View style={styles.radioSection}>
          {["전체도서", "일반도서", "아동도서"].map((type) => (
            <TouchableOpacity key={type} style={styles.radioRow} onPress={() => setSelectedType(type)}>
              <View style={[styles.radioOuter, selectedType === type && styles.radioActiveOuter]}>
                {selectedType === type && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        {/* 리스트 섹션 */}
        <View style={styles.listSection}>
          {sortedBooks.map((item) => (
            <View key={item.id} style={styles.bookItem}>
              <View style={styles.bookTitleRow}>
                <TouchableOpacity onPress={() => toggleCheck(item.id)} style={{ paddingRight: 5 }}>
                  <Ionicons name={checkedItems[item.id] ? "checkbox" : "square-outline"} size={20} color={checkedItems[item.id] ? "#e5b05c" : "black"} />
                </TouchableOpacity>
                <View style={styles.categoryBadge}><Text style={styles.categoryBadgeText}>카테고리</Text></View>
                <Text style={styles.bookNumber}>{item.number}</Text>
                <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
              </View>
              <View style={styles.bookInfoRow}>
                <View style={styles.bookDetails}>
                   <Text style={styles.detailText}>저자: <Text style={{fontWeight:'bold'}}>{item.author}</Text></Text>
                   <Text style={styles.detailText}>출판사: <Text style={{fontWeight:'bold'}}>{item.publisher}</Text></Text>
                   <Text style={styles.detailText}>ISBN: <Text style={{fontWeight:'bold'}}>{item.isbn}</Text></Text>
                </View>
                <View style={styles.bookCoverPlaceholder} />
              </View>
              <View style={styles.bottomGrayBox} />
            </View>
          ))}
        </View>
      </ScrollView>
      
      {isCategoryOpen && (
        <View style={[styles.floatingMenu, { top: 122, left: 33, width: 63, borderColor: '#e5b05c', borderWidth: 2, borderTopWidth: 0 }]}>
          {["전체", "서명", "저자", "출판사"].map(opt => (
            <TouchableOpacity key={opt} style={styles.menuOption} onPress={() => { setSearchCategory(opt); setIsCategoryOpen(false); }}>
              <Text style={searchCategory === opt ? styles.menuTextSelected : styles.menuTextNormal}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {isSortOpen && (
        <View style={[styles.floatingMenu, { top: 207, left: 15, width: 80, borderColor: '#D9D9D9', borderWidth: 1, borderTopWidth: 0 }]}>
          {["정확도순", "저자순", "출판사순"].map(opt => (
            <TouchableOpacity key={opt} style={styles.menuOption} onPress={() => { setSelectedSort(opt); setIsSortOpen(false); }}>
              <Text style={selectedSort === opt ? styles.menuTextSelected : styles.menuTextNormal}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  fullOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 },
  header: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', left: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  searchSection: { padding: 15, alignItems: 'center', backgroundColor: 'white' },
  searchBox: { flexDirection: 'row', width: '90%', height: 45, borderWidth: 2, borderColor: '#e5b05c', borderRadius: 5, backgroundColor: 'white' },
  searchDropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRightWidth: 1, borderColor: '#ddd', gap: 5 },
  dropdownText: { fontSize: 12, fontWeight: 'bold', minWidth: 25 },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 14 },
  searchButton: { width: 50, backgroundColor: '#e5b05c', alignItems: 'center', justifyContent: 'center' },
  countText: { alignSelf: 'flex-start', marginLeft: 20, marginTop: 10, fontSize: 12 },
  sortSection: { padding: 10, paddingLeft: 15, backgroundColor: 'white' },
  sortButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D9D9D9', width: 80, height: 25, justifyContent: 'center', gap: 5 },
  sortButtonText: { fontSize: 11, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#000' },
  radioSection: { flexDirection: 'row', padding: 15, gap: 20, paddingLeft: 20 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  radioOuter: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#D9D9D9', alignItems: 'center', justifyContent: 'center' },
  radioActiveOuter: { backgroundColor: '#bbb' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' },
  radioText: { fontSize: 12, fontWeight: 'bold' },
  listSection: { padding: 15 },
  bookItem: { marginBottom: 30 },
  bookTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  categoryBadge: { borderWidth: 1, borderColor: '#000', paddingHorizontal: 4, paddingVertical: 2 },
  categoryBadgeText: { fontSize: 10, fontWeight: 'bold' },
  bookNumber: { fontSize: 11 },
  bookTitle: { fontSize: 12, fontWeight: 'bold', flex: 1 },
  bookInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bookDetails: { flex: 1, gap: 5 },
  detailText: { fontSize: 12 },
  bookCoverPlaceholder: { width: 70, height: 100, backgroundColor: '#D9D9D9' },
  bottomGrayBox: { height: 40, backgroundColor: '#D9D9D9', marginTop: 15 },

  // 드롭다운 레이아웃
  floatingMenu: { 
    position: 'absolute', 
    backgroundColor: 'white', 
    zIndex: 2000, 
    elevation: 2000, 
    borderBottomLeftRadius: 5, 
    borderBottomRightRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuOption: { paddingVertical: 12, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuTextNormal: { fontSize: 13, color: '#333' },
  menuTextSelected: { fontSize: 13, color: '#e5b05c', fontWeight: 'bold' },
});