class Transaction {
  constructor(date, storeItem, price, tax = 0) {
    this.date = date;
    this.storeItem = storeItem;
    this.price = price;
    this.tax = tax;
    this.subTotal = 0;
  } // End constructor
} // End Transaction class
