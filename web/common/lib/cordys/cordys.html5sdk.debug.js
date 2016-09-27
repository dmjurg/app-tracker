/*!
 * Cordys HTML5 SDK v0.5
 *
 * Copyright (c) 2013 Cordys
 */
 if (typeof(jQuery) == "undefined") {
	throw new Error("jQuery is required, please ensure it is loaded before this library");
//	document.write('<script src="/cordys/thirdparty/jquery/jquery.js"><\/script>');
};
if (!$.cordys) $.cordys = {
	cookiePath: "/cordys",
	baseUrlPath: "",
	isMobile: getURLParameter(window.location, "startfrom") == "native"
};
// In BOP4.2 we need to set the base, as most urls are relative
//var _baseTag =	document.getElementsByTagName("base")[0] ||
//	document.getElementsByTagName("head")[0].appendChild(document.createElement("base"));
//_baseTag.href = document.location.href.split('/').slice(0,(document.location.href.split('/')[3] == 'cordys' ? 4 : 5)).join('/') + '/';  // protocol://domain[:port]/virtualroot/organization/  or (compatible protocol://domain[:port]/cordys/


if (! window.console) window.console = {};
if (! window.console.log) window.console.log = function () { };

// Supporting old browsers
if (typeof(JSON) == "undefined" ||  typeof(JSON.stringify) == "undefined") {
	loadScript("/cordys/html5/util/json2.js");
}
if (typeof(btoa) == 'undefined') {
	loadScript("/cordys/html5/util/base64.js");
}
/*if (typeof(hex_sha1) == "undefined") {
  loadScript("/cordys/thirdparty/sha1/sha1.js");
}*/
function getURLParameter(url, name) {
	var urlString = (typeof url === "object") ? url.search : url;
	return (urlString.search( new RegExp("[\?\&]"+name+"=([^\&]*)") ) >= 0) ? RegExp.$1 : "";
}
function addURLParameter(url, name, value) {
	if ( !value ) return url;
	
	var parSeparator = url.indexOf("?") < 0 ? "?" : "&";
	return url + parSeparator + name + "=" + encodeURIComponent(value);
}

function addOrganizationContextToURL(url) {
	var orgDN = getURLParameter(window.location, "organization");
	if (orgDN) {
		url = addURLParameter(url, "organization", orgDN);
	}
	
	// Change to root/org if we have not launched using the /cordys URL
	// Get the Base URL Prefix
	var baseURLPrefix = window.location.href.match(/[^:]+:[/\\]+[^/\\]+([/\\][^/\\]+[/\\][^/\\]+[/\\])/)[1];
	
	// Replace /cordys with baseURLPrefix if we have it
	if (baseURLPrefix && (! baseURLPrefix.match(/^[/\\]cordys/i ))){
		url = url.replace(/^[/\\]cordys[/\\]/, baseURLPrefix);
		 // Prefix relative URLs not starting with /, \ or . with the base URL
		if(! url.match(/^[/\\.]|^[\w]+:[/\\]{2}/)){
			url = baseURLPrefix + url;
		}
	}	
	
	return url;
}

function getCookie(cookieName)
{
	return (window.document.cookie.search( new RegExp("\\b("+cookieName+")=([^;]*)") ) >= 0) ? RegExp.$2 : "";
}
function deleteAllCookies(cookiePath)
{
	var cookiePath = cookiePath || $.cordys.cookiePath,
		cookies = document.cookie.split(";");

	for (var i=0; i < cookies.length; ++i) {
		document.cookie = $.trim(cookies[i].split("=")[0]) + 
				"=;expires=Thu, 01-Jan-1970 00:00:01 GMT; path=" + cookiePath;
	}
}

function loadScript(url, callback, async, cache) {
	return $.ajax({
		type: "GET",
		url: url,
		success: callback,
		dataType: "script",
		async: async || false,
		cache: cache || true
	});
};

//show the message with title
function showMessage (message, title) {
	title = title ? title : "";
	if ($.cordys.isMobile) {
		$.cordys.mobile.notification.alert(message, null, title);
	} else {
		window.alert(message);
	}
}

// get the top level window from the current window
function getTopLevelWindow(currentWindow) {
	var parentWindow = currentWindow.parent || currentWindow.opener;
	if (parentWindow === currentWindow) return currentWindow;
	return (getOrigin(parentWindow) === getOrigin(currentWindow)) ? getTopLevelWindow(parentWindow) : currentWindow;
}

// get the origin of the window
function getOrigin(windowObject) {
	var location = windowObject.location;
	return location.origin ? location.origin : (location.protocol + "//" + location.host);
}













;(function (window, $, undefined) {

	var	aCache = [], rIsNull = /^\s*$/, rIsBool = /^(?:true|false)$/i;

	if (!$.cordys) $.cordys = {};
	$.cordys.json = {};
	$.cordys.json.defaults = {
		valueProperty: "text",
		attributesProperty: "keyAttributes",
		attributePrefix:"@",
		defaultVerbosity:1,
		removeNamespacePrefix:false
	}
	$.cordys.json.xml2js = function (oXMLParent, nVerbosity /* optional */, bFreeze /* optional */, bNesteAttributes /* optional */) {
		var _nVerb = arguments.length > 1 && typeof nVerbosity === "number" ? nVerbosity & 3 : $.cordys.json.defaults.defaultVerbosity;
		return createObjTree(oXMLParent, _nVerb, bFreeze || false, arguments.length > 3 ? bNesteAttributes : _nVerb === 3);
	};
	
	if (typeof(XMLSerializer) == "undefined") {
		XMLSerializer = function(){
		}
		XMLSerializer.prototype.serializeToString = function(inputXML){
			return inputXML.xml;
		}
		document.XMLSerializer = XMLSerializer;
	}
		
	if (!String.prototype.trim) {
		String.prototype.trim = function(){
			return this.replace(/^[\s]+/, "").replace(/[\s]+$/, "");
		}	
	}
	
	$.cordys.json.xml2jsstring = function (oXMLParent, nVerbosity /* optional */, bFreeze /* optional */, bNesteAttributes /* optional */) {
        if (! oXMLParent) return null;
        return JSON.stringify($.cordys.json.xml2js(oXMLParent, nVerbosity, bFreeze, bNesteAttributes));
	};

	$.cordys.json.js2xml = function (oObjTree) {
		var oNewDoc = null;
		if (window.ActiveXObject) { 
			oNewDoc = new ActiveXObject( "Microsoft.XMLDOM" ); // For IE
		} else {
			oNewDoc = document.implementation.createDocument("", "", null);
		}
		loadObjTree(oNewDoc, oNewDoc, oObjTree);
		return oNewDoc;
	};

	$.cordys.json.js2xmlstring = function (oObjTree) {
		var oWrappedTree = {o:oObjTree};	// wrap oObjTree into an object to prevent error with multiple roots
		var wrappedXML = $.cordys.json.js2xml(oWrappedTree);
		var sXML = wrappedXML.documentElement.xml || (new XMLSerializer()).serializeToString(wrappedXML.documentElement); //For IE
		return sXML.slice(3, sXML.length-4); // remove the temporary object
	};

	$.cordys.json.find = function(obj, name, val) {
		// Finding all the objects with a certain name.
		// It returns:
		// - null if nothing found
		// - a single object if 1 result found
		// - an array if multiple results found
		var obj = getObj(obj, name, val);
		return obj.length===0 ? null : (obj.length===1 ? obj[0] : obj);
	}
	$.cordys.json.findObjects = function(obj, name, val) {
		// Finding all the objects with a certain name and always returns an array
		return getObj(obj, name, val);
	}

	function getObj(obj, key, val) {
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i)) continue;
			if (typeof obj[i] == 'object') {
				if (i == key) {
					if ($.isArray(obj[i])) {
						for (var j=0; j<obj[i].length; j++) {
							objects.push(obj[i][j]);
						}
					} else {
						objects.push(obj[i]);
					}
				} else {
					objects = objects.concat(getObj(obj[i], key, val));
				}
			} else if (i == key && obj[key] == val) {
				objects.push(obj);
			}
		}
		return objects;
	};

	function parseText (sValue) {
		if (rIsNull.test(sValue)) { return null; }
	//	if (rIsBool.test(sValue)) { return sValue.toLowerCase() === "true"; }
	//	if (isFinite(sValue)) { return parseFloat(sValue); }
	//	if (isFinite(Date.parse(sValue))) { return new Date(sValue); }
		return sValue;
	}

	function objectify (vValue) {
		return vValue === null ? {} : (vValue instanceof Object ? vValue : new vValue.constructor(vValue));
	}

	function createObjTree (oParentNode, nVerb, bFreeze, bNesteAttr) {
		var	nLevelStart = aCache.length, bChildren = oParentNode.hasChildNodes(),
			bHighVerb = Boolean(nVerb & 2);
		var bAttributes = oParentNode.hasAttributes ? oParentNode.hasAttributes() : (oParentNode.attributes ? (oParentNode.attributes.length > 0) : false); //For IE
		var	sProp, vContent, nLength = 0, sCollectedTxt = "",
			vResult = bHighVerb ? {} : /* put here the default value for empty nodes: */ "";

		if (bAttributes && oParentNode.getAttribute("xsi:nil") === "true") {
			bAttributes = false;	// skip the attributes
			vResult = null;			// value will be 'null'
		}

		if (bChildren) {
			for (var oNode, nChildId = 0; nChildId < oParentNode.childNodes.length; nChildId++) {
			oNode = oParentNode.childNodes.item(nChildId);
			if (oNode.nodeType === 4) { sCollectedTxt += oNode.nodeValue; } /* nodeType is "CDATASection" (4) */
			else if (oNode.nodeType === 3) { sCollectedTxt += oNode.nodeValue.trim(); } /* nodeType is "Text" (3) */
			else if (oNode.nodeType === 1) { aCache.push(oNode); } /* nodeType is "Element" (1) */
			}
		}

		var nLevelEnd = aCache.length, vBuiltVal = parseText(sCollectedTxt);

		if (!bHighVerb && (bChildren || bAttributes)) { vResult = nVerb === 0 ? objectify(vBuiltVal) : {}; }

		for (var nElId = nLevelStart; nElId < nLevelEnd; nElId++) {
			sProp = ($.cordys.json.defaults.removeNamespacePrefix === true) ? ((aCache[nElId].localName) ? aCache[nElId].localName : aCache[nElId].nodeName.replace(/^[^:]*:/,"")) : aCache[nElId].nodeName; // localName is not supported in IE7 and IE8
			vContent = createObjTree(aCache[nElId], nVerb, bFreeze, bNesteAttr);
			if (vResult.hasOwnProperty(sProp)) {
				if (vResult[sProp].constructor !== Array) { vResult[sProp] = [vResult[sProp]]; }
				vResult[sProp].push(vContent);
			} else {
				vResult[sProp] = vContent;
				nLength++;
			}
		}

		if (bAttributes) {
			var	nAttrLen = oParentNode.attributes.length,
				sAPrefix = bNesteAttr ? "" : $.cordys.json.defaults.attributePrefix, oAttrParent = bNesteAttr ? {} : vResult;

			for (var oAttrib, nAttrib = 0; nAttrib < nAttrLen; nLength++, nAttrib++) {
				oAttrib = oParentNode.attributes.item(nAttrib);
				oAttrParent[sAPrefix + oAttrib.nodeName] = parseText(oAttrib.nodeValue.trim());
			}

			if (bNesteAttr) {
				if (bFreeze) { Object.freeze(oAttrParent); }
				vResult[$.cordys.json.defaults.attributesProperty] = oAttrParent;
				nLength -= nAttrLen - 1;
			}
		}

		if(vResult !== null) {
			if (nVerb === 3 || (nVerb === 2 || nVerb === 1 && nLength > 0) && sCollectedTxt) {
				vResult[$.cordys.json.defaults.valueProperty] = vBuiltVal;
			} else if (!bHighVerb && nLength === 0 && sCollectedTxt) {
				vResult = vBuiltVal;
			}

			if (bFreeze && (bHighVerb || nLength > 0)) { Object.freeze(vResult); }
		}

		aCache.length = nLevelStart;

		return vResult;
	}

	function loadObjTree (oXMLDoc, oParentEl, oParentObj) {
		var vValue, oChild;
		var objType = typeof(oParentObj);
		if (oParentObj instanceof String || oParentObj instanceof Number || oParentObj instanceof Boolean ||  objType== "string" || objType == "number" || objType == "boolean" ) {
			oParentEl.appendChild(oXMLDoc.createTextNode(oParentObj.toString())); /* verbosity level is 0 */
		} else if (oParentObj.constructor === Date) {
			oParentEl.appendChild(oXMLDoc.createTextNode(oParentObj.toGMTString()));
		}

		for (var sName in oParentObj) {
			if (! oParentObj.hasOwnProperty(sName)) return;
			if (isFinite(sName)) { continue; } /* verbosity level is 0 */
			vValue = oParentObj[sName];
			if (typeof(vValue) === "function") vValue = vValue(); // in case of KO, value can be an observable.
			if (sName === $.cordys.json.defaults.valueProperty) {
				if (vValue !== null && vValue !== true) { 
					oParentEl.appendChild(oXMLDoc.createTextNode(vValue.constructor === Date ? vValue.toGMTString() : String(vValue)));
				}
			} else if (sName === $.cordys.json.defaults.attributesProperty) { /* verbosity level is 3 */
				for (var sAttrib in vValue) { oParentEl.setAttribute(sAttrib, vValue[sAttrib]); }
			} else if (sName.charAt(0) === $.cordys.json.defaults.attributePrefix) {
				oParentEl.setAttribute(sName.slice(1), new String(vValue)); //For IE 
			} else if (typeof(vValue) === "undefined"){
				oParentEl.appendChild(oXMLDoc.createElement(sName));
			} else if (vValue !== null && vValue.constructor === Array) {
				for (var nItem = 0; nItem < vValue.length; nItem++) {
					oChild = oXMLDoc.createElement(sName);
					loadObjTree(oXMLDoc, oChild, vValue[nItem]);
					oParentEl.appendChild(oChild);
				}
			} else {
				oChild = oXMLDoc.createElement(sName); 
				if (vValue instanceof Object) {
					loadObjTree(oXMLDoc, oChild, vValue);
				} else if (vValue !== null && vValue !== true) {
					oChild.appendChild(oXMLDoc.createTextNode(vValue.toString()));
				} else if (vValue === null) {
					oChild.setAttribute("null", "true");
					oChild.setAttribute("xsi:nil", "true");
					oChild.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
				}
				oParentEl.appendChild(oChild);
			}
		}
	}

})(window, jQuery);


