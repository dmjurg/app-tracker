window.c20g.form.expenses_approve = {

	init : function(taskData, formContainer) {

		var context = this;
		
		var expenseReportId = taskData.applicationData.ExpenseReport[0].id[0].Text;
		var employeeCN = taskData.applicationData.ExpenseReport[0].employee[0].Text;
		var createdDate = taskData.applicationData.ExpenseReport[0].createdDate[0].Text;
		var submittedDate = taskData.applicationData.ExpenseReport[0].submittedDate[0].Text;
		var projectId = taskData.applicationData.ExpenseReport[0].projectId[0].Text;

		formContainer.find('legend').text('Approve Expense Report for ' + employeeCN);

		var columns = [];
		columns.push({
			name : 'expenseDate',
			label : 'Date',
			cell : 'string',
			editable : false,
			width: 15,
			headerCell: "custom"
		});
		columns.push({
			name : 'expenseAmount',
			label : 'Amount',
			cell : 'string',
			editable : false,
			width: 15,
			headerCell: "custom"
		});
		columns.push({
			name : 'expenseCategory',
			label : 'Category',
			cell : 'string',
			editable : false,
			width: 25,
			headerCell: "custom"
		});
		columns.push({
			name : 'expenseDescription',
			label : 'Description',
			cell : 'string',
			editable : false,
			width: 50,
			headerCell: "custom"
		});


		context.expensesGrid = new Backgrid.Grid({
			columns : columns,
			collection : new window.c20g.grid.RowCollection([]),
			emptyText : 'No Expenses'
		});

		var $expensesGrid = context.expensesGrid.render().$el;
		var $expensesGridContainer = formContainer.find(".expenses-grid-container");
		$expensesGridContainer.empty().append($expensesGrid);

		window.c20g.ws.expenses.GetExpenseReportDetail(expenseReportId, function(expenseReport) {

			formContainer.find('#approveExpenseClientSpan').text(expenseReport.client.name);
			formContainer.find('#approveExpenseProjectSpan').text(expenseReport.project.name);
			formContainer.find('#approveExpenseSubmitDateSpan').text(moment(expenseReport.submittedDate).calendar());

			for(var i = 0; i < expenseReport.lineItems.length; i++) {
				var lineItem = expenseReport.lineItems[i];
				var expense = {};
				expense.id = lineItem.id;
				expense.expenseDate = lineItem.date;
				expense.expenseAmount = lineItem.price;
				expense.expenseCategory = lineItem.category.description;
				expense.expenseDescription = lineItem.description;
				context.expensesGrid.collection.add(expense);
			}
		});


		// Setup Events
		formContainer.find("#cancelButton").click(function(e) {
			window.c20g.ui.unloadUI();
		});

		formContainer.find("#approveButton").click(function(e) {
			context.submitApprovalDecision(taskData, expenseReportId, true, formContainer.find("#expenseReviewComments").val(), function() {
				window.c20g.ui.unloadUI();
			});
		});

		formContainer.find("#declineButton").click(function(e) {
			context.submitApprovalDecision(taskData, expenseReportId, false, formContainer.find("#expenseReviewComments").val(), function() {
				window.c20g.ui.unloadUI();
			});
		});

		window.c20g.ui.loading.hide();
	},

	submitApprovalDecision : function(taskData, expenseReportId, approvedFlag, comments, callback) {
		var data = {
				'id' : expenseReportId,
				'employee' : '',
				'projectId' : '',
				'createdDate' : '',
				'submittedDate' : '',
				'approver' : '',
				'approved' : approvedFlag ? 'APPROVED' : 'REJECTED',
				'comments' : comments,
				'lineItems' : {}
			};

			window.c20g.ws.task.ClaimAndCompleteTask(taskData.taskId, data, "ExpenseReport", "http://c20g.com/apps/schema/expense", function(response) {				
				callback && callback();
			});	
	},

	expensesGrid: null
};