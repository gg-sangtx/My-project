let initialState = {
  loadData: false
}

function systemData(state = initialState, action) {
  let newState = {
    ...state
  };
  switch (action.type) {
    case 'UPDATE_SYSTEM_DATA':
      action.systemData.map((data, i) => {
        newState[data.key] = data.data;
      });
      return newState;
    case 'UPDATED_SYSTEM_DATA':
      newState.loadData = true;
      return newState;
    case 'UPDATE_SYSTEM_SUB_DATA':
      newState[action.key] = action.data;
      return newState;
    default:
      return state;
  }
}

export { systemData }
