// import React, { useEffect, useState } from 'react';
// import {
//   Dimensions,
//   Image,
//   View,
// } from 'react-native';
// import * as Animatable from 'react-native-animatable';

// const LoadingScreen = ({ setSelectedSPage }) => {
//   const [dimensions, setDimensions] = useState(Dimensions.get('window'));
//   const [isImageVisible, setIsImageVisible] = useState(false);

//   useEffect(() => {
//     setTimeout(() => {
//       setSelectedSPage('Home');
//     }, 5000);
//   }, []);

//   useEffect(() => {
//     setTimeout(() => {
//       setIsImageVisible(true);
//     }, 2800);
//   }, []);

//   return (
//     <View style={{
//       display: 'flex',
//       alignSelf: 'center',
//       width: '100%',
//       alignItems: 'center',
//       backgroundColor: 'transparent',
//       flex: 1,
//       zIndex: 1
//     }}>
//       {isImageVisible && (
//         <Animatable.View
//           animation="zoomIn"
//           duration={1000}
//           style={{
//             alignItems: 'center',
//             justifyContent: 'center',
//             alignSelf: 'center',
//             borderWidth: dimensions.width * 0.019,
//             borderColor: '#FFC10E',
//             borderRadius: dimensions.width * 0.05,
//             marginTop: dimensions.height * 0.34,
//             zIndex: 1005,
//             width: dimensions.width * 0.64,
//             height: dimensions.width * 0.64,
//           }}
//         >
//           <Image
//             resizeMode="contain"
//             source={require('../assets/images/onbImages/onbIm1.png')}
//             style={{
//               width: dimensions.width * 0.61,
//               height: dimensions.width * 0.61,
//               borderRadius: dimensions.width * 0.037,
//             }}
//           />
//         </Animatable.View>
//       )}
//       <Animatable.View
//         animation={{
//           from: { height: 0 },
//           to: { height: dimensions.height }
//         }}
//         duration={2000}
//         delay={2000} // Затримка для анімації фону після падіння краплі
//         style={{
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           backgroundColor: '#06CCE2',
//           zIndex: 2
//         }}
//       />
//       <Animatable.View
//         animation={{
//           from: { translateY: -dimensions.height },
//           to: { translateY: dimensions.height }
//         }}
//         duration={2000}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: dimensions.width * 0.42,
//           zIndex: 3
//         }}
//       >
//         <Image
//           source={require('../assets/images/dropWaterImage.png')}
//           style={{
//             width: dimensions.width * 0.16,
//             height: dimensions.width * 0.16,
//           }}
//           resizeMode="contain"
//         />
//       </Animatable.View>
//     </View>
//   );
// };

// export default LoadingScreen;
