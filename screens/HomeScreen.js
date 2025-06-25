import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

export default function HomeScreen() {
  const {
    userData,
    sessions,
    deleteSession,
    getTodaySessions,
    getDueSessions,
    getCompletedSessions,
  } = useContext(AuthContext);

  const navigation = useNavigation();
  const { colors } = useTheme();

  const todaySessions = getTodaySessions();
  const dueSessions = getDueSessions();
  const completedSessions = getCompletedSessions();

  const totalMinutes = todaySessions.reduce((sum, s) => sum + (s.minutes || 0), 0);

  const formatTotalTime = (totalMins) => {
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hrs > 0) {
      return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
    }
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  };

  const confirmDelete = (index) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteSession(index),
        },
      ]
    );
  };

  const findGlobalIndex = (session) =>
    sessions.findIndex(
      s =>
        s.subject === session.subject &&
        s.time === session.time &&
        s.date === session.date
    );

  const renderSessionItem = (item, _, type = 'today') => {
    const sessionIndex = findGlobalIndex(item);
    const isToday = type === 'today';
    const isDue = type === 'due';
    const isCompleted = type === 'completed';

    return (
      <SafeAreaView style={styles.sessionCard} key={`${item.subject}-${item.time}`}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sessionText}>{item.subject} - {item.duration}</Text>
          <Text style={styles.timeText}>{item.time} | {item.date}</Text>
        </View>

        {isToday && (
          <TouchableOpacity
            style={styles.startTimerButton}
            onPress={() => navigation.navigate('Timer', { sessionIndex })}
          >
            <Text style={styles.startTimerText}>Start Timer</Text>
          </TouchableOpacity>
        )}

        {!isCompleted && (
          <TouchableOpacity onPress={() => confirmDelete(sessionIndex)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}

        {isDue && !isCompleted && (
          <Text style={{ color: 'orange', marginLeft: 8, fontWeight: 'bold' }}>Due</Text>
        )}

        {isCompleted && (
          <Text style={{ color: 'green', marginLeft: 8, fontWeight: 'bold' }}>Completed</Text>
        )}
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Hello, {userData?.name || 'Student'}</Text>
      <Text style={styles.subTitle}>Today's Study Summary</Text>

      <View style={styles.summaryBox}>
        <Text>Total Sessions: {todaySessions.length}</Text>
        <Text>Total Time: {formatTotalTime(totalMinutes)}</Text>
      </View>

      <TouchableOpacity
        style={styles.planButton}
        onPress={() => navigation.navigate('Queue')}
      >
        <Text style={styles.planButtonText}>Plan a Session</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Today's Sessions</Text>
      {todaySessions.length === 0 && (
        <Text style={{ fontStyle: 'italic' }}>No sessions planned for today.</Text>
      )}
      <FlatList
        data={todaySessions}
        keyExtractor={(item, index) => `today-${index}`}
        renderItem={({ item, index }) => renderSessionItem(item, index, 'today')}
      />

      <Text style={styles.subTitle}>Due Sessions</Text>
      {dueSessions.length === 0 && (
        <Text style={{ fontStyle: 'italic' }}>No due sessions.</Text>
      )}
      <FlatList
        data={dueSessions}
        keyExtractor={(item, index) => `due-${index}`}
        renderItem={({ item, index }) => renderSessionItem(item, index, 'due')}
      />

      <Text style={styles.subTitle}>Completed Sessions</Text>
      {completedSessions.length === 0 && (
        <Text style={{ fontStyle: 'italic' }}>No completed sessions yet.</Text>
      )}
      <FlatList
        data={completedSessions}
        keyExtractor={(item, index) => `completed-${index}`}
        renderItem={({ item, index }) => renderSessionItem(item, index, 'completed')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f7ff' },
  welcome: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#2E54E8' },
  subTitle: { fontSize: 18, marginTop: 20, marginBottom: 10, fontWeight: '600' },
  summaryBox: {
    backgroundColor: '#e6edff',
    padding: 16,
    borderRadius: 10,
  },
  planButton: {
    backgroundColor: '#2E54E8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  planButtonText: { color: 'white', fontWeight: 'bold' },
  sessionCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionText: { fontSize: 15, fontWeight: '600' },
  timeText: { fontSize: 12, color: '#666' },
  startTimerButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  startTimerText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 13,
  },
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
});

