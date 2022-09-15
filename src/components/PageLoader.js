import React from 'react'
import PageReader from "../utils/PageReader";
import ComponentLoader from "./ComponentLoader";

function getId(parentId,id,suffixId){
  parentId = parentId ? parentId + "/" : "";
  suffixId = suffixId ? suffixId : "";
  return parentId + id + suffixId;
}

function prepareComponent(populatedComponents,compName){
  const Component = populatedComponents[compName];
  populatedComponents[compName] = (props) => {
    const id = getId(props.parentId,props.id,props.suffixId);
    return <Component key={id} id={id} {...props}>{props.children}</Component>;
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
