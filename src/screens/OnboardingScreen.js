import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform, SafeAreaView } from 'react-native';
import OnboardingNiagaraData from '../components/OnboardingNiagaraData';
import { useNavigation } from '@react-navigation/native';

const fontInter18ptRegular = 'Inter18pt-Regular';
const fontMontserratBold = 'Montserrat-Bold';

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [currentWolfSlideIndex, setCurrentWolfSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    const dimensionListener = Dimensions.addEventListener('change', onChange);

    return () => {
      dimensionListener.remove();
    };
  }, []);




  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentWolfSlideIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToTheNextLeonSlide = () => {
    if (currentWolfSlideIndex < OnboardingNiagaraData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentWolfSlideIndex + 1 });
    } else {
      navigation.navigate('Home');
    }
  };


  const renderWolfItem = ({ item }) => (
    <View style={{
      width: dimensions.width * 0.9,
      flex: 1,
      alignItems: 'center',
      borderRadius: dimensions.width * 0.05,
    }} >
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderWidth: dimensions.width * 0.019,
        borderColor: '#FFC10E',
        borderRadius: dimensions.width * 0.05,
        marginTop: dimensions.height * 0.1,
      }}>
        <Image
          resizeMode="contain"
          source={item.image}
          style={{
            width: dimensions.width * 0.61,
            height: dimensions.width * 0.61,
            borderRadius: dimensions.width * 0.037,
          }}
        />

      </View>


      <Text
        style={{
          fontSize: dimensions.width * 0.07,
          marginTop: dimensions.height * 0.1,
          fontFamily: fontMontserratBold,
          maxWidth: '91%',
          color: 'white',
          textAlign: 'center',
          fontWeight: 900,
        }}>
        {item.title}
      </Text>
    </View>
  );

  return (

    <SafeAreaView
      style={{ justifyContent: 'space-between', flex: 1, alignItems: 'center', backgroundColor: '#008B47' }}
    >


      <View style={{
        display: 'flex',
        width: dimensions.width * 0.9,
        height: dimensions.height * 0.7,
        borderRadius: dimensions.width * 0.1,
        alignSelf: 'center'
      }}>
        <FlatList
          data={OnboardingNiagaraData}
          renderItem={renderWolfItem}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (currentWolfSlideIndex === OnboardingNiagaraData.length - 1) {
            navigation.navigate('Home');
          } else scrollToTheNextLeonSlide();
        }}
        style={{
          backgroundColor: '#FFC10E',
          borderRadius: dimensions.width * 0.03,
          paddingVertical: 21,
          paddingHorizontal: 28,
          marginBottom: 40,
          alignSelf: 'center',
          width: dimensions.width * 0.5,
        }}
      >
        <Text
          style={{
            fontFamily: fontInter18ptRegular,
            color: 'black',
            fontSize: dimensions.width * 0.048,
            textAlign: 'center',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}>
          {currentWolfSlideIndex === 0 ? 'Next' : currentWolfSlideIndex === 0 ? 'Continue' : 'Start'}
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default OnboardingScreen;
