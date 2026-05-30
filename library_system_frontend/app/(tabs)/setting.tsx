import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL, checkApiHealth } from '@/constants/api';

type HealthState = 'checking' | 'connected' | 'failed';

export default function SettingScreen() {
  const [healthState, setHealthState] = useState<HealthState>('checking');
  const [serverTime, setServerTime] = useState<string>('');

  const refreshHealth = async () => {
    try {
      setHealthState('checking');
      const health = await checkApiHealth();
      setServerTime(health.serverTime);
      setHealthState('connected');
    } catch {
      setServerTime('');
      setHealthState('failed');
    }
  };

  useEffect(() => {
    refreshHealth();
  }, []);

  const statusText = healthState === 'checking'
    ? 'API 서버 확인 중'
    : healthState === 'connected'
      ? 'API 서버 연결됨'
      : 'API 서버 연결 실패';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBackground}>
        <Text style={styles.title}>설정</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>현재 API 서버 주소</Text>
        <Text style={styles.value}>{API_BASE_URL}</Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>서버 연결 상태</Text>
          <View style={styles.statusRow}>
            <Text style={healthState === 'failed' ? styles.statusFail : styles.statusOk}>{statusText}</Text>
            {healthState === 'checking' && <ActivityIndicator />}
          </View>
          {!!serverTime && <Text style={styles.serverTime}>서버 시간: {serverTime}</Text>}
          <TouchableOpacity style={styles.refreshButton} onPress={refreshHealth}>
            <Text style={styles.refreshButtonText}>다시 확인</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.helpText}>
          실제 안드로이드폰에서 테스트할 때는 .env의 EXPO_PUBLIC_API_BASE_URL을 내 PC IPv4 주소로 설정해주세요.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    height: 80,
    backgroundColor: '#ffe787',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#101010',
  },
  content: {
    padding: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 10,
  },
  value: {
    fontSize: 14,
    color: '#555',
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 10,
  },
  statusCard: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 14,
    padding: 16,
    backgroundColor: '#fff',
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111',
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusOk: {
    color: '#111',
    fontWeight: '900',
  },
  statusFail: {
    color: '#d33',
    fontWeight: '900',
  },
  serverTime: {
    marginTop: 10,
    color: '#666',
    fontSize: 13,
  },
  refreshButton: {
    marginTop: 14,
    backgroundColor: '#111',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '900',
  },
  helpText: {
    marginTop: 14,
    fontSize: 13,
    color: '#777',
    lineHeight: 20,
  },
});
