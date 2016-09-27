window.c20g.form.sampletask = {

	init : function(taskData, formContainer) {
		
		// Initial Get Data SOAP Calls
		// ...
				
		//------------------------------------------------------------
		// Prepopulation of Fields, this is also where you would make SOAP calls to initialize the data
		var sampleField1 = formContainer.find("#sampleField1").val(taskData.applicationData.SampleInput[0].SampleInput1[0].Text);
		var sampleField2 = formContainer.find("#sampleField2").val(taskData.applicationData.SampleInput[0].SampleInput2[0].Text);
		var date1 = formContainer.find("#date1");
		var date2 = formContainer.find("#date2");		
		//------------------------------------------------------------
		
		//------------------------------------------------------------
		// Validation Config
		var validation = this.validation = {
			"sampleField1Required": new window.c20g.validation.Validator({$el: sampleField1, v: "required", c: true}),
			"sampleField1MaxLength": new window.c20g.validation.Validator({$el: sampleField1, v: "maxlength", c: 20}),
			"sampleField2Required": new window.c20g.validation.Validator({$el: sampleField2, v: "required", c: true}),
			"sampleField2Email": new window.c20g.validation.Validator({$el: sampleField2, v: "decimal", c: true}),			
			"date1Required": new window.c20g.validation.Validator({$el: date1, v: "required", c: true}),			
			"date1DateBefore": new window.c20g.validation.Validator({$el: date1, v: "dateBefore", c: date2, message: "Must be before Date 2"})
		};		
		window.c20g.validation.util.activate(this.validation);		
		//------------------------------------------------------------		
		
		//------------------------------------------------------------
		// Setup Events
		formContainer.find("#cancelButton").click(function(e) {
			window.c20g.ui.unloadUI();
		});
		formContainer.find("#submitButton").click(function(e) {			
		
			// Call validation
			if(window.c20g.validation.util.validate(validation).length > 0) {
				e.preventDefault();
				return false;
			}
			
			// Make SOAP call
			var data = {				
				"Decision" : "APPROVED"				
			};
			window.c20g.ui.loading.show();
			window.c20g.ws.task.ClaimAndCompleteTask(taskData.taskId, data, "SampleOutput", "http://schemas.c20g.com/template/1.0", function(response) {
				window.c20g.ui.loading.hide();
				window.c20g.ui.unloadUI();
			});
		});
		//------------------------------------------------------------
		
		//------------------------------------------------------------
		// Setup Picker
		formContainer.find("#samplePicker").find("button").click(function(e) {
			window.c20g.picker.loadPicker({
				pickerName : "samplepicker",
				picked : function(data) {
					formContainer.find("#samplePickerValue").val(data.val);
					formContainer.find("#samplePickerDisplay").val(data.display);
				}
			});
		});
		//------------------------------------------------------------		
		
	},
	
	validator: null

};