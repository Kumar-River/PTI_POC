import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, DrawerLayoutAndroid, TouchableOpacity, DatePickerAndroid, ScrollView } from 'react-native';

import { Button } from 'react-native-material-buttons';
import LocalizedStrings from 'react-native-localization';
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';
import _ from 'lodash'
import moment from 'moment';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import Barcode from 'react-native-barcode-builder';

import GTINDBList from '../utils/GTINDB';

var mGTINList;
var mSelectedGTINArray;
const mDateTypeList = [{value:"Pack Date"}, {value:"Harvest Date"}, {value:"Best By"}, {value:"Sell By"}, {value:"Use By"}, {value:"None"}];

const mRadioDateFormatData = [{label: 'MM/DD/YYYY \n Eg: 08/24/2015', value: 'MM/DD/YYYY' },
                    {label: 'DD/MMM/YYYY \n Eg: 24/AUG/2015', value: 'DD/MMM/YYYY' }];

export default class Home extends Component {

  constructor(props) {
      super(props);
      
      this.state = {sSelectedGS1PrefixName:'', sDescriptions:[], sCommodityList:[], sVarietyList:[], sSelectedGTIN:'',sSelectedDesc:'', sItemNumber:'', sSelectedCommodity:'', sSelectedVariety:'',
                    sLotNumber:'', sSelectedDateType:'', sSelectedDate: this.getFormatedDate(new Date(), 'MM/DD/YYYY'), sSelectedDateFormat:mRadioDateFormatData[0].value,
                    sGrowingRegion:'', sCity:'', sState:'', sBarcodeValue:'', sLabelGTINValueLbl:'', sLabelLotNumberLbl:''};

      mGTINList = _.map(_.uniq(_.map(GTINDBList.GTINRecords.GTINRecord, "GS1PrefixName")), function(item){return {"value":item}});
    }

  componentWillMount() {
    if (mGTINList.length > 0) {
      this.onGTINItemSelected(mGTINList[0].value);
    }
  }

