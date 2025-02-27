import React, { useState } from 'react';
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
import * as Animatable from 'react-native-animatable';
import facts from '../components/factsData';

const fontMontserratBlack = 'Montserrat-Black';

const FactsScreen = ({}) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isFactVisible, setIsFactVisible] = useState(false);
  const [previousFact, setPreviousFact] = useState(null);
  const [generatedFact, setGeneratedFact] = useState(null);
  const [isDropWaterVisible, setIsDropWaterVisible] = useState(false);

  const handleGenerateRandomFact = () => {
    let randomFact;
    do {
      randomFact = facts[Math.floor(Math.random() * facts.length)];
    }
    while (randomFact === previousFact);

    setGeneratedFact(randomFact);
    setPreviousFact(randomFact);
    setIsDropWaterVisible(true);
    setTimeout(() => {
      setIsDropWaterVisible(false);
      setIsFactVisible(true);
    }, 2100);
  };

  const ShareNiagaraFact = async () => {
    try {
      await Share.share({
        message: `Read interesting facts about Niagara in Interesting Niagara app!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <SafeAreaView style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      flex: 1
    }}>
      {!isFactVisible && !isDropWaterVisible ? (
        <>
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
            Facts and stories
          </Text>
          <TouchableOpacity
            onPress={() => {
              handleGenerateRandomFact();
            }}
            style={{
              width: dimensions.width * 0.61,
              height: dimensions.width * 0.61,
              borderRadius: dimensions.width * 0.03,
              backgroundColor: '#FFC10E',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: dimensions.height * 0.19,
              shadowColor: '#000',
              shadowOffset: {
                width: 2,
                height: 2,
              },
              shadowOpacity: 0.4,
              shadowRadius: 3.84,
              elevation: 10,
            }}>
            <Image
              source={require('../assets/icons/touchIcon.png')}
              style={{
                width: dimensions.width * 0.19,
                height: dimensions.width * 0.19,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: fontMontserratBlack,
              color: 'white',
              fontSize: dimensions.width * 0.04,
              textAlign: 'center',
              width: dimensions.width * 0.82,
              alignSelf: 'center',
              marginVertical: dimensions.height * 0.019,
            }}>
            Click the button and learn interesting facts from history
          </Text>
        </>
      ) : !isDropWaterVisible && isFactVisible ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            width: dimensions.width * 0.9,
            padding: dimensions.width * 0.05,
            paddingVertical: dimensions.height * 0.05,
            backgroundColor: 'white',
            borderRadius: dimensions.width * 0.03,
            alignItems: 'center',
            alignSelf: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 2,
              height: 2,
            },
            shadowOpacity: 0.4,
            shadowRadius: 3.84,
            elevation: 10,
          }}>
            <Text
              style={{
                fontFamily: fontMontserratBlack,
                color: '#008B47',
                fontSize: dimensions.width * 0.07,
                textAlign: 'center',
                width: dimensions.width * 0.9,
                alignSelf: 'center',
                marginVertical: dimensions.height * 0.019,
              }}>
              FACT #{generatedFact.id}
            </Text>
            <Text
              style={{
                fontFamily: fontMontserratBlack,
                color: '#008B47',
                fontSize: dimensions.width * 0.037,
                textAlign: 'center',
                paddingHorizontal: dimensions.width * 0.019,
                alignSelf: 'center',
                marginVertical: dimensions.height * 0.019,
              }}>
              {generatedFact?.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                ShareNiagaraFact();
                // handleShare();
              }}
              style={{
                backgroundColor: '#FFC10E',
                padding: dimensions.width * 0.05,
                width: dimensions.width * 0.5,
                marginTop: dimensions.height * 0.03,
                marginBottom: dimensions.height * 0.01,
                justifyContent: 'center',
                flexDirection: 'row',
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
              <Text
                style={{
                  fontFamily: fontMontserratBlack,
                  color: 'black',
                  fontSize: dimensions.width * 0.05,
                  paddingRight: dimensions.width * 0.034,
                  textAlign: 'left',
                }}>
                Share
              </Text>
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
          <TouchableOpacity
            onPress={() => {
              handleGenerateRandomFact();
            }}
            style={{
              backgroundColor: '#FFC10E',
              padding: dimensions.width * 0.05,
              width: dimensions.width * 0.9,
              marginTop: dimensions.height * 0.03,
              marginBottom: dimensions.height * 0.01,
              justifyContent: 'center',
              flexDirection: 'row',
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
            <Text
              style={{
                fontFamily: fontMontserratBlack,
                color: 'black',
                fontSize: dimensions.width * 0.05,
                paddingRight: dimensions.width * 0.034,
                textAlign: 'left',
              }}>
              Learn the facts again
            </Text>
            <Image
              source={require('../assets/icons/touchIcon.png')}
              style={{
                width: dimensions.width * 0.1,
                height: dimensions.width * 0.1,
                marginRight: dimensions.width * 0.01,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Animatable.View
          animation={{
            from: { translateY: -dimensions.height + dimensions.width * 0.9 },
            to: { translateY: dimensions.height }
          }}
          duration={2050}
          style={{
            position: 'absolute',
            top: 0,
            left: dimensions.width * 0.42,
          }}
        >
          <Image 
            source={require('../assets/images/dropWaterImage.png')}
            style={{
              width: dimensions.width * 0.16,
              height: dimensions.width * 0.16,
            }}
            resizeMode="contain"
          />
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

export default FactsScreen;
