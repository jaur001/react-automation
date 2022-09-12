import React from 'react'
import ComponentPopulator from "../utils/ComponentPopulator";
import StateController from "../redux/StateController";
import { useEffect, useMemo, useState } from "react";

function populateComponents(pageStructure,components,resources) {
  const populatedPageStructure = {...pageStructure};
  const newState = new ComponentPopulator(components,resources).populateComponents(populatedPageStructure);
  return [newState, populatedPageStructure];
}

function reduxIsRequired(newState){
  return Object.keys(newState).length >0;
}

function ComponentLoader(props) {
  const [reduxLoaded,setReduxLoaded] = useState(false);
  const [newState, pageStructure] = useMemo(
    () => {
      return populateComponents(props.pageStructure,props.components,props.resources);
    },
    [props]
  );
  useEffect(() => {
    if(reduxIsRequired(newState) && !reduxLoaded){
      StateController.populateState(newState,props.dispatch);
      setReduxLoaded(true);
    }
  }, [props, newState, reduxLoaded]);
  if (!reduxLoaded) return <React.Fragment/>;
  return pageStructure.render();
}
export default ComponentLoader;