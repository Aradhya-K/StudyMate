import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');

  useFocusEffect(
    useCallback(() => {
      setName('');
      setEmail('');
      setPassword('');
      setNameError('');
      setEmailError('');
      setPasswordError('');
      setSignupError('');
    }, [])
  );
  
  const handleSignup = async () => {
  let valid = true;

  if (!name.trim()) {
    setNameError('Please enter your name');
    valid = false;
  }

  if (!email.trim()) {
    setEmailError('Please enter your email');
    valid = false;
  } else if (!email.includes('@')) {
    setEmailError('Enter a valid email');
    valid = false;
  }

  if (!password.trim()) {
    setPasswordError('Please enter a password');
    valid = false;
  } else if (password.length < 4) {
    setPasswordError('Password should be at least 4 characters');
    valid = false;
  }

  if (!valid) return;

  try {
    const existingUser = await AsyncStorage.getItem('user');
    if (existingUser) {
      const parsedUser = JSON.parse(existingUser);
      if (parsedUser.email === email) {
        setSignupError('An account already exists with this email');
        return;
      }
    }

    const newUser = { name, email, password };
    await AsyncStorage.setItem('user', JSON.stringify(newUser));

    
    await AsyncStorage.removeItem('rememberMe');
    await AsyncStorage.removeItem('rememberedEmail');
    await AsyncStorage.removeItem('rememberedPassword');

    Alert.alert('Account Created', 'Account Created Successfully', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
  } catch (e) {
    console.log('Signup error:', e);
    setSignupError('Something went wrong. Please try again.');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Image source={require('../../assets/studymate-logo.png')} style={styles.logo} />
      <Text style={styles.title}>Create your StudyMate Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={text => {
          setName(text);
          setNameError('');
          setSignupError('');
        }}
      />
      {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={text => {
          setEmail(text);
          setEmailError('');
          setSignupError('');
        }}
      />
      {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => {
          setPassword(text);
          setPasswordError('');
          setSignupError('');
        }}
      />
      {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      {!!signupError && <Text style={styles.errorText}>{signupError}</Text>}

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setName('');
          setEmail('');
          setPassword('');
          navigation.navigate('Login');
        }}
      >
        <Text style={styles.loginText}>
          Already have an account? <Text style={{ fontWeight: 'bold', color: '#2E54E8' }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 40,
    borderRadius: 80,
  },
  title: {
    fontSize: 22,
    color: '#0b1d51',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
  },
  signupButton: {
    backgroundColor: '#2E54E8',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  signupButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    color: '#0b1d51',
    marginTop: 20,
    textAlign: 'center',
  },
  errorText: {
    width: '80%',
    color: 'red',
    marginBottom: 10,
    fontSize: 13,
  },
});

