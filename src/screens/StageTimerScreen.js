import { View, Text, Image, Dimensions, TouchableOpacity, SafeAreaView, Share, Alert, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';

const fontMontserratBold = 'Montserrat-Bold';
const fontMontserratRegular = 'Montserrat-Regular';
const fontKaushanScript = 'KaushanScript-Regular';

const StageTimerScreen = ({ setSelectedSPage, }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [count, setCount] = useState(0);
    const [isTimerStarted, setIsTimerStarted] = useState(false);
    const [timer, setTimer] = useState(null);
    const [pointsPerMinute, setPointsPerMinute] = useState(0);
    const [countPerMinute, setCountPerMinute] = useState(0);

    const [elapsedTime, setElapsedTime] = useState(0);

    // Remove the resetting logic from the setInterval callback
    useEffect(() => {
        let interval = null;
        if (isTimerStarted) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isTimerStarted]);

    // Use a separate useEffect to reset countPerMinute every 60 seconds
    useEffect(() => {
        if (elapsedTime !== 0 && elapsedTime % 60 === 0) {
            setPointsPerMinute(countPerMinute);
            setCountPerMinute(0);
        }
    }, [elapsedTime]);

    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const formattedTime = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;


    return (
        <View>
            <View style={{
                position: 'absolute',
                top: 0,
                width: dimensions.width,
                backgroundColor: '#1D2C38',
                borderBottomLeftRadius: dimensions.width * 0.05,
                borderBottomRightRadius: dimensions.width * 0.05,
                height: dimensions.height * 0.16,
            }}>
                <SafeAreaView style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: dimensions.width * 0.88,
                    alignSelf: 'center',

                }}>
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
                    <View></View>
                </SafeAreaView>
            </View>

            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: dimensions.width * 0.88,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.19,
            }}>
                <TouchableOpacity onPress={() => {
                    setSelectedSPage('Home');
                }}>
                    <ChevronLeftIcon size={dimensions.height * 0.03} color='white' />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: fontMontserratBold,
                        color: 'white',
                        fontSize: dimensions.width * 0.05,
                        textAlign: 'center',
                        alignSelf: 'flex-start',
                        paddingHorizontal: dimensions.width * 0.03,
                    }}>
                    Advanced Timer+Counter
                </Text>
            </View>


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
                <Text
                    style={{
                        fontFamily: fontMontserratBold,
                        color: 'white',
                        fontSize: dimensions.width * 0.04,
                        textAlign: 'center',
                        alignSelf: 'center',
                        paddingHorizontal: dimensions.width * 0.03,
                    }}>
                    Time
                </Text>


                <Text
                    style={{
                        fontFamily: fontMontserratBold,
                        color: 'white',
                        fontSize: dimensions.width * 0.19,
                        textAlign: 'center',
                        alignSelf: 'center',
                        paddingHorizontal: dimensions.width * 0.03,
                    }}>
                    {formattedTime}
                </Text>


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.019,
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            setIsTimerStarted((prev) => !prev);
                        }}
                        style={{
                            backgroundColor: '#4346FF',
                            borderRadius: dimensions.width * 0.019,
                            padding: dimensions.width * 0.03,
                            borderColor: 'white',
                            borderWidth: dimensions.width * 0.0021,
                            height: dimensions.width * 0.12,
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                        <Image
                            source={isTimerStarted
                                ? require('../assets/icons/pauseIcon.png')
                                : require('../assets/icons/startIcon.png')}
                            style={{
                                width: dimensions.width * 0.055,
                                height: dimensions.width * 0.055,
                                alignSelf: 'center',
                            }}
                            resizeMode='contain'
                        />
                        <Text
                            style={{
                                fontFamily: fontMontserratBold,
                                color: 'white',
                                fontSize: dimensions.width * 0.04,
                                textAlign: 'center',
                                alignSelf: 'center',
                                paddingHorizontal: dimensions.width * 0.01,
                            }}>
                            {isTimerStarted ? 'Pause' : 'Start'}
                        </Text>

                    </TouchableOpacity>



                    <TouchableOpacity
                        onPress={() => {
                            setElapsedTime(0);
                            setCount(0);
                            setCountPerMinute(0);
                            setPointsPerMinute(0);
                            setIsTimerStarted(false);
                        }}
                        style={{
                            backgroundColor: '#FFEA00',
                            borderRadius: dimensions.width * 0.019,
                            padding: dimensions.width * 0.03,
                            width: dimensions.width * 0.12,
                            height: dimensions.width * 0.12,
                            marginLeft: dimensions.width * 0.03,
                        }}>
                        <Image
                            source={require('../assets/icons/resetIcon.png')}
                            style={{
                                width: dimensions.width * 0.061,
                                height: dimensions.width * 0.061,
                                alignSelf: 'center',
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>


                <View style={{
                    backgroundColor: 'white',
                    borderRadius: dimensions.width * 0.019,
                    marginTop: dimensions.height * 0.016,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: dimensions.width * 0.01,
                    width: '100%',
                }}>
                    <Text
                        style={{
                            fontFamily: fontMontserratBold,
                            color: '#4346FF',
                            fontSize: dimensions.width * 0.16,
                            textAlign: 'center',
                        }}>
                        {count}
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


                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.019,
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            setCount((prev) => prev + 1);
                            if (countPerMinute < 1000) setCountPerMinute((prev) => prev + 1);
                        }}
                        disabled={count === 1000}
                        style={{
                            alignItems: 'center',
                            paddingVertical: dimensions.width * 0.021,
                            paddingHorizontal: dimensions.width * 0.04,
                            backgroundColor: '#4346FF',
                            borderRadius: dimensions.width * 0.014,
                            width: '48%',
                            marginHorizontal: dimensions.width * 0.03,
                            borderColor: 'white',
                            borderWidth: dimensions.width * 0.0021,
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
                            setCount((prev) => prev - 1);
                            if (countPerMinute > 0) setCountPerMinute((prev) => prev - 1);
                        }}
                        disabled={count === 0}
                        style={{
                            alignItems: 'center',
                            paddingVertical: dimensions.width * 0.021,
                            paddingHorizontal: dimensions.width * 0.04,
                            backgroundColor: 'white',
                            borderRadius: dimensions.width * 0.014,
                            width: '48%',

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


                <Text
                    style={{
                        fontFamily: fontMontserratBold,
                        color: 'white',
                        fontSize: dimensions.width * 0.04,
                        textAlign: 'center',
                        alignSelf: 'center',
                        paddingHorizontal: dimensions.width * 0.03,
                        marginTop: dimensions.height * 0.019,
                    }}>
                    Point per minute: {countPerMinute}
                </Text>

            </View>
        </View>
    );
};

export default StageTimerScreen;