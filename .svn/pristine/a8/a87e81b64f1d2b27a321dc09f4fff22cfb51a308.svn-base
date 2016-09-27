window.c20g.view.expenses_viewreport_ro = {

	init : function(viewInfo, formContainer) {

		var context = this;

		var expenseReportId = viewInfo.expenseInfo.id;
		
		var columns = [];
		columns.push({
			name : 'expenseDate',
			label : 'Date',
			cell : 'moment-custom',
			formatter : Backgrid.MomentFormatterNoTime,
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
			width: 45,
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

			formContainer.find('legend').text('Expense Report Detail - ' + expenseReport.employeeCN + 
				' (' + expenseReport.client.name + ' / ' + moment(expenseReport.submittedDate).format('MMMM Do YYYY') + ')');

			formContainer.find('#approveExpenseClientSpan').text(expenseReport.client.name);
			formContainer.find('#approveExpenseStatusSpan').text(expenseReport.status.description);
			formContainer.find('#approveExpenseProjectSpan').text(expenseReport.project.name);
			formContainer.find('#approveExpenseSubmitDateSpan').text(moment(expenseReport.submittedDate).calendar());

			for(var i = 0; i < expenseReport.lineItems.length; i++) {
				var lineItem = expenseReport.lineItems[i];
				var expense = {};
				expense.expenseDate = moment(lineItem.date);
				expense.expenseAmount = lineItem.price;
				expense.expenseCategory = lineItem.category.description;
				expense.expenseCategoryId = lineItem.category.id;
				expense.expenseDescription = lineItem.description;
				context.expensesGrid.collection.add(expense);
			}
		});

		formContainer.find("#closeButton").click(function(e) {
			window.c20g.ui.unloadUI();
		});

		window.c20g.ui.loading.hide();
	},

	expensesGrid: null
};

