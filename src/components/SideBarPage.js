import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Button } from 'react-native';
import Parse from "parse/react-native";
import { UserContext } from './UserContext';
import { SearchBar } from 'react-native-elements';

const NormalUserDashboard = ({ navigation }) => {
  const [plotListings, setPlotListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalVisible, setModalVisible] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchPlotsData();
  }, [searchTerm, filter]);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Available Plots'
    });
  }, [navigation]);

  const handleListingPress = (listing) => {
    navigation.navigate('PlotDetailsPage', { listing });
  };

  const fetchPlotsData = async () => {
    const plots = Parse.Object.extend('plots');
    const query = new Parse.Query(plots);

    if (searchTerm) {
      query.contains('Plot_Name', searchTerm);
    }

    if (filter === 'available') {
      query.equalTo('IsActive', true);
    } else if (filter === 'sold') {
      query.equalTo('IsActive', false);
    }

    try {
      const results = await query.find();
      setPlotListings(results);
    } catch (error) {
      console.error('Error while fetching plots', error);
    }
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    closeModal();
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderListingItem = ({ item, index }) => {
    const capitalize = (text) => {
      return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const isActive = item.get('IsActive');
    const backgroundColor = isActive ? 'green' : 'rgba(255, 255, 102, 0.5)';

    return (
      <TouchableOpacity
        style={[styles.listingItem, { backgroundColor: backgroundColor }]}
        onPress={() => isActive && handleListingPress(item)}
        disabled={!isActive}
      >
        <Text style={styles.listingTitle}>{capitalize(item.get('Plot_Name'))}</Text>
        <Text>Yard: {item.get('Yard')}</Text>
        <Text>Meter: {item.get('Meter')}</Text>
        <Text>Dimensions: {item.get('Dimensions')}</Text>
      </TouchableOpacity>
    );
  };

  // return (
  //   <View style={styles.container}>
  //     <View style={styles.searchContainer}>
  //       <TextInput
  //         style={styles.searchInput}
  //         placeholder="Search Plot Name..."
  //         value={searchTerm}
  //         onChangeText={setSearchTerm}
  //       />
  //       <TouchableOpacity onPress={openModal} style={styles.filterIcon}>
  //         <Text>FILTER</Text>
  //       </TouchableOpacity>
  //     </View>
  //     <Modal
  //       animationType="slide"
  //       transparent={true}
  //       visible={isModalVisible}
  //     >
  //       <View style={styles.modalView}>
  //         <Button title="All" onPress={() => handleFilterChange('all')} />
  //         <Button title="Available Plots" onPress={() => handleFilterChange('available')} />
  //         <Button title="Sold Plots" onPress={() => handleFilterChange('sold')} />
  //         <Button title="Close" onPress={closeModal} />
  //       </View>
  //     </Modal>
  //     <ScrollView contentContainerStyle={styles.scrollContainer}>
  //       {plotListings.map((item, index) => (
  //         <View key={item.id}>{renderListingItem({ item, index })}</View>
  //       ))}
  //     </ScrollView>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Plot Name..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
            <Text>X</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={openModal} style={styles.filterIcon}>
          <Text>FILTER</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
      >
        <View style={styles.modalView}>
          <Button title="All" onPress={() => handleFilterChange('all')} />
          <Button title="Available Plots" onPress={() => handleFilterChange('available')} />
          <Button title="Sold Plots" onPress={() => handleFilterChange('sold')} />
          <Button title="Close" onPress={closeModal} />
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {plotListings.map((item, index) => (
          <View key={item.id}>{renderListingItem({ item, index })}</View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  listingItem: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 20,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  modalView: {
    marginTop: 200,
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  clearIcon: {
    position: 'absolute',
    right: 70,
    top: 10,
    backgroundColor: 'gray',
    borderRadius: 10,
    padding: 5,
    zIndex: 2,
  },
  filterIcon: {
    padding: 5,
    marginLeft: 10,
  },
});

export default NormalUserDashboard;
