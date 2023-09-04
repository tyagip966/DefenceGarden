import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const UserDetailsPage = ({ route }) => {
  const { user } = route.params;

  const handleEdit = () => {
    // Handle logic for editing the user
  };

  const handleDelete = () => {
    // Handle logic for deleting the user
  };

  return (
    <View style={styles.container}>
      <Text>Name: {user.name}</Text>
      <Text>Address: {user.address}</Text>
      <Text>Aadhaar Number: {user.aadhaar}</Text>
      <Text>PAN Number: {user.pan}</Text>
      <Button title="Edit" onPress={handleEdit} />
      <Button title="Delete" onPress={handleDelete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserDetailsPage;
