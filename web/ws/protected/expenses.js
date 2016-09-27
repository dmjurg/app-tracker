window.c20g.ws.expenses = {
	GetMyExpenseReports : function(userCN, callback) {
		
		var paramNS = "http://c20g.com/apps/db/expense/expensereport";
		var soapParams = {
			'employeeCN' : userCN
		};
		var methodName = 'GetExpenseReportsForEmployee';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetExpenseReportsForEmployee", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var expenses = [];
			var expenseTuples = response.Body[0].GetExpenseReportsForEmployeeResponse[0].tuple;
			
			if(!_.isUndefined(expenseTuples)) {
				for(var i = 0; i < expenseTuples.length; i++) {
					var expense = {};
					expense.id = expenseTuples[i].old[0].exp_expense_report[0].id[0].Text;
					expense.projectId = expenseTuples[i].old[0].exp_expense_report[0].project_id[0].Text;
					expense.projectName = expenseTuples[i].old[0].exp_expense_report[0].c20g_project[0].project_name[0].Text;
					expense.projectDescription = expenseTuples[i].old[0].exp_expense_report[0].c20g_project[0].description[0].Text;
					expense.projectManagerCN = expenseTuples[i].old[0].exp_expense_report[0].c20g_project[0].manager_cn[0].Text;
					expense.projectClientId = expenseTuples[i].old[0].exp_expense_report[0].c20g_project[0].client_id[0].Text;
					expense.projectClientName = expenseTuples[i].old[0].exp_expense_report[0].c20g_client[0].client_name[0].Text;
					expense.statusId = expenseTuples[i].old[0].exp_expense_report[0].status_id[0].Text;
					expense.statusDescription = expenseTuples[i].old[0].exp_expense_report[0].exp_lu_report_status[0].description[0].Text;
					expense.employeeCN = expenseTuples[i].old[0].exp_expense_report[0].employee_cn[0].Text;
					expense.createdDate = expenseTuples[i].old[0].exp_expense_report[0].created_date[0].Text;
					expense.submittedDate = expenseTuples[i].old[0].exp_expense_report[0].submitted_date[0].Text;
					expense.approverCN = expenseTuples[i].old[0].exp_expense_report[0].approver_cn[0].Text;
					expense.approvedDate = expenseTuples[i].old[0].exp_expense_report[0].approved_date[0].Text;
					expenses.push(expense);
				}
			}

			callback && callback(expenses);
		});
	},

	GetMyPendingApprovals : function(callback) {
		var approvals = [];
		callback && callback(approvals);
	},

	SubmitNewExpenseReport : function(userCN, projectId, lineItems, callback) {
		
		var paramNS = "http://c20g.com/apps/bpm/expense";
		var soapParams = {
			'projectId' : projectId,
			'lineItems' : {
				'lineItem' : []
			}
		};
		var methodName = 'SubmitExpenseReport';
		for(var i = 0; i < lineItems.length; i++) {
			var lineItem = {};
			lineItem.expenseCategoryId = lineItems[i].expenseCategoryId;
			lineItem.expenseDate = window.c20g.util.formatMoment(lineItems[i].expenseDate, "YYYY-MM-DD");
			lineItem.description = lineItems[i].description;
			lineItem.cost = lineItems[i].amount;
			lineItem.receiptImageUUID = lineItems[i].receiptImageUUID;
			soapParams.lineItems.lineItem.push(lineItem);
		}

		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);
		var sr = new SOAPRequest("SubmitExpenseReport", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			callback && callback();
		});
	},

	GetAllExpenseCategories : function(callback) {
		var paramNS = "http://c20g.com/apps/db/expense/expensecategory";			
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetAllExpenseCategories", 
			paramNS,
			[],
			paramNS
		);

		var sr = new SOAPRequest("GetAllExpenseCategories", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {								

			var categories = [];
			var tupleNodes = response.Body[0].GetAllExpenseCategoriesResponse[0].tuple;
			for (var i = 0; i < tupleNodes.length; i++) {
				var category = {};
				category.id = tupleNodes[i].old[0].exp_lu_expense_category[0].id[0].Text;
				category.description = tupleNodes[i].old[0].exp_lu_expense_category[0].description[0].Text;
				categories.push(category);
			}
											
			callback && callback(categories);
		});
	},

	GetExpenseReportDetail : function(expenseReportId, callback) {

		var paramNS = "http://c20g.com/apps/bpm/expense";
		var soapParams = {
			'expenseReportId' : expenseReportId
		};
		var methodName = 'GetExpenseReportDetails';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetExpenseReportDetails", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {

			var expenseReportDetailNode = response.Body[0].GetExpenseReportDetailsResponse[0].ExpenseReport[0].GetExpenseReportDetailResponse[0].tuple[0].old[0].exp_expense_report[0];
			var expenseReportItemTuples = response.Body[0].GetExpenseReportDetailsResponse[0].ExpenseReport[0].GetLineItemsForExpenseReportResponse[0].tuple;

			var expenseReport = {};
			expenseReport.id = expenseReportDetailNode.id[0].Text;
			expenseReport.employeeCN = expenseReportDetailNode.employee_cn[0].Text;
			expenseReport.submittedDate = expenseReportDetailNode.submitted_date[0].Text;
			expenseReport.client = {};
			expenseReport.client.id = expenseReportDetailNode.c20g_project[0].client_id[0].Text;
			expenseReport.client.name = expenseReportDetailNode.c20g_client[0].client_name[0].Text;
			expenseReport.project = {};
			expenseReport.project.id = expenseReportDetailNode.project_id[0].Text;
			expenseReport.project.name = expenseReportDetailNode.c20g_project[0].project_name[0].Text;
			expenseReport.project.description = expenseReportDetailNode.c20g_project[0].description[0].Text;
			expenseReport.project.managerCN = expenseReportDetailNode.c20g_project[0].manager_cn[0].Text;
			expenseReport.status = {};
			expenseReport.status.id = expenseReportDetailNode.status_id[0].Text;
			expenseReport.status.description = expenseReportDetailNode.exp_lu_report_status[0].description[0].Text;
			expenseReport.approvedDate = expenseReportDetailNode.approved_date[0].Text;
			expenseReport.approverCN = expenseReportDetailNode.approver_cn[0].Text;

			expenseReport.lineItems = [];

			for(var i = 0; i < expenseReportItemTuples.length; i++) {
				var lineItemNode = expenseReportItemTuples[i].old[0].exp_report_line_item[0];
				var lineItem = {};
				lineItem.id = lineItemNode.id[0].Text;
				lineItem.date = lineItemNode.expense_date[0].Text;
				lineItem.price = lineItemNode.price[0].Text;
				lineItem.description = lineItemNode.description[0].Text;
				lineItem.category = {};
				lineItem.category.id = lineItemNode.expense_category_id[0].Text;
				lineItem.category.description = lineItemNode.exp_lu_expense_category[0].description[0].Text;

				expenseReport.lineItems.push(lineItem);
			}

			callback && callback(expenseReport);
		});

	}
};