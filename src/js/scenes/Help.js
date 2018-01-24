import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, ScrollView} from 'react-native';

import { Button} from 'react-native-material-buttons';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

export default class Help extends Component {
	
	render() {
    const tableHead = ['S.No', 'Field', 'Keyword'];
    const tableData = [
      ['1', 'GTIN List', 'global trade item number'],
      ['2', 'Description', 'description'],
      ['3', 'Item Number Filter', 'item number'],
      ['4', 'Commodity Filter', 'commodity'],
      ['5', 'Variety Filter', 'variety'],
      ['6', 'Lot Number', 'lot number'],
      ['7', 'Date', 'date'],
      ['8', 'Printer', 'printer'],
      ['9', 'MAC Address', 'mac address'],
      ['10', 'IP Address', 'ip address'],
      ['11', 'Port', 'port'],
      ['12', 'Growing Region', 'growing region'],
      ['13', 'City', 'city'],
      ['14', 'State', 'state'],
      ['15', 'Quantity to Print', 'quantity to print'],
      ['16', 'Print', 'print']
    ];

	  return (      
	    <View style={styles.container}>

	    	<View style={styles.titlebar}>
          <Button color='transparent' onPress={() => this.props.navigation.goBack()}>
            <Image source={require("../../res/images/ic_arrow_back.png")} />
          </Button>   
          <Text style={styles.title}>Google Assistent Help</Text>   
        </View>

	    	<ScrollView style={{marginLeft:15, marginRight:15}}>
	  			<Text style={styles.eventText}>
            To provide the voice input press the mic icon in the home page and start to speak.
            {"\n\n"}
            If you want to select the commodity pepper then say "commodity pepper".
            Here commodity is the keyword and pepper is the item to select in the drop down. In the same way you can try for other fields.
            {"\n\n"}
            The keyword for each field is given in the following table.
          </Text>
          <Table>
            <Row data={tableHead} style={styles.head} textStyle={styles.titleText}/>
            <Rows data={tableData} style={styles.row} textStyle={styles.text}/>
          </Table>
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
  },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  titleText: { marginLeft: 5, color: '#000000', fontWeight: 'bold', fontSize: 18, textAlign: 'center'},
  text: { marginLeft: 5, color: '#000000', fontSize: 18},
  row: { height: 30 }
});
