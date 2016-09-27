window.c20g.tab.expensesTab = {
	init : function(params) {
		var context = this;
		context.parentTabControl = params.parentTabControl;

		var buttonGroup = $("#expensesTabContent").find(".button-group");
		buttonGroup.append("  ");
		buttonGroup.append(window.c20g.ui.templates.buildButton(" Create Expense Report", window.c20g.constants.ui.DEFAULT_BUTTON).click(function(e) {
			window.c20g.view.load("expenses_createreport", {
				callback : function() {
					window.c20g.tab.loadActiveTab(context.parentTabControl);
				},
				loadCallback : function() {
					window.c20g.ui.getPreviousUI().$el.find("#expensesTabContent").empty();
				}
			});
		}));

		window.c20g.ui.loading.show();
		var userCN = window.c20g.session.currentUser.userName;
		window.c20g.ws.expenses.GetMyExpenseReports(userCN, function(expenses){
			for(var i = 0; i < expenses.length; i++) {
				expenses[i].showExpenseDetailButton = window.c20g.ui.templates.buildButton(" View Expense Report", window.c20g.constants.ui.SMALL_PRIMARY_BUTTON)
					.prepend(window.c20g.ui.templates.buildIcon(window.c20g.constants.ui.faIcons.TASKS_ICON))
					.bind("click", { expense : expenses[i] }, function(e){
						var expenseInfo = {
							id : e.data.expense.id
						};

						window.c20g.view.load("expenses_viewreport_ro", {
							callback : function() {
								window.c20g.tab.loadActiveTab(context.parentTabControl);
							},
							loadCallback : function() {
								window.c20g.ui.getPreviousUI().$el.find("#expensesTabContent").empty();
							},
							expenseInfo : expenseInfo
						});
					});
			}

			var columns = [];
			columns.push({
				name : 'id',
				label : 'Expense Report ID',
				cell : 'string',
				editable : false,
				width: 15,
				headerCell: "custom"
			});
			columns.push({
				name : 'submittedDate',
				label : 'Submitted',
				cell : 'moment-custom',
				editable : false,
				width: 25,
				headerCell: "custom"
			});
			columns.push({
				name : 'statusDescription',
				label : 'Status',
				cell : 'string',
				editable : false,
				width: 40,
				headerCell: "custom"
			});
			columns.push({
				name : 'showExpenseDetailButton',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 20,
				headerCell: "custom"
			});

			context.myExpensesGrid = new Backgrid.Grid({
				columns : columns,
				collection : new window.c20g.grid.RowCollection(expenses),
				emptyText : 'No Expense Reports'
			});

			var $myExpensesGrid = context.myExpensesGrid.render().$el;
			var $myExpensesGridContainer = $("#expensesTabContent").find(".my-expenses-grid-container");
			$myExpensesGridContainer.empty().append($myExpensesGrid);

			window.c20g.ui.show($("#expensesTabContent").find(".panel"));
			window.c20g.ui.loading.hide();
		});

		
	},

	myExpensesGrid : null,
	parentTabControl : null
}