import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
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

  // --- 상태 관리 (메모장) ---
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

  // 메뉴 닫기 함수
  const closeAllMenus = () => {
    setIsCategoryOpen(false);
    setIsSortOpen(false);
  };

  // --- 임시 데이터 ---
  const allBooks: BookData[] = [
    { id: '1', category: '아동도서', number: '101', title: '해리포터와 마법사의 돌', author: 'J.K. 롤링', publisher: '문학수첩', isbn: '9788983920677' },
    { id: '2', category: '일반도서', number: '102', title: '채식주의자', author: '한강', publisher: '창비', isbn: '9788936433598' },
    { id: '3', category: '일반도서', number: '103', title: '리액트 네이티브 정석', author: '홍길동', publisher: '이지스퍼블리싱', isbn: '1234567890123' },
    { id: '4', category: '아동도서', number: '104', title: '강아지똥', author: '권정생', publisher: '길벗어린이', isbn: '9788973010444' },
    { id: '5', category: '일반도서', number: '105', title: '개발자의 품격', author: '김개발', publisher: '가나출판사', isbn: '9788911111111' },
  ];

  // --- 기능 함수 ---
  const handleSearch = () => {
    setSubmittedText(searchText);
    setSubmittedCategory(searchCategory);
    setHasSearched(true);
    closeAllMenus();
  };

  const filteredBooks = allBooks.filter((book) => {
    if (!hasSearched) return false;
    let matchText = false;
    if (submittedText === "") {
      matchText = true;
    } else {
      if (submittedCategory === "전체") {
        matchText = book.title.includes(submittedText) || book.author.includes(submittedText) || book.publisher.includes(submittedText);
      } else if (submittedCategory === "서명") {
        matchText = book.title.includes(submittedText);
      } else if (submittedCategory === "저자") {
        matchText = book.author.includes(submittedText);
      } else if (submittedCategory === "출판사") {
        matchText = book.publisher.includes(submittedText);
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
      
      {/* 1. 상단 헤더 (뒤로가기) */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back-circle" size={30} color="#e5b05c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>검색결과</Text>
          <View style={{ width: 30 }} />
        </View>
      </View>

      {/* 2. 메인 스크롤뷰 (내용물) */}
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="always">
        
        {/* 검색 섹션 */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <TouchableOpacity 
              style={styles.searchDropdown} 
              onPress={() => {
                setIsCategoryOpen(!isCategoryOpen);
                setIsSortOpen(false);
              }}
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
            검색건수 :  <Text style={{ fontWeight: 'bold' }}>{sortedBooks.length}</Text> 건
          </Text>
        </View>

        <View style={styles.divider} />

        {/* 정렬 섹션 */}
        <View style={styles.sortSection}>
          <TouchableOpacity 
            style={styles.sortButton} 
            onPress={() => {
              setIsSortOpen(!isSortOpen);
              setIsCategoryOpen(false);
            }}
          >
            <Text style={styles.sortButtonText}>{selectedSort}</Text>
            <Ionicons name="caret-down" size={12} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* 필터(라디오) 섹션 */}
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

        {/* 액션 버튼 */}
        <View style={styles.actionButtonSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>관심자료담기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>관심자료보기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* 결과 리스트 */}
        <View style={styles.listSection}>
          {!hasSearched ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-circle-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>원하시는 도서를 검색해주세요.</Text>
            </View>
          ) : sortedBooks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            </View>
          ) : (
            sortedBooks.map((item) => (
              <View key={item.id} style={styles.bookItem}>
                <View style={styles.bookTitleRow}>
                  <TouchableOpacity onPress={() => toggleCheck(item.id)} style={{ paddingRight: 5 }}>
                    <Ionicons name={checkedItems[item.id] ? "checkbox" : "square-outline"} size={20} color={checkedItems[item.id] ? "#e5b05c" : "black"} />
                  </TouchableOpacity>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>카테고리</Text>
                  </View>
                  <Text style={styles.bookNumber}>{item.number}</Text>
                  <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
                </View>

                <View style={styles.bookInfoRow}>
                  <View style={styles.bookDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>저자:</Text>
                      <Text style={styles.detailValue}>{item.author}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>출판사:</Text>
                      <Text style={styles.detailValue}>{item.publisher}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>ISBN:</Text>
                      <Text style={styles.detailValue}>{item.isbn}</Text>
                    </View>
                  </View>
                  <View style={styles.bookCoverPlaceholder} />
                </View>
                <View style={styles.bottomGrayBox} />
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* 🚨 [터치 버그 해결사] 최상단 레이어 영역 */}
      
      {/* 메뉴 열렸을 때 투명 배경 */}
      {(isCategoryOpen || isSortOpen) && (
        <TouchableOpacity 
          style={styles.fullScreenOverlay} 
          activeOpacity={1} 
          onPress={closeAllMenus} 
        />
      )}

      {/* 검색 카테고리 드롭다운 */}
      {isCategoryOpen && (
        <View style={[styles.absoluteMenu, { top: 110, left: 33 }]}>
          {["전체", "서명", "저자", "출판사"].map((option) => (
            <TouchableOpacity 
              key={option} 
              style={styles.menuOption}
              onPress={() => {
                setSearchCategory(option);
                setIsCategoryOpen(false);
              }}
            >
              <Text style={searchCategory === option ? styles.menuOptionTextSelected : styles.menuOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 정렬 드롭다운 */}
      {isSortOpen && (
        <View style={[styles.absoluteMenu, { top: 195, left: 15 }]}>
          {["정확도순", "저자순", "출판사순"].map((option) => (
            <TouchableOpacity 
              key={option} 
              style={styles.menuOption}
              onPress={() => {
                setSelectedSort(option);
                setIsSortOpen(false);
              }}
            >
              <Text style={selectedSort === option ? styles.menuOptionTextSelected : styles.menuOptionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', left: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  divider: { height: 1, backgroundColor: '#000', width: '100%' },
  searchSection: { padding: 15, alignItems: 'center', backgroundColor: 'white' },
  searchBox: { flexDirection: 'row', width: '90%', height: 45, borderWidth: 2, borderColor: '#e5b05c', borderRadius: 5, backgroundColor: 'white' },
  searchDropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, gap: 5, borderRightWidth: 1, borderColor: '#ddd' },
  dropdownText: { fontSize: 12, fontWeight: 'bold', minWidth: 25 },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 14 },
  searchButton: { width: 50, backgroundColor: '#e5b05c', alignItems: 'center', justifyContent: 'center' },
  countText: { alignSelf: 'flex-start', marginLeft: 20, marginTop: 10, fontSize: 12 },
  sortSection: { padding: 10, paddingLeft: 15, backgroundColor: 'white' },
  sortButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D9D9D9', width: 80, height: 25, justifyContent: 'center', gap: 5 },
  sortButtonText: { fontSize: 11, fontWeight: 'bold' },
  radioSection: { flexDirection: 'row', padding: 15, gap: 20, paddingLeft: 20 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  radioOuter: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#D9D9D9', alignItems: 'center', justifyContent: 'center' },
  radioActiveOuter: { backgroundColor: '#bbb' },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333' },
  radioText: { fontSize: 12, fontWeight: 'bold' },
  actionButtonSection: { flexDirection: 'row', padding: 15, gap: 10 },
  actionButton: { backgroundColor: '#D9D9D9', paddingVertical: 5, paddingHorizontal: 10 },
  actionButtonText: { fontSize: 11, fontWeight: 'bold' },
  listSection: { padding: 15 },
  bookItem: { marginBottom: 30 },
  bookTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 10 },
  categoryBadge: { borderWidth: 1, borderColor: '#000', paddingHorizontal: 4, paddingVertical: 2 },
  categoryBadgeText: { fontSize: 10, fontWeight: 'bold' },
  bookNumber: { fontSize: 11, fontWeight: 'bold' },
  bookTitle: { fontSize: 12, fontWeight: 'bold', flex: 1 },
  bookInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bookDetails: { flex: 1, gap: 5 },
  detailRow: { flexDirection: 'row', gap: 10 },
  detailLabel: { fontSize: 12, width: 50 },
  detailValue: { fontSize: 12, fontWeight: 'bold' },
  bookCoverPlaceholder: { width: 70, height: 100, backgroundColor: '#D9D9D9' },
  bottomGrayBox: { height: 50, backgroundColor: '#D9D9D9', marginTop: 15, width: '100%' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
  emptyText: { marginTop: 10, fontSize: 14, color: '#999', fontWeight: 'bold' },

  // 🔽 메뉴가 가장 앞에 뜨고 잘 눌리게 하는 스타일
  fullScreenOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 },
  absoluteMenu: { position: 'absolute', backgroundColor: 'white', borderRadius: 5, elevation: 1001, zIndex: 1001, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, borderWidth: 1, borderColor: '#e5b05c', width: 80, overflow: 'hidden' },
  menuOption: { paddingVertical: 12, width: '100%', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuOptionText: { fontSize: 13, color: '#333' },
  menuOptionTextSelected: { fontSize: 13, color: '#e5b05c', fontWeight: 'bold' },
});