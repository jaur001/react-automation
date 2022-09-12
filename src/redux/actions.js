export const actions = {
  updateProperty: (state, action) => {
    const newState = { ...state };
    return action.callback(newState);
  },
  populateState: (state,action) => {
    return action.newState;
  }
}

function getNames(){
  const names = {};
  for (const key in actions) {
    names[key] = key;
  }
  return names;
}

export const actionNames = getNames(actions);