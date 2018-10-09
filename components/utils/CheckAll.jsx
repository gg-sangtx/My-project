import React, {Component} from 'react';

class CheckAll {
  constructor() {
    this.store = {
      checkboxItems: [],
      checkboxControls: []
    }
  }

  resetCheckboxesState() {
    this.store = {
      checkboxItems: [],
      checkboxControls: []
    }
  }

  clearItems() {
    this.store.checkboxItems = [];
  }

  allItems() {
    return this.store.checkboxItems;
  }

  checkAll() {
    this.doCheck(true);
  }

  unCheckAll() {
    this.doCheck(false);
  }

  doCheck(checkAll) {
    this.store.checkboxItems.map(item => {
      item.isCheck = checkAll;
      item.callback(checkAll);
    });
  }

  registerCheckboxItem(key, data, isDefaultCheck, callback) {
    let foundItems = this.store.checkboxItems.filter(item => {
      return item.key == key;
    });

    if (foundItems.length > 0) {
      foundItems[0].data = data;
      foundItems[0].isCheck = isDefaultCheck;
      foundItems[0].callback = callback;
    } else {
      this.store.checkboxItems.push({
        key,
        data,
        isCheck: isDefaultCheck,
        callback
      });
    }
  }

  dispatch(action) {
    switch (action.type) {
      case "TOGGLE":
        this.handleCheckboxChange(action.key);
        break;
      case "TOGGLE_CHECKALL":
        this.doCheck(action.isCheckAll);
        break;
      case "RESET":
        this.resetCheckboxesState();
        break;
      case "REMOVE_ITEM":
        this.store.checkboxItems = this.store.checkboxItems.filter(item => {
          return item.key != action.key;
        });
        break;
    }
  }

  handleCheckboxChange(key) {
    let allCheck = true;

    let components = this.store.checkboxItems.map(item => {
      if (item.key == key) {
        item.isCheck = !item.isCheck
      }

      if (!item.isCheck) {
        allCheck = false;
      }
    });

    this.store.checkboxControls.map(func => {
      func(allCheck);
    });
  }

  getCheckedItems(checkStatus = true) {
    let components = this.store.checkboxItems.filter(item => {
      return item.isCheck == checkStatus;
    });
    return components;
  }

  addCheckAllControl(func) {
    this.store.checkboxControls.push(func);
  }
}

export default CheckAll;
