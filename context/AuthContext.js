import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
          setUserToken('dummy-token');
        } else {
          setUserToken(null);
        }

        const storedSessions = await AsyncStorage.getItem('sessions');
        let loadedSessions = storedSessions ? JSON.parse(storedSessions) : [];

        
        loadedSessions = generateRepeatedSessions(loadedSessions);

        setSessions(sortSessionsByDateTime(loadedSessions));
      } catch (e) {
        console.log('Load error:', e);
        setUserToken(null);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('sessions', JSON.stringify(sessions)).catch(e =>
      console.log('Save sessions error:', e)
    );
  }, [sessions]);

  const login = async (user) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUserData(user);
    setUserToken('dummy-token');
    await requestNotificationPermission();
    await scheduleDailyReminder(); 
  };

  const logout = async () => {
  try {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('sessions');
    await AsyncStorage.removeItem('rememberMe');
    await AsyncStorage.removeItem('rememberedEmail');
    await AsyncStorage.removeItem('rememberedPassword');

    setUserToken(null);
    setUserData(null);
    setSessions([]);
  } catch (e) {
    console.log('Logout error:', e);
  }
};


  const addSession = (session) => {
    const today = new Date().toISOString().split('T')[0];
    const newSession = {
      ...session,
      date: today,
      completed: false,
    };
    setSessions(prev => {
      const updated = [...prev, newSession];
      return sortSessionsByDateTime(updated);
    });
  };

  const deleteSession = (index) => {
    setSessions(prev => prev.filter((_, i) => i !== index));
  };

  const markCompleted = (index) => {
    setSessions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completed: true };
      return updated;
    });
  };

  const timeToMinutes = (timeStr) => {
    const [time, meridian] = timeStr.trim().split(' ');
    if (!time || !meridian) return 0;
    let [h, m] = time.split(':').map(Number);
    if (meridian.toUpperCase() === 'PM' && h !== 12) h += 12;
    if (meridian.toUpperCase() === 'AM' && h === 12) h = 0;
    return h * 60 + (m || 0);
  };

  const sortSessionsByDateTime = (sessionList) => {
    return sessionList.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const getDueSessions = () => {
    const today = getTodayDate();
    return sessions.filter(s => !s.completed && s.date < today);
  };

  const getTodaySessions = () => {
    const today = getTodayDate();
    return sessions.filter(s => !s.completed && s.date === today);
  };

  const getCompletedSessions = () => sessions.filter(s => s.completed);

  
  const generateRepeatedSessions = (allSessions) => {
    const today = getTodayDate();
    const todayDay = new Date().getDay(); 

    const alreadyExists = (subj, time) =>
      allSessions.some(s => s.date === today && s.subject === subj && s.time === time);

    const newOnes = [];

    for (const s of allSessions) {
      if ((s.repeat === 'daily' || (s.repeat === 'weekly' && sameDay(s.date, today))) && !alreadyExists(s.subject, s.time)) {
        const newSession = {
          ...s,
          date: today,
          completed: false,
        };
        newOnes.push(newSession);
      }
    }

    return [...allSessions, ...newOnes];
  };

  const sameDay = (dateStr1, dateStr2) => {
    const d1 = new Date(dateStr1);
    const d2 = new Date(dateStr2);
    return d1.getDay() === d2.getDay(); 
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        isAuthenticated: !!userToken,
        setUserToken,
        userData,
        setUserData,
        login,
        logout,
        sessions,
        addSession,
        deleteSession,
        markCompleted,
        getDueSessions,
        getTodaySessions,
        getCompletedSessions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};




