Backgrid.Extension.Paginator = Backgrid.Extension.Paginator.extend({
	render : function() {
		this.$el.empty();

		if (this.handles) {
			for (var i = 0, l = this.handles.length; i < l; i++) {
				this.handles[i].remove();
			}
		}

		var handles = this.handles = this.makeHandles();

		var ul = document.createElement("ul");
		$(ul).addClass("pagination");
		for (var i = 0; i < handles.length; i++) {
			ul.appendChild(handles[i].render().el);
		}

		this.el.appendChild(ul);

		return this;
	},
	className:"",
	controls : {
		rewind : {
			label : "<<",
			title : "First"
		},
		back : {
			label : "<",
			title : "Previous"
		},
		forward : {
			label : ">",
			title : "Next"
		},
		fastForward : {
			label : ">>",
			title : "Last"
		}
	}	    
});

Backgrid.EmptyRow = Backgrid.EmptyRow.extend({
	tagName: "td",	
	render: function() {
		var td = this.$el.empty()[0];		
	    td.setAttribute("colspan", this.columns.length+1);
	    td.setAttribute("align", "center")
	    $(td).append(window.c20g.ui.templates.buildEmptyRow(_.result(this, "emptyText")));
	    this.el.className = "empty";	    
	    return this;
	}
});
Backgrid.Body = Backgrid.Body.extend({ 
	_unshiftEmptyRowMayBe: function () {
	    if (this.rows.length === 0 && this.emptyText != null) {
	      this.rows.unshift(new Backgrid.EmptyRow({
	        emptyText: this.emptyText,
	        columns: this.columns
	      }));
	    }
	  },	  
});
Backgrid.Grid = Backgrid.Grid.extend({
	className: "table table-hover",
	body: Backgrid.Body	
});

//------------------------------------------------------------------------------------------------
// CUSTOM CELLS

(function (root, $, _, Backbone) {

var JqCustomCell = Backgrid.JqCustomCell = Backgrid.Cell.extend({
		/** @property */
		className : "jq-cell",
		render : function() {
			this.$el.empty();

			var data = this.model.get(this.column.get("name"));
			var renderFunction = this.column.get("renderFunction");

			if (_.isFunction(renderFunction)) {
				renderFunction(this);
			} else {
				this.$el.append(data);
			}
			
			this.delegateEvents();
			return this;
		},
	editor : null
});
	
var UriCustomCell = Backgrid.UriCustomCell = Backgrid.Cell.extend({

	/** @property */
	className: "uri-cell",	  
	
	render: function () {
		this.$el.empty();
		var linkObject= this.model.get(this.column.get("name"));	    
		
		var displayText  = linkObject.display;
		var urlText      = linkObject.href;
		
		this.$el.append($("<a>", {
		  tabIndex: -1,
		  href: urlText	      
		}).text(displayText));
		
		this.delegateEvents();
		return this;
	},
	
	editor: null

});

var MomentFormatter = Backgrid.MomentFormatter = function () {};
_.extend(MomentFormatter.prototype, {
	fromRaw: function (rawValue, model) {
		var val = window.c20g.util.parseMoment(rawValue);
		if(_.isNull(val)) {
			return "";
		}
		else {
			return val.format(window.c20g.constants.DATETIMEFORMAT); 
		}	    
	  }
});
var MomentFormatterNoTime = Backgrid.MomentFormatterNoTime = function () {};
_.extend(MomentFormatterNoTime.prototype, {
	fromRaw: function (rawValue, model) {
		// if(_.isNull(val)) {
		if(_.isNull(rawValue)) {
			return "";
		}
		else {
			// return val.format(window.c20g.constants.DATEFORMAT); 
			return rawValue.format(window.c20g.constants.DATEFORMAT); 
		}		
	  }
});
var MomentCustomCell = Backgrid.MomentCustomCell = Backgrid.Cell.extend({
	className: "moment-cell",	
	formatter: MomentFormatter,	
	render: function () {
		this.$el.empty();		
		var formattedRawValue = this.formatter.fromRaw(this.model.get(this.column.get("name")));
		this.$el.append(formattedRawValue);		
		this.delegateEvents();
		return this;
	},	
	editor: null
});

var CustomHeaderCell = Backgrid.CustomHeaderCell = Backgrid.HeaderCell.extend({
	className: "custom-header-cell",
	render: function(params) {
		Backgrid.HeaderCell.prototype.render.call(this);
		// Determine if width attribute is available
		if(!_.isUndefined(this.column.get("width"))) {			
			this.$el.attr("width", this.column.get("width") + "%");
		}
		return this;
	},
});


}(this, jQuery, _, Backbone));


