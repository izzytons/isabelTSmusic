export function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
  
export function formatDate(date) {
return (
    [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    ].join('-') +
    'T' +
    [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
    ].join(':')
);
}

export function ConvertFromISO(date){
    var isoString = new Date(date).toISOString();
    var formattedString = isoString.split(".")[0];
    var newDate = new Date(formattedString);

    return newDate;
}

export function formatAMPM(date) {
var hours = date.getHours();
var minutes = date.getMinutes();
var ampm = hours >= 12 ? 'pm' : 'am';
hours = hours % 12;
hours = hours ? hours : 12; // the hour '0' should be '12'
minutes = minutes < 10 ? '0'+minutes : minutes;
var strTime = hours + ':' + minutes + ' ' + ampm;
return strTime;
}