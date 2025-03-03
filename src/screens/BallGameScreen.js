import React, { useState, useRef, useEffect, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  PanResponder,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';

const fontMontserratBold = 'Montserrat-Bold';
const fontMontserratRegular = 'Montserrat-Regular';
const fontMontserratBlack = 'Montserrat-Black';
const fontKaushanScript = 'KaushanScript-Regular';
const fontMontserratAlternatesBold = 'MontserratAlternates-Bold';
const fontMontserratAlternatesRegular = 'MontserratAlternates-Regular';


const BallGameScreen = ({ setSelectedSPage }) => {
  const [dimensions] = useState(Dimensions.get('window'));

  const [modalVisible, setModalVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [title, setTitle] = useState('');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [preGameModalVisible, setPreGameModalVisible] = useState(false);

  const [ballX] = useState(new Animated.Value(0));
  const [ballY] = useState(new Animated.Value(0));


  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => !modalVisible,
      onPanResponderMove: (evt, gestureState) => {
        const ballWidth = dimensions.height * 0.16;
        const ballHeight = dimensions.height * 0.1;
        let newX = gestureState.moveX - (ballWidth / 2) - dimensions.width * 0.35;
        newX = Math.max(0 - dimensions.width * 0.46, Math.min(newX, dimensions.width - ballWidth));

        let newY = gestureState.moveY - (ballHeight / 2) - dimensions.height * 0.8;
        newY = Math.max(0 - dimensions.height * 0.9, Math.min(newY, dimensions.height - ballHeight));

        ballX.setValue(newX);
        ballY.setValue(newY);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const ballWidth = dimensions.height * 0.16;
        const ballHeight = dimensions.height * 0.1;
        let newX = gestureState.moveX - (ballWidth / 2) - dimensions.width * 0.44;
        newX = Math.max(0 - dimensions.width * 0.35, Math.min(newX, dimensions.width - ballWidth));

        let newY = gestureState.moveY - (ballHeight / 2) - dimensions.height * 0.8;
        newY = Math.max(0, Math.min(newY, dimensions.height - ballHeight));

        Animated.spring(ballX, {
          toValue: newX,
          useNativeDriver: false,
        }).start();

        Animated.spring(ballY, {
          toValue: newY,
          useNativeDriver: false,
        }).start(() => {
          if (dimensions.height * 0.35 + newY <= dimensions.height * 0.21) {
            setScore(prevScore => prevScore + 1);
          }
        });
      },
    })
  ).current;


  const scoredStageRef = useRef(false);

  useEffect(() => {
    const listenerId = ballY.addListener(({ value }) => {
      const effectiveY = dimensions.height * 0.82 + value;
      const midZoneLeft = dimensions.width / 2 - dimensions.width * 0.07 - dimensions.width * 0.5;
      const midZoneRight = dimensions.width / 2 + dimensions.width * 0.07 - dimensions.width * 0.5;;
      if (
        effectiveY <= dimensions.height * 0.21 &&
        !scoredStageRef.current &&
        ballX._value >= midZoneLeft &&
        ballX._value <= midZoneRight
      ) {
        setScore(prevScore => prevScore + 1);
        scoredStageRef.current = true;
      } else if (effectiveY > dimensions.height * 0.21) {
        scoredStageRef.current = false;
      }
    });
    return () => ballY.removeListener(listenerId);
  }, [ballY, dimensions.height, dimensions.width]);



  const handleStartGame = () => {
    setIsGameStarted(true);
    setPreGameModalVisible(true);
    setTimeout(() => {
      setPreGameModalVisible(false);
    }, 3500);
  };




  return (
    <View>
      <View style={{
        position: 'absolute',
        top: 0,
        width: dimensions.width,
        backgroundColor: '#1D2C38',
        borderBottomLeftRadius: dimensions.width * 0.05,
        borderBottomRightRadius: dimensions.width * 0.05,
        height: dimensions.height * 0.21,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}>
        <SafeAreaView style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: dimensions.width * 0.88,
          alignSelf: 'center',

        }}>
          <TouchableOpacity onPress={() => {
            if (isGameStarted) setModalVisible(true);
            else {
              setSelectedSPage('Home');
            }
          }}
            style={{
              marginTop: dimensions.height * 0.005,
            }}
          >
            <ChevronLeftIcon size={dimensions.height * 0.05} color='white' />
          </TouchableOpacity>
          <View>
            <Text
              style={{
                fontFamily: fontKaushanScript,
                color: 'white',
                fontSize: dimensions.width * 0.1,
                textAlign: 'center',
                alignSelf: 'center',
                marginRight: dimensions.width * 0.14,
              }}>
              Stage
            </Text>
            <Text
              style={{
                fontFamily: fontMontserratRegular,
                fontWeight: 400,
                color: 'white',
                fontSize: dimensions.width * 0.055,
                textAlign: 'center',
                alignSelf: 'center',
                right: dimensions.width * 0.019,
                marginRight: dimensions.width * 0.088,
              }}>
              SPECIAL MODE
            </Text>
          </View>
          <View></View>

        </SafeAreaView>

      </View>

      {!isGameStarted ? (

        <View style={{
          marginTop: dimensions.height * 0.25,
          width: dimensions.width * 0.9,
          alignSelf: 'center',

        }}>
          <Image
            source={require('../assets/images/ballImage.png')}
            style={{
              height: dimensions.height * 0.08,
              width: dimensions.height * 0.08,
            }}
            resizeMode='contain'
          />

          <Text
            style={{
              fontFamily: fontMontserratAlternatesBold,
              color: 'white',
              fontSize: dimensions.width * 0.055,
              textAlign: 'left',
              marginTop: dimensions.height * 0.019,

            }}>
            Welcome to the {'\n'}Stacker Special Mode
          </Text>
          <Text
            style={{
              fontFamily: fontMontserratAlternatesRegular,
              fontWeight: 400,
              color: 'white',
              fontSize: dimensions.width * 0.04,
              textAlign: 'left',
              marginTop: dimensions.height * 0.019,

            }}>
            In this mode, to score a counter, it is not enough to simply press the plus button. You will need to throw the ball into the basket, only after that you will be credited with a count.

            {'\n\n'}This mode will help you get distracted from routine tasks, and relax while counting something less important. Enjoy!
          </Text>


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
              marginTop: dimensions.height * 0.019,
            }}
          />

          <TouchableOpacity
            onPress={() => {
              handleStartGame();
            }}
            style={{
              backgroundColor: title.replace(/\s/g, '').length === 0 ? '#FFFFFF33' : '#4346FF',
              marginTop: dimensions.height * 0.019,
              borderRadius: dimensions.width * 0.014,
              width: dimensions.width * 0.9,
            }}>
            <Text
              style={{
                fontFamily: fontMontserratBold,
                color: title.replace(/\s/g, '').length !== 0 ? 'white' : 'black',
                fontSize: dimensions.width * 0.04,
                textAlign: 'center',
                paddingVertical: dimensions.height * 0.025,
              }}>
              Save and start counting
            </Text>
          </TouchableOpacity>


        </View>
      ) : (
        <View style={{
          height: dimensions.height,
        }}>
          {isGameStarted && (
            <View style={{
              position: 'absolute',
              top: dimensions.height * 0.154,
              width: dimensions.width,
              backgroundColor: '#564753',
              height: dimensions.height * 0.1,
              zIndex: 0
            }}>

            </View>
          )}
          <Image
            source={require('../assets/images/gameUpImage.png')}
            style={{
              width: dimensions.width * 0.64,
              height: dimensions.width * 0.64,
              alignSelf: 'center',
              top: dimensions.height * 0.098,
              position: 'absolute',
            }}
            resizeMode='contain'
          />

          <View style={{
            position: 'absolute',
            alignSelf: 'center',
            top: dimensions.height * 0.5,
            backgroundColor: 'white',
            width: dimensions.width * 0.3,
            borderRadius: dimensions.width * 0.01,
            paddingVertical: dimensions.height * 0.01,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text
              style={{
                fontFamily: fontMontserratBold,
                color: '#4346FF',
                fontSize: dimensions.width * 0.091,
                textAlign: 'center',
              }}>
              {score}
            </Text>
            <Text
              style={{
                fontFamily: fontMontserratRegular,
                fontWeight: 400,
                color: '#4346FF',
                fontSize: dimensions.width * 0.03,
                textAlign: 'center',

              }}>
              Counted
            </Text>

          </View>


          <SafeAreaView
            style={{
              width: dimensions.width,
              height: dimensions.height,
              alignSelf: 'center',
              alignItems: 'center',
              zIndex: 1,
              marginTop: dimensions.height * 0.25,
            }}
            {...panResponder.panHandlers}
          >
            <Animated.View
              style={{
                position: 'absolute',
                bottom: dimensions.height * 0.35,
                transform: [{ translateX: ballX }, { translateY: ballY }],
              }}
            >
              <Image
                resizeMode="contain"
                source={require('../assets/images/ballImage.png')}
                style={{
                  height: dimensions.height * 0.1,
                  width: dimensions.height * 0.1,
                  zIndex: 10
                }}
              />
            </Animated.View>
          </SafeAreaView>


          <View style={{
            position: 'absolute',
            bottom: 0,
            width: dimensions.width,
            backgroundColor: '#564753',
            height: dimensions.height * 0.1,
          }}>

          </View>

        </View>
      )}






      <Modal
        animationType="fade"
        transparent={true}
        visible={preGameModalVisible}
        onRequestClose={() => {
          setPreGameModalVisible(false);
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
            blurType="dark"
            blurAmount={3}
            reducedTransparencyFallbackColor="white"
          />
          <SafeAreaView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            justifyContent: 'flex-end',
          }}>
            <Image
              source={require('../assets/images/preGameImage.png')}
              style={{
                width: dimensions.width * 0.19,
                height: dimensions.width * 0.19,
              }}
              resizeMode='contain'
            />
            <Text
              style={{
                fontFamily: fontMontserratRegular,
                marginBottom: dimensions.height * 0.03,
                color: 'white',
                fontSize: dimensions.width * 0.04,
                textAlign: 'center',
                fontWeight: 400,
                marginTop: dimensions.height * 0.005,
              }}>
              Swipe to change the {'\n'}ball direction
            </Text>

          </SafeAreaView>
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
        <BlurView
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            top: 0,
          }}
          blurType="dark"
          blurAmount={4}
          reducedTransparencyFallbackColor="white"
        />
        <SafeAreaView style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <View style={{
            paddingVertical: dimensions.height * 0.05,
            width: dimensions.width * 0.9,
            borderRadius: dimensions.width * 0.05,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
          }}>
            <Text
              style={{
                fontFamily: fontMontserratBlack,
                color: 'black',
                fontSize: dimensions.width * 0.064,
                textAlign: 'center',
                textTransform: 'uppercase',
                marginTop: dimensions.height * 0.014,
              }}>
              Exit pause
            </Text>

            <Text
              style={{
                fontWeight: 700,
                fontFamily: fontMontserratRegular,
                fontSize: dimensions.width * 0.046,
                textAlign: 'center',
                textTransform: 'uppercase',
                color: 'black',
                marginTop: dimensions.height * 0.025,
                marginBottom: dimensions.height * 0.03,
              }}>
              Are you sure{'\n'}you want to exit?
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedSPage('Home');
              }}
              style={{
                marginTop: dimensions.height * 0.0190002,
                marginTop: dimensions.height * 0.05,
                alignSelf: 'center',
                backgroundColor: '#2E4150',
                borderRadius: dimensions.width * 0.023,
                width: dimensions.width * 0.77,
                paddingVertical: dimensions.height * 0.019,
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: dimensions.width * 0.055,
                  textAlign: 'center',
                  fontFamily: fontMontserratBlack,
                }}>
                Exit to home
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default BallGameScreen;
