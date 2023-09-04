import React from 'react';
import { View } from 'react-native';
import MenuBar from './MenuBar';

const AppWrapper = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      <MenuBar />
      {children}
    </View>
  );
};

export default AppWrapper;