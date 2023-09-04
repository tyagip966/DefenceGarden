import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LogoutButton = ({ onLogout }) => {

  return (
    <TouchableOpacity style={styles.button} >
      <Icon.Button style={{ marginRight: -10 }}
        name="sign-out"
        backgroundColor="#075E54"
        size={30}
        color="white"
        onPress={() => {
          Alert.alert(
            "Confirmation",
            "Do you really want to logout?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "Yes", onPress: onLogout }
            ],
            { cancelable: true }
          );
        }}
      >
      </Icon.Button>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    backgroundColor: '#075E54',
  }
});

export default LogoutButton;
