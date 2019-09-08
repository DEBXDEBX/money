class YearObject {
  constructor(name, fileNamePath, array = []) {
    this.name = name;
    this.fileNamePath = fileNamePath;
    this.arrayOfMonthObjects = array;
    this.fileType = "ElectronMomMoney2019September";
  }

  // Method
  writeYearToHardDisk(fs) {
    //Stringify the year Object
    let content = JSON.stringify(this);
    fs.writeFileSync(this.fileNamePath, content);
  } // writeYearToHardDisk(fs)
} // End YearObject class
