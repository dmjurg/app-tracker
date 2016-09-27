window.c20g.ws.recruiting = {

	/*Retrieves data for all the candidates in a bird's eye view format*/
	GetCandidates : function(callback) {
		var paramNS = "http://c20g.com/apps/bpm/at_recruiting";
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetAllCandidates",
			"http://c20g.com/apps/bpm/at_recruiting",
			[],
			paramNS
		);
		var sr = new SOAPRequest("GetAllCandidates", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var candidates = [];
			var candidateTuples = response.Body[0].GetAllCandidatesResponse[0].tuple;
			if(!_.isUndefined(candidateTuples)) {
				for(var i = 0; i < candidateTuples.length; i++) {
					var candidate = {};
					candidate.id = candidateTuples[i].old[0].at_candidate[0].id[0].Text;

					/*reformats the ISO_8601 sub date to a more redable format for Americans*/
					candidate.submission_date = moment(candidateTuples[i].old[0].at_candidate[0].submission_date[0].Text, "YYYY-MM-DD").format("MM/DD/YYYY");
					/*Need to decide whether to use status_id or hr_view to flag action need to be taken by HR personel when this becomes a longlived bpm*/
					// candidate.hr_viewed = candidateTuples[i].old[0].at_candidate[0].hr_viewed[0].Text;

					/*Currently feeding strings (varchar), not ids (int) to backgrid columns. for sorting purposes, may need ids, so stay put */
					// candidate.position_id = candidateTuples[i].old[0].at_candidate[0].position_id[0].Text;
					// candidate.status_id = candidateTuples[i].old[0].at_candidate[0].status_id[0].Text;
					candidate.position = candidateTuples[i].old[0].at_candidate[0].at_lu_position[0].position_name[0].Text;
					candidate.status = candidateTuples[i].old[0].at_candidate[0].at_lu_candidate_status[0].status_name[0].Text;
					candidate.first_name = candidateTuples[i].old[0].at_candidate[0].first_name[0].Text;
					candidate.last_name = candidateTuples[i].old[0].at_candidate[0].last_name[0].Text;

					/*concatenating this way prohibits sorting by last name using backgrid*/
					candidate.full_name = candidate.first_name + " " + candidate.last_name;

					/*reformats the ISO_8601 start date to a more redable format for Americans*/
					if(candidateTuples[i].old[0].at_candidate[0].start_date[0].Text){
						candidate.start_date = moment(candidateTuples[i].old[0].at_candidate[0].start_date[0].Text, "YYYY-MM-DD").format("MM/DD/YYYY");
					} else {
						candidate.start_date = "not specified";
					};
					candidates.push(candidate);
				}
			}
			callback && callback(candidates);
		});
	},
	/*Executed when "view applicant" button is clicked, retrieves * from at_candidate table*/
	GetCandidateById : function(candidateId, callback) {
		var paramNS = "http://c20g.com/apps/bpm/at_recruiting";
		var soapParams = {
			'id' : candidateId
		};
		var methodName = 'GetCandidateById';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetCandidateById", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {

			var candidate = {};
			/*candidateTuple flatens code*/
			var candidateTuple = response.Body[0].GetCandidateByIdResponse[0].Response[0].tuple[0].old[0].at_candidate[0];
				candidate.id = candidateTuple.id[0].Text;
				candidate.submission_date = candidateTuple.submission_date[0].Text;
				candidate.status_id = candidateTuple.status_id[0].Text;
				candidate.status_type = candidateTuple.at_lu_candidate_status[0].status_name[0].Text;
				candidate.position_id = candidateTuple.position_id[0].Text;
				candidate.position_type = candidateTuple.at_lu_position[0].position_name[0].Text;
				candidate.first_name = candidateTuple.first_name[0].Text;
				candidate.last_name = candidateTuple.last_name[0].Text;
				candidate.full_name = candidate.first_name + " " + candidate.last_name;
				candidate.email = candidateTuple.email[0].Text;
				candidate.phone_number = candidateTuple.phone_number[0].Text;
				candidate.street_address = candidateTuple.street_address[0].Text;
				candidate.city = candidateTuple.city[0].Text;
				candidate.state = candidateTuple.state[0].Text;
				candidate.zipcode = candidateTuple.zipcode[0].Text;
				candidate.gpa = candidateTuple.gpa[0].Text;
				candidate.awards = candidateTuple.awards[0].Text;
				candidate.grad_date = candidateTuple.grad_date[0].Text;
				candidate.referrer = candidateTuple.referrer[0].Text;
				candidate.accommodation = candidateTuple.accommodation[0].Text;
				candidate.law = candidateTuple.law[0].Text;
				candidate.start_date = candidateTuple.start_date[0].Text;
				candidate.other_langs = candidateTuple.other_langs[0].Text;
				candidate.hr_viewed = candidateTuple.hr_viewed[0].Text;
				candidate.github_url = candidateTuple.github_url[0].Text;
				candidate.personal_url = candidateTuple.personal_url[0].Text;
				candidate.linkedin_url = candidateTuple.linkedin_url[0].Text;
				candidate.university_state_id = candidateTuple.at_lu_universities[0].state_id[0].Text;
				candidate.university_id = candidateTuple.university_id[0].Text;
				candidate.work_auth_id = candidateTuple.work_auth_id[0].Text;
				candidate.primary_study_id = candidateTuple.primary_study_id[0].Text;
				candidate.secondary_study_id = candidateTuple.secondary_study_id[0].Text;
				candidate.other_ed_id = candidateTuple.other_ed_id[0].Text;
				candidate.twitter = candidateTuple.twitter[0].Text;
				candidate.closed_date = candidateTuple.closed_date[0].Text;
				candidate.other_ed_summary = candidateTuple.other_ed_summary[0].Text;
				candidate.misc_summary = candidateTuple.misc_summary[0].Text;
				candidate.resume_url = candidateTuple.resume_url[0].Text;
				candidate.cover_letter_url = candidateTuple.cover_letter_url[0].Text;
				candidate.desired_salary = candidateTuple.desired_salary[0].Text;


				candidate.sources = [];
				if(response.Body[0].GetCandidateByIdResponse[0].Response[0].tuple[1]){
					var sourceTuple = response.Body[0].GetCandidateByIdResponse[0].Response[0].tuple;
					for (var i = 1; i < sourceTuple.length; i++) {
						var source = []
						source.push(sourceTuple[i].old[0].at_candidate_source[0].source_id[0].Text);
						source.push(sourceTuple[i].old[0].at_candidate_source[0].at_lu_source[0].career_fair[0].Text);
						/* may need primary key if uses special way of updated sources internally, leave source pk*/
						// source.push(sourceTuple[i].old[0].at_candidate_source[0].id[0].Text);
						candidate.sources.push(source);
					}
				}

			callback && callback(candidate)
		});
	},

	CreateCandidateApplication : function(candidate, callback) {
		var paramNS = "http://c20g.com/apps/bpm/at_recruiting";
		var soapParams = {
			'position_id' : candidate.position_id,

			'first_name' : candidate.first_name,
			'last_name' : candidate.last_name,
			'email' : candidate.email,
			'phone_number' : candidate.phone_number,
			'street_address' : candidate.street_address,
			'city' : candidate.city,
			'state' : candidate.state,
			'zipcode' : candidate.zipcode,

			'university_id' : candidate.university_id,
			'primary_study_id' : candidate.primary_study_id,
			'secondary_study_id' : candidate.secondary_study_id,
			'gpa' : candidate.gpa,
			'awards' : candidate.awards,
			'grad_date' : candidate.grad_date,
			'other_ed_id' : candidate.other_ed_id,
			'other_ed_summary' : candidate.other_ed_summary,


			'work_auth_id' : candidate.work_auth_id,

			'sources' : candidate.sources,

			'referrer' : candidate.referrer,
			'start_date' : candidate.start_date,
			'misc_summary' : candidate.misc_summary,
			'cover_letter_url' : candidate.cover_letter_url,
			'github_url' : candidate.github_url,
			'personal_url' : candidate.personal_url,
			'linkedin_url' : candidate.linkedin_url,
			'twitter' : candidate.twitter,
			'desired_salary' : candidate.desired_salary,
			'file_name': candidate.fileName,
			'mime_type': candidate.mimeType,
			'resume_string64': candidate.string64

		};

		var methodName = 'CreateCandidate';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("CreateCandidate", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			callback && callback();
		});
	},

	UpdateCandidateApplication : function(candidate, callback) {
		var paramNS = "http://c20g.com/apps/bpm/at_recruiting";
		var soapParams = {

			'position_id' : candidate.position_id,
			'status_id' : candidate.status_id,
			'first_name' : candidate.first_name,
			'last_name' : candidate.last_name,
			'email' : candidate.email,
			'phone_number' : candidate.phone_number,
			'street_address' : candidate.street_address,
			'city' : candidate.city,
			'state' : candidate.state,
			'zipcode' : candidate.zipcode,

			'university_id' : candidate.university_id,
			'primary_study_id' : candidate.primary_study_id,
			'secondary_study_id' : candidate.secondary_study_id,
			'gpa' : candidate.gpa,
			'awards' : candidate.awards,
			'grad_date' : candidate.grad_date,
			'other_ed_id' : candidate.other_ed_id,
			'other_ed_summary' : candidate.other_ed_summary,


			'work_auth_id' : candidate.work_auth_id,

			'sources' : candidate.sources,

			'referrer' : candidate.referrer,
			'start_date' : candidate.start_date,
			'misc_summary' : candidate.misc_summary,
			'resume_url' : candidate.resume_url,
			'cover_letter_url' : candidate.cover_letter_url,
			'github_url' : candidate.github_url,
			'personal_url' : candidate.personal_url,
			'linkedin_url' : candidate.linkedin_url,
			'twitter' : candidate.twitter,
			'desired_salary' : candidate.desired_salary
		};
		if(candidate.id) {
			soapParams.id = candidate.id;
			soapParams.submission_date = candidate.submission_date;
		}

		var methodName = 'UpdateCreateCandidate';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("UpdateCreateCandidate", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			callback && callback();
		});
	},

	SubmitCandidateResume : function(file_name, mime_type, file_content, callback) {
		var paramNS = "http://c20g.com/apps/bpm/at_recruiting";
		var soapParams = {
			'file_name' : file_name,
			'mime_type' : mime_type,
			'file_content': file_content
		};

		var methodName = 'SubmitCandidateResume';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("SubmitCandidateResume", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			callback && callback();
		});
	},

	// UpdateCandidateApplication: function(candidateId, candidate, callback){
	// 	var paramNS = "http://c20g.com/apps/bpm/at_recruiting";
	// 	var soapParams = {
	// 		'Update' : {
	// 			'tuple' : [
	// 			{
	// 				'old' : {
	// 					'at_recruiting': {
	// 						'id': candidateId,
	// 					}
	// 				},
	// 				'new' : {
	// 					'at_recruiting' : candidate
	// 				}
	// 			}
	// 			]
	// 		}
	// 	};
	// 	var methodName = 'UpdatedCandidateApplication';
	// 	var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
	// 	soapBody.attr("xmlns", paramNS);

	// 	var sr = new SOAPRequest("UpdatedCandidateApplication", soapBody);
	// 	SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
	// 	SOAPClient.SendRequest(sr, function(response) {
	// 		callback && callback();
	// 	});
	// },

	GetLookUpData : function(callback) {
		var paramNS = "http://c20g.com/apps/bpm/at_recruiting";
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"GetAllLookUpTables",
			"http://c20g.com/apps/bpm/at_recruiting",
			[],
			paramNS
		);
		var sr = new SOAPRequest("GetAllLookUpTables", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {

			var getAllTuple = response.Body[0].GetAllLookUpTablesResponse[0];

			var allStatuses = [];
			var statusTuples = getAllTuple.allStatuses[0].GetAllStatusesResponse[0].tuple;
			if(!_.isUndefined(statusTuples)) {
				for(var i = 0; i < statusTuples.length; i++) {
					var status = {};
					status.id = statusTuples[i].old[0].at_lu_candidate_status[0].status_id[0].Text;
					status.description = statusTuples[i].old[0].at_lu_candidate_status[0].status_name[0].Text;
					allStatuses.push(status);
				}
			};

			var allPositions = [];
			var positionTuples = getAllTuple.allPositions[0].GetAllPositionsResponse[0].tuple;
			if(!_.isUndefined(positionTuples)) {
				for(var i = 0; i < positionTuples.length; i++) {
					var position = {};
					position.id = positionTuples[i].old[0].at_lu_position[0].position_id[0].Text;
					position.description = positionTuples[i].old[0].at_lu_position[0].position_name[0].Text;
					allPositions.push(position);
				}
			};

			var allStates = [];
			var statesTuples = getAllTuple.allStates[0].GetAllStateResponse[0].tuple;
			if(!_.isUndefined(statesTuples)) {
				for(var i = 0; i < statesTuples.length; i++) {
					var state = {};
					state.id = statesTuples[i].old[0].at_lu_states[0].id[0].Text;
					state.description = statesTuples[i].old[0].at_lu_states[0].state_name[0].Text;
					allStates.push(state);
				}
			};

			var allFieldsOfStudy = []
			var fieldsOfStudyTuples = getAllTuple.allFieldsOfStudy[0].GetAllFieldsOfStudyResponse[0].tuple;
			if(!_.isUndefined(fieldsOfStudyTuples)) {
				for(var i = 0; i < fieldsOfStudyTuples.length; i++) {
					var fieldOfStudy = {};
					fieldOfStudy.id = fieldsOfStudyTuples[i].old[0].at_lu_field_of_study[0].id[0].Text;
					fieldOfStudy.description = fieldsOfStudyTuples[i].old[0].at_lu_field_of_study[0].description[0].Text;
					allFieldsOfStudy.push(fieldOfStudy);
				}
			};

			var allOtherEds = []
			var otherEdTuples = getAllTuple.allOtherEds[0].GetAllOtherEdsResponse[0].tuple;
			if(!_.isUndefined(otherEdTuples)) {
				for(var i = 0; i < otherEdTuples.length; i++) {
					var otherEd = {};
					otherEd.id = otherEdTuples[i].old[0].at_lu_other_ed[0].id[0].Text;
					otherEd.description = otherEdTuples[i].old[0].at_lu_other_ed[0].description[0].Text;
					allOtherEds.push(otherEd);
				}
			};

			var allWorkAuths = []
			var workAuthTuples = getAllTuple.allWorkAuths[0].GetAllWorkAuthsResponse[0].tuple;
			if(!_.isUndefined(workAuthTuples)) {
				for(var i = 0; i < workAuthTuples.length; i++) {
					var workAuth = {};
					workAuth.id = workAuthTuples[i].old[0].at_lu_work_auth[0].id[0].Text;
					workAuth.description = workAuthTuples[i].old[0].at_lu_work_auth[0].description[0].Text;
					allWorkAuths.push(workAuth);
				}
			};

			var allSources = []
			var sourceTuples = getAllTuple.allSources[0].GetAllSourcesResponse[0].tuple;
			if(!_.isUndefined(sourceTuples)) {
				for(var i = 0; i < sourceTuples.length; i++) {
					var source = {};
					source.id = sourceTuples[i].old[0].at_lu_source[0].id[0].Text;
					source.description = sourceTuples[i].old[0].at_lu_source[0].description[0].Text;
					source.career_fair = sourceTuples[i].old[0].at_lu_source[0].career_fair[0].Text;
					allSources.push(source);
				}
			};

			callback && callback({
				allStatuses : allStatuses,
				allPositions : allPositions,
				allSkillTypes : allSkillTypes,
				allSkillLevels: allSkillLevels,
				allStates: allStates,
				allFieldsOfStudy : allFieldsOfStudy,
				allOtherEds : allOtherEds,
				allWorkAuths : allWorkAuths,
				allSources : allSources
			});
		});
	},

	GetUniversities : function(stateId, callback) {
		var paramNS = "http://c20g.com/apps/bpm/at_recruiting";
		var soapParams = {
			'state_id' : stateId
		};
		var methodName = 'GetUniversitiesByStateId';
		var soapBody = window.c20g.Soap.jsonToSoap(soapParams, methodName);
		soapBody.attr("xmlns", paramNS);

		var sr = new SOAPRequest("GetUniversitiesByStateId", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			var allUniversities = [];
			var universitiesTuples = response.Body[0].GetUniversitiesByStateIdResponse[0].tuple;
			if(!_.isUndefined(universitiesTuples)) {
				for(var i = 0; i < universitiesTuples.length; i++) {
					var university = {};
					university.id = universitiesTuples[i].old[0].at_lu_universities[0].id[0].Text;
					university.description = universitiesTuples[i].old[0].at_lu_universities[0].university_name[0].Text;
					allUniversities.push(university);
				}
			};
			callback && callback({
				allUniversities:allUniversities
			});
		});
	},

};