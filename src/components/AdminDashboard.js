import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AdminDashboard = ({ navigation }) => {
  const userManagementList = [
    {
      id: 'user1',
      name: 'User 1',
      address: 'Address 1',
      aadhaar: '1234567890',
      pan: 'ABCDE1234F',
    },
    {
      id: 'user2',
      name: 'User 2',
      address: 'Address 2',
      aadhaar: '0987654321',
      pan: 'PQRST5678G',
    },
  ];

  const handleUserPress = (user) => {
    // Handle navigation to user details page
    navigation.navigate('UserDetailsPage', { user });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item)}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userManagementList}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default AdminDashboard;
