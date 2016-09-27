window.c20g.picker.samplepicker = {
	init: function(pickerInfo, formContainer) {
		
		window.c20g.ui.loading.hide();
		
		$("#selectButton").click(function(e){
			// validate here
			// get value picked
			var pickedRadio = formContainer.find('input[name=optionsRadios]:checked');
			var data = {
				display: pickedRadio.parent().text(),
				val: pickedRadio.val()
			};			
			pickerInfo.picked(data);
			window.c20g.ui.unloadUI();
		});
		
	}		
};