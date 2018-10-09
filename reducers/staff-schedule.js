let initialState = {
  dataSearch: {},
  goBack: false
}

function listStaffSchedule(state = initialState, action) {
  let newState = {
    ...state
  }
  switch (action.type) {
    case 'UPDATE_STAFF_SCHEDULE_SEARCH':
      newState.dataSearch = action.dataSearch;
      return newState;
    case 'STAFF_SCHEDULE_GO_BACK':
      newState.goBack = true;
      return newState;
    case 'STAFF_SCHEDULE_RESET_GO_BACK':
      newState.goBack = false;
      return newState;
    case 'REMOVE_STAFF_SCHEDULE':
      return state.data.filter(item => item.id != action.staffScheduleId);
    default:
      return state;
  }
}

export { listStaffSchedule }