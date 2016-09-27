window.c20g.ws.projtrac = {
	GetAllProjects : function(callback) {
		var paramNS = "http://c20g.com/apps/db/common/project";
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetAllActiveProjects", //web service name
			"http://c20g.com/apps/db/common/project", //web service namespace
			[],
			paramNS
		);
		var sr = new SOAPRequest("GetAllActiveProjects", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var projects = [];
			
			var projectTuples = response.Body[0].GetAllActiveProjectsResponse[0].tuple;
			if(!_.isUndefined(projectTuples)) {
				for(var i = 0; i < projectTuples.length; i++) {
					var project = {};
					project.id = projectTuples[i].old[0].c20g_project[0].id[0].Text;
					project.clientId = projectTuples[i].old[0].c20g_project[0].client_id[0].Text;
					project.clientName = projectTuples[i].old[0].c20g_project[0].c20g_client[0].client_name[0].Text;
					project.primaryContactId = projectTuples[i].old[0].c20g_project[0].client_primary_contact_id[0].Text;
					project.description = projectTuples[i].old[0].c20g_project[0].description[0].Text;
					project.name = projectTuples[i].old[0].c20g_project[0].project_name[0].Text;
					project.manager = projectTuples[i].old[0].c20g_project[0].manager_cn[0].Text;
					project.activeFlag = projectTuples[i].old[0].c20g_project[0].active_flag[0].Text;
					projects.push(project);
				}
			}
			callback && callback(projects);
		});
	},

	GetReportStatusCountsByWeek : function(callback) {
		var paramNS = "http://c20g.com/apps/db/projtrac/statusreport";
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetStatusCountsByWeek", 
			"http://c20g.com/apps/db/projtrac/statusreport", 
			[],
			paramNS
		);
		var sr = new SOAPRequest("GetStatusCountsByWeek", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var weeks = [];
			
			var weekTuples = response.Body[0].GetStatusCountsByWeekResponse[0].tuple;
			if(!_.isUndefined(weekTuples)) {
				for(var i = 0; i < weekTuples.length; i++) {
					var week = {};
					week.weekOf = weekTuples[i].old[0].pt_status_report[0].week_of[0].Text;
					week.countAssigned = weekTuples[i].old[0].pt_status_report[0].COUNT_ASSIGNED[0].Text;
					week.countSubmitted = weekTuples[i].old[0].pt_status_report[0].COUNT_SUBMITTED[0].Text;
					weeks.push(week);
				}
			}
			callback && callback(weeks);
		});
	},

	GetProjectStatusReports : function(projectData, callback) {
		var paramNS = "http://c20g.com/apps/db/projtrac/statusreport";
		var soapParams = {
			'projectId' : projectData.id
		};
		var methodName = 'GetProjectStatusReports';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetProjectStatusReports", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var reports = [];
			var reportTuples = response.Body[0].GetProjectStatusReportsResponse[0].tuple;
			if(!_.isUndefined(reportTuples)) {
				for(var i = 0; i < reportTuples.length; i++) {
					var report = {};
					report.id = reportTuples[i].old[0].pt_status_report[0].id[0].Text;
					report.status = reportTuples[i].old[0].pt_status_report[0].pt_lu_status_report_status[0].status[0].Text;
					report.submittedDate = reportTuples[i].old[0].pt_status_report[0].submitted_date[0].Text;
					report.googleDocURL = reportTuples[i].old[0].pt_status_report[0].google_doc_url[0].Text;
					report.weekOf = reportTuples[i].old[0].pt_status_report[0].week_of[0].Text;
					reports.push(report);
				}
			}
			callback && callback(reports);
		});
	},

	GetWeekStatusReports : function(weekOf, callback) {
		var paramNS = "http://c20g.com/apps/db/projtrac/statusreport";
		var soapParams = {
			'weekOf' : weekOf
		};
		var methodName = 'GetWeekStatusReports';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetWeekStatusReports", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var reports = [];
			var reportTuples = response.Body[0].GetWeekStatusReportsResponse[0].tuple;
			if(!_.isUndefined(reportTuples)) {
				for(var i = 0; i < reportTuples.length; i++) {
					var report = {};
					//debugger;
					report.id = reportTuples[i].old[0].pt_status_report[0].id[0].Text;
					report.client = reportTuples[i].old[0].pt_status_report[0].c20g_client[0].client_name[0].Text;
					report.project = reportTuples[i].old[0].pt_status_report[0].c20g_project[0].project_name[0].Text;
					report.managerCN = reportTuples[i].old[0].pt_status_report[0].c20g_project[0].manager_cn[0].Text;
					report.status = reportTuples[i].old[0].pt_status_report[0].pt_lu_status_report_status[0].description[0].Text;
					report.submittedDate = reportTuples[i].old[0].pt_status_report[0].submitted_date[0].Text;
					report.googleDocURL = reportTuples[i].old[0].pt_status_report[0].google_doc_url[0].Text;
					report.weekOf = reportTuples[i].old[0].pt_status_report[0].week_of[0].Text;
					reports.push(report);
				}
			}
			callback && callback(reports);
		});
	},

	LoadStatusReport : function(statusReportId, callback) {

		var paramNS = "http://c20g.com/apps/db/projtrac/statusreport";
		var soapParams = {
			'id' : statusReportId
		};
		var methodName = 'Getpt_status_reportObject';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);
		var sr = new SOAPRequest("Updatept_status_report", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			statusReport = {};
			statusReport.id = response.Body[0].Getpt_status_reportObjectResponse[0].tuple[0].old[0].pt_status_report[0].id[0].Text;
			statusReport.projectId = response.Body[0].Getpt_status_reportObjectResponse[0].tuple[0].old[0].pt_status_report[0].project_id[0].Text;
			statusReport.submittedDate = response.Body[0].Getpt_status_reportObjectResponse[0].tuple[0].old[0].pt_status_report[0].submitted_date[0].Text;
			statusReport.statusId = response.Body[0].Getpt_status_reportObjectResponse[0].tuple[0].old[0].pt_status_report[0].report_status_id[0].Text;
			statusReport.googleDocURL = response.Body[0].Getpt_status_reportObjectResponse[0].tuple[0].old[0].pt_status_report[0].google_doc_url[0].Text;
			callback && callback(statusReport);
		});
	},

	SaveStatusReport : function(statusReport, callback) {
		var paramNS = "http://c20g.com/apps/db/projtrac/statusreport";
		var soapParams = {
			'tuple' : {
				'old' : {
					'pt_status_report' : {
						'id' : statusReport.id
					}
				},
				'new' : {
					'pt_status_report' : {
						'id' : statusReport.id,
						'google_doc_url' : statusReport.googleDocURL
					}
				}
			}
		};
		var methodName = 'Updatept_status_report';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("Updatept_status_report", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			callback && callback();
		});
	}
};