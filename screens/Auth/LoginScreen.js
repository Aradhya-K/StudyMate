import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const { login } = useContext(AuthContext);

  useEffect(() => {
  const restoreRemembered = async () => {
    const rem = await AsyncStorage.getItem('rememberMe');
    if (rem === 'true') {
      const remEmail = await AsyncStorage.getItem('rememberedEmail');
      const remPass = await AsyncStorage.getItem('rememberedPassword');
      if (remEmail && remPass) {
        setEmail(remEmail);
        setPassword(remPass);
        setRememberMe(true);
        return;
      }
    }

    setEmail('');
    setPassword('');
    setRememberMe(false);
  };

  restoreRemembered();
}, []);



  useFocusEffect(
    React.useCallback(() => {
      setEmail('');
      setPassword('');
      setEmailError('');
      setPasswordError('');
      setLoginError('');
    }, [])
  );

  const handleLogin = async () => {
  if (!email.trim()) {
    setEmailError('Please enter your email');
    return;
  }

  if (!password.trim()) {
    setPasswordError('Please enter your password');
    return;
  }

  try {
    const storedUser = await AsyncStorage.getItem('user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.email !== email) {
        setLoginError('No account found. Please sign up.');
      } else if (parsedUser.password !== password) {
        setLoginError('Invalid password');
      } else {
        if (rememberMe) {
          await AsyncStorage.setItem('rememberMe', 'true');
          await AsyncStorage.setItem('rememberedEmail', email);
          await AsyncStorage.setItem('rememberedPassword', password);
        } else {
          await AsyncStorage.removeItem('rememberMe');
          await AsyncStorage.removeItem('rememberedEmail');
          await AsyncStorage.removeItem('rememberedPassword');
        }
        await login(parsedUser);
      }
    } else {
      setLoginError('No account found. Please sign up.');
    }
  } catch (e) {
    console.log('Login error:', e);
    setLoginError('Something went wrong');
  }
};

  const handleForgotPassword = async () => {
    const stored = await AsyncStorage.getItem('user');
    if (!stored) {
      return Alert.alert('No account found', 'Please sign up first.');
    }
    const { email: userEmail, password: userPassword } = JSON.parse(stored);
    Alert.alert('Reset Password (demo)', `Email: ${userEmail}\nPassword: ${userPassword}`);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/studymate-logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome to StudyMate</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setEmailError('');
            setLoginError('');
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
            setLoginError('');
          }}
        />
        {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
        {!!loginError && <Text style={styles.errorText}>{loginError}</Text>}

        <View style={styles.optionsRow}>
          <View style={styles.rememberMeContainer}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              thumbColor={rememberMe ? '#2E54E8' : '#f4f3f4'}
              trackColor={{ false: '#767577', true: '#a9b7ff' }}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </View>
          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setEmail('');
            setPassword('');
            navigation.navigate('Signup');
          }}
        >
          <Text style={styles.signupText}>
            Don't have an account? <Text style={{ fontWeight: 'bold', color: '#2E54E8' }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 40,
    borderRadius: 90,
  },
  title: {
    fontSize: 24,
    color: '#0b1d51',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
  },
  optionsRow: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: 8,
    color: '#0b1d51',
  },
  forgotPasswordText: {
    color: '#2E54E8',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#2E54E8',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
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
