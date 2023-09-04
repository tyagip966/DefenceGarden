import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

const OTPPage = ({ route, navigation }) => {
  const { mobileNumber, cognitoUser } = route.params;
  const [otp, setOTP] = useState('');
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleResendOTP = async () => {
    try {
      await Auth.signIn(mobileNumber);
      setTimer(60);
      setResendDisabled(true);
    } catch (error) {
      console.log('Error resending OTP:', error);
    }
  };

  const handleLogin = async () => {

  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="OTP"
        value={otp}
        onChangeText={setOTP}
      />
      <Text>{timer} seconds remaining</Text>
      <Button title="Resend OTP" onPress={handleResendOTP} disabled={resendDisabled || timer > 0} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default OTPPage;
