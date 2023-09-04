import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';

const BookingAmountPopup = () => {
  const [bookingAmount, setBookingAmount] = useState('');

  const handleBook = () => {
    if (!bookingAmount || isNaN(bookingAmount) || bookingAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid booking amount.');
      return;
    }
    // Proceed with booking
  };

  return (
    <View>
      <TextInput
        placeholder="Enter your Booking Amount"
        value={bookingAmount}
        onChangeText={setBookingAmount}
        keyboardType="numeric"
      />
      <Button title="Book" onPress={handleBook} />
    </View>
  );
};

export default BookingAmountPopup;