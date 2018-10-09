let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listNews(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_NEWS_LIST':
      newState.data = action.news;
      return newState;
    case 'UPDATE_NEWS_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_NEWS_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'NEWS_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'NEWS_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_NEWS':
      return state.data.filter(item => item.id != action.newsId);
    default:
      return state;
  }
}

export { listNews }