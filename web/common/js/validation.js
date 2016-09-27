window.c20g.validation = {

	ValidationError: function($el, key, text) {
		this.text = text;
		this.key = key;
		this.$el = $el;
	},

	Validator: function(config) {
		this.$el = config.$el;
		this.v = config.v;
		this.c = config.c;
		this.message = config.message;
		this.active = config.active;
		if(_.isUndefined(this.active) || _.isNull(this.active)) {
			this.active = true;
		}
		// Represents the event name to bind to the trigger function, e.g. click, change
		this.e = config.e;
		if(_.isUndefined(this.e) || _.isNull(this.e)) {
			this.e = "change";
		}
		// Represents the unique name for the Validator instance, default is <field name>_<validator name>
		this.key = config.key;
		if(_.isUndefined(this.key) || _.isNull(this.key)) {
			this.key = this.$el.attr("name") + "_" + this.v;
		}
		// Function that represents the DOM event that triggers the field validation (e.g. click, change, etc)
		this.trigger = config.trigger;
		if(_.isUndefined(this.trigger) || _.isNull(this.trigger)) {
			this.trigger = function(e) {
				window.c20g.validation.util.validate([e.data.validator]);
			};
		}
	},

	util: {
		validate: function(validators) {
			var errors = [];
			for(var key in validators) {
				var val = validators[key];
				if(val.active) {
					var valid = window.c20g.validation.validators[val.v].validate(val.$el, val.c);
					if(!valid){
						var message = val.message;
						if(_.isUndefined(val.message)) {
							message = window.c20g.util.replaceTokens(window.c20g.validation.validators[val.v].defaultMessage, [val.c]);
						}
						window.c20g.ui.validation.showValidationError(val.$el, val.key, message);
						errors.push(new window.c20g.validation.ValidationError(val.$el, val.key, message));
					}
					else {
						window.c20g.ui.validation.hideValidationError(val.$el, val.key);
					}
				}
			}
			return errors;
		},

		activate: function(validators) {
			for(var key in validators) {
				var val = validators[key];
				val.active = true;
				val.$el.bind(val.e, {validator: val}, val.trigger);
			}
		},

		deactivate: function(validators) {
			for(var key in validators) {
				var val = validators[key];
				val.active = false;
				val.$el.unbind(val.e, {validator: val}, val.trigger);
			}
		}
	},

	validators: {
		required: {
			validate: function($el, isRequired) {
				var val = $el.val();
				if(_.isUndefined(val) || _.isNull(val) || val == "") {
					return false;
				}
				return true;
			},
			defaultMessage: "This field is required"
		},
		maxlength : {
			validate: function($el, length) {
				var val = $el.val();
				if(_.isUndefined(val) || _.isNull(val) || val == "") {
					return true;
				}
				return val.length <= length;
			},
			defaultMessage: "You cannot enter more than {0} characters"
		},
		minlength : {
			validate: function($el, length) {
				var val = $el.val();
				if(_.isUndefined(val) || _.isNull(val) || val == "") {
					return true;
				}
				return val.length >= length;
			},
			defaultMessage: "You must enter at least {0} characters"
		},
		email: {
			validate: function($el, config) {

				var email = $el.val();

				//Determines if the input is in a valid email format
				var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

				if(window.c20g.util.isNullOrEmpty(email))
					return true;
				else {
					var returnValue =  reg.test(email);
					return returnValue;
				}
			},
			defaultMessage: "You must enter a valid email"
		},
		phoneNumberUS: {
			validate: function ($el, format) {

				var phoneNumber = $el.val();

				// Returns whether the input is valid
				var reg = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

				if(window.c20g.util.isNullOrEmpty(phoneNumber)) {
					return true;
				}

				var valid = reg.test(phoneNumber);
				if (format == true) {
					$el.val(phoneNumber.replace(reg, "($1) $2-$3"));
				}

				return valid;
			},
			defaultMessage: "You must enter a valid US phone number."
		},
		digits : {
			validate : function($el, config) {
				var val = $el.val();
				if(window.c20g.util.isNullOrEmpty(val)) {
					return true;
				}
				var reg = /^\d+$/;
				return reg.test(val);
			},
			defaultMessage: "Please only enter digits"
		},
		decimal : {
			validate : function($el, format) {
				var val = $el.val();
				if(window.c20g.util.isNullOrEmpty(val)) {
					return true;
				}
				var parsedVal = window.c20g.util.parseFloatNumber(val, false);
				if(isNaN(parsedVal)) {
					$el.val("");
					return false;
				}
				else {
					if(format) {
						parsedVal = window.c20g.util.formatNumberWithCommas(parsedVal);
					}
					$el.val(parsedVal);
					return true;
				}
			},
			defaultMessage: "You must enter a valid decimal number."
		},
		exactlength : {
			validate: function($el, length) {
				var val = $el.val();
				if(_.isUndefined(val) || _.isNull(val) || val == "") {
					return true;
				}
				return val.length === length;
			},
			defaultMessage: "You must enter exactly {0} characters"
		},
		selectAtLeast : {
			validate: function($el, count) {
				var checked = $el.find(":checked");
				return checkedCount >= count;
			},
			defaultMessage: "You must select at least {0}"
		},
		dateAfter: {
			validate: function($el, $otherDateField) {
				var thisDate = window.c20g.util.parseMoment($el.val(), window.c20g.constants.DATEFORMAT);
				var otherDate = window.c20g.util.parseMoment($otherDateField.val(), window.c20g.constants.DATEFORMAT);
				if (!window.c20g.util.isUndefinedOrNull(thisDate) && !window.c20g.util.isUndefinedOrNull(otherDate)) {
					return thisDate.isAfter(otherDate) || thisDate.isSame(otherDate);
				}
				return true;
			},
			defaultMessage: "Must be after the other date"
		},
		dateBefore: {
			validate: function($el, $otherDateField) {
				var thisDate = window.c20g.util.parseMoment($el.val(), window.c20g.constants.DATEFORMAT);
				var otherDate = window.c20g.util.parseMoment($otherDateField.val(), window.c20g.constants.DATEFORMAT);
				if (!window.c20g.util.isUndefinedOrNull(thisDate) && !window.c20g.util.isUndefinedOrNull(otherDate)) {
					return otherDate.isAfter(thisDate) || thisDate.isSame(otherDate);
				}
				return true;
			},
			defaultMessage: "Must be before the other date"
		}
	}

};
