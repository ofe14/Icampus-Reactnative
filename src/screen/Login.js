import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../db/db_config';
import { useNavigation } from '@react-navigation/native';
import Home from './Home';
import { SIZES, COLORS } from '../../constants';
import { images } from '../../constants';
import NewtonCradleLoader from './loader';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading indicator
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true); // Start loading indicator
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Error Check your internet connection');
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={images.logo2}
          resizeMode='contain'
          style={styles.logoImage}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
      {loading && (
        <View style={styles.loadingOverlay}>
          <NewtonCradleLoader />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.white
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    width: 300,
    height: 300,
    borderRadius: SIZES.medium,
    marginBottom: 20,
    backgroundColor: COLORS.white
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#a65fb5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    color: '#a65fb5',
    marginTop: 15,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen;
