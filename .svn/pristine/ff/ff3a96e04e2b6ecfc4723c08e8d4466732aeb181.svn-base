window.c20g.ws.eforms = {

	GetTopLevelFolders : function(callback) {
		var paramNS = "http://c20g.com/apps/db/eforms/formfolder";
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetTopLevelFolders", 
			"http://c20g.com/apps/db/eforms/formfolder",
			[],
			paramNS
		);
		var sr = new SOAPRequest("GetTopLevelFolders", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var folders = [];
			var folderTuples = response.Body[0].GetTopLevelFoldersResponse[0].tuple;
			if(!_.isUndefined(folderTuples)) {
				for(var i = 0; i < folderTuples.length; i++) {
					var folder = {};
					folder.id = folderTuples[i].old[0].form_folder[0].id[0].Text;
					folder.name = folderTuples[i].old[0].form_folder[0].name[0].Text;
					folders.push(folder);
				}
			}
			callback && callback(folders);
		});
	},

	GetChildFolders : function(parentFolderId, callback) {
		var paramNS = "http://c20g.com/apps/db/eforms/formfolder";
		var soapParams = {
			'parentId' : parentFolderId
		};
		var methodName = 'GetChildFolders';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetChildFolders", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var folders = [];
			var folderTuples = response.Body[0].GetChildFoldersResponse[0].tuple;
			if(!_.isUndefined(folderTuples)) {
				for(var i = 0; i < folderTuples.length; i++) {
					var folder = {};
					folder.id = folderTuples[i].old[0].form_folder[0].id[0].Text;
					folder.name = folderTuples[i].old[0].form_folder[0].name[0].Text;
					folder.parentId = folderTuples[i].old[0].form_folder[0].parent_id[0].Text;
					folders.push(folder);
				}
			}
			callback && callback(folders);
		});
	},

	GetFolderForms : function(folderId, callback) {
		var paramNS = "http://c20g.com/apps/db/eforms/form";
		var soapParams = {
			'folderId' : folderId
		};
		var methodName = 'GetFolderForms';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetFolderForms", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var forms = [];
			var formTuples = response.Body[0].GetFolderFormsResponse[0].tuple;
			if(!_.isUndefined(formTuples)) {
				for(var i = 0; i < formTuples.length; i++) {
					var form = {};
					form.id = formTuples[i].old[0].form_form[0].id[0].Text;
					form.folderId = formTuples[i].old[0].form_form[0].folder_id[0].Text;
					form.key = formTuples[i].old[0].form_form[0].form_key[0].Text;
					form.version = formTuples[i].old[0].form_form[0].version[0].Text;
					form.name = formTuples[i].old[0].form_form[0].form_name[0].Text;
					form.description = formTuples[i].old[0].form_form[0].description[0].Text;
					form.createdBy = formTuples[i].old[0].form_form[0].created_by[0].Text;
					form.createdDate = formTuples[i].old[0].form_form[0].created_date[0].Text;
					form.json = formTuples[i].old[0].form_form[0].json[0].Text;
					forms.push(form);
				}
			}
			callback && callback(forms);
		});
	},

	NewFolder : function(name, parentId, callback) {
		var paramNS = "http://c20g.com/apps/db/eforms/formfolder";
		var soapParams = {};
		if(parentId) {
			soapParams = {
				'tuple' : {
					'new' : {
						'form_folder' : {
							'name' : name,
							'parent_id' : parentId
						}
					}
				}
			};
		}
		else {
			soapParams = {
				'tuple' : {
					'new' : {
						'form_folder' : {
							'name' : name
						}
					}
				}
			};
		}
		var methodName = 'Updateform_folder';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("Updateform_folder", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			folder = {};
			var responseFolder = response.Body[0].Updateform_folderResponse[0].tuple[0].new[0].form_folder[0];
			folder.id = responseFolder.id[0].Text;
			folder.name = responseFolder.name[0].Text;
			folder.parentId = responseFolder.parent_id[0].Text;
			callback && callback(folder);
		});
	},

	SaveForm : function(folderId, formKey, version, formName, description, createdBy, createdDate, json, callback) {
		var paramNS = "http://c20g.com/apps/db/eforms/form";
		var soapParams = {
			'tuple' : {
				'new' : {
					'form_form' : {
						'folder_id' : folderId,
						'form_key' : formKey,
						'version' : version,
						'form_name' : formName,
						'description' : description,
						'created_by' : createdBy,
						'created_date' : createdDate,
						'json' : json
					}
				}
			}
		};
		var methodName = 'Updateform_form';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("Updateform_form", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			callback && callback();
		});
	},

	GetFormVersions : function(formKey, callback) {
		var paramNS = "http://c20g.com/apps/db/eforms/form";
		var soapParams = {
			'formKey' : formKey
		};
		var methodName = 'GetFormVersions';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetFormVersions", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var forms = [];
			var formTuples = response.Body[0].GetFormVersionsResponse[0].tuple;
			if(!_.isUndefined(formTuples)) {
				for(var i = 0; i < formTuples.length; i++) {
					var form = {};
					form.id = formTuples[i].old[0].form_form[0].id[0].Text;
					form.folderId = formTuples[i].old[0].form_form[0].folder_id[0].Text;
					form.key = formTuples[i].old[0].form_form[0].form_key[0].Text;
					form.version = formTuples[i].old[0].form_form[0].version[0].Text;
					form.name = formTuples[i].old[0].form_form[0].form_name[0].Text;
					form.description = formTuples[i].old[0].form_form[0].description[0].Text;
					form.createdBy = formTuples[i].old[0].form_form[0].created_by[0].Text;
					form.createdDate = formTuples[i].old[0].form_form[0].created_date[0].Text;
					form.json = formTuples[i].old[0].form_form[0].json[0].Text;
					forms.push(form);
				}
			}
			callback && callback(forms);
		});
	},

	GetCurrentFormVersion : function(formKey, callback) {
		var paramNS = "http://c20g.com/apps/db/eforms/form";
		var soapParams = {
			'formKey' : formKey
		};
		var methodName = 'GetCurrentFormVersion';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetCurrentFormVersion", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var form = {};
			var formTuples = response.Body[0].GetCurrentFormVersionResponse[0].tuple;
			if(!_.isUndefined(formTuples)) {
				form.id = formTuples[0].old[0].form_form[0].id[0].Text;
				form.folderId = formTuples[0].old[0].form_form[0].folder_id[0].Text;
				form.key = formTuples[0].old[0].form_form[0].form_key[0].Text;
				form.version = formTuples[0].old[0].form_form[0].version[0].Text;
				form.name = formTuples[0].old[0].form_form[0].form_name[0].Text;
				form.description = formTuples[0].old[0].form_form[0].description[0].Text;
				form.createdBy = formTuples[0].old[0].form_form[0].created_by[0].Text;
				form.createdDate = formTuples[0].old[0].form_form[0].created_date[0].Text;
				form.json = formTuples[0].old[0].form_form[0].json[0].Text;
			}
			callback && callback(form);
		});
	},

	DeleteFormsByKey : function(formKey, callback) {
		var paramNS = "http://c20g.com/apps/bpm/eforms";
		var soapParams = {
			'formKey' : formKey
		};
		var methodName = 'DeleteFormsByKey';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("DeleteFormsByKey", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			callback && callback();
		});
	}

};