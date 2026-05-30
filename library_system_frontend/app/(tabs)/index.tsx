import React, { useEffect, useState } from 'react';
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
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Polygon } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Fonts } from '@/constants/theme';
import {
    API_BASE_URL,
    Book,
    User,
    borrowBook,
    cancelReservation,
    checkApiHealth,
    getMe,
    reserveBook,
    searchBooks,
} from '@/constants/api';


type MenuRoute = '/integrated-search' | '/basic-info' | '/popular-ranking' | '/library-usage' | '/library-guide';

type MenuItem = {
    id: number;
    title: string;
    icon: string;
    route?: MenuRoute;
    disabledMessage?: string;
};

const menuItems: MenuItem[] = [
    { id: 1, title: '통합자료검색', icon: 'magnify', route: '/integrated-search' },
    {
        id: 2,
        title: '신착자료',
        icon: 'book-plus-outline',
        disabledMessage: '현재 실제 도서 데이터에 등록일/입고일/출간일 컬럼이 없어 신착자료는 제외했습니다.',
    },
    { id: 3, title: '기본정보', icon: 'account-box-outline', route: '/basic-info' },
    { id: 4, title: '인기순위', icon: 'crown-outline', route: '/popular-ranking' },
    { id: 5, title: '도서이용정보', icon: 'book-open-variant', route: '/library-usage' },
    { id: 6, title: '이용안내', icon: 'file-document-edit-outline', route: '/library-guide' },
];

