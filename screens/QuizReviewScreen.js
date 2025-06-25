import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

export default function QuizReviewScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { subject, questions, userAnswers, score } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{subject} - Quiz Review</Text>
      <Text style={styles.score}>You scored {score} out of {questions.length}</Text>

      <FlatList
        data={questions}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === item.correctAnswer;
          return (
            <View style={styles.questionBlock}>
              <Text style={styles.question}>{index + 1}. {item.question}</Text>
              <Text style={{ color: isCorrect ? 'green' : 'red' }}>
                Your answer: {userAnswer || 'No Answer'} {isCorrect ? '✓' : '✗'}
              </Text>
              <Text style={styles.explanation}>Explanation: {item.explanation}</Text>
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MainTab', { screen: 'Quiz' })}
      >
        <Text style={styles.buttonText}>Go to Quiz Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  score: { fontSize: 18, textAlign: 'center', marginBottom: 20, color: '#2E7D32' },
  questionBlock: { marginBottom: 15 },
  question: { fontWeight: 'bold', marginBottom: 4 },
  explanation: { fontStyle: 'italic', color: '#555', marginTop: 4 },
  button: {
    marginTop: 20,
    backgroundColor: '#2E54E8',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
