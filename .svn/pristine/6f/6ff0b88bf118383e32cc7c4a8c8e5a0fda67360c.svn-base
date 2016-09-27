window.c20g.ui = {

	show : function($el, callback) {
		if (_.isUndefined($el)) {
			if (_.isFunction(callback)) {
				callback();
			}
		} else if ($el.length === 0) {
			if (_.isFunction(callback)) {
				callback();
			}
		} else {
			$el.fadeIn(window.c20g.constants.ui.FADE_LENGTH).promise().done(function(e) {
				if (_.isFunction(callback)) {
					callback();
				}
			});
		}
	},

	hide : function($el, callback) {
		if (_.isUndefined($el)) {
			if (_.isFunction(callback)) {
				callback();
			}
		} else if ($el.length === 0) {
			if (_.isFunction(callback)) {
				callback();
			}
		} else {
			$el.fadeOut(window.c20g.constants.ui.FADE_LENGTH).promise().done(function(e) {
				this.hide();
				if (_.isFunction(callback)) {
					callback();
				}
			});
		}
	},

	getMainPageContainer : function() {
		return $(window.c20g.constants.ui.MAIN_PAGE_CONTAINER);
	},

	// -----------------------------------------
	// UI Stack
	uistack : [],
	loadUI : function($ui, callback, loadCallback) {

		var context = window.c20g.ui;
		var currentUI = context.getCurrentUI();
		if (_.isUndefined(currentUI)) {
			currentUI = {};
		}
		// Hide Current UI
		context.hide(currentUI.$el, function(e) {

			if(currentUI.$el instanceof jQuery) {
				currentUI.$el.detach(); // NEW
			}

			// Add New UI to the stack
			context.uistack.push({
				$el : $ui,
				callback : callback
			});
			// Add New UI to the page container
			context.getMainPageContainer().append($ui.hide());
			// Show New UI
			context.show($ui);
			// Execute load callback
			if (_.isFunction(loadCallback)) {
				loadCallback();
			}
		});
	},

	reloadUI : function($ui, callback, loadCallback) {
		var context = window.c20g.ui;
		var currentUI = context.getCurrentUI();
		if (_.isUndefined(currentUI)) {
			currentUI = {};
		}
		// Hide Current UI
		context.hide(currentUI.$el, function(e) {
			// Remove UI from the page container
			currentUI.$el.remove();
			// Remove From UI stack
			context.uistack.pop();
			// Add New UI to the stack
			context.uistack.push({
				$el : $ui,
				callback : callback
			});
			// Add New UI to the page container
			context.getMainPageContainer().append($ui.hide());
			// Show New UI
			context.show($ui);
			// Execute load callback
			if (_.isFunction(loadCallback)) {
				loadCallback();
			}
		});

	},

	unloadUI : function(callCallback) {
		var context = window.c20g.ui;
		if (context.uistack.length > 1) {
			var currentUI = context.getCurrentUI();
			if (_.isUndefined(currentUI)) {
				currentUI = {};
			}
			// Hide Current UI
			context.hide(currentUI.$el, function(e) {
				// Remove UI from the page container
				currentUI.$el.remove();
				// Remove From UI stack
				context.uistack.pop();
				// Reshow previous UI
				if(context.getCurrentUI().$el instanceof jQuery) {
					context.getCurrentUI().$el.hide();
					context.getMainPageContainer().append(context.getCurrentUI().$el);  // NEW
					context.show(context.getCurrentUI().$el);
				}
				// Call callback method if available
				if (!_.isUndefined(callCallback)) {
					if (!callCallback) {
						// DO NOTHING
					}
				} else if (_.isFunction(currentUI.callback)) {
					currentUI.callback();
				}
			});
		}

	},

	getCurrentUI : function() {
		return _.last(this.uistack);
	},
	getPreviousUI : function() {
		var index = this.uistack.length - 2;
		if(index >= 0) {
			return this.uistack[index];
		}
		else {
			return undefined;
		}
	},
	// -----------------------------------------

	templates : {
		buildFileDownloadForm: function(id) {
			if(window.c20g.util.isUndefinedOrNull(id)) {
				id = new Date().valueOf();
			}
			var f = $(".ui-templates").find(".file-download-form").clone();
			var fi = f.find("iframe");
			var ff = f.find("form");
			var iframeId = id+"WrapFrame";
			var formId = id+"SubmitForm";
			fi.attr("id", iframeId);
			fi.attr("name", iframeId);
			ff.attr("id", formId);
			ff.attr("target", iframeId);
			ff.attr("action", "http://frank.c20g.com/home/cordys-blank/com.eibus.web.tools.download.Download.wcp");
			ff.find('input[name="organizationalContext"]').val("o=cordys-blank,cn=cordys,cn=dev,o=wb.ad.worldbank.org");
			ff.find('input[name="timeout"]').val("30000");
			return f;
		},
		buildFileUploadForm: function(id) {
			var search = (window.document.cookie.search( new RegExp("\\b(\\w*_ct)=([^;]*)") ));
			var f = $(".ui-templates").find(".file-upload-form").clone();
			var fi = f.find("iframe");
			var ff = f.find("form");
			var iframeId = id+"WrapFrame";
			var formId = id+"SubmitForm";
			fi.attr("id", iframeId);
			fi.attr("name", iframeId);
			ff.attr("id", formId);
			ff.attr("target", iframeId);
			ff.attr("action", "http://frank.c20g.com/home/cordys-blank/com.eibus.web.tools.upload.Upload.wcp"  + (search >= 0?  "?" + RegExp.$1 + "=" + RegExp.$2 : ""));
			ff.find('input[name="organizationalcontext"]').val("o=cordys-blank,cn=cordys,cn=dev,o=wb.ad.worldbank.org");
			ff.find('input[name="timeout"]').val("30000");
			ff.find('input[name="methodXML"]').val("");
			return f;
		},
		buildCenteredTextContainer : function(text) {
			return $(".ui-templates").find(".cented-text-container").find(".text-center").clone().text(text);
		},
		buildButton : function(text, css) {
			return $(".ui-templates").find(".buttonLink").find("button").clone().addClass(css).text(text);
		},
		buildFormContainer : function() {
			return $(".ui-templates").find(".form-container").clone();
		},
		buildIcon : function(css) {
			return $(".ui-templates").find(".font-awesome-icon").find("i").clone().addClass(css);
		},
		buildErrorMessage : function(text) {
			var error = $(".ui-templates").find(".error-message-general").clone();
			if (!_.isUndefined(text) && !_.isNull(text)) {
				error.find(".alert").text(text);
			}
			return error;
		},
		buildLoadingText : function(text) {
			var t = $(".ui-templates").find(".loading-text").find("p").clone();
			if (!_.isUndefined(text)) {
				t.text(text);
			}
			return t;
		},
		buildValidationError : function(text) {
			var e = $(".ui-templates").find("." + window.c20g.constants.ui.VALIDATION_ERROR).clone().text(text);
			return e;
		},
		buildInfoMessage : function(text) {
			var x = $(".ui-templates").find(".info-message").clone();
			if (!_.isUndefined(text) && !_.isNull(text)) {
				x.find(".alert").text(text);
			}
			return x;
		},
		buildEmptyRow: function(text) {
			var x = $(".ui-templates").find(".empty-row").clone();
			if (!_.isUndefined(text) && !_.isNull(text)) {
				x.text(text);
			}
			return x;
		},
		buildButtonGroup: function() {
			var bg = $(".ui-templates").find(".button-group").clone();
			return bg;
		}
	},

	loading : {

		spinner : function() {
			return new Spinner({
				position : "absolute",
				lines : 17, // The number of lines to draw
				length : 11, // The length of each line
				width : 3, // The line thickness
				radius : 11, // The radius of the inner circle
				corners : 1, // Corner roundness (0..1)
				rotate : 0, // The rotation offset
				direction : 1, // 1: clockwise, -1: counterclockwise
				color : '#000', // #rgb or #rrggbb or array of colors
				speed : 1.8, // Rounds per second
				trail : 29, // Afterglow percentage
				shadow : false, // Whether to render a shadow
				hwaccel : false, // Whether to use hardware acceleration
				className : 'spinner', // The CSS class to assign to the
				// spinner
				zIndex : 2e9, // The z-index (defaults to 2000000000)
				top : '50%', // Top position relative to parent
				left : '50%' // Left position relative to parent
			});
		},

		show : function($el, text) {
			var spinner = $(this.spinner().spin().el).hide();
			var container = $el;
			if (!($el instanceof jQuery)) {
				container = $("body");
			}
			if (container.find(".spinner").length === 0) {
				container.append(spinner);
				spinner.append(window.c20g.ui.templates.buildLoadingText(text));
				window.c20g.ui.show(spinner);
			}
			else {
				var currentText = container.find(".spinner").find("p");
				window.c20g.ui.hide(currentText, function(){
					currentText.text(window.c20g.ui.templates.buildLoadingText(text).text());
					window.c20g.ui.show(currentText);
				});
			}
		},

		hide : function($el, text) {
			var spinner = null;
			var container = $el;
			if (!($el instanceof jQuery)) {
				container = $("body");
			}
			spinner = container.find(".spinner");
			spinner.fadeOut(window.c20g.constants.ui.FADE_LENGTH, function(e) {
				spinner.remove();
			});
		}

	},

	validation : {
		showValidationError : function($el, key, text) {
			var placeToInsert = $el.parents(".form-group");
			if (placeToInsert.find("#" + key).length === 0) {
				var currentErrors = placeToInsert.find("." + window.c20g.constants.ui.VALIDATION_ERROR);
				var error = window.c20g.ui.templates.buildValidationError(text).hide().attr("id", key);
				var icon = window.c20g.ui.templates.buildIcon(window.c20g.constants.ui.faIcons.EXCLAMATION_CIRCLE_ICON);
				error.prepend(" ").prepend(icon);
				if (currentErrors.length > 0) {
					currentErrors.first().before(error);
				} else {
					placeToInsert.append(error);
				}
				window.c20g.ui.show(error);
			}
		},
		hideValidationError : function($el, key) {
			var errors = $el.parents(".form-group").find("#" + key);
			window.c20g.ui.hide(errors, function(e) {
				errors.remove();
			});
		}
	},

	grid : {
		render: function(grid, $container) {
			var returnVal = {
				grid: grid
			};

			$container.empty();

			// Paging
			if(window.c20g.util.isPagingCollection(returnVal.grid.collection))
			{
				returnVal.paginator = new Backgrid.Extension.Paginator({
					collection: returnVal.grid.collection
				});
				returnVal.$paginator = returnVal.paginator.render().$el.hide();
				$container.append(returnVal.$paginator);
			}
			returnVal.$grid = returnVal.grid.render().$el.hide();
			$container.append(returnVal.$grid);
			window.c20g.ui.show(returnVal.$paginator);
			window.c20g.ui.show(returnVal.$grid);
			return returnVal;
		}
	}
};
