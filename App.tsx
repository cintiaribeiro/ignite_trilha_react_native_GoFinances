import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import { Routes } from './src/routes';

import themes from './src/global/styles/themes';

import { AuthProvider, useAuth } from './src/hooks/auth'; 


export default function App() {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userStorageLoading } = useAuth();

  if(!fontsLoaded || userStorageLoading){
    return <AppLoading />
  }


  return (
    <ThemeProvider theme={themes}>      
        <StatusBar 
          barStyle='light-content'  
          backgroundColor="transparent"
          translucent
        />
        <AuthProvider>
          <Routes/>
        </AuthProvider>
    </ThemeProvider>
    
  );
}


