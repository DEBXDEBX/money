"use strict";
// Used to access file system
let app = require("electron").remote;
let { dialog } = app;
let fs = require("fs");
const electron = require("electron");
const { ipcRenderer } = electron;
// Select form
let storeItem = document.querySelector("#storeItem");
let price = document.querySelector("#price");
let taxBox = document.querySelector("#taxInput");
// Select audio files
const addAudio = document.querySelector("#addAudio");
const addImageAudio = document.querySelector("#addImageAudio");
const deleteAudio = document.querySelector("#deleteAudio");
const warningEmptyAudio = document.querySelector("#warningEmptyAudio");
const warningSelectAudio = document.querySelector("#warningSelectAudio");
const warningNameTakenAudio = document.querySelector("#warningNameTakenAudio");
const tabAudio = document.querySelector("#tabAudio");
const btnAudio = document.querySelector("#btnAudio");
const cancelAudio = document.querySelector("#cancelAudio");
// Global variable's
// This is the Main array that holds all the year objects
const arrayOfYearObjs = [];
// create elements object
const el = new Elements();
// create display object
const display = new Display(el, $);
// create tax percent
let taxRate = 0.06;
// create year index
let yearIndex = -243;
// create month index
let monthIndex = -243;
// this is for the fontSize
let root = document.querySelector(":root");
// auto load heck box
let checkBox = document.querySelector("#autoLoad");
// temp hold for array
let settingsArrayContainer;
//The start of program exicution.
window.onload = function () {
  addDateToForm();
  startUp();
};

