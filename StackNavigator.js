import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';


const Stack = createNativeStackNavigator();

const InterestingNiagaraStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isNiagaraOnboardVisible, setIsNiagaraOnboardVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);


  const [initializingNiagaraApp, setInitializingNiagaraApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadNiagaraUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedWolfUser = await AsyncStorage.getItem(storageKey);
        const isWasNiagaraVisible = await AsyncStorage.getItem('isWasNiagaraVisible');

        if (storedWolfUser) {
          setUser(JSON.parse(storedWolfUser));
          setIsNiagaraOnboardVisible(false);
        } else if (isWasNiagaraVisible) {
          setIsNiagaraOnboardVisible(false);
        } else {
          setIsNiagaraOnboardVisible(true);
          await AsyncStorage.setItem('isWasNiagaraVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of cur user', error);
      } finally {
        setInitializingNiagaraApp(false);
      }
    };
    loadNiagaraUser();
  }, [setUser]);

  if (initializingNiagaraApp) {
    return (
      <View style={{
        backgroundColor: '#008B47',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
        <ActivityIndicator size="large" color="#FFC10E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName={isNiagaraOnboardVisible ? 'OnboardingScreen' : 'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};


export default InterestingNiagaraStack;
