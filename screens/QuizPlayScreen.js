import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

const quizData = {
  DBMS: [
    {
      question: "What does DBMS stand for?",
      options: ["Database Management System", "Data Bank", "Data Store", "Data Structure"],
      correctAnswer: "Database Management System",
      explanation: "DBMS is software for managing databases."
    },
    {
      question: "Which is a relational database?",
      options: ["MySQL", "MongoDB", "Neo4j", "Firebase"],
      correctAnswer: "MySQL",
      explanation: "MySQL is a relational DB."
    },
    {
      question: "What is SQL used for?",
      options: ["Styling", "Querying", "Designing", "Scripting"],
      correctAnswer: "Querying",
      explanation: "SQL is used to query and manage databases."
    },
  ],

  DAA: [
    {
      question: "Which algorithm uses divide and conquer?",
      options: ["Merge Sort", "Bubble Sort", "Linear Search", "Selection Sort"],
      correctAnswer: "Merge Sort",
      explanation: "Merge sort divides and then merges."
    },
    {
      question: "Time complexity of binary search?",
      options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
      correctAnswer: "O(log n)",
      explanation: "It halves the array each time."
    },
    {
      question: "Which uses greedy technique?",
      options: ["Kruskal's", "Merge Sort", "DFS", "Backtracking"],
      correctAnswer: "Kruskal's",
      explanation: "Kruskal’s is a greedy algorithm."
    },
  ],

  OS: [
    {
      question: "Which is a function of OS?",
      options: ["Resource Management", "Coding", "Browsing", "Gaming"],
      correctAnswer: "Resource Management",
      explanation: "OS manages resources and processes."
    },
    {
      question: "Deadlock occurs when?",
      options: ["Processes wait forever", "High CPU", "Low RAM", "Paging fails"],
      correctAnswer: "Processes wait forever",
      explanation: "Deadlock means indefinite wait."
    },
    {
      question: "Which is not a scheduling algorithm?",
      options: ["FIFO", "Round Robin", "LIFO", "SJF"],
      correctAnswer: "LIFO",
      explanation: "LIFO is not used for CPU scheduling."
    },
  ],

  COA: [
    {
      question: "Which is a type of register?",
      options: ["MAR", "SSD", "ROM", "USB"],
      correctAnswer: "MAR",
      explanation: "MAR = Memory Address Register."
    },
    {
      question: "ALU performs?",
      options: ["Arithmetic", "Drawing", "Networking", "Storage"],
      correctAnswer: "Arithmetic",
      explanation: "ALU = Arithmetic Logic Unit."
    },
    {
      question: "Binary of 5?",
      options: ["101", "111", "100", "110"],
      correctAnswer: "101",
      explanation: "5 in binary is 101."
    },
  ],

  Chemistry: [
    {
      question: "Water's chemical formula?",
      options: ["H2O", "CO2", "NaCl", "H2SO4"],
      correctAnswer: "H2O",
      explanation: "H2O = Water."
    },
    {
      question: "Atomic number of Oxygen?",
      options: ["8", "16", "12", "6"],
      correctAnswer: "8",
      explanation: "Oxygen has atomic number 8."
    },
    {
      question: "Acids turn litmus paper?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correctAnswer: "Red",
      explanation: "Acids turn blue litmus red."
    },
  ],

  Physics: [
    {
      question: "Speed formula?",
      options: ["Distance/Time", "Mass/Force", "Energy/Power", "Work/Force"],
      correctAnswer: "Distance/Time",
      explanation: "Speed = Distance / Time."
    },
    {
      question: "SI unit of force?",
      options: ["Newton", "Joule", "Watt", "Meter"],
      correctAnswer: "Newton",
      explanation: "Force is measured in Newton."
    },
    {
      question: "Earth's gravity?",
      options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "9 m/s²"],
      correctAnswer: "9.8 m/s²",
      explanation: "Standard gravity is 9.8 m/s²."
    },
  ],

  Maths: [
    {
      question: "Value of π?",
      options: ["3.14", "2.17", "1.41", "1.73"],
      correctAnswer: "3.14",
      explanation: "π = 3.14159..."
    },
    {
      question: "Integral of dx?",
      options: ["x + C", "1", "x²", "0"],
      correctAnswer: "x + C",
      explanation: "Basic integration rule."
    },
    {
      question: "What is 2²?",
      options: ["4", "2", "8", "16"],
      correctAnswer: "4",
      explanation: "2² = 4."
    },
  ],

  BME: [
    {
      question: "Heart is part of?",
      options: ["Circulatory system", "Digestive", "Respiratory", "Nervous"],
      correctAnswer: "Circulatory system",
      explanation: "Heart pumps blood."
    },
    {
      question: "MRI uses?",
      options: ["Magnetic field", "X-rays", "Ultrasound", "Laser"],
      correctAnswer: "Magnetic field",
      explanation: "MRI = Magnetic Resonance Imaging."
    },
    {
      question: "ECG is for?",
      options: ["Heart", "Brain", "Lungs", "Liver"],
      correctAnswer: "Heart",
      explanation: "ECG = Electrocardiogram."
    },
  ],

  DEC: [
    {
      question: "Which is a logic gate?",
      options: ["AND", "USB", "LAN", "RAM"],
      correctAnswer: "AND",
      explanation: "AND is a basic logic gate."
    },
    {
      question: "0 + 1 = ? (Binary)",
      options: ["1", "0", "2", "10"],
      correctAnswer: "1",
      explanation: "Binary addition: 0 + 1 = 1."
    },
    {
      question: "Flip-flop stores?",
      options: ["1-bit", "8-bit", "Byte", "Word"],
      correctAnswer: "1-bit",
      explanation: "Flip-flop stores one bit."
    },
  ],

  History: [
    {
      question: "Who discovered India by sea?",
      options: ["Vasco da Gama", "Columbus", "Alexander", "Akbar"],
      correctAnswer: "Vasco da Gama",
      explanation: "He reached India in 1498."
    },
    {
      question: "Who wrote the Indian Constitution?",
      options: ["Ambedkar", "Nehru", "Gandhi", "Patel"],
      correctAnswer: "Ambedkar",
      explanation: "Dr. B. R. Ambedkar was the chief architect."
    },
    {
      question: "When did India gain independence?",
      options: ["1947", "1950", "1942", "1857"],
      correctAnswer: "1947",
      explanation: "India became free on Aug 15, 1947."
    },
  ],
};



