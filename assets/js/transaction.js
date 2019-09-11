class Transaction {
  constructor(date, storeItem, price, tax = 0) {
    this.date = date;
    this.storeItem = storeItem;
    this.price = price;
    this.tax = tax;
  } // End constructor
} // End Transaction class
