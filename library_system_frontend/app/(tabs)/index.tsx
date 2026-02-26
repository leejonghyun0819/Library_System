import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, ImageBackground, Modal, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Polygon } from 'react-native-svg';
import { useRouter } from 'expo-router';

// 육각형 메뉴 컴포넌트
const HexagonMenu = ({ icon, title, onPress }: { icon: string; title: string; onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.hexagonWrapper}>
            <Svg height="80" width="80" viewBox="0 0 100 100" style={styles.hexagonSvg}>
                <Polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="white" stroke="#EAEAEA" strokeWidth="2" />
            </Svg>
            <View style={styles.iconOverlay}>
                <MaterialCommunityIcons name={icon as any} size={32} color="#333" />
            </View>
        </View>
        <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
);

export default function LibraryMainScreen() {
    const router = useRouter();
    
    const [searchText, setSearchText] = useState("");
    const [searchCategory, setSearchCategory] = useState("전체");
    const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);

    // 🚨 1. 검색창 돋보기 누를 때 (2글자 이상 검사 O)
    const handleMainSearch = () => {
        const cleanText = searchText.trim();
        
        if (cleanText.length < 2) {
            Alert.alert("알림", "검색어는 두 글자 이상 입력해주세요.", [{ text: "확인" }]);
            return;
        }

        setCategoryModalVisible(false);
        router.push({
            pathname: '/search-result',
            params: { q: searchText, cat: searchCategory }
        } as any);
    };

    // 🚨 2. 육각형 메뉴 누를 때 (검사 없이 그냥 빈 화면으로 이동)
    const handleNavToSearch = () => {
        setCategoryModalVisible(false);
        router.push({
            pathname: '/search-result',
            params: { q: '', cat: '전체' } // 빈 값으로 쿨하게 넘겨줌
        } as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <TouchableOpacity><Ionicons name="menu" size={28} color="#000" /></TouchableOpacity>
                    <View style={styles.titleWrapper}>
                        <Image source={require('@/assets/images/logo1.png')} style={styles.logo1} />
                        <Text style={styles.headerTitle}>성남시 도서관사업소</Text>
                    </View>
                    <TouchableOpacity><Ionicons name="person-circle-outline" size={32} color="#000" /></TouchableOpacity>
                </View>

                {/* 검색 섹션 */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBarContainer}>
                        <TouchableOpacity 
                            style={styles.categorySelector} 
                            onPress={() => setCategoryModalVisible(true)}
                        >
                            <Text style={styles.categoryText}>{searchCategory}</Text>
                            <Ionicons name="caret-down" size={12} color="#e5b05c" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.searchInput}
                            placeholder="검색어를 입력해주세요"
                            value={searchText}
                            onChangeText={setSearchText}
                            onSubmitEditing={handleMainSearch} // 엔터 칠 때는 검사
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleMainSearch}>
                            <Ionicons name="search" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 육각형 메뉴 */}
                <ImageBackground source={require('@/assets/images/background.png')} style={styles.menuBackground} resizeMode="cover">
                    <View style={styles.menuGrid}>
                        {[
                            { id: 1, title: '통합자료검색', icon: 'magnify' },
                            { id: 2, title: '신착자료', icon: 'book-plus-outline' },
                            { id: 3, title: '기본정보', icon: 'account-box-outline' },
                            { id: 4, title: '인기순위', icon: 'crown-outline' },
                            { id: 5, title: '도서이용정보', icon: 'book-open-variant' },
                            { id: 6, title: '이용안내', icon: 'file-document-edit-outline' },
                        ].map((item) => (
                            <HexagonMenu 
                                key={item.id} 
                                icon={item.icon} 
                                title={item.title} 
                                // 🚨 통합자료검색 메뉴는 전용 프리패스 함수 연결
                                onPress={() => { if (item.title === '통합자료검색') handleNavToSearch(); }} 
                            />
                        ))}
                    </View>
                </ImageBackground>

                <View style={styles.bottomBanner}>
                    <View style={styles.bannerContent}><Text style={styles.bannerText}>도서관 소식 및 공지사항</Text></View>
                </View>
            </ScrollView>

            <Modal visible={isCategoryModalVisible} transparent={true} animationType="fade">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setCategoryModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>검색 기준 선택</Text>
                        {["전체", "서명", "저자", "출판사"].map((option) => (
                            <TouchableOpacity 
                                key={option} 
                                style={styles.modalOption}
                                onPress={() => {
                                    setSearchCategory(option);
                                    setCategoryModalVisible(false);
                                }}
                            >
                                <Text style={searchCategory === option ? styles.modalOptionTextSel : styles.modalOptionText}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scrollContent: { flexGrow: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10 },
    titleWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logo1: { width: 30, height: 30 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    
    searchSection: { paddingHorizontal: 20, marginVertical: 15 },
    searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, height: 50, borderWidth: 1, borderColor: '#F0F0F0', elevation: 3 },
    categorySelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, width: 75, height: '100%', borderRightWidth: 1, borderRightColor: '#F0F0F0' },
    categoryText: { fontSize: 13, fontWeight: 'bold', color: '#555' },
    searchInput: { flex: 1, fontSize: 14, paddingLeft: 10 },
    searchButton: { paddingHorizontal: 15 },
    
    menuBackground: { width: '100%', marginTop: 10 },
    menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 25, paddingVertical: 20, backgroundColor: 'rgba(255, 255, 255, 0.7)' },
    menuItem: { width: '30%', alignItems: 'center', marginBottom: 20 },
    hexagonWrapper: { width: 80, height: 85, justifyContent: 'center', alignItems: 'center' },
    hexagonSvg: { position: 'absolute' },
    iconOverlay: { justifyContent: 'center', alignItems: 'center' },
    menuText: { fontSize: 12, fontWeight: '700', color: '#333', marginTop: 5, textAlign: 'center' },
    bottomBanner: { flex: 1, backgroundColor: '#FFFCB7', marginTop: 10, minHeight: 250, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
    bannerContent: { borderLeftWidth: 4, borderLeftColor: '#E6E200', paddingLeft: 15 },
    bannerText: { fontSize: 16, fontWeight: 'bold', color: '#555' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: 250, backgroundColor: 'white', borderRadius: 15, padding: 20, elevation: 10 },
    modalTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#eee' },
    modalOption: { paddingVertical: 15, alignItems: 'center' },
    modalOptionText: { fontSize: 15, color: '#333' },
    modalOptionTextSel: { fontSize: 15, color: '#e5b05c', fontWeight: 'bold' },
});