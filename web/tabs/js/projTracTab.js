window.c20g.tab.projTracTab = {
	init: function(params) {
		context = this;
		context.parentTabControl = params.parentTabControl;

		var buttonGroup = $("#projTracTabContent").find(".button-group");
		buttonGroup.append("  ");
		buttonGroup.append(window.c20g.ui.templates.buildButton(" By Project", 'btn btn-info').attr('id', 'btnProjReportsByProject').click(function(e) {
			$("#projTracTabContent").find('#projTracByProject').show();
			$("#projTracTabContent").find('#projTracByWeek').hide();

			$("#projTracTabContent").find('#btnProjReportsByWeek').removeClass('btn-info');
			$("#projTracTabContent").find('#btnProjReportsByWeek').addClass('btn-default');
			$("#projTracTabContent").find('#btnProjReportsByProject').removeClass('btn-default');
			$("#projTracTabContent").find('#btnProjReportsByProject').addClass('btn-info');
		}));
		buttonGroup.append("  ");
		buttonGroup.append(window.c20g.ui.templates.buildButton(" By Week", 'btn btn-default').attr('id', 'btnProjReportsByWeek').click(function(e) {
			$("#projTracTabContent").find('#projTracByProject').hide();
			$("#projTracTabContent").find('#projTracByWeek').show();

			$("#projTracTabContent").find('#btnProjReportsByWeek').removeClass('btn-default');
			$("#projTracTabContent").find('#btnProjReportsByWeek').addClass('btn-info');
			$("#projTracTabContent").find('#btnProjReportsByProject').removeClass('btn-info');
			$("#projTracTabContent").find('#btnProjReportsByProject').addClass('btn-default');
			
		}));

		window.c20g.ui.loading.show();
		window.c20g.ws.projtrac.GetAllProjects(function(projects){

			for(var i = 0; i < projects.length; i++) {
				projects[i].showReportsButton = window.c20g.ui.templates.buildButton(" View Status Reports", window.c20g.constants.ui.SMALL_PRIMARY_BUTTON)
					.prepend(window.c20g.ui.templates.buildIcon(window.c20g.constants.ui.faIcons.TASKS_ICON))
					.bind("click", { project : projects[i] }, function(e){
						var projectInfo = {
							id : e.data.project.id
						};
						$("#projTracTabContent").find("#projectStatusReportsPanelHeader").text("Status Reports - " + e.data.project.name + " (" + e.data.project.clientName + ")");
						context.loadProjectReports(projectInfo);
					});
			}

			var columns = [];
			columns.push({
				name : 'clientName',
				label : 'Client',
				cell : 'string',
				editable : false,
				width: 40,
				headerCell: "custom"
			});
			columns.push({
				name : 'name',
				label : 'Project',
				cell : 'string',
				editable : false,
				width: 40,
				headerCell: "custom"
			});
			columns.push({
				name : 'showReportsButton',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 20,
				headerCell: "custom"
			});

			context.projectsGrid = new Backgrid.Grid({
				columns : columns,
				collection : new window.c20g.grid.RowCollection(projects),
				emptyText: "No Projects Configured"				
			});

			var $projectGrid = context.projectsGrid.render().$el;
			var $projectGridContainer = $("#projTracTabContent").find(".project-grid-container");
			$projectGridContainer.empty().append($projectGrid);

			var columns2 = [];
			columns2.push({
				name : 'weekOf',
				label : 'Week Of',
				cell : 'string',
				editable : false,
				width: 40,
				headerCell: "custom"
			});
			columns2.push({
				name : 'status',
				label : 'Status',
				cell : 'string',
				editable : false,
				width: 40,
				headerCell: "custom"
			});
			columns2.push({
				name : 'showButton',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 20,
				headerCell: "custom"
			});

			context.reportsGrid = new Backgrid.Grid({
				columns : columns2,
				collection : new window.c20g.grid.RowCollection([]),
				emptyText: "Select a Project"
			});

			var $reportGrid = context.reportsGrid.render().$el;
			var $reportGridContainer = $("#projTracTabContent").find(".report-grid-container");
			$reportGridContainer.empty().append($reportGrid);
			window.c20g.ui.show($reportGrid);

			window.c20g.ws.projtrac.GetReportStatusCountsByWeek(function(weeks) {

				for(var i = 0; i < weeks.length; i++) {
					weeks[i].showReportsButton = window.c20g.ui.templates.buildButton(" View Status Reports", window.c20g.constants.ui.SMALL_PRIMARY_BUTTON)
						.prepend(window.c20g.ui.templates.buildIcon(window.c20g.constants.ui.faIcons.TASKS_ICON))
						.bind("click", { week : weeks[i] }, function(e){
							var weekOf = e.data.week.weekOf;
							$("#projTracTabContent").find("#weekStatusReportsPanelHeader").text("Status Reports - Week of " + weekOf);
							context.loadWeekReports(weekOf);
						});
				}

				var columns = [];
				columns.push({
					name : 'weekOf',
					label : 'Week Of',
					cell : 'string',
					editable : false,
					width: 50,
					headerCell: "custom"
				});
				columns.push({
					name : 'countAssigned',
					label : 'Assigned',
					cell : 'string',
					editable : false,
					width: 15,
					headerCell: "custom"
				});
				columns.push({
					name : 'countSubmitted',
					label : 'Submitted',
					cell : 'string',
					editable : false,
					width: 15,
					headerCell: "custom"
				});
				columns.push({
					name : 'showReportsButton',
					label : '',
					cell : 'jq-custom',
					editable : false,
					width: 20,
					headerCell: "custom"
				});

				context.weeksGrid = new Backgrid.Grid({
					columns : columns,
					collection : new window.c20g.grid.RowCollection(weeks),
					emptyText: "No Weeks to Display"				
				});

				var $weeksGrid = context.weeksGrid.render().$el;
				var $weeksGridContainer = $("#projTracTabContent").find(".week-grid-container");
				$weeksGridContainer.empty().append($weeksGrid);

				var columns2 = [];
				columns2.push({
					name : 'client',
					label : 'Client',
					cell : 'string',
					editable : false,
					width: 20,
					headerCell: "custom"
				});
				columns2.push({
					name : 'project',
					label : 'Project',
					cell : 'string',
					editable : false,
					width: 30,
					headerCell: "custom"
				});
				columns2.push({
					name : 'managerCN',
					label : 'Manager',
					cell : 'string',
					editable : false,
					width: 15,
					headerCell: "custom"
				});
				columns2.push({
					name : 'status',
					label : 'Status',
					cell : 'string',
					editable : false,
					width: 15,
					headerCell: "custom"
				});
				columns2.push({
					name : 'showButton',
					label : '',
					cell : 'jq-custom',
					editable : false,
					width: 20,
					headerCell: "custom"
				});

				context.weekReportsGrid = new Backgrid.Grid({
					columns : columns2,
					collection : new window.c20g.grid.RowCollection([]),
					emptyText: "Select a Week"
				});

				var $weekReportsGrid = context.weekReportsGrid.render().$el;
				var $weekReportsGridContainer = $("#projTracTabContent").find(".week-reports-grid-container");
				$weekReportsGridContainer.empty().append($weekReportsGrid);
				window.c20g.ui.show($weekReportsGrid);

				window.c20g.ui.loading.hide();
			});
		});
	},

	loadProjectReports : function(projectData) {

		window.c20g.ws.projtrac.GetProjectStatusReports(projectData, function(statusReports){
			context.reportsGrid.collection.reset();
			for(var i = 0; i < statusReports.length; i++) {
				if(statusReports[i].googleDocURL) {
					statusReports[i].showButton = window.c20g.ui.templates.buildButton(" Open", window.c20g.constants.ui.SMALL_PRIMARY_BUTTON)
						.prepend(window.c20g.ui.templates.buildIcon(window.c20g.constants.ui.faIcons.TASKS_ICON))
						.bind("click", { report : statusReports[i] }, function(e){
							window.open(e.data.report.googleDocURL, 'Status Report', null);
							return false;
						});
				}
				else {
					statusReports[i].showButton = '';
				}
				context.reportsGrid.collection.add(statusReports[i]);	
			}
		});
	},

	loadWeekReports : function(weekOf) {
		window.c20g.ws.projtrac.GetWeekStatusReports(weekOf, function(statusReports) {
			context.weekReportsGrid.collection.reset();
			for(var i = 0; i < statusReports.length; i++) {
				//debugger;
				if(statusReports[i].googleDocURL) {
					statusReports[i].showButton = window.c20g.ui.templates.buildButton(" Open", window.c20g.constants.ui.SMALL_PRIMARY_BUTTON)
						.prepend(window.c20g.ui.templates.buildIcon(window.c20g.constants.ui.faIcons.TASKS_ICON))
						.bind("click", { report : statusReports[i] }, function(e){
							window.open(e.data.report.googleDocURL, 'Status Report', null);
							return false;
						});
				}
				else {
					statusReports[i].showButton = '';
				}
				context.weekReportsGrid.collection.add(statusReports[i]);
			}
		});
	},

	projectsGrid : null,
	reportsGrid : null,
	weeksGrid : null,
	weekReportsGrid : null,
	parentTabControl : null
}