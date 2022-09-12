import React from 'react'
import PageReader from "../utils/PageReader";
import ComponentLoader from "./ComponentLoader";

function prepareComponent(populatedComponents,compName){
  const Component = populatedComponents[compName];
    populatedComponents[compName] = (comp, parentId, suffixId, extraProps) => {
      parentId = parentId ? parentId + "/" : "";
      suffixId = suffixId ? suffixId : "";
      const key = parentId + comp.id + suffixId;
      return <Component key={key} id={key} {...comp.props} {...extraProps} />;
    };
}

function prepareComponents(components) {
  const populatedComponents = {...components};
  for (const compName in populatedComponents) {
    prepareComponent(populatedComponents,compName)
  }
  return populatedComponents;
}

function PageLoader(props) {
  const pageStructure = PageReader.getPageStructure(props.path);
  const components = prepareComponents(props.components);
  return (
    <ComponentLoader
      pageStructure={pageStructure}
      components={components}
      resources={props.resources}
      dispatch={props.dispatch}
    />
  );
}

export default PageLoader;
