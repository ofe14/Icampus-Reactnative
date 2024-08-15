// src/screens/ProfileScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../db/db_config';
import { COLORS, SIZES, images } from '../../constants';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            Alert.alert('User not found');
            console.log('No such document!');
          }
        }
      } catch (error) {
        Alert.alert('we ran into a problem please check your internet connection and try again');
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={images.profile} style={styles.profileImage} />
        <Text style={styles.username}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>User Information</Text>
        <Text style={styles.infoText}>Name: {userData.name}</Text>
        <Text style={styles.infoText}>Joined: {new Date(userData.joined).toDateString()}</Text>
        {/* Add more user information as needed */}
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
  },
  email: {
    fontSize: 18,
    color: COLORS.darkGray,
    marginTop: 10,
  },
  infoContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  logoutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;