/**
 * Cordys Ajax Plugin
 *
 * Copyright (c) 2013 Cordys
 */
;(function (window, $, undefined) {

	if (!$.cordys) $.cordys = {};
	if (!$.cordys.json) {
		loadScript("/cordys/html5/util/jxon.js");
	}

	$.ajaxSetup({
		converters: {
			"xml json": function( data ) {
				var responseNode = $(data).find("Body, SOAP\\:Body").children()[0];
				// Check whether the response is for a  multi call response
				if(responseNode.tagName === "multicall:__Cordys_MultipleRequestWrapperResponse" ) {
					var jsonResponse = [];
					// Form the Json response Object for all the responses 
					$.each($(responseNode).find("Body, SOAP\\:Body"),function(index,value){
						jsonResponse.push($.cordys.json.xml2js(value.firstChild));
					});
					return jsonResponse;
				}else{
					return $.cordys.json.xml2js(responseNode)
				}
			}
		}
	});

	// Function that will stop copying content and url object structure
	function ajaxExtend(target, src) {
		var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
		for (key in src) {
			if (src[key] !== undefined) {
				(flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
			}
		}
		if (deep) {
			jQuery.extend(true, target, deep);
		}
		return target;
	}

	$.cordys.ajax = function(options) {
		var requestStartTime = (new Date()).getTime();
		var opts = $.extend({}, $.cordys.ajax.defaults);
		opts = ajaxExtend(opts, options);
		opts.url = configureGatewayUrl(opts.url, opts);
		if (!opts.url) return null;
		var dataStrings = [];
		
		if(opts.request){ 
			var request = opts.request;
			 if($.isArray(request)){ //Check for a multicall request
			 	
			 	dataStrings.push("<SOAP:Envelope xmlns:SOAP='http://schemas.xmlsoap.org/soap/envelope/'><SOAP:Body><multicall:__Cordys_MultipleRequestWrapper xmlns:multicall='http://schemas.cordys.com/1.0/ldap'>");
			 	for (var count= 0; count<request.length; count++) {
			 		dataStrings.push((typeof(request[count].data) === "undefined") ? makeRequest(request[count],opts) : request[count].data );							
				}
				dataStrings.push("</multicall:__Cordys_MultipleRequestWrapper></SOAP:Body></SOAP:Envelope>");

			 }else{
			 	dataStrings.push((typeof(request.data) === "undefined") ? makeRequest(request,opts) : request.data );							
			 }

		}else{
			dataStrings.push((typeof(opts.data) === "undefined") ? makeRequest(opts,opts) : opts.data );							
		}

		opts.data = dataStrings.join("");

		if (typeof(opts.error) === "function") {
			opts.__error = opts.error;
		}
		opts.error = function(jqXHR, textStatus, errorThrown) {
			console.log("Error Response received ", jqXHR, jqXHR.error());
			var messCode = "",
				responseText = jqXHR.error().responseText,
				responseXML = jqXHR.error().responseXML;

			if(responseXML) {
				// check for IE	
				responseXML = responseXML instanceof Object ? responseXML : responseXML.xml; //NOMBV 
				messCode = $(responseXML).find("MessageCode").text();
			}
			if(!messCode && responseText) {
				messCode = $(responseText).find("cordys\\:messagecode").text();
			}
			
			if (messCode.search(/Cordys.*(AccessDenied|Artifact_Unbound)/)>=0 || jqXHR.statusText === "Forbidden") {
				// login to Cordys with cookie reset is true
				$.cordys.authentication.login(true, requestStartTime).done(function(){
					return $.cordys.ajax(options);
				});
			} else {
				if (!jqXHR.error().responseText && !jqXHR.error().responseXML) return;// skip this error, there is no description
				var showError = true;
				var errorMessage = $(jqXHR.error().responseXML).find("faultstring,error elem").text()
						|| jqXHR.responseText 
						|| "General error, see response.";
				if (opts.__error && typeof(opts.__error) === "function") {
					showError = opts.__error(jqXHR, textStatus, errorThrown, messCode, errorMessage, opts) !== false;
				}
				if (showError) {
					alert("Error on read: '" + errorMessage + "'");
				}
			}
		}

		// modify the default login url if we have the login url in the request
		if(opts.loginUrl){
			$.cordys.authentication.defaults.loginURL = opts.loginUrl;
		}

		// Show the progress icon if it is enabled
		var loadingTimer;
		opts._beforeSend = opts.beforeSend;
		opts.beforeSend = function(jqXHR, settings) {
			// Call beforeSend of the request if already avilable
			if (typeof (opts._beforeSend) === "function"){
				if (opts._beforeSend.call(this, jqXHR, settings) === false){
					return false;
				}
			}
			if(opts.showLoadingIndicator && opts.isMock === false) {
				opts.isResponseReceived = false;
				loadingTimer = window.setTimeout(function () {
					if( !opts.isResponseReceived ) {
						showLoadingIndicator();
					}
				}, opts.responseWaitTime);
			}
		}

		// let us just send the request if we are mocking
		if (opts.isMock === true){
			return sendRequest(opts);
		}else{
			return $.cordys.authentication.login().then(function(){
				return sendRequest(opts).always(function() {
					// Hide the progress icon once the request is processed
					if(opts.showLoadingIndicator) {
						opts.isResponseReceived = true;
						hideLoadingIndicator();
						clearTimeout(loadingTimer);
					}
				});
			});
		}
	}

	function sendRequest(opts) {
		// let us set the ct cookie if we have one
		setCookiesToUrl(opts);
		return $.ajax(opts);
	}

	function makeRequest(request,opts){
		var dataStrings = [];
		if (request.method && request.namespace) {			
			dataStrings.push("<SOAP:Envelope xmlns:SOAP='http://schemas.xmlsoap.org/soap/envelope/'><SOAP:Body><");
			dataStrings.push(request.method);
			dataStrings.push(" xmlns='");
			dataStrings.push(request.namespace);
			dataStrings.push("'>");
			if (request.parameters) {
				dataStrings.push(getParameterString(request.parameters, opts));
			}
			dataStrings.push("</" + request.method + ">");
			dataStrings.push("</SOAP:Body></SOAP:Envelope>");
			return dataStrings.join("");
		}
	}

	$.cordys.ajax.defaults = {
		url: "",
		async: true,
		isMock:false,
		type:"POST",
		contentType:"text/xml; charset=\"utf-8\"",
		dataType:"json",
		cache:false,
		headers: { "cache-control": "no-cache" },
		showLoadingIndicator: true,
		responseWaitTime: 1500	// wait time in MilliSeconds to show the loading indicator
	}
  
	// Show the jquery mobile loading icon if jquery mobile is available
	// Else create a new div and show the progress bar
	function showLoadingIndicator() {
		if($.mobile) {
			$.mobile.loading("show");
		} else if($("#_Cordys_Ajax_LoadingIndicator").length === 0) {
			var imgDiv = $("<div id='_Cordys_Ajax_LoadingIndicator'/>");
			$("body").append(imgDiv);
			imgDiv.css({"background":"url(/cordys/html5/images/custom-loader.gif) no-repeat center center",
					"height": "100px",
					"width": "100px",
					"position": "fixed",
					"left": "50%",
					"top": "50%",
					"margin": "-25px 0 0 -25px",
					"z-index": "1000"
				});
		} else if($("#_Cordys_Ajax_LoadingIndicator").length > 0) {
			$("#_Cordys_Ajax_LoadingIndicator").css({"display":"block"});
		}
		
	}

	function hideLoadingIndicator() {
		if($.mobile) {
			$.mobile.loading("hide");
		} else if($("#_Cordys_Ajax_LoadingIndicator").length > 0) {
			$("#_Cordys_Ajax_LoadingIndicator").css({"display":"none"});
		}
	}

	function configureGatewayUrl(url, options) {
		return url ? (window.location.protocol === "file:" ? url : url.replace(/^http:\//, window.location.protocol+"/")).replace(/\/localhost\//, "/"+window.location.host+"/") 
					: "com.eibus.web.soap.Gateway.wcp";
	}

	function setCookiesToUrl(options) {
	
		if (options.isMock !== true) {
			var ctCookie = getCookie("\\w*_ct"); // cookie name can be different, when property gateway.csrf.cookiename is set
			if (ctCookie) {
				options.url = addURLParameter(options.url, RegExp.$1, ctCookie);
			}
		}
	}

	function getParameterString(parameters, settings) {
		var pStrings = [];
		if ($.isArray(parameters)) {
			for (var i=0,len=parameters.length; i<len; i++) {
				var par = parameters[i];
				pStrings.push("<" + par.name + ">");
				pStrings.push((typeof(par.value) === "function" ? par.value() : par.value)); //NOMBV
				pStrings.push("</" + par.name + ">");
			}
		} else if (typeof(parameters) === "object") {
			if ($.cordys.json) pStrings.push($.cordys.json.js2xmlstring(parameters));
			else {
				for (var par in parameters) {
					pStrings.push("<" + par + ">");
					pStrings.push((typeof(parameters[par]) === "function" ? parameters[par]() : parameters[par]));
					pStrings.push("</" + par + ">");
				}
			}
		} else if (typeof(parameters) === "function") {
			if (typeof(settings.context) === "object"){
				pStrings.push(parameters.call(settings.context, settings));
			}else{
				pStrings.push(parameters(settings));
			}
		} else if (typeof(parameters) === "string") {
			pStrings.push(parameters);
		}
		return pStrings.join("");
	}

})(window, jQuery)
/**
 * Cordys Authentication Plugin
 *
 * Copyright (c) 2013 Cordys
 */

;(function (window, $, undefined) {
	var userDetails, userDetailsResponse,
		preloginInfo = null,
		topLevelWindow = getTopLevelWindow(window), // get the top level window for creating login deferred
		SAMLART_NAME = "SAMLart";

	$.cordys.authentication = {
		// get user method returns the user and organization details.
		getUser : function(){
			var $GetUserDef = $.Deferred();
			
			if(userDetails){
				$GetUserDef.resolve(userDetails, userDetailsResponse);
			}
			else {
				$.cordys.ajax({
					method: "GetUserDetails",
					namespace: "http://schemas.cordys.com/1.0/ldap",
					dataType:"text xml json"
				}).then(function(response) {
					var organization;
					var userDN = "";
					var organizationDN = "";
					userDetails = {};
					var organizationDetails = response.tuple.old.user.organization;
					organizationObjects = ($.type(organizationDetails) === "array") ? organizationDetails : [organizationDetails];
					organization = getOrganizationName(organizationObjects);
					// mathching the organization DN.
					var orgPattern = new RegExp("^o=" + organization + ",", "i");
					$.each(organizationObjects, function(i, value){
						if (orgPattern.test(value.dn)) {
							organizationDN = value.dn;
							userDN = value.organizationaluser.dn;
							return false; // stop here
						}
					});
					userDetails.userDN = userDN;
					userDetails.organizationDN = organizationDN;
					userDetails.organizationName = organization;
					userDetails.userName = userDN.substring(userDN.indexOf("cn=")+3,userDN.indexOf(","));
          userDetailsResponse = response;
					$GetUserDef.resolve(userDetails,userDetailsResponse);
				});
			}
			return $GetUserDef;
		},

		// get prelogin information such as saml_name, ct_name, and cookie path
		getPreloginInfo : function () {
			var deferred = $.Deferred();
			// let us return the preloginInfo if we already have it
			if (preloginInfo) {
				return deferred.resolve(preloginInfo);
			}

			var prelogin = getPreloginRequest();

			$.ajax(prelogin).done(function(data) {
				preloginInfo = $.cordys.json.xml2js(data).PreLoginInfo;
				deferred.resolve(preloginInfo);
			}).fail(function(e, statusText, errorThrown) {
				deferred.reject(e, statusText, errorThrown);
			});

			return deferred.promise();
		},

		login : function (reset, requestStartTime){

			// Check if we have already started with login or we have already done with it
			if (this.isLoginPending() || (this.isLoginCompleted() && reset !== true)) return topLevelWindow.$Cordys_LoginDef.promise();

			// if request was initially sent before login was initiated, then we can return the same deferred
			if (this.isLoginCompleted() && reset === true && (requestStartTime && requestStartTime > topLevelWindow.$Cordys_LoginDef.startTime && requestStartTime < topLevelWindow.$Cordys_LoginDef.successTime)){
				return topLevelWindow.$Cordys_LoginDef;
			}

			// let us set a local reference so that we do not lose it in the handlers when some one else
			// resolves it and creates another differed
			var l$Cordys_LoginDef = this.setLoginStarted();
			

			// if we are in the native app, return a deferred which will get resolved after getting the cookie
			// from the native app
			if ($.cordys.isMobile && $.cordys.cookie) {
				$.cordys.cookie.getCookies(getURLParameter(window.location, "serverId"), reset).done(function(){
					if (reset === true){
						// reload in case it was an expiry case
						window.location.reload();
					}else{
						$.cordys.authentication.setLoginCompleted();
					}
				});
				return l$Cordys_LoginDef.promise();
			}
			
			this.getPreloginInfo().done(function(preloginInfo){
				var authenticationMode = preloginInfo.AuthConfigMode;

				// nothing to do in case of Web Server authentication
				if(authenticationMode === "WebServer") {
					l$Cordys_LoginDef.resolve();
				}

				// Cordys SSO authentication
				else if(authenticationMode === "CordysSSO") {
					// Show the login screen if we do not have a cookie or we need a new cookie
					if (reset) {
						showLoginPage();
					}
					// check whether the ct is available in cookie or not
					else if(! $.cordys.authentication.sso.isAuthenticated() ) {
						var samlArtInURL = getURLParameter(window.location, SAMLART_NAME),
							samlArtInCookie = getCookie(preloginInfo.SamlArtifactCookieName.text); //NOMBV
						
						// check whether the saml artifact is passed as a url parameter. If so initialize session with that Artifact
						if(samlArtInURL) {
							if( samlArtInURL !== samlArtInCookie ) {
								$.cordys.authentication.sso.initializeSessionFromArtifact(samlArtInURL);
								l$Cordys_LoginDef.resolve();
							} else {
								l$Cordys_LoginDef.resolve();
							}
						}
						// incase of external IDP, SAMLArt is available in cookie, so initiate a new session with that SAMLArt
						else if(samlArtInCookie) {
							$.cordys.authentication.sso.initializeSessionFromArtifact(samlArtInCookie);
							l$Cordys_LoginDef.resolve();
						}
						// if no SAMLArt or ct in cookie, show the login screen with the configured URL
						else{
							showLoginPage();
						}
					}
					// nothing to do if ct is available in cookie
					else{
						l$Cordys_LoginDef.resolve();
					}
				}
			}).fail($.cordys.authentication.defaults.preLoginErrorHandler);
			
			return l$Cordys_LoginDef.promise();
		},

		// logout will delete the cookies and will call the login again
		logout : function() {
			var authenticatorType = preloginInfo.Authenticator.Type;
			topLevelWindow.$Cordys_LoginDef = null;
			if(authenticatorType === "cordys") {
				var cookiePath = preloginInfo.SamlArtifactCookiePath.text || '/';	//NOMBV
				deleteAllCookies(cookiePath);
				this.login(true);
			} else if(authenticatorType === "saml2") {
				showLogoutPage(this.defaults.ssoLogoutURL);
			}
		},
		
		// mark that we have started with the login process
		setLoginStarted : function(){
			// Create a login deferred.
			topLevelWindow.$Cordys_LoginDef = this.isLoginPending() ? topLevelWindow.$Cordys_LoginDef : $.Deferred();
			topLevelWindow.$Cordys_LoginDef.startTime = (new Date()).getTime();
			return topLevelWindow.$Cordys_LoginDef;
		},

		// returns true if we are inside the login process
		isLoginPending : function(){
			return (topLevelWindow.$Cordys_LoginDef && topLevelWindow.$Cordys_LoginDef.state() === "pending");
		},

		// returns true if we are inside the login process
		isLoginCompleted : function(){
			return (topLevelWindow.$Cordys_LoginDef && topLevelWindow.$Cordys_LoginDef.state() === "resolved");
		},

		setLoginFailed : function(){
			// reject the login deferred once the authentication is failed
			if(topLevelWindow.$Cordys_LoginDef) {
				topLevelWindow.$Cordys_LoginDef.reject();
			}
		},

		setLoginCompleted : function(){
			// resolve the login deferred once the authentication is completed
			if(topLevelWindow.$Cordys_LoginDef) {
				topLevelWindow.$Cordys_LoginDef.successTime = (new Date()).getTime();
				topLevelWindow.$Cordys_LoginDef.resolve();
			}
		}
	}
	
	$.cordys.authentication.defaults = {
		preloginGatewayURL : "com.eibus.sso.web.authentication.PreLoginInfo.wcp",
		loginURL : $.mobile ? "/cordys/html5/mobilelogin.htm" : "/cordys/html5/login.htm",
		ssoLoginURL : $.mobile ? "/cordys/html5/ssologin.htm" : "wcp/sso/com.eibus.sso.web.authentication.LogMeIn.wcp",
		ssoLogoutURL : $.mobile ? "/cordys/html5/ssologout.htm" : "wcp/sso/com.eibus.sso.web.authentication.LogMeOut.wcp",
		preLoginErrorHandler : preLoginErrorHandler,
		loginErrorHandler : loginErrorHandler
	}	
	
	// get the prelogin request
	function getPreloginRequest(){
		return {
			contentType: 'text/xml; charset="utf-8"',
			type: 'get',
			dataType: 'xml',
			url: $.cordys.authentication.defaults.preloginGatewayURL,
			cache:false,
			headers: { "cache-control": "no-cache" }
		};
	}

	// get the user details request
	function getUserDetailsRequest(){
		return '<SOAP:Envelope xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/">'+
					'<SOAP:Body>'+
						'<GetUserDetails xmlns="http://schemas.cordys.com/1.0/ldap"/>'+
					'</SOAP:Body>'+
				'</SOAP:Envelope>';
	}

	// get the current organization DN by synchronous request
	function getCurrentOrganizationDN() {
		var organizationFromUrl = getOrganizationFromUrl().toLowerCase(),
			currentOrganizationDN = "";
		$.ajax({
			contentType: 'text/xml; charset="utf-8"',
			type: 'post',
			data: getUserDetailsRequest(),
			dataType: 'json',
			url: "com.eibus.web.soap.Gateway.wcp",
			async: false
		}).done(function(userDetails){
			var organizationObjects = $.cordys.json.findObjects(userDetails, 'organization');
			$.each(organizationObjects, function(i, value){
				// check for getting the current organization DN
				// or default organization if base URL prefix is cordys
				if((organizationFromUrl === "cordys" && value["@default"]) || (value.description.toLowerCase() === organizationFromUrl)) {
					currentOrganizationDN = value.dn;
					return false;	// return back from each.
				}
			});
		});
		return currentOrganizationDN;
	}

	// returns the organization name from url
	function getOrganizationFromUrl(){
		var location = window.location,
			organization = getURLParameter(location, "organization");
		if (organization && organization.indexOf(",") != 0) {
			return organization; // take the organization parameter
		} else if (location.toString().split("/")[3] === "cordys"){
			return "cordys"; // use default organization if baseurl is cordys
		} else {
			return decodeURIComponent(location.toString().split("/")[4]); // then based on the organization in the url
		}
	}

	// get Language from the browser
	function getLanguage() {
		return window.navigator.language || window.navigator.userLanguage;	//userLanguage is specific to IE
	}

	// add url data for change page
	function addUrlData(urlData, name, value) {
		var parSeperator = urlData ? "&" : "";
		return value ? (urlData + parSeperator + name + "=" + value) : urlData;
	}

	// shows the Cordys SSO or saml2 login screen
	function showLoginPage() {
		/*var loginURL = $.cordys.authentication.defaults.loginURL,
			authenticatorType = preloginInfo.Authenticator.Type;
		if(authenticatorType === "saml2") {
			var language = getLanguage(),
				authID = decodeURIComponent(getURLParameter(window.location, "authID")),
				currentOrganizationDN = getCurrentOrganizationDN();

			loginURL = $.cordys.authentication.defaults.ssoLoginURL;
		}
		if ($.mobile) {
			var pageFrom = ($.mobile.activePage && $.mobile.activePage.attr("id") ? $.mobile.activePage.attr("id") : $("[data-role='page']").attr("id")),
				urlData = "";

			urlData = addUrlData(urlData, "pageFrom", pageFrom);	// add page from for redirection after login
			if(authenticatorType === "saml2") {
				urlData = addUrlData(urlData, "organization", currentOrganizationDN);	// add current user's organization dn
				urlData = addUrlData(urlData, "language", language);	// add browser language
				urlData = addUrlData(urlData, "authID", authID);	// add authID
			}
			$.mobile.changePage(loginURL, {
				transition: "pop",
				changeHash: false,
				data: urlData
			});

			// let us also close the page when login succeeds
			topLevelWindow.$Cordys_LoginDef.done(function(){
				closeLoginPage();
			});
		} else {
			if(authenticatorType === "saml2") {
				loginURL = addURLParameter(loginURL, "organization", currentOrganizationDN);	// add current user's organization dn
				loginURL = addURLParameter(loginURL, "language", language);	// add browser language
				loginURL = addURLParameter(loginURL, "authID", authID);	// add authID
			}
			window.showModalDialog(loginURL); 
			window.location.reload();
      */
      window.location.href = "../public/index.html";
		//}
	}

	// redirects to the saml2 logout gatway
	function showLogoutPage(logoutURL) {
		if ($.mobile) {
			$.mobile.changePage(logoutURL);
		} else {
			window.showModalDialog(logoutURL);
			window.location.reload();
		}
	}

	// close the login page
	function closeLoginPage(){
		var prevPage = getURLParameter($.mobile.activePage.data("url"), "pageFrom");
		$.mobile.changePage(prevPage ? $("#"+prevPage) : $.mobile.firstPage, {changeHash: false, reverse: true});
	}

	// this method will return the current organization name of the user.
	// TODO - Replace the hard-coded /home/
	// TODO - Replace this with the new API provided by the Core Platform Team
	function getOrganizationName(organizationObjects){
		var organizationName = getURLParameter(window.location, "organization");
		if(organizationName)
			return organizationName;// return the organization name from the URL parameter.
		var pageURL = window.location.href ;
		if(pageURL && pageURL.indexOf("home/") != -1){
			pageURL = pageURL.substring(pageURL.indexOf("home/")+5);
			// return the organization name from the page URL. 
			return pageURL.substring(0,pageURL.indexOf("/"));  
		}
		$.each(organizationObjects, function(i, value){
			if (value["@default"]) {
				organizationDN = value.dn;
				return false; // return back from each.
				// For getting the default organization DN.
			}
		});
		//returning the default organization name.
		return organizationDN.substring(organizationDN.indexOf("o=")+2,organizationDN.indexOf(","));
	}

	// prelogin error handler
	function preLoginErrorHandler(e, statusText, errorThrown) {
		var errorText = (e.responseXML && $(e.responseXML).find("MessageCode").text()) || e.responseText || errorThrown || statusText,
			errorMessage = errorText;
		
		//When Cordys is down on server
		if (errorText == "<Error>SSO configuration not available</Error>" || errorText == "Cordys.WebGateway.Messages.WG_SOAPTransaction_SOAPNodeLookupFailure" || errorText == "Cordys.WebGateway.Messages.WG_SOAPTransaction_ReceiverDetailsInvalid" || errorText == "Cordys.WebGateway.Messages.CommunicationError") {
			errorMessage = "The message cannot be sent to the Single Sign-On service group. Verify if the corresponding service container is up and running.";
		}

		//When there is no connectivity.
		else if (errorText == "error" || (navigator.network && (navigator.network.connection.type == Connection.NONE))) {
			errorMessage = "A connection with the server cannot be established";
		}

		//Show notification when there is no organization. 'test' method is used for comparison because reponse has some special characters
		else if((/Exception occurred while handling the request. Check 'gateway.xml' for more details./).test(errorText)){	//NOMBV
			errorMessage = "Organization_Missing_Error"
		}
		showMessage(errorMessage, "Login Failed");
	}

	// login error handler
	function loginErrorHandler(e, statusText, errorThrown) {
		var errorText = (e.responseXML && $(e.responseXML).find("MessageCode").text()) || (e.responseText && $(e.responseText).find("cordys\\:messagecode").text()) || e.statusText || errorThrown || statusText,
			errorMessage = errorText;
		
		if(errorText == "Cordys.ESBServer.Messages.invalidCredentials"){
			errorMessage = "The username or password you entered is incorrect."
			showMessage(errorMessage, "Invalid Credentials");
		}
		else if(errorText == "Cordys.WebGateway.Messages.InvalidOrganization"){
			errorMessage = "The organization detail provided in the Location is incorrect."
			showMessage(errorMessage, "Invalid Organization");
		}
		//Show the actual error if we couldn't find the reason for the failure
		else {
			showMessage(errorText, "Login Failed");
		}
	}

})(window, jQuery)
/**
 * Cordys Authentication Plugin
 *
 * Copyright (c) 2013 Cordys
 */

;(function (window, $, undefined) {
	
	$.cordys.authentication.sso = {
		// api for authenticating with the credentials specified
		authenticate : function (userName, password){
			$.cordys.authentication.setLoginStarted();

			var $authDeffered = $.Deferred();
			// set the login completed once authentication is done
			$authDeffered.done(function(){
				$.cordys.authentication.setLoginCompleted();
			});

			// Clear the cookies
			deleteAuthCookies().done(function(){
					// Get the Prelogin Info
					$.cordys.authentication.getPreloginInfo().done(function(preloginInfo){
						setAuthContext(preloginInfo);
						// Get the SAML Assertions
						getSAMLAssertions(userName, password).done(function(){
							// Set the Cookies
							setCookies();
							$authDeffered.resolve();
						}).fail(function(e, statusText, errorThrown){
							$.cordys.authentication.defaults.loginErrorHandler(e, statusText, errorThrown);
							//$.cordys.authentication.setLoginFailed();
						});
					}).fail(function() {
						AUTH_CONTEXT.cookies.ct.valid = false;
					});
				}).fail(function() {
				//TODO : Add failure callback for delete cookies
			});
			return $authDeffered.promise();
		},
		// return true if we have cookie
		isAuthenticated : function(){
			var ctCookie = getCookie("\\w*_ct");
			return  !(ctCookie === "" || ctCookie === undefined || ctCookie === null);
		},
		//initialize authentication with the given artifact
		initializeSessionFromArtifact : function (samlArt){
			$.cordys.authentication.getPreloginInfo().done( function(preloginInfo){ 
				setAuthContext(preloginInfo);
				AUTH_CONTEXT.cookies.saml.value = samlArt; //NOMBV
				AUTH_CONTEXT.cookies.saml.valid = true;
				setCookies();
			} )		
		}
	}
	
	$.cordys.authentication.sso.defaults = {
		loginGatewayURL : "com.eibus.web.soap.Gateway.wcp"
	}
	
	var AUTH_CONTEXT = {
		cookies : {
				ct: {
					name: null,
					value: null,
					valid: false
				}, 
				saml: {
					name: null,
					value: null,
					time: null,
					valid: false
				},
				path: '/'
		},
		url : null
	};
	
	// get requestXML for login
	function getLoginRequestXML(userName, password){
		return '<SOAP:Envelope xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/">' + 
				'<SOAP:Header>' + 
					'<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' + 
						'<wsse:UsernameToken xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">' + 
							'<wsse:Username>' + userName + '</wsse:Username>' + 
							'<wsse:Password>' + password + '</wsse:Password>' + 
						'</wsse:UsernameToken>' + 
					'</wsse:Security>' + 
				'</SOAP:Header>' + 
				'<SOAP:Body>' + 
					'<samlp:Request xmlns:samlp="urn:oasis:names:tc:SAML:1.0:protocol" MajorVersion="1" MinorVersion="1" IssueInstant="2012-02-28T18:53:10Z" RequestID="a2bcd8ab5a-342b-d320-aa89-c3de380cd13">' + 
						'<samlp:AuthenticationQuery>' + 
							'<saml:Subject xmlns:saml="urn:oasis:names:tc:SAML:1.0:assertion">' + 
								'<saml:NameIdentifier Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified">' + userName + '</saml:NameIdentifier>' + 
							'</saml:Subject>' + 
						'</samlp:AuthenticationQuery>' + 
					'</samlp:Request>' + 
				'</SOAP:Body>' + 
		'</SOAP:Envelope>';

	}


	// get the saml assertions using the login method
	function getSAMLAssertions(userName, password) {
		var deferred = $.Deferred(),
			login = getLoginRequest(userName, password);
		
		$.ajax(login).done(function(data) {
			var artifact = $(data).find('AssertionArtifact, samlp\\:AssertionArtifact').text();
			
			if (!artifact) {
				deferred.reject();
				return deferred.promise();
			} else {
				AUTH_CONTEXT.cookies.saml.value = artifact;   //NOMBV
				AUTH_CONTEXT.cookies.saml.valid = true;
				deferred.resolve();
			}
			
		}).fail(function(e, statusText, errorThrown) {
			AUTH_CONTEXT.cookies.saml.valid = false;
			deferred.reject(e, statusText, errorThrown);
		});

		return deferred.promise();	
	}
	
	// get the login request
	function getLoginRequest(userName, password){
		return {
			data: getLoginRequestXML(userName, password),
			contentType: 'text/xml; charset="utf-8"',
			type: 'POST',
			dataType: 'xml',
			url: $.cordys.authentication.sso.defaults.loginGatewayURL,
			cache:false,
			headers: { "cache-control": "no-cache" }
		};
	}
	
	// delete the authentication cookies
	function deleteAuthCookies(){
		var deferred = $.Deferred();

		// delete all the cookies
		deleteAllCookies(AUTH_CONTEXT.cookies.path)

		deferred.resolve();
		return deferred.promise();
	}
	
	// set auth context for cookies using prelogin info
	function setAuthContext(preloginInfo) {
		AUTH_CONTEXT.cookies.saml.name = preloginInfo.SamlArtifactCookieName.text;	//NOMBV
		AUTH_CONTEXT.cookies.ct.name = preloginInfo.CheckName.text;	//NOMBV
		AUTH_CONTEXT.cookies.ct.valid = true;
		AUTH_CONTEXT.cookies.path = preloginInfo.SamlArtifactCookiePath.text || '/';	//NOMBV
	}

	// set the saml values in cookies
	function setCookies() {
		var __cordysSAMLArtCookieName = AUTH_CONTEXT.cookies.saml.name,
			__cordysSAMLArtCookieValue = AUTH_CONTEXT.cookies.saml.value, //NOMBV
			__cordysCookiePath = AUTH_CONTEXT.cookies.path;
			
		document.cookie = __cordysSAMLArtCookieName + "=" + __cordysSAMLArtCookieValue +"; path=" + __cordysCookiePath;
		if (__cordysSAMLArtCookieName) {
			if (typeof(hex_sha1) === "undefined"){
				loadScript("/cordys/thirdparty/sha1/sha1.js",function(){setCtCookies(__cordysSAMLArtCookieValue)} );
			}else 
				setCtCookies(__cordysSAMLArtCookieValue);
		}
	}
	//sGenerate and sets the ct value in cookies
	function setCtCookies(SAMLArtCookieValue){
    console.log("set ct cookie");
		var ct = hex_sha1(SAMLArtCookieValue);
		document.cookie = AUTH_CONTEXT.cookies.ct.name + "=" + ct + "; path=" + AUTH_CONTEXT.cookies.path;
	}
	
	
})(window, jQuery)
/**
 * Cordys Binding that needs to implemented by the binding handlers
 *
 * Copyright (c) 2013 Cordys
 */
;(function (window, $, undefined) {

	$.cordys.binding = function(){
		var self = this;
		
		// Should return whether this binding is read-only. Returns true by default
		this.isReadOnly = function(){return true};
		
		// Should return the number of records. Has to implemented by the binding handler.
		this.getSize = function(){$.error("Method 'getSize' should be implemented by the binding handler")};
		
		// Clear all the objects from the collection. Has to implemented by the binding handler.
		this.clear = function(){$.error("Method 'clear' should be implemented by the binding handler")};
		
		// Returns the binding object for the corresponding JS Object. Has to implemented by the binding handler.
		this.getBindingObject = function(jsObject){$.error("Method 'getBindingObject' should be implemented by the binding handler")};
		
		// Add a set of binding objects to the collection
		this.addBindingObjects = function(bindingObjects){$.error("Method 'addBindingObjects' should be implemented by the binding handler")};
		
		// Get the JS Object for the binding object. Has to implemented by the binding handler if it is not readOnly.
		this.getJSObject = function(bindingObject){$.error("Method 'getJSObject' should be implemented by the binding handler")};
		
		// Get the initial state (JS Object for which the binding object was created). Has to implemented by the binding handler if it is not readOnly.
		this.getInitialState = function(bindingobject){$.error("Method 'getInitialState' should be implemented by the binding handler")};
		
		// Returns true if the specified bindingObect is a newly inserted object. Has to implemented by the binding handler if it is not readOnly.
		this.isInsertedObject = function (bindingObject){$.error("Method 'isInsertedObject' should be implemented by the binding handler")};
		
		// Returns true if the specified bindingObect is dirty. Has to implemented by the binding handler if it is not readOnly.
		this.isUpdatedObject = function (bindingObject){$.error("Method 'isUpdatedObject' should be implemented by the binding handler")};
		
		// Returns true if the specified bindingObect is marked for deletion. Has to implemented by the binding handler if it is not readOnly.
		this.isDeletedObject = function (bindingObject){$.error("Method 'isDeletedObject' should be implemented by the binding handler")};
			
		// Insert the binding object into the collection. Has to implemented by the binding handler if it is not readOnly.
		this.insertObject  = function(jsObject){$.error("Method 'insertObject' should be implemented by the binding handler")};
		
		// Update the binding object. Has to implemented by the binding handler if it is not readOnly.
		this.updateObject  = function(jsObject){$.error("Method 'updateObject' should be implemented by the binding handler")};
		
		// Mark the binding object for deletion. Has to implemented by the binding handler if it is not readOnly.
		this.removeObject  = function(jsObject){$.error("Method 'removeObject' should be implemented by the binding handler")};
		
		// Revert changes to the Object. Revert to initial state if dirty, deleted if newly inserted and remove if there are any deletion flags
		this.revertObject  = function(bindingObject){$.error("Method 'revertObject' should be implemented by the binding handler")};
		
		// Synchronize the state state of the binding object to the current state in the backend (specified jsObject). If the jsObject is not specified, the object needs
		// to be deleted
		this.synchronizeObject = function(bindingObject, jsObject){$.error("Method 'synchronizeObject' should be implemented by the binding handler")}

		// Bind the set of bindingObjects to the context. Has to implemented by the binding handler if it is not readOnly.
		this.bindObjects = function(context, bindingObjects){$.error("Method 'bindObjects' should be implemented by the binding handler")};	
	}


})(window, jQuery);
/**
 * Cordys JSRender Binding Plugin
 *
 * Copyright (c) 2013 Cordys
 */
;(function (window, $, undefined) {


	// TODO Check if JSRender is loaded

	$.cordys.binding.jsrender = function(model, settings) {
		var self = this;
		var objects = [];

		
		// Returns the binding object for the corresponding JS Object
		this.getBindingObject = function(jsObject){
			return jsObject;
		};
		
		// Clear all the objects from the collection
		this.clear = function(){
			objects = [];
		};
		
		// Returns the number of Business Objects
		this.getSize = function(){
			return objects.length;
		};
		
		this.getObjects = function(){
			return objects;
		};
		
		// Add a set of binding objects to the collection
		this.addBindingObjects = function(bindingObjects){
			objects = bindingObjects;
			model[model.objectName] = objects;
		};
		
		this.bindObjects = function(context, bindingObjects){
			if (! settings.binding.template){
				return console.log("Binding Template not specified");
			}
			var html = settings.binding.template.render(bindingObjects);
			context.html(html)
						.listview("refresh");
		};
		
	}	


})(window, jQuery);
/**
 * Cordys KO Binding Plugin
 *
 * Copyright (c) 2013 Cordys
 */
;(function (window, $, undefined) {

	$.cordys.binding.knockout = function(model, settings) {
		var self = this;
		
		// add knockoutJS and the mapping plugin if the model is not readOnly
		if (typeof(ko) === "undefined"){
			 loadScript("/cordys/thirdparty/knockout/knockout.js");
		}
		if (typeof(ko.mapping) === "undefined"){
			loadScript("/cordys/thirdparty/knockout/knockout.mapping.js");
		}
		
		var opts = $.extend({}, settings);
		
		// Take care of the mapping options
		opts.mappingOptions = opts.mappingOptions || {};
		opts.mappingOptions.ignore = opts.mappingOptions.ignore || [];
		opts.mappingOptions.ignore.push("_destroy");
		if (opts.fields){
			opts.mappingOptions.include = opts.mappingOptions.include || [];
			$.each(opts.fields, function(i, f) {
				var persisted = typeof(f.persisted) !== "undefined" ? f.persisted : (typeof(f) === "string" || f.isArray || f.fields);
				if (persisted){
					opts.mappingOptions.include.push(f);
				}
			});
		}
		
		// make the object collection observable
		var bindingObjects = model[model.objectName] = ko.observableArray();
		model.selectedItem = ko.observable();
		// bind automatically if the context is set
		if (typeof(opts.context) !== "undefined"){
			ko.applyBindings(model, opts.context);
		}

		this.isReadOnly = function(){
			return false
		};
		
		// Returns the number of Business Objects
		this.getSize = function(){
			return (typeof(bindingObjects) === "function") ? bindingObjects().length : bindingObjects.length;
		};
		
		
		// Returns the binding object for the corresponding JS Object
		this.getBindingObject = function(jsObject){
			var observableObject =  mapObject(jsObject, null, opts.fields, opts.mappingOptions, model.isReadOnly);
			if (! model.isReadOnly){
				addOptimisticLock(model, opts, jsObject, observableObject, false);
			}
			return observableObject;
		};
		
		this.getJSObject = function(bindingObject){
			return  ko.mapping.toJS(bindingObject);
		}
		
		this.synchronizeObject = function(bindingObject, jsObject){
			if (! jsObject){
				// delete the object
				bindingObjects.remove(bindingObject);
			}else if (bindingObject.lock && bindingObject.lock.isDirty()){
				// set the lock to the latest state of the object
				bindingObject.lock._update(jsObject);
			}else if (! bindingObject.lock){
				// the inserted object is synced, so let us add the lock
				addOptimisticLock(self, opts, jsObject, bindingObject, false);
				
				// update the object with what we got from the backend
				bindingObject.lock._update(jsObject);
			}
		}
		
		this.bindObjects = function(context, objects){
			// In KO applyBindings multiple times creates issues. So done only in startup
		}
		
		// Clear all the objects from the collection
		this.clear = function(){
			if (this.getSize() > 0){
				bindingObjects.removeAll();
			}	
		};
		
		
		// Adds the specified Business Object
		this.insertObject = function(object){
			if (! object) return null;
			if (! ko.isObservable(object)){
				object = mapObject(object, null, opts.fields, opts.mappingOptions, model.isReadOnly);
			}
			bindingObjects.push(object);
			return object;
		}
		
		this.getInitialState = function(bindingobject){
			return bindingobject.lock.getInitialState();
		}
		
		// Removes the specified Business Object
		this.removeObject = function(object){
			if (! object) return null;
			if (typeof(model[model.objectName]) !== "function") { // in case of no knockout
				return null;
			}
			if (! object.lock){
				// removing object not yet persisted. so let us just remove it
				model[model.objectName].remove(object);
			}
			else{
				// otherwise we just mark it with the KO destroy flag
				model[model.objectName].destroy(object);
			}
			return object;
		}
		
		this.revertObject  = function(object){
			if (! object.lock){
				// remove newly inserted objects
				model[model.objectName].remove(object);
			}
			else {
				 // revert the changed objects
				 if (object.lock.isDirty()){
					object.lock.undo();
				 }
				 // also unmark ones for deletion. Remember that changed ones could have also been marked for deletion
				 if (object._destroy === true){
					 object.lock._undestroy();
				 }
			}
		};
		
		this.isInsertedObject = function(object){
			return (! object.lock && object._destroy !== true);
		}

		this.isUpdatedObject = function(object){
			return (object.lock && object.lock.isDirty());
		}

		this.isDeletedObject = function(object){
			return (object.lock && object._destroy === true);
		}

		
		// Return the collection of objects
		this.getObjects = function(){
			return bindingObjects();
		};
		
		// Add a set of binding objects to the collection
		this.addBindingObjects = function(objects){
			return bindingObjects(objects);
		};
	}	
		// Maps a JS object into an observable
	var	mapObject = function(dataObject, existingObservable, fields, mappingOptions, isReadOnly){
		var mappedObject = isReadOnly ? dataObject : (existingObservable ? ko.mapping.fromJS(dataObject, mappingOptions, existingObservable) : ko.mapping.fromJS(dataObject, mappingOptions));
		if (fields) {
			mappedObject = mapObjectByFields(dataObject, mappedObject, fields, null, ! isReadOnly, existingObservable);
		}
		return mappedObject;
	}

	// Create bindingObjects from a data object against fields, supporting child objects, arrays, compute, paths and others.
	var mapObjectByFields = function(dataObject, mappedObject, objectFields, rootObject, createObservables, existingObservable) {
		if (!rootObject) rootObject = dataObject;

		$.each(objectFields, function(i, f) {
		
			if (typeof(f) === "string") {
				if (! mappedObject[f]){
					mappedObject[f] = createObservables ? ko.observable() : undefined;	// add the field if it is not there, to avoid ko "Unable to parse binding" error
				}
				else if (! dataObject[f]){
					createObservables ? mappedObject[f](undefined) : (mappedObject[f] = undefined);
				}
			} else {
				if (!f.name) throw new Error("Mandatory property 'name' not specified");
				var value = ko.utils.unwrapObservable(mappedObject[f.name]);

				if (f.path) {	// get the value from the dataObject via the specified path
					var spath = f.path.split(".");
					value = dataObject;
					for (var i=0; i<spath.length; i++) {
						if (typeof(value) == "undefined") break;
						value = (spath[i] == "$root") ? rootObject : ko.utils.unwrapObservable(value[spath[i]]);
					}
				}
				if (f.computed) {	// create a knockout computed object to get the value
					if (! ko.isComputed(mappedObject[f.name])){
						mappedObject[f.name] = ko.computed(f.computed, mappedObject);
					}
					return mappedObject;
				}
				if (f.isArray) {
					if (value) {
						if (!$.isArray(value)) {	// wrap the value into an array
							value = [value];
						}
					} else {	// create an empty array
						value = [];
					}
					if ($.isArray(mappedObject[f.name])){
						createObservables ? mappedObject[f.name](value) : mappedObject[f.name] = value;
					}else{
						mappedObject[f.name] = createObservables ? ko.observableArray(value) : value;
					}
				} else {
					if (!mappedObject[f.name] || f.path){
						 if (mappedObject[f.name]){
							createObservables ? mappedObject[f.name](value) : (mappedObject[f.name] = value);
						 }else{
							mappedObject[f.name] = createObservables ? ko.observable(value) : value;
						}
					}
				}
				if (f.fields) {	// recursively map child objects
					if ($.isArray(value)) {
						for (var i=0; i<value.length; i++) {
							mapObjectByFields(value[i], createObservables ? mappedObject[f.name]()[i] : mappedObject[f.name][i], f.fields, rootObject, createObservables);
						}
					} else {
						mapObjectByFields(value, mappedObject[f.name], f.fields, rootObject, createObservables);
					}
				}
			}
		})

		return mappedObject;
	}
		
	// Adds lock. This stores the initial state, so that you can identify objects that are changes as well as know their old values
	var addOptimisticLock = function(model, opts, data, observableData, isInitiallyDirty) {
		var result = function() {}
		var _initialState = data;
		var _initialJSONString = ko.mapping.toJSON(observableData);
		var _isInitiallyDirty = ko.observable(isInitiallyDirty);
		
		// Gets initial state of the objects
		result.getInitialState = function() {
			return _initialState;
		}

		// Returns if the object is changed
		result.isDirty = function() {
			return observableData && (_isInitiallyDirty() || _initialJSONString !== ko.mapping.toJSON(observableData));
		}

		// Strictly to be used internally. Updates the lock(the initial state) to the current state of the object
		result._updateLock = function(data) {
			_initialState = data ? data : ko.mapping.toJS(observableData); 
			_initialJSONString = ko.mapping.toJSON(observableData);
			_isInitiallyDirty(false);
		};

		// Strictly to be used internally. Updates the current state and the lock after successful update/insert
		result._update = function(newData) {
			mapObject(newData, observableData, opts.fields, opts.mappingOptions, false);
			this._updateLock(newData);
		}

		// Used internally for unmarking objects marked for deleteion
		result._undestroy = function() {
			// KO Observable array does not have a undestroy, so let us just remove the destroy flag after a change notification
			model[model.objectName].valueWillMutate();
			delete observableData._destroy;
			model[model.objectName].valueHasMutated();
		}

		// Sets the object back to the initial state
		result.undo = function() {
			if (this.isDirty()){			
				this._update(_initialState);
			}
		};
		observableData.lock = result;
		return result;
	};

})(window, jQuery);
/**
 * Cordys Case Plugin
 *
 * Copyright (c) 2013 Cordys
 */
;(function (window, $, undefined) {

	if (!$.cordys) {
		throw new Error("The Cordys HTML5 SDK is required, please ensure it is loaded properly");
	}

	$.cordys['case'] = new function() {
		var self = this;

		this.createCase = function(caseModel, caseVariables, caseData, options) {
			if (caseVariables) {
				caseData = caseData || {data:{}};
				if (caseData.data.constructor !== Array) { caseData.data = [caseData.data]; }
				caseData.data.push( getCaseVariablesData(caseVariables) );
			}
			options = getOptionsForCaseMethod("CreateCase", options, {
				model: caseModel,
				casedata: caseData
			});
			return $.cordys.ajax(options);
		};
		
		this.getActivityDefinition = function(caseInstance,activities, options) {
			options = getOptionsForCaseMethod("GetActivityDefinition", options);
			options.parameters = options.parameters || {};
			$.extend(options.parameters, {
				caseinstanceid: getCaseInstanceId(caseInstance),
				activities: {"activityid" :activities }
			});
			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.findObjects(response, "case:activity");
			});
		};
				
		this.getActivityInstance = function(caseInstance,activityInstanceId,options) {
			options = getOptionsForCaseMethod("GetActivityInstance", options);
			options.parameters = options.parameters || {};
			$.extend(options.parameters, {
				caseinstanceid: getCaseInstanceId(caseInstance),
				activityinstanceid: activityInstanceId
			});

			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.find(response, "ACTIVITY_INSTANCE");
			});
		};
		
		this.getActivityInstances = function(caseInstance,options) {
			options = getOptionsForCaseMethod("GetActivityInstances", options);
			options.parameters = options.parameters || {};
			$.extend(options.parameters, {
				caseinstanceid: getCaseInstanceId(caseInstance)
			});

			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.findObjects(response, "ACTIVITY_INSTANCE");
			});
		};

		this.getBusinessEvents = function(caseInstance,activityId, options) {
			options = getOptionsForCaseMethod("GetBusinessEvents", options);
			options.parameters = options.parameters || {};
			options.parameters.caseinstanceid = getCaseInstanceId(caseInstance);
			options.parameters.activityid = activityId;	

			return $.cordys.ajax(options).then(function(response) {
			   	return $.cordys.json.findObjects(response, "case:event");
			});
		};

		this.getCaseInstance = function(caseInstance, options) {
			options = getOptionsForCaseMethod("GetCaseInstance", options);
			options.parameters = options.parameters || {};
			options.parameters.caseinstanceid = getCaseInstanceId(caseInstance);

			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.find(response, "CASE_INSTANCE");
			});
		};

		this.getCaseData = function(caseInstance, options) {
			options = getOptionsForCaseMethod("GetCaseData", options);
			options.parameters = options.parameters || {};
			options.parameters.caseinstanceid = getCaseInstanceId(caseInstance);

			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.find(response, "casedata");
			});
		};

		this.getCaseVariables = function(caseInstance, options) {
			options = getOptionsForCaseMethod("GetCaseVariables", options);
			options.parameters = options.parameters || {};
			options.parameters.caseinstanceid = getCaseInstanceId(caseInstance);

			return $.cordys.ajax(options).then(function(response) {
				var casedata = $.cordys.json.find(response, "casedata");
				// Get the case variables as an array of the variables, removing the case prefix.
				var vars = casedata.data["case:casevariables"],
					variables = {};
				for (var v in vars) {
					if (typeof(vars[v]) === "object") {
						variables[v.replace(/^[^:]*:/,"")] = vars[v];
					}
				}
				casedata.data = {"casevariables" : variables};
				return casedata;
			});
		};

		this.getFollowupActivities = function(caseInstance,activityid, options) {
			options = getOptionsForCaseMethod("GetFollowupActivities", options);
			options.parameters = options.parameters || {};
			options.parameters.caseinstanceid = getCaseInstanceId(caseInstance);
			options.parameters.activityid = activityid;

			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.findObjects(response, "case:followup");
			});
		};

		this.planActivities = function(caseInstance,activities, options) {
			options = getOptionsForCaseMethod("PlanActivities", options, {
				caseinstanceid: getCaseInstanceId(caseInstance),
				planactivities : { "activity" : activities}
			});
			return $.cordys.ajax(options).then(function(response){
				return $.cordys.json.findObjects(response, "state");
			});
		};

		this.planIntermediateActivities = function(caseInstance,activityInstanceId,activityId,activities,options) {
			options = getOptionsForCaseMethod("PlanIntermediateActivities", options, {
				caseinstanceid: getCaseInstanceId(caseInstance),
				activityinstanceid: {
					'@activityid': activityId,
					text: activityInstanceId
				},
				planactivities : { "activity" : activities}
			});
			return $.cordys.ajax(options);
		};

		this.sendEvent = function(caseInstance, eventName,sourceId, options) {
			options = getOptionsForCaseMethod("SendEvent", options, {
				caseinstanceid: getCaseInstanceId(caseInstance),
				event: {
					text: eventName,
					'@source': sourceId
				}
			});
			return $.cordys.ajax(options);
		};

		this.updateCaseData = function(caseInstance, caseData, options) {
			options = getOptionsForCaseMethod("UpdateCaseData", options, {
				caseinstanceid: getCaseInstanceId(caseInstance),
				casedata: caseData
			});
			return $.cordys.ajax(options);
		};

		this.updateCaseVariables = function(caseInstance, caseVariables,lockid,options) {
			options = getOptionsForCaseMethod("UpdateCaseVariables", options, {
				caseinstanceid: getCaseInstanceId(caseInstance),
				casedata: {
					"@lockID" : lockid,
					data: getCaseVariablesData(caseVariables)
				}
			});
			return $.cordys.ajax(options);
		};
		return this;
	};

	function getOptionsForCaseMethod(methodName, options, defaultParameters, namespace) {
		options = options || {};
		var ajaxOptions = $.extend({
			method: methodName,
			namespace: namespace || "http://schemas.cordys.com/casemanagement/execution/1.0",
			dataType: 'json'
		}, options);
		ajaxOptions.parameters = $.extend(defaultParameters, options.parameters);
		return ajaxOptions;
	}

	function getCaseInstanceId(caseInstance) {
		var id = (typeof(caseInstance) === "object") 
				? (caseInstance.ProcessInstanceId || caseInstance.CaseInstanceId || caseInstance.caseinstanceid) 
				: caseInstance;
		// If it is an observable, call the method to get the value, otherwise just return the value
		return (typeof(id) === "function") ? id() : id;
	}

	function getCaseVariablesData(caseVars) {
		var returnData = {
			"@xmlns:case": "http://schemas.cordys.com/casemanagement/1.0",
			"@name": "case:casevariables",
			"case:casevariables": {}
		};
		for (var vName in caseVars) {
			var newName = (vName.indexOf("case:") !== 0) ? "case:" + vName : vName;
			returnData["case:casevariables"][newName] = caseVars[vName];
		}
		return returnData;
	}

})(window, jQuery)
/**
 * Cordys P-Model Plugin
 *
 * Copyright (c) 2013 Cordys
 */
