class YearObject {
  constructor(name, fileNamePath, array = []) {
    this.name = name;
    this.fileNamePath = fileNamePath;
    this.arrayOfMonthObjects = array;
    this.fileType = "ElectronMomMoney2019September";
  }

  // Method
  writeYearToHardDisk(fs, display) {
    try {
      // throw error("force an error");
      //Stringify the file cab Object
      const content = JSON.stringify(this);
      fs.writeFileSync(this.fileNamePath, content);
    } catch (err) {
      setTimeout(() => {
        display.showAlert(`Error writing file. ${err}`, "error", 5000);
      }, 5000);
    }
  } // writeYearToHardDisk(fs)
} // End YearObject class
