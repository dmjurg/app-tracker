window.c20g.tab.recruitingTab = {
	init: function(params) {

		context = this;
		context.parentTabControl = params.parentTabControl;

		var buttonGroup = $("#recruitingTabContent").find(".button-group");

		buttonGroup.append("  ");

		buttonGroup.append(window.c20g.ui.templates.buildButton("Create Internal Application", window.c20g.constants.ui.DEFAULT_BUTTON).click(function(e) {
			window.c20g.view.load("recruiting_applicationform", {
				callback : function() {
					window.c20g.tab.loadActiveTab(context.parentTabControl);
				},
				loadCallback : function() {
					window.c20g.ui.getPreviousUI().$el.find("#recruitingTabContent").empty();
					window.c20g.ws.recruiting.GetLookUpData(function(data){
						window.c20g.view.recruiting_applicationform.addLookUpDataToDropdown(data)
						});
				}
			});
		}));

		window.c20g.ws.recruiting.GetCandidates(function(candidates){

			var columns = [];
			columns.push({
				name : 'full_name',
				label : 'Candidate Name',
				cell : 'string',
				editable : false,
				width: 25,
				headerCell: "custom"
			});
			columns.push({
				name : 'submission_date',
				label : 'Submission Date',
				cell : 'string',
				editable : false,
				width: 20,
				headerCell: "custom"
			});
			columns.push({
				name : 'status',
				label : 'Status',
				cell : 'string',
				editable : false,
				width: 20,
				headerCell: "custom"
			});
			columns.push({
				name : 'start_date',
				label : 'Availability',
				cell : 'string',
				editable : false,
				width: 20,
				headerCell: "custom"
			});
			columns.push({
				name : 'id',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 15,
				headerCell: "custom",
				renderFunction: function(cell) {
					var btn = window.c20g.ui.templates.buildButton(" View Application", window.c20g.constants.ui.SMALL_PRIMARY_BUTTON)
					.prepend(window.c20g.ui.templates.buildIcon(window.c20g.constants.ui.faIcons.TASKS_ICON));
					var id = cell.model.get("id")
					btn.click(function(e) {
						window.c20g.view.load("recruiting_applicationform", {
							callback : function() {
								window.c20g.tab.loadActiveTab(context.parentTabControl);
							},
							loadCallback : function() {
								window.c20g.ui.getPreviousUI().$el.find("#recruitingTabContent").empty();
								window.c20g.ws.recruiting.GetLookUpData(function(data){
									window.c20g.view.recruiting_applicationform.addLookUpDataToDropdown(data)
									window.c20g.ws.recruiting.GetCandidateById(id, function(candidate){
										window.c20g.view.recruiting_applicationform.populateForm(candidate);
									});
								});
							}
						});
					});
					cell.$el.append(btn);
				}
			});

			context.candidatesGrid = new Backgrid.Grid({
				columns : columns,
				collection : new window.c20g.grid.RowCollection(candidates),
				emptyText: "No Candidates Found"
			});

			var $candidatesGridContainer = $("#recruitingTabContent").find(".candidate-grid-container");
			window.c20g.ui.grid.render(context.candidatesGrid, $candidatesGridContainer);
			window.c20g.ui.loading.hide();

		}); // closes getCandidates function
	}, // closes init
}; // closes recruitingTab
