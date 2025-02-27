import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import places from '../components/allPlaces';
import { XMarkIcon } from 'react-native-heroicons/solid';

const fontMontserratRegular = 'Montserrat-Regular';
const fontMontserratBlack = 'Montserrat-Black';

const PlacesScreen = ({ setSelectedScreen, selectedPlace, setSelectedPlace, setIsPlaceVisible, isPlaceDetailsVisible, setIsPlaceDetailsVisible }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const scrollViewRef = useRef(null);

  const ShareNiagaraPlace = async (title) => {
    try {
      if (!title) {
        Alert.alert('Error', 'No niagara place to share');
        return;
      }
      await Share.share({
        message: `Read about ${title} in Interesting Niagara app!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };


  useEffect(() => {
    if (!isPlaceDetailsVisible && scrollViewRef.current || isPlaceDetailsVisible && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [isPlaceDetailsVisible]);

  return (
    <SafeAreaView style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',

      flex: 1
    }}>
      <Text
        style={{
          fontFamily: fontMontserratBlack,
          color: 'white',
          fontSize: dimensions.width * 0.07,
          textAlign: 'center',
          width: dimensions.width * 0.9,
          alignSelf: 'center',
          marginVertical: dimensions.height * 0.019,
        }}>
        {isPlaceDetailsVisible ? selectedPlace.title : "Interesting places"}
      </Text>


      {!isPlaceDetailsVisible ? (
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
          <View style={{
            alignSelf: 'center',
            width: dimensions.width * 0.9,
            paddingBottom: dimensions.height * 0.16,
          }}>
            {places.map((place, index) => (
              <View key={place.id} style={{
                backgroundColor: 'white',
                padding: dimensions.width * 0.04,
                borderRadius: dimensions.width * 0.03,
                marginBottom: dimensions.height * 0.019,
              }}>
                <Image
                  source={place.image}
                  style={{
                    width: '100%',
                    height: dimensions.height * 0.16,
                    borderRadius: dimensions.width * 0.03,
                  }}
                  resizeMode="stretch"
                />
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}>
                  <View style={{
                    maxWidth: '75%',
                  }}>

                    <Text
                      style={{
                        fontFamily: fontMontserratBlack,
                        color: 'black',
                        fontSize: dimensions.width * 0.046,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        marginTop: dimensions.height * 0.019,
                      }}>
                      {place.title}
                    </Text>


                    <Text
                      style={{

                        fontFamily: fontMontserratRegular,
                        fontWeight: 400,
                        color: 'black',
                        fontSize: dimensions.width * 0.037,
                        textAlign: 'left',
                        alignSelf: 'flex-start',
                        marginTop: dimensions.height * 0.016,
                      }}>
                      {place.description.length > 100 ? `${place.description.substring(0, 100)}...` : place.description}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedPlace(place);
                      setIsPlaceDetailsVisible(true);
                    }}
                    style={{
                      backgroundColor: '#FFC10E',
                      borderRadius: dimensions.width * 0.03,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: dimensions.width * 0.035,
                      paddingVertical: dimensions.height * 0.034,
                    }}>
                    <Image
                      source={require('../assets/icons/readIcon.png')}
                      style={{
                        width: dimensions.width * 0.1,
                        height: dimensions.width * 0.1,
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>

          <View style={{
            backgroundColor: 'white',
            padding: dimensions.width * 0.04,
            borderRadius: dimensions.width * 0.03,
            marginBottom: dimensions.height * 0.019,
            width: dimensions.width * 0.9,
            marginBottom: dimensions.height * 0.16,
          }}>
            <Image
              source={selectedPlace.image}
              style={{
                width: '100%',
                height: dimensions.height * 0.16,
                borderRadius: dimensions.width * 0.03,
              }}
              resizeMode="stretch"
            />

            <Text
              style={{
                fontFamily: fontMontserratBlack,
                color: 'black',
                fontSize: dimensions.width * 0.046,
                textAlign: 'left',
                alignSelf: 'flex-start',
                marginTop: dimensions.height * 0.019,
              }}>
              {selectedPlace.title}
            </Text>



            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              marginTop: dimensions.height * 0.01,
            }}>
              <Image
                source={require('../assets/icons/pinIcon.png')}
                style={{
                  width: dimensions.width * 0.07,
                  height: dimensions.width * 0.07,
                  alignItems: 'center',
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: fontMontserratRegular,
                  fontWeight: 400,
                  color: 'black',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'left',
                  marginLeft: dimensions.width * 0.02,
                }}>
                Coordinates:
              </Text>
              <Text
                style={{
                  fontFamily: fontMontserratRegular,
                  fontWeight: 500,
                  color: 'black',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'left',
                  marginLeft: dimensions.width * 0.01,
                }}>
                {selectedPlace.coordinates.latitude}, {selectedPlace.coordinates.longitude}
              </Text>
            </View>


            <Text
              style={{
                fontFamily: fontMontserratRegular,
                fontWeight: 500,
                color: 'black',
                fontSize: dimensions.width * 0.04,
                textAlign: 'left',
                marginTop: dimensions.height * 0.03,
              }}>
              Description:
            </Text>

            <Text
              style={{
                fontFamily: fontMontserratRegular,
                fontWeight: 400,
                color: 'black',
                fontSize: dimensions.width * 0.04,
                textAlign: 'left',
                alignSelf: 'flex-start',
                marginTop: dimensions.height * 0.005,
              }}>
              {selectedPlace.description}
            </Text>


            <Text
              style={{
                fontFamily: fontMontserratRegular,
                fontWeight: 500,
                color: 'black',
                fontSize: dimensions.width * 0.04,
                textAlign: 'left',
                marginTop: dimensions.height * 0.03,
              }}>
              Interesting facts:
            </Text>

            {selectedPlace.facts.map((fact, index) => (
              <Text
                key={fact.factId}
                style={{
                  fontFamily: fontMontserratRegular,
                  fontWeight: 400,
                  color: 'black',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  marginTop: dimensions.height * 0.005,
                  marginLeft: dimensions.width * 0.03,
                  marginBottom: index === selectedPlace.facts.length - 1 ? dimensions.height * 0.01 : 0,
                }}>
                · {' '}{fact.fact}
              </Text>
            ))}



            <Text
              style={{
                fontFamily: fontMontserratRegular,
                fontWeight: 500,
                color: 'black',
                fontSize: dimensions.width * 0.04,
                textAlign: 'left',
                marginTop: dimensions.height * 0.03,
              }}>
              {selectedPlace.category}
            </Text>

            {selectedPlace.categoryElements.map((element, index) => (
              <Text
                key={element.elementId}
                style={{
                  fontFamily: fontMontserratRegular,
                  fontWeight: 400,
                  color: 'black',
                  fontSize: dimensions.width * 0.04,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                  marginTop: dimensions.height * 0.005,
                  marginLeft: dimensions.width * 0.03,
                  marginBottom: index === selectedPlace.categoryElements.length - 1 ? dimensions.height * 0.01 : 0,
                }}>
                · {' '}{element.element}
              </Text>
            ))}


            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginTop: dimensions.height * 0.03,
              marginBottom: dimensions.height * 0.01,
            }}>
              <TouchableOpacity
                onPress={() => {
                  setIsPlaceDetailsVisible(false);
                }}
                style={{
                  backgroundColor: '#FFC10E',
                  width: dimensions.width * 0.15,
                  height: dimensions.width * 0.15,
                  justifyContent: 'center',
                  borderRadius: dimensions.width * 0.03,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <XMarkIcon size={dimensions.width * 0.1} color='black' />
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => {
                  setIsPlaceVisible(true);
                  setSelectedScreen('Map');
                }}
                style={{
                  backgroundColor: '#FFC10E',
                  width: dimensions.width * 0.48,
                  height: dimensions.width * 0.15,
                  justifyContent: 'center',
                  borderRadius: dimensions.width * 0.03,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../assets/icons/mapIcon.png')}
                  style={{
                    width: dimensions.width * 0.07,
                    height: dimensions.width * 0.07,
                    marginRight: dimensions.width * 0.01,
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    fontFamily: fontMontserratBlack,
                    color: 'black',
                    fontSize: dimensions.width * 0.04,
                    textAlign: 'left',
                  }}>
                  Open in map
                </Text>
              </TouchableOpacity>


              <TouchableOpacity
                onPress={() => {
                  ShareNiagaraPlace(selectedPlace.title);
                }}
                style={{
                  backgroundColor: '#FFC10E',
                  width: dimensions.width * 0.15,
                  height: dimensions.width * 0.15,
                  justifyContent: 'center',
                  borderRadius: dimensions.width * 0.03,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <Image
                  source={require('../assets/icons/shareIcon.png')}
                  style={{
                    width: dimensions.width * 0.07,
                    height: dimensions.width * 0.07,
                    marginRight: dimensions.width * 0.01,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>

            </View>


          </View>
        </ScrollView>
      )}





    </SafeAreaView>
  );
};

export default PlacesScreen;
