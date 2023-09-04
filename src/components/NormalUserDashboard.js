import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Modal, Button, Image } from 'react-native';
import Parse from "parse/react-native";
import { UserContext } from './UserContext';
import { SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const NormalUserDashboard = ({ navigation }) => {
  const [plotListings, setPlotListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalVisible, setModalVisible] = useState(false);
  const { user } = useContext(UserContext);


  useEffect(() => {
    navigation.setOptions({
      title: "Plots",
      headerTitleAlign: 'left', // This aligns the title to the left
      headerStyle: {
        backgroundColor: '#075E54',
      },
      headerTintColor: '#FFFFFF',
    });
}, [navigation]);

  useEffect(() => {
    fetchPlotsData();
  }, [searchTerm, filter]);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user]);

  const updateSearch = (search) => {
    setSearchTerm(search);
  };

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
    if (newFilter === 'all') {
      setFilter(null); // Reset filter to show all plots
    } else {
      setFilter(newFilter);
    }
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

  const renderListingItem = ({ item }) => {
    const capitalize = (text) => {
      return text.charAt(0).toUpperCase() + text.slice(1);
    };

    const isActive = item.get('IsActive');
    const backgroundColor = isActive ? '#128C7E' : '#9E9E9E'; // Blue for active, Gray for inactive

    return (
      <TouchableOpacity
        style={[styles.listingItem, { backgroundColor: backgroundColor }]}
        onPress={() => isActive && handleListingPress(item)}
        disabled={!isActive}
      >
        <Text style={styles.listingTitle}>{capitalize(item.get('Plot_Name'))}</Text>
        <Text style={styles.listingText}>Yard: {item.get('Yard')}</Text>
        <Text style={styles.listingText}>Meter: {item.get('Meter')}</Text>
        <Text style={styles.listingText}>Dimensions: {item.get('Dimensions')}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search Plot Name..."
          onChangeText={updateSearch}
          value={searchTerm}
          round
          // lightTheme
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchInputContainer}
          searchIcon={{ size: 24 }}
          clearIcon={{ size: 24 }}
        />
        <Icon.Button style={{marginRight: -10}}
          name="filter"
          backgroundColor="#E6E6E6"
          size={35}
          color="black"
          onPress={openModal}>
        </Icon.Button>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => handleFilterChange('all')} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterChange('available')} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Available Plots</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterChange('sold')} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Sold Plots</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {plotListings.map(item => (
          <View key={item.id}>{renderListingItem({ item })}</View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E6E6',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
    paddingHorizontal: 10,
    paddingRight: 30, // to ensure the text doesn't appear under the X icon
  },
  clearIcon: {
    position: 'absolute',
    right: 60,
    top: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchBarContainer: {
    flex: 1,
    backgroundColor: '#E6E6E6',
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  searchInputContainer: {
    backgroundColor: '#FFFFFF',
  },
  filterIcon: {
    padding: 5,
  },


  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)' // semi-transparent background
  },
  modalView: {
    width: '60%',
    padding: 20,
    backgroundColor: 'white', // Changed to white for a cleaner appearance
    borderRadius: 30,  // More rounded corners
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center'
  },
  modalButton: {
    width: '100%',
    paddingVertical: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'black', // Text color changed to black
    fontSize: 16,
  },



  listingItem: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 20,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black', // Text color changed to white
  },
  listingText: {
    color: 'black', // Text color changed to white
  },
});

export default NormalUserDashboard;