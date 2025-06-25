import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  Linking,
  ToastAndroid,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function ProfileScreen() {
  const { userData, setUserData, logout } = useContext(AuthContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const colorScheme = useColorScheme();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [profileImage, setProfileImage] = useState(userData?.photo || null);

  const effectiveTheme = theme === 'system' ? colorScheme : theme;
  const isDark = effectiveTheme === 'dark';

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      ToastAndroid.show('Name and Email cannot be empty.', ToastAndroid.SHORT);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      ToastAndroid.show('Invalid email format.', ToastAndroid.SHORT);
      return;
    }

    const updatedUser = { ...userData, name, email, photo: profileImage };
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUserData(updatedUser);
    setEditMode(false);
    ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    const galleryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted || !galleryResult.granted) {
      Alert.alert('Permissions required', 'Please grant camera and gallery access.');
      return;
    }

    Alert.alert('Change Profile Picture', 'Choose an option', [
      {
        text: 'Camera',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      {
        text: 'Gallery',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLink = (type) => {
    if (type === 'rate') {
      Linking.openURL('https://play.google.com/store/apps/details?id=com.studymate.app');
    } else if (type === 'support') {
      Linking.openURL('mailto:support@studymate.com');
    } else if (type === 'about') {
      Alert.alert('About StudyMate', 'StudyMate helps you organize your learning with sessions, quizzes, progress tracking and more!');
    }
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: isDark ? '#121212' : '#f0f4ff' }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Picture */}
        <View style={styles.imageWrapper}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/studymate-logo.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
            <Ionicons name="pencil" size={18} color="white" />
          </TouchableOpacity>
        </View>

        {/* Name and Email */}
        {editMode ? (
          <>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={name}
              onChangeText={setName}
              placeholder="Enter Name"
              placeholderTextColor="#aaa"
            />
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter Email"
              keyboardType="email-address"
              placeholderTextColor="#aaa"
            />
          </>
        ) : (
          <>
            <Text style={[styles.name, isDark && { color: 'white' }]}>{userData?.name || 'Your Name'}</Text>
            <Text style={[styles.email, isDark && { color: '#ccc' }]}>{userData?.email || 'your@email.com'}</Text>
          </>
        )}

        {/* Edit / Save button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#a9b7ff' }]}
          onPress={editMode ? handleSave : () => setEditMode(true)}
        >
          <Text style={styles.buttonText}>{editMode ? 'Save Changes' : 'Edit Profile'}</Text>
        </TouchableOpacity>

        {/* Theme Buttons */}
        <View style={styles.themeSection}>
          <Text style={[styles.sectionTitle, isDark && { color: '#ccc' }]}>App Theme</Text>
          <View style={styles.themeButtons}>
            <TouchableOpacity style={styles.themeButton} onPress={() => setTheme('light')}>
              <Text style={styles.themeText}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeButton} onPress={() => setTheme('dark')}>
              <Text style={styles.themeText}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeButton} onPress={() => setTheme('system')}>
              <Text style={styles.themeText}>System</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Extra Options */}
        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionItem} onPress={() => handleLink('rate')}>
            <Ionicons name="star-outline" size={20} color="#2E54E8" />
            <Text style={styles.optionText}>Rate StudyMate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={() => handleLink('support')}>
            <Ionicons name="mail-outline" size={20} color="#2E54E8" />
            <Text style={styles.optionText}>Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={() => handleLink('about')}>
            <Ionicons name="information-circle-outline" size={20} color="#2E54E8" />
            <Text style={styles.optionText}>About StudyMate</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2E54E8',
    borderRadius: 12,
    padding: 6,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0b1d51',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    color: '#000',
  },
  inputDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
    color: '#fff',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#0b1d51',
    fontWeight: 'bold',
  },
  themeSection: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  themeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  themeButton: {
    padding: 10,
    backgroundColor: '#e3e7ff',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  themeText: {
    color: '#0b1d51',
    fontWeight: 'bold',
  },
  optionsSection: {
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#2E54E8',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ff4d4f',
    padding: 14,
    borderRadius: 8,
    width: '70%',
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
