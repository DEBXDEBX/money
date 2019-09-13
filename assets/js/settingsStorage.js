class SettingsStorage {
  constructor() {
    this.fileName = "fileCabSettings8132019DEBX";
  } // End constructor

  //Method
  saveSettings(obj) {
    let myJSON = JSON.stringify(obj);
    localStorage.setItem(this.fileName, myJSON);
  } // End saveSettings(obj)

  // Method
  getSettingsFromFile() {
    //Make a variable for obj
    let obj;
    // Read file
    let textFromFile = localStorage.getItem(this.fileName);

    if (textFromFile) {
      //parse file
      obj = JSON.parse(textFromFile);
    } else {
      obj = new SettingsObj();
    }
    // return obj
    return obj;
  } // End  getSettingsFromFile()

  //Method
  clearFileFromLocalStorage() {
    localStorage.removeItem(this.fileName);
  } // End clearFileFromLocalStorage()
} //End SettingsStorage class
