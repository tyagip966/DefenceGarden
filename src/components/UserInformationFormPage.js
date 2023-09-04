import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const UserInformationFormPage = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');

  const handleSubmit = () => {
    // Handle form submission
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        placeholder="Aadhaar Number"
        value={aadhaarNumber}
        onChangeText={setAadhaarNumber}
      />
      <TextInput
        placeholder="PAN Number"
        value={panNumber}
        onChangeText={setPanNumber}
      />
      <Button title="Next" onPress={handleSubmit} />
    </View>
  );
};

export default UserInformationFormPage;