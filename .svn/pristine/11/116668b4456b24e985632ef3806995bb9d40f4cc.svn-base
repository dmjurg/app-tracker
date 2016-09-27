window.c20g.view.eforms_formversions = {
	init: function(viewInfo, formContainer) {

		var context = this;
		context.formContainer = formContainer;
		context.viewInfo = viewInfo;

		$("#formVersionsPanelHeading a").text("Form Versions - " + viewInfo.form.name + " (key: " + viewInfo.form.key + ")");

		window.c20g.ws.eforms.GetFormVersions(viewInfo.form.key, function(forms) {

			for(var i = 0; i < forms.length; i++) {
				var buttonLabel = (context.viewInfo.form.version===forms[i].version) ? " Edit Form" : " Open Form";
				var buttonType = (context.viewInfo.form.version===forms[i].version) ? 
					window.c20g.constants.ui.SMALL_SUCCESS_BUTTON : window.c20g.constants.ui.SMALL_WARNING_BUTTON;
				forms[i].openFormButton = window.c20g.ui.templates.buildButton(buttonLabel, buttonType).attr('style', 'width:150px;')
					.bind("click", { form : forms[i] }, function(e){
						var form = e.data.form;
						window.c20g.view.load("eforms_editor", {
							callback : function() {
								window.c20g.ui.unloadUI();
							},
							loadCallback : function() {
								window.c20g.ui.getPreviousUI().$el.find("#formVersionsViewContent").empty();
							},
							form : form,
							folderId : form.folderId,
							folderName : '',
							version : form.version,
							readOnly : context.viewInfo.form.version !== form.version
						});
					});
				forms[i].printFormButton = window.c20g.ui.templates.buildButton(" Print Form", window.c20g.constants.ui.SMALL_WARNING_BUTTON).attr('style', 'width:150px;')
					.bind("click", { form : forms[i] }, function(e){
						var form = e.data.form;
						window.c20g.view.load("eforms_editor", {
							callback : function() {
								window.c20g.ui.unloadUI();
							},
							loadCallback : function() {
								window.c20g.ui.getPreviousUI().$el.find("#formVersionsViewContent").empty();
							},
							form : form,
							folderId : form.folderId,
							folderName : '',
							version : form.version,
							readOnly : context.viewInfo.form.version !== form.version,
							print : true
						});
					});
			}

			var columns = [];
			columns.push({
				name : 'version',
				label : 'Version',
				cell : 'string',
				editable : false,
				width: 10,
				headerCell: "custom"
			});
			columns.push({
				name : 'createdBy',
				label : 'Created By',
				cell : 'string',
				editable : false,
				width: 30,
				headerCell: "custom"
			});
			columns.push({
				name : 'createdDate',
				label : 'Created Date',
				cell : 'moment-custom',
				editable : false,
				width: 30,
				headerCell: "custom"
			});
			columns.push({
				name : 'openFormButton',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 15,
				headerCell: "custom"
			});
			columns.push({
				name : 'printFormButton',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 15,
				headerCell: "custom"
			});

			context.versionsGrid = new Backgrid.Grid({
				columns : columns,
				collection : new window.c20g.grid.RowCollection(forms),
				emptyText: "No Form Versions"				
			});

			var $versionsGrid = context.versionsGrid.render().$el;
			var $versionsGridContainer = $("#formVersionsViewContent").find("#formVersionsGrid");
			$versionsGridContainer.empty().append($versionsGrid);

			window.c20g.ui.loading.hide();
		});
	},

	formContainer : null,

	viewInfo : null,

	versionsGrid : null
};