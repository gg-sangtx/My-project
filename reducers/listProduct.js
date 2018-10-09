let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listProduct(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_PRODUCT_LIST':
      newState.data = action.products;
      return newState;
    case 'UPDATE_PRODUCT_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_PRODUCT_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'PRODUCT_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'PRODUCT_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_PRODUCT':
      return state.data.filter(item => item.id != action.productId);
    default:
      return state;
  }
}

export { listProduct }