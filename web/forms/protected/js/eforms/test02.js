window.c20g.eforms.test02 = {
	init : function(taskData, formContainer) {

		/*
		window.c20g.eforms.setFieldValue(formContainer, 'text1', 'text', '123');
		window.c20g.eforms.setFieldValue(formContainer, 'password1', 'password', 'abcdefg');
		window.c20g.eforms.setFieldValue(formContainer, 'date1', 'date', '1980-01-21');
		window.c20g.eforms.setFieldValue(formContainer, 'time1', 'time', '12:00');
		window.c20g.eforms.setFieldValue(formContainer, 'textarea1', 'textarea', 'Lorem ipsum dolor sit amet');
		window.c20g.eforms.setFieldValue(formContainer, 'select1', 'select', '2');

		window.c20g.eforms.setFieldValue(formContainer, 'static1', 'static', 'Hello World');
		window.c20g.eforms.setFieldValue(formContainer, 'heading1', 'heading', 'Booooo yeah');
		*/

		formContainer.find("#btnCancel").click(function(e){ 
				window.c20g.ui.unloadUI();
		});

		formContainer.find("#btnSubmit").click(function(e){ 
			e.preventDefault();

			var fields = window.c20g.eforms.getFieldIds(formContainer);
			
			// var text1 = window.c20g.eforms.getFieldValue(formContainer, 'text1', 'text');
			// var password1 = window.c20g.eforms.getFieldValue(formContainer, 'password1', 'text');

			data = {};
			for(var i = 0; i < fields.length; i++) {
				var elementType = window.c20g.eforms.doesFieldExist(formContainer, fields[i]);
				if(elementType) {
					data[fields[i]] = window.c20g.eforms.getFieldValue(formContainer, fields[i], elementType);
				}
			}

			window.c20g.ws.task.ClaimAndCompleteTask(
					taskData.taskId, data, "DynamicEFormGenericOutput", "http://c20g.com/apps/schema/eforms", function(response) {				
				window.c20g.ui.unloadUI();
			});	
		});

	    window.c20g.ui.loading.hide();

	}
};