window.c20g.view.kudos_createkudo = {
	init: function(viewInfo, formContainer) {

		var context = this;

		window.c20g.ws.kudos.GetAllKudoCategories(function(categories){
			for(var i = 0; i < categories.length; i++) {
				var category = categories[i];
				var newOption = $('<option>');
				newOption.attr('value', category.id).text(category.description);
				$('#newKudoCategory').append(newOption);
			}
		});
		
		window.c20g.ws.common.GetAllC20GAppPortalUsers(function(users){
			for(var i = 0; i < users.length; i++) {
				var user = users[i];
				var newOption = $('<option>');
				newOption.attr('value', user.cn).text(user.cn);
				$('#newKudoRecipient').append(newOption);
			}
		});

		var kudoCategoryField = formContainer.find("#newKudoCategory");
		var kudoDescriptionField = formContainer.find("#newKudoDescription");
		var kudoRecipientField = formContainer.find("#newKudoRecipient");

		var validation = this.validation = {
			"kudoCategoryRequired": new window.c20g.validation.Validator({$el: kudoCategoryField, v: "required", c: true}),		
			"kudoDescriptionRequired": new window.c20g.validation.Validator({$el: kudoDescriptionField, v: "required", c: true}),
			"kudoRecipientRequired": new window.c20g.validation.Validator({$el: kudoRecipientField, v: "required", c: true})
		};

		window.c20g.validation.util.activate(this.validation);


		formContainer.find("#cancelKudoButton").click(function(e) {
			window.c20g.ui.unloadUI();
		});

		formContainer.find("#createKudoButton").click(function(e) {
			var categoryID = formContainer.find("#newKudoCategory").val();
			var description = formContainer.find("#newKudoDescription").val();
			var userCN = window.c20g.session.currentUser.userName;
			var recipientCN = formContainer.find("#newKudoRecipient").val();

			window.c20g.ws.kudos.CreateEmployeeKudo(categoryID, userCN, recipientCN, description, function(){
				window.c20g.ui.unloadUI();
			});
		});

		window.c20g.ui.loading.hide();
	},

	validation : null
}