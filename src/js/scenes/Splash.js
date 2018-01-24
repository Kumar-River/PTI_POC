import React, { Component } from 'react';
import { StyleSheet, View, Image} from 'react-native';
import { NavigationActions } from 'react-navigation';

//Released Staging version 1.0

export default class Splash extends Component {

	componentWillMount() {
	  setTimeout(async () => {
	  //Replacing splash screen with Home screen
	    const resetAction = NavigationActions.reset({
	        index: 0,
	        actions: [
	          NavigationActions.navigate({ routeName: "Home"})
	        ]
	      });
	    this.props.navigation.dispatch(resetAction);
	    
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
