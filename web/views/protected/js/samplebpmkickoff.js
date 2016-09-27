window.c20g.view.samplebpmkickoff = {
	init: function(viewInfo, formContainer) {
		
		window.c20g.ui.loading.hide();
				
		//------------------------------------------------------------
		// Prepopulation of Fields, this is also where you would make SOAP calls to initialize the data
		var startInfo = formContainer.find("#startInfo");				
		//------------------------------------------------------------
		
		//------------------------------------------------------------
		// Validation Config
		var validation = this.validation = {
			"startInfoRequired": new window.c20g.validation.Validator({$el: startInfo, v: "required", c: true})
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
			window.c20g.ui.loading.show(null, "Starting...");
			window.c20g.ws.template.SampleBPM("Nothing", function(response){
				window.c20g.ui.unloadUI();
			});
		});
		//------------------------------------------------------------		
			
	}
};
