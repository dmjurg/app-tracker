window.c20g.dms = {
	
	// Local Global Data
	fileInputs: {},
	completed: {},
	callback: null,	
	keys: [],
	currentFileKey: 0,	
	reset: function() {
		window.c20g.dms.fileInputs = {};
		window.c20g.dms.completed = {};
		window.c20g.dms.callback = null;
		window.c20g.dms.keys = [];		
		window.c20g.dms.currentFileKey = 0;
	},
	
	done: function() {
		var completed = window.c20g.dms.completed;
		var fileInputs = window.c20g.dms.fileInputs;
		var callback = window.c20g.dms.callback;			
		window.c20g.dms.reset();
		callback(fileInputs, completed);		
	},
	
	uploadComplete: function(data) {
		if(window.c20g.error.isError(data)) {
			window.c20g.completed = data; // Error gets sent back
			window.c20g.dms.done();
		}	
		else {
			window.c20g.dms.completed[window.c20g.dms.keys[window.c20g.dms.currentFileKey]] = data;
			window.c20g.dms.currentFileKey++;
		}
		
		if(Object.keys(window.c20g.dms.fileInputs).length !== Object.keys(window.c20g.dms.completed).length) {				
			window.c20g.dms.uploadNextFile();
		}
		else {
			window.c20g.dms.done();
		}
	},
	
	uploadNextFile: function() {
		
		var $input = window.c20g.dms.fileInputs[window.c20g.dms.keys[window.c20g.dms.currentFileKey]];
		window.c20g.dms.upload($input, window.c20g.dms.uploadComplete);
	},
	
	uploadFiles : function(fileInputs, callback) {	
		window.c20g.dms.reset();		
		window.c20g.dms.fileInputs = fileInputs;
		window.c20g.dms.callback = callback;	
		window.c20g.dms.keys = Object.keys(fileInputs);
		if(Object.keys(fileInputs).length === 0) {
			window.c20g.dms.done();
		}
		else {
			window.c20g.dms.uploadNextFile();
		}		
	},
	
	upload: function($input, callback) {						
			
		var upload = window.c20g.ui.templates.buildFileUploadForm($input.attr("id"));		
		var form = upload.find("form")			
		var methodXMLText = '<SOAP:Envelope xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/"><SOAP:Body><UploadDocuments xmlns="http://schemas.c20g.com/bpm/jackrabbit/1.0"><FilesRequest>###FILES###</FilesRequest></UploadDocuments></SOAP:Body></SOAP:Envelope>';
		form.find('input[name="methodXML"]').val(methodXMLText);		
		var formData = new FormData(form.get(0));		
		var fileString = "<File><FileName>Upload:FileName1</FileName><FileContent>Upload:FileContent1</FileContent><FileIdentifier>"+window.c20g.util.generateUIDv4()+"</FileIdentifier></File>";		
		formData.append("file1", $input.get(0).files[0]);		
		formData.append("methodXML", $("input[name='methodXML']", form).val().replace("###FILES###",fileString));
		
		// Add form to body
		$("body").append(upload);
		
		// Make AJAX call to start the upload
		window.c20g.ui.loading.show(null, "Uploading...");
		var jqXHR = $.ajax({
			url: form.attr("action"),
			type: 'POST',
			data: formData,
			async: true,
			cache: false,
			contentType: false,
			processData: false,
			success: function (returndata, textStatus, jqXHR) {				
				var result = null;				
				try {
					var responseJSON = $.cordys.json.xml2js(  $.parseXML(returndata) );
					result = responseJSON.html.head.script["SOAP:Envelope"]["SOAP:Body"].UploadDocumentsResponse.FilesResponse.File;					
				} catch (e) {
					result = new window.c20g.error.Error("Unable to upload file");
					window.c20g.ui.loading.hide(); /// TODO: REMOVE THIS WHEN NOT NEEDED
				}
				upload.remove();				
				callback(result);								
			},
			xhr: function() {
				var xhr = $.ajaxSettings.xhr() ;
				xhr.upload.addEventListener('progress', function(e) {
					var perc = Math.round(e.loaded / e.total * 100);
					if (perc == 100) {
						perc = 99;
					}
					// PROGRESS CHANGED HERE					
				}, false);
				return xhr;
			}
		});
		
	},
	
	download : function(uuid, fileName) {	
		var download = window.c20g.ui.templates.buildFileDownloadForm();		
		download.find("form").find("#soapMessage").val('<SOAP:Envelope xmlns:SOAP="http://schemas.xmlsoap.org/soap/envelope/"><SOAP:Body><GetDocument xmlns="http://schemas.c20g.com/bpm/jackrabbit/1.0"><uuid></uuid></GetDocument></SOAP:Body></SOAP:Envelope>');
		download.find("form").find("#soapMessage").val(download.find("form").find("#soapMessage").val().replace(/<uuid>[^<]*<\/uuid>/, '<uuid>'+uuid+'</uuid>'));
		download.find("form").find("#fileName").val(fileName);			
		$(".temp-content").empty().append(download);
		download.find("form").submit();		
	}
		
};