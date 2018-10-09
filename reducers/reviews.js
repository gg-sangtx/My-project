let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listReviews(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_REVIEWS_LIST':
      newState.data = action.reviews;
      return newState;
    case 'UPDATE_REVIEWS_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_REVIEWS_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'REVIEWS_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'REVIEWS_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_REVIEWS':
      return state.data.filter(item => item.id != action.reviewsId);
    default:
      return state;
  }
}

export { listReviews }