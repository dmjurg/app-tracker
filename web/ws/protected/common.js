window.c20g.ws.common = {
	GetAllActiveC20gClients : function(callback) {

		callback && callback();
	},

	GetAllActiveC20gProjects : function(callback) {

		var paramNS = "http://c20g.com/apps/db/common/project";			
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetAllActiveProjects", 
			paramNS,
			[],
			paramNS
		);

		var sr = new SOAPRequest("GetAllActiveProjects", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {								

			var projects = [];
			var tupleNodes = response.Body[0].GetAllActiveProjectsResponse[0].tuple;
			for (var i = 0; i < tupleNodes.length; i++) {
				var project = {};
				project.id = tupleNodes[i].old[0].c20g_project[0].id[0].Text;
				project.name = tupleNodes[i].old[0].c20g_project[0].project_name[0].Text;
				project.clientId = tupleNodes[i].old[0].c20g_project[0].client_id[0].Text;
				project.clientName = tupleNodes[i].old[0].c20g_project[0].c20g_client[0].client_name[0].Text;
				project.description = tupleNodes[i].old[0].c20g_project[0].description[0].Text;
				project.managerCN = tupleNodes[i].old[0].c20g_project[0].manager_cn[0].Text;
				projects.push(project);
			}
											
			callback && callback(projects);
		});
	},
	
	GetAllC20GAppPortalUsers : function(callback) {
		var paramNS = "http://schemas.cordys.com/1.0/ldap";
		var soapParams = { 
			'dn' : 'cn=organizational users,'+window.c20g.config.url.getOrganizationDn(),
			'scope' : '1',
			'sort' : 'ascending',
			'returnValues' : 'true',
			'filter' : '(&(objectClass=busorganizationaluser)(!(cn=SYSTEM))(!(cn=anonymous))(!(cn=wcpLicUser)))'
		};
		var methodName = 'SearchLDAP';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("SearchLDAP", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var users = [];
			var tupleNode = response.Body[0].SearchLDAPResponse[0].tuple;
			if(!_.isUndefined(tupleNode)) {
				for(var i = 0; i < tupleNode.length; i++) {
					var user = {};
					var entry = tupleNode[i].old[0].entry[0];
					user.dn = entry.dn;
					user.cn = entry.cn[0].string[0].Text;
					user.description = entry.description[0].string[0].Text;
					users.push(user);
				}
			}
			callback && callback(users);
		});
	}
};