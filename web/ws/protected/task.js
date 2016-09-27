window.c20g.ws.task = {
	SearchHumanTasks : function(sourceInstanceId, state, callback) {
		
		var wsNS = "http://schemas.cordys.com/notification/ws-humantask/execution/2.0";		

		var criteria = window.c20g.Soap.jsonToSoap({			
			"Query" : "(Task.SourceInstanceId = :sourceInstanceId AND Task.State = :state)",
			"Parameters" : {				
			}						
		}, "Criteria");		
		
		var orderBy = window.c20g.Soap.jsonToSoap({			
		}, "OrderBy");
		orderBy.val("Task.StartDate DESC");
				
		var parameters = window.c20g.Soap.getSOAPObjByPath(criteria, ["Parameters"]);
		parameters.appendChild(new SOAPObject("Parameter").attr("name", "sourceInstanceId").attr("type", "Task.SourceInstanceId").attr("value", sourceInstanceId));
		parameters.appendChild(new SOAPObject("Parameter").attr("name", "state").attr("type", "Task.State").attr("value", state));
				
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"SearchHumanTasks", // web service name
			wsNS, // web service namespace
			[], 
		 	wsNS);
		soapBody.appendChild(criteria);
		soapBody.appendChild(orderBy);
		
		var sr = new SOAPRequest("SearchHumanTasks", soapBody);		
		
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {			
						
				var tasks = [];
				var taskTuples = response.Body[0].SearchHumanTasksResponse[0].tuple;
				if(!_.isUndefined(taskTuples)) {
					var i = 0;
					for(i = 0; i < taskTuples.length; i++) {
						var task = {};
						task.taskName         = taskTuples[i].old[0].Task[0].Activity[0].Text;
						task.id               = taskTuples[i].old[0].Task[0].TaskId[0].Text;
						task.sourceInstanceId = taskTuples[i].old[0].Task[0].SourceInstanceId[0].Text;
						task.target           = taskTuples[i].old[0].Task[0].Target[0].Text;
						task.startDate        = taskTuples[i].old[0].Task[0].StartDate[0].Text;
						tasks.push(task);
					}					
				}
				callback(tasks);
			
		});
		
	},
	ClaimAndCompleteTask : function(taskId, data, dataName, dataNamespace, callback) {
		var context = this;
		var soap = window.c20g.Soap.jsonToSOAPBody(data, dataName, dataNamespace, dataNamespace);
		context.ClaimTask(taskId, function(response){
			context.CompleteTask(taskId, soap, function(response){
				callback && callback(response);
			});
		});
	},		
	ClaimTask : function(taskId, callback) {
		var paramNS = "http://schemas.cordys.com/notification/workflow/1.0";
		
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"ClaimTask", //web service name
			"http://schemas.cordys.com/notification/workflow/1.0", //web service namespace
			[
				{ name : "TaskId", value : taskId, ns : paramNS },
			],
			paramNS
		);
		
		var sr = new SOAPRequest("ClaimTask", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			callback && callback(response);
		});
	},
	CompleteTask : function(taskId, soap, callback) {
		
		var paramNS = "http://schemas.cordys.com/notification/workflow/1.0";			
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"PerformTaskAction", //web service name
			"http://schemas.cordys.com/notification/workflow/1.0", //web service namespace
			[
				{ name : "TaskId", value : taskId, ns : paramNS },
				{ name : "Action", value : "COMPLETE", ns : paramNS },
				{ name : "Data", value : soap, ns : paramNS },
			],
			paramNS
		);
		
		var sr = new SOAPRequest("PerformTaskAction", soapBody);			
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();		
		SOAPClient.SendRequest(sr, function(response) {
			callback(response);
		});
	},	
	GetTask : function(taskId, callback) {
		
		var paramNS = "http://schemas.cordys.com/notification/workflow/1.0";
		var soapParams = {				
			'TaskId' : taskId,						
			'RetrievePossibleActions' : 'true'
		};
		var methodName = 'GetTask';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);
		soapBody.children[0].attr("type", "user");
		var sr = new SOAPRequest("GetTasks", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {			
			var task = {};				
			var t = response.Body[0].GetTaskResponse[0].tuple[0].old[0].Task[0];
			task.taskName = t.Activity[0].Text;
			task.taskId = t.TaskId[0].Text;
			task.processInstanceId = t.ProcessInstanceId[0].Text;
			task.applicationData = t.TaskData[0].ApplicationData[0];  //TODO: Need to do more processing here, flatten the object?
			task.url = t.url[0].Text;
			callback(task);				
		});
		
	},
	GetAllTasksForUser : function(callback) {
		var paramNS = "http://schemas.cordys.com/notification/workflow/1.0";
		var soapParams = {				
			'Target' : window.c20g.session.currentUser.dn,
			'ShowNonWorkableItems' : 'false',
			'ReturnTaskData' : 'true',
			'OrderBy' : 'Task.StartDate DESC'
		};
		var methodName = 'GetAllTasksForUser';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);
		soapBody.children[0].attr("type", "user");
		var sr = new SOAPRequest("GetTasks", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {			
						
				var tasks = [];
				var taskTuples = response.Body[0].GetAllTasksForUserResponse[0].tuple;
				if(!_.isUndefined(taskTuples)) {
					var i = 0;
					for(i = 0; i < taskTuples.length; i++) {
						var task = {};
						task.taskName         = taskTuples[i].old[0].Task[0].Activity[0].Text;
						task.id               = taskTuples[i].old[0].Task[0].TaskId[0].Text;
						task.sourceInstanceId = taskTuples[i].old[0].Task[0].SourceInstanceId[0].Text;
						task.target           = taskTuples[i].old[0].Task[0].Target[0].Text;
						task.startDate        = taskTuples[i].old[0].Task[0].StartDate[0].Text;
						tasks.push(task);
					}					
				}
				callback(tasks);
			
		});
	}
};