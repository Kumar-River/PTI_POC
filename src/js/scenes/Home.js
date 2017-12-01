import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, DrawerLayoutAndroid, TouchableOpacity, DatePickerAndroid, ScrollView, NativeModules } from 'react-native';

import { Button, RaisedTextButton } from 'react-native-material-buttons';
import LocalizedStrings from 'react-native-localization';
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';
import _ from 'lodash'
import moment from 'moment';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import GTINDBList from '../utils/GTINDB';

var {ZebraPrint, LabelViewManager} = NativeModules;

var mGTINList;
var mSelectedGTINArray;
const mDateTypeList = [{value:"Pack Date"}, {value:"Harvest Date"}, {value:"Best By"}, {value:"Sell By"}, {value:"Use By"}, {value:"None"}];

const mRadioDateFormatData = [{label: 'MM/DD/YYYY \n Eg: 08/24/2015', value: 'MM/DD/YYYY' },
                    {label: 'DD/MMM/YYYY \n Eg: 24/AUG/2015', value: 'DD/MMM/YYYY' }];

export default class Home extends Component {

  constructor(props) {
      super(props);
      
      this.state = {sSelectedGS1PrefixName:'', sDescriptions:[], sCommodityList:[], sVarietyList:[], sSelectedGTIN:'',sSelectedDesc:'', sItemNumber:'', sSelectedCommodity:'', sSelectedVariety:'',
                    sLotNumber:'', sSelectedDateType:'', sSelectedDate: this.getFormatedDate(new Date(), mRadioDateFormatData[0].value), sSelectedDateFormat:mRadioDateFormatData[0].value,
                    sGrowingRegion:'', sCity:'', sState:'', sBarcodeValue:'', sLabelGTINValueLbl:'', sLabelLotNumberLbl:'', sSelectedPackLine7:'', sSelectedCountryofOriginGDSN:'', 
                    sSelectedGrade:'', sQuantityToPrint:'', isFormInValid:true, sLabelPreviewBas64:' '};

      mGTINList = _.map(_.uniq(_.map(GTINDBList.GTINRecords.GTINRecord, "GS1PrefixName")), function(item){return {"value":item}});
    }

