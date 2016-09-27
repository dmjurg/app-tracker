window.c20g.tab.inboxTab = {
	init : function(params) {

		context = this;
		context.inboxGrid = null;
		context.parentTabControl = params.parentTabControl;

		window.c20g.ws.task.GetAllTasksForUser(function(tasks) {
			// --------------------------------------------------------------------------
			// Create Task Button for each task
			for (var i = 0; i < tasks.length; i++) {
				tasks[i].taskButton = window.c20g.ui.templates.buildButton("View Task ", window.c20g.constants.ui.SMALL_INFO_BUTTON).append(
						window.c20g.ui.templates.buildIcon(window.c20g.constants.ui.faIcons.ARROW_CIRCLE_RIGHT)).bind("click", {
					task : tasks[i]
				}, function(e) {
					var taskInfo = {
						taskId : e.data.task.id,
						callback : function() {
							window.c20g.tab.loadActiveTab(context.parentTabControl);
						},
						loadCallback : function() {

							window.c20g.ui.getPreviousUI().$el.find("#inboxTabContent").empty();
						}
					};
					window.c20g.form.loadTask(taskInfo);
				});
			}
			// --------------------------------------------------------------------------

			// Setup Inbox Grid
			context.inboxGrid = new Backgrid.Grid({
				columns : [{
					name : "taskName",
					label : "Task Name",
					cell : "string",
					editable : false,
					width : 50,
					headerCell : "custom"
				}, {
					name : "startDate",
					label : "Started",
					cell : "moment-custom",
					editable : false,
					width : 25,
					headerCell : "custom"
				}, {
					name : "taskButton",
					label : "",
					cell : "jq-custom",
					editable : false,
					width : 25,
					headerCell : "custom"
				}],
				collection : new window.c20g.grid.RowPageableCollection(tasks),
				emptyText : "No Tasks"
			});
			window.c20g.ui.grid.render(context.inboxGrid, $("#inboxTabContent").find("#inboxTabInboxGrid"));

			window.c20g.ui.loading.hide();
			window.c20g.ui.show($("#inboxTabContent").find(".panel"));

		});

	},

	inboxGrid : null,
	parentTabControl : null

};