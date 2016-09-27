/**
* @namespace Container Soap object. Defines all methods facilitating the creation of SOAP Requests.<br/>
*/
window.c20g.Soap = {
  
 /**
  * @function
  * @description Function will return a boolean value if the response was not returned (internet connectivity issues)<br>
  *   or an SOAP fault was thrown.
  * @param {object} response The JSON object returned from making a SOAP request with the SOAPClient.
  * @returns {boolean} true or false depending on if the response is valid or not.
  */
  isResponseValid : function(response){
    return response !== null && typeof response.Body[0].Fault === 'undefined';
  },
 
 /**
  * @function
  * @description Function to load the error message of the error code contained in the response object in the given container.
  * @param {object} response The JSON object returned from making a SOAP request with the SOAPClient.
  * @param {string} containerId The ID of the container in which we load the error message.
  */
  showErrorMessage : function(response, containerId){
    var jcontainer = $('#'+containerId);
    var eURL = window.c20g.URL.isURLProtected() ? '../displayerror.html' : './displayerror.html';
    var code = '';
    if(response === null){
      code = 'error.server.access';
    } else {
      code = response.Body[0].Fault[0].faultcode[0].Text.split(':')[1];
    }
    jcontainer.load(eURL, function(){
      var message = '';
      if(window.c20g.UIMessages.errorMessage[code] !== 'undefined'){
        message = window.c20g.UIMessages.errorMessage[code];
      } else {
        message = window.c20g.UIMessages.errorMessage['error.generic'];
      }
      $('.errormessage', jcontainer).html(message);    
    });
  },

  /**
   * @function
   * @description Function will return a SOAPRequest object
   * @param {string} methodName The name of the first child element of the SOAP:Body (the method name)
   * @param {string} methodNs The namespace of the method being invoked
   * @param {object[]} paramMap An array of maps; each should contain 3 attributes: name, value, ns
   */
  constructSimpleSOAPRequest : function(methodName, methodNs, paramMaps, paramNs) {
    // create and return the soap envelope containing our constructed request body
    return new SOAPRequest(methodName, window.c20g.Soap.constructSimpleSOAPBody(methodName, methodNs, paramMaps, paramNs));
  },

  /**
   * @function
   * @description Function will return a SOAPBody object
   * @param {string} methodName The name of the first child element of the SOAP:Body (the method name)
   * @param {string} methodNs The namespace of the method being invoked
   * @param {object[]} paramMap An array of maps; each should contain 3 attributes: name, value, ns (optional)
   * @param {string} paramNS The default namespace for the parameters.  this can be overridden with the ns attribute in paramMap.
   */
  constructSimpleSOAPBody : function(methodName, methodNs, paramMaps, paramNs) {
    // create the method body
    var soapBody = new SOAPObject(methodName); 
    soapBody.attr("xmlns", methodNs);
    
    // loop over the params passed in, and add them to the request body as children
    for(var i = 0; i < paramMaps.length; i++) {
      var eleTempParam = new SOAPObject(paramMaps[i].name);
      eleTempParam.val(paramMaps[i].value);
      eleTempParam.attr("xmlns", paramMaps[i].ns ? paramMaps[i].ns : paramNs);
      soapBody.appendChild(eleTempParam);
    }
    return soapBody;
  },
  /**
   * @function
   * @description Function traverses a SOAPObject along the given path and returns that node if it exists.
   *   Returns null if no object is found.
   * @param {object} soapObject The SOAPObject to search through.
   * @param {string[]} pathArray The path to search, with each level of the path as a string in the array.
   *   e.g. ['tuples','tuple','old','SELECTION']
   */
  getSOAPObjByPath : function(soapObject, pathArray) {
    if (pathArray && pathArray.length > 0) {
      var curElement = pathArray.shift();
      for (var i=0; i < soapObject.children.length; i++) {
        var child = soapObject.children[i];
        if (child.name == curElement) {
          return pathArray.length === 0 ? child : window.c20g.Soap.getSOAPObjByPath(child, pathArray);
        }
      }
    }
    return null;
  },
  /**
   * @function
   * @description Function converts a json object into a SOAPObject.
   * @param {object} jsonObj The json object to convert.
   * @param {string} name The name of the newly constructed SOAPObject
   */
  jsonToSoap : function (jsonObj, name) {
    if ($.isArray(jsonObj)) {
      var soapObjArr = [];
      for (var i=0; i<jsonObj.length; i++) {
        soapObjArr.push(window.c20g.Soap.jsonToSoap(jsonObj[i], name));
      }
      return soapObjArr;
    } else {
      var soapObj = new SOAPObject(name);
      if (typeof jsonObj === 'object') {
        for (var prop in jsonObj) {
          if (jsonObj.hasOwnProperty(prop)) {
            var child = window.c20g.Soap.jsonToSoap(jsonObj[prop], prop);
            if ($.isArray(child)) {
              for (var j=0; j<child.length; j++) {
                soapObj.appendChild(child[j]);
              }
            } else {
              soapObj.appendChild(child);
            }
          }
        }
      } else {
        soapObj.val(jsonObj);
      }
      return soapObj;
    }
  },
  /**
   * @function
   * @description Function constructs a SOAPBody from a json object.
   * @param {object} params The json object representing the first child element of the SOAP:Body
   * @param {string} methodName The name of the first child element of the SOAP:Body (the method name)
   * @param {string} methodNs The namespace of the method being invoked
   * @param {string} paramNS The namespace for all parameters.
   */
  jsonToSOAPBody : function(params, methodName, methodNs, paramNs) {
    var soapBody = window.c20g.Soap.jsonToSoap(params, methodName);
    soapBody.attr("xmlns", methodNs);
    for (var i = 0; i < soapBody.children.length; i++) {
      soapBody.children[i].attr("xmlns", paramNs);
    }
    return soapBody;
  },
  /**
   * @function
   * @description Function constructs a SOAPRequest from a json object.
   * @param {object} params The json object representing the first child element of the SOAP:Body
   * @param {string} methodName The name of the first child element of the SOAP:Body (the method name)
   * @param {string} methodNs The namespace of the method being invoked
   * @param {string} paramNS The namespace for all parameters.
   */
  jsonToSOAPRequest : function(params, methodName, methodNs, paramNs) {
    var soapBody = window.c20g.Soap.jsonToSOAPBody(params, methodName, methodNs, paramNs);
    return new SOAPRequest(methodName, soapBody);
  }
};