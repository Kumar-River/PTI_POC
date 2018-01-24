import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, DrawerLayoutAndroid, TouchableOpacity, DatePickerAndroid, ScrollView, ToastAndroid, NativeModules } from 'react-native';

import { Button, RaisedTextButton } from 'react-native-material-buttons';
import LocalizedStrings from 'react-native-localization';
import { Dropdown } from 'react-native-material-dropdown';
import { TextField } from 'react-native-material-textfield';
import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
import _ from 'lodash'
import moment from 'moment';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import GTINDBList from '../utils/GTINDB';
import EventObj from '../utils/EventObj';
import Messages from  '../utils/Messages';

var {ZebraPrint, LabelViewManager} = NativeModules;
var mGTINList;
var mItemNoDescSeperator = ' - ';
var mSelectedGTINArray;
const mDateTypeList = [{value:"Pack Date"}, {value:"Harvest Date"}, {value:"Best By"}, {value:"Sell By"}, {value:"Use By"}, {value:"None"}];
const mRadioDateFormatData = [{label: 'MM/DD/YYYY \n Eg: 08/24/2015', value: 'MM/DD/YYYY' }, {label: 'DD/MMM/YYYY \n Eg: 24/AUG/2015', value: 'DD/MMM/YYYY' }];
const mSelectedDateToLabelFormat = 'MMMDD';
const BLUETOOTH = 0, IP_DNS = 1;
const mRadioPrintConnectionTypes = [{label:'Bluetooth', value:BLUETOOTH}, {label:'IP/DNS', value:IP_DNS}];
var KEYS = { BARCODE_VALUE:"barcodevalue", GTIN_NUMBER_LBL:"GTINNumberLbl", LOT_NUMBER_LBL:"lotNumberLbl", COMMODITY:"commodity", 
                VARIETY:"variety", PACKLINE7:"packLine7", DATE_TYPE:"dateType", COUNTRY_OF_ORIGIN:"countryOfOrigin", GRADE:"grade", DATE:"date"};
const gtinVoiceRegKey='gtin', descriptionVoiceRegKey='description', commodityVoiceRegKey='commodity', varietyVoiceRegKey='variety', dateVoiceRegKey='date', lotNumberVoiceRegKey='lot number', growingRegionVoiceRegKey='growing region', cityVoiceRegKey='city', 
        stateVoiceRegKey='state', quantityToPrintVoiceRegKey='quantity to print', itemNumberVoiceRegKey='item number', printerVoiceRegKey='printer', printVoiceRegKey='print', macAddressVoiceRegKey='mac address', ipAddressVoiceRegKey='ip address', portVoiceRegKey='port';
const VOICE_LANGUAGE = 'en-US';

export default class Home extends Component {

  constructor(props) {
      super(props);
      
      this.state = {sSelectedGS1PrefixName:'', sDescriptions:[], sCommodityList:[], sVarietyList:[], sSelectedGTIN:'',sSelectedDesc:'', sItemNumber:'', sSelectedCommodity:'', sSelectedVariety:'',
                    sLotNumber:'', sSelectedDateType:'', sSelectedDate: this.getFormatedDate(new Date(), mRadioDateFormatData[0].value), sSelectedDateToLabel: this.getFormatedDate(new Date(), mSelectedDateToLabelFormat).toUpperCase(), sSelectedDateFormat:mRadioDateFormatData[0].value,
                    sGrowingRegion:'', sCity:'', sState:'', sBarcodeValue:'', sLabelGTINValueLbl:'', sLabelLotNumberLbl:'', sSelectedPackLine7:'', sSelectedCountryofOriginGDSN:'', 
                    sSelectedGrade:'', sQuantityToPrint:'', isFormInValid:true, sLabelPreviewBas64:' ', sSelectedPrinterConnectionType:BLUETOOTH,
                    sMacAddress:'', sIpAddress:'', sPort:'9100', isPrinterDataEntered: false};

      mGTINList = _.map(_.uniq(_.map(GTINDBList.GTINRecords.GTINRecord, "GS1PrefixName")), function(item){return {"value":item}});

      //Start of Voice callback method initializations
      Voice.onSpeechStart = this.onSpeechStart.bind(this);
      Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
      Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
      Voice.onSpeechError = this.onSpeechError.bind(this);
      Voice.onSpeechResults = this.onSpeechResults.bind(this);
      Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
      Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
      //End of Voice callback method initializations
    }