  componentWillMount() {
    if (mGTINList.length > 0) {
      this.onGTINItemSelected(mGTINList[0].value);
    }

    this.setState({sSelectedDateType: mDateTypeList[0].value});    
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
                      onChangeText={(value) => this.onDateTypeChanged(value)}/>
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
                    onPress={(value) => {this.onDateFormatChanged(value)}}/>
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

                  <Image style={{width: 500, height: 300, resizeMode:'contain', borderWidth:1, borderColor:'#000000'}} source={{uri: this.state.sLabelPreviewBas64}}/>

                </View>

                <View style={styles.contentViewColumn3}>
                  <TextField
                    style={styles.textinput}
                    label={strings.quantityToPrint}
                    keyboardType='numeric'
                    value={this.state.sQuantityToPrint}
                    onChangeText={(text)=> this.onQuantityToPrintChange(text)}/>

                  <RaisedTextButton 
                    style={styles.printBtn}
                    titleStyle={{fontSize:20}}
                    title={strings.print}
                    color='#3F51B5'
                    disabled={this.state.isFormInValid}
                    titleColor='#FFFFFF'
                    onPress={this.printLabel.bind(this)} />
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

      var GTINs = _.map(_.uniq(_.map(mSelectedGTINArray, 'GTIN')));
      var packLine7List = _.map(_.uniq(_.map(mSelectedGTINArray, 'PackLine7')));
      var countryofOriginGDSNList = _.map(_.uniq(_.map(mSelectedGTINArray, 'CountryofOriginGDSN')));
      var gradeList = _.map(_.uniq(_.map(mSelectedGTINArray, 'Grade')));
      this.setState({sDescriptions : _.map(_.uniq(_.map(mSelectedGTINArray, 'Description')), function(item){return {"value":item}})});
      this.setState({sCommodityList : _.map(_.uniq(_.map(mSelectedGTINArray, 'Commodity')), function(item){return {"value":item}})});
      this.setState({sVarietyList : _.map(_.uniq(_.map(mSelectedGTINArray, 'Variety')), function(item){return {"value":item}})}, function(){
        
        this.setState({sSelectedGTIN : GTINs[0]});
        this.setState({sSelectedPackLine7 : packLine7List[0]});
        this.setState({sSelectedCountryofOriginGDSN: countryofOriginGDSNList[0]});
        this.setState({sSelectedGrade : gradeList[0]});
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

    var GTINs = _.map(_.uniq(_.map(filteredGTINArrayByDesc, 'GTIN')));
    var packLine7List = _.map(_.uniq(_.map(filteredGTINArrayByDesc, 'PackLine7')));
    var countryofOriginGDSNList = _.map(_.uniq(_.map(filteredGTINArrayByDesc, 'CountryofOriginGDSN')));
    var gradeList = _.map(_.uniq(_.map(filteredGTINArrayByDesc, 'Grade')));
    var commodityList = _.map(_.map(filteredGTINArrayByDesc, 'Commodity'), function(item){return {"value":item}})
    var varietyList = _.map(_.map(filteredGTINArrayByDesc, 'Variety'), function(item){return {"value":item}});

    this.setState({sSelectedGTIN : GTINs[0]});
    this.setState({sSelectedPackLine7 : packLine7List[0]});
    this.setState({sSelectedCountryofOriginGDSN: countryofOriginGDSNList[0]});
    this.setState({sSelectedGrade : gradeList[0]});
    this.setState({sSelectedCommodity: commodityList[0].value});
    this.setState({sSelectedVariety: varietyList[0].value}, function(){

      this.setCODE128BarCodeValue();
    });
  }

  onCommoditySelected = (item) => {
    this.setState({sSelectedCommodity: item});

    var selectedCommodityName = this.state.sSelectedCommodity; 
    var filteredGTINArrayByCommodity = _.filter(mSelectedGTINArray, function(item){return item.Commodity == selectedCommodityName});

    var GTINs = _.map(_.uniq(_.map(filteredGTINArrayByCommodity, 'GTIN')));
    var packLine7List = _.map(_.uniq(_.map(filteredGTINArrayByCommodity, 'PackLine7')));
    var countryofOriginGDSNList = _.map(_.uniq(_.map(filteredGTINArrayByCommodity, 'CountryofOriginGDSN')));
    var gradeList = _.map(_.uniq(_.map(filteredGTINArrayByCommodity, 'Grade')));
    this.setState({sDescriptions : _.map(_.map(filteredGTINArrayByCommodity, 'Description'), function(item){return {"value":item}})});
    this.setState({sVarietyList : _.map(_.map(filteredGTINArrayByCommodity, 'Variety'), function(item){return {"value":item}})}, function(){

      this.setState({sSelectedGTIN : GTINs[0]});
      this.setState({sSelectedPackLine7 : packLine7List[0]});
      this.setState({sSelectedCountryofOriginGDSN: countryofOriginGDSNList[0]});
      this.setState({sSelectedGrade : gradeList[0]});
      this.setState({sSelectedDesc: (this.state.sDescriptions)[0].value});
      this.setState({sSelectedVariety:(this.state.sVarietyList)[0].value}, function(){

        this.setCODE128BarCodeValue();
      });
    });    
  }

  onVarietySelected = (item) => {
    this.setState({sSelectedVariety: item});

    var selectedVarietyName = this.state.sSelectedVariety;
    var filteredGTINArrayByVariety = _.filter(mSelectedGTINArray, function(item){return item.Variety == selectedVarietyName});

    var GTINs = _.map(_.uniq(_.map(filteredGTINArrayByVariety, 'GTIN')));
    var packLine7List = _.map(_.uniq(_.map(filteredGTINArrayByVariety, 'PackLine7')));
    var countryofOriginGDSNList = _.map(_.uniq(_.map(filteredGTINArrayByVariety, 'CountryofOriginGDSN')));
    var gradeList = _.map(_.uniq(_.map(filteredGTINArrayByVariety, 'Grade')));
    this.setState({sDescriptions : _.map(_.map(filteredGTINArrayByVariety, 'Description'), function(item){return {"value":item}})});
    var commodityList = _.map(_.map(filteredGTINArrayByVariety, 'Commodity'), function(item){return {"value":item}});

    this.setState({sSelectedGTIN : GTINs[0]});
    this.setState({sSelectedPackLine7 : packLine7List[0]});
    this.setState({sSelectedCountryofOriginGDSN: countryofOriginGDSNList[0]});
    this.setState({sSelectedGrade : gradeList[0]});
    this.setState({sSelectedDesc: (this.state.sDescriptions)[0].value});
    this.setState({sSelectedCommodity: commodityList[0].value}, function(){

      this.setCODE128BarCodeValue();
    });
  }

  onLotNumberChanged = (value) => {
    this.setState({sLotNumber: value}, function(){
      this.setCODE128BarCodeValue();
    });
  }

  onDateTypeChanged = (value) => {
    this.setState({sSelectedDateType: value}, function(){

      var labelValues = {"dateType": this.state.sSelectedDateType};
      this.updateLabelPreview(labelValues);
    });
  }

  onDateFormatChanged = (value) => {
    var previousFormat = this.state.sSelectedDateFormat;

    this.setState({sSelectedDateFormat: value}, function(){
      this.setState({sSelectedDate: this.getFormatedDate( moment(this.state.sSelectedDate, previousFormat).toDate(), this.state.sSelectedDateFormat)}, function(){

        var labelValues = {"date": this.state.sSelectedDate};
        this.updateLabelPreview(labelValues);
      });
    });
  }

  onQuantityToPrintChange = (text) => {
    let newText = '';
    let numbers = '0123456789';

    for (var i = 0; i < text.length; i++) {
        if ( numbers.indexOf(text[i]) > -1 ) {
            newText = newText + text[i];
        }
    }   
    this.setState({sQuantityToPrint: newText}, function(){
      this.validateForm();
    });   
  }
  
  showDatePicker = async() => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: moment(this.state.sSelectedDate, this.state.sSelectedDateFormat).toDate()
      });

