import React, { Component } from 'react';
import { StyleSheet, View, Image} from 'react-native';

import Home from './Home';

//Released Staging version 1.0

export default class Splash extends Component {

	componentWillMount() {
	  setTimeout(async () => {
	    	    
	    this.props.navigator.replace({screen: 'Home'});
	    
	  }, 2000);
	}

	render() {
	  return (
	    <View style={styles.container}>	      
	      <Image source={require("../../res/images/logo.png")} />
	    </View>
	  );
	}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
});
