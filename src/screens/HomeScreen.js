import React, { useEffect, useState, useRef, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import WaterGameScreen from './WaterGameScreen';
import PlacesScreen from './PlacesScreen';
import MapScreen from './MapScreen';
import FactsScreen from './FactsScreen';
import LoadingScreen from './LoadingScreen';

const fontMontserratBold = 'Montserrat-Bold';
const fontMontserratBlack = 'Montserrat-Black';

const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Loading');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isPlaceVisible, setIsPlaceVisible] = useState(false);
  const [isPlaceDetailsVisible, setIsPlaceDetailsVisible] = useState(false);

  useEffect(() => {
    console.log('selectedPlace: ', selectedPlace);
  }, [selectedPlace]);

  const homeBtns = [
    {
      id: 1,
      title: 'Interesting places',
      screen: 'Places',
      icon: require('../assets/icons/homeButtons/locationsBtn.png'),
    },
    {
      id: 2,
      title: 'Facts and stories',
      screen: 'Facts',
      icon: require('../assets/icons/homeButtons/factsBtn.png'),
    },
    {
      id: 3,
      title: 'Map with locations',
      screen: 'Map',
      icon: require('../assets/icons/homeButtons/mapBtn.png'),
    },
    {
      id: 4,
      title: 'Up Niagara Falls',
      screen: 'Game',
      icon: require('../assets/icons/homeButtons/gameBtn.png'),
    },
  ]

  return (
    <View style={{
      flex: 1,
      width: dimensions.width,
      backgroundColor: '#008B47',
    }}>
      {selectedScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width,
          justifyContent: 'flex-end',
        }}>
          <Image
            source={require('../assets/images/homeImage.png')}
            style={{
              width: dimensions.width,
              height: dimensions.height * 0.55,
              position: 'absolute',
              top: 0
            }}
            resizeMode='stretch'
          />

          <Text
            style={{
              fontFamily: fontMontserratBlack,
              color: 'white',
              fontSize: dimensions.width * 0.077,
              textAlign: 'left',
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              marginBottom: dimensions.height * 0.03,
            }}>
            Welcome to{'\n'}Interesting Niagara!
          </Text>


          <View style={{
            width: dimensions.width * 0.9,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignSelf: 'center',
            marginTop: dimensions.height * 0.019,
          }}>
            {homeBtns.map((button, index) => (
              <TouchableOpacity
                onPress={() => { setSelectedScreen(button.screen); }}
                key={index} style={{
                  backgroundColor: '#FFC10E',
                  borderRadius: dimensions.width * 0.05,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48%',
                  padding: dimensions.width * 0.035,
                  marginBottom: dimensions.width * 0.04, 
                }}>
                <Image
                  source={button.icon}
                  style={{
                    width: dimensions.width * 0.1,
                    height: dimensions.width * 0.1,
                    textAlign: 'center',
                    marginTop: dimensions.height * 0.016,
                  }}
                  resizeMode="contain"
                />
                <Text style={{
                  marginTop: dimensions.height * 0.019,
                  fontFamily: fontMontserratBold,
                  fontWeight: 700,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontSize: dimensions.width * 0.05,
                  color: 'black',
                }}>
                  {button.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>


        </SafeAreaView>
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
      ): null}






      {selectedScreen !== 'Home' && selectedScreen !== 'Game' && selectedScreen !== 'Loading' && (
        <TouchableOpacity
          onPress={() => {
            setSelectedScreen('Home');
            // goHome();
          }}
          style={{
            backgroundColor: '#FFC10E',
            borderRadius: dimensions.width * 0.03,
            alignItems: 'center',
            justifyContent: 'center',
            width: dimensions.height * 0.077,
            height: dimensions.height * 0.077,
            position: 'absolute',
            bottom: dimensions.height * 0.07,
            alignSelf: 'center',
            zIndex: 1000,
          }}>
          <Image
            source={require('../assets/icons/homeIcon.png')}
            style={{
              width: dimensions.height * 0.05,
              height: dimensions.height * 0.05,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

      )}

    </View>
  );
};

export default HomeScreen;
