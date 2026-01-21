import { Calendar, Home, Search, User } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// 메뉴 데이터 타입 정의
interface MenuItem {
    id: number;
    title: string;
}

const MENU_ITEMS: MenuItem[] = [
    { id: 1, title: '통합자료검색' },
    { id: 2, title: '신착자료' },
    { id: 3, title: '대출현황' },
    { id: 4, title: '열람실좌석현황' },
    { id: 5, title: '수강신청' },
    { id: 6, title: '전자도서관' },
];

const LandingPage: React.FC = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* 상단 헤더 영역 */}
                <View style={styles.header}>
                    <View style={styles.logoPlaceholder}>
                        {/* 실제 로고 이미지가 있다면 Image 컴포넌트로 교체하세요 */}
                        <View style={styles.logoCircle} />
                    </View>
                    <Text style={styles.headerTitle}>성남시 도서관사업소</Text>
                </View>

                {/* 메인 메뉴 영역 (육각형 그리드) */}
                <View style={styles.menuGrid}>
                    {MENU_ITEMS.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.menuItem}>
                            <View style={styles.hexagon}>
                                {/* 육각형 형태를 위해 clipPath나 이미지를 사용할 수 있지만, 
                    여기서는 간단하게 테두리 박스로 표현했습니다. */}
                                <View style={styles.hexagonInner} />
                            </View>
                            <Text style={styles.menuText}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 검색바 영역 */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Text style={styles.searchLabel}>자료검색</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="검색어를 입력해주세요"
                            placeholderTextColor="#999"
                        />
                        <TouchableOpacity>
                            <Search size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 하단 빈 공간 (추가 콘텐츠 영역) */}
                <View style={styles.contentBody} />
            </ScrollView>

            {/* 하단 네비게이션 탭 */}
            <View style={styles.bottomTab}>
                <TouchableOpacity style={styles.tabItem}>
                    <Home size={28} color="#4A90E2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <Calendar size={28} color="#CCC" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabItem}>
                    <User size={28} color="#CCC" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFBE6', // 연한 노란색 배경
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginTop: 20,
    },
    logoPlaceholder: {
        marginRight: 10,
    },
    logoCircle: {
        width: 40,
        height: 40,
        backgroundColor: '#4A90E2',
        borderRadius: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: 10,
        marginTop: 30,
    },
    menuItem: {
        width: width / 3 - 20,
        alignItems: 'center',
        marginBottom: 25,
    },
    hexagon: {
        width: 70,
        height: 70,
        borderWidth: 2,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        // 실제 완벽한 육각형을 구현하려면 SVG나 전용 라이브러리를 권장합니다.
        transform: [{ rotate: '45deg' }],
        borderRadius: 10,
    },
    hexagonInner: {
        width: '100%',
        height: '100%',
    },
    menuText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: '#000',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: '#EEE',
        elevation: 3, // Android 그림자
        shadowColor: '#000', // iOS 그림자
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
    },
    contentBody: {
        flex: 1,
        minHeight: 300,
    },
    bottomTab: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10,
    },
    tabItem: {
        padding: 10,
    },
});

export default LandingPage;
