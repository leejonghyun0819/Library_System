import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../_layout';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // 네비게이션을 위한 useRouter 추가
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LibraryMainScreen() {
    const router = useRouter(); // 라우터 객체 생성
    const { setIsLoggedIn } = useContext(AuthContext);

    const handlePress = (menuName) => {
        Alert.alert('알림', `${menuName} 기능을 준비 중입니다.`);
    };

    // 로그인 페이지로 이동하는 함수
    const navigateToLogin = () => {
        setIsLoggedIn(false);

        router.replace('/(auth)/login');
    };

    const searchItems = [
        { id: 1, title: '자료검색', icon: 'magnify' },
        { id: 2, title: '신착자료', icon: 'book-plus-outline' },
        { id: 4, title: '인기순위', icon: 'crown-outline' },
    ];

    const myPageItems = [
        { id: 3, title: '기본정보', icon: 'account-box-outline' },
        { id: 5, title: '도서이용정보', icon: 'book-open-variant' },
        { id: 6, title: '관심도서', icon: 'bookmark-outline' },
    ];

    const footerItems = [
        { id: 7, title: '모바일회원증', icon: 'account-card-outline' },
        { id: 8, title: '이용안내', icon: 'file-document-edit-outline' },
        { id: 9, title: '푸시알림설정', icon: 'bell-plus-outline' },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* 1. 상단 헤더: 로그인 유도 버튼 적용 */}
            <View style={styles.headerBackground}>
                <View style={styles.headerContent}>
                    {/* [수정] 텍스트와 아이콘 전체를 버튼으로 감쌈 */}
                    <TouchableOpacity style={styles.userRow} onPress={navigateToLogin} activeOpacity={0.7}>
                        <Icon name="account-circle-outline" size={32} color="#101010" />
                        <Text style={styles.loginText}>로그인을 해주세요</Text>
                        <Icon name="chevron-right" size={24} color="#101010" />
                    </TouchableOpacity>

                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => handlePress('설정')}>
                            <Icon name="cog-outline" size={28} color="#101010" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePress('닫기')} style={{ marginLeft: 15 }}>
                            <Icon name="close" size={32} color="#101010" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* 2. 중앙 컨텐츠 (스크롤 여백 조정) */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* 통합자료검색 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>통합자료검색</Text>
                    <View style={styles.thickLine} />
                    <View style={styles.grid}>
                        {searchItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => handlePress(item.title)}
                            >
                                <View style={styles.iconCircle}>
                                    <Icon name={item.icon} size={40} color="#333" />
                                </View>
                                <Text style={styles.menuLabel}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 마이페이지 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>마이페이지</Text>
                    <View style={styles.thickLine} />
                    <View style={styles.grid}>
                        {myPageItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => handlePress(item.title)}
                            >
                                <View style={styles.iconCircle}>
                                    <Icon name={item.icon} size={40} color="#333" />
                                </View>
                                <Text style={styles.menuLabel}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* 정보마당 */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>정보마당</Text>
                    <View style={styles.thickLine} />
                    <View style={styles.grid}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => handlePress('공지사항')}>
                            <View style={styles.iconCircle}>
                                <Icon name="volume-high" size={40} color="#333" />
                            </View>
                            <Text style={styles.menuLabel}>공지사항</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 3. 하단 노란색 메뉴 영역 (푸터) */}
                <View style={styles.footerArea}>
                    <View style={styles.grid}>
                        {footerItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => handlePress(item.title)}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: '#fff' }]}>
                                    <Icon name={item.icon} size={40} color="#333" />
                                </View>
                                <Text style={styles.menuLabel}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    scrollView: { flex: 1 },
    scrollContent: {
        // [핵심] 하단 탭바 높이(약 60) + 여유 공간(40) = 100
        paddingBottom: 1000,
    },
    headerBackground: {
        height: 80,
        backgroundColor: '#ffe787',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    userRow: { flexDirection: 'row', alignItems: 'center' },
    loginText: { fontSize: 20, fontWeight: 'bold', color: '#101010', marginLeft: 10, marginRight: 5 },
    headerIcons: { flexDirection: 'row', alignItems: 'center' },
    section: { marginTop: 25, paddingHorizontal: 20 },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#000', marginBottom: 8 },
    thickLine: { height: 2, backgroundColor: '#000', marginBottom: 20 },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    menuItem: { width: '33.3%', alignItems: 'center', marginBottom: 15 },
    iconCircle: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    menuLabel: { fontSize: 13, fontWeight: '700', color: '#000', textAlign: 'center' },
    footerArea: {
        marginTop: 30,
        backgroundColor: '#ffe787',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingVertical: 30,
        paddingHorizontal: 10,
    },
});
