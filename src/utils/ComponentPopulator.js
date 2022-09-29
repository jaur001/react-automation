import { createCopy } from './JsonUtils';
import ReactAutomationException from './ReactAutomationException'

export default class ComponentPopulator {

  constructor(components,resources) {
    this.components = components;
    this.resources = resources;
  }

  populateComponents(json) {
    const jsonCopy = createCopy(json);
    const initialState = {};
    const getStateProp = (state) => {
      return state;
    }
    const MainComponent = this.populateComponent(jsonCopy,initialState,getStateProp);
    return [MainComponent,initialState];
  }

  populateComponent(json,stateProp,getStateProp) {
    this.validateComponent(json);
    if (json.requireRedux){
      stateProp[json.id] = json.initialValue ? json.initialValue : {};
      stateProp = stateProp[json.id];
      if (json.hasOwnProperty("props"))
        getStateProp = ComponentPopulator.populateGetterAndSetter(json,getStateProp);
    }
    if (json.hasOwnProperty("props")){
      const exceptions = json.exception?json.exception:[];
      this.checkJson(json.props, stateProp,getStateProp,exceptions);
    }
    return this.populatePropValue(json,json["Component"]);
  }

  validateComponent(json) {
    if (!json.hasOwnProperty("Component"))
      throw new ReactAutomationException("Missing 'Component' attribute!", "'Component' attribute is missing in json.");
  }

  getComponent(defaultProps,compName){
    const Component = this.components[compName]?this.components[compName]:compName;
    return function(extraProps){
      const props = {...defaultProps,...extraProps};
      const children = ComponentPopulator.getChildren(props.children)
      return <Component {...props}>{children}</Component>
    };
  }

  populatePropValue(json, propValue) {
    if (typeof propValue !== 'function'){
      if(this.resources.hasOwnProperty(propValue))
        return this.resources[propValue];
      else{
        return this.getComponent(json["props"],propValue)
      };
    }
    return propValue;
  }

  checkObject(obj,stateProp,getStateProp,exceptions) {
    if (Array.isArray(obj)) return this.checkJsonArray(obj, stateProp,getStateProp,exceptions);
    else if (ComponentPopulator.isComponent(obj)) return this.populateComponent(obj,stateProp,getStateProp);
    else return this.checkJson(obj,stateProp,getStateProp,exceptions);
  }

  checkJsonArray(jsonArray,stateProp,getStateProp,exceptions) {
    return jsonArray.map((item) => {
      if (typeof item === "object")
        return this.checkObject(item,stateProp,getStateProp,exceptions);
      return item;
    });
  }

  checkJson(json,stateProp,getStateProp,exceptions) {
    for (const prop in json) {
      const propValue = json[prop];
      if (typeof propValue === "object") json[prop] = this.checkObject(propValue,stateProp,getStateProp,exceptions);
      else if(this.matchComponentOrResource(propValue) && !exceptions.includes(prop))
        json[prop] = this.populatePropValue(json ,propValue);
    }
    return json;
  }

  matchComponentOrResource(propValue){
    return this.components.hasOwnProperty(propValue) ||
      this.resources.hasOwnProperty(propValue);
  }

  static getChildren(children){
    if(Array.isArray(children))
        return children.map((Component,index) => <Component key={index} />);
    return children;
  }

  static populateGetterAndSetter(json,getStateProp){
    const getStateParentProp = getStateProp;
    getStateProp = (state) => getStateParentProp(state)[json.id];
    json.props["setStateProp"] = (state,newValue) => getStateParentProp(state)[json.id] = newValue;
    json.props["getStateProp"] = getStateProp;
    return getStateProp;
  }

  static isComponent(json) {
    return json.hasOwnProperty("Component");
  }
}