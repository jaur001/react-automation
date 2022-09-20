import React from 'react'
import PageReader from "../utils/PageReader";
import ComponentLoader from "./ComponentLoader";

function PageLoader(props) {
  const page = PageReader.getPage(props.path);
  return (
    <ComponentLoader
      page={page}
      components={props.components}
      resources={props.resources}
      dispatch={props.dispatch}
    />
  );
}

export default PageLoader;
