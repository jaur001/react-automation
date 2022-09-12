export class HttpParams{
    constructor (url,method,async,reqheaders,reqBody,includeCredentials,processResponse,processError){
        this.url = url;
        this.method = method;
        this.async = async;
        this.reqheaders = reqheaders;
        this.reqBody = reqBody;
        this.includeCredentials = includeCredentials;
        this.processResponse = processResponse;
        this.processError = processError;
    }
}

const HttpClient = {
    // Function that makes Http request using XMLHttpRequest
    makeHttpRequest: function (httpRequest){
        if (!(httpRequest instanceof HttpParams)){
            this.processBadRequest("Http params for Http request not found");
            return;
        }    
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){   
            HttpClient.handleResponse(xhr,httpRequest); // Call back for response
        }
        xhr.open(httpRequest.method, httpRequest.url, httpRequest.async);
        if(httpRequest.reqheaders != null){
            let headerList = Object.entries(httpRequest.reqheaders);
            for (let [key, value] of headerList) {
                xhr.setRequestHeader(key,value);
            }
        }
        if(httpRequest.includeCredentials) xhr.withCredentials = true;
        xhr.send(JSON.stringify(httpRequest.reqBody));
    },

    processBadRequest:function(message) {
        console.log("There was an error making an Http request!!: " + message);
    },

    handleResponse:  function(xhr,httpRequest) {
        if (xhr.readyState === 4) {
            let body = {};
            try {
                body = JSON.parse(xhr.response);
            } catch (error) {
                body = xhr.response;   
            }
            let headers = this.parseResponseHeaders(xhr.getAllResponseHeaders());
            if(xhr.status >= 200 && xhr.status < 300)
                this.processSuccessRequest(httpRequest.processResponse,body,headers);  // Call back for successful response
            else this.processUnSuccessRequest(httpRequest.processError,xhr.status,body,headers);  // Call back for error response
        }
    },

    processSuccessRequest: function(processResponse,body,headers){
        if(processResponse!=null) processResponse(body,headers); // Execute function to process correct response
    },

    processUnSuccessRequest: function(processError,status,body,headers){
        if(processError!=null) processError(status,body,headers); // Execute function to proccess error  
    },

    // Parse the response headers to retrieve a JSON with the response headers
    parseResponseHeaders: function (headers){
        const arrayHeaders = headers.trim().split(/[\r\n]+/);
        let headerJson = {};
        arrayHeaders.forEach(function (line) {
        const parts = line.split(': ');
        const header = parts.shift();
        const value = parts.join(': ');
        headerJson[header] = value;
        });
        return headerJson;
    }
    
}

export {HttpClient};