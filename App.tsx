import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  StatusBar,
} from 'react-native';
import MainNavigation from "./src/navigation/main";
import 'react-native-gesture-handler';
import { COLORS } from "./src/theme";

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.BACKGROUND} />
      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </>
  );
};

export default App;
