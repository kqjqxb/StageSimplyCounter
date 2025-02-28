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
import BallGameScreen from './BallGameScreen';
import LoadingScreen from './LoadingScreen';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from '@react-native-community/blur';
import SettingsScreen from './SettingsScreen';

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
  const [counters, setCounters] = useState([]);
  const [isEditingNow, setIsEditingNow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountToRemove, setSelectedCountToRemove] = useState(null);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const scrollViewRef = useRef(null);
  const [isVibrationEnabled, setVibrationEnabled] = useState(true);
  const [isSoundEffEnabled, setSoundEffEnabled] = useState(true);


  useEffect(() => {
    if (isAddCounterVisible && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [isAddCounterVisible]);

  useEffect(() => {
    console.log('selectedPlace: ', selectedPlace);
  }, [selectedPlace]);


  const loadSettings = async () => {
    try {
      const vibrationValue = await AsyncStorage.getItem('isVibrationEnabled');
      const soundEffValue = await AsyncStorage.getItem('isSoundEffEnabled');

      if (soundEffValue !== null) setSoundEffEnabled(JSON.parse(soundEffValue));
      if (vibrationValue !== null) setVibrationEnabled(JSON.parse(vibrationValue));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [isVibrationEnabled, selectedScreen]);


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
    loadCounts();
  }, []);


  const loadCounts = async () => {
    try {
      const existingCounters = await AsyncStorage.getItem('counters');
      const counters = existingCounters ? JSON.parse(existingCounters) : [];
      setCounters(counters); // Завантажуємо всі збережені counters
    } catch (error) {
      console.error('Error loading counters:', error);
    }
  };

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
      const newCounters = existingCounters ? JSON.parse(existingCounters) : [];
      newCounters.unshift(newCounter);
      await AsyncStorage.setItem('counters', JSON.stringify(newCounters));
      setIsAddCounterVisible(false);
      setTitle('');
      setDate(null);
      setTime(null);
      setCountsCount(0);
      loadCounts();
      sortCounters(selectedSort);
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
      loadCounts();
      sortCounters(selectedSort);
      setSelectedCountToRemove(null);
    } catch (error) {
      console.error('Error removing count:', error);
      Alert.alert('Error', 'Failed to remove count from counters.');
    }
  };


  useEffect(() => {
    console.log('counters: ', counters);
  }, [])



  const sortCounters = (sortBy) => {
    let sortedCounters = [...counters];
    if (sortBy === 'Date') {
      sortedCounters.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'Title') {
      sortedCounters.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'Counted') {
      sortedCounters.sort((a, b) => b.countsCount - a.countsCount);
    }
    setCounters(sortedCounters);
  };

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
            <TouchableOpacity
              onPress={() => {
                setSortModalVisible((prev) => !prev);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: sortModalVisible ? '#4346FF' : '#1D2C38',
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
            {sortModalVisible && (
              <View style={{
                position: 'absolute',
                top: dimensions.height * 0.064,
                zIndex: 100,
                backgroundColor: '#d2d6d9',
                borderRadius: dimensions.width * 0.04,
                width: dimensions.width * 0.61,
                paddingVertical: dimensions.height * 0.01,

              }}>
                {['Date', 'Title', 'Counted'].map((sort, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedSort(sort);
                      setSortModalVisible(false);
                      sortCounters(sort);
                    }}
                    key={index} style={{
                      marginBottom: dimensions.height * 0.01,
                      borderBottomColor: 'rgba(128, 128, 128, 0.55)',
                      borderBottomWidth: index === 2 ? 0 : dimensions.width * 0.001,
                      paddingVertical: dimensions.height * 0.004,
                    }}>
                    <Text
                      style={{
                        fontFamily: fontMontserratRegular,
                        color: 'black',
                        fontSize: dimensions.width * 0.05,
                        textAlign: 'left',
                        fontWeight: 400,
                        paddingHorizontal: dimensions.width * 0.05,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}>
                      {sort}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}



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
          <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
            <View style={{
              width: dimensions.width,
              marginBottom: dimensions.height * 0.16,
              paddingBottom: dimensions.height * 0.1,
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
                    disabled={!title || !date || !time || countsCount === 0}
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
                            setSelectedCountToRemove(count);
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
        </View>



      ) : selectedScreen === 'Settings' ? (
        <SettingsScreen setSelectedScreen={setSelectedScreen} isVibrationEnabled={isVibrationEnabled} setVibrationEnabled={setVibrationEnabled} isSoundEffEnabled={isSoundEffEnabled} setSoundEffEnabled={setSoundEffEnabled} />
      ) : selectedScreen === 'Game' ? (
        <BallGameScreen setSelectedScreen={setSelectedScreen} />
      ) : selectedScreen === 'Loading' ? (
        <LoadingScreen setSelectedScreen={setSelectedScreen} />
      ) : null}



      {selectedScreen !== 'Game' && (
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
          <TouchableOpacity
            onPress={() => {
              setSelectedScreen('Settings')
            }}
            style={{
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


          <TouchableOpacity
            onPress={() => {
              setIsAddCounterVisible((prev) => !prev);
            }}
            style={{
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


          <TouchableOpacity
            onPress={() => [
              setSelectedScreen('Game')
            ]}
            style={{
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
        </View>
      )}
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
            blurAmount={10}
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
                    fontWeight: 700,
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
        visible={showDatePicker}
        onRequestClose={() => {
          setShowDatePicker(false);
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
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
          />
          <View style={{
            marginTop: -dimensions.height * 0.19,
            alignSelf: 'center',
            width: dimensions.width * 0.9,
          }}>
            <View style={{
              backgroundColor: 'white',
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
                marginTop: dimensions.height * 0.01,
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
                  fontWeight: 700,
                }}>
                Ok
              </Text>
            </TouchableOpacity>
          </View>
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
                removeCounter(selectedCountToRemove);
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
  );
};

export default HomeScreen;
