class Display {
  constructor(elements, $) {
    this.elements = elements;
    //JQuery
    this.$ = $;
    this.tabColorIndex = 0;
  } // End constructor

  // Method
  showAlert(message, className, displayTime = 4000) {
    // Create div
    const div = document.createElement("div");
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector("body");
    // Insert alert other element
    container.insertBefore(div, this.elements.nHeading);
    // Timeout after 4 sec
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, displayTime);
  } // End showAlert()

  //Method
  displayNone(element) {
    this.$(element).slideUp("slow");
  } // End displayNone(element)

  //Method
  displayBlock(element) {
    this.$(element).slideDown("slow");
  } // End displayBlock(element)

  //Method
  clearYearDisplay() {
    this.elements.yearList.innerHTML = "";
  } // End clearYearDisplay()

  //Method
  clearMonthDisplay() {
    this.elements.monthList.innerHTML = "";
  } // End clearYearDisplay()

  // Method
  paintYearTabs(mapedArray) {
    // this.clearFileCabDisplay();
    // this.clearPrimaryDisplay();
    // this.clearSubDisplay();
    // this.clearNoteDisplay();
    this.clearYearDisplay();
    // this.displayNone(this.elements.mfHeading);
    // this.displayNone(this.elements.sfHeading);
    // this.displayNone(this.elements.nHeading);
    // this.displayNone(this.elements.mainFolderForm);
    // this.displayNone(this.elements.subFolderForm);
    // this.displayNone(this.elements.noteForm);
    // this.displayNone(this.elements.renameFileCabForm);
    // this will paint all year tabs
    // make variable for html
    let html = "";
    mapedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="year">${element}</li>`;
    });
    // paint file cab tabs
    this.elements.yearList.innerHTML = html;
    // color tabs
    let tabList = document.getElementsByClassName("year");
    this.colorSetOfTabs(tabList);
  } // End paintFileCabTabs(mapedArray)

  // Method
  paintMonthTabs(mapedArray) {
    // this.clearFileCabDisplay();
    // this.clearPrimaryDisplay();
    // this.clearSubDisplay();
    // this.clearNoteDisplay();
    this.clearMonthDisplay();
    // this.displayNone(this.elements.mfHeading);
    // this.displayNone(this.elements.sfHeading);
    // this.displayNone(this.elements.nHeading);
    // this.displayNone(this.elements.mainFolderForm);
    // this.displayNone(this.elements.subFolderForm);
    // this.displayNone(this.elements.noteForm);
    // this.displayNone(this.elements.renameFileCabForm);
    // this will paint all year tabs
    // make variable for html
    let html = "";
    mapedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="month">${element}</li>`;
    });
    // paint file cab tabs
    this.elements.monthList.innerHTML = html;
    // color tabs
    let tabList = document.getElementsByClassName("month");
    this.colorSetOfTabs(tabList);
  } // End paintFileCabTabs(mapedArray)

  //Method
  colorSetOfTabs(tabList) {
    let tabColors = [
      "#2de11d",
      "#4848e8",
      "#e84d4d",
      "Orange",
      "Violet",
      "#820ee8",
      "#8e7fc7",
      "#ff008b",
      "#17abf5",
      "#4c69bd"
    ];
    // create an array from an array like object
    let newArray = Array.from(tabList);
    for (let i = 0; i < newArray.length; i++) {
      newArray[i].style.backgroundColor = tabColors[this.tabColorIndex];
      if (this.tabColorIndex === tabColors.length - 1) {
        this.tabColorIndex = 0;
      } else {
        this.tabColorIndex++;
      }
    }
  } // End colorSetOfTabs(tabList)
} // End Display class
