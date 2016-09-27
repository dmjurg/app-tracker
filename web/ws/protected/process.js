window.c20g.ws.process = {
	GetProcessInstancesByName : function(processNames, status, callback) {

		var wsNS = "http://schemas.cordys.com/pim/queryinstancedata/1.0";
		var paramNS = "http://schemas.cordys.com/cql/1.0";

		var query = window.c20g.Soap.jsonToSoap({			
			"Select" : {
				"QueryableObject" : "PROCESS_INSTANCE",
				"Field" : ["INSTANCE_ID", "PROCESS_NAME", "DESCRIPTION", "START_TIME", "END_TIME", "USER_NAME", "STATUS", "TYPE", "IS_ARCHIVED", "MODEL_SPACE", "PROCESS_TYPE", "SOAP_PROCESSOR",
						"RUNTIME_DOCUMENT_ID", "WORKSPACE_ID", "HAS_INPUT_MESSAGE", "HAS_OUTPUT_MESSAGE", "HAS_MESSAGE_MAP", "PARENT_ID", "PARENT_TYPE", "ROOT_ID", "ROOT_TYPE", "CRASH_RECOVERY",
						"ORIGINAL_ID", "SUBSTITUTE_ID", "HAS_ERROR"]
			},
			"Filters" : {
				"And" : {					
				}
			},				
			"OrderBy" : {				
			}			
		}, "Query");
		query.ns = paramNS;
		
		var filters = window.c20g.Soap.getSOAPObjByPath(query, ["Filters", "And"]);
		filters.appendChild(new SOAPObject("EQ").attr("field", "MODEL_SPACE")).appendChild(new SOAPObject("Value").val("1"));
		
		var processFiltersNode = filters;
		if(processNames.length > 1) {
			processFiltersNode = filters.appendChild(new SOAPObject("Or"));			
		}		
		for(var i = 0; i < processNames.length; i++) {
			processFiltersNode.appendChild(new SOAPObject("EQ").attr("field", "PROCESS_NAME")).appendChild(new SOAPObject("Value").val(processNames[i]));
		}			
		
		filters.appendChild(new SOAPObject("EQ").attr("field", "STATUS")).appendChild(new SOAPObject("Value").val(status));
		var orderBy = window.c20g.Soap.getSOAPObjByPath(query, ["OrderBy"]);
		orderBy.appendChild(new SOAPObject("Property").attr("direction", "desc").val("START_TIME"));
		orderBy.appendChild(new SOAPObject("Property").attr("direction", "desc").val("INSTANCE_ID"));		
		
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetProcessInstances", // web service name
			wsNS, // web service namespace
			[], 
		 	paramNS);
		soapBody.appendChild(query);
		var sr = new SOAPRequest("GetProcessInstances", soapBody);		
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			
			var processes = [];
			var processTuples = response.Body[0].GetProcessInstancesResponse[0].tuple;			
			if(!_.isUndefined(processTuples)) {
				var i = 0;
				for(i = 0; i < processTuples.length; i++) {
					var process = {};
					process.startTime = moment(window.c20g.util.parseIntNumber(processTuples[i].old[0].PROCESS_INSTANCE[0].START_TIME[0].Text));					
					process.endTime = moment(window.c20g.util.parseIntNumber(processTuples[i].old[0].PROCESS_INSTANCE[0].END_TIME[0].Text));					
					process.instanceId = processTuples[i].old[0].PROCESS_INSTANCE[0].INSTANCE_ID[0].Text;
					process.status = processTuples[i].old[0].PROCESS_INSTANCE[0].STATUS[0].Text;
					process.type = processTuples[i].old[0].PROCESS_INSTANCE[0].TYPE[0].Text;
					process.userDN = processTuples[i].old[0].PROCESS_INSTANCE[0].USER_NAME[0].Text;
					process.description = processTuples[i].old[0].PROCESS_INSTANCE[0].DESCRIPTION[0].Text;
					processes.push(process);
				}					
			}
			
			callback(processes);
		});
	},
};