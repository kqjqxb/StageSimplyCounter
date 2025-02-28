import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';


const Stack = createNativeStackNavigator();

const StageSimplyCounterStack = () => {
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


  const [initializingStageSimplyApp, setInitializingStageSimplyApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadNiagaraUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedStageSimplyUser = await AsyncStorage.getItem(storageKey);

        if (storedStageSimplyUser) {
          setUser(JSON.parse(storedStageSimplyUser));
        }
      } catch (error) {
        console.error('Error loading of cur user', error);
      } finally {
        setInitializingStageSimplyApp(false);
      }
    };
    loadNiagaraUser();
  }, [setUser]);

  if (initializingStageSimplyApp) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#2E4150',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};


export default StageSimplyCounterStack;
