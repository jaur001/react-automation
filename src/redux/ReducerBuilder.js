export default class ReducerBuilder{
  static buildReducer(extraActions){
    const actionList = {
      ...actions,
      ...extraActions
    }
    return (state = null, action) => {
      if(actionList.hasOwnProperty(action.type))
        return actionList[action.type](state,action);
      return state;
    };
  }
}

export const actions = {
  setProperty: (state, action) => {
    const newState = { ...state };
    action.setStateProp(newState,action.value);
    return newState;
  },
  populateState: (state,action) => {
    return action.newState;
  }
}