  componentWillMount() {
    if (mGTINList.length > 0) {
      this.onGTINItemSelected(mGTINList[0].value);
    }

    this.setState({sSelectedDateType: mDateTypeList[0].value});
  }

  componentWillUnmount() {
    //Voice.destroy().then(Voice.removeAllListeners);
  }

	render() {    
      return (
        <DrawerLayoutAndroid
          ref="drawer"
          drawerWidth={500}
          renderNavigationView={() =>
            <View style={styles.menuContainer}>
              <Image source={require("../../res/images/logo.png")} />
            </View>
          }>
          <View style={styles.container}>
            <View style={styles.titlebar}>
              <Button color='transparent' onPress={() => this.refs.drawer.openDrawer()}>
                <Image source={require("../../res/images/ic_menu.png")} />
              </Button>
              <Text style={styles.title}>HarvestMark PTI</Text>
              <Button color='transparent' onPress={this.startRecognizing.bind(this)}>
                <Image source={require("../../res/images/ic_mic.png")} />
              </Button>
            </View>

            <ScrollView>
              <View style={styles.contentView}>
                <View style={styles.contentViewColumn1}>                  
                  <Dropdown
                    containerStyle={{flex:1}}
                    label={strings.gtinList}
                    data={mGTINList}
                    value={this.state.sSelectedGS1PrefixName}
                    onChangeText={(item) => this.onGTINItemSelected(item)}/>
                  <Dropdown
                    label={strings.description}
                    data={this.state.sDescriptions}
                    value={this.state.sSelectedDesc}
                    onChangeText={(item) => this.onDescriptionSelected(item)}/>
                  <TextField
                    ref='itemNo'
                    style={styles.textinput}
                    label={strings.itemNumberFilter}
                    keyboardType='numeric'
                    value={this.state.sItemNumber}
                    onChangeText={(text)=> this.onItemNumberFilterChange(text)}
                    onSubmitEditing={(event) => {this.refs.lotmNo.focus();}}/>
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
                    ref='lotmNo'
                    style={styles.textinput}
                    label={strings.lotNumber}
                    value={this.state.sLotNumber}
                    onChangeText={(value) => this.onLotNumberChanged(value)}
                    onSubmitEditing={(event) => {(this.state.sSelectedPrinterConnectionType == BLUETOOTH) ? this.refs.macAddress.focus() : this.refs.ipAddress.focus();}}/>
                  <View style={styles.rowView}>
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

                  {/*<RadioForm
                    radio_props={mRadioDateFormatData}
                    formHorizontal={true}
                    labelHorizontal={true}
                    buttonColor={'#2196f3'}
                    onPress={(value) => {this.onDateFormatChanged(value)}}/>*/}
                                    
                </View>

                <View style={styles.contentViewColumn2}>
                  <TextField
                    style={styles.textinput}
                    label={strings.labelSelection}
                    editable={false}
                    value="4X2RPC"/>

                  <Text>{strings.printer}</Text>
                  <RadioForm
                    ref='printerConnectionType'
                    radio_props={mRadioPrintConnectionTypes}
                    formHorizontal={true}
                    labelHorizontal={true}
                    buttonColor={'#2196f3'}
                    onPress={(value) => {this.onPrinterConnectionTypeChanged(value)}}/>
                  {(this.state.sSelectedPrinterConnectionType == BLUETOOTH) ?
                    <TextField
                      ref='macAddress'
                      style={styles.textinput}
                      label={strings.macAddress}
                      value={this.state.sMacAddress}
                      onChangeText={(value) => {this.onMacAddressChanged(value)}}
                      onSubmitEditing={(event) => {this.refs.growingRegion.focus();}}/>
                    :
                    <View style={styles.rowView}>
                      <View style={{flex:1}}>
                        <TextField
                          ref='ipAddress'
                          style={styles.textinput}
                          label={strings.ipAddress}
                          value={this.state.sIpAddress}
                          onChangeText={(value) => {this.onIPAddressChanged(value)}}
                          onSubmitEditing={(event) => {this.refs.portNo.focus();}}/>
                      </View>
                      <View style={{flex:1, marginLeft:15}}>
                        <TextField
                          ref='portNo'
                          style={styles.textinput}
                          label={strings.port}
                          value={this.state.sPort}
                          maxLength={5}
                          keyboardType='numeric'
                          onChangeText={(value) => {this.onPortChanged(value)}}
                          onSubmitEditing={(event) => {this.refs.growingRegion.focus();}}/>
                      </View>
                    </View>
                  }

                  <Text>{strings.labelPreview}</Text>

                  <Image style={{width: 400, height: 240, resizeMode:'contain', borderWidth:1, borderColor:'#000000'}} source={{uri: this.state.sLabelPreviewBas64}}/>

                </View>

                <View style={styles.contentViewColumn3}>

                  <TextField
                    ref='growingRegion'
                    style={styles.textinput}
                    label={strings.growingRegion}
                    value={this.state.sGrowingRegion}
                    onChangeText={sGrowingRegion => this.setState({sGrowingRegion})}
                    onSubmitEditing={(event) => {this.refs.city.focus();}}/>
                  <TextField
                    ref='city'
                    style={styles.textinput}
                    label={strings.city}
                    value={this.state.sCity}
                    onChangeText={sCity => this.setState({sCity})}
                    onSubmitEditing={(event) => {this.refs.state.focus();}}/>
                  <TextField
                    ref='state'
                    style={styles.textinput}
                    label={strings.state}
                    value={this.state.sState}
                    onChangeText={sState => this.setState({sState})}
                    onSubmitEditing={(event) => {this.refs.quantityToPrint.focus();}}/>
                  <TextField
                    ref='quantityToPrint'
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
                    onPress={this.onPrintBtnClicked.bind(this)} />
                </View>
              </View>
            </ScrollView>            
          </View>
        </DrawerLayoutAndroid>
      );
	}
  
