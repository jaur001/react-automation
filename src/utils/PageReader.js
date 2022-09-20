import { HttpParams, HttpClient } from "./HttpClient";
import ReactAutomationException from "./ReactAutomationException";

class PageReader{
  static getPages(path){
    return PageReader.#readJson(path,"Error reading list of pages. Path tried: " + path);
  }
  static getPage(path){
    return PageReader.#readJson(path,"Error reading page. Path tried: " + path);
  }
  static #readJson(path,errorMessage){
    let result = {};
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const params = new HttpParams(
      path,
      "GET",
      false,
      headers,
      null,
      false,
      (body, headers) => {
        result = body;
      },
      (status, body, headers) => {
        throw new ReactAutomationException(errorMessage, body);
      }
    );
    HttpClient.makeHttpRequest(params);
    return result;
  }
}
export default PageReader;