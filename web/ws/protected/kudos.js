window.c20g.ws.kudos = {

	GetAllKudoCategories : function(callback) {
		var paramNS = "http://c20g.com/apps/db/kudos/kudocategory";
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetAllKudoCategories", 
			"http://c20g.com/apps/db/kudos/kudocategory",
			[],
			paramNS
		);
		var sr = new SOAPRequest("GetAllKudoCategories", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var categories = [];
			
			var categoryTuples = response.Body[0].GetAllKudoCategoriesResponse[0].tuple;
			if(!_.isUndefined(categoryTuples)) {
				for(var i = 0; i < categoryTuples.length; i++) {
					var category = {};
					category.id = categoryTuples[i].old[0].ck_lu_kudo_category[0].id[0].Text;
					category.description = categoryTuples[i].old[0].ck_lu_kudo_category[0].description[0].Text;
					categories.push(category);
				}
			}
			callback && callback(categories);
		});
	},

	GetEmployeesAndKudoCounts : function(callback) {
		var paramNS = "http://c20g.com/apps/db/kudos/kudo";
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetEmployeesWithKudoCount", 
			"http://c20g.com/apps/db/kudos/kudo",
			[],
			paramNS
		);
		var sr = new SOAPRequest("GetEmployeesWithKudoCount", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var employees = [];
			
			var employeeTuples = response.Body[0].GetEmployeesWithKudoCountResponse[0].tuple;
			if(!_.isUndefined(employeeTuples)) {
				for(var i = 0; i < employeeTuples.length; i++) {
					var employee = {};
					employee.cn = employeeTuples[i].old[0].ck_kudo[0].recipient_cn[0].Text;
					employee.kudoCount = employeeTuples[i].old[0].ck_kudo[0].kudo_count[0].Text;
					employees.push(employee);
				}
			}
			callback && callback(employees);
		});
	},

	GetEmployeeKudos : function(recipientCN, callback) {
		var paramNS = "http://c20g.com/apps/db/kudos/kudo";
		var soapParams = {
			'recipientCN' : recipientCN
		};
		var methodName = 'GetUserKudos';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetUserKudos", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var kudos = [];
			var kudoTuples = response.Body[0].GetUserKudosResponse[0].tuple;
			if(!_.isUndefined(kudoTuples)) {
				for(var i = 0; i < kudoTuples.length; i++) {
					var kudo = {};
					kudo.id = kudoTuples[i].old[0].ck_kudo[0].id[0].Text;
					kudo.categoryId = kudoTuples[i].old[0].ck_kudo[0].kudo_category_id[0].Text;
					kudo.categoryDescription = kudoTuples[i].old[0].ck_kudo[0].ck_lu_kudo_category[0].category[0].Text;
					kudo.creatorCN = kudoTuples[i].old[0].ck_kudo[0].creator_cn[0].Text;
					kudo.createdDate = kudoTuples[i].old[0].ck_kudo[0].created_date[0].Text;
					kudo.description = kudoTuples[i].old[0].ck_kudo[0].description[0].Text;
					kudo.recipientCN = kudoTuples[i].old[0].ck_kudo[0].recipient_cn[0].Text;
					kudos.push(kudo);
				}
			}
			callback && callback(kudos);
		});
	},

	CreateEmployeeKudo : function(categoryID, submitterCN, recipientCN, description, callback) {
		var paramNS = "http://c20g.com/apps/bpm/kudos";
		var soapParams = {
			'categoryID' : categoryID,
			'submitterCN' : submitterCN,
			'recipientCN' : recipientCN,
			'description' : description
		};
		var methodName = 'SubmitKudo';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("SubmitKudo", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			callback && callback();
		});
	} 

};