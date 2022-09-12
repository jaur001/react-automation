import { actionNames } from "./actions";

export default class StateController {

  static populateState(newState,dispatch){
    dispatch({
      type: actionNames.populateState,
      newState: newState,
    });
  }
  static getProperty(id, state){
    const [prop,compId] = StateController.#searchProperty(id,state);
    return prop[compId];
  }
  static updateProperty(id,value,dispatch){
    const callback = (newState)=>{
      const [prop,compId] = StateController.#searchProperty(id,newState);
      prop[compId] = value;
      return newState;
    }
    dispatch({
      type: actionNames.updateProperty,
      callback: callback
    });
  }
  static #searchProperty(id,state){
    const path = id.split("/");
    const parentId = path.slice(0,path.length-1);
    const compId = path[path.length-1];
    let prop = state;
    parentId.forEach(key => {
      if(prop.hasOwnProperty(key)) prop = prop[key];
    });
    return [prop,compId];
  }  
}