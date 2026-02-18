import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
// 설치하신 아이콘 라이브러리
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LibraryMainScreen() {
    // 기능 연결을 위한 핸들러 예시
    const handlePress = (menuName) => {
        Alert.alert('알림', `${menuName} 기능을 준비 중입니다.`);
    };

    // 데이터 구성
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
            {/* 1. 상단 헤더 (배경색 유지) */}
            <View style={styles.headerBackground}>
                <View style={styles.headerContent}>
                    <View style={styles.userRow}>
                        <Icon name="account-circle-outline" size={32} color="#101010" />
                        <Text style={styles.loginText}>로그인을 해주세요</Text>
                    </View>
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

            {/* 2. 중앙 컨텐츠 (스크롤 가능) */}
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

                {/* 3. 하단 노란색 메뉴 영역 (푸터) 
            ScrollView 안에 넣어 아래 요소가 가려지지 않게 함 */}
                <View style={styles.footerArea}>
                    <View style={styles.grid}>
                        {footerItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => handlePress(item.title)}
                            >
                                <View style={[styles.iconCircle, { backgroundColor: '#d9d9d9' }]}>
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
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20, // 최하단 여백 추가
    },
    headerBackground: {
        height: 80,
        backgroundColor: '#ffe787',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#101010',
        marginLeft: 10,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        marginTop: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#000',
        marginBottom: 8,
    },
    thickLine: {
        height: 2,
        backgroundColor: '#000',
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    menuItem: {
        width: '33.3%',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconCircle: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    menuLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
    },
    footerArea: {
        marginTop: 30,
        backgroundColor: '#ffe787',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingVertical: 30,
        paddingHorizontal: 10,
        // 탭바가 있어도 가려지지 않도록 추가 패딩
        marginHorizontal: 0,
    },
});
