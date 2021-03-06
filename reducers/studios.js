let initialState = {
  data: [],
  dataSearch: {},
  goBack: false,
  pageData: 0
}

function listStudios(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_STUDIO_LIST':
      newState.data = action.studios;
      return newState;
    case 'UPDATE_STUDIO_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'UPDATE_STUDIO_PAGE':
      newState.pageData = action.pageData;
      return newState;
    case 'STUDIO_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'STUDIO_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_STUDIO':
      return state.data.filter(item => item.id != action.studioId);
    default:
      return state;
  }
}

export { listStudios }