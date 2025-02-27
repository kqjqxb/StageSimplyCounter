import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    TouchableOpacity,
    Share,
    Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import places from '../components/allPlaces';
import { XMarkIcon } from 'react-native-heroicons/solid';

const fontMontserratRegular = 'Montserrat-Regular';
const fontMontserratBlack = 'Montserrat-Black';

const MapScreen = ({ selectedPlace, setSelectedScreen, isPlaceVisible, setIsPlaceVisible, isPlaceDetailsVisible, setIsPlaceDetailsVisible }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

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


    return (
        <View style={{ width: '100%' }}>
            <MapView
                style={{
                    width: '100%',
                    height: dimensions.height,
                    alignSelf: 'center',
                    zIndex: 50
                }}
                region={{
                    latitude: selectedPlace ? selectedPlace.coordinates.latitude : places[0].coordinates.latitude,
                    longitude: selectedPlace ? selectedPlace.coordinates.longitude : places[0].coordinates.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >

                {places.map((location, index) => (
                    <Marker
                        key={index}
                        coordinate={location.coordinates}
                        title={location.title}
                        description={location.description}
                        pinColor={selectedPlace && location.coordinates === selectedPlace.coordinates ? "#FFC10E" : "#008B47"}
                    />
                ))}
            </MapView>
            {isPlaceVisible && (
                <View style={{
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    zIndex: 100,
                    position: 'absolute',
                    alignItems: 'center',
                    top: dimensions.height * 0.25,
                    justifyContent: 'center',
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        alignSelf: 'center',
                        borderRadius: dimensions.width * 0.07,
                        width: dimensions.width * 0.9,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    }}>
                        <View style={{
                            marginBottom: dimensions.height * 0.019,
                            backgroundColor: 'white',
                            padding: dimensions.width * 0.04,
                            borderRadius: dimensions.width * 0.03,
                        }}>
                            <Image
                                source={selectedPlace.image}
                                style={{
                                    width: '100%',
                                    borderRadius: dimensions.width * 0.03,
                                    height: dimensions.height * 0.16,
                                }}
                                resizeMode="stretch"
                            />


                            <Text
                                style={{
                                    marginTop: dimensions.height * 0.019,
                                    alignSelf: 'flex-start',
                                    textAlign: 'left',
                                    fontFamily: fontMontserratBlack,
                                    fontSize: dimensions.width * 0.046,
                                    color: 'black',
                                }}>
                                {selectedPlace.title}
                            </Text>


                            <Text
                                style={{
                                    alignSelf: 'flex-start',
                                    color: 'black',
                                    fontFamily: fontMontserratRegular,
                                    fontSize: dimensions.width * 0.037,
                                    textAlign: 'left',
                                    fontWeight: 400,
                                    marginTop: dimensions.height * 0.016,
                                }}>
                                {selectedPlace.description.length > 100 ? `${selectedPlace.description.substring(0, 100)}...` : selectedPlace.description}
                            </Text>


                            <View style={{
                                marginTop: dimensions.height * 0.03,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                marginBottom: dimensions.height * 0.01,
                                flexDirection: 'row',
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsPlaceVisible(false);
                                    }}
                                    style={{
                                        alignItems: 'center',
                                        backgroundColor: '#FFC10E',
                                        width: dimensions.width * 0.15,
                                        height: dimensions.width * 0.15,
                                        justifyContent: 'center',
                                        borderRadius: dimensions.width * 0.03,
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
                                        setSelectedScreen('Places');
                                    }}
                                    style={{
                                        backgroundColor: '#FFC10E',
                                        height: dimensions.width * 0.15,
                                        justifyContent: 'center',
                                        borderRadius: dimensions.width * 0.03,
                                        alignItems: 'center',
                                        width: dimensions.width * 0.48,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        elevation: 5,
                                        justifyContent: 'center',
                                        shadowRadius: 3.84,
                                    }}>
                                    <Text
                                        style={{
                                            fontFamily: fontMontserratBlack,
                                            color: 'black',
                                            fontSize: dimensions.width * 0.04,
                                            textAlign: 'left',
                                        }}>
                                        Read more
                                    </Text>
                                    <Image
                                        source={require('../assets/icons/readIcon.png')}
                                        style={{
                                            width: dimensions.width * 0.07,
                                            height: dimensions.width * 0.07,
                                            marginLeft: dimensions.width * 0.025,
                                        }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>


                                <TouchableOpacity
                                    onPress={() => {
                                        ShareNiagaraPlace(selectedPlace.title);
                                    }}
                                    style={{
                                        borderRadius: dimensions.width * 0.03,
                                        width: dimensions.width * 0.15,
                                        height: dimensions.width * 0.15,
                                        justifyContent: 'center',
                                        backgroundColor: '#FFC10E',
                                        shadowColor: '#000',
                                        alignItems: 'center',
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
                    </View>
                </View>
            )}
        </View>
    );
};

export default MapScreen;