      if(action == DatePickerAndroid.dateSetAction) {          
        // Selected year, month (0-11), day
        this.setState({sSelectedDate: this.getFormatedDate(new Date(year, month, day), this.state.sSelectedDateFormat)}, function(){

          var labelValues = {"date": this.state.sSelectedDate};
          this.updateLabelPreview(labelValues);
        });
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
    this.setState({sLabelLotNumberLbl: '(10)' + lotNum}, function(){

      var labelValues = {"barcodevalue": this.state.sBarcodeValue,
                        "GTINNumberLbl": this.state.sLabelGTINValueLbl,
                        "lotNumberLbl": this.state.sLabelLotNumberLbl,
                        "commodity": this.state.sSelectedCommodity,
                        "variety": this.state.sSelectedVariety,
                        "packLine7": this.state.sSelectedPackLine7,
                        "dateType": this.state.sSelectedDateType,
                        "countryOfOrigin": this.state.sSelectedCountryofOriginGDSN,
                        "grade": this.state.sSelectedGrade,
                        "date": this.state.sSelectedDate
                      };

      this.updateLabelPreview(labelValues);
    });         
  }

  updateLabelPreview(paramLabelValues) {
    LabelViewManager.setLabelValues(paramLabelValues, (base64Image) => {
        var img = 'data:image/png;base64,'+base64Image;
        this.setState({sLabelPreviewBas64:img})        
      });

    this.validateForm();
  }

  validateForm() {
    if (this.state.sSelectedGTIN != '' && this.state.sSelectedDesc != '' && this.state.sSelectedCommodity != '' && this.state.sSelectedVariety != '' && this.state.sLotNumber != '' && this.state.sQuantityToPrint != '' && Number(this.state.sQuantityToPrint) != 0) {
      this.setState({isFormInValid: false});
    }
    else {
      this.setState({isFormInValid: true});
    }
  }

  printLabel = () => {
    //ZebraPrint.printLabel(false, '', '192.168.100.55', '9100');
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
    flex:1.5,
    marginLeft:15
  },
  contentViewColumn3:{
    flex:0.8,
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
    width:420,
    height:230,
    borderWidth: 1,
    marginTop:10,
    padding:5,
    backgroundColor:'#FFFFFF'
  },
  printBtn:{
    marginTop:15,
    height:50
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
   quantityToPrint: "Quantity to Print",
   print:"PRINT"
 }
});