//startUp
function startUp() {
  //get data from settings obect
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();

  if (settings.type === "momMoney") {
    // set the holding array
    settingsArrayContainer = settings.filePathArray;
    // loadsettings
    applySettings(settings);
    // update Form
    display.showAutoLoadList(settingsArrayContainer);
    var x = document.querySelector("#autoLoad").checked;
    if (x === true) {
      if (settings.filePathArray) {
        autoLoadYearObjects(settings.filePathArray);
      }
    }
  }
}
//*************************************************** */
// Helper functions
//*************************************************** */
//
function addDateToForm() {
  let options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let date = new Date();

  document.querySelector("#date").value = date.toLocaleDateString();
}
//
function pushFileSettingsContainer(filePath) {
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  settingsArrayContainer.forEach((element) => {
    if (element === filePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    // warningNameTakenAudio.play();
    warningNameTakenAudio.play();
    display.showAlert("That file is already loaded!", "error");
    return;
  }

  // add it too tempHOld
  settingsArrayContainer.push(filePath);
}
//
function sortArrayByName(array) {
  array.sort(function (a, b) {
    var nameA = a.name.toUpperCase(); // ignore upper and lowercase
    var nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be eimagePathual
    return 0;
  }); //End sort function
}
//
function getRadioValue(form, name) {
  var val;
  // get list of radio buttons with specified name
  var radios = form.elements[name];
  // loop through list of radio buttons
  for (var i = 0, len = radios.length; i < len; i++) {
    if (radios[i].checked) {
      // radio checked?
      val = radios[i].value; // if so, hold its value in val
      break; // and break out of for loop
    }
  }
  return val; // return value of checked radio or undefined if none checked
}
//
function mapOutKey(key, array) {
  const newArray = array.map(function (item) {
    return item[key];
  });
  return newArray;
}
//
function autoLoadYearObjects(array) {
  array.forEach(function (item) {
    readFileContents(item);
  });
}
//
function readFileContents(filepath) {
  if (!filepath) {
    let message = "No file selected!";
    let msgType = "error";
    display.showAlert(message, msgType);
    return;
  }

  fs.readFile(filepath, "utf-8", (err, data) => {
    if (err) {
      let message = "An error occured reading the file!";
      let msgType = "error";
      display.showAlert(message, msgType);
      return;
    } else {
      try {
        data = JSON.parse(data);
      } catch {
        let message = "Can not parse data!";
        let msgType = "error";
        display.showAlert(message, msgType);
        return;
      }

      if (data) {
        if (data.fileType === "ElectronMomMoney2019September") {
          // set filepath: This is in case you moved your file
          data.fileNamePath = filepath;

          // check if the fileNamePath already exists if it does alert and return
          // make a variable to return
          let isTaken = false;
          arrayOfYearObjs.forEach((element) => {
            if (element.fileNamePath === data.fileNamePath) {
              isTaken = true;
            }
          });
          if (isTaken) {
            display.showAlert("That file is already loaded!", "error");
            // redisplay
            // get the names for all the years
            // and then send them to the Display
            display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
            return;
          }
          // create a file cab object
          let newYearObject = new YearObject(
            data.name,
            data.fileNamePath,
            data.arrayOfMonthObjects
          );
          // push the file cab obj into the array of file cabinets
          arrayOfYearObjs.push(newYearObject);
          sortArrayByName(arrayOfYearObjs);
          // write the file cab object to disk
          newYearObject.writeYearToHardDisk(fs);
          // redisplay
          // get the names for all the years
          // and then send them to the Display
          display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
          return;
        } else {
          let message =
            "This is not a valid ElectronMomMoney2019September file!";
          let msgType = "error";
          display.showAlert(message, msgType);
        }
      }
    }
  });
}
//
function loadUpSettingsForm() {
  let settingsStorage = new SettingsStorage();
  let settings = settingsStorage.getSettingsFromFile();
  settingsArrayContainer = settings.filePathArray;

  if (settings.type === "momMoney") {
    //set the tax rate text input
    document.querySelector("#taxRate").value = settings.taxRate;

    // set check box
    if (settings.autoLoad) {
      // check the box
      checkBox.checked = true;
    } else {
      // uncheck the box
      checkBox.checked = false;
    }

    // check the right font size
    switch (settings.fontSize) {
      case "x-small":
        document.querySelector("#x-small").checked = true;
        break;
      case "small":
        document.querySelector("#small").checked = true;
        break;
      case "normal":
        document.querySelector("#normal").checked = true;
        break;
      case "large":
        document.querySelector("#large").checked = true;
        break;
      case "x-large":
        document.querySelector("#x-large").checked = true;
        break;
      default:
        console.log("No valid font size");
    }
  }
  // update autoload form ul
  display.showAutoLoadList(settingsArrayContainer);
} // End loadUpSettingsForm()
//
function applySettings(settings) {
  if (settings.autoLoad === true) {
    document.querySelector("#autoLoad").checked = true;
  }
  // set tax variable
  taxRate = settings.taxRate;
  document.querySelector("#taxSpan").textContent = `${settings.taxRate}%`;

  switch (settings.fontSize) {
    case "x-small":
      root.style.fontSize = "10px";
      break;
    case "small":
      root.style.fontSize = "12px";
      break;
    case "normal":
      root.style.fontSize = "16px";
      break;
    case "large":
      root.style.fontSize = "20px";
      break;
    case "x-large":
      root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
} // End

// *************************************************************
//  IPC Code
// *************************************************************
// listen for index.js to show settings form
ipcRenderer.on("SettingsForm:show", (event) => {
  loadUpSettingsForm();
  display.showSettingsForm();
});

// listen for inedex.js to send data
ipcRenderer.on("Display:showAlert", (event, dataObj) => {
  display.showAlert(dataObj.message, dataObj.msgType);
}); // End ipcRenderer.on("Display:showAlert"

// listen for inedex.js to send data
ipcRenderer.on("year:add", (event, dataObj) => {
  if (!dataObj.fileNamePath) {
    display.showAlert("You did not enter a path!", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  if (dataObj.name === "") {
    display.showAlert("You did not enter a name for the Year!", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  if (isNaN(Number(dataObj.name))) {
    display.showAlert("You did not enter a number for the Year!", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  if (dataObj.fileNamePath === undefined) {
    display.showAlert("You clicked cancel!", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfYearObjs.forEach((element) => {
    if (element.fileNamePath === dataObj.fileNamePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    display.showAlert("That file is already loaded!", "error");
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
  sortArrayByName(arrayOfYearObjs);
  // write the year object to disk
  newYear.writeYearToHardDisk(fs);

  // redisplay
  // get the names for all the years
  // and then send them to the Display
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
});
// End ipcRenderer.on("year:add"********************

// listen for index.js to change font size
ipcRenderer.on("FontSize:change", (event, fontSize) => {
  switch (fontSize) {
    case "x-small":
      root.style.fontSize = "10px";
      break;
    case "small":
      root.style.fontSize = "12px";
      break;
    case "normal":
      root.style.fontSize = "16px";
      break;
    case "large":
      root.style.fontSize = "20px";
      break;
    case "x-large":
      root.style.fontSize = "24px";
      break;
    default:
      console.log("No valid font-size");
  }
}); // End ipcRenderer.on("FontSize:change"

// listen for inedex.js to send data
ipcRenderer.on("yearObj:load", (event, data) => {
  // check if the fileNamePath already exists if it does alert and return
  // make a variable to return
  let isTaken = false;
  arrayOfYearObjs.forEach((element) => {
    if (element.fileNamePath === data.fileNamePath) {
      isTaken = true;
    }
  });
  if (isTaken) {
    // warningNameTakenAudio.play();
    display.showAlert("That file is already loaded!", "error");
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
  // create a year object
  let newYear = new YearObject(
    data.name,
    data.fileNamePath,
    data.arrayOfMonthObjects
  );
  // push the year obj into the array of year Objects
  arrayOfYearObjs.push(newYear);
  sortArrayByName(arrayOfYearObjs);
  // write the year object to disk
  newYear.writeYearToHardDisk(fs);

  // redisplay
  // get the names for all the years
  // and then send them to the Display
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
  return;
});
//End ipcRenderer.on("year:load"*****************************
// ***********************************************************

// *************************************************************
//  End IPC Code
// *************************************************************
// *************************************************************
//  Year Code
// *************************************************************
el.yearList.addEventListener("click", (e) => {
  // event delegation
  if (e.target.classList.contains("year")) {
    let yearList = document.getElementsByClassName("year");
    // create an array from an array like object
    let newArray = Array.from(yearList);
    newArray.forEach((item) => {
      item.classList.remove("active");
    });
    // add active class
    e.target.classList.add("active");

    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);

    // Bug fix
    if (isNaN(index)) {
      //when you click out side of te tab
      // if it's not a number return
      return;
    }
    yearIndex = index;
    tabAudio.play();
    // get the array of months and send it to display
    display.paintMonthTabs(
      mapOutKey("name", arrayOfYearObjs[yearIndex].arrayOfMonthObjects)
    );
    return;
  } // End code to set the active class
}); // End el.yearList.addEventListener()
// *************************************************************
//  End Year Code
// *************************************************************
// *************************************************************
//  Month Code
// *************************************************************
el.monthList.addEventListener("click", (e) => {
  // event delegation
  if (e.target.classList.contains("month")) {
    let monthList = document.getElementsByClassName("month");
    // create an array from an array like object
    let newArray = Array.from(monthList);
    newArray.forEach((item) => {
      item.classList.remove("active");
    });
    // add active class
    e.target.classList.add("active");

    // get the index from the html
    let index = e.target.dataset.index;
    index = parseInt(index);

    // Bug fix
    if (isNaN(index)) {
      //when you click out side of te tab
      // if it's not a number return
      return;
    }

    monthIndex = index;
    tabAudio.play();
    // get the array of Transactions and send it to display
    display.paintTransactions(
      arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex]
        .arrayOfTransactions
    );
    return;
  } // End code to set the active class
});
// *************************************************************
//  End Month Code
// *************************************************************
// *************************************************************
//  Transaction Code
// *************************************************************
// Transaction UL
document.querySelector("#transactionList").addEventListener("click", (e) => {
  // get the index from the html
  let index = e.target.parentElement.parentElement.dataset.index;

  // Bug fix
  if (isNaN(index)) {
    //when you click out side of te tab
    // if it's not a number return
    return;
  }
  let deleteIndex = parseInt(index);
  // event delegation
  if (e.target.classList.contains("deleteTrans")) {
    if (!e.ctrlKey) {
      warningNameTakenAudio.play();
      display.showAlert(
        "Please hold down control and click on the trash can to delete!",
        "error"
      );
      return;
    }

    if (e.ctrlKey) {
      deleteAudio.play();
      display.showAlert("You deleted a transaction!", "success", 2500);
      // delete transaction
      arrayOfYearObjs[yearIndex].arrayOfMonthObjects[
        monthIndex
      ].arrayOfTransactions.splice(deleteIndex, 1);
      // save to disk
      arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs);
      // get the array of Transactions and send it to display
      display.paintTransactions(
        arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex]
          .arrayOfTransactions
      );
    }
  }
});
// transaction form clear Btn
document.querySelector("#clear").addEventListener("click", (e) => {
  btnAudio.play();
  storeItem.value = "";
  price.value = "";

  // set time out to focus
  window.setTimeout(function () {
    document.querySelector("#storeItem");
  }, 2000);
  return;
});
// transaction form add Btn
document.querySelector("#transactionBtn").addEventListener("click", (e) => {
  e.preventDefault();
  let date = document.querySelector("#date").value.trim();
  let storeItem = document.querySelector("#storeItem").value.trim();
  let price = document.querySelector("#price").value.trim();
  // set time out to focus
  window.setTimeout(function () {
    document.querySelector("#storeItem");
  }, 2000);
  if (date === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a date!", "error");
    return;
  }

  if (storeItem === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a store or item!", "error");
    return;
  }

  if (price === "") {
    warningEmptyAudio.play();
    display.showAlert("Please enter a price!", "error");
    return;
  }
  price = Number(price);

  if (isNaN(price)) {
    warningNameTakenAudio.play();
    display.showAlert("Please enter a number for the price!", "error");
    return;
  }
  let newTransaction;
  if (taxBox.checked) {
    // create transaction with tax
    let tax = price * taxRate;
    newTransaction = new Transaction(date, storeItem, price, tax);
    taxBox.checked = false;
  } else {
    // create transaction without tax
    newTransaction = new Transaction(date, storeItem, price);
  }
  display.showAlert("You added a transaction!", "success");
  addAudio.play();
  // push new transaction into array
  arrayOfYearObjs[yearIndex].arrayOfMonthObjects[
    monthIndex
  ].arrayOfTransactions.push(newTransaction);
  // save to disk
  arrayOfYearObjs[yearIndex].writeYearToHardDisk(fs);
  // get the array of Transactions and send it to display
  display.paintTransactions(
    arrayOfYearObjs[yearIndex].arrayOfMonthObjects[monthIndex]
      .arrayOfTransactions
  );
});
// *************************************************************
//  End Transaction Code
// *************************************************************
// ***********************************************************
// Settings Code
// *************************************************************
// when You click on save settings Btn
document.querySelector("#settingsSave").addEventListener("click", (e) => {
  e.preventDefault();

  // get form data to create a settings object
  // get the taxRate
  let taxRate = document.querySelector("#taxRate").value;
  taxRate = Number(taxRate);
  // fontsize radio code
  let fontSizeValue = getRadioValue(el.settingsForm, "fontSize");
  let settingsStorage = new SettingsStorage();
  let settingsObj = new SettingsObj();
  // set the object values
  settingsObj.taxRate = taxRate;
  settingsObj.fontSize = fontSizeValue;
  settingsObj.filePathArray = settingsArrayContainer;
  // set auto load true or false
  let y = document.querySelector("#autoLoad").checked;
  if (y === true) {
    settingsObj.autoLoad = true;
  } else {
    settingsObj.autoLoad = false;
  }
  // save the object
  settingsStorage.saveSettings(settingsObj);
  addAudio.play();
  // reset form
  el.settingsForm.reset();
  if (settingsObj.autoLoad) {
    // clear two arrays
    // setting the length to Zero emptys the array
    arrayOfYearObjs.length = 0;
    settingsArrayContainer.length = 0;
    display.displayNone(el.settingsForm);
    startUp();
  } else {
    // let settings = settingsStorage.getSettingsFromFile();
    applySettings(settingsObj);
    // hide form
    display.displayNone(el.settingsForm);
    // redisplay
    // get the names for all the years
    // and then send them to the Display
    display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
    return;
  }
}); // End

// when You click on settings form cancel Btn
document.querySelector("#settingsCancel").addEventListener("click", (e) => {
  cancelAudio.play();
  // hide form
  display.displayNone(el.settingsForm);
  // redisplay
  // get the names for all the years
  // and then send them to the Display
  display.paintYearTabs(mapOutKey("name", arrayOfYearObjs));
  return;
});

// when You click on settings form factory reset btn
document.querySelector("#factoryReset").addEventListener("click", (e) => {
  btnAudio.play();
  let settingsStorage = new SettingsStorage();
  settingsStorage.clearFileFromLocalStorage();
  loadUpSettingsForm();
});

// When You click on settings form add path to autoload Btn
document.querySelector("#settingsAddPath").addEventListener("click", (e) => {
  e.preventDefault();
  // this is for extsions
  let myOptions = {
    filters: [
      {
        name: "Custom File Type",
        extensions: ["deb"],
      },
    ],
    properties: ["openFile", "multiSelections"],
  };

  dialog.showOpenDialog(null, myOptions, (fileNames) => {
    if (fileNames === undefined || fileNames.length === 0) {
      display.showAlert("No file selected", "error");
    } else {
      // got file name
      for (let filePath of fileNames) {
        pushFileSettingsContainer(filePath);
      }
      addImageAudio.play();
      // update Form
      display.showAutoLoadList(settingsArrayContainer);
    }
  });
});

// when You click on x to delete a file path
document.querySelector("#autoLoadList").addEventListener("click", (e) => {
  e.preventDefault();
  // event delegation
  if (e.target.classList.contains("deleteFile")) {
    // this gets the data I embedded into the html
    let dataIndex = e.target.parentElement.parentElement.dataset.index;
    let deleteIndex = parseInt(dataIndex);
    // delete path
    settingsArrayContainer.splice(deleteIndex, 1);
    warningSelectAudio.play();
    // update Form
    display.showAutoLoadList(settingsArrayContainer);
  }
});
// *************************************************************
//  End Settings Code
// *************************************************************
