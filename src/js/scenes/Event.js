import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView} from 'react-native';

import { Button} from 'react-native-material-buttons';

export default class Event extends Component {
	
	render() {
	  return (
	    <View style={styles.container}>

	    	<View style={styles.titlebar}>
              <Button color='transparent' onPress={() => this.props.navigation.goBack()}>
                <Image source={require("../../res/images/ic_arrow_back.png")} />
              </Button>   
              <Text style={styles.title}>Event File</Text>   
            </View>

	    	<ScrollView>
	  			<Text style={styles.eventText}>{JSON.stringify(this.props.navigation.state.params.eventObj)}</Text>
	      </ScrollView>
	    </View>
	  );
	}	
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  titlebar:{
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#008000',
    alignItems: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    color:'#FFFFFF'
  },
  eventText: {
    flex: 1,
  	color:'#000000',
    padding: 8,
  	fontSize: 18,
  }
});
