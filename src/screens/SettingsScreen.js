import { View, Text, Image, Dimensions, TouchableOpacity, SafeAreaView, Share, Alert, Switch } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';

const fontMontserratRegular = 'Montserrat-Regular';
const fontMontserratBold = 'Montserrat-Bold';

const SettingsScreen = ({ setSelectedSPage, isVibrationEnabled, setVibrationEnabled, isSoundEffEnabled, setSoundEffEnabled }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    const toggleVibrationSwitch = () => {
        const newValue = !isVibrationEnabled;
        setVibrationEnabled(newValue);
        saveStageSettings('isVibrationEnabled', newValue);
    };

    const toggleSoundEffSwitch = () => {
        const newValue = !isSoundEffEnabled;
        setSoundEffEnabled(newValue);
        saveStageSettings('isSoundEffEnabled', newValue);
    };

    const saveStageSettings = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving settings:", error);
        }
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
                height: dimensions.height * 0.16,
            }}>
                <SafeAreaView style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: dimensions.width * 0.88,
                    alignSelf: 'center',

                }}>
                    <TouchableOpacity onPress={() => {
                        setSelectedSPage('Home');
                    }}>
                        <ChevronLeftIcon size={dimensions.height * 0.05} color='white' />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontFamily: fontMontserratBold,
                            color: 'white',
                            fontSize: dimensions.width * 0.055,
                            textAlign: 'center',
                            alignSelf: 'center',
                            right: dimensions.width * 0.019,
                            marginRight: dimensions.width * 0.088,
                        }}>
                        Settings
                    </Text>
                    <View></View>
                </SafeAreaView>
            </View>

            <SafeAreaView style={{ marginTop: dimensions.height * 0.16, width: '100%', }}>
                <View style={{
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    marginTop: dimensions.width * 0.025,
                    borderRadius: dimensions.width * 0.05,
                    paddingVertical: dimensions.width * 0.01,
                    paddingHorizontal: dimensions.width * 0.03,
                    backgroundColor: 'white',
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                        borderBottomColor: '#c5c5c6',
                        borderBottomWidth: 0.4,
                        borderRadius: 8,
                    }}>
                        <Text style={{
                            color: '#000000',
                            fontSize: dimensions.width * 0.044,
                            fontFamily: fontMontserratRegular,
                        }}>Vibration feedback</Text>
                        <Switch
                            trackColor={{ false: '#948ea0', true: '#34C759' }}
                            thumbColor={isVibrationEnabled ? '#FFFFFF' : '#FFFFFF'}
                            ios_backgroundColor="#3E3E3E"
                            onValueChange={toggleVibrationSwitch}
                            value={isVibrationEnabled}
                        />
                    </View>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10,
                        borderBottomColor: '#c5c5c6',
                        borderBottomWidth: 0.4,
                        borderRadius: 8,
                    }}>
                        <Text style={{
                            color: '#000000',
                            fontSize: dimensions.width * 0.044,
                            fontFamily: fontMontserratRegular,
                        }}>Sound effect</Text>
                        <Switch
                            trackColor={{ false: '#948ea0', true: '#34C759' }}
                            thumbColor={isSoundEffEnabled ? '#FFFFFF' : '#FFFFFF'}
                            ios_backgroundColor="#3E3E3E"
                            onValueChange={toggleSoundEffSwitch}
                            value={isSoundEffEnabled}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default SettingsScreen;