;(function (window, $, undefined) {

	if (!$.cordys) $.cordys = {};
	if (!$.cordys.ajax) loadScript("/cordys/html5/plugins/cordys.ajax.js");

	$.cordys.binding = $.cordys.binding || {};
	
	$.cordys.model = function(settings) {
		var self = this;
		var opts = $.extend({}, $.cordys.model.defaults, settings);
		this.objectName = settings.objectName;
		
		// set read-only - take readonly if set in opts, otherwise we see if one of the change settings is specified and then default to the model.defaults
		this.isReadOnly = settings.hasOwnProperty("isReadOnly") ? (settings.isReadOnly === true) : 
			(typeof(settings.create || settings.update || settings['delete']) === "undefined") ? $.cordys.model.defaults.isReadOnly : false;
		
		// throw an error or write to the console if a handler is specified but is not available (mostly since the script was not loaded)
		if (opts.binding && opts.binding.hasOwnProperty("handler") && (!opts.binding.handler)){
			$.error("The model binding handler specified in the binding options is not available");
		}
		
		// get the binding handler implementation. Default to knockout for backwards compatibility
		var bindingHandlerClass = opts.binding && opts.binding.handler || $.cordys.binding.knockout;
		
		// get the default methods so that we do not have to check each time
		bindingHandlerClass.prototype = new $.cordys.binding();
		
		// create the binding handler
		var bindingHandler = new bindingHandlerClass(self, opts);
		
		if (! this.isReadOnly && bindingHandler.isReadOnly()){
			$.error("The model binding handler is readonly and does not support CRUD operations");
		}
		
		// Returns the binding handler
		this.getBindingHandler = function(){
			return bindingHandler;
		};
	
		// Sends the get/read request
		this.read = function(readSettings) {
			var readOptions = $.extend(true, {}, settings.defaults, settings.read, readSettings);
			readOptions._$Def = $.Deferred();
			readOptions.context = readOptions;

			$.cordys.ajax(readOptions).done(function(data) {
				var objects = getObjects(data, self.objectName);
				// store the cursor details
				handleCursorAfterRead(data, objects.length);
				objects = self.putData(objects);
				
				this._$Def.resolve(objects, this);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				this._$Def.reject(jqXHR, textStatus, errorThrown, this);
			});
			return readOptions._$Def.promise();
		};
		
		this.putData = function(data) {
			var objects = ($.isArray(data)) ? data : getObjects(data, self.objectName);
			if (objects.length == 0 && (typeof(data) === "object")) objects = (data.length) ? [data] : [];
			if (objects.length > 0) {
				for (var objectKey in objects){
					var object = objects[objectKey], 
						bindingObject = bindingHandler.getBindingObject(object);
					objects[objectKey] = bindingObject;
				}

				this.clear();
				bindingHandler.addBindingObjects(objects);
				//self[self.objectName] = bindingHandler.getObjects();
				bindingHandler.bindObjects(opts.context, objects);
				
			}
			return objects;
		};
		
		// Returns the number of Business Objects
		this.getSize = function(){
			return bindingHandler.getSize();
		}
		
		// Empties the model
		this.clear = function(){
			bindingHandler.clear();
		}
		
		// Adds the specified Business Object
		this.addBusinessObject = function(object){
			return bindingHandler.insertObject(object);
		}

		// Removes the specified Business Object
		this.removeBusinessObject = function(object){
			return bindingHandler.removeObject(object);
		}

		// Reverts all local changes
		this.revert = function(objectToRevert) {
			if (typeof (objectToRevert) !== "undefined"){
				bindingHandler.revertObject(objectToRevert);
			}else{
				var objects = bindingHandler.getObjects();
				for (var objectKey in objects){
					var object = objects[objectKey];
					bindingHandler.revertObject(object);
				}
			}
		}
		
		// Gets the next set of records
		this.getNextPage = function(nextPageSettings){
			if (self.cursor){
				nextPageSettings = $.extend(true, {}, nextPageSettings, {parameters:{cursor:self.cursor}});
			}
			return this.read(nextPageSettings);
		}

		// Gets the previous set of records
		this.getPreviousPage = function(previousPageSettings){
			if (self.cursor){
				var previousPosition = self.cursor['@position'] - (self.cursor['@numRows'] * 2);
				self.cursor['@position'] = previousPosition < 0 ? 0 : previousPosition;
				previousPageSettings = $.extend(true, {}, previousPageSettings, {parameters:{cursor:self.cursor}});
			}
			return this.read(previousPageSettings);
		}

		// Returns true if there are more records to move forward in the cursor
		this.hasNext = function(){
			if (this.getSize() === 0) return false;
			if (typeof(self.cursor) === "undefined" || typeof(self.cursor['@position']) === "undefined") return false;
			if (typeof(self.cursor['@id']) === "undefined") return false;
			var currentPosition = typeof(self.cursor['@position']) === "undefined" ? 0 : parseInt(self.cursor['@position']);
			var currentMaxRows =  typeof(self.cursor['@maxRows']) === "undefined" ? 0 : parseInt(self.cursor['@maxRows']);
			return (currentPosition < currentMaxRows);
		}

		// Returns true if there are records to move backwards in the cursor
		this.hasPrevious = function(){
			if (this.getSize() === 0) return false;
			if (typeof(self.cursor) === "undefined") return false;
			var currentPosition = typeof(self.cursor['@position']) === "undefined" ? 0 : parseInt(self.cursor['@position']);
			if (currentPosition === 0) return false;

			var numRows =  typeof(self.cursor['@numRows']) === "undefined" ? 0 : parseInt(self.cursor['@numRows']);
			return (currentPosition > numRows);
		};

		
				// Sends all inserted objects to the backend
		this.create = function(createSettings) {
			var options = $.extend(true, {}, settings.defaults, settings.create, createSettings);
			options.parameters = getUpdateParameters(options, true, false, false);

			return ajaxUpdate(options);
		};

		// Sends all updated objects to the backend
		this.update = function(updateSettings) {
			var options = $.extend(true, {}, settings.defaults, settings.update, updateSettings);
			options.parameters = getUpdateParameters(options, false, true, false);

			return ajaxUpdate(options);
		};

		// Sends all deleted objects to the backend.
		this['delete'] = function(deleteSettings) {
			var _deleteOpts = $.extend(true, {}, settings.defaults, settings['delete'], deleteSettings);
			_deleteOpts.parameters = getUpdateParameters(_deleteOpts, false, false, true);

			return ajaxUpdate(_deleteOpts);
		};

		// Sends all local changes (inserted, updated, deleted objects) to the backend.
		this.synchronize = function(synchronizeSettings) {
			var options = $.extend(true, {}, settings.defaults, settings.update, synchronizeSettings);
			options.parameters = getUpdateParameters(options, true, true, true);

			return ajaxUpdate(options);
		};
		
		var getUpdateParameters = function (settings, sendInsert, sendUpdate, sendDelete){
			var synchronizeContent = [];
			var objectsToBeUpdated = [];

		
			var objects = bindingHandler.getObjects();
			if (objects){
				for (var objectKey in objects){
					var object = objects[objectKey];
					if (sendDelete && bindingHandler.isDeletedObject(object)){
						if (bindingHandler.isInsertedObject(object)){
							// if it was a newly inserted object that was deleted, let us not send it to the backend, but just silently remove it
							bindingHandler.synchronizeObject(object);
						}else{
							objectsToBeUpdated.push(object);
							// get the old bo from the initial saved state
							var oldObject = bindingHandler.getInitialState(object);
							// get the corresponding XML for the deleted object and add it to the content to be send back
							synchronizeContent.push($.cordys.json.js2xmlstring(opts.useTupleProtocol ? wrapInTuple(oldObject,null): wrapInObject(opts.objectName, oldObject)));
						}	
					}else if (sendUpdate && bindingHandler.isUpdatedObject(object)){
						objectsToBeUpdated.push(object);
						// get the old bo from the initial saved state
						var oldObject = bindingHandler.getInitialState(object);
						// get the new bo by unwrapping the Observable object
						var newObject = bindingHandler.getJSObject(object);
						// get the corresponding XML for the object and add it to the updateContent
						synchronizeContent.push($.cordys.json.js2xmlstring(opts.useTupleProtocol ? wrapInTuple(oldObject,newObject) : wrapInObject(opts.objectName, newObject)));
					}
					else if (sendInsert && bindingHandler.isInsertedObject(object)){
						// just double check whether it was an object deleted before persisting directly using KO API's
						objectsToBeUpdated.push(object);
						// get the new bo by unwrapping the Observable object
						var newObject = bindingHandler.getJSObject(object);
						// get the corresponding XML for the inserted object and add it to the insertContent
						synchronizeContent.push($.cordys.json.js2xmlstring(opts.useTupleProtocol ? wrapInTuple(null, newObject) : wrapInObject(opts.objectName, newObject)));

					}
				}
			}

			settings.objectsToBeUpdated = objectsToBeUpdated;
			return synchronizeContent.join("");
		}

		
		var ajaxUpdate = function(settings) {
			settings._$Def = $.Deferred();
			settings.context = settings; // setting this pointer in all ajax handlers (beforeSend, success, error, done, fail...)
			if ( self.isReadOnly || (settings.objectsToBeUpdated.length == 0) ) {
				settings._$Def.reject(null, "canceled", null, settings); // to be compatible with previous version
			} else {
				$.cordys.ajax(settings).done(function(data, textStatus, jqXHR) {
					mergeUpdate(data, this.objectsToBeUpdated);
					this._$Def.resolve(data, textStatus, this);
				}).fail(function(jqXHR, textStatus, errorThrown) {
					handleError(jqXHR.error(), this.objectsToBeUpdated);
					if (this.showError) {
						showErrorDialog(jqXHR.error(), "Error on Update");
					}
					this._$Def.reject(jqXHR, textStatus, errorThrown, this);
				});
			}
			return settings._$Def.promise();
		}

		
		// handles error in insert, update, delete, sync response. Updates the lock and current state to the current state from the response if specified
		var handleError = function(error, objectsToBeUpdated){
			if (opts.useTupleProtocol){
				// let us find the tuples from the error detail
				var tuples = $(error.responseXML).find("detail tuple");
				for (var count=0; count<tuples.length; count++){
					var tuple = tuples[count];
					// check for tuples with an error
					if ($(tuple).find("error").length > 0){
						var faultNew = $(tuple).find("new")[0];
						var faultOld = $(tuple).find("old")[0];
						var objectBeforeUpdation = objectsToBeUpdated[count];

						if (faultNew){
							if (faultOld){
								// it is an update failure
								// get the latest persisted state into a json object
								var currentPersistedState = getObjects($.cordys.json.xml2js(faultOld), self.objectName)[0];
								// let us merge the tuples which has the error in it with the latest persisted state in it
								bindingHandler.synchronizeObject(objectBeforeUpdation, currentPersistedState);
							}
							else{
								// it is an insert failure. we do not have anything to do here
							}
						}
						else{
							// it is an delete failure
							// get the latest persisted state into a json object
							var currentPersistedState = getObjects($.cordys.json.xml2js(faultOld), self.objectName)[0];
							// let us merge the tuples which has the error in it with the latest persisted state in it
							bindingHandler.synchronizeObject(objectBeforeUpdation, currentPersistedState);
						}
					}
				}
			}
		};

		// merges the response received after insert, update, delete, sync with the current data
		var mergeUpdate = function (data, objectsToBeUpdated){

			var synchronizedObjects;
			if (opts.useTupleProtocol) {
				// get the updated tuples
				synchronizedObjects =  $.map($.isArray(data.tuple) ? data.tuple : [data.tuple], function(tuple){
						return getObjects(tuple['new'] ? tuple['new'] : tuple['old'], self.objectName)
				});
			} else {
				synchronizedObjects = getObjects(data, self.objectName);
			}
	
			for (var count=0; count<objectsToBeUpdated.length; count++){
				var object = objectsToBeUpdated[count];
				// Call sync so that the delete marked object is actually removed
				if (bindingHandler.isDeletedObject(object)){
					bindingHandler.synchronizeObject(object);
				}else{
					bindingHandler.synchronizeObject(object, opts.useTupleProtocol ? synchronizedObjects[count] : bindingHandler.getJSObject(object));
				}
			}
		}
		
		
		// create a json structure to represent the tuple with the specified old and new Business Object (can alson pass null  values 
		// in case where the old or new is not required
		var wrapInTuple = function(oldBusObject, newBusObject) {
			var tuple = {};
			if (oldBusObject) {	
				tuple.old = wrapInObject(self.objectName, oldBusObject);
			}
			if (newBusObject) {	
				tuple['new'] = wrapInObject(self.objectName, newBusObject);
			}
			return {tuple:tuple};
		}

		var wrapInObject = function(name, object){
			var wrappedObject = {};
			wrappedObject[name] = object;
			return wrappedObject;
		}
		
		var handleCursorAfterRead = function(data, nrObjects) {
			var cursor = getObjects(data, "cursor")[0];
			if (typeof(cursor) !== "undefined" && typeof(cursor['@id']) === "undefined" && typeof(self.cursor) !== "undefined" && typeof(self.cursor['@position']) !== "undefined"){
				if (nrObjects === 0) {
					cursor['@position'] = parseInt(self.cursor['@position']);
					self.cursor = cursor;
					self.clear();
					return false;
				} else {
					// in case we do not have an id copy the cursor position from the earlier one and adjust so that we know how to go previous
					cursor['@position'] = parseInt(self.cursor['@position']) + parseInt(cursor['@numRows']);
				}
			}
				
			self.cursor = cursor ? cursor : null;
		};
		
		// gets all the objects with the specified key name and value. Value is optional
		var getObjects = function(obj, key, val) {
			var objects = [];
			for (var i in obj) {
				if (!obj.hasOwnProperty(i)) continue;
				if (typeof obj[i] == 'object') {
					if (i == key) {
						if ($.isArray(obj[i])) {
							for (var j=0; j<obj[i].length; j++) {
								objects.push(obj[i][j]);
							}
						} else {
							objects.push(obj[i]);
						}
					} else {
						objects = objects.concat(getObjects(obj[i], key, val));
					}
				} else if (i == key && obj[key] == val) {
					objects.push(obj);
				}
			}
			return objects;
		};
	}
	
	// default settings for all instances
	$.cordys.model.defaults = {
		useTupleProtocol: true,
		isReadOnly : true
	}
	
})(window, jQuery);
/**
 * Cordys Process Plugin
 *
 * Copyright (c) 2013 Cordys
 */
