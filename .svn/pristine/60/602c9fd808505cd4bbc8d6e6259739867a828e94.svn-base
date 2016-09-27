window.c20g.tab.kudosTab = {
	init: function(params) {
		context = this;
		context.parentTabControl = params.parentTabControl;

		var buttonGroup = $("#kudosTabContent").find(".button-group");

		buttonGroup.append("  ");
		buttonGroup.append(window.c20g.ui.templates.buildButton(" Create Kudo", window.c20g.constants.ui.DEFAULT_BUTTON).click(function(e) {
			window.c20g.view.load("kudos_createkudo", {
				callback : function() {
					window.c20g.tab.loadActiveTab(context.parentTabControl);
				},
				loadCallback : function() {
					window.c20g.ui.getPreviousUI().$el.find("#kudosTabContent").empty();
				}
			});
		}));


		window.c20g.ws.kudos.GetEmployeesAndKudoCounts(function(employees){
			for(var i = 0; i < employees.length; i++) {
				employees[i].showKudosButton = window.c20g.ui.templates.buildButton(" View Kudos", window.c20g.constants.ui.SMALL_PRIMARY_BUTTON)
					.prepend(window.c20g.ui.templates.buildIcon(window.c20g.constants.ui.faIcons.TASKS_ICON))
					.bind("click", { employee : employees[i] }, function(e){
						var employee = e.data.employee.cn;
						$("#kudosTabContent").find("#kudosPanelHeader").text("Kudos for " + employee);
						context.loadEmployeeKudos(employee);
					});
			}

			var columns = [];
			columns.push({
				name : 'cn',
				label : 'Employee',
				cell : 'string',
				editable : false,
				width: 60,
				headerCell: "custom"
			});
			columns.push({
				name : 'kudoCount',
				label : 'Kudo Count',
				cell : 'string',
				editable : false,
				width: 20,
				headerCell: "custom"
			});
			columns.push({
				name : 'showKudosButton',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 20,
				headerCell: "custom"
			});

			context.employeesGrid = new Backgrid.Grid({
				columns : columns,
				collection : new window.c20g.grid.RowCollection(employees),
				emptyText: "No Employees With Kudos Found"				
			});

			var $employeesGrid = context.employeesGrid.render().$el;
			var $employeesGridContainer = $("#kudosTabContent").find(".employee-grid-container");
			$employeesGridContainer.empty().append($employeesGrid);


			var columns2 = [];
			columns2.push({
				name : 'creatorCN',
				label : 'From',
				cell : 'string',
				editable : false,
				width: 15,
				headerCell: "custom"
			});
			columns2.push({
				name : 'createdDate',
				label : 'Date',
				cell : 'moment-custom',
				editable : false,
				width: 15,
				headerCell: "custom"
			});
			columns2.push({
				name : 'categoryDescription',
				label : 'Category',
				cell : 'string',
				editable : false,
				width: 15,
				headerCell: "custom"
			});
			columns2.push({
				name : 'description',
				label : 'Description',
				cell : 'string',
				editable : false,
				width: 55,
				headerCell: "custom"
			});

			context.kudosGrid = new Backgrid.Grid({
				columns : columns2,
				collection : new window.c20g.grid.RowCollection([]),
				emptyText: "Select an Employee"
			});

			var $kudosGrid = context.kudosGrid.render().$el;
			var $kudosGridContainer = $("#kudosTabContent").find(".kudos-grid-container");
			$kudosGridContainer.empty().append($kudosGrid);
			window.c20g.ui.show($kudosGrid);

			window.c20g.ui.loading.hide();
		});


	/*
		window.c20g.ws.kudos.GetAllKudoCategories(function(categories){
			debugger;
		});

		window.c20g.ws.kudos.CreateEmployeeKudo(1, 'bill', 'Testing again', function(){
			debugger;
		});
	*/

	},

	loadEmployeeKudos : function(employeeCN) {
		context.kudosGrid.collection.reset();
		window.c20g.ws.kudos.GetEmployeeKudos(employeeCN, function(kudos){
			for(var i = 0; i < kudos.length; i++) {
				context.kudosGrid.collection.add(kudos[i]);	
			}
		});	
	},

	employeesGrid : null,
	kudosGrid : null
};