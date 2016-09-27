window.c20g.ws.user =  {
	GetUserDetailsOperation : function(callback) {
		var paramNS = "http://schemas.cordys.com/UserManagement/1.0/User";			
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetUserDetails", // web service name
			paramNS, // web service namespace
			[],
			paramNS
		);
		
		var sr = new SOAPRequest("GetUserDetails", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {								
			
			if(!window.c20g.Soap.isResponseValid(response)) {
				callback(new window.c20g.error.Error("window.c20g.ws.user.GetUserDetailsOperation.failed"));
			}
			else {
				var userDetails = {};
				var userDetailsNode = response.Body[0].GetUserDetailsResponse[0].User[0];
				var rolesNode = userDetailsNode.Roles[0].Role;				
				userDetails.userName = userDetailsNode.UserName[0].Text;
				userDetails.description = userDetailsNode.Description[0].Text;
				userDetails.roles = [];				
				for(var i = 0; i < rolesNode.length; i++) {
					userDetails.roles.push(rolesNode[i].Text);
				}								
				callback(userDetails);
			}			
			
		});
	},
	GetUserDetails: function(callback) {
		var paramNS = "http://schemas.cordys.com/1.1/ldap";			
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetUserDetails", // web service name
			"http://schemas.cordys.com/1.1/ldap", // web service namespace
			[],
			paramNS
		);
		
		var sr = new SOAPRequest("GetUserDetails", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {								
			
			if(!window.c20g.Soap.isResponseValid(response)) {
				callback(new window.c20g.error.Error("window.c20g.ws.user.GetUserDetails.failed"));
			}
			else {
				var user = {};
				var userNode = response.Body[0].GetUserDetailsResponse[0].tuple[0].old[0].user[0];
				user.dn = userNode.authuserdn[0].Text;
				user.description = userNode.description[0].Text;					
				callback(user);
			}			
			
		});
	},
	
	GetUserInformation: function(callback) {
		window.c20g.ws.user.GetUserDetails(function(user){
			window.c20g.ws.user.GetUserDetailsOperation(function(userDetails){				
				if(_.isFunction(callback)) { 
					callback($.extend(user, userDetails)); 
				}
			});
		});
	}
};