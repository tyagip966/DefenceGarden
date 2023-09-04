import React from 'react';
import { View, Text } from 'react-native';

const PlotManagementPage = ({ route }) => {
  const { location } = route.params;

  // Fetch plot data for the selected location from API or use dummy data
  const plotList = [
    {
      id: 'plot1',
      plotNumber: 'Plot 1',
      // Other plot details
    },
    {
      id: 'plot2',
      plotNumber: 'Plot 2',
      // Other plot details
    },
    // Add more plots
  ];

  return (
    <View>
      <Text>Location: {location.name}</Text>
      {plotList.map((plot) => (
        <Text key={plot.id}>{plot.plotNumber}</Text>
      ))}
    </View>
  );
};

export default PlotManagementPage;