//------------------------------------------------------------------------------------------------
// SELECT ONE CELL
(function (window, $, _, Backbone, Backgrid)  {

	  /**
	     Renders a radio button for row selection.

	     @class Backgrid.Extension.SelectRowCell
	     @extends Backbone.View
	  */
	  var SelectOneRowCell = Backgrid.Extension.SelectOneRowCell = Backbone.View.extend({

	    /** @property */
	    className: "select-one-row-cell",

	    /** @property */
	    tagName: "td",

	    /** @property */
	    events: {
	      "keydown :radio": "onKeydown",
	      "change :radio": "onChange",
	      "click :radio": "enterEditMode"
	    },

	    /**
	       Initializer. If the underlying model triggers a `select` event, this cell
	       will change its checked value according to the event's `selected` value.

	       @param {Object} options
	       @param {Backgrid.Column} options.column
	       @param {Backbone.Model} options.model
	    */
	    initialize: function (options) {
	      //Backgrid.requireOptions(options, ["model", "column"]);

	      this.column = options.column;
	      if (!(this.column instanceof Backgrid.Column)) {
	        this.column = new Backgrid.Column(this.column);
	      }

	      this.listenTo(this.model, "backgrid:select", function (model, selected) {
	        this.$el.find(":radio").prop("checked", selected).change();
	      });

	    },

	    /**
	       Focuses the checkbox.
	    */
	    enterEditMode: function () {
	      this.$el.find(":radio").focus();
	    },

	    /**
	       Unfocuses the checkbox.
	    */
	    exitEditMode: function () {
	      this.$el.find(":radio").blur();
	    },

	    /**
	       Process keyboard navigation.
	    */
	    onKeydown: function (e) {
	      var command = new Backgrid.Command(e);
	      if (command.passThru()) return true; // skip ahead to `change`
	      if (command.cancel()) {
	        e.stopPropagation();
	        this.$el.find(":radio").blur();
	      }
	      else if (command.save() || command.moveLeft() || command.moveRight() ||
	               command.moveUp() || command.moveDown()) {
	        e.preventDefault();
	        e.stopPropagation();
	        this.model.trigger("backgrid:edited", this.model, this.column, command);
	      }
	    },

	    /**
	       When the checkbox's value changes, this method will trigger a Backbone
	       `backgrid:selected` event with a reference of the model and the
	       checkbox's `checked` value.
	    */
	    onChange: function (e) {
	      this.model.trigger("backgrid:selected", this.model, $(e.target).prop("checked"));
	      
	      
	      if(!this.column.get("editable")) {
	    	  this.$el.parents("tbody").find(':radio:not(:checked)').attr('disabled', true);
	      }
	    },

	    /**
	       Renders a checkbox in a table cell.
	    */
	    render: function () {
	      var x = this.$el.empty().append('<input tabindex="-1" type="radio" name="'+this.column.cid+'"/>');
	      x.attr("disabled", !this.column.get("editable"));
	      this.delegateEvents();
	      return this;
	    }

	  });

	  /**
	     Renders a checkbox to select all rows on the current page.

	     @class Backgrid.Extension.SelectAllHeaderCell
	     @extends Backgrid.Extension.SelectRowCell
	  */
	  var SelectOneHeaderCell = Backgrid.Extension.SelectOneHeaderCell = SelectOneRowCell.extend({

	    /** @property */
	    className: "select-one-header-cell",

	    /** @property */
	    tagName: "th",

	    /**
	       Initializer. When this cell's radio is checked, a Backbone
	       `backgrid:select` event will be triggered for each model for the current
	       page in the underlying collection. If a `SelectRowCell` instance exists
	       for the rows representing the models, they will check themselves. If any
	       of the SelectRowCell instances trigger a Backbone `backgrid:selected`
	       event with a `false` value, this cell will uncheck its radio. In the
	       event of a Backbone `backgrid:refresh` event, which is triggered when the
	       body refreshes its rows, which can happen under a number of conditions
	       such as paging or the columns were reset, this cell will still remember
	       the previously selected models and trigger a Backbone `backgrid:select`
	       event on them such that the SelectRowCells can recheck themselves upon
	       refreshing.

	       @param {Object} options
	       @param {Backgrid.Column} options.column
	       @param {Backbone.Collection} options.collection
	    */
	    initialize: function (options) {
	      //Backgrid.requireOptions(options, ["column", "collection"]);

	      this.column = options.column;
	      if (!(this.column instanceof Backgrid.Column)) {
	        this.column = new Backgrid.Column(this.column);
	      }

	      var collection = this.collection;
	      var selectedModels = this.selectedModels = {};
	      this.listenTo(collection, "backgrid:selected", function (model, selected) {    
	    	  
	    	  for(var prop in selectedModels) {
	    		  if (selectedModels.hasOwnProperty(prop)) {
	    			  delete selectedModels[prop]; 
	    		    }
	    	  }
	    	  
	    	  
	        if (selected) selectedModels[model.id || model.cid] = model;
	        
	      });

	      this.listenTo(collection, "remove", function (model) {
	        delete selectedModels[model.cid];
	      });

	      this.listenTo(collection, "backgrid:refresh", function () {
	        this.$el.find(":radio").prop("checked", false);
	        for (var i = 0; i < collection.length; i++) {
	          var model = collection.at(i);
	          if (selectedModels[model.id || model.cid]) {
	            model.trigger('backgrid:select', model, true);
	          }
	        }
	      });
	    },

	    /**
	       Propagates the checked value of this radio to all the models of the
	       underlying collection by triggering a Backbone `backgrid:select` event on
	       the models themselves, passing each model and the current `checked` value
	       of the radio in each event.
	    */
	    onChange: function (e) {
	      var checked = $(e.target).prop("checked");

	      var collection = this.collection;
	      collection.each(function (model) {
	        model.trigger("backgrid:select", model, checked);
	      });	      
	    },
	    
	    /**
	    Renders a checkbox in a table cell.
	    */
	    render: function () {
	      this.$el.empty().append('<input style="display:none;" tabindex="-1" type="radio" />');
	      this.delegateEvents();
	      return this;
	    }

	  });

	  /**
	     Convenient method to retrieve a list of selected models. This method only
	     exists when the `SelectAll` extension has been included.

	     @member Backgrid.Grid
	     @return {Array.<Backbone.Model>}
	  */
	  Backgrid.Grid.prototype.getSelectedModel = function () {
	    
		  
		  
		var selectOneHeaderCell;
	    var headerCells = this.header.row.cells;
	    for (var i = 0, l = headerCells.length; i < l; i++) {
	      var headerCell = headerCells[i];
	      if (headerCell instanceof SelectOneHeaderCell) {
	        selectOneHeaderCell = headerCell;
	        break;
	      }
	    }

	    var result = [];
	    if (selectOneHeaderCell) {
	      for (var modelId in selectOneHeaderCell.selectedModels) {
	        result.push(this.collection.get(modelId));
	      }
	    }

	    
	    return result;
	  };

	}(window, jQuery, _, Backbone, Backgrid));
