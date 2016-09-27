window.c20g.form.projtrac_submit = {

	init : function(taskData, formContainer) {

		var statusReportId = taskData.applicationData.StatusReport[0].id[0].Text;
		var projectName = taskData.applicationData.StatusReport[0].projectName[0].Text;
		var weekOf = taskData.applicationData.StatusReport[0].weekOf[0].Text;
		var projectId = taskData.applicationData.StatusReport[0].projectId[0].Text;

		formContainer.find('legend').text('Submit Status Report for ' + projectName + ' - Week of ' + weekOf);

		window.c20g.ws.projtrac.LoadStatusReport(statusReportId, function(statusReport){
			formContainer.find('#googleDocURL').val(statusReport.googleDocURL);
		});

		// Setup Events
		formContainer.find("#cancelButton").click(function(e) {
			window.c20g.ui.unloadUI();
		});
		formContainer.find("#saveDraftButton").click(function(e){
			var statusReport = {};
			statusReport.id = statusReportId;
			statusReport.googleDocURL = formContainer.find('#googleDocURL').val();
			window.c20g.ws.projtrac.SaveStatusReport(statusReport, function() {
				window.c20g.ui.unloadUI();
			});
		});
		formContainer.find("#submitButton").click(function(e) {
			var data = {
				'projectName' : projectName,
				'projectId' : projectId,
				'weekOf' : weekOf,
				'submittedBy' : window.c20g.session.currentUser.dn,
				'googleDocURL' : formContainer.find('#googleDocURL').val()
			};

			window.c20g.ws.task.ClaimAndCompleteTask(taskData.taskId, data, "StatusReport", "http://c20g.com/apps/schema/projtrac", function(response) {				
				window.c20g.ui.unloadUI();
			});

		});

		window.c20g.ui.loading.hide();
				
	},

};