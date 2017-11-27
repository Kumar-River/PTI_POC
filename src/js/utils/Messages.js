import LocalizedStrings from 'react-native-localization';

let Messages = new LocalizedStrings({
 "en-US":{
   invalidEmail:"Please enter valid email.",
   enterPassword:"Please enter password.",
   selectCountry:"Please select country.",
   noNetwork:"Please check your internet connection."
 }
});

module.exports = Messages;