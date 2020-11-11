class Elements {
  constructor() {
    // select the lists
    this.yearList = document.querySelector("#yearList");
    this.monthList = document.querySelector("#monthList");
    this.transactionList = document.querySelector("#transactionList");
    this.autoLoadList = document.querySelector("#autoLoadList");
    // select headings
    this.yearHeading = document.querySelector("#yearHeading");
    this.monthHeading = document.querySelector("#monthHeading");
    this.transactionHeading = document.querySelector("#transactionHeading");
    // total h1
    this.topTotalDiv = document.querySelector("#topTotalDiv");
    this.bottomTotalDiv = document.querySelector("#bottomTotalDiv");
    // forms
    this.myForm = document.querySelector("#myForm");
    this.settingsForm = document.querySelector("#settingsForm");
    // select message display
    this.messageDisplay = document.querySelector("#displayMessage");
    // select message border
    this.messageBorder = document.querySelector("#modalBorder");
    // select btn's
    this.transactionSubmitBtn = document.querySelector("#transactionSubmitBtn");
    this.transactionClearBtn = document.querySelector("#transactionClearBtn");
    this.saveSettingsSubmitBtn = document.querySelector(
      "#saveSettingsSubmitBtn"
    );
    this.settingsCancelBtn = document.querySelector("#settingsCancelBtn");
    this.factoryResetBtn = document.querySelector("#factoryResetBtn");
    this.settingsAddPathBtn = document.querySelector("#settingsAddPathBtn");
    this.autoLoadCheckBox = document.querySelector("#autoLoadCheckBox");
    // Input's
    this.storeItemInput = document.querySelector("#storeItemInput");
    this.priceInput = document.querySelector("#priceInput");
    this.taxInputCheckBox = document.querySelector("#taxInputCheckBox");
    this.taxRateInput = document.querySelector("#taxRateInput");
    this.dateInput = document.querySelector("#dateInput");
    this.xSmallRadio = document.querySelector("#xSmallRadio");
    this.smallRadio = document.querySelector("#smallRadio");
    this.normalRadio = document.querySelector("#normalRadio");
    this.largeRadio = document.querySelector("#largeRadio");
    this.xLargeRadio = document.querySelector("#xLargeRadio");
    this.taxSpan = document.querySelector("#taxSpan");
    this.root = document.querySelector(":root");
  } // End constructor
} // End Elements class
