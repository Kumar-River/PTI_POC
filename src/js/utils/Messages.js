import LocalizedStrings from 'react-native-localization';

let Messages = new LocalizedStrings({
 "en-US":{
   bluetoothEnableErrorMsg:"Unable to enable the Bluetooth on the device.",
   inValidLabelForm:"Please fill all the mandatory fields.",
   tryAgain:"Please try again.",
   tryAgainWithKeyword:"Please try again with the proper keyword. For example, commodity pepper.",
   gtinNotFound:"Specified gtin not found.",
   descriptionNotFound:"Specified description not found.",
   commodityNotFound:"Specified commodity not found.",
   varietyNotFound:"Specified variety not found.",
   datetypeNotFound:"Specified date type not found.",
   printerConnectionTypeNotFound:"Specified printer connection type not found."
 }
});

module.exports = Messages;