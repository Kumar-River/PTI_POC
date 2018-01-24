import LocalizedStrings from 'react-native-localization';

let Messages = new LocalizedStrings({
 "en-US":{
   bluetoothEnableErrorMsg:"Unable to enable the Bluetooth on the device.",
   inValidLabelForm:"Please fill all the mandatory fields.",
   tryAgain:"Please try again.",
   tryAgainWithKeyword:"Please try again with the proper keyword. For example, commodity pepper.",
   gtinNotFound:"Specified global trade item number is not found.",
   descriptionNotFound:"Specified description is not found.",
   commodityNotFound:"Specified commodity is not found.",
   varietyNotFound:"Specified variety is not found.",
   datetypeNotFound:"Specified date type is not found.",
   printerConnectionTypeNotFound:"Specified printer connection type is not found."
 }
});

module.exports = Messages;