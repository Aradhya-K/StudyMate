import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { colors } = useTheme();
  

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    saveNotes();
  }, [notes]);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem('notes');
      if (stored) setNotes(JSON.parse(stored));
    } catch (e) {
      console.log('Load notes error:', e);
    }
  };

  const saveNotes = async () => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (e) {
      console.log('Save notes error:', e);
    }
  };

  const addNote = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Please fill in both title and content.');
      return;
    }
    const newNote = { id: Date.now().toString(), title, content };
    setNotes(prev => [newNote, ...prev]);
    setTitle('');
    setContent('');
  };

  const deleteNote = (id) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setNotes(prev => prev.filter(note => note.id !== id)),
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <SafeAreaView style={styles.noteCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteContent}>{item.content}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteNote(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return (
    <SafeAreaView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.header}>Your Notes</Text>

      <TextInput
        style={styles.input}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Note Content"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TouchableOpacity style={styles.addButton} onPress={addNote}>
        <Text style={styles.addButtonText}>Add Note</Text>
      </TouchableOpacity>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={{ marginTop: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9ff' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#2E54E8', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#2E54E8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  noteTitle: { fontWeight: 'bold', fontSize: 16 },
  noteContent: { fontSize: 14, marginTop: 4 },
  deleteText: { color: 'red', marginLeft: 12, fontWeight: 'bold' },
});
