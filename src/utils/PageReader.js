import { HttpParams, HttpClient } from "./HttpClient";
import ReactAutomationException from "./ReactAutomationException";

const PageReader = {
  getPageStructure: (path) => {
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
        throw new ReactAutomationException("Error reading Page Structure", body);
      }
    );
    HttpClient.makeHttpRequest(params);
    return result;
  }
}
export default PageReader;