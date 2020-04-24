class Elements {
  constructor() {
    // select the lists
    this.yearList = document.querySelector("#yearList");
    this.monthList = document.querySelector("#monthList");
    this.transactionList = document.querySelector("#transactionList");
    // select headings
    this.yearHeading = document.querySelector("#yearHeading");
    this.monthHeading = document.querySelector("#monthHeading");
    this.transactionHeading = document.querySelector("#transactionHeading");
    // total h1
    this.topTotalDiv = document.querySelector("#topTotalDiv");
    this.bottomTotalDiv = document.querySelector("#bottomTotalDiv");
    // // select forms
    this.myForm = document.querySelector("#myForm");
    this.settingsForm = document.querySelector("#settingsForm");
    // select message display
    this.messageDisplay = document.querySelector("#displayMessage");
    // // select the autoload list
    this.autoLoadList = document.querySelector("#autoLoadList");
  } // End constructor
} // End Elements class
