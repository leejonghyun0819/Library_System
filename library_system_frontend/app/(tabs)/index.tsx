import React, { useState } from 'react'; // 👈 useState 추가
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    ImageBackground,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Polygon } from 'react-native-svg';
import { useRouter } from 'expo-router'; // 👈 화면 이동용 도구 추가
import { Fonts } from '@/constants/theme';

// 🔽 육각형 메뉴 아이템 컴포넌트 (onPress 기능 추가)
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
    const router = useRouter(); // 👈 화면 이동 도구 꺼내기
    const [searchText, setSearchText] = useState(""); // 👈 메인 화면 검색어 저장용 메모장

    const menuItems = [
        { id: 1, title: '통합자료검색', icon: 'magnify' },
        { id: 2, title: '신착자료', icon: 'book-plus-outline' },
        { id: 3, title: '기본정보', icon: 'account-box-outline' },
        { id: 4, title: '인기순위', icon: 'crown-outline' },
        { id: 5, title: '도서이용정보', icon: 'book-open-variant' },
        { id: 6, title: '이용안내', icon: 'file-document-edit-outline' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
                {/* 1. 상단 헤더 */}
                <View style={styles.header}>
                    <TouchableOpacity>
                        <Ionicons name="menu" size={28} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.titleWrapper}>
                        <Image
                            source={require('@/assets/images/logo1.png')}
                            style={styles.logo1}
                            resizeMode="contain"
                        />
                        <Text style={styles.headerTitle}>성남시 도서관사업소</Text>
                    </View>
                    <TouchableOpacity>
                        <Ionicons name="person-circle-outline" size={32} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* 2. 검색 섹션 */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBarContainer}>
                        <Text style={styles.searchLabel}>자료검색</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="검색어를 입력해주세요"
                            placeholderTextColor="#999"
                            value={searchText} // 👈 검색어 연결
                            onChangeText={setSearchText} // 👈 글자 칠 때마다 저장
                            onSubmitEditing={() => router.push('/search-result')} // 👈 엔터 치면 이동
                        />
                        <TouchableOpacity 
                            style={styles.searchButton}
                            onPress={() => router.push('/search-result')} // 👈 돋보기 누르면 이동
                        >
                            <Ionicons name="search" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 3. 메뉴 그리드 */}
                <ImageBackground
                    source={require('@/assets/images/background.png')}
                    style={styles.menuBackground}
                    resizeMode="cover"
                >
                    <View style={styles.menuGrid}>
                        {menuItems.map((item) => (
                            <HexagonMenu 
                                key={item.id} 
                                icon={item.icon} 
                                title={item.title} 
                                onPress={() => {
                                    // 👈 통합자료검색을 누르면 우리가 만든 화면으로 이동!
                                    if (item.title === '통합자료검색') {
                                        router.push('/search-result');
                                    }
                                }}
                            />
                        ))}
                    </View>
                </ImageBackground>

                {/* 4. 하단 배너 영역 */}
                <View style={styles.bottomBanner}>
                    <View style={styles.bannerContent}>
                        <Text style={styles.bannerText}>도서관 소식 및 공지사항</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logo1: {
        width: 30,
        height: 30,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: Fonts?.rounded || 'System',
        color: '#000',
    },
    searchSection: {
        paddingHorizontal: 20,
        marginVertical: 15,
        zIndex: 10,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    searchLabel: {
        fontSize: 12,
        color: '#777',
        marginRight: 10,
        fontWeight: '600',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#000',
    },
    searchButton: {
        padding: 5,
    },
    menuBackground: {
        width: '100%',
        marginTop: 10,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingVertical: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    menuItem: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 20,
    },
    hexagonWrapper: {
        width: 80,
        height: 85,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hexagonSvg: {
        position: 'absolute',
    },
    iconOverlay: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#333',
        marginTop: 5,
        textAlign: 'center',
    },
    bottomBanner: {
        flex: 1,
        backgroundColor: '#FFFCB7',
        marginTop: 10,
        minHeight: 250,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 25,
    },
    bannerContent: {
        borderLeftWidth: 4,
        borderLeftColor: '#E6E200',
        paddingLeft: 15,
    },
    bannerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
});