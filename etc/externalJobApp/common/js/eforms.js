window.c20g.eforms = {

	// parameters:
	// 		formNode -> parse JSON structure for jqTree
	// 		formSelector -> jQuery object for root of form (assumes div>form)
	buildForm : function(formNode, formSelector) {
		var context = this;

		window.c20g.ui.loading.show();

		// Clear the currently rendered form
		$(formSelector).empty();

		var formTitle = formNode.name;
		var formId = formNode.elementId;
		var instructions = formNode.description;

		// Create the DIV for the rendered form and populate the title
		$(formSelector).append('<div id="'+formId+'"></div>');
		$('#'+formId).append($('<legend>').text(formTitle));
		if(instructions && typeof instructions === 'string' && instructions.trim() !== '') {
			$('#'+formId+'>legend').css('margin-bottom', '0px');
			$('#'+formId).append($('<p class="bg-warning form-instructions" style="padding:10px;">').text(instructions));
		}

		// Iterate over the form elements and add them to the rendered form
		for(var i = 0; i < formNode.children.length; i++) {
			context.addElementToForm(formId, formNode.children[i]);
		}

		window.c20g.ui.loading.hide();
	},

	addElementToForm : function(containerId, element) {
		var context = this;

		var formContainer = $("#"+containerId).parent();

		// Clone the template of the correct control type and append it (to the form or a column)
		if(element.type && element.type === 'text') {
			formContainer.find("#"+containerId).append(
				$("#textInputTemplate>.form-group").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.placeholder) {
				formContainer.find('#'+element.elementId+'>input').attr('placeholder', element.placeholder);
			}
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = $("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'password') {
			formContainer.find("#"+containerId).append(
				$("#passwordInputTemplate>.form-group").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.placeholder) {
				formContainer.find('#'+element.elementId+'>input').attr('placeholder', element.placeholder);
			}
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = $("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'date') {
			formContainer.find("#"+containerId).append(
				$("#dateInputTemplate>.form-group").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = $("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'time') {
			formContainer.find("#"+containerId).append(
				$("#timeInputTemplate>.form-group").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = $("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'textarea') {
			formContainer.find("#"+containerId).append(
				$("#textAreaTemplate>.form-group").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.placeholder) {
				formContainer.find('#'+element.elementId+'>textarea').attr('placeholder', element.placeholder);
			}
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = $("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'select') {
			formContainer.find("#"+containerId).append(
				$("#selectTemplate>.form-group").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			for(var i = 0; i < element.options.length; i++) {
				formContainer.find("#"+element.elementId+" select").append(
					$("#selectOptionTemplate>select>option").clone()
						.attr('value', element.options[i].value).text(element.options[i].display)
				);
			}
			formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = $("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'radio') {
			formContainer.find("#"+containerId).append(
				$("#radiosTemplate>.form-group").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			for(var i = 0; i < element.options.length; i++) {
				var newRadio = $("#radioOptionTemplate>.radioOption").clone();
				$(newRadio).find('input').attr('name', element.elementId);
				$(newRadio).find('input').attr('value', element.options[i].value);
				$(newRadio).find('input').attr('id', element.options[i].id);
				if(element.options[i].checked) {
					$(newRadio).find('input').attr('checked', 'true');
				}
				$(newRadio).find('.radioOptionText').html(element.options[i].display);
				formContainer.find("#"+element.elementId).append(newRadio);
			}
			formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = $("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'checkbox') {
			formContainer.find("#"+containerId).append(
				$("#checkboxesTemplate>.form-group").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			for(var i = 0; i < element.options.length; i++) {
				var newCheckbox = $("#checkboxOptionTemplate>.checkboxOption").clone();
				$(newCheckbox).find('input').attr('name', element.elementId);
				$(newCheckbox).find('input').attr('value', element.options[i].value);
				$(newCheckbox).find('input').attr('id', element.options[i].id);
				if(element.options[i].checked) {
					$(newCheckbox).find('input').attr('checked', 'true');
				}
				$(newCheckbox).find('.checkboxOptionText').html(element.options[i].display);
				formContainer.find("#"+element.elementId).append(newCheckbox);
			}
			formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = $("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'static') {
			formContainer.find("#"+containerId).append(
				$("#staticFieldTemplate>.form-group").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			formContainer.find('#'+element.elementId+'>label').text(element.name);
			formContainer.find('#'+element.elementId+'>p').text(element.value);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = $("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'buttonset') {
			formContainer.find("#"+containerId).append(
				$("#buttonsetTemplate>.buttonset").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			for(var i = 0; i < element.buttons.length; i++) {
				var newButton = $("#buttonTemplate>button").clone();
				$(newButton).attr('id', element.buttons[i].id);
				$(newButton).attr('value', element.buttons[i].display);
				$(newButton).text(element.buttons[i].display);
				$(newButton).attr('class', 'btn btn-'+element.buttons[i].type);
				formContainer.find("#"+element.elementId).append(newButton);
			}
		}
		else if(element.type && element.type === 'heading') {
			formContainer.find("#"+containerId)
				.append("<div class='form-group' field-type='heading' id='"+element.elementId+"'><"+element.style+"></"+element.style+"></div>");
			formContainer.find('#'+element.elementId + " " + element.style).text(element.name);
		}
		else if(element.type && element.type === 'callout') {
			formContainer.find("#"+containerId).append(
				$("#calloutTemplate>.bs-callout").clone()
					.attr('id', element.elementId).attr('field-type', element.type)
			);
			formContainer.find('#'+element.elementId+'>h4').text(element.name);
			formContainer.find('#'+element.elementId+'>p').text(element.content);
			formContainer.find('#'+element.elementId).addClass('bs-callout-'+element.class);
		}
		else if(element.type && element.type === 'container') {
			if(element.children) {
				formContainer.find("#"+containerId).append(
					$("#containerTemplate>.row").clone()
						.attr('id', element.elementId).attr('field-type', element.type)
				);
				var columnCount = element.children.length;
				var colWidth = 12 / columnCount;
				for(var i = 0; i < element.children.length; i++) {
					var column = element.children[i];
					formContainer.find("#"+element.elementId).append(
						$("#containerColumnTemplate>.formContainerColumn").clone()
							.attr('id', column.elementId).addClass('col-md-'+colWidth)
					);
					if(column.children) {
						for(var j = 0; j < column.children.length; j++) {
							context.addElementToForm(column.elementId, column.children[j]);
						}
					}
				}
			}
		}
	},

	getFieldValue : function(container, fieldId, type) {
		if(type === 'text') {
			return container.find("#"+fieldId+" input").val();
		}
		else if(type === 'password') {
			return container.find("#"+fieldId+" input").val();
		}
		else if(type === 'date') {
			return container.find("#"+fieldId+" input").val();
		}
		else if(type === 'time') {
			return container.find("#"+fieldId+" input").val();
		}
		else if(type === 'textarea') {
			return container.find("#"+fieldId+" textarea").val();
		}
		else if(type === 'select') {
			return container.find("#"+fieldId+" select").val();
		}
		else if(type === 'radio') {
			return $("#"+fieldId+" input[type=radio]:checked").val()
		}
		else if(type === 'checkbox') {
			return _.pluck($("#"+fieldId+" input:checked"), "value");
		}
		else if(type === 'static') {
			return container.find("#"+fieldId+">p").text();
		}
		else if(type === 'callout') {
			return container.find("#"+fieldId+">p").text();
		}
		else if(type === 'heading') {
			return container.find("#"+fieldId).text();
		}
		return undefined;
	},

	setFieldValue : function(container, fieldId, type, value) {
		if(type === 'text') {
			container.find("#"+fieldId+" input").val(value);
		}
		else if(type === 'password') {
			container.find("#"+fieldId+" input").val(value);
		}
		else if(type === 'date') {
			container.find("#"+fieldId+" input").val(value);
		}
		else if(type === 'time') {
			container.find("#"+fieldId+" input").val(value);
		}
		else if(type === 'textarea') {
			container.find("#"+fieldId+" textarea").val(value);
		}
		else if(type === 'select') {
			container.find("#"+fieldId+" select").val(value);
		}
		else if(type === 'radio') {
			$("#"+fieldId+" input[type=radio][value="+value+"]").attr("checked", "checked")
		}
		else if(type === 'checkbox') {
			debugger;
			$("#"+fieldId+" input:checkbox").removeAttr("checked");
			if(_.isArray(value)) {
				_.each(value, function(val) {
					$("#"+fieldId+" input:checkbox[value="+val+"]").prop("checked", true);
				});
			}
			else {
				$("#"+fieldId+" input:checkbox[value="+value+"]").prop("checked", true);
			}
		}
		else if(type === 'static') {
			container.find("#"+fieldId+">p").text(value);
		}
		else if(type === 'callout') {
			container.find("#"+fieldId+">p").text(value);
		}
		else if(type === 'heading') {
			container.find("#"+fieldId).children().text(value);
		}
	},

	doesFieldExist : function(container, fieldId) {
		var field = container.find("#"+fieldId);
		if(field.length !== 0) {
			// return true;
			var fieldType = container.find("#"+fieldId).attr("field-type");
			if(!_.isUndefined(fieldType) && fieldType.trim() !== "") {
				return fieldType;
			}
		}
		return false;
	},

	getFieldIds : function(container) {
		return _.pluck(container.find("div[field-type]"), "id");
	}

};