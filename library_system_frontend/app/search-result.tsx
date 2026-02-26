import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BookData {
  id: string; category: string; number: string; title: string; author: string; publisher: string; isbn: string;
}

export default function SearchResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [searchText, setSearchText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  
  const [searchCategory, setSearchCategory] = useState("전체");
  const [submittedCategory, setSubmittedCategory] = useState("전체");
  
  const [selectedSort, setSelectedSort] = useState("정확도순");
  const [selectedType, setSelectedType] = useState("전체도서");
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isSortModalVisible, setSortModalVisible] = useState(false);

  useEffect(() => {
    if (params.q !== undefined || params.cat !== undefined) {
      const qValue = (params.q as string) || "";
      const catValue = (params.cat as string) || "전체";
      
      setSearchText(qValue);
      setSearchCategory(catValue);

      // 🚨 전달받은 검색어가 2글자 이상일 때만 검색 완료 상태로 만듦
      if (qValue.trim().length >= 2) {
        setSubmittedText(qValue);
        setSubmittedCategory(catValue);
        setHasSearched(true);
      } else {
        setHasSearched(false);
      }
    }
  }, [params.q, params.cat]);

  const allBooks: BookData[] = [
    { id: '1', category: '아동도서', number: '101', title: '해리포터와 마법사의 돌', author: 'J.K. 롤링', publisher: '문학수첩', isbn: '9788983920677' },
    { id: '2', category: '일반도서', number: '102', title: '채식주의자', author: '한강', publisher: '창비', isbn: '9788936433598' },
    { id: '3', category: '일반도서', number: '103', title: '리액트 네이티브 정석', author: '홍길동', publisher: '이지스퍼블리싱', isbn: '1234567890123' },
    { id: '4', category: '아동도서', number: '104', title: '강아지똥', author: '권정생', publisher: '길벗어린이', isbn: '9788973010444' },
    { id: '5', category: '일반도서', number: '105', title: '개발자의 품격', author: '김개발', publisher: '가나출판사', isbn: '9788911111111' },
  ];

  // 🚨 [수정됨] 결과 화면 내의 검색 실행 로직
  const handleSearch = () => {
    const cleanText = searchText.trim();
    
    // 비어있으면 목록 숨기기
    if (cleanText === "") {
        setHasSearched(false);
        return;
    }

    // 2글자 미만이면 경고창 띄우기
    if (cleanText.length < 2) {
        Alert.alert(
            "알림", 
            "검색어는 두 글자 이상 입력해주세요.", 
            [{ text: "확인" }]
        );
        return;
    }

    setSubmittedText(searchText);
    setSubmittedCategory(searchCategory);
    setHasSearched(true);
  };

  const filteredBooks = allBooks.filter((book) => {
    if (!hasSearched) return false;

    // 쉼표(,)나 띄어쓰기 둘 중 하나라도 있으면 단어를 쪼갬 (다중 검색)
    const keywords = submittedText.toLowerCase().trim().split(/[,\s]+/);
    
    const matchText = keywords.some(kw => {
      if (kw === "") return false; 

      if (submittedCategory === "전체") {
        return book.title.toLowerCase().includes(kw) || 
               book.author.toLowerCase().includes(kw) || 
               book.publisher.toLowerCase().includes(kw);
      } else if (submittedCategory === "서명") {
        return book.title.toLowerCase().includes(kw);
      } else if (submittedCategory === "저자") {
        return book.author.toLowerCase().includes(kw);
      } else if (submittedCategory === "출판사") {
        return book.publisher.toLowerCase().includes(kw);
      }
      return false;
    });
    
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
      
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back-circle" size={30} color="#e5b05c" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>검색결과</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        
        {/* 검색 섹션 */}
        <View style={styles.searchSection}>
          <View style={styles.searchBox}>
            <TouchableOpacity style={styles.searchDropdownBtn} onPress={() => setCategoryModalVisible(true)}>
              <Text style={styles.dropdownText}>{searchCategory}</Text>
              <Ionicons name="caret-down" size={12} color="#e5b05c" />
            </TouchableOpacity>
            <TextInput style={styles.searchInput} value={searchText} onChangeText={setSearchText} onSubmitEditing={handleSearch} placeholder="검색어 입력" />
            <TouchableOpacity style={styles.searchBtnInner} onPress={handleSearch}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.countText}>검색건수 : <Text style={{ fontWeight: 'bold' }}>{hasSearched ? sortedBooks.length : 0}</Text> 건</Text>
        </View>

        <View style={styles.divider} />

        {/* 정렬 섹션 */}
        <View style={styles.sortSection}>
          <TouchableOpacity style={styles.sortBtn} onPress={() => setSortModalVisible(true)}>
            <Text style={styles.sortBtnText}>{selectedSort}</Text>
            <Ionicons name="caret-down" size={12} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* 라디오 버튼 */}
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
        
        {/* 리스트 영역 */}
        <View style={styles.listSection}>
          {!hasSearched ? (
             <View style={styles.emptyContainer}>
               <Ionicons name="search-outline" size={60} color="#ccc" />
               <Text style={styles.emptyText}>원하는 도서를 검색해주세요.</Text>
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
                  <TouchableOpacity onPress={() => toggleCheck(item.id)} style={styles.checkboxTouchArea} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
                    <Ionicons name={checkedItems[item.id] ? "checkbox" : "square-outline"} size={24} color={checkedItems[item.id] ? "#e5b05c" : "black"} />
                  </TouchableOpacity>
                  
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                  
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
            ))
          )}
        </View>
      </ScrollView>

      {/* 모달 1: 검색 기준 선택 */}
      <Modal visible={isCategoryModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCategoryModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>검색 기준</Text>
            {["전체", "서명", "저자", "출판사"].map(opt => (
              <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => { setSearchCategory(opt); setCategoryModalVisible(false); }}>
                <Text style={searchCategory === opt ? styles.modalOptionTextSel : styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 모달 2: 정렬 기준 선택 */}
      <Modal visible={isSortModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSortModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>정렬 기준</Text>
            {["정확도순", "저자순", "출판사순"].map(opt => (
              <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => { setSelectedSort(opt); setSortModalVisible(false); }}>
                <Text style={selectedSort === opt ? styles.modalOptionTextSel : styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backBtn: { position: 'absolute', left: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  
  searchSection: { padding: 15, alignItems: 'center' },
  searchBox: { flexDirection: 'row', width: '100%', height: 45, borderWidth: 2, borderColor: '#e5b05c', borderRadius: 5, backgroundColor: 'white' },
  searchDropdownBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 75, height: '100%', borderRightWidth: 1, borderColor: '#ddd', gap: 5 },
  dropdownText: { fontSize: 12, fontWeight: 'bold' },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 14 },
  searchBtnInner: { width: 50, backgroundColor: '#e5b05c', alignItems: 'center', justifyContent: 'center' },
  countText: { alignSelf: 'flex-start', marginLeft: 5, marginTop: 10, fontSize: 12 },
  
  sortSection: { padding: 10, paddingLeft: 15 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D9D9D9', width: 80, height: 25, justifyContent: 'center', gap: 5 },
  sortBtnText: { fontSize: 11, fontWeight: 'bold' },
  
  divider: { height: 1, backgroundColor: '#000' },
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
  bookTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  checkboxTouchArea: { padding: 5, paddingRight: 10 },
  bookTitle: { fontSize: 12, fontWeight: 'bold', flex: 1 },
  categoryBadge: { borderWidth: 1, borderColor: '#000', paddingHorizontal: 4, paddingVertical: 2 },
  categoryBadgeText: { fontSize: 10, fontWeight: 'bold' },
  bookNumber: { fontSize: 11 },
  bookInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bookDetails: { flex: 1, gap: 5 },
  detailText: { fontSize: 12, color: '#555' },
  bookCoverPlaceholder: { width: 70, height: 100, backgroundColor: '#D9D9D9' },
  bottomGrayBox: { height: 40, backgroundColor: '#D9D9D9', marginTop: 15 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { marginTop: 15, fontSize: 16, color: '#999', fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 250, backgroundColor: 'white', borderRadius: 10, padding: 20, elevation: 5 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#eee' },
  modalOption: { paddingVertical: 12, alignItems: 'center' },
  modalOptionText: { fontSize: 15, color: '#333' },
  modalOptionTextSel: { fontSize: 15, color: '#e5b05c', fontWeight: 'bold' },
});