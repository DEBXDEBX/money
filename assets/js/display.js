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

  //Method
  clearTransactionDisplay() {
    this.elements.transactionList.innerHTML = "";
  }

  // Method
  paintYearTabs(mapedArray) {
    this.displayNone(this.elements.monthHeading);
    this.displayNone(this.elements.monthList);
    this.displayNone(this.elements.transactionHeading);
    this.displayNone(this.elements.transactionList);
    this.displayNone(this.elements.totalH1);
    this.displayNone(this.elements.myForm);
    this.clearYearDisplay();

    // this will paint all year tabs
    // make variable for html
    let html = "";
    mapedArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="year">${element}</li>`;
    });
    // paint year tabs
    this.elements.yearList.innerHTML = html;
    // color tabs
    let tabList = document.getElementsByClassName("year");
    this.colorSetOfTabs(tabList);
  } // End paintFileCabTabs(mapedArray)

  // Method
  paintMonthTabs(mapedArray) {
    this.clearMonthDisplay();
    this.clearTransactionDisplay();
    this.displayNone(this.elements.transactionHeading);
    this.displayNone(this.elements.transactionList);
    this.displayNone(this.elements.totalH1);
    this.displayNone(this.elements.monthList);
    this.displayBlock(this.elements.monthList);
    this.displayNone(this.elements.monthHeading);
    this.displayNone(this.elements.myForm);
    this.displayBlock(this.elements.monthHeading);
    console.log("painting month tabs");
    // this will paint all month tabs
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
  paintTransactions(transactionArray) {
    console.log("Printing transactions");
    this.clearTransactionDisplay();
    this.displayNone(this.elements.totalH1);
    this.displayNone(this.elements.myForm);
    this.displayNone(this.elements.transactionHeading);
    this.displayBlock(this.elements.totalH1);
    this.displayBlock(this.elements.transactionHeading);
    this.displayBlock(this.elements.myForm);
    // build div
    let totalPrice = 0;
    // make variable for html
    let html = "";
    transactionArray.forEach((transaction, index) => {
      html += `<li data-index="${index}" class="transaction"><h4>${
        transaction.date
      }</h4><h4>${transaction.storeItem}</h4><h4>${transaction.price}</h4><h4>${
        transaction.tax
      }</h4><h4>${(totalPrice += totalPrice)}</h4></li>`;
    });
    // paint transactions
    this.elements.transactionList.innerHTML = html;
    this.displayBlock(this.elements.transactionList);
    this.elements.totalH1.innerHTML = `Total = ${totalPrice}`;
    this.displayBlock(this.elements.totalH1);
  } // End paintTransactions(transactionArray)

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
