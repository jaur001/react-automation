export const createCopy = (json) => {
  if(typeof json !== "object") return json;
  if(Array.isArray(json)) return json.map((child) => createCopy(child))
  const copy = {...json};
  for (const property in copy) {
    copy[property]=createCopy(copy[property]);
  }
  return copy;
}