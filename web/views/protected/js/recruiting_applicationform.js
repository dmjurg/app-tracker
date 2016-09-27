window.c20g.view.recruiting_applicationform={
	init: function(viewInfo,formContainer){

		var context=this;

		formContainer.find("#cancelJobApplicationButton").click(function(e) {
			window.c20g.ui.unloadUI();
		});

		window.c20g.validation.util.activate(this.validation);

		$('#start_date').datepicker({
				format: "yyyy-mm-dd"
			});
		$('#grad_date').datepicker({
				format: "yyyy-mm-dd"
			});

		formContainer.find("#submitJobApplicationButton").click(function(e) {



			var oldCandidate = {};
			oldCandidate.id = parseInt($("legend").attr("id"));
			oldCandidate.submission_date = $("legend").attr("val");
			oldCandidate.resume_url = $("#fileURL").attr("val");
			oldCandidate.status_id = parseInt($("#status").val());
			oldCandidate.position_id = parseInt($("#position").val());

			oldCandidate.first_name = $("#first_name").val();
			oldCandidate.last_name = $("#last_name").val();
			oldCandidate.email = $("#email").val();
			oldCandidate.phone_number = $("#phone_number").val();
			oldCandidate.street_address = $("#street_address").val();
			oldCandidate.city = $("#city").val();
			oldCandidate.state = $("#state").val();
			oldCandidate.zipcode = $("#zipcode").val();

			oldCandidate.university_id = parseInt($("#college_name").val());
			oldCandidate.primary_study_id = parseInt($("#primary_study").val());
			oldCandidate.secondary_study_id = parseInt($("#secondary_study").val());
			oldCandidate.gpa = parseFloat($("#gpa").val());
			oldCandidate.grad_date = $("#grad_date").val();
			oldCandidate.awards = $("#awards").val();

			oldCandidate.other_ed_id = parseInt($("#relevant_ed").val());
			oldCandidate.other_ed_summary = $("#relevant_ed_details").val();

			oldCandidate.sources = [];
			$("input:checkbox[name='source']:checked").each(function(){
    			var source = { source_id: parseInt($(this).val()) }
    			oldCandidate.sources.push(source);
			});

			oldCandidate.referrer = $("#referrer").val();
			oldCandidate.work_auth_id = parseInt($("#work_auth").val());
			oldCandidate.start_date = $("#start_date").val();
			oldCandidate.desired_salary= $('#desired_salary').val();

			oldCandidate.misc_summary = $("#other_info").val();

			// oldCandidate.resume_url = "www.google.com/drive"; //dummy until dynamic
			oldCandidate.cover_letter_url = "www.google.com/drive"; //dummy until dynamic

			oldCandidate.linkedin_url = $("#linkedin").val();
			oldCandidate.github_url = $("#github").val();
			oldCandidate.personal_url = $("#personal_site").val();
			oldCandidate.twitter = $("#twitter").val();

			if($("#start_date").val() == ""){
				oldCandidate.start_date = null;
			};
			if($("#grad_date").val() == ""){
				oldCandidate.grad_date = null;
			};


				window.c20g.ws.recruiting.UpdateCandidateApplication(oldCandidate, function(){
					window.c20g.ui.unloadUI();
				})

		});//closes click handler for submit button

		window.c20g.ui.loading.hide();

	$("#college_state").change(function() {
		var stateId = $("#college_state").val();
		$("#college_name").empty();
		window.c20g.ws.recruiting.GetUniversities(stateId, function(data){
			var allUniversities = data.allUniversities;
			$("#college_name").append("<option> Select Institution Name <span class='required'> *</span></option>");
			for(var i = 0; i < allUniversities.length; i++) {
				$("#college_name").append(
					"<option value='" + allUniversities[i].id + "'>" + allUniversities[i].description + "</option>"
				);
			}
		})
	});

	$("#relevant_ed").change(function() {
		$("#relevant_ed_info").show();
	});

	$("#career_fair").change(function() {
		if ($(this).prop('checked')) {
			$("#cf_source_list").show();
        } else {
            $("#cf_source_list").hide();
        }
	});

	}, //closes out init

	populateForm: function(candidate){
		$('legend').attr("id", candidate.id);
		$('legend').text(candidate.full_name + " (Submitted on: "+ candidate.submission_date + ")");
		$('legend').attr("val", candidate.submission_date);
		fileURL = "https://drive.google.com/open?id=" + candidate.resume_url;
		$('legend').append('<a href="'+ fileURL +'" target="_blank"><span class="btn pull-right" id="fileURL"><span class=" glyphicon glyphicon-file"></span>  View Resume</span></a>')
		$('#fileURL').attr("val", candidate.resume_url);
		$('#status').val(candidate.status_id);
		$('#position').val(candidate.position_id);

		$('#first_name').val(candidate.first_name);
		$('#last_name').val(candidate.last_name);
		$('#email').val(candidate.email);
		$('#phone_number').val(candidate.phone_number);
		$('#street_address').val(candidate.street_address);
		$('#city').val(candidate.city);
		$('#state').val(candidate.state);
		$('#zipcode').val(candidate.zipcode);

		$('#college_state').val(candidate.university_state_id);
		window.c20g.ws.recruiting.GetUniversities(candidate.university_state_id, function(data){
			$("#college_name").empty();
			var allUniversities = data.allUniversities;
			$("#college_name").append("<option> Select Institution Name <span class='required'> *</span></option>");
			for(var i = 0; i < allUniversities.length; i++) {
				$("#college_name").append(
					"<option value='" + allUniversities[i].id + "'>" + allUniversities[i].description + "</option>"
				);
				}
			$('#college_name').val(candidate.university_id);
		});
		$('#primary_study').val(candidate.primary_study_id);
		$('#secondary_study').val(candidate.secondary_study_id);
		$('#gpa').val(candidate.gpa);
		$('#grad_date').val(candidate.grad_date);
		$('#awards').val(candidate.awards);

		$('#relevant_ed').val(candidate.other_ed_id);
		$('#relevant_ed_details').val(candidate.other_ed_summary);
		if($("#relevant_ed").val() != null) {
			$("#relevant_ed_info").show();
		};

		for(var i = 0; i < candidate.sources.length; i++){
			$('input[name=source][value=' + candidate.sources[i][0] +']').attr("checked", true);
			if(candidate.sources[i][1] == "true") {
				$('input[name=career_fair]').attr("checked", true);
				$("#cf_source_list").show();
				console.log("source " + candidate.sources[i][0] + " has a value of " + candidate.sources[i][1])
			}
		};
		$('#referrer').val(candidate.referrer);
		if (candidate.referrer != null) {
			$(".referral_employee").show();
		}


		$('#work_auth').val(candidate.work_auth_id);
		$('#start_date').val(candidate.start_date);
		$('#desired_salary').val(candidate.desired_salary);
		$('#other_info').val(candidate.misc_summary);

		$('#linkedin').val(candidate.linkedin_url);
		$('#github').val(candidate.github_url);
		$('#personal_site').val(candidate.personal_url);
		$('#twitter').val(candidate.twitter);


		if(candidate.grad_date == null) {
			$('#grad_date').val("");
		};
		if(candidate.start_date == null) {
			$('#start_date').val("");
		};

	}, // closes populateForm

	addLookUpDataToDropdown: function(lookUpData) { // lookUpData is an array of objects, each object has name and id fields

		var allStatuses = lookUpData.allStatuses;
		var allPositions = lookUpData.allPositions;
		var allStates = lookUpData.allStates;
		var allFieldsOfStudy = lookUpData.allFieldsOfStudy;
		var allOtherEds = lookUpData.allOtherEds;
		var allWorkAuths = lookUpData.allWorkAuths;
		var allSources = lookUpData.allSources;

		for(var i = 0; i < allStatuses.length; i++) {
			$("#status").append(
				"<option value='" + allStatuses[i].id + "'>" + allStatuses[i].description + "</option>"
			);
		};

		for(var i = 0; i < allPositions.length; i++) {
			$("#position").append(
				"<option value='" + allPositions[i].id + "'>" + allPositions[i].description + "</option>"
			);
		};

		for(var i = 0; i < allStates.length; i++) {
			$("#college_state").append(
				"<option value='" + allStates[i].id + "'>" + allStates[i].description + "</option>"
			);
		};

		for(var i = 0; i < allFieldsOfStudy.length; i++) {
			$("#primary_study").append(
				"<option value='" + allFieldsOfStudy[i].id + "'>" + allFieldsOfStudy[i].description + "</option>"
			);
			$("#secondary_study").append(
				"<option value='" + allFieldsOfStudy[i].id + "'>" + allFieldsOfStudy[i].description + "</option>"
			);
		};

		for(var i = 0; i < allOtherEds.length; i++) {
			$("#relevant_ed").append(
				"<option value='" + allOtherEds[i].id + "'>" + allOtherEds[i].description + "</option>"
			);
		};

		for(var i = 0; i < allWorkAuths.length; i++) {
			$("#work_auth").append(
				"<option value='" + allWorkAuths[i].id + "'>" + allWorkAuths[i].description + "</option>"
			);
		};

		for(var i = 0; i < allSources.length; i++) {
			if(allSources[i].career_fair == "false" && allSources[i].description == "Referral") {
				$("#main_source_list").append(
					"<li><input name='source' type='checkbox' value='" + allSources[i].id + "'>" + allSources[i].description + "</li>"
				);
				$("input[name='source'][value=8]").change(function() {
					if ($(this).prop('checked')) {
						$(".referral_employee").show();
        			} else {
            			$(".referral_employee").hide();
        			}
				});

			} else if(allSources[i].career_fair == "false") {
				$("#main_source_list").append(
					"<li><input type='checkbox' name='source' value='" + allSources[i].id + "'>" + allSources[i].description + "</li>"
				);
			} else {
				$("#cf_source_list").append(
					"<li><input type='checkbox' name='source' value='" + allSources[i].id + "'>" + allSources[i].description + "</li>"
				);
			}
		};
	},

	validation: null

} // closes recruiting_applicationform