export default function QuizPlayScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { subject } = route.params;

  const questions = quizData[subject] || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(15);
  const [userAnswers, setUserAnswers] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, selectedOption]);

  useEffect(() => {
    if (timer === 0) {
      handleOptionPress(null);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const currentQuestion = questions[currentIndex];

  const handleOptionPress = (option) => {
    if (selectedOption) return;

    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correctAnswer;
    setUserAnswers((prev) => [...prev, option]);
    if (isCorrect) setScore((prev) => prev + 1);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption('');
        setTimer(15);
      } else {
        navigation.replace('QuizReview', {
          subject,
          questions,
          userAnswers: [...userAnswers, option],
          score: isCorrect ? score + 1 : score,
        });
      }
    }, 800);
  };

  if (!questions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.questionText}>No questions available for {subject}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subjectTitle}>{subject} Quiz</Text>
      <Text style={styles.timerText}>Time Left: {timer}s</Text>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.questionText}>
          {currentIndex + 1}. {currentQuestion.question}
        </Text>

        <FlatList
          data={currentQuestion.options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const isSelected = selectedOption === item;
            const isCorrect = item === currentQuestion.correctAnswer;
            let backgroundColor = '#e0e0e0';

            if (selectedOption) {
              if (isSelected) {
                backgroundColor = isCorrect ? '#4CAF50' : '#f44336';
              } else if (isCorrect) {
                backgroundColor = '#4CAF50';
              }
            }

            return (
              <TouchableOpacity
                style={[styles.optionButton, { backgroundColor }]}
                onPress={() => handleOptionPress(item)}
                disabled={!!selectedOption}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />

        {!!selectedOption && (
          <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  subjectTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E54E8',
    marginBottom: 8,
    textAlign: 'center',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
  },
  questionText: { fontSize: 20, marginBottom: 15, fontWeight: 'bold' },
  optionButton: {
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: { fontSize: 16 },
  explanationText: {
    fontStyle: 'italic',
    fontSize: 15,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
});