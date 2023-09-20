window.onload = function(){
    var date = new Date();
    var month_names = ['January', 'February', 
                     'March', 'April', 'May',
                     'June', 'July', 'August',
                     'September', 'October', 'November',
                     'December']
    var current_month = date.getMonth(); //gets index values for month_names
    var current_year = date.getFullYear();
    var first_date = month_names[current_month] + " " + 1 + " " + current_year;
    var beginning_day = new Date(first_date).toDateString();
    var beginning_day = beginning_day.substring(0, 3); //gets day of the week that began the month
    var day_names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var day_num = day_names.indexOf(beginning_day);
    var days = new Date(current_year, current_month+1, 0)
}