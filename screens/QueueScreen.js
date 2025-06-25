import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

export default function QueueScreen() {
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [time, setTime] = useState('');
  const [repeat, setRepeat] = useState('none');
  const { colors } = useTheme();

  const { sessions, addSession } = useContext(AuthContext);
  const navigation = useNavigation();

  const parseDurationToMinutes = (input) => {
    const lower = input.toLowerCase().trim();
    if (lower.includes('hour')) {
      const match = parseFloat(lower);
      if (!isNaN(match)) return Math.round(match * 60);
    }
    const mins = lower.match(/\d+/);
    return mins ? parseInt(mins[0]) : null;
  };

  const validateTimeFormat = (t) => {
    return /^([1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(t.trim());
  };

  const isTimeConflict = (t) => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.some(
      (s) => s.time.toLowerCase() === t.toLowerCase() && s.date === today
    );
  };

  const handleSubmit = () => {
    if (!subject || !duration || !time) {
      Alert.alert('Missing Fields', 'Please fill all fields');
      return;
    }

    if (!validateTimeFormat(time)) {
      Alert.alert('Invalid Time', 'Enter time in format like "4:00 PM"');
      return;
    }

    const durationInMin = parseDurationToMinutes(duration);
    if (!durationInMin || isNaN(durationInMin)) {
      Alert.alert('Invalid Duration', 'Enter a valid duration (e.g. 1.5 hours, 45 mins)');
      return;
    }

    if (isTimeConflict(time)) {
      Alert.alert(
        'Time Conflict',
        `You already have a session scheduled at ${time.trim()}.`
      );
      return;
    }

    const newSession = {
      subject: subject.trim(),
      duration: duration.trim(),
      time: time.trim(),
      minutes: durationInMin,
      repeat, // 'none' | 'daily' | 'weekly'
    };

    addSession(newSession);
    Platform.OS === 'android' && ToastAndroid.show('Session added!', ToastAndroid.SHORT);

    // Clear inputs
    setSubject('');
    setDuration('');
    setTime('');
    setRepeat('none');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Plan a Study Session</Text>

      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (e.g. 45 mins or 1.5 hours)"
        value={duration}
        onChangeText={setDuration}
      />

      <TextInput
        style={styles.input}
        placeholder="Time (e.g. 4:00 PM)"
        value={time}
        onChangeText={setTime}
      />

      <Text style={styles.label}>Repeat</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={repeat}
          onValueChange={(itemValue) => setRepeat(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="None" value="none" />
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Session</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f7f7ff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#2E54E8' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    color: '#444',
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#2E54E8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
});


