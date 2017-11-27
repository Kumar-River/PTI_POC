/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { BackAndroid, Text } from 'react-native';
import NavigationExperimental from 'react-native-deprecated-custom-components';

import Splash from './Splash';
import Home from './Home';

var mNavigator;

BackAndroid.addEventListener('hardwareBackPress', () => {
   if (mNavigator && mNavigator.getCurrentRoutes().length > 1) {
     mNavigator.pop();
     return true;
   }
   return false;
  });

export default class App extends Component<{}> {
  render() {
    return (
      <NavigationExperimental.Navigator
          initialRoute={{screen: 'Splash'}}
          configureScene={(route, routeStack) => NavigationExperimental.Navigator.SceneConfigs.FloatFromBottom}
          renderScene={(route, nav) => {return this.renderScene(route, nav)}}/>
    );
  }

  renderScene(route,nav) {
      mNavigator = nav;
      switch (route.screen) {
        case "Splash":
          return <Splash navigator={nav}/>
        case "Home":
          return <Home navigator={nav} />
      }
  }
}