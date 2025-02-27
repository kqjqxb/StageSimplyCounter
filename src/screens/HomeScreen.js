import React, { useEffect, useState, useRef, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  TouchableWithoutFeedback,
  Alert,
  Modal,
} from 'react-native';
import WaterGameScreen from './WaterGameScreen';
import PlacesScreen from './PlacesScreen';
import MapScreen from './MapScreen';
import FactsScreen from './FactsScreen';
import LoadingScreen from './LoadingScreen';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';

const fontMontserratBold = 'Montserrat-Bold';
const fontMontserratBlack = 'Montserrat-Black';
const fontMontserratRegular = 'Montserrat-Regular';
const fontKaushanScript = 'KaushanScript-Regular';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isPlaceVisible, setIsPlaceVisible] = useState(false);
  const [isPlaceDetailsVisible, setIsPlaceDetailsVisible] = useState(false);
  const [isAddCounterVisible, setIsAddCounterVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [countsCount, setCountsCount] = useState(0);
  const [storedCounts, setStoredCounts] = useState([]);
  const [counters, setCounters] = useState([]);
  const [isEditingNow, setIsEditingNow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [countToRemove, setCountToRemove] = useState(null);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  useEffect(() => {
    console.log('selectedPlace: ', selectedPlace);
  }, [selectedPlace]);

  const handleCounterDatePicker = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');

    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    }
    if (cleaned.length > 4) {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 8)}`;
    }

    if (cleaned.length >= 8) {
      const day = parseInt(cleaned.slice(0, 2), 10);
      const month = parseInt(cleaned.slice(2, 4), 10);
      const year = parseInt(cleaned.slice(4, 8), 10);

      const inputDate = new Date(year, month - 1, day);
      const currentDate = new Date();

      const isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      };

      const daysInMonth = (month, year) => {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
      };

      if (month < 1 || month > 12) {
        Alert.alert('Error', 'Invalid month. Please enter a valid month (01-12).');
        formatted = '';
      } else if (day < 1 || day > daysInMonth(month, year)) {
        Alert.alert('Error', `Invalid day for the selected month. Please enter a valid day (01-${daysInMonth(month, year)}).`);
        formatted = '';
      } else if (inputDate < currentDate) {
        Alert.alert('Error', 'The date cannot be earlier than today.');
        formatted = '';
      } else if (year < 1950 || year > 2050) {
        formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.`;
      }
    }

    setDate(formatted);
  };


  const handleDateChange = (event, selectedDate) => {
    if (selectedDate && selectedDate >= new Date().setHours(0, 0, 0, 0)) {
      setDate(selectedDate);
    } else {
      Alert.alert('Please select a future date.');
    }

  };

  useEffect(() => {
    if (showDatePicker) {
      setShowTimePicker(false);
    } else if (showTimePicker) {
      setShowDatePicker(false);
    }
  }, [showDatePicker, showTimePicker]);

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const currentTime = new Date();
      if (date && date.toDateString() === currentTime.toDateString()) {
        if (selectedTime < currentTime) {
          selectedTime.setHours(currentTime.getHours());
          selectedTime.setMinutes(currentTime.getMinutes());
        }
      }
      setTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Date';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (time) => {
    if (!time) return 'Time';
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const existingCounters = await AsyncStorage.getItem('counters');
        const counters = existingCounters ? JSON.parse(existingCounters) : [];
        setCounters(counters); // Завантажуємо всі збережені counters
      } catch (error) {
        console.error('Error loading counters:', error);
      }
    };

    loadCounts();
  }, [counters]);

  const handleSaveCounter = async () => {
    try {
      const maxId = counters.length > 0 ? Math.max(...counters.map(count => count.id)) : 0;
      const newCounter = {
        id: maxId + 1,
        title,
        date,
        time,
        countsCount,
      };
      const existingCounters = await AsyncStorage.getItem('counters');
      const counters = existingCounters ? JSON.parse(existingCounters) : [];
      counters.push(newCounter);
      await AsyncStorage.setItem('counters', JSON.stringify(counters));
      setIsAddCounterVisible(false);
      setTitle('');
      setDate(null);
      setTime(null);
      setCountsCount(0);
    } catch (error) {
      console.error('Error saving counter:', error);
    }
  };

  const removeCounter = async (funcCountToRemove) => {
    try {
      const updatedCounts = counters.filter(count =>
        !(count.id === funcCountToRemove.id)
      );
      await AsyncStorage.setItem('counters', JSON.stringify(updatedCounts));
      setCounters(updatedCounts);
    } catch (error) {
      console.error('Error removing count:', error);
      Alert.alert('Error', 'Failed to remove count from counters.');
    }
  };


  useEffect(() => {
    console.log('counters: ', counters);
  }, [])

  return (
    <View style={{
      flex: 1,
      width: dimensions.width,
      backgroundColor: '#2E4150',
    }}>
      {selectedScreen === 'Home' ? (
        <View style={{
          flex: 1,
        }}>
          <View style={{
            position: 'absolute',
            top: 0,
            width: dimensions.width,
            backgroundColor: '#1D2C38',
            borderBottomLeftRadius: dimensions.width * 0.05,
            borderBottomRightRadius: dimensions.width * 0.05,
            height: dimensions.height * 0.16,
          }}>
            <SafeAreaView>
              <Text
                style={{
                  fontFamily: fontKaushanScript,
                  color: 'white',
                  fontSize: dimensions.width * 0.1,
                  textAlign: 'center',
                  alignSelf: 'center',
                  right: dimensions.width * 0.019,
                }}>
                Stage
              </Text>

            </SafeAreaView>

          </View>


          <View style={{
            marginTop: dimensions.height * 0.185,
            width: dimensions.width * 0.9,
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1D2C38',
              borderRadius: dimensions.width * 0.019,
              maxWidth: dimensions.width * 0.4,
              paddingHorizontal: dimensions.width * 0.05,
              paddingVertical: dimensions.height * 0.01,
            }}>
              <Image
                source={require('../assets/icons/sortIcon.png')}
                style={{
                  width: dimensions.width * 0.08,
                  height: dimensions.width * 0.08,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: fontMontserratRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'center',
                  fontWeight: 400,
                  marginLeft: dimensions.width * 0.03,
                }}>
                Sort by
              </Text>
            </TouchableOpacity>


            <TouchableOpacity
              onPress={() => {
                setIsEditingNow((prev) => !prev);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isEditingNow ? '#4346FF' : '#1D2C38',
                borderRadius: dimensions.width * 0.019,
                maxWidth: dimensions.width * 0.4,
                paddingHorizontal: dimensions.width * 0.05,
                paddingVertical: dimensions.height * 0.01,
              }}>
              <Image
                source={require('../assets/icons/editIcon.png')}
                style={{
                  width: dimensions.width * 0.08,
                  height: dimensions.width * 0.08,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: fontMontserratRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'center',
                  fontWeight: 400,
                  marginLeft: dimensions.width * 0.03,
                }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            <View style={{
              width: dimensions.width,
              marginBottom: dimensions.height * 0.16,
            }}>
              {!isAddCounterVisible ? (
                <TouchableOpacity
                  onPress={() => {
                    setIsAddCounterVisible(true);
                  }}
                  style={{
                    marginTop: dimensions.height * 0.016,
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#465B6B',
                    borderRadius: dimensions.width * 0.019,
                    borderColor: 'white',
                    borderWidth: dimensions.width * 0.0021,
                    padding: dimensions.width * 0.03,
                    paddingVertical: dimensions.height * 0.04,
                  }}>
                  <Image
                    source={require('../assets/icons/plusIcon.png')}
                    style={{
                      width: dimensions.width * 0.08,
                      height: dimensions.width * 0.08,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontFamily: fontMontserratRegular,
                      color: 'white',
                      fontSize: dimensions.width * 0.04,
                      textAlign: 'center',
                      fontWeight: 400,
                      marginTop: dimensions.height * 0.01,

                    }}>
                    Add counter
                  </Text>

                </TouchableOpacity>
              ) : (
                <View style={{
                  marginTop: dimensions.height * 0.016,
                  width: dimensions.width * 0.9,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#465B6B',
                  borderRadius: dimensions.width * 0.019,
                  borderColor: 'white',
                  borderWidth: dimensions.width * 0.0021,
                  padding: dimensions.width * 0.03,
                  paddingVertical: dimensions.height * 0.01,
                }}>
                  <TextInput
                    placeholder="Enter title"
                    value={title}
                    onChangeText={setTitle}
                    placeholderTextColor="#60606099"
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: dimensions.width * 0.035,
                      paddingHorizontal: dimensions.width * 0.04,
                      backgroundColor: 'white',
                      borderRadius: dimensions.width * 0.014,
                      width: '100%',
                      fontFamily: fontMontserratRegular,
                      fontSize: dimensions.width * 0.044,
                      fontWeight: 400,
                      textAlign: 'left',
                    }}
                  />


                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginVertical: dimensions.height * 0.014,
                  }}>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: dimensions.width * 0.025,
                        paddingHorizontal: dimensions.width * 0.04,
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.014,
                        width: '40%',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontMontserratRegular,
                          color: '#606060',
                          fontSize: dimensions.width * 0.04,
                          textAlign: 'center',
                          fontWeight: 700,
                        }}>
                        {formatDate(date)}
                      </Text>
                    </TouchableOpacity>



                    <TouchableOpacity
                      onPress={() => setShowTimePicker(true)}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingVertical: dimensions.width * 0.025,
                        paddingHorizontal: dimensions.width * 0.04,
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.014,
                        width: '35%',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontMontserratRegular,
                          color: '#606060',
                          fontSize: dimensions.width * 0.04,
                          textAlign: 'center',
                          fontWeight: 700,
                        }}>
                        {formatTime(time)}
                      </Text>
                    </TouchableOpacity>
                  </View>


                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: dimensions.height * 0.014,
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: dimensions.width * 0.025,
                      paddingHorizontal: dimensions.width * 0.04,
                      backgroundColor: 'white',
                      borderRadius: dimensions.width * 0.014,
                      width: '64%',
                    }}>
                      <Text
                        style={{
                          fontFamily: fontMontserratRegular,
                          color: '#606060',
                          fontSize: dimensions.width * 0.04,
                          textAlign: 'center',
                          fontWeight: 700,
                        }}>
                        {countsCount}
                      </Text>
                    </View>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      alignSelf: 'flex-end',
                    }}>
                      <TouchableOpacity
                        onPress={() => {
                          setCountsCount((prev) => prev + 1);
                        }}
                        disabled={countsCount === 140}
                        style={{
                          alignItems: 'center',
                          paddingVertical: dimensions.width * 0.021,
                          paddingHorizontal: dimensions.width * 0.04,
                          backgroundColor: '#4346FF',
                          borderRadius: dimensions.width * 0.014,
                          width: '40%',
                          marginHorizontal: dimensions.width * 0.03,
                        }}>
                        <Text
                          style={{
                            fontFamily: fontMontserratRegular,
                            color: 'white',
                            fontSize: dimensions.width * 0.055,
                            textAlign: 'center',
                            fontWeight: 700,
                          }}>
                          +
                        </Text>
                      </TouchableOpacity>



                      <TouchableOpacity
                        onPress={() => {
                          setCountsCount((prev) => prev - 1);
                        }}
                        disabled={countsCount === 0}
                        style={{
                          alignItems: 'center',
                          paddingVertical: dimensions.width * 0.021,
                          paddingHorizontal: dimensions.width * 0.04,
                          backgroundColor: 'white',
                          borderRadius: dimensions.width * 0.014,
                          width: '40%',

                        }}>
                        <Text
                          style={{
                            fontFamily: fontMontserratRegular,
                            color: '#4346FF',
                            fontSize: dimensions.width * 0.055,
                            textAlign: 'center',
                            fontWeight: 700,
                          }}>
                          -
                        </Text>
                      </TouchableOpacity>

                    </View>

                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      handleSaveCounter();
                    }}
                    style={{
                      paddingVertical: dimensions.width * 0.043,
                      paddingHorizontal: dimensions.width * 0.04,
                      backgroundColor: 'white',
                      borderRadius: dimensions.width * 0.014,
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}>
                    <Text
                      style={{
                        fontFamily: fontMontserratRegular,
                        color: '#606060',
                        fontSize: dimensions.width * 0.04,
                        textAlign: 'center',
                        fontWeight: 700,
                      }}>
                      Save counter
                    </Text>

                  </TouchableOpacity>

                </View>
              )}

              {counters.length === 0 ? (
                <View>

                </View>
              ) : (
                <>
                  {counters.map((count, index) => (
                    <View key={count.id} style={{
                      backgroundColor: '#465B6B',
                      width: dimensions.width * 0.9,
                      borderRadius: dimensions.width * 0.019,
                      borderColor: 'white',
                      borderWidth: dimensions.width * 0.0021,
                      padding: dimensions.width * 0.03,
                      alignSelf: 'center',
                      marginTop: dimensions.height * 0.016,
                      paddingHorizontal: dimensions.width * 0.05
                    }}>
                      {isEditingNow && (
                        <TouchableOpacity
                          onPress={() => {
                            // removeCounter(count);
                            setCountToRemove(count);
                            setModalVisible(true);
                          }}
                          style={{
                            position: 'absolute',
                            right: -dimensions.width * 0.05,
                            top: '46%',
                            backgroundColor: '#F85E5E',
                            padding: dimensions.width * 0.03,
                            zIndex: 100,
                            borderRadius: dimensions.width * 0.01,
                          }}>
                          <Image
                            source={require('../assets/icons/deleteCounterIcon.png')}
                            style={{
                              width: dimensions.width * 0.05,
                              height: dimensions.width * 0.05,
                            }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      )}
                      <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <Text
                          style={{
                            fontFamily: fontMontserratRegular,
                            color: 'white',
                            fontSize: dimensions.width * 0.04,
                            textAlign: 'center',
                            fontWeight: 500,
                          }}>
                          {count.title}
                        </Text>

                        <Text
                          style={{
                            fontFamily: fontMontserratRegular,
                            color: '#E6E6E6',
                            fontSize: dimensions.width * 0.04,
                            textAlign: 'center',
                            fontWeight: 400,
                            marginLeft: dimensions.width * 0.03,
                          }}>
                          {/* {formatDate(count.date)} {formatTime(count.time)} */}
                          {formatDate(new Date(count.date))}   {formatTime(new Date(count.time))}
                        </Text>
                      </View>

                      <View style={{
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.019,
                        marginTop: dimensions.height * 0.016,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: dimensions.width * 0.01,
                      }}>
                        <Text
                          style={{
                            fontFamily: fontMontserratBold,
                            color: '#4346FF',
                            fontSize: dimensions.width * 0.16,
                            textAlign: 'center',
                          }}>
                          {count.countsCount}
                        </Text>
                        <Text
                          style={{
                            fontFamily: fontMontserratRegular,
                            fontWeight: 400,
                            color: '#4346FF',
                            fontSize: dimensions.width * 0.04,
                            textAlign: 'center',
                            marginBottom: dimensions.height * 0.016,
                          }}>
                          Counted
                        </Text>

                      </View>

                    </View>
                  ))}
                </>
              )}

            </View>

          </ScrollView>



          {showDatePicker && (
            <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)} style={{}}>
              <View style={{
                top: -dimensions.height * 0.19,
                alignSelf: 'center',
                width: dimensions.width * 0.9,
              }}>
                <View style={{
                  transform: [{ scale: 0.8 }], // Зменшуємо розмір пікера
                  backgroundColor: '#c6cace',
                  borderRadius: dimensions.width * 0.03,
                }}>
                  <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="spinner"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      handleDateChange(event, selectedDate);
                    }}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setShowDatePicker(false);
                  }}
                  style={{
                    marginTop: -dimensions.height * 0.01,
                    paddingHorizontal: dimensions.width * 0.04,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontFamily: fontMontserratRegular,
                      color: 'white',
                      fontSize: dimensions.width * 0.05,
                      textAlign: 'center',
                      fontWeight: 400,
                    }}>
                    Ok
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          )}


          

        </View>



      ) : selectedScreen === 'Places' ? (
        <PlacesScreen setSelectedScreen={setSelectedScreen} setSelectedPlace={setSelectedPlace} selectedPlace={selectedPlace} setIsPlaceVisible={setIsPlaceVisible}
          isPlaceDetailsVisible={isPlaceDetailsVisible} setIsPlaceDetailsVisible={setIsPlaceDetailsVisible} />
      ) : selectedScreen === 'Map' ? (
        <MapScreen setSelectedScreen={setSelectedScreen} selectedPlace={selectedPlace} selectedScreen={selectedScreen} setIsPlaceVisible={setIsPlaceVisible} isPlaceVisible={isPlaceVisible}
          isPlaceDetailsVisible={isPlaceDetailsVisible} setIsPlaceDetailsVisible={setIsPlaceDetailsVisible} />
      ) : selectedScreen === 'Facts' ? (
        <FactsScreen setSelectedScreen={setSelectedScreen} />
      ) : selectedScreen === 'Game' ? (
        <WaterGameScreen setSelectedScreen={setSelectedScreen} />
      ) : selectedScreen === 'Loading' ? (
        <LoadingScreen setSelectedScreen={setSelectedScreen} />
      ) : null}




      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: dimensions.height * 0.07,
        width: dimensions.width * 0.77,
        alignSelf: 'center',
        backgroundColor: '#1D2C38',
        borderRadius: dimensions.width * 0.019,
        borderWidth: dimensions.width * 0.0021,
        borderColor: 'white',
        padding: dimensions.width * 0.016,
      }}>
        <TouchableOpacity style={{
          backgroundColor: '#2E4150',
          borderRadius: dimensions.width * 0.019,
          borderColor: 'white',
          borderWidth: dimensions.width * 0.0021,
          width: dimensions.width * 0.14,
          height: dimensions.width * 0.14,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Image
            source={require('../assets/icons/settingsIcon.png')}
            style={{
              width: dimensions.width * 0.08,
              height: dimensions.width * 0.08,
            }}
            resizeMode="contain"
          />

        </TouchableOpacity>


        <TouchableOpacity style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: dimensions.width * 0.019,
          height: dimensions.width * 0.14,
          flexDirection: 'row',
          flex: 1,
          marginHorizontal: dimensions.width * 0.019,
        }}>
          <Image
            source={require('../assets/icons/blackPlusIcon.png')}
            style={{
              width: dimensions.width * 0.05,
              height: dimensions.width * 0.05,
            }}
            resizeMode="contain"
          />
          <Text
            style={{
              fontFamily: fontMontserratRegular,
              color: 'black',
              fontSize: dimensions.width * 0.043,
              textAlign: 'center',
              fontWeight: 400,
              marginLeft: dimensions.width * 0.019,
            }}>
            Add Сounter
          </Text>

        </TouchableOpacity>


        <TouchableOpacity style={{
          backgroundColor: '#4346FF',
          borderRadius: dimensions.width * 0.019,
          borderColor: 'white',
          borderWidth: dimensions.width * 0.0021,
          width: dimensions.width * 0.14,
          height: dimensions.width * 0.14,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Image
            source={require('../assets/icons/gameIcon.png')}
            style={{
              width: dimensions.width * 0.08,
              height: dimensions.width * 0.08,
            }}
            resizeMode="contain"
          />

        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={showTimePicker}
          onRequestClose={() => {
            setShowTimePicker(false);
          }}
        >
          <SafeAreaView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <BlurView
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
              blurType="light"
              blurAmount={4}
              reducedTransparencyFallbackColor="white"
            />
            <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)} style={{
              width: dimensions.width,
              height: dimensions.height,
            }}>

              <View style={{

                width: dimensions.width,
                alignSelf: 'center',
                marginTop: -dimensions.height * 0.16,
              }}>
                <DateTimePicker
                  value={time || new Date()}
                  mode="time"
                  display="spinner"
                  onChange={(event, selectedTime) => {
                    handleTimeChange(event, selectedTime);
                  }}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: dimensions.width * 0.03,
                    alignSelf: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowTimePicker(false);
                  }}
                  style={{
                    paddingVertical: dimensions.width * 0.043,
                    paddingHorizontal: dimensions.width * 0.05,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                  <Text
                    style={{
                      fontFamily: fontMontserratRegular,
                      color: 'white',
                      fontSize: dimensions.width * 0.05,
                      textAlign: 'center',
                      alignSelf: 'center',
                      fontWeight: 400,
                    }}>
                    Ok
                  </Text>

                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </Modal>


        <Modal
          animationType="fade"
          transparent={true}
          visible={dateModalVisible}
          onRequestClose={() => {
            setDateModalVisible(false);
          }}
        >
          <SafeAreaView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <BlurView
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
              blurType="light"
              blurAmount={4}
              reducedTransparencyFallbackColor="white"
            />
          </SafeAreaView>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <SafeAreaView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <BlurView
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
              blurType="light"
              blurAmount={4}
              reducedTransparencyFallbackColor="white"
            />
            <View style={{
              backgroundColor: 'white',
              borderRadius: dimensions.width * 0.01,
              alignItems: 'center',
              justifyContent: 'center',
              width: dimensions.width * 0.7,
              padding: dimensions.width * 0.07,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.3,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <Text
                style={{
                  fontFamily: fontMontserratRegular,
                  color: 'black',
                  fontSize: dimensions.width * 0.043,
                  textAlign: 'center',
                  fontWeight: 400,
                  marginLeft: dimensions.width * 0.019,
                }}>
                Are you sure you want to delete this item?
              </Text>


              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: dimensions.height * 0.04,
                width: '75%',
                alignSelf: 'center',
              }}>
                <TouchableOpacity onPress={() => {
                  removeCounter(countToRemove);
                  setModalVisible(false);
                }}>
                  <Text
                    style={{
                      fontFamily: fontMontserratRegular,
                      color: '#F85E5E',
                      fontSize: dimensions.width * 0.037,
                      textAlign: 'center',
                      fontWeight: 400,
                      marginLeft: dimensions.width * 0.019,
                    }}>
                    Yes, delete
                  </Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={(() => {
                  setModalVisible(false);
                })}>
                  <Text
                    style={{
                      fontFamily: fontMontserratRegular,
                      color: '#676767',
                      fontSize: dimensions.width * 0.037,
                      textAlign: 'center',
                      fontWeight: 400,
                      marginLeft: dimensions.width * 0.019,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
          </SafeAreaView>
        </Modal>

      </View>
    </View>
  );
};

export default HomeScreen;
