import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '@react-navigation/native';

const subjects = ['Math', 'Science', 'History', 'Technology'];

export default function QuizSubjectsScreen({ navigation }) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Subject</Text>

      <FlatList
        data={subjects}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.subjectButton}
            onPress={() => navigation.navigate('QuizScreen', { subject: item })}
          >
            <Text style={styles.subjectText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f8ff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  subjectButton: {
    backgroundColor: '#2E54E8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  subjectText: { color: 'white', fontSize: 18, fontWeight: '600' },
});