;(function (window, $, undefined) {

	if (!$.cordys) {
		throw new Error("The Cordys HTML5 SDK is required, please ensure it is loaded properly");
	}

	$.cordys.process = new function() {
		var self = this;

		this.getBusinessIdentifiers = function(processInstance, options) {
			options = getOptionsForProcessMethod("GetBusinessIdentifierValues", 
				"http://schemas.cordys.com/pim/queryinstancedata/1.0", 
				options, {processInstanceID : getProcessInstanceId(processInstance)}
			);

			var callback = options.success;
			options.success = null;

			return $.cordys.ajax(options).then(function(response) {
				var identifiers = $.cordys.json.findObjects(response, "BusinessIdentifier");
				identifiers = identifiers.sort(function(a, b) {
					return parseInt(a.Sequence) > parseInt(b.Sequence);
				});
				if (callback) {
					callback(identifiers);
				}
				return identifiers;
			});
		};

		this.startProcess = function(processIdent, processMessage, options) {
			options = options || {};
			options.parameters = $.extend({type: "definition"}, options.parameters);
			return this.executeProcess(processIdent, processMessage, options);
		};

		this.executeProcess = function(processInstance, processMessage, options) {
			options = options || {};
			if ($.isArray(options.parameters)) {
				options.parameters = mergeArraysWithDistinctKey(options.parameters || [], [
					{name:"receiver",	value: getProcessInstanceId(processInstance)},
					{name:"type",		value: "instance"},
					{name:"message",	value: processMessage}
				], "name");
			} else {
				options.parameters = $.extend({
					receiver: getProcessInstanceId(processInstance),
					type: "instance",
					message: processMessage
				}, options.parameters);
			}
			options = $.extend({
				method: "ExecuteProcess",
				namespace: "http://schemas.cordys.com/bpm/execution/1.0",
				dataType: 'json'
			}, options);
			return $.cordys.ajax(options);
		};

		return this;
	};

	function mergeArraysWithDistinctKey(arr1, arr2, key) {
		// Objects from arr2 will only be added when object with same key is not in arr1
		var result = arr1;
		$.each(arr2, function() {
			var value = this[key], found = false;
			$.each(arr1, function() {
				if (this[key] == value) found = true;
			});
			if (!found) result.push(this);
		});
		return result;
	}

	function getOptionsForProcessMethod(methodName, namespace,options, defaultParameters) {
		options = options || {};
		var ajaxOptions =  $.extend({
			method: methodName,
			namespace: namespace || "http://schemas.cordys.com/bpm/execution/1.0",
			dataType: 'json'
		}, options);
		ajaxOptions.parameters = $.extend(defaultParameters, options.parameters);
		return ajaxOptions;
	}

	function getProcessInstanceId(processInstance) {
		var id = (typeof(processInstance) === "object") ? processInstance.ProcessInstanceId || processInstance.SourceInstanceId : processInstance;
		// If it is an observable, call the method to get the value, otherwise just return the value
		return (typeof(id) === "function") ? id() : id;
	}

})(window, jQuery)
/**
 * Cordys Translation Plugin
 *
 * Copyright (c) 2013 Cordys
 */
