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
    container.insertBefore(div, this.elements.myForm);
    // container.insertBefore(div, this.elements.transactionHeading);
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
    this.displayNone(this.elements.topTotalDiv);
    this.displayNone(this.elements.bottomTotalDiv);
    this.displayNone(this.elements.monthHeading);
    this.displayNone(this.elements.monthList);
    this.displayNone(this.elements.transactionHeading);
    this.displayNone(this.elements.transactionList);
    this.displayNone(this.elements.totalH1);
    this.displayNone(this.elements.myForm);
    this.displayBlock(this.elements.yearHeading);
    this.displayBlock(this.elements.yearList);
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
    this.displayNone(this.elements.topTotalDiv);
    this.displayNone(this.elements.bottomTotalDiv);
    this.displayNone(this.elements.transactionHeading);
    this.displayNone(this.elements.transactionList);
    this.displayNone(this.elements.totalH1);
    this.displayNone(this.elements.monthList);
    this.displayBlock(this.elements.monthList);
    this.displayNone(this.elements.monthHeading);
    this.displayNone(this.elements.myForm);
    this.displayBlock(this.elements.monthHeading);

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
    this.clearTransactionDisplay();
    this.displayNone(this.elements.topTotalDiv);
    this.displayNone(this.elements.bottomTotalDiv);
    this.displayNone(this.elements.myForm);
    this.displayNone(this.elements.transactionList);
    this.displayNone(this.elements.transactionHeading);
    this.displayBlock(this.elements.totalH1);
    this.displayBlock(this.elements.transactionHeading);
    this.displayBlock(this.elements.myForm);
    // build div
    let totalPrice = 0;
    //set subTotal and total
    transactionArray.forEach(transaction => {
      totalPrice = totalPrice + transaction.price + transaction.tax;
      totalPrice = totalPrice;
      transaction.subTotal = totalPrice;
    });
    // make variable for html
    let html = "";
    transactionArray.forEach((transaction, index) => {
      if (transaction.price <= 0) {
        html += `<li data-index="${index}" class="transaction red"><span title='Delete'><i class="fas fa-trash-alt deleteTrans"></i></span><h4>${
          transaction.date
        }</h4><h4>${
          transaction.storeItem
        }</h4><h4>Price: $${transaction.price.toFixed(
          2
        )}</h4><h4>Tax: $${transaction.tax.toFixed(
          2
        )}</h4><h4>$${transaction.subTotal.toFixed(2)}</h4></li>`;
      } else {
        html += `<li data-index="${index}" class="transaction"><span title='Delete'><i class="fas fa-trash-alt deleteTrans"></i></span><h4>${
          transaction.date
        }</h4><h4>${
          transaction.storeItem
        }</h4><h4>Price: $${transaction.price.toFixed(
          2
        )}</h4><h4>Tax: $${transaction.tax.toFixed(
          2
        )}</h4><h4>$${transaction.subTotal.toFixed(2)}</h4></li>`;
      }
    });
    // paint transactions
    this.elements.transactionList.innerHTML = html;
    this.displayBlock(this.elements.transactionList);
    let totalHtml = "";
    if (totalPrice <= 0) {
      totalHtml = `<h1 class = "red" >$${totalPrice.toFixed(2)}</h1>`;
    } else {
      totalHtml = `<h1 class = "normal" >$${totalPrice.toFixed(2)}</h1>`;
    }
    this.elements.topTotalDiv.innerHTML = totalHtml;

    this.elements.bottomTotalDiv.innerHTML = totalHtml;
    this.displayBlock(this.elements.topTotalDiv);
    this.displayBlock(this.elements.bottomTotalDiv);
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

  //Method
  hideSettingsForm() {
    this.displayNone(this.elements.settingsForm);
  }
  //Method
  showSettingsForm() {
    //  hide everything
    this.displayNone(this.elements.topTotalDiv);
    this.displayNone(this.elements.bottomTotalDiv);
    this.displayNone(this.elements.yearList);
    this.displayNone(this.elements.monthList);
    this.displayNone(this.elements.transactionList);
    this.displayNone(this.elements.monthHeading);
    this.displayNone(this.elements.totalH1);
    this.displayNone(this.elements.transactionHeading);
    this.displayNone(this.elements.myForm);
    this.displayNone(this.elements.yearHeading);
    //show settings form
    this.displayBlock(this.elements.settingsForm);
  } // End showSettingsForm()

  //Method
  clearAutoLoadUL() {
    // clear the ul
    this.elements.autoLoadList.innerHTML = "";
  } // End clearAutoLoadUL()

  //Method
  showAutoLoadList(autoLoadArray) {
    // clear the ul
    this.clearAutoLoadUL();
    // make variable for html
    let html = "";
    autoLoadArray.forEach((element, index) => {
      html += `<li data-index="${index}" class="autoLoad"><span title='Delete'><i class="fas fa-trash-alt deleteFile"></i></span>${element}</li>`;
    });
    this.elements.autoLoadList.innerHTML = html;
  }
} // End Display class
