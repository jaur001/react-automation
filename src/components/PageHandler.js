import React from "react";
import { useState } from "react";
import PageLoader from "./PageLoader";
import PageReader from "../utils/PageReader";

function PageHandler(props) {
  const json = PageReader.getPages(props.path);
  const [currentPage,setCurrentPage] = useState(json.initialPage);

  const goToPage = {};
  Object.keys(json.pages).forEach(page => {
    goToPage[page] = ()=> {
      setCurrentPage(page);
    }
  });
  const resources = {
    ...goToPage,
    ...props.resources
  }
  return (
    <PageLoader
      path={json.pages[currentPage]}
      components={props.components}
      resources={resources}
      dispatch={props.dispatch}
    />
  );
}

export default PageHandler;
 