;(function (window, $, undefined) {

	if (!$.cordys) $.cordys = {};
	
	var messageBundles = [];

	$.cordys.translation = {
		defaultLanguage : "en-US",
		xmlstoreRootPath : "/Cordys/WCP/Javascript/translation/",
		nativeRootPath : "translation/"
	};

	$.cordys.translation.getBundle = function(path, language)
	{
		return getRuntimeLanguage(language).then(function(language){
			path = path.replace(/^[\/\\]/, "");
			var key = path + "_" +language;
			var bundle = messageBundles[key];
			if(! bundle){
				messageBundles[key] = bundle = new MessageBundle(path, language);
			}
			return bundle;
		});
	}

	var getRuntimeLanguage = function(language) {
		var _$DefLanguage = $.Deferred();
		language = language || (typeof(getURLParameter) != "undefined" ? getURLParameter(window.location, "language") : "");
		if (!language) {
			// if in the native app
			if ((typeof Cordys !== "undefined" )&& (typeof Cordys.getLocale !== "undefined" )){
				Cordys.getLocale().done(function(locale){
					_$DefLanguage.resolve(locale);
				});
			}
			else if ($.cordys.isMobile && $.cordys.mobile && $.cordys.mobile.globalization) {
				$.cordys.mobile.globalization.getLocaleName().done(function(result){
					_$DefLanguage.resolve(result);
				}).fail(function(error){
					// unable to get the language, take default language
					_$DefLanguage.resolve($.cordys.translation.defaultLanguage);
				});
			} else if (window.navigator.language)
			{
				_$DefLanguage.resolve(window.navigator.language);
			}
			else if (typeof($.cordys.ajax) != "undefined") {
				// call TranslationGateway to get user language
				$.cordys.ajax({
					url:"/cordys/com.cordys.translation.gateway.TranslationGateway.wcp",
					data: "",
					dataType:"xml",
					error: function(){
						return false; // skip error message
					}
				}).done(function(data){
					var jsData = $.cordys.json.xml2js(data);
					if (jsData && jsData.browserpreferences) _$DefLanguage.resolve(jsData.browserpreferences.language);
					else _$DefLanguage.resolve($.cordys.translation.defaultLanguage);
				}).fail(function(jqXHR, textStatus, errorThrown){
					// unable to get the language, take default language
					_$DefLanguage.resolve($.cordys.translation.defaultLanguage);
				});
			} else {
				// unable to get the language, take default language
				_$DefLanguage.resolve($.cordys.translation.defaultLanguage);
			}
		}
		if (language) _$DefLanguage.resolve(language);
		return _$DefLanguage.promise();
	}

	var MessageBundle = function(path, language) {
		var self = this;
		this.path = path;
		this.dictionary = null;

		this.getMessage = function(/*any number of arguments supported, first argument should be message id*/) {
			var id = arguments[0], label = null, ttext = "";
			if (self.dictionary) {
				label = $.cordys.json.find(self.dictionary, "@textidentifier", id);
			}
			ttext = label ? (label[language] ? (label[language].text || label[language]) : id) : id;	//NOMBV
			if (arguments.length > 1) {
				var args = Array.prototype.slice.call(arguments).slice(1); // Create new array without first argument
				ttext = ttext.replace(/\{(\d+)\}/g,function() {
					return typeof(args[arguments[1]]) !== "undefined" ? args[arguments[1]] : arguments[0];
				});
			}
			return ttext;
		}

		this.translate = function(selector, fp) {
			if (!selector) selector = "[data-translatable='true']";
			$(selector).each(function(){
				var $this = $(this);
				if (fp) {
					fp.call(this, self.getMessage($this.is(":input") ? $this.val() : $this.text()));
				} else {
					if ($this.is(":input")) {
						$this.val(self.getMessage($this.val()));
					} else {
						$this.text(self.getMessage($this.text()));
					}
				}
			});
		}
		
		var _$DefBundle = $.Deferred();
		var loadMessageBundle = function(path, language){
			var key = path + "_" +language;
			if (typeof($.cordys.ajax) != "undefined") {
			return $.cordys.ajax({
				method: "GetXMLObject",
				namespace: "http://schemas.cordys.com/1.0/xmlstore",
				context: self,
				dataType:"json",
				parameters: {
					key: $.cordys.translation.xmlstoreRootPath + key + ".mlm"
				}
			}).then(function(response) {
				self.dictionary = $.cordys.json.find(response, "dictionary");
				_$DefBundle.resolve(self);
			}, errorHandler);
			} else {
				// called from native. Try to get the resource file from mobile filesystem
				return $.ajax({
					type: "GET",
					url: $.cordys.translation.nativeRootPath + key + ".xml",
					async: true,
					cache: true
				}).then(function(response) {
					self.dictionary = $.cordys.json.find($.cordys.json.xml2js(response), "dictionary");
					_$DefBundle.resolve(self);
				}, errorHandler);
			}
		}
		
		var errorHandler = function(jqXHR, textStatus, errorThrown){
			if (language !== $.cordys.translation.defaultLanguage){
				loadMessageBundle(path, $.cordys.translation.defaultLanguage);
			}else{
				_$DefBundle.reject();
				alert("An error occurred while retrieving the language package. The error details are as follows: " + textStatus);
			}
		}

		loadMessageBundle(this.path, language);
		return _$DefBundle;
	}

})(window, jQuery)

