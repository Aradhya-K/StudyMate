import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

const subjects = [
  'DBMS', 'DAA', 'OS', 'COA', 'Chemistry', 'Physics', 'Maths', 'BME', 'DEC',
  'History', 'Geography', 'General Science', 'AI', 'C Programming', 'Java',
  'Python', 'English', 'Biology', 'React Native', 'CSS', 'JavaScript'
];

const screenWidth = Dimensions.get('window').width;
const itemMargin = 12;
const numColumns = 3;
const itemSize = (screenWidth - itemMargin * (numColumns + 1)) / numColumns;

export default function QuizHomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const renderItem = ({ item }) => (
  <SafeAreaView style={styles.itemWrapper}>
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => navigation.navigate('QuizPlay', { subject: item })}
    >
      <Text style={styles.gridText}>{item}</Text>
    </TouchableOpacity>
  </SafeAreaView>
);


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Select a Subject to Start Quiz</Text>
      <FlatList
        data={subjects}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={numColumns}
        contentContainerStyle={styles.gridContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 12,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E54E8',
  },
  gridContainer: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  itemWrapper: {
    flex: 1 / 3,
    padding: 8,
  },
  gridItem: {
    backgroundColor: '#2E54E8',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 4,
    marginBottom: 8,
  },
  gridText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
    paddingHorizontal: 4,
  },
});
