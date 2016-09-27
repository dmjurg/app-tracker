window.c20g.form.eforms_form_container = {

	init : function(taskData, formData, formContainer) {

		var eformKey = formData.key;

		var context = this;
		context.taskData = taskData;
		context.formContainer = formContainer;
		
		context.formElementTree = $.parseJSON(formData.json);
	    context.buildForm();

	    if(!_.isUndefined(window.c20g.eforms[eformKey] && _.isFunction(window.c20g.eforms[eformKey].init))) {
	    	window.c20g.eforms[eformKey].init(taskData, formContainer);
	    	window.c20g.ui.loading.hide();
	    }
	    else {

	    	var inputModel = taskData.applicationData.DynamicEFormGenericInput[0];
			for (var appDataProp in inputModel) {
				if (inputModel.hasOwnProperty(appDataProp) && !(appDataProp.indexOf(":") > -1)) {
					var elementType = window.c20g.eforms.doesFieldExist(formContainer, appDataProp);
					if(elementType) {
						debugger;
						window.c20g.eforms.setFieldValue(formContainer, appDataProp, elementType, inputModel[appDataProp][0].Text);						
					}
				}
			}

	    	context.formContainer.find("#btnCancel").click(function(e){ 
				window.c20g.ui.unloadUI();
			});

			context.formContainer.find("#btnSubmit").click(function(e){ 
				e.preventDefault();
				data = {};
				var fields = window.c20g.eforms.getFieldIds(formContainer);

				data = {};
				for(var i = 0; i < fields.length; i++) {
					var elementType = window.c20g.eforms.doesFieldExist(formContainer, fields[i]);
					if(elementType) {
						var fieldValue = window.c20g.eforms.getFieldValue(formContainer, fields[i], elementType);
						if(_.isArray(fieldValue)) {
							var tempValues = [];
							for(var j = 0; j < fieldValue.length; j++) {
								tempValues.push(fieldValue[j]);
							}
							data[fields[i]] = {};
							data[fields[i]].value = tempValues;
						}
						else {
							data[fields[i]] = window.c20g.eforms.getFieldValue(formContainer, fields[i], elementType);
						}
					}
				}
				debugger;
				window.c20g.ws.task.ClaimAndCompleteTask(
						taskData.taskId, data, "DynamicEFormGenericOutput", "http://c20g.com/apps/schema/eforms", function(response) {				
					window.c20g.ui.unloadUI();
				});	
			});

		    window.c20g.ui.loading.hide();
	    }
	},

	buildForm : function() {
		var context = this;
		window.c20g.eforms.buildForm(context.formElementTree[0], $(".formRenderContainer>form", context.formContainer));
	},

	formContainer : null,

	taskData : null,

	formElementTree : null,

	formNodeReference : null
};
		