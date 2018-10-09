let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listFAQ(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_FAQ_LIST':
      newState.data = action.faqs;
      return newState;
    case 'UPDATE_FAQ_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_FAQ_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'FAQ_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'FAQ_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_FAQ':
      return state.data.filter(item => item.id != action.faqId);
    default:
      return state;
  }
}

export { listFAQ }