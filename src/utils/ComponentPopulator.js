import React from 'react'
import { createCopy } from './JsonUtils';
import ReactAutomationException from './ReactAutomationException'

export default class ComponentPopulator {

  constructor(components,resources) {
    this.components = components;
    this.resources = resources;
  }

  populateComponents(json) {
    const jsonCopy = createCopy(json);
    const state = {};
    const MainComponent = this.populateComponent(jsonCopy,state);
    return [MainComponent,state];
  }

  populateComponent(json, stateProp) {
    this.validateComponent(json);
    if (json.requireRedux){
      stateProp[json.id] = json.initialValue ? json.initialValue : {};
      stateProp = stateProp[json.id];
    }
    if (json.hasOwnProperty("props")){
      const exceptions = json["exception"]?json["exception"]:[];
      this.checkJson(json["props"], stateProp,exceptions);
    }
    return this.populatePropValue(json,json["Component"]);
  }

  validateComponent(json) {
    if (!json.hasOwnProperty("Component"))
      throw new ReactAutomationException("Missing 'Component' attribute!", "'Component' attribute is missing in json.");
    if (!this.components.hasOwnProperty(json["Component"]))
      throw new ReactAutomationException("Component does not exist!", "The component provided does not exist or was not provided to the PageLoader");
  }

  getComponent(id,defaultProps,compName){
    const Component = this.components[compName];
    return function(extraProps){
      const props = {...defaultProps,...extraProps}
      return <Component id={id} {...props}/>
    };
  }

  populatePropValue(json, propValue) {
    if (typeof propValue !== 'function'){
      if(this.components.hasOwnProperty(propValue))
        return this.getComponent(json["id"],json["props"],propValue)
      else{
        return this.resources[propValue];
      };
    }
    return propValue;
  }

  checkObject(obj, stateProp,exceptions) {
    if (Array.isArray(obj)) return this.checkJsonArray(obj, stateProp,exceptions);
    else if (ComponentPopulator.isComponent(obj)) return this.populateComponent(obj, stateProp);
    else return this.checkJson(obj,stateProp,exceptions);
  }

  checkJsonArray(jsonArray,stateProp,exceptions) {
    return jsonArray.map((item) => {
      if (typeof item === "object")
        return this.checkObject(item,stateProp,exceptions);
      return item;
    });
  }

  checkJson(json,stateProp,exceptions) {
    for (const prop in json) {
      const propValue = json[prop];
      if (typeof propValue === "object") json[prop] = this.checkObject(propValue,stateProp,exceptions);
      else if(this.matchComponentOrResource(propValue) && !exceptions.includes(prop))
        json[prop] = this.populatePropValue(json ,propValue);
    }
    return json;
  }

  matchComponentOrResource(propValue){
    return this.components.hasOwnProperty(propValue) ||
      this.resources.hasOwnProperty(propValue);
  }

  static isComponent(json) {
    return json.hasOwnProperty("Component");
  }
}