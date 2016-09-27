window.c20g.tab.formLibraryTab = {
	init: function(params) {
		var context = this;
		context.parentTabControl = params.parentTabControl;

		var buttonGroup = $("#formLibraryTabContent").find(".button-group");

		buttonGroup.append("  ");
		buttonGroup.append(window.c20g.ui.templates.buildButton(" Scratchpad", window.c20g.constants.ui.DEFAULT_BUTTON).click(function(e) {
			window.c20g.view.load("eforms_scratchpad", {
				callback : function() {
					window.c20g.tab.loadActiveTab(context.parentTabControl);
				},
				loadCallback : function() {
					window.c20g.ui.getPreviousUI().$el.find("#formLibraryTabContent").empty();
				}
			});
		}));

		window.c20g.ws.eforms.GetTopLevelFolders(function(folders) {
			context.folderTree = [];
			for(var i = 0; i < folders.length; i++) {
				context.folderTree.push({
					id : folders[i].id,
					label : folders[i].name,
					childrenLoaded : false,
					children : [ ]	
				});
			}
			$('#formFolderTree').tree({
		        data: context.folderTree
		    });

		    $('#formFolderTree').bind(
			    'tree.click',
			    function(event) {
			        var node = event.node;
			        if(!node.childrenLoaded) {
				        window.c20g.ws.eforms.GetChildFolders(node.id, function(folders){ 
				        	for(var i = 0; i < folders.length; i++) {
				        		$('#formFolderTree').tree('appendNode', {
				        			id : folders[i].id,
				        			label : folders[i].name
				        		}, node);
				        		$('#formFolderTree').tree('openNode', node);
				        	}
				        });
				        node.childrenLoaded = true;
			    	}
			    	$('#formListPanelBody .btn-new-form').show().unbind('click').click(function(){
			    		window.c20g.view.load("eforms_editor", {
							callback : function() {
								window.c20g.tab.loadActiveTab(context.parentTabControl);
							},
							loadCallback : function() {
								window.c20g.ui.getPreviousUI().$el.find("#formLibraryTabContent").empty();
							},
							folderId : node.id,
							folderName : node.name,
							version : 1,
							form : null
						});
			    	});
			    	$('#formListPanelBody .btn-new-folder').show().unbind('click').click(function(){
			    		$("#newFolderFormModal .cancel-new-folder").click(function(){
							$("#newFolderFormModal .txt-folder-name").val("");
							$("#newFolderFormModal button").unbind("click");
						});
						$("#newFolderFormModal .submit-new-folder").click(function(){
							var folderName = $("#newFolderFormModal .txt-folder-name").val();
							var currentFolderNode = $('#formFolderTree').tree('getSelectedNode'); 
							var folderId = currentFolderNode.id;
							window.c20g.ws.eforms.NewFolder(folderName, folderId, function(folder) {
								$('#formFolderTree').tree('appendNode', {
									id : folder.id,
									label : folder.name,
									childrenLoaded : false,
									children : [ ]
								}, currentFolderNode);
								$('#formFolderTree').tree('openNode', currentFolderNode);
							})
							$("#newFolderFormModal .txt-folder-name").val("");
							$("#newFolderFormModal button").unbind("click");
						});
						$("#newFolderFormModal").modal('show');
			    	});
			    	window.c20g.ui.loading.show();
			    	window.c20g.ws.eforms.GetFolderForms(node.id, function(forms){
			    		context.folderFormsGrid.collection.reset();
			    		for(var i = 0; i < forms.length; i++) {
			    			forms[i].openFormButton = window.c20g.ui.templates.buildButton(" Open Form", window.c20g.constants.ui.SMALL_SUCCESS_BUTTON)
								.bind("click", { form : forms[i] }, function(e){
									var form = e.data.form;
									var currentFolderNode =$('#formFolderTree').tree('getSelectedNode');
									window.c20g.view.load("eforms_editor", {
										callback : function() {
											window.c20g.tab.loadActiveTab(context.parentTabControl);
										},
										loadCallback : function() {
											window.c20g.ui.getPreviousUI().$el.find("#formLibraryTabContent").empty();
										},
										form : form,
										folderId : currentFolderNode.id,
										folderName : currentFolderNode.name,
										version : form.version
									});
								});
							forms[i].printFormButton = window.c20g.ui.templates.buildButton(" Print Form", window.c20g.constants.ui.SMALL_WARNING_BUTTON)
								.bind("click", { form : forms[i] }, function(e){
									var form = e.data.form;
									var currentFolderNode =$('#formFolderTree').tree('getSelectedNode');
									window.c20g.view.load("eforms_editor", {
										callback : function() {
											window.c20g.tab.loadActiveTab(context.parentTabControl);
										},
										loadCallback : function() {
											window.c20g.ui.getPreviousUI().$el.find("#formLibraryTabContent").empty();
										},
										form : form,
										folderId : currentFolderNode.id,
										folderName : currentFolderNode.name,
										version : form.version,
										print : true
									});
								});
							forms[i].showFormVersionsButton = window.c20g.ui.templates.buildButton(" Show Versions", window.c20g.constants.ui.SMALL_WARNING_BUTTON)
								.bind("click", { form : forms[i] }, function(e){
									var form = e.data.form;
									window.c20g.view.load("eforms_formversions", {
										callback : function() {
											window.c20g.tab.loadActiveTab(context.parentTabControl);
										},
										loadCallback : function() {
											window.c20g.ui.getPreviousUI().$el.find("#formLibraryTabContent").empty();
										},
										form : form
									});
								});
							forms[i].deleteFormButton = window.c20g.ui.templates.buildButton(" Delete Form", window.c20g.constants.ui.SMALL_DANGER_BUTTON)
								.bind("click", { form : forms[i] }, function(e){
									var form = e.data.form;
									$('#confirmDeleteFormModal .cancel-delete-form').click(function(){
										$('#confirmDeleteFormModal button').unbind('click');
									});
									$('#confirmDeleteFormModal .confirm-delete-form').click(function(){
										$('#confirmDeleteFormModal button').unbind('click');
										window.c20g.ws.eforms.DeleteFormsByKey(form.key, function() {
											window.c20g.tab.loadActiveTab(context.parentTabControl);
										});
									});
									$('#confirmDeleteFormModal').modal('show');
								})
			    				.addClass('open-deleteFormDialog');
			    			context.folderFormsGrid.collection.add(forms[i]);
			    		}
			    		window.c20g.ui.loading.hide();	
			    	});
					$("#formListPanelHeading a").text("Forms - " + node.name);
			    }
			);

			$("#formFolderTreePanelHeading .btn-new-top-folder").click(function(){
				$("#newFolderFormModal .cancel-new-folder").click(function(){
					$("#newFolderFormModal .txt-folder-name").val("");
					$("#newFolderFormModal button").unbind("click");
				});
				$("#newFolderFormModal .submit-new-folder").click(function(){
					var folderName = $("#newFolderFormModal .txt-folder-name").val();
					window.c20g.ws.eforms.NewFolder(folderName, null, function(folder) {
						$('#formFolderTree').tree('appendNode', {
							id : folder.id,
							label : folder.name,
							childrenLoaded : false,
							children : [ ]
						});
					})
					$("#newFolderFormModal .txt-folder-name").val("");
					$("#newFolderFormModal button").unbind("click");
				});
				$("#newFolderFormModal").modal('show');
			});

			var columns = [];
			columns.push({
				name : 'key',
				label : 'Form Key',
				cell : 'string',
				editable : false,
				width: 15,
				headerCell: "custom"
			});
			columns.push({
				name : 'version',
				label : 'Version',
				cell : 'string',
				editable : false,
				width: 10,
				headerCell: "custom"
			});
			columns.push({
				name : 'name',
				label : 'Form Name',
				cell : 'string',
				editable : false,
				width: 35,
				headerCell: "custom"
			});
			columns.push({
				name : 'openFormButton',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 10,
				headerCell: "custom"
			});
			columns.push({
				name : 'printFormButton',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 10,
				headerCell: "custom"
			});
			columns.push({
				name : 'showFormVersionsButton',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 10,
				headerCell: "custom"
			});
			columns.push({
				name : 'deleteFormButton',
				label : '',
				cell : 'jq-custom',
				editable : false,
				width: 10,
				headerCell: "custom"
			});

			context.folderFormsGrid = new Backgrid.Grid({
				columns : columns,
				collection : new window.c20g.grid.RowCollection([]),
				emptyText: "No Forms to Display"				
			});

			var $folderFormsGrid = context.folderFormsGrid.render().$el;
			var $folderFormsGridContainer = $("#formLibraryTabContent").find("#folder-forms-grid-container");
			$folderFormsGridContainer.empty().append($folderFormsGrid);

			window.c20g.ui.loading.hide();
		});

	},

	folderTree : null,

	folderFormsGrid : null,

	parentTabControl : null
}