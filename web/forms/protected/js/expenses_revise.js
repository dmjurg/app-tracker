window.c20g.form.expenses_revise = {

	init : function(taskData, formContainer) {

		var context = this;

		var expenseReport = taskData.applicationData.ExpenseReport[0];
		var expenseReportId = expenseReport.id[0].Text;

		window.c20g.ws.expenses.GetAllExpenseCategories(function(categories) {
			for(var i = 0; i < categories.length; i++) {
				var category = categories[i];
				var newOption = $('<option>');
				newOption.attr('value', category.id).text(category.description);
				$('#newExpenseCategory').append(newOption);
			}
		});

		var expenseDateField = formContainer.find("#newExpenseDate");
		var expenseAmountField = formContainer.find("#newExpenseAmount");
		var expenseCategoryField = formContainer.find("#newExpenseCategory");
		var expenseDescriptionField = formContainer.find("#newExpenseDescription");

		var validation = this.validation = {
			"expenseDateRequired": new window.c20g.validation.Validator({$el: expenseDateField, v: "required", c: true}),
			"expenseAmountRequired": new window.c20g.validation.Validator({$el: expenseAmountField, v: "required", c: true}),
			"expenseAmountDecimal": new window.c20g.validation.Validator({$el: expenseAmountField, v: "decimal", c: true}),	
			"expenseCategoryRequired": new window.c20g.validation.Validator({$el: expenseCategoryField, v: "required", c: true}),		
			"expenseDescriptionRequired": new window.c20g.validation.Validator({$el: expenseDescriptionField, v: "required", c: true})
		};

		window.c20g.validation.util.activate(this.validation);

		formContainer.find("#addExpenseButton").click(function(e) {
			if(window.c20g.validation.util.validate(validation).length > 0) {
				e.preventDefault();
				return false;
			}

			var expense = {};
			expense.expenseDate = window.c20g.util.parseMoment(expenseDateField.val(), window.c20g.constants.DATEFORMAT);
			expense.expenseAmount = parseFloat(expenseAmountField.val().replace(',', '')).toFixed(2);
			expense.expenseCategory = expenseCategoryField.find('option:selected').text();
			expense.expenseCategoryId = expenseCategoryField.val();
			expense.expenseDescription = expenseDescriptionField.val();

			context.expensesGrid.collection.add(expense);

			expenseDateField.val('');
			expenseAmountField.val('');
			expenseCategoryField.val('');
			expenseDescriptionField.val('');
		});

		var columns = [];
		columns.push({
			name : '',
			cell : 'select-row',
			width: 5,
			headerCell: "select-all"
		});
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

			formContainer.find('#approveExpenseClientSpan').text(expenseReport.client.name);
			formContainer.find('#approveExpenseProjectSpan').text(expenseReport.project.name);
			formContainer.find('#approveExpenseSubmitDateSpan').text(moment(expenseReport.submittedDate).calendar());
			formContainer.find('#reviewerCommentsSpan').text(taskData.applicationData.ExpenseReport[0].comments[0].Text);

			for(var i = 0; i < expenseReport.lineItems.length; i++) {
				var lineItem = expenseReport.lineItems[i];
				var expense = {};
				expense.id = lineItem.id;
				expense.expenseDate = moment(lineItem.date);
				expense.expenseAmount = lineItem.price;
				expense.expenseCategory = lineItem.category.description;
				expense.expenseCategoryId = lineItem.category.id;
				expense.expenseDescription = lineItem.description;
				context.expensesGrid.collection.add(expense);
			}
		});

		formContainer.find("#removeButton").click(function(e) {
			context.expensesGrid.removeRow(context.expensesGrid.getSelectedModels());
		});

		formContainer.find("#cancelButton").click(function(e) {
			window.c20g.ui.unloadUI();
		});

		formContainer.find("#deleteButton").click(function(e) {
			context.resubmitExpenseReport(taskData, formContainer.find('#expenseResubmitComments').val(), true, function() {
				window.c20g.ui.unloadUI();
			});
		});

		formContainer.find("#resubmitButton").click(function(e) {
			context.resubmitExpenseReport(taskData, formContainer.find('#expenseResubmitComments').val(), false, function() {
				window.c20g.ui.unloadUI();
			});
		});

		window.c20g.ui.loading.hide();
	},

	resubmitExpenseReport : function(taskData, comments, deleteFlag, callback) {
		
		var expenseReport = taskData.applicationData.ExpenseReport[0];
		var data = {
			'id' : expenseReport.id[0].Text,
			'employee' : expenseReport.employee[0].Text,
			'projectId' : expenseReport.projectId[0].Text,
			'createdDate' : expenseReport.createdDate[0].Text,
			'submittedDate' : moment().format("YYYY-MM-DD[T]HH[:]mm[:]ss[.0]"),
			'approver' : window.c20g.session.currentUser.userName,
			'comments' : comments,
			'lineItems' : {}
		};
		if(deleteFlag) {
			data.approved = 'CANCEL';
		}
		data.lineItems.lineItem = [];
		for(var i = 0; i < this.expensesGrid.collection.models.length; i++) {
			var expense = {};
			var tempExpense = this.expensesGrid.collection.models[i].attributes; 
			expense.expenseCategoryId = tempExpense.expenseCategoryId;
			expense.expenseDate = tempExpense.expenseDate.format("YYYY-MM-DD");
			expense.description = tempExpense.expenseDescription;
			expense.cost = tempExpense.expenseAmount;
			expense.receiptImageUUID = '';
			data.lineItems.lineItem.push(expense);
		}
		
		window.c20g.ws.task.ClaimAndCompleteTask(taskData.taskId, data, "ExpenseReport", "http://c20g.com/apps/schema/expense", function(response) {				
			callback && callback();
		});
	},

	expensesGrid: null,
	validation : null
};