	render() {    
      return (
        <DrawerLayoutAndroid
          ref="drawer"
          drawerWidth={600}
          renderNavigationView={() =>

            <Text>Menu</Text>
          }>
          <View style={styles.container}>
            <View style={styles.titlebar}>
              <Button color='transparent' onPress={() => this.refs.drawer.openDrawer()}>
                <Image source={require("../../res/images/ic_menu.png")} />
              </Button>   
              <Text style={styles.title}>HarvestMark PTI</Text>   
            </View>

            <ScrollView>
              <View style={styles.contentView}>
                <View style={styles.contentViewColumn1}>
                  <Dropdown
                    label={strings.gtinList}
                    data={mGTINList}
                    value={this.state.sSelectedGS1PrefixName}
                    onChangeText={(item) => this.onGTINItemSelected(item)}/>
                  <Dropdown
                    label={strings.description}
                    data={this.state.sDescriptions}
                    value={this.state.sSelectedDesc}
                    onChangeText={(item) => this.onDescriptionSelected(item)}/>
                  {/*<TextField
                    style={styles.textinput}
                    label={strings.itemNumberFilter}
                    keyboardType='numeric'
                    value={this.state.sItemNumber}
                    onChangeText={sItemNumber => this.setState({sItemNumber})}/>*/}
                  <Dropdown
                    label={strings.commodityFilter}
                    data={this.state.sCommodityList}
                    value={this.state.sSelectedCommodity}
                    onChangeText={(item) => this.onCommoditySelected(item)}/>
                  <Dropdown
                    label={strings.varietyFilter}
                    data={this.state.sVarietyList}
                    value={this.state.sSelectedVariety}
                    onChangeText={(item) => this.onVarietySelected(item)}/>
                  <TextField
                    style={styles.textinput}
                    label={strings.lotNumber}
                    keyboardType='numeric'
                    value={this.state.sLotNumber}
                    onChangeText={(value) => this.onLotNumberChanged(value)}/>
                  <View style={styles.dateView}>
                    <Dropdown
                      containerStyle={{flex:1}}
                      label={strings.date}
                      data={mDateTypeList}
                      value={this.state.sSelectedDateType}
                      onChangeText={sSelectedDateType => this.setState({sSelectedDateType})}/>
                    <TouchableOpacity style={{flex:1, marginLeft:15}} onPress={this.showDatePicker.bind(this)}>
                      <TextField
                        style={styles.datePickerText}
                        label=""
                        editable={false}
                        value={this.state.sSelectedDate}/>
                    </TouchableOpacity>
                  </View>
                  <RadioForm
                    radio_props={mRadioDateFormatData}
                    formHorizontal={true}
                    labelHorizontal={true}
                    buttonColor={'#2196f3'}
                    onPress={(value) => {this.setState({sSelectedDateFormat:value})}}/>
                  <TextField
                    style={styles.textinput}
                    label={strings.growingRegion}
                    value={this.state.sGrowingRegion}
                    onChangeText={sGrowingRegion => this.setState({sGrowingRegion})}/>
                  <TextField
                    style={styles.textinput}
                    label={strings.city}
                    value={this.state.sCity}
                    onChangeText={sCity => this.setState({sCity})}/>
                  <TextField
                    style={styles.textinput}
                    label={strings.state}
                    value={this.state.sState}
                    onChangeText={sState => this.setState({sState})}/>
                  
                </View>

                <View style={styles.contentViewColumn2}>
                  <TextField
                    style={styles.textinput}
                    label={strings.labelSelection}
                    editable={false}
                    value="4X2RPC"/>

                  <Text>{strings.labelPreview}</Text>
                  <View style={styles.labelPreview}>
                    {this.state.sBarcodeValue ?
                      <View style={{width:250}}>
                        <Barcode value={this.state.sBarcodeValue} format="CODE128" width={1} height={50}/>
                      </View>
                      :
                      null
                    }

                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.labelGTINNumber}>{this.state.sLabelGTINValueLbl}</Text>
                      <Text style={styles.labelLotNumber}>{this.state.sLabelLotNumberLbl}</Text>
                    </View>

                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.labelCommodity} numberOfLines={1}>{this.state.sSelectedCommodity}</Text>
                      <Text style={styles.labelVariety}>{this.state.sSelectedVariety}</Text>
                    </View>

                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.labelPackLine7}>10 KG CT 1</Text>
                      <Text style={styles.labelDateType}>Pack Date</Text>
                    </View>

                    <View style={{flexDirection:'row'}}>
                      <Text style={styles.labelCountryOfOriginGSDN}>Produce of IN{"\n"}4X2PRC Address</Text>
                      <Text style={styles.labelGrade}>US Fancy</Text>
                      <Text style={styles.labelSelectedDate}>MmmDd</Text>
                    </View>

                    <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems:'flex-end'}}>
                      <Text style={styles.labelTraceLabel}>Connect to the farm {"\n"} HarvestMark.com</Text>
                      <Image style={styles.labelTractorImage} source={require("../../res/images/Tractor.png")} />
                      <Text style={styles.labelHMCode}>1234 1234{"\n"}1234 HM01</Text>
                      <Image style={styles.labelTractorImage} source={require("../../res/images/Tractor.png")} />
                      <View style={styles.labelLastView}>
                        <Text style={styles.number1}>59</Text>
                        <Text style={styles.number2}>42</Text>
                      </View>
                    </View>

                  </View>
                </View>
              </View>
            </ScrollView>
            
          </View>
        </DrawerLayoutAndroid>
      );
	}
  
  onGTINItemSelected = (item) => {
    this.setState({sSelectedGS1PrefixName: item}, function(){
      
      var selectedGS1PrefixName = this.state.sSelectedGS1PrefixName;
      mSelectedGTINArray = _.filter(GTINDBList.GTINRecords.GTINRecord, function(item){return item.GS1PrefixName == selectedGS1PrefixName});

      var  GTINs = _.map(_.uniq(_.map(mSelectedGTINArray, 'GTIN')));
      this.setState({sDescriptions : _.map(_.uniq(_.map(mSelectedGTINArray, 'Description')), function(item){return {"value":item}})});
      this.setState({sCommodityList : _.map(_.uniq(_.map(mSelectedGTINArray, 'Commodity')), function(item){return {"value":item}})});
      this.setState({sVarietyList : _.map(_.uniq(_.map(mSelectedGTINArray, 'Variety')), function(item){return {"value":item}})}, function(){
        
        this.setState({sSelectedGTIN : GTINs[0]});
        this.setState({sSelectedDesc: (this.state.sDescriptions)[0].value});
        this.setState({sSelectedCommodity:(this.state.sCommodityList)[0].value});
        this.setState({sSelectedVariety:(this.state.sVarietyList)[0].value}, function(){

          this.setCODE128BarCodeValue();
        });        
      });      
    });   
  }

  onDescriptionSelected = (item) => {
    this.setState({sSelectedDesc: item});

    var selectedDescName = this.state.sSelectedDesc;
    var filteredGTINArrayByDesc = _.filter(mSelectedGTINArray, function(item){return item.Description == selectedDescName});

    var commodityList = _.map(_.map(filteredGTINArrayByDesc, 'Commodity'), function(item){return {"value":item}})
    var varietyList = _.map(_.map(filteredGTINArrayByDesc, 'Variety'), function(item){return {"value":item}});

    this.setState({sSelectedCommodity: commodityList[0].value});
    this.setState({sSelectedVariety: varietyList[0].value});
  }

  onCommoditySelected = (item) => {
    this.setState({sSelectedCommodity: item});

    var selectedCommodityName = this.state.sSelectedCommodity; 
    var filteredGTINArrayByCommodity = _.filter(mSelectedGTINArray, function(item){return item.Commodity == selectedCommodityName});

    this.setState({sDescriptions : _.map(_.map(filteredGTINArrayByCommodity, 'Description'), function(item){return {"value":item}})});
    this.setState({sVarietyList : _.map(_.map(filteredGTINArrayByCommodity, 'Variety'), function(item){return {"value":item}})});

    this.setState({sSelectedDesc: (this.state.sDescriptions)[0].value});
    this.setState({sSelectedVariety:(this.state.sVarietyList)[0].value});
  }

  onVarietySelected = (item) => {
    this.setState({sSelectedVariety: item});

    var selectedVarietyName = this.state.sSelectedVariety;
    var filteredGTINArrayByVariety = _.filter(mSelectedGTINArray, function(item){return item.Variety == selectedVarietyName});

    this.setState({sDescriptions : _.map(_.map(filteredGTINArrayByVariety, 'Description'), function(item){return {"value":item}})});
    var commodityList = _.map(_.map(filteredGTINArrayByVariety, 'Commodity'), function(item){return {"value":item}})

    this.setState({sSelectedDesc: (this.state.sDescriptions)[0].value});
    this.setState({sSelectedCommodity: commodityList[0].value});
  }

  onLotNumberChanged = (value) => {
    this.setState({sLotNumber: value}, function(){
      this.setCODE128BarCodeValue();
    });    
  }

  showDatePicker = async() => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: moment(this.state.sSelectedDate, 'MM/DD/YYYY').toDate()
      });

      if(action == DatePickerAndroid.dateSetAction) {          
        // Selected year, month (0-11), day
        this.setState({sSelectedDate: this.getFormatedDate(new Date(year, month, day), 'MM/DD/YYYY')})
      }

      if (action == DatePickerAndroid.dismissedAction) {
        console.log("date dismissedAction");
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  getFormatedDate(date, outputformat) {
    return moment(date).format(outputformat)
  }

  setCODE128BarCodeValue() {
    var GTINHumanReadableLine1TextPrefix = '(01)';
    var GTINHumanReadableLine2TextPrefix = '(10)';
    var GTINNumber = this.state.sSelectedGTIN;
    var lotNum = this.state.sLotNumber;

    var barcodevalue = '01' + GTINNumber + '10' + lotNum;
    this.setState({sBarcodeValue: barcodevalue});
    this.setState({sLabelGTINValueLbl: '(01)' + GTINNumber});
    this.setState({sLabelLotNumberLbl: '(10)' + lotNum});

    console.log('lotNum '+lotNum);
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
  contentView:{
    flex:1,
    flexDirection: 'row',
    padding: 10
  },
  contentViewColumn1:{
    flex:1
  },
  contentViewColumn2:{
    flex:1,
    marginLeft:15
  },
  textinput: {
    fontSize:18,
    color:'#000000'
  },
  dateView:{
    flexDirection:'row'
  },
  datePickerText:{
    flex:1,
    fontSize:18,
    color:'#000000'
  },
  labelPreview:{
    width:400,
    height:250,
    borderWidth: 1,
    marginTop:10,
    padding:5
  },
  labelGTINNumber:{
    color:'#000000',
    fontSize:14
  },
  labelLotNumber:{
    color:'#000000',
    fontSize:14,
    marginLeft:10
  },
  labelCommodity:{
    color:'#000000',
    fontSize:25,
    fontWeight: 'bold'
  },
  labelVariety:{
    color:'#000000',
    fontSize:25,
    fontWeight: 'bold',
    marginLeft:10
  },
  labelPackLine7:{
    color:'#000000',
    fontSize:20,
    fontWeight: 'bold'
  },
  labelDateTypeRightView:{
    flex:1,
    justifyContent: 'flex-end',
    flexDirection:'row'
  },
  labelDateType:{
    flex:1,
    textAlign: 'right',
    color:'#000000',
    fontSize:14
  },
  labelCountryOfOriginGSDN:{
    color:'#000000',
    fontSize:14,
    flex:1
  },  
  labelGrade:{
    color:'#000000',
    fontSize:14,
    flex:1
  },  
  labelSelectedDate:{
    color:'#000000',
    fontSize:22,
    textAlign: 'right',
    fontWeight:'bold',
    flex:1
  },
  labelTraceLabel:{
    color:'#000000',
    fontSize:12,
  },
  labelHMCode:{
    color:'#000000',
    fontSize:12,
  },
  labelTractorImage:{
    width:40,
    height:40,
    marginLeft:10,
    marginRight:10,
    resizeMode:'contain'
  },
  labelLastView:{
    width:60,
    height:50,
    borderWidth: 1,
    flexDirection:'row',
    alignItems:'flex-end'
  },
  number1:{
    color:'#000000',
    fontSize:20,
    marginLeft:3
  },
  number2:{
    color:'#000000',
    fontSize:22,
    fontWeight:'bold',
    marginLeft:5
  }
});

let strings = new LocalizedStrings({
 "en-US":{
   gtinList:"GTIN List:",
   description: "Description:",
   itemNumberFilter: "Item Number Filter:",
   commodityFilter: "Commodity Filter:",
   varietyFilter: "Variety Filter:",
   lotNumber: "Lot Number:",
   date: "Date:",
   growingRegion: "Growing Region:",
   city: "City:",
   state: "State:",
   labelSelection: "Label Selection:",
   printer: "Printer:",
   worker: "Worker:",
   labelPreview: "Label Preview:",
   quantityToPrint: "Quantity to Print"
 }
});