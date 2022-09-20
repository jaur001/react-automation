import React from 'react';
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
  }

  getComponent(id,defaultProps,compName){
    const Component = this.components[compName]?this.components[compName]:compName;
    return function(extraProps){
      const props = {...defaultProps,...extraProps};
      const fullId = ComponentPopulator.getComponentId(compName,props.parentId,id,props.suffixId);
      const children = ComponentPopulator.getChildren(props.children)
      return <Component key={fullId} id={fullId} {...props}>{children}</Component>
    };
  }

  populatePropValue(json, propValue) {
    if (typeof propValue !== 'function'){
      if(this.resources.hasOwnProperty(propValue))
        return this.resources[propValue];
      else{
        return this.getComponent(json["id"],json["props"],propValue)
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

  static getChildren(children){
    if(Array.isArray(children))
        return children.map((Component,index) => <Component key={index} />);
    return children;
  }

  static getComponentId(compName,parentId,id,suffixId){
    parentId = parentId ? parentId + "/" : "";
    suffixId = suffixId ? suffixId : "";
    id = id ? id : compName;
    return parentId + id + suffixId;
  }

  static isComponent(json) {
    return json.hasOwnProperty("Component");
  }
}