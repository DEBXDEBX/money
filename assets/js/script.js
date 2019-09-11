"use strict";
// webPreferences: true sets up the require in the script js file electron version 5.0.0 and above
// mainWindow = new BrowserWindow({
//   webPreferences: {
//     nodeIntegration: true
//   }
// });   index.js
// Used to access file system
let app = require("electron").remote;
let { dialog } = app;
let fs = require("fs");
const electron = require("electron");
const { ipcRenderer } = electron;
//Global variable's
// This is the Main array that holds all the year objects
const arrayOfYearObjs = [];
// create elements object
const el = new Elements();
// create display object
const display = new Display(el, $);
// create year index
let yearIndex = -243;
// create month index
let monthIndex = -243;
//*************************************************** */
// Helper functions
//*************************************************** */
function mapOutKey(key, array) {
  const newArray = array.map(function(item) {
    return item[key];
  });
  return newArray;
}
//************************************************ */
// IPC
//************************************************ */
// listen for inedex.js to send data
ipcRenderer.on("year:add", (event, dataObj) => {
  if (dataObj.name === "") {
    display.showAlert("You did not enter a name for the Year!", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  if (dataObj.fileNamePath === undefined) {
    display.showAlert("You clicked cancel", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfYearObjs.forEach(element => {
    if (element.fileNamePath === dataObj.fileNamePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    display.showAlert("That file is already loaded", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // create a year object
  let newYear = new YearObject(dataObj.name, dataObj.fileNamePath);
  // create the 12 months
  let January = new MonthObject("January");
  newYear.arrayOfMonthObjects.push(January);
  let February = new MonthObject("February");
  newYear.arrayOfMonthObjects.push(February);
  let March = new MonthObject("March");
  newYear.arrayOfMonthObjects.push(March);
  let April = new MonthObject("April");
  newYear.arrayOfMonthObjects.push(April);
  let May = new MonthObject("May");
  newYear.arrayOfMonthObjects.push(May);
  let June = new MonthObject("June");
  newYear.arrayOfMonthObjects.push(June);
  let July = new MonthObject("July");
  newYear.arrayOfMonthObjects.push(July);
  let August = new MonthObject("August");
  newYear.arrayOfMonthObjects.push(August);
  let September = new MonthObject("September");
  newYear.arrayOfMonthObjects.push(September);
  let October = new MonthObject("October");
  newYear.arrayOfMonthObjects.push(October);
  let November = new MonthObject("November");
  newYear.arrayOfMonthObjects.push(November);
  let December = new MonthObject("December");
  newYear.arrayOfMonthObjects.push(December);
  // push the year obj into the array of year objects
  arrayOfYearObjs.push(newYear);
  // write the year object to disk
  newYear.writeYearToHardDisk(fs);

  // redisplay
  // get the names for all the years
  // and then send them to the Display
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
});
// End ipcRenderer.on("year:add"********************
//*************************************************** */

el.yearList.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("year")) {
    // set's the current target active
    e.target.classList.add("active");
    //The Next code is to set the current tab color white with the active class
    var el = document.querySelectorAll(".year");
    for (let i = 0; i < el.length; i++) {
      el[i].onclick = function() {
        var c = 0;
        while (c < el.length) {
          el[c++].className = "year";
        }
        el[i].className = "year active";
      };
    }
  } // End code to set the active class

  // get the index from the html
  let index = e.target.dataset.index;
  index = parseInt(index);
  yearIndex = index;

  // get the array of months and send it to display
  display.paintMonthTabs(
    mapOutKey("name", arrayOfYearObjs[yearIndex].arrayOfMonthObjects)
  );
}); // End el.yearList.addEventListener()

el.monthList.addEventListener("click", e => {
  // event delegation
  if (e.target.classList.contains("month")) {
    // set's the current target active
    e.target.classList.add("active");
    //The Next code is to set the current tab color white with the active class
    var el = document.querySelectorAll(".month");
    for (let i = 0; i < el.length; i++) {
      el[i].onclick = function() {
        var c = 0;
        while (c < el.length) {
          el[c++].className = "month";
        }
        el[i].className = "month active";
      };
    }
  } // End code to set the active class

  // get the index from the html
  let index = e.target.dataset.index;
  index = parseInt(index);
  monthIndex = index;

  // get the array of Transactions and send it to display
  display.paintTransactions(
    arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex]
      .arrayOfTransactions
  );
});
