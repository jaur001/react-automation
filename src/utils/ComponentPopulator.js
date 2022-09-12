import ReactAutomationException from './ReactAutomationException'

export default class ComponentPopulator {

  constructor(components,resources) {
    this.components = components;
    this.resources = resources;
  }

  populateComponents(json) {
    const state = {};
    this.populateComponent(json,state);
    return state;
  }

  populateComponent(json, stateProp) {
    if (!json.hasOwnProperty("render")) throw new ReactAutomationException("Missing 'render' attribute!", "'render' attribute is missing in json.");
      this.populatePropValue(json, "render",json["render"]);
    if (json.requireRedux){
      stateProp[json.id] = json.initialValue ? json.initialValue : {};
      stateProp = stateProp[json.id];
    }
    if (json.hasOwnProperty("props")){
      const exceptions = json["exception"]?json["exception"]:[];
      this.checkJson(json["props"], stateProp,exceptions);
    }
  }

  populatePropValue(json, prop, propValue) {
    if (typeof propValue !== 'function'){
      if(this.components.hasOwnProperty(propValue))
        this.addRender(json,prop,propValue);
      else{
        const resource = this.resources[propValue];
        json[prop] = resource;
      };
    }
  }

  addRender(json,prop,propValue){
    const render = this.components[propValue];
    json[prop] = (parentId, suffixId, extraProps) => {
      return render(json, parentId, suffixId, extraProps);
    };
  }

  checkObject(obj, stateProp,exceptions) {
    if (Array.isArray(obj)) this.checkJsonArray(obj, stateProp,exceptions);
    else if (ComponentPopulator.isComponent(obj)) this.populateComponent(obj, stateProp);
    else this.checkJson(obj,stateProp,exceptions);
  }

  checkJsonArray(jsonArray,stateProp,exceptions) {
    jsonArray.forEach((prop) => {
      if (typeof prop === "object") this.checkObject(prop,stateProp,exceptions);
    });
  }

  checkJson(json,stateProp,exceptions) {
    for (const prop in json) {
      const propValue = json[prop];
      if (typeof propValue === "object") this.checkObject(propValue,stateProp,exceptions);
      else if(this.matchComponentOrResource(propValue) && !exceptions.includes(prop))
        this.populatePropValue(json, prop ,propValue);
    }
  }

  matchComponentOrResource(propValue){
    return this.components.hasOwnProperty(propValue) ||
      this.resources.hasOwnProperty(propValue);
  }

  static isComponent(json) {
    return json.hasOwnProperty("render");
  }
}