window.c20g.view.eforms_editor = {
	init: function(viewInfo, formContainer) {

		var context = this;
		context.formContainer = formContainer;
		context.viewInfo = viewInfo;

		context.folderId = viewInfo.folderId;
		context.folderName = viewInfo.folderName;
		context.formVersion = viewInfo.version;

		context.configGrids = {};

		// Create the root of the form element tree
		if(viewInfo.form) {
			context.initialFormConfig = viewInfo.form;
			context.formElementTree = $.parseJSON(context.initialFormConfig.json);
			if(context.formElementTree[0] && context.formElementTree[0].elementCounters) {
				context.elementCounters = {
					element : !_.isUndefined(context.formElementTree[0].elementCounters.element) ? context.formElementTree[0].elementCounters.element : 0,
					text : !_.isUndefined(context.formElementTree[0].elementCounters.text) ? context.formElementTree[0].elementCounters.text : 0,
					password : !_.isUndefined(context.formElementTree[0].elementCounters.password) ? context.formElementTree[0].elementCounters.password : 0,
					date : !_.isUndefined(context.formElementTree[0].elementCounters.date) ? context.formElementTree[0].elementCounters.date : 0,
					time : !_.isUndefined(context.formElementTree[0].elementCounters.time) ? context.formElementTree[0].elementCounters.time : 0,
					textarea : !_.isUndefined(context.formElementTree[0].elementCounters.textarea) ? context.formElementTree[0].elementCounters.textarea : 0,
					select : !_.isUndefined(context.formElementTree[0].elementCounters.select) ? context.formElementTree[0].elementCounters.select : 0,
					radio : !_.isUndefined(context.formElementTree[0].elementCounters.radio) ? context.formElementTree[0].elementCounters.radio : 0,
					checkbox : !_.isUndefined(context.formElementTree[0].elementCounters.checkbox) ? context.formElementTree[0].elementCounters.checkbox : 0,
					heading : !_.isUndefined(context.formElementTree[0].elementCounters.heading) ? context.formElementTree[0].elementCounters.heading : 0,
					static : !_.isUndefined(context.formElementTree[0].elementCounters.static) ? context.formElementTree[0].elementCounters.static : 0,
					buttonset : !_.isUndefined(context.formElementTree[0].elementCounters.buttonset) ? context.formElementTree[0].elementCounters.buttonset : 0,
					button : !_.isUndefined(context.formElementTree[0].elementCounters.button) ? context.formElementTree[0].elementCounters.button : 0,
					callout : !_.isUndefined(context.formElementTree[0].elementCounters.callout) ? context.formElementTree[0].elementCounters.callout : 0,
					container : !_.isUndefined(context.formElementTree[0].elementCounters.container) ? context.formElementTree[0].elementCounters.container : 0,
					column : !_.isUndefined(context.formElementTree[0].elementCounters.column) ? context.formElementTree[0].elementCounters.column : 0
				};
			}
			else {
				context.elementCounters = {
					element : 0,
					text : 0,
					password : 0,
					date : 0,
					time : 0,
					textarea : 0,
					select : 0,
					radio : 0,
					checkbox : 0,
					heading : 0,
					static : 0,
					buttonset : 0,
					button : 0,
					callout : 0,
					container : 0,
					column : 0
				};
			}
		}
		else {
			context.initialFormConfig = null;
			context.formElementTree = [{
				id : 'form',
				label : 'New Form',
				type : 'form',
				elementId : 'tmpMainForm',
				folderId : context.folderId,
				version : context.formVersion,
				key : '',
				description : '',
				children : [ ]
			}];
			context.elementCounters = {
				element : 0,
				text : 0,
				password : 0,
				date : 0,
				time : 0,
				textarea : 0,
				select : 0,
				radio : 0,
				checkbox : 0,
				heading : 0,
				static : 0,
				buttonset : 0,
				button : 0,
				callout : 0,
				container : 0,
				column : 0
			};
		}

		// Initialize the tree control and save a reference
		$('#formStructureTree').tree({
	        data: context.formElementTree,
	        useContextMenu : true,
	        autoOpen : true
	    });
	    context.formNodeReference = $('#formStructureTree').tree('getNodeById', 'form');

	    // Load the correct property editor when a tree node is clicked
	    $('#formStructureTree').bind(
		    'tree.click',
		    function(event) {
		        var node = event.node;
		        context.initializeFormElementPropertiesEditor[node.type](context, node);
		    }
		);

		$(".btn-close-form-editor").click(function() {
			window.c20g.ui.unloadUI();
		});

		$(".btn-save-form-editor").click(function() {
			
			var rootNode = context.formNodeReference;
			var formKey = rootNode.key;
			var formVersion = 0;
			if(context.initialFormConfig) {
				formVersion = parseInt(rootNode.version)+1;
			}
			else {
				formVersion = 1;
			}
			var formName = rootNode.name;
			var description = rootNode.description;
			var createdBy = window.c20g.session.currentUser.userName;
			var createdDate = moment().format("YYYY-MM-DD[T]HH[:]mm[:]ss[.0]");
			var formTreeRoot = $('#formStructureTree').tree('getNodeById', 'form');
			formTreeRoot.version = formVersion;
			$('#formStructureTree').tree('updateNode', formTreeRoot, formTreeRoot);
			var formConfigJSON = $('#formStructureTree').tree('toJson');
			window.c20g.ws.eforms.SaveForm(context.folderId, formKey, formVersion, formName, description, createdBy, createdDate, formConfigJSON, function() {
				window.c20g.ui.unloadUI();
			});
		});

		if(context.viewInfo.readOnly) {
			$('#form-configurator-row').hide();
			$('#formEditorButtons').hide();
			$('#formEditorPreviewPanelHeader').text(" Form Preview (Read-Only)");
		}

		// Initialize the form container
	    context.rebuildForm();
	},

	rebuildForm : function() {
		var context = this;

		// Clear the currently rendered form
		this.formContainer.find("#formPreviewBody>form").empty();

		$('#formStructureTree').tree('openNode', context.formNodeReference);
		var formNode = $('#formStructureTree').tree('getTree').children[0];
		var formTitle = formNode.name;
		var formId = formNode.elementId;
		var instructions = formNode.description;

		// Create the DIV for the rendered form and populate the title
		$('#formPreviewBody>form').append('<div id="'+formId+'"></div>');
		$('#'+formId).append($('<legend>').text(formTitle));
		if(instructions && typeof instructions === 'string' && instructions.trim() !== '') {
			$('#'+formId+'>legend').css('margin-bottom', '0px');
			$('#'+formId).append($('<p class="bg-warning form-instructions" style="padding:10px;">').text(instructions));
		}
		// Iterate over the form elements and add them to the rendered form
		for(var i = 0; i < formNode.children.length; i++) {
			this.addElementToFormPreview(formId, formNode.children[i]);
		}

		window.c20g.ui.loading.hide();

		if(context.viewInfo.print) {
			$('#form-configurator-row').hide();
			$('#formEditorButtons').hide();
			context.formContainer.find(".button-group").hide();
			setTimeout(function() { 
				window.print();
				window.c20g.ui.unloadUI();
			}, 1000); 
		}
	},

	addElementToFormPreview : function(containerId, element) {
		var context = this;

		// Clone the template of the correct control type and append it (to the form or a column)
		if(element.type && element.type === 'text') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#textInputTemplate>.form-group").clone()
					.attr('id', element.elementId)
			);
			context.formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.placeholder) {
				context.formContainer.find('#'+element.elementId+'>input').attr('placeholder', element.placeholder);
			}
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				context.formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				context.formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'password') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#passwordInputTemplate>.form-group").clone()
					.attr('id', element.elementId)
			);
			context.formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.placeholder) {
				context.formContainer.find('#'+element.elementId+'>input').attr('placeholder', element.placeholder);
			}
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				context.formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				context.formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'date') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#dateInputTemplate>.form-group").clone()
					.attr('id', element.elementId)
			);
			context.formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				context.formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				context.formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'time') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#timeInputTemplate>.form-group").clone()
					.attr('id', element.elementId)
			);
			context.formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				context.formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				context.formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'textarea') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#textAreaTemplate>.form-group").clone()
					.attr('id', element.elementId)
			);
			context.formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.placeholder) {
				context.formContainer.find('#'+element.elementId+'>textarea').attr('placeholder', element.placeholder);
			}
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				context.formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				context.formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'select') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#selectTemplate>.form-group").clone()
					.attr('id', element.elementId)
			);
			for(var i = 0; i < element.options.length; i++) {
				context.formContainer.find("#"+element.elementId+" select").append(
					context.formContainer.find("#selectOptionTemplate>select>option").clone()
						.attr('value', element.options[i].value).text(element.options[i].display)
				);
			}
			context.formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				context.formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				context.formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'radio') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#radiosTemplate>.form-group").clone()
					.attr('id', element.elementId)
			);
			for(var i = 0; i < element.options.length; i++) {
				var newRadio = context.formContainer.find("#radioOptionTemplate>.radioOption").clone();
				$(newRadio).find('input').attr('name', element.elementId);
				$(newRadio).find('input').attr('value', element.options[i].value);
				$(newRadio).find('input').attr('id', element.options[i].id);
				if(element.options[i].checked) {
					$(newRadio).find('input').attr('checked', 'true');
				}
				$(newRadio).find('.radioOptionText').html(element.options[i].display);
				context.formContainer.find("#"+element.elementId).append(newRadio);
			}
			context.formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				context.formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				context.formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'checkbox') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#checkboxesTemplate>.form-group").clone()
					.attr('id', element.elementId)
			);
			for(var i = 0; i < element.options.length; i++) {
				var newCheckbox = context.formContainer.find("#checkboxOptionTemplate>.checkboxOption").clone();
				$(newCheckbox).find('input').attr('name', element.elementId);
				$(newCheckbox).find('input').attr('value', element.options[i].value);
				$(newCheckbox).find('input').attr('id', element.options[i].id);
				if(element.options[i].checked) {
					$(newCheckbox).find('input').attr('checked', 'true');
				}
				$(newCheckbox).find('.checkboxOptionText').html(element.options[i].display);
				context.formContainer.find("#"+element.elementId).append(newCheckbox);
			}
			context.formContainer.find('#'+element.elementId+'>label').text(element.name);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				context.formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				context.formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'static') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#staticFieldTemplate>.form-group").clone()
					.attr('id', element.elementId)
			);
			context.formContainer.find('#'+element.elementId+'>label').text(element.name);
			context.formContainer.find('#'+element.elementId+'>p').text(element.value);
			if(element.instructions && typeof element.instructions === 'string' && element.instructions.trim() !== '') {
				var instructionBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
				$(instructionBlock).text(element.instructions);
				$(instructionBlock).attr('id', 'instructions-'+element.elementId);
				context.formContainer.find('#'+element.elementId+'>input').attr('aria-describedby', 'instructions-'+element.elementId);
				context.formContainer.find("#"+containerId).append(instructionBlock);
			}
		}
		else if(element.type && element.type === 'buttonset') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#buttonsetTemplate>.buttonset").clone()
					.attr('id', element.elementId)
			);
			for(var i = 0; i < element.buttons.length; i++) {
				var newButton = context.formContainer.find("#buttonTemplate>button").clone();
				$(newButton).attr('id', element.buttons[i].id);
				$(newButton).attr('value', element.buttons[i].display);
				$(newButton).text(element.buttons[i].display);
				$(newButton).attr('class', 'btn btn-'+element.buttons[i].type);
				context.formContainer.find("#"+element.elementId).append(newButton);
			}
		}
		else if(element.type && element.type === 'heading') {
			context.formContainer.find("#"+containerId).append("<div class='form-group' id='"+element.elementId+"'><"+element.style+"></"+element.style+"></div>");
			context.formContainer.find('#'+element.elementId + " " + element.style).text(element.name);
		}
		else if(element.type && element.type === 'callout') {
			context.formContainer.find("#"+containerId).append(
				context.formContainer.find("#calloutTemplate>.bs-callout").clone()
					.attr('id', element.elementId)
			);
			context.formContainer.find('#'+element.elementId+'>h4').text(element.name);
			context.formContainer.find('#'+element.elementId+'>p').text(element.content);
			context.formContainer.find('#'+element.elementId).addClass('bs-callout-'+element.class);
		}
		else if(element.type && element.type === 'container') {
			if(element.children) {
				context.formContainer.find("#"+containerId).append(
					context.formContainer.find("#containerTemplate>.row").clone()
						.attr('id', element.elementId)
				);
				var columnCount = element.children.length;
				var colWidth = 12 / columnCount;
				for(var i = 0; i < element.children.length; i++) {
					var column = element.children[i];
					context.formContainer.find("#"+element.elementId).append(
						context.formContainer.find("#containerColumnTemplate>.formContainerColumn").clone()
							.attr('id', column.elementId).addClass('col-md-'+colWidth)
					);
					if(column.children) {
						for(var j = 0; j < column.children.length; j++) {
							context.addElementToFormPreview(column.elementId, column.children[j]);
						}
					}
				}
			}
		}
	},

	loadFormElementPropertiesEditor : function(node, editorTitle, editorId) {
		var context = this;

		// Remove the current (old) properties editor form
		context.formContainer.find('.btn-add-form-child').popover('hide');
		context.formContainer.find('.btn-add-column-child').popover('hide');
		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body button").unbind('click');
		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body").empty();
		context.configGrids = {};

		// Set the title for the property editor form
		context.formContainer.find("#formElementPropertiesPanelHeading>.panel-title>a").text(editorTitle);

		// Clone the correct type of property editor and add it to the properties pane
		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body").append(
        	context.formContainer.find("#elementEditorTemplates>#"+editorId+">.elementPropertyEditorForm").clone().show()
        );
	},

	addTreeElement : function(parentNode, element) {
		var context = this;
		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
		$('#formStructureTree').tree('appendNode', element, parentNode);
		$('#formStructureTree').tree('openNode', parentNode);
		context.rebuildForm();
	},

	deleteTreeElement : function(node) {
		var context = this;

		// Remove the selected node, make sure none are selected, and re-render the form (without the old element)
		$('#formStructureTree').tree('removeNode', node);
    	$('#formStructureTree').tree('selectNode', null);
    	context.rebuildForm();

    	// Re-render the property editor form with a generic "select something" message
    	context.formContainer.find("#formElementPropertiesPanelBody>.panel-body").empty();
    	context.formContainer.find("#formElementPropertiesPanelHeading>.panel-title > a").text("Current Element");
    	context.formContainer.find("#formElementPropertiesPanelBody>.panel-body").append("<p>Select a form element</p>");
	},

	initializeFormElementPropertiesEditor : {
		// Map of initialization functions for the various property editor forms...
		// They are simple for the most part, except for the ones for 'form' and 'column', which have 
		// the popup "add child" buttons to configure
		// ...some (checkboxes, radios, buttonsets, select boxes) also have config grids for contained items
		'form' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Form Properties', 'formPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-form-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .form-properties-elementid").parent().removeClass('has-error');
        		$("#formElementPropertiesPanelBody>.panel-body .form-properties-elementid").parent().find('.help-block').remove();
	        	var formTitle = $("#formElementPropertiesPanelBody>.panel-body .form-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .form-properties-elementid").val();
	        	var formKey = $("#formElementPropertiesPanelBody>.panel-body .form-properties-key").val();
	        	var formDescription = $("#formElementPropertiesPanelBody>.panel-body .form-properties-description").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .form-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .form-properties-elementid").attr('aria-describedby', 'error-form-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .form-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .form-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .form-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = formTitle;
	        	node.elementId = elementId;
	        	node.key = formKey;
	        	node.description = formDescription;

	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .form-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .form-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .form-properties-key").val(node.key);
	        $("#formElementPropertiesPanelBody>.panel-body .form-properties-version").val(context.formVersion);
	        $("#formElementPropertiesPanelBody>.panel-body .form-properties-description").val(node.description);

	        // if formconfig was passed in, this isn't a new form; can't change the form key
	        if(context.initialFormConfig) {
	        	$("#formElementPropertiesPanelBody>.panel-body .form-properties-key").attr('disabled', 'disabled');
	        }
	        
	        // Set up the buttons under "Add Child Element"
	        var popoverContent = context.formContainer.find("#elementEditorTemplates>#formChildSelect").html();
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover({
	        	 title: 'Select Element Type', 
	        	 content: popoverContent, 
	        	 html:true,
	        	 placement : 'bottom',
	        	 viewport : { "selector": "#formElementPropertiesPanelBody", "padding": 20 }
	        }).on('shown.bs.popover', function() {
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-text-child").click(function(e) {
	        		// Add text element to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.text);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'text',
						'id' : newId,
						'elementId' : 'text'+newElementId,
						'label' : 'New Text Input'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-password-child").click(function(e) {
	        		// Add password element to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.password);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'password',
						'id' : newId,
						'elementId' : 'password'+newElementId,
						'label' : 'New Password Input'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-date-child").click(function(e) {
	        		// Add date element to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.date);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'date',
						'id' : newId,
						'elementId' : 'date'+newElementId,
						'label' : 'New Date Input'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-time-child").click(function(e) {
	        		// Add time element to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.time);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'time',
						'id' : newId,
						'elementId' : 'time'+newElementId,
						'label' : 'New Time Input'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-textarea-child").click(function(e) {
	        		// Add textarea to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.textarea);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'textarea',
						'id' : newId,
						'elementId' : 'textarea'+newElementId,
						'label' : 'New Textarea'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-select-child").click(function(e) {
	        		// Add select box to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.select);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'select',
						'id' : newId,
						'elementId' : 'select'+newElementId,
						'label' : 'New Select Box',
						'options' : [
							{ 'value': '', 'display' : '' } //,
							// { 'value': '1', 'display' : 'Option 1' }
						]
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-radio-child").click(function(e) {
	        		// Add radio group to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.radio);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'radio',
						'id' : newId,
						'elementId' : 'radio'+newElementId,
						'label' : 'New Radio Group',
						'options' : [
							{ 'id' : 'radios0102-1', 'value' : '1', 'display' : 'Radio 1', 'checked' : true },
							{ 'id' : 'radios0102-2', 'value' : '2', 'display' : 'Radio 2', 'checked' : false }
						]
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-checkbox-child").click(function(e) {
	        		// Add checkbox group to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.checkbox);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'checkbox',
						'id' : newId,
						'elementId' : 'checkbox'+newElementId,
						'label' : 'New Checkbox Group',
						'options' : [
							{ 'id' : 'checkbox0102-1', 'value' : '1', 'display' : 'Checkbox 1', 'checked' : true },
							{ 'id' : 'checkbox0102-2', 'value' : '2', 'display' : 'Checkbox 2', 'checked' : false }
						]
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-static-child").click(function(e) {
	        		// Add static element to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.static);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'static',
						'id' : newId,
						'elementId' : 'static'+newElementId,
						'label' : 'New Static Field',
						'value' : 'Value' 
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-buttonset-child").click(function(e) {
	        		// Add buttonset group to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.buttonset);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'buttonset',
						'id' : newId,
						'elementId' : 'buttonset'+newElementId,
						'label' : 'New Buttonset',
						'buttons' : [
							{ 'id' : 'btnCancel', 'display' : 'Cancel', 'type' : 'warning' },
							{ 'id' : 'btnSubmit', 'display' : 'Submit', 'type' : 'primary' }
						]
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-heading-child").click(function(e) {
	        		// Add heading element to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.heading);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'heading',
						'id' : newId,
						'elementId' : 'heading'+newElementId,
						'label' : 'New Heading',
						'style' : 'h4'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-callout-child").click(function(e) {
	        		// Add callout element to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.callout);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'callout',
						'id' : newId,
						'elementId' : 'callout'+newElementId,
						'label' : 'New Callout',
						'content' : 'Callout Content',
						'class' : 'primary'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-container-child").click(function(e) {
	        		// Add container (column group) to form
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-form-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.container);
	        		context.addTreeElement(context.formNodeReference, {
	        			'type' : 'container',
						'id' : newId,
						'elementId' : 'container'+newElementId,
						'label' : 'New Container'
	        		});
	        		context.remapCountersToTree();
	        	});
	        });
		},
		'text' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Text Input Properties', 'textPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-text-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .text-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .text-properties-elementid").parent().find('.help-block').remove();
	        	var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .text-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .text-properties-elementid").val();
	        	var placeholder = $("#formElementPropertiesPanelBody>.panel-body .text-properties-placeholder").val();
	        	var instructions = $("#formElementPropertiesPanelBody>.panel-body .text-properties-instructions").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .text-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .text-properties-elementid").attr('aria-describedby', 'error-text-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .text-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .text-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .text-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.placeholder = placeholder;
	        	node.instructions = instructions;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
	        });
			
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .text-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .text-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .text-properties-placeholder").val(node.placeholder);
	        $("#formElementPropertiesPanelBody>.panel-body .text-properties-instructions").val(node.instructions);
		},
		'password' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Password Input Properties', 'passwordPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-password-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .password-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .password-properties-elementid").parent().find('.help-block').remove();
	        	var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .password-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .password-properties-elementid").val();
	        	var placeholder = $("#formElementPropertiesPanelBody>.panel-body .password-properties-placeholder").val();
	        	var instructions = $("#formElementPropertiesPanelBody>.panel-body .password-properties-instructions").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .password-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .password-properties-elementid").attr('aria-describedby', 'error-password-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .password-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .password-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .password-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.placeholder = placeholder;
	        	node.instructions = instructions;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .password-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .password-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .password-properties-placeholder").val(node.placeholder);
	        $("#formElementPropertiesPanelBody>.panel-body .password-properties-instructions").val(node.instructions);
		},
		'date' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Date Input Properties', 'datePropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-date-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .date-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .date-properties-elementid").parent().find('.help-block').remove();
				var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .date-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .date-properties-elementid").val();
	        	var instructions = $("#formElementPropertiesPanelBody>.panel-body .date-properties-instructions").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .date-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .date-properties-elementid").attr('aria-describedby', 'error-date-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .date-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .date-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .date-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.instructions = instructions;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
			});
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .date-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .date-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .date-properties-instructions").val(node.instructions);
		},
		'time' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Time Input Properties', 'timePropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-time-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .time-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .time-properties-elementid").parent().find('.help-block').remove();
				var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .time-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .time-properties-elementid").val();
	        	var instructions = $("#formElementPropertiesPanelBody>.panel-body .time-properties-instructions").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .time-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .time-properties-elementid").attr('aria-describedby', 'error-time-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .time-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .time-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .time-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.instructions = instructions;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
			});
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .time-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .time-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .time-properties-instructions").val(node.instructions);
		},
		'textarea' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Textarea Properties', 'textareaPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-textarea-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .textarea-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .textarea-properties-elementid").parent().find('.help-block').remove();
	        	var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .textarea-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .textarea-properties-elementid").val();
	        	var placeholder = $("#formElementPropertiesPanelBody>.panel-body .textarea-properties-placeholder").val();
	        	var instructions = $("#formElementPropertiesPanelBody>.panel-body .textarea-properties-instructions").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .textarea-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .textarea-properties-elementid").attr('aria-describedby', 'error-textarea-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .textarea-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .textarea-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .textarea-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.placeholder = placeholder;
	        	node.instructions = instructions;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .textarea-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .textarea-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .textarea-properties-placeholder").val(node.placeholder);
	        $("#formElementPropertiesPanelBody>.panel-body .textarea-properties-instructions").val(node.instructions);
		},
		'select' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Select Box Properties', 'selectPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-select-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .select-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .select-properties-elementid").parent().find('.help-block').remove();
        		var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .select-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .select-properties-elementid").val();
	        	var instructions = $("#formElementPropertiesPanelBody>.panel-body .select-properties-instructions").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .select-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .select-properties-elementid").attr('aria-describedby', 'error-select-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .select-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .select-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .select-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	var optModels = context.configGrids[node.elementId].collection.models;
	        	node.options = [];
	        	for(var i = 0; i < optModels.length; i++) {
	        		var opt = {};
	        		opt.value = optModels[i].attributes.optionValue;
	        		opt.display = optModels[i].attributes.optionDisplay;
	        		node.options.push(opt);
	        	}
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.instructions = instructions;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
        	});
        	context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
        	context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
        		context.deleteTreeElement(node);
	        });
        	$("#formElementPropertiesPanelBody>.panel-body .select-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .select-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .select-properties-instructions").val(node.instructions);

	        var columns = [];
			columns.push({
				name : '',
				cell : 'select-row',
				width: 5,
				headerCell: "select-all"
			});
			columns.push({
				name : 'optionValue',
				label : 'Value',
				cell : 'string',
				editable : true,
				width: 30,
				headerCell: "custom"
			});
			columns.push({
				name : 'optionDisplay',
				label : 'Display',
				cell : 'string',
				editable : true,
				width: 65,
				headerCell: "custom"
			});

			var selectOpts = [];
			for(var i = 0; i < node.options.length; i++) {
				var opt = {};
				opt.optionValue = node.options[i].value;
				opt.optionDisplay = node.options[i].display;
				selectOpts.push(opt);
			}
			context.configGrids[node.elementId] = new Backgrid.Grid({
				columns : columns,
				collection : new window.c20g.grid.RowCollection(selectOpts),
				emptyText : 'No Options'
			});
			var $optionsGrid = context.configGrids[node.elementId].render().$el;
			var $optionsGridContainer = context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .select-options-grid");
			$optionsGridContainer.empty().append($optionsGrid);

			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .fa-minus-circle").click(function(e) {
				context.configGrids[node.elementId].removeRow(context.configGrids[node.elementId].getSelectedModels());
			});

			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .fa-plus-circle").click(function(e) {
				context.configGrids[node.elementId].collection.add({ optionId : '', optionValue : '', optionDisplay : '', checked : false });
			});
		},
		'radio' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Radio Group Properties', 'radioPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-radio-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").parent().find('.help-block').remove();
	        	var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .radio-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").val();
	        	var instructions = $("#formElementPropertiesPanelBody>.panel-body .radio-properties-instructions").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").attr('aria-describedby', 'error-radio-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	var optModels = context.configGrids[node.elementId].collection.models;
	        	node.options = [];
	        	for(var i = 0; i < optModels.length; i++) {
	        		var existingNode = context.findExistingElementId(optModels[i].attributes.optionId);
	        		if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        			$("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").parent().addClass('has-error');
		        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
		        		$("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").attr('aria-describedby', 'error-radio-properties-elementid');
		        		$(errorTextBlock).text('Conflicting Element ID');
		        		$("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").parent().append(errorTextBlock);
	        		}
	        		var opt = {};
	        		opt.id = optModels[i].attributes.optionId;
	        		opt.value = optModels[i].attributes.optionValue;
	        		opt.display = optModels[i].attributes.optionDisplay;
	        		opt.checked = optModels[i].attributes.checked;
	        		node.options.push(opt);
	        	}
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.instructions = instructions;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .radio-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .radio-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .radio-properties-instructions").val(node.instructions);

	        var columns = [];
			columns.push({
				name : '',
				cell : 'select-row',
				width: 5,
				headerCell: "select-all"
			});
			columns.push({
				name : 'optionId',
				label : 'ID',
				cell : 'string',
				editable : true,
				width: 20,
				headerCell: "custom"
			});
			columns.push({
				name : 'optionValue',
				label : 'Value',
				cell : 'string',
				editable : true,
				width: 20,
				headerCell: "custom"
			});
			columns.push({
				name : 'optionDisplay',
				label : 'Display',
				cell : 'string',
				editable : true,
				width: 55,
				headerCell: "custom"
			});

			var radioOpts = [];
			for(var i = 0; i < node.options.length; i++) {
				var opt = {};
				opt.optionId = node.options[i].id;
				opt.optionValue = node.options[i].value;
				opt.optionDisplay = node.options[i].display;
				opt.checked = node.options[i].checked;
				radioOpts.push(opt);
			}
			context.configGrids[node.elementId] = new Backgrid.Grid({
				columns : columns,
				collection : new window.c20g.grid.RowCollection(radioOpts),
				emptyText : 'No Options'
			});
			var $optionsGrid = context.configGrids[node.elementId].render().$el;
			var $optionsGridContainer = context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .radio-options-grid");
			$optionsGridContainer.empty().append($optionsGrid);

			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .fa-minus-circle").click(function(e) {
				context.configGrids[node.elementId].removeRow(context.configGrids[node.elementId].getSelectedModels());
			});

			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .fa-plus-circle").click(function(e) {
				context.configGrids[node.elementId].collection.add({ optionValue : '', optionDisplay : '' });
			});

		},
		'checkbox' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Checkbox Group Properties', 'checkboxPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-checkbox-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-elementid").parent().find('.help-block').remove();
	        	var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-elementid").val();
	        	var instructions = $("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-instructions").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-elementid").attr('aria-describedby', 'error-checkbox-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	var optModels = context.configGrids[node.elementId].collection.models;
	        	node.options = [];
	        	for(var i = 0; i < optModels.length; i++) {
	        		var opt = {};
	        		opt.id = optModels[i].attributes.optionId;
	        		opt.value = optModels[i].attributes.optionValue;
	        		opt.display = optModels[i].attributes.optionDisplay;
	        		opt.checked = optModels[i].attributes.checked;
	        		node.options.push(opt);
	        	}
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.instructions = instructions;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .checkbox-properties-instructions").val(node.instructions);

	        var columns = [];
			columns.push({
				name : '',
				cell : 'select-row',
				width: 5,
				headerCell: "select-all"
			});
			columns.push({
				name : 'optionId',
				label : 'ID',
				cell : 'string',
				editable : true,
				width: 20,
				headerCell: "custom"
			});
			columns.push({
				name : 'optionValue',
				label : 'Value',
				cell : 'string',
				editable : true,
				width: 20,
				headerCell: "custom"
			});
			columns.push({
				name : 'optionDisplay',
				label : 'Display',
				cell : 'string',
				editable : true,
				width: 55,
				headerCell: "custom"
			});

			var checkOpts = [];
			for(var i = 0; i < node.options.length; i++) {
				var opt = {};
				opt.optionId = node.options[i].id;
				opt.optionValue = node.options[i].value;
				opt.optionDisplay = node.options[i].display;
				opt.checked = node.options[i].checked;
				checkOpts.push(opt);
			}
			context.configGrids[node.elementId] = new Backgrid.Grid({
				columns : columns,
				collection : new window.c20g.grid.RowCollection(checkOpts),
				emptyText : 'No Options'
			});
			var $optionsGrid = context.configGrids[node.elementId].render().$el;
			var $optionsGridContainer = context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .check-options-grid");
			$optionsGridContainer.empty().append($optionsGrid);

			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .fa-minus-circle").click(function(e) {
				context.configGrids[node.elementId].removeRow(context.configGrids[node.elementId].getSelectedModels());
			});

			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .fa-plus-circle").click(function(e) {
				context.configGrids[node.elementId].collection.add({ optionValue : '', optionDisplay : '' });
			});
		},
		'heading' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Static Field Properties', 'headingPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-heading-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .heading-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .heading-properties-elementid").parent().find('.help-block').remove();
				var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .heading-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .heading-properties-elementid").val();
	        	var style = $("#formElementPropertiesPanelBody>.panel-body .heading-properties-style").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .heading-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .heading-properties-elementid").attr('aria-describedby', 'error-heading-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .heading-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .heading-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .heading-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.style = style;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
			});
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .heading-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .heading-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .heading-properties-style").val(node.style);
		},
	    'static' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Static Field Properties', 'staticPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-static-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .static-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .static-properties-elementid").parent().find('.help-block').remove();
				var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .static-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .static-properties-elementid").val();
	        	var value = $("#formElementPropertiesPanelBody>.panel-body .static-properties-value").val();
	        	var instructions = $("#formElementPropertiesPanelBody>.panel-body .static-properties-instructions").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .static-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .static-properties-elementid").attr('aria-describedby', 'error-static-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .static-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .static-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .static-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.value = value;
	        	node.instructions = instructions;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
			});
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .static-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .static-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .static-properties-value").val(node.value);
	        $("#formElementPropertiesPanelBody>.panel-body .static-properties-instructions").val(node.instructions);
		},
		'buttonset' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Button Group Properties', 'buttonsetPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-buttonset-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-elementid").parent().find('.help-block').remove();
	        	var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-elementid").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-elementid").attr('aria-describedby', 'error-buttonset-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	var optModels = context.configGrids[node.elementId].collection.models;
	        	node.buttons = [];
	        	for(var i = 0; i < optModels.length; i++) {
	        		var opt = {};
	        		opt.id = optModels[i].attributes.buttonId;
	        		opt.display = optModels[i].attributes.buttonDisplay;
	        		opt.type = optModels[i].attributes.buttonClass;
	        		node.buttons.push(opt);
	        	}
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .buttonset-properties-elementid").val(node.elementId);

	        var columns = [];
			columns.push({
				name : '',
				cell : 'select-row',
				width: 5,
				headerCell: "select-all"
			});
			columns.push({
				name : 'buttonId',
				label : 'ID',
				cell : 'string',
				editable : true,
				width: 20,
				headerCell: "custom"
			});
			columns.push({
				name : 'buttonDisplay',
				label : 'Display',
				cell : 'string',
				editable : true,
				width: 45,
				headerCell: "custom"
			});
			columns.push({
				name : 'buttonClass',
				label : 'Type',
				cell : Backgrid.SelectCell.extend({
					optionValues: [
						["default", "default"], 
						["primary", "primary"], 
						["success", "success"], 
						["info", "info"], 
						["warning", "warning"], 
						["danger", "danger"]]
				}),
				editable : true,
				width: 30,
				headerCell: "custom"
			});

			var buttonOpts = [];
			for(var i = 0; i < node.buttons.length; i++) {
				var opt = {};
				opt.buttonId = node.buttons[i].id;
				opt.buttonDisplay = node.buttons[i].display;
				opt.buttonClass = node.buttons[i].type;
				buttonOpts.push(opt);
			}
			context.configGrids[node.elementId] = new Backgrid.Grid({
				columns : columns,
				collection : new window.c20g.grid.RowCollection(buttonOpts),
				emptyText : 'No Buttons'
			});
			var $optionsGrid = context.configGrids[node.elementId].render().$el;
			var $optionsGridContainer = context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .button-options-grid");
			$optionsGridContainer.empty().append($optionsGrid);

			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .fa-minus-circle").click(function(e) {
				context.configGrids[node.elementId].removeRow(context.configGrids[node.elementId].getSelectedModels());
			});

			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .fa-plus-circle").click(function(e) {
				context.configGrids[node.elementId].collection.add({ optionValue : '', optionDisplay : '' });
			});
		},
		'callout' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Callout Properties', 'calloutPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-callout-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .callout-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .callout-properties-elementid").parent().find('.help-block').remove();
				var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .callout-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .callout-properties-elementid").val();
	        	var style = $("#formElementPropertiesPanelBody>.panel-body .callout-properties-style").val();
	        	var content = $("#formElementPropertiesPanelBody>.panel-body .callout-properties-content").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .callout-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .callout-properties-elementid").attr('aria-describedby', 'error-callout-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .callout-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .callout-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .callout-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	node.class = style;
	        	node.content = content;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
			});
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .callout-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .callout-properties-elementid").val(node.elementId);
	        $("#formElementPropertiesPanelBody>.panel-body .callout-properties-style").val(node.class);
	        $("#formElementPropertiesPanelBody>.panel-body .callout-properties-content").val(node.content);
		},
		'container' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Container Properties', 'containerPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-container-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .container-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .container-properties-elementid").parent().find('.help-block').remove();
	        	var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .container-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .container-properties-elementid").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .container-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .container-properties-elementid").attr('aria-describedby', 'error-container-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .container-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .container-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .container-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-up").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-element-down").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column").click(function() {
	        	var nodeChildren = node.children;
	        	if(nodeChildren && nodeChildren.length < 4) {
		        	var newId = ++context.elementCounters.element;
		        	var newColumnId = "" + (++context.elementCounters.column);
		        	$('#formStructureTree').tree('appendNode', {
		        		'type' : 'column',
	        			'id' : newId,
	        			'elementId' : node.elementId+'-col'+newColumnId,
	        			'label' : 'New Column'
		        	}, node);
		        	$('#formStructureTree').tree('openNode', node);
		        	context.rebuildForm();
	        	}
	        	context.remapCountersToTree();
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .container-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .container-properties-elementid").val(node.elementId);
		},
		'column' : function(context, node) {
			context.loadFormElementPropertiesEditor(node, 'Column Properties', 'containerColumnPropertiesEditor');
			context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-update-column-props").click(function() {
				$("#formElementPropertiesPanelBody>.panel-body .column-properties-elementid").parent().removeClass('has-error');
	        	$("#formElementPropertiesPanelBody>.panel-body .column-properties-elementid").parent().find('.help-block').remove();
	        	var inputTitle = $("#formElementPropertiesPanelBody>.panel-body .column-properties-title").val();
	        	var elementId = $("#formElementPropertiesPanelBody>.panel-body .column-properties-elementid").val();
	        	var existingNode = context.findExistingElementId(elementId);
	        	if(!_.isUndefined(existingNode) && (node.id !== existingNode.id)) {
	        		$("#formElementPropertiesPanelBody>.panel-body .column-properties-elementid").parent().addClass('has-error');
	        		var errorTextBlock = context.formContainer.find("#helpTextTemplate>.help-block").clone();
	        		$("#formElementPropertiesPanelBody>.panel-body .column-properties-elementid").attr('aria-describedby', 'error-column-properties-elementid');
	        		$(errorTextBlock).text('Conflicting Element ID');
	        		$("#formElementPropertiesPanelBody>.panel-body .column-properties-elementid").parent().append(errorTextBlock);
	        		return;
	        	}
	        	/*
	        	else {
	        		$("#formElementPropertiesPanelBody>.panel-body .column-properties-elementid").parent().removeClass('has-error');
	        		$("#formElementPropertiesPanelBody>.panel-body .column-properties-elementid").parent().find('.help-block').remove();
	        	}
	        	*/
	        	node.name = inputTitle;
	        	node.elementId = elementId;
	        	$('#formStructureTree').tree('updateNode', node, node);
	        	context.rebuildForm();
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-column-left").click(function() {
	        	var previousSibling = node.getPreviousSibling();
	        	if(previousSibling) {
	        		$('#formStructureTree').tree('moveNode', node, previousSibling, 'before');
	        		context.rebuildForm();
	        	}
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-move-column-right").click(function() {
	        	var nextSibling = node.getNextSibling();
	        	if(nextSibling) {
	        		$('#formStructureTree').tree('moveNode', node, nextSibling, 'after');
	        		context.rebuildForm();
	        	}
	        });
	        var popoverContent = context.formContainer.find("#elementEditorTemplates>#columnChildSelect").html();
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover({
	        	 title: 'Select Element Type', 
	        	 content: popoverContent, 
	        	 html:true,
	        	 placement : 'left',
	        	 viewport : { "selector": "#formElementPropertiesPanelBody", "padding": 20 }
	        }).on('shown.bs.popover', function() {
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-text-child").click(function(e) {
	        		// Add text input to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.text);
	        		context.addTreeElement(node, {
	        			'type' : 'text',
						'id' : newId,
						'elementId' : 'text'+newElementId,
						'label' : 'New Text Input'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-password-child").click(function(e) {
	        		// Add password input to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.password);
	        		context.addTreeElement(node, {
	        			'type' : 'password',
						'id' : newId,
						'elementId' : 'password'+newElementId,
						'label' : 'New Password Input'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-date-child").click(function(e) {
	        		// Add date input to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.date);
	        		context.addTreeElement(node, {
	        			'type' : 'date',
						'id' : newId,
						'elementId' : 'date'+newElementId,
						'label' : 'New Date Input'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-time-child").click(function(e) {
	        		// Add time input to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.time);
	        		context.addTreeElement(node, {
	        			'type' : 'time',
						'id' : newId,
						'elementId' : 'time'+newElementId,
						'label' : 'New Time Input'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-textarea-child").click(function(e) {
	        		// Add textarea to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.textarea);
	        		context.addTreeElement(node, {
	        			'type' : 'textarea',
						'id' : newId,
						'elementId' : 'textarea'+newElementId,
						'label' : 'New Textarea'
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-select-child").click(function(e) {
	        		// Add select box to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.select);
	        		context.addTreeElement(node, {
	        			'type' : 'select',
						'id' : newId,
						'elementId' : 'select'+newElementId,
						'label' : 'New Select Box',
						'options' : [
							{ 'value': '', 'display' : '' },
							{ 'value': '1', 'display' : 'Option 1' }
						]
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-radio-child").click(function(e) {
	        		// Add radio group to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.radio);
	        		context.addTreeElement(node, {
	        			'type' : 'radio',
						'id' : newId,
						'elementId' : 'radio'+newElementId,
						'label' : 'New Radio Group',
						'options' : [
							{ 'id' : 'radio'+newElementId+'-1', 'value' : '1', 'display' : 'Radio 1', 'checked' : true },
							{ 'id' : 'radio'+newElementId+'-2', 'value' : '2', 'display' : 'Radio 2', 'checked' : false }
						]
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-checkbox-child").click(function(e) {
	        		// Add checkbox group to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.checkbox);
	        		context.addTreeElement(node, {
	        			'type' : 'checkbox',
						'id' : newId,
						'elementId' : 'checkbox'+newElementId,
						'label' : 'New Checkbox Group',
						'options' : [
							{ 'id' : 'checkbox'+newElementId+'-1', 'value' : '1', 'display' : 'Checkbox 1', 'checked' : true },
							{ 'id' : 'checkbox'+newElementId+'-2', 'value' : '2', 'display' : 'Checkbox 2', 'checked' : false }
						]
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-heading-child").click(function(e) {
	        		// Add static field to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.heading);
	        		context.addTreeElement(node, {
	        			'type' : 'heading',
						'id' : newId,
						'elementId' : 'heading'+newElementId,
						'label' : 'New Heading',
						'style' : 'h4' 
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-static-child").click(function(e) {
	        		// Add static field to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.static);
	        		context.addTreeElement(node, {
	        			'type' : 'static',
						'id' : newId,
						'elementId' : 'static'+newElementId,
						'label' : 'New Static Field',
						'value' : 'Value' 
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-buttonset-child").click(function(e) {
	        		// Add button group to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.buttonset);
	        		context.addTreeElement(node, {
	        			'type' : 'buttonset',
						'id' : newId,
						'elementId' : 'buttonset'+newElementId,
						'label' : 'New Buttonset',
						'buttons' : [
							{ 'id' : 'btnCancel', 'display' : 'Cancel', 'type' : 'warning' },
							{ 'id' : 'btnSubmit', 'display' : 'Submit', 'type' : 'primary' }
						]
	        		});
	        		context.remapCountersToTree();
	        	});
	        	context.formContainer.find("#formElementPropertiesPanelBody .btn-add-callout-child").click(function(e) {
	        		// Add callout to column
	        		context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-add-column-child").popover('hide');
	        		var newId = ++context.elementCounters.element;
	        		var newElementId = "" + (++context.elementCounters.callout);
	        		context.addTreeElement(node, {
	        			'type' : 'callout',
						'id' : newId,
						'elementId' : 'callout'+newElementId,
						'label' : 'New Callout',
						'content' : 'Callout Content',
						'class' : 'primary'
	        		});
	        		context.remapCountersToTree();
	        	});
	        });
	        context.formContainer.find("#formElementPropertiesPanelBody>.panel-body .btn-delete-element").click(function() {
	        	context.deleteTreeElement(node);
	        });
	        $("#formElementPropertiesPanelBody>.panel-body .column-properties-title").val(node.name);
	        $("#formElementPropertiesPanelBody>.panel-body .column-properties-elementid").val(node.elementId);
		}
	},

	remapCountersToTree : function() {
		var context = this;
		context.formNodeReference.elementCounters = {
			element : context.elementCounters.element,
			text : context.elementCounters.text,
			date : context.elementCounters.date,
			time : context.elementCounters.time,
			password : context.elementCounters.password,
			textarea : context.elementCounters.textarea,
			select : context.elementCounters.select,
			radio : context.elementCounters.radio,
			checkbox : context.elementCounters.checkbox,
			heading : context.elementCounters.heading,
			static : context.elementCounters.static,
			buttonset : context.elementCounters.buttonset,
			button : context.elementCounters.button,
			container : context.elementCounters.container,
			column : context.elementCounters.column
		};
		var formTreeRoot = $('#formStructureTree').tree('getNodeById', 'form');
		$('#formStructureTree').tree('updateNode', formTreeRoot, formTreeRoot);
	},

	findExistingElementId : function(elementId) {
		var context = this;
		var formNode = $('#formStructureTree').tree('getNodeById', 'form');
		return context.findNodeInChildren(formNode, elementId);
	},

	findNodeInChildren : function(node, value) {
		var context = this;
		for(var i = 0; i < node.children.length; i++) {
			if(!_.isUndefined(node.children[i]['elementId'])) {
				if(node.children[i]['elementId'] === value) {
					return node.children[i];
				}
			}
			var node2 = context.findNodeInChildren(node.children[i], value);
			if(!_.isUndefined(node2)) {
				return node2;
			}
		}
		if((node.type === 'radio' || node.type === 'checkbox') && !_.isUndefined(node.options)) {
			for(var i = 0; i < node.options.length; i++) {
				if(node.options[i]['id'] === value) {
					return node;
				}
			}
		}
		if(node.type === 'buttonset' && !_.isUndefined(node.buttons)) {
			for(var i = 0; i < node.buttons.length; i++) {
				if(node.buttons[i]['id'] === value) {
					return node;
				}
			}
		}
		return undefined;
	},

	formNodeReference : null,

	formElementTree : [],

	elementCounters : {
		// element : 0,
		// text : 0,
		// password : 0,
		// date : 0,
		// time : 0,
		// textarea : 0,
		// select : 0,
		// radio : 0,
		// checkbox : 0,
		// heading : 0,
		// static : 0,
		// buttonset : 0,
		// button : 0,
		// container : 0,
		// column : 0
	},

	formContainer : null,

	viewInfo : null,

	folderId : null,

	formVersion : null,

	initialFormConfig : null,

	configGrids : {}
};