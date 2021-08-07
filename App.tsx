import React from 'react';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import themes from './src/global/styles/themes';

import { Dashboard } from './src/screens/Dashboard';
import { Register } from './src/screens/Registrer';

export default function App() {

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded){
    return <AppLoading />
  }


  return (
    <ThemeProvider theme={themes}>
      
      <Register/>

    </ThemeProvider>
    
  );
}


