import {actions} from "./actions";

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