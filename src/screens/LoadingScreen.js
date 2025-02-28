import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

const LoadingScreen = ({ setSelectedSPage }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [showLoadImage, setShowLoadImage] = useState(true);
  const [showSplashImage, setShowSplashImage] = useState(false);

  const loadImageRef = useRef(null);
  const splashRef = useRef(null);

  useEffect(() => {
    loadImageRef.current.zoomIn(1000).then(() => {
      loadImageRef.current.fadeOut(1000).then(() => {
        setShowLoadImage(false);
        setShowSplashImage(true);
        splashRef.current.fadeIn(1000);
      });
    });
    setTimeout(() => {
      setSelectedSPage('Home');
    }, 4000);
  }, []);

  return (
    <View style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1D2C38',
      flex: 1,
      zIndex: 1
    }}>
      {showLoadImage && (
        <Animatable.View
          ref={loadImageRef}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          <Image
            resizeMode="contain"
            source={require('../assets/images/loadImage1.png')}
            style={{
              width: dimensions.width * 0.77,
              height: dimensions.width * 0.77,
            }}
          />
        </Animatable.View>
      )}

      {showSplashImage && (
        <Animatable.View
          ref={splashRef}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          <Image
            resizeMode="contain"
            source={require('../assets/images/splashLoadingImage.png')}
            style={{
              width: dimensions.width * 0.77,
              height: dimensions.width * 0.77,
            }}
          />
        </Animatable.View>
      )}
    </View>
  );
};

export default LoadingScreen;
