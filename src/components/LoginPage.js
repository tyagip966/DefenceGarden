import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from 'react-native';
import { enableScreens } from 'react-native-screens';
import Parse from "parse/react-native";
import { UserContext } from './UserContext';
import Icon from 'react-native-vector-icons/FontAwesome';

enableScreens();

const LoginPage = ({ route, navigation }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(UserContext);


  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert('Error', 'Both fields are required');
      return;
    }

    const mobileValidation = /^[0-9]{10}$/;
    if (!mobileValidation.test(mobileNumber)) {
      Alert.alert('Error', 'Mobile number should be 10 digits and numeric');
      return;
    }

    // Concatenate +91 before mobile number
    const fullMobileNumber = '+91' + mobileNumber;

    // Your login logic using fullMobileNumber and password
    try {

      const loggedInUser = await Parse.User.logIn(fullMobileNumber, password);
      // logIn returns the corresponding ParseUser object

      if (loggedInUser) {
        setUser(loggedInUser);
        setMobileNumber('');
        setPassword('');
        navigation.reset({
          index: 0,
          routes: [{ name: 'NormalUserDashboard' }],
        });
      }

    } catch (error) {
      Alert.alert(`Error! ${error.message}`);
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('DefenceGarden/src/assets/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.welcomeMessage}>Hey there!</Text>
        <Text style={styles.subMessage}>Welcome to Defence Garden!</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="numeric"
        maxLength={10}
      />
      <TextInput
        style={[styles.input, { marginBottom: 10 }]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={!mobileNumber || !password}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Connect with us on:</Text>
        <View style={styles.socialIcons}>
          <Icon name="facebook" size={24} color="#3b5998" onPress={() => {/* Handle your FB link here */}} />
          <Icon name="instagram" size={24} color="#d62976" style={{ marginLeft: 20 }} onPress={() => {/* Handle your Insta link here */}} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 40,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3b5965', // Cyan color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
  },
  footerText: {
    marginBottom: 10,
    fontSize: 16,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: '60%',
    height: '70%',
    resizeMode: 'contain',
  },
  messageContainer: {
    alignSelf: 'flex-start', // Aligning the container to the start (left)
    width: '100%',
    paddingHorizontal: 10,  // Padding to align with the text fields
  },
  welcomeMessage: {
    fontSize: 16,
    marginBottom: 5,
  },
  subMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    position: 'absolute', // Positioned at the bottom
    bottom: 20, // Spacing from the bottom
  },
});

export default LoginPage;
