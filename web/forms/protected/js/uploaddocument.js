window.c20g.form.UploadDocument = {

	init : function() {
		window.c20g.dms.attach("fileUpload", { allowRename : true, size : 'form-control-xl' }); 
		$("#submitButton").click( window.c20g.form.UploadDocument.submit );
	},

	submit : function() { 
		if (window.c20g.c20g.form.UploadDocument.validate()) {
			window.c20g.c20g.form.UploadDocument.complete();
		}
	},

	validate : function() {
		var isValid = window.c20g.form.validateFormByClass(); // TODO make this also error for non-completed uploads
		return isValid;
	},

	complete : function() {
		var files = [];
		window.c20g.Util.showLoading();

		window.c20g.form.getValue('fileUpload').forEach( function(file) {
			files.push({ 
				"File" : { 
					"Uuid" : file.uuid,
					"Name" : file.name,
					"DocumentTypeId" : file.documentTypeId,
					"DocumentTypeOther" : file.documentTypeId == "9999999" ? file.documentTypeOther : ""
				}
			});
		});
		console.log(files);
	}
};