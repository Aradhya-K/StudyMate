import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '@react-navigation/native';

export default function TimerScreen() {
  const { sessions, markCompleted } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { sessionIndex } = route.params;

  const session = sessions[sessionIndex];
  const totalSeconds = session?.minutes * 60;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    }

    if (secondsLeft === 0 && isRunning) {
      handleCompletion(); 
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, secondsLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const handleCompletion = () => {
    clearInterval(intervalRef.current);
    markCompleted(sessionIndex);
    Alert.alert('Session Complete', 'Well done! Stay Motivated to learn more.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleManualComplete = () => {
    Alert.alert(
      'Mark Complete',
      'Are you sure you want to mark this session as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            clearInterval(intervalRef.current);
            markCompleted(sessionIndex);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text>Session not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{session.subject}</Text>
      <Text style={styles.subtitle}>{session.duration} | {session.time}</Text>

      <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>

      {!isRunning ? (
        <TouchableOpacity style={styles.startButton} onPress={startTimer}>
          <Text style={styles.buttonText}>Start Timer</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.manualButton} onPress={handleManualComplete}>
          <Text style={styles.buttonText}>Mark as Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f9ff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#2E54E8' },
  subtitle: { fontSize: 16, color: '#555', marginBottom: 20 },
  timerText: { fontSize: 60, fontWeight: 'bold', color: '#4CAF50', marginVertical: 20 },
  startButton: {
    backgroundColor: '#2E54E8',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  manualButton: {
    backgroundColor: '#FF9800',
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