/**
 * Cordys Workflow Plugin
 *
 * Copyright (c) 2013 Cordys
 */
;(function (window, $, undefined) {

	if (!$.cordys) {
		throw new Error("The Cordys HTML5 SDK is required, please ensure it is loaded properly");
	}

	$.cordys.workflow = new function() {
		var self = this;

		this.getTasks = function(options) {
			options = getOptionsForWorkflowMethod("GetTasks", "", options, {
				OrderBy: "Task.StartDate DESC",
				ShowNonWorkableItems: "false",
				ReturnTaskData: "false"
			});
			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.findObjects(response, "Task");
			});
		};
		this.getAllTasksForUser = function(options) {
			options = getOptionsForWorkflowMethod("GetAllTasksForUser", "", options, {
				OrderBy: "Task.StartDate DESC"
			});
			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.findObjects(response, "Task");
			});
		};
		this.getPersonalTasks = function(options) {
			options = getOptionsForWorkflowMethod("GetTasks", "", options, {
				OrderBy: "Task.StartDate DESC"
			});
			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.findObjects(response, "Task");
			});
		};
		this.getTaskDetails = function(task, options) {
			options = options || {};
			options.parameters = options.parameters || {};
			options.parameters.TaskId = getTaskId(task);
			options = getOptionsForWorkflowMethod("GetTask", "", options, {
				ReturnTaskData:"true",
				RetrievePossibleActions:"true"
			});
			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.find(response, "Task");
			});
		};
		this.getAllTargets = function(options) {
			options = getOptionsForWorkflowMethod("GetAllTargets", "", options, {
					TaskCountRequired: "true"
			});
			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.findObjects(response, "Target");
			});
		};
		this.getWorkLists = function(options) {
			options = getOptionsForWorkflowMethod("GetAllWorklistsForUser", "", options);
			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.findObjects(response, "Worklist");
			});
		};

		this.claimTask = function(task, options) {
			options = getOptionsForWorkflowMethod("ClaimTask", "", options, {
					TaskId: getTaskId(task)
			});
			return $.cordys.ajax(options);
		};
		this.delegateTask = function(task, user, memo, options) {
			options = getOptionsForWorkflowMethod("DelegateTask", "", options, {
					TaskId: getTaskId(task),
					TransferOwnership: "true",
					Memo: memo || "",
					SendTo: {
						UserDN: user
					}
			});
			return $.cordys.ajax(options);
		};
		this.performTaskAction = function(task, taskData, action, reason,options) {
			options = getOptionsForWorkflowMethod("PerformTaskAction", "", options, {
					TaskId: getTaskId(task),
					Action: action,
					Memo : reason,
					Data: taskData || {}
			});
			return $.cordys.ajax(options);
		};

		this.completeTask = function(task, taskData, options) {
			return this.performTaskAction(task, taskData, "COMPLETE",'', options);
		};
		this.pauseTask = function(task, taskData, options) {
			return this.performTaskAction(task, taskData, "PAUSE",'', options);
		};
		this.resumeTask = function(task, taskData, options) {
			return this.performTaskAction(task, taskData, "RESUME", '',options);
		};
		this.revokeTask = function(task, taskData, options) {
			return this.performTaskAction(task, taskData, "REVOKECLAIM",'', options);
		};
		this.skipTask = function(task, taskData, reason, options) {
			return this.performTaskAction(task, taskData, "SKIP", reason,options);
		};
		this.startTask = function(task, taskData, options) {
			return this.performTaskAction(task, taskData, "START", '',options);
		};
		this.stopTask = function(task, taskData, options) {
			return this.performTaskAction(task, taskData, "STOP", '',options);
		};
		this.suspendTask = function(task, taskData, options) {
			return this.performTaskAction(task, taskData, "SUSPEND", '',options);
		};

		this.isCaseActivity = function(task) {
			var taskType = getTaskType(task);
			return taskType ? (taskType === "CASE") : -1;
		};

		// Attachments
		this.getAttachments = function(task, options) {
			if (typeof(task) == "string") {
				var asyncvalue = (options) ? options.async : undefined ; //NOMBV
				var defaultsAsync = $.cordys.ajax.defaults.async ; //NOMBV
				return $.cordys.workflow.getTaskDetails(task, {async : (options && (asyncvalue !== undefined)) ? asyncvalue : defaultsAsync}).then(function(taskObject){
					return $.cordys.workflow.getAttachments(taskObject, options);
				}); 
			}
			options = getOptionsForWorkflowMethod("GetAttachments", "http://schemas.cordys.com/bpm/attachments/1.0", options, {
				instanceid: {
					"@type": getTaskType(task),
					text: getInstanceId(task)
				},
				activityid: task.ActivityId || task.Activity['@id']
			});

			return $.cordys.ajax(options).then(function(response) {
				return $.cordys.json.findObjects(response, "instance");
			});
		}

		this.addAttachment = function(task, attachmentName, fileName, description, content, options) {
			if (typeof(task) == "string") {
				var asyncvalue = (options) ? options.async : undefined ; //NOMBV
				var defaultsAsync = $.cordys.ajax.defaults.async ; //NOMBV
				return $.cordys.workflow.getTaskDetails(task, {async : (options && (asyncvalue !== undefined)) ? asyncvalue : defaultsAsync}).then(function(taskObject){
					return $.cordys.workflow.addAttachment(taskObject, attachmentName, fileName, description, content, options);
				});
			}
			var isURL = /^[a-zA-Z].*\:/.test(content);
			if (isURL) {
				// upload the file
				if ($.cordys.mobile) {
					$.cordys.mobile.fileReader.readAsDataURL(content, function(result) {
						// content retrieved as base64 encoded
						content = result.replace(/^.*base64,/, "");
						options = getOptionsForWorkflowMethod("UploadAttachment", "http://schemas.cordys.com/bpm/attachments/1.0", options, {
							instanceid: {
								"@type": getTaskType(task),
								text: getInstanceId(task)
							},
							activityid: task.ActivityId || task.Activity['@id'],
							attachmentname: attachmentName,
							filename: fileName,
							description: description,
							content: {
								"@isURL": false,
								text: content
							}
						});
						$.cordys.ajax(options);
					}, function (error) {
						throw new Error("Unable to read file, error: " + JSON.stringify(error));
					});
				} else {
					throw new Error("Unable to add attachment by url");
				}
			} else {
				// content should be base64 encoded
				if(!(/^[a-z0-9\+\/\s]+\={0,2}$/i.test(content)) || content.length % 4 > 0){
					if (window.btoa) content = window.btoa(content);
					else throw new Error("Unable to convert data to base64");
				}
				options = getOptionsForWorkflowMethod("UploadAttachment", "http://schemas.cordys.com/bpm/attachments/1.0", options, {
					instanceid: {
						"@type": getTaskType(task),
						text: getInstanceId(task)
					},
					activityid: task.ActivityId || task.Activity['@id'],
					attachmentname: attachmentName,
					filename: fileName,
					description: description,
					content: {
						"@isURL": false,
						text: content
					}
				});
				return $.cordys.ajax(options);
			}
		}

		this.uploadAttachment = function(task, attachmentName, fileName, description, url, options) {
			if (typeof(task) == "string") {
				var asyncvalue = options.async ; //NOMBV
				var defaultsAsync = $.cordys.ajax.defaults.async ; //NOMBV
				return $.cordys.workflow.getTaskDetails(task, {async : (options && (asyncvalue !== undefined)) ? asyncvalue : defaultsAsync}).then(function(taskObject){
					return $.cordys.workflow.uploadAttachment(taskObject, attachmentName, fileName, description, url, options);
				});
			}
			options = getOptionsForWorkflowMethod("UploadAttachment", "http://schemas.cordys.com/bpm/attachments/1.0", options, {
				instanceid: {
					"@type": getTaskType(task),
					text: getInstanceId(task)
				},
				activityid: task.ActivityId || task.Activity['@id'],
				attachmentname: attachmentName,
				filename: fileName,
				description: description,
				content: {
					"@isURL": true,
					text: url
				}
			});
			return $.cordys.ajax(options);
		}

		this.removeAttachment = function(task, attachmentName, fileName, documenturl, options) {
			if (typeof(task) == "string") {
				var asyncvalue = options.async ; //NOMBV
				var defaultsAsync = $.cordys.ajax.defaults.async ; //NOMBV
				return $.cordys.workflow.getTaskDetails(task, {async : (options && (asyncvalue !== undefined)) ? asyncvalue : defaultsAsync}).then(function(taskObject){
					return $.cordys.workflow.removeAttachment(taskObject, attachmentName, fileName,documenturl, options);

				});
			}
			options = getOptionsForWorkflowMethod("DeleteAttachment", "http://schemas.cordys.com/bpm/attachments/1.0", options, {
				instanceid: {
					"@type": getTaskType(task),
					text: getInstanceId(task)
				},
				activityid: task.ActivityId || task.Activity['@id'],
				attachmentname: attachmentName,
				filename: fileName,
				documenturl: documenturl
			});
			return $.cordys.ajax(options);
		}

		return this;
	};

	function getOptionsForWorkflowMethod(methodName, namespace,options, defaultParameters) {
		options = options || {};
		var ajaxOptions =  $.extend({
			method: methodName,
			namespace: namespace || "http://schemas.cordys.com/notification/workflow/1.0",
			dataType: 'json'
		}, options);
		ajaxOptions.parameters = $.extend(defaultParameters, options.parameters);
		return ajaxOptions;
	}

	function getTaskId(task) {
		var id = (typeof(task) === "object") ? task.TaskId : task;
		// If it is an observable, call the method to get the value, otherwise just return the value
		return (typeof(id) === "function") ? id() : id;
	}

	function getTaskType(task) {
		if (typeof(task) !== "object") return "";
		return task.SourceType || task.Component;
	}

	function getInstanceId(task) {
		if (typeof(task) === "string") return task;
		var id = ($.cordys.workflow.isCaseActivity(task)) 
				? (task.ProcessInstanceId || task.CaseInstanceId || task.SourceInstanceId || task.RootInstanceId || task.caseinstanceid) 
				: (task.ProcessInstanceId || task.SourceInstanceId);
		// If it is an observable, call the method to get the value, otherwise just return the value
		return (typeof(id) === "function") ? id() : id;
	}

})(window, jQuery)

