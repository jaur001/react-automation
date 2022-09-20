import React from 'react'
import ComponentPopulator from "../utils/ComponentPopulator";
import StateController from "../redux/StateController";
import { useEffect, useMemo, useState } from "react";

function populateComponents(page,components,resources) {
  return new ComponentPopulator(components,resources).populateComponents(page);
}

function reduxIsRequired(state){
  return Object.keys(state).length >0;
}

function ComponentLoader(props) {
  const [reduxLoaded,setReduxLoaded] = useState(false);
  const [MainComponent, state] = useMemo(
    () => {
      return populateComponents(props.page,props.components,props.resources);
    },
    [props]
  );
  useEffect(() => {
    if(reduxIsRequired(state) && !reduxLoaded){
      StateController.populateState(state,props.dispatch);
      setReduxLoaded(true);
    }
  }, [props, state, reduxLoaded]);
  if (!reduxLoaded && reduxIsRequired(state)) return <React.Fragment/>;
  return <MainComponent/>;
}
export default ComponentLoader;