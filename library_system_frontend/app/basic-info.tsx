import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User, getMe, updateMe } from '@/constants/api';

export default function BasicInfoScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMe = async () => {
    try {
      const me = await getMe();
      setUser(me);
      setNickname(me.nickname);
      setEmail(me.email);
    } catch {
      setUser(null);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadMe();
    }, [])
  );

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updated = await updateMe({ nickname, email });
      setUser(updated);
      setNickname(updated.nickname);
      setEmail(updated.email);
      Alert.alert('완료', '기본정보가 수정되었습니다.');
    } catch (error) {
      Alert.alert('수정 실패', error instanceof Error ? error.message : '정보 수정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>기본정보</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!user ? (
          <View style={styles.card}>
            <Text style={styles.title}>로그인이 필요합니다.</Text>
            <Text style={styles.description}>기본정보 조회와 수정은 실제 로그인 세션을 기준으로 동작합니다.</Text>
            <TouchableOpacity style={styles.blackButton} onPress={() => router.push('/profile' as any)}>
              <Text style={styles.blackButtonText}>프로필에서 로그인</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>{user.nickname}님의 기본정보</Text>
            <Text style={styles.info}>아이디: {user.username}</Text>
            <Text style={styles.label}>닉네임</Text>
            <TextInput style={styles.input} value={nickname} onChangeText={setNickname} placeholder="닉네임" />
            <Text style={styles.label}>이메일</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="이메일" autoCapitalize="none" keyboardType="email-address" />
            <TouchableOpacity style={styles.blackButton} onPress={handleUpdate} disabled={loading}>
              <Text style={styles.blackButtonText}>{loading ? '수정 중' : '정보 수정'}</Text>
            </TouchableOpacity>
          </View>
        )}
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
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 16, padding: 18, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 12 },
  description: { color: '#666', lineHeight: 21, marginBottom: 16 },
  info: { color: '#333', fontWeight: '700', marginBottom: 16 },
  label: { color: '#111', fontWeight: '900', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, height: 48, paddingHorizontal: 14, marginBottom: 14 },
  blackButton: { backgroundColor: '#111', borderRadius: 12, minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  blackButtonText: { color: '#fff', fontWeight: '900' },
});
