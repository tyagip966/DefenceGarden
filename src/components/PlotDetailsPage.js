import { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, Image, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { UserContext } from './UserContext';
import Parse from 'parse/react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const PlotDetailsPage = ({ route, navigation }) => {
  const { listing } = route.params;
  const [bookingAmount, setBookingAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [mobile, setMobile] = useState('');
  const { user } = useContext(UserContext);
  const [isImageViewVisible, setImageViewVisible] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: listing.get('Plot_Name') + " Details",
      headerTitleAlign: 'left',
      headerStyle: {
        backgroundColor: '#075E54',
      },
      headerTintColor: '#FFFFFF',
    });
  });

  const imagesForViewer = [{ source: require('DefenceGarden/src/assets/plot_map.jpg') }];

  const handleNext = () => {
    const userData = {
      name: name,
      address: address,
      aadhaar: aadhaar,
      pan: pan,
    };
    setShowModal(true);
  };

  const handleBook = () => {
    var options = {
      description: 'Booking for Plot ' + listing.get('Plot_Name'),
      image: 'https://i.imgur.com/3g7nmJC.png',
      currency: 'INR',
      amount: bookingAmount * 100,
      key: 'rzp_test_TSpeB7RVIdmzix',
      name: 'Defence Garden',
      prefill: {
        contact: mobile,
        name: name
      },
      theme: { color: '#F37254' }
    }

    RazorpayCheckout.open(options)
      .then((data) => {
        createCustomerInfo(data.razorpay_payment_id).then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'NormalUserDashboard' }],
          });
        });
      })
      .catch((error) => {
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  const createCustomerInfo = async (PaymentID) => {
    const myNewObject = new Parse.Object('CustomerInfo');
    myNewObject.set('Name', name);
    myNewObject.set('PANNo', pan);
    myNewObject.set('Mobile', mobile);
    myNewObject.set('Address', address);
    myNewObject.set('AadhaarNo', aadhaar);
    myNewObject.set('PaymentID', PaymentID);
    myNewObject.set('BrokerName', user.get('FullName'));
    myNewObject.set('BookingAmount', bookingAmount);
    try {
      const result = await myNewObject.save();
      console.log('CustomerInfo created', result);
    } catch (error) {
      console.error('Error while creating CustomerInfo: ', error);
    }
  };

  const handleBookingAmountChange = (text) => {
    const numberValue = parseFloat(text);
    if (!isNaN(numberValue)) {
      setBookingAmount(numberValue);
    }
  };

  const handleMobileChange = (text) => {
    setMobile(text.replace(/[^0-9]/g, ''));
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  // const renderSliderImages = () => {
  //   return (
  //     <TouchableOpacity onPress={() => setImageViewVisible(true)}>
  //       <Image source={require('DefenceGarden/src/assets/plot_map.jpg')} style={styles.sliderImage} />
  //     </TouchableOpacity>
  //   );
  // };

  return (
    // <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      // <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} style={{ flex: 1 }}>
        <View style={styles.container}>

          {isImageViewVisible && (
            <Modal
              visible={isImageViewVisible}
              transparent={true}
              onRequestClose={() => setImageViewVisible(false)}
            >
              <View style={{ flex: 1, backgroundColor: '#E6E6E6' }}>
                <ImageViewer
                  imageUrls={[{ url: Image.resolveAssetSource(imagesForViewer[0].source).uri }]}
                  index={0}
                  onSwipeDown={() => setImageViewVisible(false)}
                  enableSwipeDown={true}
                />
                <TouchableOpacity
                  style={[styles.closeButton, { zIndex: 1000 }]}
                  onPress={() => setImageViewVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          )}

          <ScrollView style={{ width: '100%' }} >
            <View style={styles.formContainer}>
              <View style={styles.plotDetails}>
                <Text style={styles.heading}>{listing.get('Plot_Name')}</Text>
                <Text style={styles.info}>Yard: {listing.get('Yard')}</Text>
                <Text style={styles.info}>Meter: {listing.get('Meter')}</Text>
                <Text style={styles.info}>Dimensions: {listing.get('Dimensions')}</Text>
              </View>

              <Text style={styles.formHeading}>User Information</Text>
              <TextInput placeholderTextColor="grey" style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
              <TextInput placeholderTextColor="grey" style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
              <TextInput placeholderTextColor="grey" style={styles.input} placeholder="Aadhaar number" value={aadhaar} onChangeText={setAadhaar} />
              <TextInput placeholderTextColor="grey" style={styles.input} placeholder="PAN number" value={pan} onChangeText={setPan} />
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                keyboardType="numeric"
                value={mobile}
                maxLength={10}
                onChangeText={handleMobileChange}
              />
            </View>
          </ScrollView>

          <Button title="Next" onPress={handleNext} disabled={!name || !address || !aadhaar || !pan || mobile.length !== 10} />

          <Modal visible={showModal} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.card}>
                <Text style={styles.modalHeading}>Enter your Booking Amount</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Booking Amount"
                  keyboardType="numeric"
                  value={bookingAmount}
                  onChangeText={handleBookingAmountChange}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
                    <Text style={styles.buttonText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      // {/* </ScrollView> */}
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E6E6E6',
  },
  sliderContainer: {
    height: '25%',
    width: '100%',
  },
  sliderImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  formContainer: {
    width: '98%',
  },
  plotDetails: {
    backgroundColor: '#E6E6E6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  formHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginBottom: 5,
    color: 'black',
    placeholderTextColor: 'grey',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  bookButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 30,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15
  },
  closeButtonText: {
    color: 'white',
    padding: 10,
    fontSize: 18
  },
});

export default PlotDetailsPage;


/*

// if (listing.images && listing.images.length > 0) {
    //   return listing.images.map((image, index) => (
    //     <TouchableOpacity key={index} onPress={() => setImageViewVisible(true)}>
    //       <Image source={{ uri: image }} style={styles.sliderImage} />
    //     </TouchableOpacity>
    //   ));
    // }

*/