import { useState, useEffect, useContext } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  Button, Image, TextInput, TouchableOpacity,
  Modal, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { UserContext } from './UserContext';
import Parse from 'parse/react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import RNFS from 'react-native-fs';


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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    const userData = {
      name: name,
      address: address,
      aadhaar: aadhaar,
      pan: pan,
    };
    setShowModal(true);
    setIsLoading(false);
  };

  const handleBook = async () => {
    setIsLoading(true);
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
      theme: { color: '#075E54', backgroundColor: '#E6E6E6' }
    }

    try {
      const paymentResult = await RazorpayCheckout.open(options);
  
      if (paymentResult && paymentResult.razorpay_payment_id) {
        await createCustomerInfo(paymentResult.razorpay_payment_id);
        
        navigation.reset({
          index: 0,
          routes: [{ name: 'NormalUserDashboard' }],
        });
      }
  
      setIsLoading(false); // Hide loader
    } catch (error) {
      console.error("Razorpay or other error: ", error);
      alert(`Error: ${error.code} | ${error.description}`);
      setIsLoading(false); // Hide loader
    }
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

  const renderSliderImages = () => {
    return (
      <TouchableOpacity onPress={() => setImageViewVisible(true)}>
        <Image source={require('DefenceGarden/src/assets/plot_map.jpg')} style={styles.sliderImage} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.sliderContainer}>{renderSliderImages()}</View>

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
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>

              <View style={styles.formContainer}>
                <View style={styles.plotDetails}>
                  <Text style={styles.heading}>{listing.get('Plot_Name')}</Text>
                  <Text style={styles.info}>Yard: {listing.get('Yard')}</Text>
                  <Text style={styles.info}>Meter: {listing.get('Meter')}</Text>
                  <Text style={styles.info}>Dimensions: {listing.get('Dimensions')}</Text>
                  <Text style={styles.formHeading}>User Information</Text>
                  <TextInput placeholderTextColor="grey" style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
                  <TextInput placeholderTextColor="grey" style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
                  <TextInput placeholderTextColor="grey" style={styles.input} placeholder="Aadhaar number" value={aadhaar} onChangeText={setAadhaar} />
                  <TextInput placeholderTextColor="grey" style={styles.input} placeholder="PAN number" value={pan} onChangeText={setPan} />
                  <TextInput
                    placeholderTextColor="grey"
                    style={styles.input}
                    placeholder="Mobile Number"
                    keyboardType="numeric"
                    value={mobile}
                    maxLength={10}
                    onChangeText={handleMobileChange}
                  />
                </View>
                {/* <View style={styles.nextButtonContainer}> */}
                <Button style={styles.nextButton} title="Next" onPress={handleNext} disabled={!name || !address || !aadhaar || !pan || mobile.length !== 10} />
                {/* </View> */}
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
          <Modal visible={showModal} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.card}>
                <Text style={styles.modalHeading}>Enter your Booking Amount</Text>
                <TextInput
                  placeholderTextColor="grey"
                  style={styles.modalInput}
                  placeholder="Booking Amount"
                  keyboardType="numeric"
                  value={bookingAmount.toString()}
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
      </View>
      {isLoading && ( // Step 2: Conditional rendering block for loader
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999, // make sure it covers everything
        }}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#E6E6E6',
  },
  nextButtonContainer:
  {
    display: 'flex',
    alignContent: 'center',
    backgroundColor: '#ffffff',
    width: '20%',
    borderWidth: 0,
    borderColor: 'transparent'
  },
  nextButton: {
    backgroundColor: "white",
    borderWidth: 0,
    borderColor: 'transparent'

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
    flex: 1,
    width: '98%',
    height: '100%',
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