const HexagonMenu = ({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.85}>
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

function statusLabel(status?: Book['status']) {
    if (status === 'AVAILABLE') return '대출 가능';
    if (status === 'RESERVED') return '예약 중';
    if (status === 'BORROWED') return '대출 중';
    return '-';
}

export default function LibraryMainScreen() {
    const router = useRouter();
    const [keyword, setKeyword] = useState('');
    const [lastSearchedKeyword, setLastSearchedKeyword] = useState('');
    const [books, setBooks] = useState<Book[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoadingBookId, setActionLoadingBookId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [serverStatus, setServerStatus] = useState('API 서버 확인 중');

    useEffect(() => {
        checkApiHealth()
            .then(() => setServerStatus('API 서버 연결됨'))
            .catch(() => setServerStatus('API 서버 연결 실패'));
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            getMe()
                .then(setUser)
                .catch(() => setUser(null));
        }, [])
    );

    const runSearch = async (value: string) => {
        const trimmedKeyword = value.trim();

        if (!trimmedKeyword) {
            setErrorMessage('검색어를 입력해주세요.');
            setBooks([]);
            return;
        }

        try {
            setLoading(true);
            setErrorMessage('');
            const result = await searchBooks(trimmedKeyword);
            setBooks(result);
            setLastSearchedKeyword(trimmedKeyword);
        } catch (error) {
            setBooks([]);
            setErrorMessage(error instanceof Error ? error.message : '도서 검색 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => runSearch(keyword);

    const refreshCurrentSearch = async () => {
        const targetKeyword = lastSearchedKeyword || keyword;
        if (targetKeyword.trim()) {
            const result = await searchBooks(targetKeyword.trim());
            setBooks(result);
        }
    };

    const requireLogin = () => {
        if (user) return true;
        Alert.alert('로그인 필요', '프로필 탭에서 먼저 로그인해주세요.');
        return false;
    };

    const handleBookAction = async (bookId: number, action: 'reserve' | 'cancel' | 'borrow') => {
        if (!requireLogin()) return;

        try {
            setActionLoadingBookId(bookId);
            setErrorMessage('');
            if (action === 'reserve') await reserveBook(bookId);
            if (action === 'cancel') await cancelReservation(bookId);
            if (action === 'borrow') await borrowBook(bookId);
            await refreshCurrentSearch();
            Alert.alert('완료', '요청이 정상 처리되었습니다.');
        } catch (error) {
            Alert.alert('처리 실패', error instanceof Error ? error.message : '요청 처리 중 오류가 발생했습니다.');
        } finally {
            setActionLoadingBookId(null);
        }
    };


    const handleMenuPress = (item: MenuItem) => {
        if (item.route) {
            router.push(item.route as any);
            return;
        }

        Alert.alert(item.title, item.disabledMessage || '아직 제공되지 않는 메뉴입니다.');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} bounces={false}>
                <View style={styles.header}>
                    <View style={styles.headerIconBox}>
                        <Ionicons name="library-outline" size={28} color="#000" />
                    </View>
                    <View style={styles.titleWrapper}>
                        <Image source={require('@/assets/images/logo1.png')} style={styles.logo1} resizeMode="contain" />
                        <Text style={styles.headerTitle}>성남시 도서관사업소</Text>
                    </View>
                    <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile' as any)}>
                        <Ionicons name="person-circle-outline" size={32} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.searchSection}>
                    <View style={styles.searchBarContainer}>
                        <Text style={styles.searchLabel}>자료검색</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="검색어를 입력해주세요"
                            placeholderTextColor="#999"
                            value={keyword}
                            onChangeText={setKeyword}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                            <Ionicons name="search" size={22} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.serverStatus}>
                        {serverStatus} · {user ? `${user.nickname} 로그인 중` : '비로그인'} · {API_BASE_URL}
                    </Text>
                </View>

                <ImageBackground source={require('@/assets/images/logo2.png')} style={styles.menuBackground} resizeMode="cover">
                    <View style={styles.menuGrid}>
                        {menuItems.map((item) => (
                            <HexagonMenu
                                key={item.id}
                                icon={item.icon}
                                title={item.title}
                                onPress={() => handleMenuPress(item)}
                            />
                        ))}
                    </View>
                </ImageBackground>

                <View style={styles.bottomBanner}>
                    <View style={styles.bannerContent}>
                        <Text style={styles.bannerText}>자료검색 결과</Text>
                    </View>

                    <View style={styles.resultArea}>
                        <Text style={styles.resultTitle}>검색 결과</Text>
                    {loading && <ActivityIndicator style={styles.loading} />}
                    {!!errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                    {!loading && !errorMessage && books.length === 0 && (
                        <Text style={styles.emptyText}>검색어를 입력하면 실제 DB의 도서 검색 결과가 표시됩니다.</Text>
                    )}
                    {books.map((book) => {
                        const isMyReservation = !!user && book.reservedByUserId === user.id;
                        const busy = actionLoadingBookId === book.id;

                        return (
                            <View key={book.id} style={styles.bookCard}>
                                <View style={styles.bookCardHeader}>
                                    {!!book.imageurl && (
                                        <Image source={{ uri: book.imageurl }} style={styles.bookCover} resizeMode="cover" />
                                    )}
                                    <View style={styles.bookInfoArea}>
                                        <Text style={styles.bookTitle}>{book.title}</Text>
                                        <Text style={styles.bookMeta}>저자: {book.author || '-'}</Text>
                                        <Text style={styles.bookMeta}>출판사: {book.publisher || '-'}</Text>
                                        <Text style={styles.bookMeta}>분류: {book.category || '-'}</Text>
                                        <Text style={styles.bookMeta}>ISBN: {book.isbn || '-'}</Text>
                                        <Text style={styles.bookStatus}>상태: {statusLabel(book.status)}</Text>
                                    </View>
                                </View>

                                <View style={styles.actionRow}>
                                    {book.status === 'AVAILABLE' && (
                                        <>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={busy}
                                                onPress={() => handleBookAction(book.id, 'reserve')}
                                            >
                                                <Text style={styles.actionButtonText}>예약</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.actionButtonPrimary}
                                                disabled={busy}
                                                onPress={() => handleBookAction(book.id, 'borrow')}
                                            >
                                                <Text style={styles.actionButtonPrimaryText}>대출</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    {book.status === 'RESERVED' && isMyReservation && (
                                        <>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                disabled={busy}
                                                onPress={() => handleBookAction(book.id, 'cancel')}
                                            >
                                                <Text style={styles.actionButtonText}>예약취소</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.actionButtonPrimary}
                                                disabled={busy}
                                                onPress={() => handleBookAction(book.id, 'borrow')}
                                            >
                                                <Text style={styles.actionButtonPrimaryText}>대출</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}

                                    {book.status === 'RESERVED' && !isMyReservation && (
                                        <Text style={styles.actionInfoText}>다른 사용자가 예약 중인 도서입니다.</Text>
                                    )}

                                    {book.status === 'BORROWED' && (
                                        <Text style={styles.actionInfoText}>현재 대출 중입니다. 내 대출 도서 반납은 프로필 탭에서 진행합니다.</Text>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 32,
    },
    header: {
        height: 72,
        backgroundColor: '#ffe787',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
    },
    headerIconBox: {
        width: 34,
        alignItems: 'center',
    },
    profileButton: {
        width: 34,
        alignItems: 'center',
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    logo1: {
        width: 32,
        height: 32,
        marginRight: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: Fonts.bold,
        fontWeight: '900',
        color: '#101010',
    },
    searchSection: {
        paddingHorizontal: 20,
        paddingTop: 26,
        paddingBottom: 16,
        backgroundColor: '#fff',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#111',
        borderRadius: 100,
        height: 54,
        paddingLeft: 18,
        backgroundColor: '#fff',
    },
    searchLabel: {
        fontSize: 15,
        fontWeight: '900',
        color: '#111',
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#111',
        paddingVertical: 0,
    },
    searchButton: {
        width: 52,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    serverStatus: {
        marginTop: 10,
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    menuBackground: {
        minHeight: 290,
        justifyContent: 'center',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    menuItem: {
        width: '32%',
        alignItems: 'center',
        marginBottom: 18,
    },
    hexagonWrapper: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hexagonSvg: {
        position: 'absolute',
    },
    iconOverlay: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    bottomBanner: {
        backgroundColor: '#FFF9D8',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 25,
        paddingHorizontal: 20,
        paddingBottom: 35,
        marginTop: -10,
    },
    bannerContent: {
        alignItems: 'center',
        marginBottom: 18,
    },
    bannerText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#333',
    },
    resultArea: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111',
        marginBottom: 12,
    },
    loading: {
        marginVertical: 18,
    },
    errorText: {
        color: '#d33',
        fontWeight: '700',
        marginBottom: 12,
    },
    emptyText: {
        color: '#777',
        lineHeight: 20,
    },
    bookCard: {
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        backgroundColor: '#fff',
    },
    bookCardHeader: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
    },
    bookCover: {
        width: 54,
        height: 76,
        borderRadius: 8,
        backgroundColor: '#f1f1f1',
    },
    bookInfoArea: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        color: '#111',
        fontWeight: '900',
        marginBottom: 6,
    },
    bookMeta: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
    },
    bookStatus: {
        marginTop: 6,
        fontSize: 13,
        color: '#111',
        fontWeight: '900',
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
        flexWrap: 'wrap',
    },
    actionButton: {
        minWidth: 86,
        borderWidth: 1,
        borderColor: '#111',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#111',
        fontSize: 13,
        fontWeight: '900',
    },
    actionButtonPrimary: {
        minWidth: 86,
        backgroundColor: '#111',
        borderRadius: 12,
        paddingVertical: 11,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    actionButtonPrimaryText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '900',
    },
    actionInfoText: {
        color: '#666',
        lineHeight: 20,
        fontSize: 13,
        fontWeight: '700',
        flexShrink: 1,
    },
});