  onGTINItemSelected = (item) => {
    this.setState({sSelectedGS1PrefixName: item}, function(){
      
      this.setState({sItemNumber:''});

      var selectedGS1PrefixName = this.state.sSelectedGS1PrefixName;
      mSelectedGTINArray = _.filter(GTINDBList.GTINRecords.GTINRecord, function(item){return item.GS1PrefixName == selectedGS1PrefixName});

      var GTINs = _.map(_.uniq(_.map(mSelectedGTINArray, 'GTIN')));
      var packLine7List = _.map(_.uniq(_.map(mSelectedGTINArray, 'PackLine7')));
      var countryofOriginGDSNList = _.map(_.uniq(_.map(mSelectedGTINArray, 'CountryofOriginGDSN')));
      var gradeList = _.map(_.uniq(_.map(mSelectedGTINArray, 'Grade')));
      this.setState({sDescriptions : _.map(_.uniq(_.map(mSelectedGTINArray, function(obj){return obj.ItemNo+mItemNoDescSeperator+obj.Description})), function(item){return {"value":item}})});
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
    selectedDescName = selectedDescName.substr(selectedDescName.indexOf(mItemNoDescSeperator)+mItemNoDescSeperator.length);
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
    console.log("inside onCommoditySelected")
    this.setState({sSelectedCommodity: item});
    console.log("sSelectedCommodity "+this.state.sSelectedCommodity);

    var selectedCommodityName = this.state.sSelectedCommodity; 
    var filteredGTINArrayByCommodity = _.filter(mSelectedGTINArray, function(item){return item.Commodity == selectedCommodityName});

    var GTINs = _.map(_.uniq(_.map(filteredGTINArrayByCommodity, 'GTIN')));
    var packLine7List = _.map(_.uniq(_.map(filteredGTINArrayByCommodity, 'PackLine7')));
    var countryofOriginGDSNList = _.map(_.uniq(_.map(filteredGTINArrayByCommodity, 'CountryofOriginGDSN')));
    var gradeList = _.map(_.uniq(_.map(filteredGTINArrayByCommodity, 'Grade')));
    this.setState({sDescriptions : _.map(_.map(filteredGTINArrayByCommodity,  function(obj){return obj.ItemNo+mItemNoDescSeperator+obj.Description}), function(item){return {"value":item}})});
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
    this.setState({sDescriptions : _.map(_.map(filteredGTINArrayByVariety,  function(obj){return obj.ItemNo+mItemNoDescSeperator+obj.Description}), function(item){return {"value":item}})});
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

  onItemNumberFilterChange = (text) => {
    this.setState({sItemNumber: this.getNumberFromText(text)}, function(){

      var selectedGS1PrefixName = this.state.sSelectedGS1PrefixName;
      var enteredItemNumber = this.state.sItemNumber;
      mSelectedGTINArrayWithItemNumber = _.filter(GTINDBList.GTINRecords.GTINRecord, function(item){return item.GS1PrefixName == selectedGS1PrefixName && (enteredItemNumber.trim().length > 0 ? item.ItemNo == enteredItemNumber : true)});

      var GTINs = _.map(_.uniq(_.map(mSelectedGTINArrayWithItemNumber, 'GTIN')));
      var packLine7List = _.map(_.uniq(_.map(mSelectedGTINArrayWithItemNumber, 'PackLine7')));
      var countryofOriginGDSNList = _.map(_.uniq(_.map(mSelectedGTINArrayWithItemNumber, 'CountryofOriginGDSN')));
      var gradeList = _.map(_.uniq(_.map(mSelectedGTINArrayWithItemNumber, 'Grade')));
      this.setState({sDescriptions : _.map(_.uniq(_.map(mSelectedGTINArrayWithItemNumber,  function(obj){return obj.ItemNo+mItemNoDescSeperator+obj.Description})), function(item){return {"value":item}})});
      this.setState({sCommodityList : _.map(_.uniq(_.map(mSelectedGTINArrayWithItemNumber, 'Commodity')), function(item){return {"value":item}})});
      this.setState({sVarietyList : _.map(_.uniq(_.map(mSelectedGTINArrayWithItemNumber, 'Variety')), function(item){return {"value":item}})}, function(){

        if (mSelectedGTINArrayWithItemNumber.length > 0) {
          this.setState({sSelectedGTIN : GTINs[0]});
          this.setState({sSelectedPackLine7 : packLine7List[0]});
          this.setState({sSelectedCountryofOriginGDSN: countryofOriginGDSNList[0]});
          this.setState({sSelectedGrade : gradeList[0]});
          this.setState({sSelectedDesc: (this.state.sDescriptions)[0].value});
          this.setState({sSelectedCommodity:(this.state.sCommodityList)[0].value});
          this.setState({sSelectedVariety:(this.state.sVarietyList)[0].value}, function(){
            this.setCODE128BarCodeValue();
          });
        }
        else {
          this.setState({sSelectedGTIN : ''});
          this.setState({sSelectedPackLine7 : ''});
          this.setState({sSelectedCountryofOriginGDSN: ''});
          this.setState({sSelectedGrade : ''});
          this.setState({sSelectedDesc: ''});
          this.setState({sSelectedCommodity: ''});
          this.setState({sSelectedVariety: ''}, function(){
            this.setCODE128BarCodeValue();
          });
        }
      });

    });
  }

  onLotNumberChanged = (value) => {
    this.setState({sLotNumber: value.trim()}, function(){
      this.setCODE128BarCodeValue();
    });
  }

  onDateTypeChanged = (value) => {
    this.setState({sSelectedDateType: value}, function(){

      var labelValues = {[KEYS.DATE_TYPE]: this.state.sSelectedDateType};
      this.updateLabelPreview(labelValues);
    });
  }

  /*onDateFormatChanged = (value) => {
    var previousFormat = this.state.sSelectedDateFormat;

    this.setState({sSelectedDateFormat: value}, function(){
      this.setState({sSelectedDate: this.getFormatedDate( moment(this.state.sSelectedDate, previousFormat).toDate(), this.state.sSelectedDateFormat)}, function(){

        var labelValues = {[KEYS.DATE]: this.state.sSelectedDate};
        this.updateLabelPreview(labelValues);
      });
    });
  }*/

  onPrinterConnectionTypeChanged = (value) => {
    this.setState({sSelectedPrinterConnectionType:value}, function(){
      this.validatePrinterData();
    });
  }

  onMacAddressChanged = (value) => {
    this.setState({sMacAddress: value}, function(){
      this.validatePrinterData();
    });
  }

  onIPAddressChanged = (value) => {
    this.setState({sIpAddress: value}, function(){
      this.validatePrinterData();
    });
  }

  onPortChanged = (value) => {
    this.setState({sPort: value}, function(){
      this.validatePrinterData();
    });
  }

  validatePrinterData() {
    var isValid = false;
    if (this.state.sSelectedPrinterConnectionType == BLUETOOTH) {
      isValid = (this.state.sMacAddress.trim().length > 0) ? true : false;
    }
    else {
      isValid = (this.state.sIpAddress.trim().length > 0 && this.state.sPort.trim().length > 0) ? true : false;
    }

    this.setState({isPrinterDataEntered: isValid}, function(){
      this.validateForm();
    });
  }

  onQuantityToPrintChange = (text) => {
    this.setState({sQuantityToPrint: this.getNumberFromText(text)}, function(){
      this.validateForm();
    });
  }

  getNumberFromText(text){
    let newText = '';
    let numbers = '0123456789';

    for (var i = 0; i < text.length; i++) {
        if ( numbers.indexOf(text[i]) > -1 ) {
            newText = newText + text[i];
        }
    }
    return newText;
  }
  
  showDatePicker = async() => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: moment(this.state.sSelectedDate, this.state.sSelectedDateFormat).toDate()
      });

      if(action == DatePickerAndroid.dateSetAction) {          
        // Selected year, month (0-11), day
        
        this.setState({sSelectedDate: this.getFormatedDate(new Date(year, month, day), this.state.sSelectedDateFormat)});
        this.setState({sSelectedDateToLabel: this.getFormatedDate(new Date(year, month, day), mSelectedDateToLabelFormat).toUpperCase()}, function(){

          var labelValues = {[KEYS.DATE]: this.state.sSelectedDateToLabel};
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

      var labelValues = {[KEYS.BARCODE_VALUE]: this.state.sBarcodeValue,
                        [KEYS.GTIN_NUMBER_LBL]: this.state.sLabelGTINValueLbl,
                        [KEYS.LOT_NUMBER_LBL]: this.state.sLabelLotNumberLbl,
                        [KEYS.COMMODITY]: this.state.sSelectedCommodity,
                        [KEYS.VARIETY]: this.state.sSelectedVariety,
                        [KEYS.PACKLINE7]: this.state.sSelectedPackLine7,
                        [KEYS.DATE_TYPE]: this.state.sSelectedDateType,
                        [KEYS.COUNTRY_OF_ORIGIN]: this.state.sSelectedCountryofOriginGDSN,
                        [KEYS.GRADE]: this.state.sSelectedGrade,
                        [KEYS.DATE]: this.state.sSelectedDateToLabel
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
    if (this.state.sSelectedGTIN != '' && this.state.sSelectedDesc != '' && this.state.sSelectedCommodity != '' 
          && this.state.sSelectedVariety != '' && this.state.sLotNumber != '' && this.state.isPrinterDataEntered 
          && this.state.sQuantityToPrint != '' && Number(this.state.sQuantityToPrint) != 0) {
      this.setState({isFormInValid: false});
    }
    else {
      this.setState({isFormInValid: true});
    }
  }

  onPrintBtnClicked = () => {
    var isBluetooth = this.state.sSelectedPrinterConnectionType == BLUETOOTH;

    if (isBluetooth) {
      ZebraPrint.isBluetoothEnabled((isEnabled) => {
        if (isEnabled) {
          this.printTheLabel(isBluetooth);
        }
        else {
          ToastAndroid.show(Messages.bluetoothEnableErrorMsg, ToastAndroid.SHORT);
        }
      });
    }
    else {
      this.printTheLabel(isBluetooth);
    }
  }

  printTheLabel(isBluetooth) {
    //ZebraPrint.printLabel(false, '', '192.168.100.55', '9100');    
    ZebraPrint.printLabel(isBluetooth, this.state.sMacAddress, this.state.sIpAddress, this.state.sPort, this.state.sQuantityToPrint, (isPrintSuccess) => {

      console.log('isPrintSuccess '+isPrintSuccess);
      this.generateEventJSON();
    });
  }

  generateEventJSON() {
    var selectedGTIN = this.state.sSelectedGTIN;
    var filteredGTINArrayByGTIN = _.filter(mSelectedGTINArray, function(item){return item.GTIN == selectedGTIN});

    var newAttribute = _.merge({}, EventObj.PTIEvent.Attributes.Attribute, filteredGTINArrayByGTIN[0]);
    newAttribute.Lot = this.state.sLotNumber;
    newAttribute.GrowingRegion = this.state.sGrowingRegion;
    newAttribute.City = this.state.sCity;
    newAttribute.State = this.state.sState;
    newAttribute.PrintLabel = "4X2RPC";
    newAttribute.QuantityofLabelsPrinted = this.state.sQuantityToPrint;
    newAttribute[this.state.sSelectedDateType] = this.state.sSelectedDate;

    var finalEventObj = EventObj;
    finalEventObj.PTIEvent.Attributes.Attribute = newAttribute;

    finalEventObj.PTIEvent.Codes.devicename = 'Android';
    finalEventObj.PTIEvent.Codes.timestamp = new Date();
    finalEventObj.PTIEvent.Codes.value = '123412341234HM01';

    var date = new Date();
    finalEventObj.PTIEvent.EventTime = date;
    //finalEventObj.PTIEvent.EventTimeZoneOffset = date.getTimezoneOffset() / 60;
    finalEventObj.PTIEvent.ProcessTime = new Date();

    this.props.navigation.navigate("Event", {eventObj: finalEventObj});
  }

  //Start of Voice input 
  onSpeechStart(e) {
    
  }

  onSpeechRecognized(e) {
    
  }

  onSpeechEnd(e) {
    
  }

  onSpeechError(e) {
    var lengthOfExtraCode = 2 ;//Error code and '/' character comes in the message to remove that i am doing substring.
    var message = e.error.message;
    message = message.substr(lengthOfExtraCode);
    message = message+". "+Messages.tryAgain;

    this.showToastAndVoiceMessage(message);
  }
    
  onSpeechResults(e) {
    var results = e.value;
    var result;
    var dropDownResult;
    results = results.map(v => v.toLowerCase());
    console.log("Kumar results "+results);
    
    if (results.length > 0) {

      //Start of Print
      if(results.indexOf(printVoiceRegKey) > -1) {
        if (!this.state.isFormInValid) {
          this.onPrintBtnClicked();
        }
        else {
          Tts.speak(Messages.inValidLabelForm);
        }
        return;
      }
      //End of Print

      //Start of GTIN
      dropDownResult = this.getSpeechInputMatchWithVoiceKeyForDropDown(results, gtinVoiceRegKey, mGTINList, 'value');
      if (dropDownResult.isVoiceRecgKeyMatched) {
        if (dropDownResult.isMatchedDropdownValueFound) 
          this.onGTINItemSelected(dropDownResult.matchedDropdownValue);
        else
          Tts.speak(Messages.gtinNotFound);
        return;
      }
      //End of GTIN

      //Start of Description
      dropDownResult = this.getSpeechInputMatchWithVoiceKeyForDropDown(results, descriptionVoiceRegKey, this.state.sDescriptions, 'value');
      if (dropDownResult.isVoiceRecgKeyMatched) {
        if (dropDownResult.isMatchedDropdownValueFound)
          this.onDescriptionSelected(dropDownResult.matchedDropdownValue);
        else
          Tts.speak(Messages.descriptionNotFound);
        return;
      }
      //End of Description
      
      //Start of Commodity
      dropDownResult = this.getSpeechInputMatchWithVoiceKeyForDropDown(results, commodityVoiceRegKey, this.state.sCommodityList, 'value');
      if (dropDownResult.isVoiceRecgKeyMatched) {
        if (dropDownResult.isMatchedDropdownValueFound)
          this.onCommoditySelected(dropDownResult.matchedDropdownValue);
        else
          Tts.speak(Messages.commodityNotFound);
        return;
      }
      //End of Commodity

      //Start of Variety
      dropDownResult = this.getSpeechInputMatchWithVoiceKeyForDropDown(results, varietyVoiceRegKey, this.state.sVarietyList, 'value');
      if (dropDownResult.isVoiceRecgKeyMatched) {
        if (dropDownResult.isMatchedDropdownValueFound)
          this.onVarietySelected(dropDownResult.matchedDropdownValue);
        else
          Tts.speak(Messages.varietyNotFound);
        return;
      }
      //End of Variety

      //Start of Date
      dropDownResult = this.getSpeechInputMatchWithVoiceKeyForDropDown(results, dateVoiceRegKey, mDateTypeList, 'value');
      if (dropDownResult.isVoiceRecgKeyMatched) {
        if (dropDownResult.isMatchedDropdownValueFound)
          this.onDateTypeChanged(dropDownResult.matchedDropdownValue);
        else
          Tts.speak(Messages.datetypeNotFound);
        return;
      }
      //End of Date

      //Start of Printer
      dropDownResult = this.getSpeechInputMatchWithVoiceKeyForDropDown(results, printerVoiceRegKey, mRadioPrintConnectionTypes, 'label');
      if (dropDownResult.isVoiceRecgKeyMatched) {
        if (dropDownResult.isMatchedDropdownValueFound){
          if (dropDownResult.matchedDropdownValue == mRadioPrintConnectionTypes[0].label) {
            this.refs.printerConnectionType.updateIsActiveIndex(BLUETOOTH);
            this.onPrinterConnectionTypeChanged(BLUETOOTH);
          }
          else if (dropDownResult.matchedDropdownValue == mRadioPrintConnectionTypes[1].label) {
            this.refs.printerConnectionType.updateIsActiveIndex(IP_DNS);
            this.onPrinterConnectionTypeChanged(IP_DNS);
          }
        }
        else
          Tts.speak(Messages.printerConnectionTypeNotFound);
        return;
      }
      //End of Printer

      //Start of Lot Number
      result = this.getSpeechInputMatchWithVoiceKey(results, lotNumberVoiceRegKey);
      if (result) {
        this.onLotNumberChanged(this.capitalizeFirstLetter(result));
        return;
      }
      //End of Lot Number

      //Start of Growing Region
      result = this.getSpeechInputMatchWithVoiceKey(results, growingRegionVoiceRegKey);
      if (result) {
        this.setState({sGrowingRegion: this.capitalizeFirstLetter(result)});
        return;
      }
      //End of Growing Region

      //Start of City
      result = this.getSpeechInputMatchWithVoiceKey(results, cityVoiceRegKey);
      if (result) {
        this.setState({sCity: this.capitalizeFirstLetter(result)});
        return;
      }
      //End of City

      //Start of State
      result = this.getSpeechInputMatchWithVoiceKey(results, stateVoiceRegKey);
      if (result) {
        this.setState({sState: this.capitalizeFirstLetter(result)});
        return;
      }
      //End of State

      //Start of MAC address
      if (this.state.sSelectedPrinterConnectionType == BLUETOOTH){
        result = this.getSpeechInputMatchWithVoiceKey(results, macAddressVoiceRegKey);
        if (result) {
          this.onMacAddressChanged(result);
          return;
        }
      }
      //End of MAC address

      //Start of IP address
      if (this.state.sSelectedPrinterConnectionType == IP_DNS){
        result = this.getSpeechInputMatchWithVoiceKey(results, ipAddressVoiceRegKey);
        if (result) {
          this.onIPAddressChanged(result);
          return;
        }
      }
      //End of IP address

      //Start of Port
      if (this.state.sSelectedPrinterConnectionType == IP_DNS){
        result = this.getSpeechInputMatchWithVoiceKey(results, portVoiceRegKey);
        if (result) {
          this.onPortChanged(result);
          return;
        }
      }
      //End of Port

      //Start of Quantity to print
      result = this.getSpeechInputMatchWithVoiceKeyForNumber(results, quantityToPrintVoiceRegKey);
      if (result) {
        this.onQuantityToPrintChange(result);
        return;
      }
      //End of Quantity to print

      //Start of Item number
      result = this.getSpeechInputMatchWithVoiceKeyForNumber(results, itemNumberVoiceRegKey);
      if (result) {
        this.onItemNumberFilterChange(result);
        return;
      }
      //End of Item number      
      
      this.showToastAndVoiceMessage(Messages.tryAgainWithKeyword);
    }
  }

  showToastAndVoiceMessage(message){
    ToastAndroid.show(message, ToastAndroid.SHORT);
    Tts.speak(message);
  }
  
  onSpeechPartialResults(e) {
  }

  onSpeechVolumeChanged(e) {
  }

  async startRecognizing(e) {
    try {
      Tts.stop();
      await Voice.start(VOICE_LANGUAGE);
    } catch (e) {
      console.error(e);
    }
  }

  getSpeechInputMatchWithVoiceKeyForDropDown(googleResults, voiceRecgKey, dropDownList, dropDownListKey){
    var keyMatchedResults = this.getKeyMatchedResults(googleResults, voiceRecgKey);
    var resObj = {isVoiceRecgKeyMatched: false, isMatchedDropdownValueFound: false, matchedDropdownValue:''};
    if (keyMatchedResults.length > 0) {
      resObj.isVoiceRecgKeyMatched = true;
      var dropdownNamesInLowerCase = _.map(_.map(dropDownList, dropDownListKey), function(item){return item.toLowerCase().trim()})
      for(var i=0; i<keyMatchedResults.length; i++) {
        var firstMatchedResult = keyMatchedResults[i];
        var recognizedValue = firstMatchedResult.substr(firstMatchedResult.indexOf(voiceRecgKey)+voiceRecgKey.length).trim();
        const matchedValues = this.getKeyMatchedResults(dropdownNamesInLowerCase, recognizedValue);
        if (matchedValues.length > 0) {
          resObj.isMatchedDropdownValueFound = true;          
          var matchedValuesInRightCase = _.filter(_.map(dropDownList, dropDownListKey), function(item){ 
            if(item.toLowerCase().trim() == matchedValues[0])
              return item;
          });

          console.log('matchedValuesInRightCase '+matchedValuesInRightCase);
          resObj.matchedDropdownValue = matchedValuesInRightCase[0];
          break;
        }
      }
    }
    return resObj;
  }

  getSpeechInputMatchWithVoiceKey(googleResults, voiceRecgKey){
    var keyMatchedResults = this.getKeyMatchedResults(googleResults, voiceRecgKey);
    if (keyMatchedResults.length > 0) {
      var firstMatchedResult = keyMatchedResults[0];
      return firstMatchedResult.substr(firstMatchedResult.indexOf(voiceRecgKey)+voiceRecgKey.length);//returns result by removing voice key.
    }
  }

  getSpeechInputMatchWithVoiceKeyForNumber(googleResults, voiceRecgKey){
    var keyMatchedResults = this.getKeyMatchedResults(googleResults, voiceRecgKey);
      if (keyMatchedResults.length > 0) {
        var result;
        for(var i=0; i<keyMatchedResults.length; i++){
          var firstMatchedResult = keyMatchedResults[i];
          result = firstMatchedResult.substr(firstMatchedResult.indexOf(voiceRecgKey)+voiceRecgKey.length);
          if (!isNaN(Number(result.trim()))) {
            break;
          }
        }
        return result;
      }
  }
  
  getKeyMatchedResults(results, searchKey) {
    var matchedResults =[];
    if (results.length >0 && searchKey.trim().length >0) {
      matchedResults = _.filter(results, function(item) {
              return item.includes(searchKey);
            });
    }
    return matchedResults;
  }

  capitalizeFirstLetter(string) {
    string = string.trim();
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //End of Voice input
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  menuContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flex:0.9
  },
  contentViewColumn2:{
    flex:1.5,
    marginLeft:15
  },
  contentViewColumn3:{
    flex:0.9,
    marginLeft:15
  },
  textinput: {
    fontSize:18,
    color:'#000000'
  },
  rowView:{
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
   macAddress: "MAC Address",
   ipAddress: "IP Address",
   port:"Port",
   worker: "Worker:",
   labelPreview: "Label Preview:",
   quantityToPrint: "Quantity to Print",
   print:"PRINT"
 }
});