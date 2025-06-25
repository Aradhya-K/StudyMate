import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';



const ProgressScreen = () => {
  const { sessions } = useContext(AuthContext);
  const { colors } = useTheme();
  const [stats, setStats] = useState({
    totalSessionsToday: 0,
    completedSessionsToday: 0,
    totalMinutesStudiedToday: 0,
  });

  useEffect(() => {
  const today = new Date().toISOString().slice(0, 10);
  let totalSessions = 0;
  let completedSessions = 0;
  let totalMinutes = 0;

  if (sessions && sessions.length > 0) {
    sessions.forEach(session => {
      const sessionDate = session.date?.slice(0, 10);
      if (sessionDate === today) {
        totalSessions++;
        if (session.completed === true) {
          completedSessions++;
          totalMinutes += session.minutes || 0; 
        }
      }
    });
  }

  setStats({
    totalSessionsToday: totalSessions,
    completedSessionsToday: completedSessions,
    totalMinutesStudiedToday: totalMinutes,
  });
}, [sessions]);


  return (
    <SafeAreaView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Today's Study Progress</Text>

      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Total Sessions Planned Today:</Text>
        <Text style={styles.statValue}>{stats.totalSessionsToday}</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Sessions Completed Today:</Text>
        <Text style={styles.statValue}>{stats.completedSessionsToday}</Text>
      </View>

      <View style={styles.statBox}>
        <Text style={styles.statLabel}>Total Study Time (minutes):</Text>
        <Text style={styles.statValue}>{stats.totalMinutesStudiedToday}</Text>
      </View>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  statBox: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  statLabel: {
    fontSize: 16,
    color: '#555',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 5,
  },
});

export default ProgressScreen;