// RESET SOME VALUES. FSKS CHANGES
/*
$.cordys.ajax.defaults.url = "http://fsks.interstagebop.com/com.eibus.web.soap.Gateway.wcp";
$.cordys.authentication.defaults.preloginGatewayURL = "http://fsks.interstagebop.com/cordys/com.eibus.sso.web.authentication.PreLoginInfo.wcp";
$.cordys.authentication.sso.defaults.loginGatewayURL = "http://fsks.interstagebop.com/cordys/com.eibus.web.soap.Gateway.wcp";
*/
$.cordys.ajax.defaults.url = "/com.eibus.web.soap.Gateway.wcp";
$.cordys.authentication.defaults.preloginGatewayURL = "/cordys/com.eibus.sso.web.authentication.PreLoginInfo.wcp";
$.cordys.authentication.sso.defaults.loginGatewayURL = "/cordys/com.eibus.web.soap.Gateway.wcp";

$.cordys.authentication.defaults.preLoginErrorHandler = function() { console.log("Preloin error handler."); } ;
$.cordys.authentication.defaults.loginErrorHandler = function() { console.log("Invalid username or password."); } ;
$.cordys.ajax.defaults.dataType = "text xml json";
$.cordys.ajax.defaults.error = function(jqXHR, textStatus, errorThrown, messCode, errorMessage, opts) { 
  console.log("ERROR!");
  return false;
};

$.cordys.ajax.defaults.beforeSend = function( jqxhr, settings ) {
  if (settings.url.match("com.eibus.web.soap.Gateway")) {
    //settings.url = settings.url.replace(/\w+_ct=/,'ct=') + "&SAMLart=" + encodeURIComponent(getCookie("\\w+_?SAMLart"));
    settings.type = "POST";
  }
};
$.cordys.ajax.defaults.showLoadingIndicator = false;


loadScript = function loadScript(url, callback, async, cache) {
  return $.ajax({
    type: "GET",
    //url: "http://fsks.interstagebop.com" + url,
    url: document.location.protocol + "//" + document.location.host + "/" + url,
    success: callback,
    dataType: "script",
    async: async || false,
    cache: cache || true
  });
} ;
// END FSKS CHANGES
