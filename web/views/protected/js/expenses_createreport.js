window.c20g.view.expenses_createreport = {
	init: function(viewInfo, formContainer) {

		var context = this;

		window.c20g.ws.expenses.GetAllExpenseCategories(function(categories) {
			for(var i = 0; i < categories.length; i++) {
				var category = categories[i];
				var newOption = $('<option>');
				newOption.attr('value', category.id).text(category.description);
				$('#newExpenseCategory').append(newOption);
			}
		});

		window.c20g.ws.common.GetAllActiveC20gProjects(function(projects) {
			for(var i = 0; i < projects.length; i++) {
				var project = projects[i];
				var newOption = $('<option>');
				newOption.attr('value', project.id).text(project.clientName + ' - ' + project.name);
				$('#expenseReportProject').append(newOption);
			}
		});

		var expenseReportProjectField = formContainer.find("#expenseReportProject");
		var expenseDateField = formContainer.find("#newExpenseDate");
		var expenseAmountField = formContainer.find("#newExpenseAmount");
		var expenseCategoryField = formContainer.find("#newExpenseCategory");
		var expenseDescriptionField = formContainer.find("#newExpenseDescription");

		var validation = this.validation = {
			"projectRequired": new window.c20g.validation.Validator({$el: expenseReportProjectField, v: "required", c: true}),
			"expenseDateRequired": new window.c20g.validation.Validator({$el: expenseDateField, v: "required", c: true}),
			"expenseAmountRequired": new window.c20g.validation.Validator({$el: expenseAmountField, v: "required", c: true}),
			"expenseAmountDecimal": new window.c20g.validation.Validator({$el: expenseAmountField, v: "decimal", c: true}),	
			"expenseCategoryRequired": new window.c20g.validation.Validator({$el: expenseCategoryField, v: "required", c: true}),		
			"expenseDescriptionRequired": new window.c20g.validation.Validator({$el: expenseDescriptionField, v: "required", c: true})
		};

		window.c20g.validation.util.activate(this.validation);

						
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

	
		formContainer.find("#cancelButton").click(function(e) {
			window.c20g.ui.unloadUI();
		});

		formContainer.find("#submitButton").click(function(e) {	
			var projectId = formContainer.find("#expenseReportProject").val();
			var userCN = window.c20g.session.currentUser.userName;

			var expenses = [];
			for(var i = 0; i < context.expensesGrid.collection.models.length; i++) {
				var expense = {};
				var tempExpense = context.expensesGrid.collection.models[i].attributes; 
				expense.expenseCategoryId = tempExpense.expenseCategoryId;
				expense.expenseDate = tempExpense.expenseDate;
				expense.description = tempExpense.expenseDescription;
				expense.amount = tempExpense.expenseAmount;
				expense.receiptImageUUID = '';
				expenses.push(expense);
			}

			window.c20g.ws.expenses.SubmitNewExpenseReport(userCN, projectId, expenses, function(){
				window.c20g.ui.unloadUI();
			});

		});

		window.c20g.ui.show(formContainer.find(".panel"));
		window.c20g.ui.loading.hide();
			
	},

	expensesGrid: null,
	validation : null
};