//--------------------------------------------------------------------------


//--------------------------------------------------------------------------
// SELECT ALL CELL
(function(window, $, _, Backbone, Backgrid) {
	var SelectRowCell = Backgrid.Extension.SelectRowCell = Backbone.View
			.extend({
				className : "select-row-cell",
				tagName : "td",
				events : {
					"keydown :checkbox" : "onKeydown",
					"change :checkbox" : "onChange",
					"click :checkbox" : "enterEditMode"
				},
				initialize : function(options) {
					//Backgrid.requireOptions(options, [ "model", "column" ]);
					this.column = options.column;
					if (!(this.column instanceof Backgrid.Column)) {
						this.column = new Backgrid.Column(this.column);
					}
					this.listenTo(this.model, "backgrid:select", function(
							model, selected) {
						this.$el.find(":checkbox").prop("checked", selected)
								.change();
					});
				},
				enterEditMode : function() {
					this.$el.find(":checkbox").focus();
				},
				exitEditMode : function() {
					this.$el.find(":checkbox").blur();
				},
				onKeydown : function(e) {
					var command = new Backgrid.Command(e);
					if (command.passThru()) {
						return true;
					}
					if (command.cancel()) {
						e.stopPropagation();
						this.$el.find(":checkbox").blur();
					} else {
						if (command.save() || command.moveLeft()
								|| command.moveRight() || command.moveUp()
								|| command.moveDown()) {
							e.preventDefault();
							e.stopPropagation();
							this.model.trigger("backgrid:edited", this.model,
									this.column, command);
						}
					}
				},
				onChange : function(e) {
					this.model.trigger("backgrid:selected", this.model, $(e.target).prop("checked"));
				},
				render : function() {
					this.$el.empty().append('<input tabindex="-1" type="checkbox" />');					
					this.delegateEvents();
					return this;
				}
			});
	var SelectAllHeaderCell = Backgrid.Extension.SelectAllHeaderCell = SelectRowCell
			.extend({
				className : "select-all-header-cell",
				tagName : "th",
				initialize : function(options) {
					//Backgrid.requireOptions(options, [ "column", "collection" ]);
					this.column = options.column;
					if (!(this.column instanceof Backgrid.Column)) {
						this.column = new Backgrid.Column(this.column);
					}
					var collection = this.collection;
					var selectedModels = this.selectedModels = {};
					this.listenTo(collection, "backgrid:selected", function(
							model, selected) {
						if (selected) {
							selectedModels[model.id || model.cid] = model;
						} else {
							delete selectedModels[model.id || model.cid];
							this.$el.find(":checkbox").prop("checked", false);
						}
					});
					this.listenTo(collection, "remove", function(model) {
						delete selectedModels[model.cid];
					});
					this.listenTo(collection, "backgrid:refresh", function() {
						this.$el.find(":checkbox").prop("checked", false);
						for (var i = 0; i < collection.length; i++) {
							var model = collection.at(i);
							if (selectedModels[model.id || model.cid]) {
								model.trigger("backgrid:select", model, true);
							}
						}
					});
				},
				onChange : function(e) {
					var checked = $(e.target).prop("checked");
					var collection = this.collection;
					collection.each(function(model) {
						model.trigger("backgrid:select", model, checked);
					});
				}
			});
	Backgrid.Grid.prototype.getSelectedModels = function() {
		var selectAllHeaderCell;
		var headerCells = this.header.row.cells;
		for (var i = 0, l = headerCells.length; i < l; i++) {
			var headerCell = headerCells[i];
			if (headerCell instanceof SelectAllHeaderCell) {
				selectAllHeaderCell = headerCell;
				break;
			}
		}
		var result = [];
		if (selectAllHeaderCell) {
			for ( var modelId in selectAllHeaderCell.selectedModels) {
				result.push(this.collection.get(modelId));
			}
		}
		return result;
	};
}(window, jQuery, _, Backbone, Backgrid));
//----------------------------------------------------------------------------
