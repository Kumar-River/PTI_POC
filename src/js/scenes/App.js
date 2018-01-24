/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { StackNavigator } from 'react-navigation';

import Splash from './Splash';
import Home from './Home';
import Event from './Event';

const App = StackNavigator({
    Splash: { screen: Splash},
    Home: { screen: Home},
    Event: {screen: Event}
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
 });

export default App;