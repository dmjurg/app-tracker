/**
* @namespace Top-Level Container object for the eTendering project. All stored objects, properties and functions will be formed within this parent namespace.<br/>
*/
window.c20g = {};

/**
* @namespace Container Session object. Will hold the properties that are saved for the duration of the User's session.<br/>
*/
window.c20g.Session = {
  history : {},
  
 /**
  * @class Object defining the attributes values of the currently logged in user. This object is populated when the user logs into the eTendering system. <br/>
  * @see getLoggedInUser
  * @property {number} id The ID of the logged in User.
  * @property {string} dn The distinguished name of the logged in User defined with the Cordys CARS repository.
  * @property {string} upi The UPI of the logged in User. The UPI is the indetifyer of each user in the system by the bank's passkey system.
  * @property {string} firstName The first name of the logged in User.
  * @property {string} lastName The last name of the logged in User.
  * @property {string} displayName The display name of the logged in User. This is normally defined as firstname lastname.
  * @property {string} email The email address of the logged in user.
  * @property {string[]} userRoles The roles within the eTendering system of the logged in User. {@link window.c20g.Constants.roles}
  * @property {string} firmId The ID of the firm that the firm user is associated with if the user is a firm user.
  * @property {string} firmName The Name of the firm that the firm user belongs to.
  * @property {string} isPrimaryContact Indicates whether the firm user is the primary contact for that firm.
  */
  loggedInUser : {
    id : '',
    dn : '',
    upi : '',
    firstName : '',
    lastName : '',
    displayName : '',
    email : '',
    userRoles : [],
    firmId : '',
    firmName : '',
    isPrimaryContact : '',
    resetPassword : false
  },

 /**
  * @class Object defining the attributes values of the user that the currently logged in user is impersonating. This impersonated user is referred to as the actingAsUser. <br/>
  * @property {number} id The ID of the acting as User.
  * @property {string} dn The distinguished name of the acting as User defined with the Cordys CARS repository.
  * @property {string} upi The UPI of the acting as User. The UPI is the indetifyer of each user in the system by the bank's passkey system.
  * @property {string} firstName The first name of the acting as User.
  * @property {string} lastName The last name of the acting as User.
  * @property {string} displayName The display name of the acting as User. This is normally defined as firstname lastname.
  * @property {string} email The email address of the acting as user.
  * @property {string[]} userRoles The roles within the eTendering system of the acting as User. {@link window.c20g.Constants.roles}
  * @property {string} firmId The ID of the firm that the firm user is associated with if the user is a firm user.
  * @property {string} firmName The Name of the firm that the firm user belongs to.
  * @property {string} isPrimaryContact Indicates whether the firm user is the primary contact for that firm.
  */
  actingAsUser : {
    id : '',
    dn : '',
    upi : '',
    firstName : '',
    lastName : '',
    displayName : '',
    email : '',
    userRoles : [],
    firmId : '',
    firmName : '',
    isPrimaryContact : ''
  },

 /**
  * @class Container for the Grid configuration objects. It will also hold the results for each rendered Grid to allow for client-side paging.
  *   Each Grid configuration and results are held separately in this Container identified by a unique namespace defined by the grid that is being rendered. <br/>
  *   E.g. the 'MyActions' grid will be stored under window.c20g.Session.grid['MyActions'].<br/>
  * @property {number} rowNum Defines the number of rows rendered on each page. This overrides the default configuration value. {@link window.c20g.Grid.constants#grid_batch_size}
  * @property {string} sortColumn Defines the current column that the by which the grid is sorted. This must be one of the columns defined in {@link window.c20g.Session.grid#columns}.
  * @property {string} sortOrder Defines the current sort order of the grid for the current sort column. Possible values are 'asc' for ascending and 'desc' for decending.
  * @property {number} page Specifies the current page that the grid is displaying. Default = 1.
  * @property {boolean} multiselect Specifies whether the grid has multiselect enabled or not.
  * @property {boolean} hasControls Specifies whether the grid has input fields in some of its cells for inline editing.
  * @property {object[]} data The data that the grid will automatically render. The data is saved to allow for client side paging. Sorting of the grid will return to the server and
  *   new data will be returned and stored. This data <b>MUST</b> be in a specific format or else the gird will not display. This data format is an object[] where each object is a JSON object
  *   of the form {row : [column data1, column data 2, column data 3]}. i.e. each object is defined by the key 'row' and the value is an array of column data.<br/><br/>
  *   E.g. To return data for a people grid for columns {ID, Name, Age}, the data format will be:<br/>
  *   return [  {row : [1, 'Bill Markmann', 29]},<br/>
  *             {row : [2, 'Steve Markmann', 31]},<br/>
  *             {row : [3, 'Kevin Salandy', 30]}  ]<br/>
  * @property {string} noData Defines the text that will be displayed if no data is returned from the server. Default {@link window.c20g.Grid.constants#grid_no_data}
  * @property {string[]} columns Specifies the columns that will be rendered by the grid. Additional {@link window.c20g.Session.grid#columnOptions} can be set to further manipulate the display
  *   of these columns.
  * @property {object[]} columnOptions Additional configuration for the columns. This is an array of JSON objects where each property of the JSON object will modify the column in some way.
  *   Two properties are required, 'name' and 'index'. The 'name' is the unique identifier of the column. The 'index' is the value that is returned for the column when the grid is sorted.
  *   All other properties are optional. Full documentation can be found at {@link http://www.secondpersonplural.ca/jqgriddocs/_2eb0fihps.htm}.<br/><br/>
  *   E.g. Column Options for the MyActions grid.<br/>
  *   columnOptions : [  <br/>
        {name:'id', index:'taskId', hidden:true}, <br/>
        {name:'task', index:'task', width:300}, <br/>
        {name:'selectionId', index:'selectionId', width:140}, <br/>
        {name:'selection', index:'selection', width:300},<br/>
        {name:'assigned', index:'assigned', width:140}<br/>
      ]
  * @property {function} queryFunction : Function that is invoked by the grid framework to retrieve the data from the server to load the grid. This function is invoked when the grid
  *   loads and when the grid is sorted. This function accepts 4 parameters<br/>
  *   - namespace : The namespace that identified a grid from other grids stored in session.<br/>
  *   - dataCallback : The function that must be called by this function before it exits to inform the grid to render the data. This is so designed by the Grid framework to allow
  *       asynchronous retrieval of the data. dataCallback accepts 2 parameters. <br/>
  *         --- namespace : Passed into the queryFunction.<br/>
  *         --- data : The data retrieved by the grid. {@link window.c20g.Session.grid#data}<br/>
  *   - sortColumn : The column by which the grid will be sorted. {@link window.c20g.Session.grid#sortColumn}<br/>
  *   - sortOrder : The order by which the grid will be sorted.  {@link window.c20g.Session.grid#sortOrder}<br/>
  *   - position : The position corresponding to the first row of the requested page. This is available for serverside paging. 
  * @property {function} selectFunction Function that is invoked when the user clicks on the row of a grid. This function will accept a single parameter 'rowData'. 'rowData' is a JSON object
  *   of key-value pairs where the key corresponds to the 'name' specified in columnOptions and the value is the value of that column in that row.
  */
  grid : {},
  
  /**
   * @class Container for overlay properties
   * @property {function} closeCallback This is called from closeHTMLPageInOverlay if the callback param is true
   * @property {function} onLoad Called when overlay is loaded
   * @property {function} onClose Called when overlay is closed
   */
  overlay : {
    closeCallback : null,
    closeOnClick : false,
    onLoad : function() {
      $('#overlayPageContainer').remove();
      $('#overlayPage').append('<div id="overlayPageContainer"></div>');
      $('#overlayPageContainer').attr('width', '100%');
      window.c20g.URL.loadUrl(window.c20g.Session.actionDetail.actionPath, {containerId: 'overlayPageContainer'});
    },
    onClose : function() {
      $('#overlayPageContainer').remove();
      $('#overlayPage').append('<div id="overlayPageContainer"></div>');
      window.c20g.Session.overlay.closeCallback = null;
    }
  },

 /**
  * @class Container for the Selection Detail state.  It will only hold state related to a particular selection, and will be cleared/reinitialized when the selection detail page is loaded
  * @see window.c20g.SelectionDetail.getSelectionDetail
  * @property {string} selectionId
  * @property {string} parentSelectionId
  * @property {string} selectionNumber
  * @property {string} title
  * @property {string} description
  * @property {string} advertisementWaiver
  * @property {string} legalServices
  * @property {string} estAmount
  * @property {string} baseCurrencyId
  * @property {string} baseCurrencyName
  * @property {string} calculatedUsd
  * @property {string} calculatedDate
  * @property {string} selectionTypeId
  * @property {string} selectionType
  * @property {string} selectionMethodId
  * @property {string} selectionMethod
  * @property {string} draftFlag
  * @property {string} creationDate
  * @property {string} closeDate
  * @property {string} organizationId
  * @property {string} organization
  * @property {string} businessUnitId
  * @property {string} businessUnit
  * @property {string} soleSourceJustificationId
  * @property {string} processId
  * @property {string} taskId
  * @property {string} ttlLocation
  * @property {string} startedBy
  * @property {string} areaOfExpertise
  * @property {string} statusId
  * @property {string} status
  * @property {string} subStatusId
  * @property {string} subStatus
  */
  selectionDetail : {
    selectionId: ''
  },

 /**
  * @class Container for all properties contained with the Action detail used to render an Action Form.
  * @property {string} actionId
  * @property {string} actionName
  * @property {string} actionPath
  * @property {string} selectionActionId
  * @property {boolean} isInline
  */
  actionDetail : {
    actionId: '',
    actionName: '',
    actionPath: '',
    isInline: false
  },

 /**
  * @class Container for all properties needed for render a Public Notification from the Grid..
  * @property {string} notificationId
  * @property {string} assignmentTitle
  * @property {string} selectionNumber
  * @property {string} selectionId
  */
  publicNotification : {
    notificationId: '',
    assignmentTitle: '',
    selectionNumber: '',
    selectionId: ''
  },

 /**
  * @class Container for all parameters parsed out of a querystring. Each map will be identified by a key : {} pairing.
  */
  paramMap : {},

 /**
  * @class Container for all parameters stored when loading pages within the Administration Console.
  */
  adminConsole : {},

 /**
  * @class Holds the timezone string for the Session. Either EST ir EDT.
  */
  timezone : 'ET'
  
};

/**
* @namespace Container Constants object. Will hold all constants for the eTendering application. Constants are defines using inner objects defined within this container.<br/>
*/
window.c20g.Constants = {
 /**
  * @class Object containing User Role constant values.<br/>
  * @property {int} role_firm_user Defines the constant for a firm user. Value: 1.
  * @property {int} role_bank_user Defines the constant for a bank user. Value: 2.
  * @property {int} role_bank_admin Defines the constant for a bank. Value: 3.
  * @property {int} role_impersonator Defines the constant for a user impersonating another user. Value: 4.
  * @property {int} role_sys_admin Defines the constant for a system administrator. Value: 5.
  * @property {int} role_hr_user Defines the constant for a hr user. Value: 6.
  * @property {int} role_ifc_user Defines the constant for a hr user. Value: 7.
	* @property {int} role_joint_ifc_user Defines the constant for a hr user. Value: 8.
  */
  roles : {
    role_firm_user : 1,
    role_bank_user : 2,
    role_bank_admin : 3,
    role_impersonator : 4,
    role_sys_admin : 5,
    role_hr_user : 6,
    role_ifc_user : 7,
		role_joint_ifc_user : 8
  },

 /**
  * @class Object containing the URLs to the Cordys resources and eTendering site. <br/>
  * @property {string} gateway_protocol Protocol for the eTendering site.
  * @property {string} gateway_host Host for the eTendering site.
  * @property {string} gateway_virtual_dir Web Context for the Cordys CAF interface. Default: '/cordys'
  * @property {string} gateway_path Path to the Cordys gateway. Default: '/com.eibus.web.soap.Gateway.wcp'
  * @property {string} file_download_path Path to download files from the Jackrabbit server
  * @property {string} file_upload_path Path to upload files to the Jackrabbit server
  * @property {string} app_organization_key The organization for the eTendering System. Default: eTendering.
  * @property {string} app_organization_dn The distinguished name for the organization for the eTendering System. Default: 'o=eTendering,cn=cordys,o=wb.ad.worldbank.org'
  */
  urls : {
	gateway_protocol : 'http://',
	//  gateway_protocol : '@GATEWAY_PROTOCOL@://',
	// gateway_host : location.host,
    gateway_host : 'frank.c20g.com', //or 'frank.c20g.com for working remotely
    //gateway_host : '@GATEWAY_HOST@',
    gateway_virtual_dir : '/cordys',    gateway_virtual_dir : '/cordys',
    webapp_virtual_dir : '/c20gec',
    webapp_servlet_dir : '/c20gect',
    gateway_path : '/com.eibus.web.soap.Gateway.wcp',
    public_gw_proxy : '/c20gect/gwproxy',
    login_init_servlet : '/c20gect/protected/init',
    file_download_path : '/download',
    file_upload_path : '/upload',
	app_organization_key : '?organization=',
	app_organization_dn : 'o%3Dwbcmo%2Ccn%3Dcordys%2Ccn%3Ddev%2Co%3Dwb.ad.worldbank.org',
    sap_servlet : '/c20gect/protected/sap'
  }
};

/**
* @namespace Container URL object. Holds convience URL methods for the eTendering application and Cordys resources.<br/>
*/
window.c20g.URL = {
  /**
   * @function
   * @param {string} page The application path to the page (eg. '/protected/pickers.html')
   * @returns {string} the absolute path to the page (eg. 'http://sergei.c20g.com/c20get/protected/pickers.html')
   */
   getPageUrl : function(page) {
    return [ window.c20g.Constants.urls.gateway_protocol,
      window.c20g.Constants.urls.gateway_host,
      window.c20g.Constants.urls.webapp_virtual_dir,
      page
    ].join('');
   },

  /**
   * @function
   * @returns {string} the root of the application's web service virtual directory (eg. http://sergei.c20g.com/cordys)
   */
   getWebServiceUrl : function() {
    return [ window.c20g.Constants.urls.gateway_protocol,
      window.c20g.Constants.urls.gateway_host,
      window.c20g.Constants.urls.gateway_virtual_dir
    ].join('');
   },

  /**
   * @function
   * @returns {string} the root of the application's web virtual directory (eg. http://sergei.c20g.com/c20get)
   */
   getWebAppUrl : function() {
    return [ window.c20g.Constants.urls.gateway_protocol,
      window.c20g.Constants.urls.gateway_host,
      window.c20g.Constants.urls.webapp_virtual_dir
    ].join('');
   },

  /**
   * @function
   * @returns {string} the URL to the Cordys web gateway (eg. http://sergei.c20g.com/cordys/com.eibus.web.soap.Gateway.wcp)
   */
  getGatewayUrl : function() {
    return [ window.c20g.URL.getWebServiceUrl(),
      window.c20g.Constants.urls.gateway_path,
			window.c20g.Constants.urls.app_organization_key,
			window.c20g.Constants.urls.app_organization_dn
    ].join('');
  },

  /**
   * @function
   * @returns {string} the URL to the Download Servlet to download a jackrabbit file (eg. http://sergei.c20g.com/c20gett/download)
   */
  getFileDownloadUrl : function() {
    return [ window.c20g.Constants.urls.gateway_protocol,
      window.c20g.Constants.urls.gateway_host,
      window.c20g.Constants.urls.webapp_servlet_dir,
      window.c20g.Constants.urls.file_download_path
    ].join('');
  },

  /**
   * @function
   * @returns {string} the URL to the Upload Servlet to download a jackrabbit file (eg. http://sergei.c20g.com/c20gett/upload)
   */
  getFileUploadUrl : function() {
    return [ window.c20g.Constants.urls.gateway_protocol,
      window.c20g.Constants.urls.gateway_host,
      window.c20g.Constants.urls.webapp_servlet_dir,
      window.c20g.Constants.urls.file_upload_path
    ].join('');
  },

 /**
  * @function
  * @returns (string) the URL to the public gateway proxy (eg. http://sergei.c20g.com/c20gett/gwproxy)
  */
  getGatewayProxy : function() {
	return [ window.c20g.Constants.urls.gateway_protocol,
      window.c20g.Constants.urls.gateway_host,
	  window.c20g.Constants.urls.public_gw_proxy
    ].join('');
  },
 
 /**
  * @function
  * @returns (string) the URL of the servlet that should be invoked to init the login process
  */
  getLoginInitServletUrl : function() {
	  return [ window.c20g.Constants.urls.gateway_protocol,
      window.c20g.Constants.urls.gateway_host,
	  window.c20g.Constants.urls.login_init_servlet
    ].join('');
  },
 /**
  * @function
  * @returns (string) the URL of the servlet that should be invoked when sending requests to SAP.
  */
  getSAPHandlerServletUrl : function() {
	  return [ window.c20g.Constants.urls.gateway_protocol,
      window.c20g.Constants.urls.gateway_host,
	  window.c20g.Constants.urls.sap_servlet
    ].join('');
  },

 /**
  * @function
  * @description Generic utility function that will be used to load links without storing into history.
  * @param {string} url The path to the file that will be loaded in the main content window.
  * @param (object) params Optional parameters for loading the url
  *   <ul>
  *     <li>containerId - The ID of the container in which to load the URL.  Defaults to 'main'</li>
  *     <li>filter - The selector that can be used to select part of the loading page.</li>
  *     <li>callback - The function that will be executed after the page is loaded.</li>
  *   </ul>
  */
  loadUrl : function(url, params){
    params = params || {};
    var containerId = params.containerId || 'main';
    window.c20g.URL.storeUrlParams(url);
    url = params.filter ? url+' '+params.filter : url;
    if (params.callback){
      $('#'+containerId).load(url, params.callback);
    } else {
      $('#'+containerId).load(url);
    }
  },
  /**
   * @function
   * @description Generic utility function that will be used to load links into the main container and store it
   * into history so that it can be revisited with the back button.  This function just stores data into history
   * and calls $.historyLoad, which in turn calls loadFromHistory to actually load the url.
   * @param {string} url The path to the file that will be loaded in the main content window.
   * @param (object) params Map of optional parameters for loading the url.  The following are valid fields.
   *   <ul>
   *     <li>filter - The selector that can be used to select part of the loading page.</li>
   *     <li>callback - The function that will be executed after the page is loaded.</li>
   *     <li>sessionVars - A map of session variables that is stored in history and put back in session
   *      when stepping back to this page. e.g. {'selectionDetail.selectionId' : id}</li>
   *   </ul>
   */
  loadUrlWithHistory : function(url, params) {
    var menuItem = $('.options_menu > li.active').attr('id');
    var historyKey = new Date().getTime();
    window.c20g.Session.history[historyKey] = params || {};
    window.c20g.Session.history[historyKey].url = url;
    window.c20g.Session.history[historyKey].menuItem = menuItem;
    $.historyLoad('$h='+historyKey);
  },
  /**
  * @function
  * @description Pulls a page from history to load into the main container.  If the hash key is not
  * found in the session history, we default to dashboard.html or home.html (if the user is not logged in).
  * @param {string} hash The hash value which is used as the key into the session history.
  */
  loadFromHistory : function(hash) {
    if (window.c20g.DeepLinks.handleDeepLink()) { return; }
    var historyKey = window.c20g.Util.convertToMap(hash).$h;
    var params = window.c20g.Session.history[historyKey] || {};
    window.c20g.URL.storeUrlParams(params.url);
    var url = '';       
    if(params.url){
      url = params.url;
    } else if(window.c20g.URL.isURLProtected()){
      url = window.c20g.Util.isFirmUser() && window.c20g.Session.loggedInUser.resetPassword ? 
        './firmresetpassword.html' : './dashboard.html';
    } else {
      if($('#servertype').attr('urltype') === 'internal') {
        url = './home_internal.html';
      } else {
        url = './home.html';
      }
    }
    
    var menuItem = '';
    if(!params.url){
      menuItem = window.c20g.URL.isURLProtected() ? 'menu_dashboard' : 'menu_home';
    } else {
      menuItem = params.menuItem ? params.menuItem : '';
    }
    url = params.filter ? url+' '+params.filter : url;
    // set session vars
    var pathVar, pathArray;
    for (var sessionVar in params.sessionVars) {
      if (params.sessionVars.hasOwnProperty(sessionVar)) {
        pathVar = window.c20g.Session;
        pathArray = sessionVar.split(".");
        for (var i=0; i<pathArray.length; i++) {
          if (i === pathArray.length-1) {
            pathVar[pathArray[i]] = params.sessionVars[sessionVar];
          } else {
            pathVar = pathVar[pathArray[i]];
          }
        }
      }
    }
    // load main div
    if (params.callback) {
      $('#main').load(url, params.callback);
    } else {
      $('#main').load(url);
    }
    // load menu
    if (!window.c20g.URL.isURLProtected()) {
      window.c20g.Menu.loadPublicMenu(menuItem);
    } else {
      if(window.c20g.Util.isFirmUser() && window.c20g.Session.loggedInUser.resetPassword){
        window.c20g.Menu.loadResetPasswordMenu('menu_resetpassword');
      } else {
        window.c20g.Menu.loadUserMenu(menuItem, function(){
          window.c20g.Menu.init(['menu_bankuser','menu_bankadmin']);
        });
      }
    }
  },
  /**
  * @function
  * @description Parses parameters from a url and stores them into a map in session, so they can be
  * retrieved on a form later. They are stored under a key specifed by '$k'
  * @param {string} url The url to parse.
   */
  storeUrlParams : function(url) {
    if (!url) { return; }
    var qsstartidx = url.indexOf('?'); 
    if(qsstartidx !== -1){
      window.c20g.Util.saveQSParamsInSession(url.substring(qsstartidx+1));
    }
  },

/**
  * @function
  * @description Utility method that will build the link to download a file with a given UUID.
  * @param {string} title The path to the file that will be loaded in the main content window.
  * @param {string} uuid The ID of the container in which to load the URL.
  * @return {string} Builds a link to the file. 
  */
  buildFileDownloadURL : function(title, uuid){
    return '<a target="hidden_util_frame" href="'+window.c20g.URL.getFileDownloadUrl()+'?uuid='+uuid+'">'+title+'</a>';
  },

/**
  * @function
  * @description Returns whether the URL being accessed is in the protected path.
  * @return {boolean}
  */
  isURLProtected : function(){
    var locRequest = window.location.pathname;
    if (locRequest.indexOf('protected') === -1){
      return false;
    } else {
      return true;
    }
  }

};

/**
* @namespace Container Menu object. Holds convenience Menu methods to load, highlight and un-highlight menu items.<br/>
*/
window.c20g.Menu = {
  timeout : 100,
  closetimer : 0,
  ddmenuitem : 0,

  menu_open: function(){	
    window.c20g.Menu.menu_canceltimer();
    window.c20g.Menu.menu_close();
    window.c20g.Menu.ddmenuitem = $(this).find('ul').eq(0).css('visibility', 'visible');
  },
  
  menu_close : function(){	
    if(window.c20g.Menu.ddmenuitem) {
      window.c20g.Menu.ddmenuitem.css('visibility', 'hidden');
    }
  },
  
  menu_timer : function() {
    window.c20g.Menu.closetimer = window.setTimeout(window.c20g.Menu.menu_close, window.c20g.Menu.timeout);
  },
  
  menu_canceltimer : function() {	
    if(window.c20g.Menu.closetimer){	
      window.clearTimeout(window.c20g.Menu.closetimer);
      window.c20g.Menu.closetimer = null;
     }
  },
  
  init: function(arrayMenus){	
    for(var i=0; i < arrayMenus.length; i++) {
      $('#' + arrayMenus[i] + ' > li').bind('mouseover', window.c20g.Menu.menu_open);
      $('#' + arrayMenus[i] + ' > li').bind('mouseout',  window.c20g.Menu.menu_timer);
    }
    document.onclick = window.c20g.Menu.menu_close;
  },

 /**
  * @function
  * @description Loads the menu for the user role. Menus are defined in menu.html. After loading the menu, it applies the active class to the menuItem. If no menuItem was defined,
  *   it will apply the class to the default menuItem. If a null value is passed for the menuItem, no item will be highlighted.<br/>
  *   Note: This function can only be called from pages within the protected root directory.
  * @param {string} menuItem The ID of the menu item that will remain highlights.
  * @param {function} callback Function that will be called to execute after the menu is loaded.
  */
  loadUserMenu : function(menuItem, callback){
    var userRoles = window.c20g.Session.actingAsUser.userRoles;
    var menu = 'firmuser';
    if($.inArray(window.c20g.Constants.roles.role_bank_user, userRoles) !== -1){
      menu = 'bankuser';
    } else if($.inArray(window.c20g.Constants.roles.role_bank_admin, userRoles) !== -1){
      menu = 'bankadmin';
    }
    $('#menu').load('../menu.html #menu_'+menu, function(){
      if(typeof menuItem !== 'undefined' && menuItem !== null && menuItem !== ''){
        window.c20g.Menu.highlightItem(menuItem);
      }
      if(window.c20g.Util.isImpersonating()){
        window.c20g.Impersonate.showMessage();
      }
      if (callback) { callback(); }
    });
  },

 /**
  * @function
  * @description Loads the menu for the firm user to reset password. Menus are defined in menu.html. 
  *   After loading the menu, it applies the active class to the menuItem. If no menuItem was defined,
  *   it will apply the class to the default menuItem. If a null value is passed for the menuItem, no item will be highlighted.<br/>
  *   Note: This function can only be called from pages within the protected root directory.
  * @param {string} menuItem The ID of the menu item that will remain highlights.
  * @param {function} callback Function that will be called to execute after the menu is loaded.
  */
  loadResetPasswordMenu : function(menuItem, callback){
    var menu = 'firmuserresetpassword';
    $('#menu').load('../menu.html #menu_'+menu, function(){
      if(typeof menuItem !== 'undefined' && menuItem !== null && menuItem !== ''){
        window.c20g.Menu.highlightItem(menuItem);
      }
      if (callback) { callback(); }
    });
  },

 /**
  * @function
  * @description Loads the public menu and highlights the default menuItem (Home).<br/>
  *   Note: This function can only be called from pages in the public root directory.
  * @param {string} menuItem The ID of the menu item that will remain highlights.
  * @param {function} callback Function that will be called to execute after the menu is loaded.
  */
  loadPublicMenu : function(menuItem, callback){
    $('#menu').load('./menu.html #menu_public', function(){
      if(typeof menuItem !== 'undefined' && menuItem !== null && menuItem !== ''){
        window.c20g.Menu.highlightItem(menuItem);
      }
      if (callback) { callback(); }
    });
  },

 /**
  * @function
  * @description Applies the active class to the passed menuItem.
  * @param {string} menuItem The ID of the menu item defined in menu.html.
  */
  highlightItem : function(menuItem){
    window.c20g.Menu.highlightNone();
    $('#'+menuItem).addClass('active');
  },

 /**
  * @function
  * @description Removes the active class from all menuItems. This is useful if the content being rendered in the main content page do not correspond to any of the primary
  *   navigation menu items.
  */
  highlightNone : function(){
    $('li', $('#menu')).removeClass('active');
  }

};

/**
* @namespace Container Util object. Holds convenience methods to cover reusable functionality within the eTendering system. This includes loading pages and menu items together,
*   authenticating the user, determining user roles and formatting datetime strings<br/>
*/
window.c20g.Util = {

 /**
  * @function
  * @description Utility method to open the form in another window in order to print.<br/>
  *   Note: This function can only be called from within protected directory.
  */
  printForm : function() {
    if(window.c20g.URL.isURLProtected()) {
      window.open('../printform.html');
    } else {
      window.open('printform.html');
    } 
  }, 

 /**
  * @function
  * @description The signout url is set during the build process.<br/>
  *   Note: This function is called from within protected directory.
  */
  signout : function() {
    //window.location.href = '@SIGNOUT_URL@';
	//window.location.href = 'http://www.counterpointconsulting.com';
	//alert('Hello');
	//window.location = 'http://www.counterpointconsulting.com';
	//self.location = 'http://www.counterpointconsulting.com';
	window.location.replace('http://www.counterpointconsulting.com');
  }, 
  
  /**
   * @function
   * @returns {boolean} the skip schedule flag 
   */
   isSkipSchedule : function() {
     //var skipSchedule = '@SKIP_SCHEDULE@';
		 var skipSchedule = 'true';
     if(skipSchedule === 'true'){
       return true;
     } else {
       return false;
     } 
   },

 /**
  * @function
  * @description Utility method that will reload the home page and the public menu.<br/>
  *   Note: This function can only be called from the public root directory.
  */
  loadHome : function(){
    window.c20g.Menu.loadPublicMenu('menu_home', function(){
      if($('#servertype').attr('urltype') === 'internal') {
        window.c20g.URL.loadUrlWithHistory('./home_internal.html');
      } else {
        window.c20g.URL.loadUrlWithHistory('./home.html');
      }
    });
  },

 /**
  * @function
  * @description Loads the URL and highlights the Menu Item. This function assumes that the menu containing the menuItem is already loaded.
  * @see window.c20g.Menu.loadPublicMenu
  * @see window.c20g.Menu.loadUserMenu
  * @param {string} url The path to the file that will be loaded in the main content window.
  * @param {string} menuItem The ID of the menu item defined in menu.html
  */
  loadMenuItemURL : function(url, menuItem){
    window.c20g.Menu.highlightItem(menuItem);
    window.c20g.URL.loadUrlWithHistory(url);
  },

 /**
  * @function
  * @description Loads the selection details in the main content window for the given Selection ID.
  * @param {number} id The ID of the selection
  */
  loadSelectionDetails : function(id) {
    window.c20g.Session.selectionDetail.selectionId = id;
    window.c20g.Menu.highlightNone();
    var params = {sessionVars : {'selectionDetail.selectionId' : id}};
    if(window.c20g.Util.isFirmUser()) {
      window.c20g.URL.loadUrlWithHistory('./selectiondetailfirm.html', params);
    } else {
      window.c20g.URL.loadUrlWithHistory('./selectiondetail.html', params);
    }
  },

 /**
  * @function
  * @description Loads all of the selection data necessary for the action form to load properly. The Action Form looks into the <br/>
  *   {@link window.c20g.Session.selectionDetail} object to retrieve values so this must be first populated. All ** properties are required to be populated
  * @param {object} data A hashmap containing all of the key-value pairs where the key is the proprerty name stored within sessionDetail.
  */
  loadSelectionDataForForm : function(data){
    var sd = {};
    sd.selectionId = data.selectionId;
    sd.selectionNumber = data['selection.selection_number'];
    sd.title = data['selection.title'];
    sd.description = data.description;
    sd.advertisementWaiver = data.advertisementWaiver;
    sd.legalServices = data.legalServices;
    sd.estAmount = data.estAmount;
    sd.baseCurrencyId = data.baseCurrencyId;
    sd.baseCurrencyName = data.baseCurrencyName;
    sd.calculatedUsd = data.calculatedUsd;
    sd.extAmount = data.extAmount;
    sd.extAmountUSD = data.extAmountUSD;
    sd.calculatedDate = data.calculatedDate;
    sd.selectionTypeId = data.selectionTypeId;
    sd.selectionMethodId = data.selectionMethodId;
    sd.draftFlag = data.draftFlag;
    sd.creationDate = data.creationDate;
    sd.closeDate = data.closeDate;
    sd.organizationId = data.organizationId;
    sd.businessUnitId = data.businessUnitId;
    sd.soleSourceJustificationId = data.soleSourceJustificationId;
    sd.processId = data.processId;
    sd.taskId = data.taskId;
    sd.ttlLocation = data.ttlLocation;
    sd.startedBy = data.startedBy;
    sd.areaOfExpertise = data.areaOfExpertise;
    sd.statusId = data.statusId;
    sd.subStatusId = data.subStatusId;
    sd.notificationModFlag = data.notificationModFlag;
    sd.auxProcessId = data.auxProcessId;
    sd.auxProcessNamespace = data.auxProcessNamespace;
    sd.rfpModFlag = data.rfpModFlag;
    sd.noTrustFundsFlag = data.noTrustFundsFlag;
    sd.noProjectsFlag = data.noProjectsFlag;
    sd.noCountryFlag = data.noCountryFlag;
    sd.scoreUnlockFlag = data.scoreUnlockFlag;
    sd.poId = data.poId;
    sd.vendorOrUPI = data.vendorOrUPI;
    sd.vendorOrUPIName = data.vendorOrUPIName;
    sd.poDailyRate = data.poDailyRate;
	sd.purchaseReqNo = data.purchaseReqNo;
	sd.frameworkType = data.frameworkType;
	sd.frameworkNo = data.frameworkNo;
	sd.solicitationOrFramework = data.solicitationOrFramework;
	sd.noMandCritFlag = data.noMandCritFlag;
	sd.poRateUnit = data.poRateUnit;
    window.c20g.Session.selectionDetail = sd;
  },

 /**
  * @function
  * @description Loads the action form in the main content area as part of Deeplinking. When this occurs, the Action Form is not loaded into the overlay.
  * @param {number} actId The ID of the action form i.e. the selection action id.
  */
  loadActionFormInline : function(selActionId) {
    window.c20g.Session.actionDetail.selectionActionId = selActionId;
    window.c20g.Session.actionDetail.isInline = true;
    window.c20g.URL.loadUrl('./action.html');
  },

 /**
  * @function
  * @description Load the Action form into the Overlay.
  * @param {string} url The URL to load.
  * @param {string} actionName The name of the task that will be automatically substituted into the formHeader when the form is initialized.
  * @param {string} actionId The ID of the the action (LU_ACTION.ID) being loaded
  * @param {string} selectionActionId The ID of the the selection action.
  * @param {function} callback Function that will automatically be called when the overlay is closed.
  */
  loadActionFormInOverlay : function(path, actionName, actionId, selectionActionId, callback) {
    window.c20g.Session.actionDetail.actionName = actionName;
    window.c20g.Session.actionDetail.actionId = actionId;
    window.c20g.Session.actionDetail.selectionActionId = selectionActionId;
    window.c20g.Util.loadHtmlPageInOverlay(path, callback);
  },

 /**
  * @function
  * @description Loads an HTMLPage (or any url, really) in an overlay in a div with the id <i>'overlayPageContainer'</i>
  * @param {string} url The URL to load into the overlay div container.
  * @param {function} callback Function that will automatically be called when the overlay is closed.
  */
  loadHtmlPageInOverlay : function(url, callback) {
    window.c20g.Session.actionDetail.isInline = false;
    window.c20g.Session.overlay.closeCallback = callback;
    $('#overlayPage').overlay(window.c20g.Session.overlay);
    window.c20g.Session.actionDetail.actionPath = url;
    $('#overlayPage').overlay().load();
    $('#overlayPage').parent().focus();
    $('#overlayMask').show();
  },

 /**
  * @function
  * @description Loads an HTMLPage (or any url, really) in a div passed into params
  * @param {string} url The URL to load into the overlay div container.
  * @param {function} params sent when function called.
  */
  loadHtmlPageInDiv : function(url, params) {
    params = params || {};
    var containerId = params.containerId;
    window.c20g.URL.storeUrlParams(url);
    window.c20g.Session.actionDetail.isInline = false;
    window.c20g.Session.actionDetail.actionPath = url;
      $('#'+containerId).load(url);
  },

  /**
   * @function
   * @description Loads a url in a modal container in a div with the id <i>'modalPageContainer'</i>
   * @param {string} url The URL to load into the modal div container.
   */
  loadUrlInModal : function(url) {
    var container = $('#modalPageContainer');
    container.empty();
    window.c20g.URL.loadUrl(url, {containerId:'modalPageContainer',
                                 callback: function() { $('#modalPageContainer > div').modal(); }
    });
  },

 /**
  * @function
  * @description If the HTML Page was opened in the overlay, this function will call that overlay to close and run the close callback passed to the loadHTMLPage function.
  * @param {boolean} callback Pass true to call callback function
  */
  closeHTMLPageInOverlay : function(callback){
    if(!window.c20g.Session.actionDetail.isInline){
      if (callback === true && window.c20g.Session.overlay.closeCallback) {
        window.c20g.Session.overlay.closeCallback();
      }
      $('#overlayPage').overlay().close();
    } else {
      window.c20g.Session.actionDetail.isInline = false;
      window.c20g.Util.loadMenuItemURL('./dashboard.html', 'menu_dashboard');
    }
    $('#overlayMask').hide();
  },

 /**
  * @function
  * @description Calls the microflow to return the (Cordys) logged in user and roles and the acting as user and roles. This data is loaded into session.
  * @see window.c20g.Session.loggedInUser
  * @see window.c20g.Session.actingAsUser
  * @param {function} callback Function that is invoked once the users are loaded into session.
  */
  getLoggedInUser : function(callback) {
    // make a quick req to the init servlet
    var initResponse = $.ajax({
      url: window.c20g.URL.getLoginInitServletUrl(),
      async: false
    }).responseText;
    var initResponseObj = {};
    try {
      if(initResponse === 'ERROR'){
        window.c20g.Form.showErrorMessage('loadingsession', 'error.loading.user');
        return;
      } 
    
      initResponseObj = JSON.parse(initResponse);
      if(typeof initResponseObj !== 'undefined') {
        if(!initResponseObj.ISVALIDUSER) {
          window.location.href = '../index.html?$t=registerfirm';
        } else if (initResponseObj.ISVALIDUSER){
          if(location.host !== '@APP_EXTERNAL_PROXY@'){
            if(initResponseObj.SAPSSOURL !== ''){
              $("#hidden_sapsso_frame").attr("src", initResponseObj.SAPSSOURL); 
            }
          }
        }
      } else {
        window.c20g.Form.showErrorMessage('loadingsession', 'error.loading.user');
        return;
      }
    } catch (err) {
      window.c20g.Form.showErrorMessage('loadingsession', 'error.loading.user');
      return;
    }
    
    // now get logged in user
    var soapBody = new SOAPObject("GetLoggedInUserBPM");
    soapBody.attr("xmlns", "http://cordys.com/c20gEC/SEC_Identity_Management/1.0");
    var soapRequest = new SOAPRequest("GetLoggedInUserBPM", soapBody);

    try {
      SOAPClient.Proxy = window.c20g.URL.getGatewayUrl();
      SOAPClient.SendRequest(soapRequest, function(response){
        if(!window.c20g.Soap.isResponseValid(response)){
          window.c20g.Soap.showErrorMessage(response, 'loading');
          return;
        }
        var userObj = response.Body[0].GetLoggedInUserBPMResponse[0];
        var id = userObj.UserID[0].Text;
        var dn = userObj.UserDN[0].Text;
        var upi = userObj.UPI[0].Text;
        var firstName = userObj.FirstName[0].Text;
        var lastName = userObj.LastName[0].Text;
        var displayName = userObj.UserDisplayName[0].Text;
        var email = userObj.Email[0].Text;
        var roles = userObj.eTenderingRoles[0];
        var userRoles = [];
        var firmId = '';
        var firmName = '';
        var isPrimaryContact = '';

        var roleFirmUser = roles.ROLE_FIRM_USER[0].Text === "true";
        var roleBankUser = roles.ROLE_BANK_USER[0].Text === "true";
        var roleBankAdmin = roles.ROLE_BANK_ADMIN[0].Text === "true";
        var roleImpersonator = roles.ROLE_IMPERSONATOR[0].Text === "true";
        var roleSysAdmin = roles.ROLE_SYS_ADMIN[0].Text === "true";
        var roleHRUser = roles.ROLE_HR_USER[0].Text === "true";
        var roleIFCUser = roles.ROLE_IFC_USER[0].Text === "true";
				// change ROLE_IFC_USER in following line to ROLE_JOINT_IFC_USER
				var roleJOINTIFCUser = roles.ROLE_JOINT_IFC_USER[0].Text === "true";
				
        if(roleFirmUser) {
          userRoles = [window.c20g.Constants.roles.role_firm_user];
          firmId = userObj.FirmID[0].Text;
          firmName = userObj.FirmName[0].Text;
          isPrimaryContact = userObj.IsPrimaryContact[0].Text;
        } else {
          if(roleBankAdmin) {
            userRoles = [window.c20g.Constants.roles.role_bank_admin];
          } else {
            userRoles = [window.c20g.Constants.roles.role_bank_user];
          }
          if(roleIFCUser) {
            userRoles.push(window.c20g.Constants.roles.role_ifc_user);
          }
					if(roleJOINTIFCUser) {
            userRoles.push(window.c20g.Constants.roles.role_joint_ifc_user);
          }
          if(roleImpersonator) {
            userRoles.push(window.c20g.Constants.roles.role_impersonator);
          }
          if(roleSysAdmin) {
            userRoles.push(window.c20g.Constants.roles.role_sys_admin);
          }
          if(roleHRUser) {
            userRoles.push(window.c20g.Constants.roles.role_hr_user);
          }
        }

        // Setting loggedIn user properties
        var liu = window.c20g.Session.loggedInUser;
        liu.id = id;
        liu.dn = dn;
        liu.upi = upi;
        liu.firstName = firstName;
        liu.lastName = lastName;
        liu.displayName = displayName;
        liu.email = email;
        liu.userRoles = userRoles;
        liu.firmId = firmId;
        liu.firmName = firmName;
        liu.isPrimaryContact = isPrimaryContact;

        // Setting actingAs user properties
        var asu = window.c20g.Session.actingAsUser;
        asu.id = id;
        asu.dn = dn;
        asu.upi = upi;
        asu.firstName = firstName;
        asu.lastName = lastName;
        asu.displayName = displayName;
        asu.email = email;
        asu.userRoles = userRoles;
        asu.firmId = firmId;
        asu.firmName = firmName;
        asu.isPrimaryContact = isPrimaryContact;

        (callback && callback());
      });
    } catch (e) {
    }
  },

 /**
  * @function
  * @description Determines whether the actingAsUser is a firm user.
  * @returns {boolean} returns true if the user is a firm user.
  */
  isFirmUser : function(){
    var userRoles = window.c20g.Session.actingAsUser.userRoles;
    if($.inArray(window.c20g.Constants.roles.role_firm_user, userRoles) !== -1){
      return true;
    }
    return false;
  },
  
  
 /**
  * @function
  * @description Determines whether the actingAsUser is a bank user.
  * @returns {boolean} returns true if the user is a bank user.
  */
  isBankUser : function(){
    var userRoles = window.c20g.Session.actingAsUser.userRoles;
    if($.inArray(window.c20g.Constants.roles.role_bank_user, userRoles) !== -1){
      return true;
    }
    return false;
  },

 /**
  * @function
  * @description Determines whether the actingAsUser is a bank admin.
  * @returns {boolean} returns true if the user is a bank admin.
  */
  isBankAdmin : function(){
    var userRoles = window.c20g.Session.actingAsUser.userRoles;
    if($.inArray(window.c20g.Constants.roles.role_bank_admin, userRoles) !== -1){
      return true;
    }
    return false;
  },
  
 /**
  * @function
  * @description Determines whether the actingAsUser is a hr user.
  * @returns {boolean} returns true if the user is a HR User.
  */
  isHRUser : function(){
    var userRoles = window.c20g.Session.actingAsUser.userRoles;
    if($.inArray(window.c20g.Constants.roles.role_hr_user, userRoles) !== -1){
      return true;
    }
    return false;
  },

/**
  * @function
  * @description Determines whether the actingAsUser is a IFC user.
  * @returns {boolean} returns true if the user is a IFC user.
  */
  isIFCUser : function(){
    var userRoles = window.c20g.Session.actingAsUser.userRoles;
    if($.inArray(window.c20g.Constants.roles.role_ifc_user, userRoles) !== -1){
      return true;
    }
    return false;
  },

/**
  * @function
  * @description Determines whether the actingAsUser is a JOINT and IFC user.
  * @returns {boolean} returns true if the user is a JOINT and IFC user.
  */
  isJOINTIFCUser : function(){
    var userRoles = window.c20g.Session.actingAsUser.userRoles;
    if($.inArray(window.c20g.Constants.roles.role_joint_ifc_user, userRoles) !== -1){
      return true;
    }
    return false;
  },	
	
 /**
  * @function
  * @description Determines whether the actingAsUser is a bank user or a bank admin.
  * @returns {boolean} returns true if the user is a bank admin or a bank admin.
  */
  isBankUserOrAdmin : function(){
    return !window.c20g.Util.isFirmUser();
  },

 /**
  * @function
  * @description Determines whether the actingAsUser is in the impersonator role.
  * @returns {boolean} returns true if the user is in the impersonator role.
  */
  isImpersonator : function(){
    var userRoles = window.c20g.Session.actingAsUser.userRoles;
    if($.inArray(window.c20g.Constants.roles.role_impersonator, userRoles) !== -1){
      return true;
    }
    return false;
  },

 /**
  * @function
  * @description Determines whether the logged in user is different from the acting as user. When this is the case, the actingAsUser is being impersonated.
  * @returns {boolean} returns boolean true if the user is being impersonated
  */
  isImpersonating : function(){
    return window.c20g.Session.loggedInUser.id !== window.c20g.Session.actingAsUser.id;
  },

 /**
  * @function
  * @description Formats the timestamp parameter into 'mm-dd-yyyy', or 'Day of Week, dd, Month yyyy'
  * @param {string} timestamp The string format should be 'yyyy-mm-ddTHH:MM:SS.mills[24hr]'.
  * @param {string} format The expected return format. possible values are 'long' or 'short'.
  * @param {boolean} omitTZ Determines whether to append the ET timezone
  * @returns (string) The Date formatted as 'mm-dd-yyyy' or 'DD, d MM, yy'.
  */
  formatToDate : function(timestamp, format){
    if(typeof timestamp === 'undefined' ||
              timestamp.length === 0 ||
              timestamp.indexOf('T') === -1){
      return '';
    } else {
      var ts = timestamp.slice(0, timestamp.indexOf('T'));
      var dt = $.datepicker.parseDate('yy-mm-dd', ts);
      if(typeof format !== 'undefined' && format === 'long'){  
        return $.datepicker.formatDate('dd-M-yy', dt);
      } else {
        return $.datepicker.formatDate('mm-d-yy', dt);
      }
    }
  },
  
  /**
  * @function
  * @description Returns the current date in Cordys Date Format  'yyyy-mm-ddTHH:MM:SS.mills[24hr]' to seconds precision
  * @returns (string) Current Date formatted as 'yyyy-mm-ddTHH:MM:SS.mills[24hr]'.
  */
  getCurrentDate : function(){
    return window.c20g.Util.getCordysCurrentDate('');
  },
  
  /**
  * @function
  * @description Returns the current date and time early morning in Cordys Date Format  'yyyy-mm-ddTHH:MM:SS.mills[24hr]'
  * @returns (string) Current Date formatted as 'yyyy-mm-ddTHH:MM:SS.mills[24hr]'.
  */
  getCurrentDateFloor : function(){
    return window.c20g.Util.getCordysCurrentDate('floor');
  },
  
  /**
  * @function
  * @description Returns the current date and time mid night in Cordys Date Format  'yyyy-mm-ddTHH:MM:SS.mills[24hr]' 
  * @returns (string) Current Date formatted as 'yyyy-mm-ddTHH:MM:SS.mills[24hr]'.
  */
  getCurrentDateCeil : function(){
    return window.c20g.Util.getCordysCurrentDate('ceil');
  },
  
  getCordysCurrentDate : function(precision){
    var currentDate = new Date();
    var currMonth = currentDate.getMonth() + 1;
    var currDay = currentDate.getDate();
    var frmtCurrMonth = parseInt(currMonth,10) < 10 ? '0' + currMonth : currMonth;
    var frmtCurrDay = parseInt(currDay,10) < 10 ? '0' + currDay : currDay;
    var datePart = currentDate.getYear() + '-' + frmtCurrMonth + '-' + frmtCurrDay;
    var timePart = '';
    if(precision === 'ceil'){
      timePart = '23:59:59.999';
    } else if (precision === 'floor') {
      timePart = '00:00:00.000';
    } else {
      var hours = currentDate.getHours();
      var minutes = currentDate.getMinutes();
      var seconds = currentDate.getSeconds();
      var frmHours = parseInt(hours,10) < 10 ? '0' + hours : hours;
      var frmMinutes = parseInt(minutes,10) < 10 ? '0' + minutes : minutes;
      var frmSeconds = parseInt(seconds,10) < 10 ? '0' + seconds : seconds;
      timePart = frmHours + ':' + frmMinutes + ':' + frmSeconds + '.000';
    }
    strCurrDate = datePart + 'T' + timePart;
    return strCurrDate;
  },
  
  /**
  * @function
  * @description Formats the timestamp parameter into 'HH:MM AM/PM'
  * @param {string} timestamp The string format should be 'yyyy-mm-ddTHH:MM:SS.mills[24hr]'.
  * @param {boolean} omitTZ Determines whether to append the ET timezone
  * @returns {string} The Time formatted as 'HH:MM AM/PM'.
  */
  formatToTime : function(timestamp){
  // According to new Bank Requirement 20: Remove 'ET' (timezone) from all dates and times throughout application.  therefore removing omitTZ parameter
    if(typeof timestamp === 'undefined' ||
              timestamp.length === 0 ||
              timestamp.indexOf('T') === -1){
      return '';
    } else {
      var tArray = timestamp.slice(timestamp.indexOf('T')+1, timestamp.length-1).split(':');
      if (tArray.length < 2){
        return '';
      }
      var z = 'AM';
      var h = parseInt(tArray[0],10);
      if (h === 12){
        z = 'PM';
      } else if(h > 12){
        h = h - 12;
        z = 'PM';
      }
      return h+':'+tArray[1]+' '+z;
    }
  },

 /**
  * @function
  * @description Formats the timestamp parameter into 'mm-dd-yyyy HH:MM AM/PM'
  * @param {string} timestamp The string format should be 'yyyy-mm-ddTHH:MM:SS.mills[24hr]'.
  * @returns {string} The timestamp formatted as 'mm-dd-yyyy HH:MM AM/PM'.
  */
  formatToTimestamp : function(timestamp){
    var d = window.c20g.Util.formatToDate(timestamp, 'long');
    var t = window.c20g.Util.formatToTime(timestamp);
    return d+' '+t;
  },

  getTimeZone : function(){
    if(window.c20g.Session.timezone === ''){
      var cd = new Date();
      var offset = cd.getTimezoneOffset()/60;
      window.c20g.Session.timezone = offset === 4 ? 'EDT' : 'EST';
    }
    return window.c20g.Session.timezone;
  },
  
 /**
  * @function
  * @description Formats the number parameter into 'AB,CDZ,YXW.VU'
  * @param {number} num The number to format as currency / money; expects an int or floating point
  * @returns {string} The number formatted as text, with commas (',') separating thousands and two decimals
  */
  formatToMoney : function(num) {
    var isNegative = false;
    if(typeof num === 'undefined') { return ''; }
    if(num < 0) {
      isNegative = true;
      num = num * (-1);
    }
    
	var centsStr = '';
    var dollarsStr = '' + Math.floor(num);
    if (num % 1 !== 0){
      var baseCents = ("" + (num % 1));
      var dotPos = baseCents.indexOf('.');
      if(baseCents.indexOf('e') !== -1){
				baseCents = ("" + (num % 1).toFixed(3));
			}
      var afterdecimal = baseCents.substring(dotPos,dotPos + 4);    
      var afterround = '' + Math.round(afterdecimal * 100)/100;
      var afterrounddotpos = afterround.indexOf('.');
			if (afterround === '0'){
            centsStr = '.00';
        }else if (afterround === '1') {
            centsStr = '.99';
        }else{
          centsStr = afterround.substring(afterrounddotpos, afterrounddotpos+3);
        }
    } else {
      centsStr = '.00';
    }

    
    var getLastThreeDigits = function(numText) {
      // "1232343".substring("1232343".length - 3)   // -> returns '343'
      return (numText.length <= 3) ? numText : numText.substring(numText.length - 3);
    };
    var putCommasInInteger = function(num) {
      var done = false;
      var reformatted = '';
      var numText = '' + num;
      while(!done) {
        var endOfNum = getLastThreeDigits(numText);
        if(endOfNum === numText) {
          reformatted = endOfNum + reformatted;
          done = true;
        }
        else {
          reformatted = ',' + endOfNum + reformatted;
          numText = numText.substring(0, numText.length - 3);
        }
      }
      return reformatted;
    };
    return (isNegative ? '-' : '') + putCommasInInteger(dollarsStr) + centsStr;
  },

 /**
  * @function
  * @description Replaces the line breakes with html line break tags to keep the formatting. Will handle nulls and will return the null if passed.
  * @param {string} text Unformatted text with regular breaks..
  * @returns {string} Formatted text with <br/> instead of \n line breaks. 
  */
  formatText : function(text) {
    if(text){
      return text.replace(/\n/g, "<br/>\n");
    }
    return text;
  },

 /**
  * @function
  * @description Converts the querystring into a map of key-value pairs.
  * @param {string} querystring The querystring holding the name-value paired parameters.
  */
  convertToMap : function(querystring) {
    var qps = querystring.split('&');
    var map = {};
    var keyval = [];
    for (var i=0; i<qps.length; i++){
      keyval = qps[i].split('=');
      map[keyval[0]] = keyval[1];
    }
    return map;
  },

 /**
  * @function
  * @description Stores the querystring of format $k=key&a=1&b=2 in the session map with the key being the value of $k.
  * @param {string} querystring The querystring holding the name-value paired parameters.
  */
  saveQSParamsInSession : function(querystring){
	
    var qsmap = window.c20g.Util.convertToMap(querystring);
    if(typeof qsmap.$k !== 'undefined'){
      window.c20g.Session.paramMap[qsmap.$k] = qsmap;
    }
  },

 /**
  * @function
  * @description 
  * @param {string} key 
  * @returns {object} A map for the passed in key or null if the key does not exist.
  */
  getParameterMap : function(key) {
    var paramMap = window.c20g.Session.paramMap;
    if(typeof paramMap[key] !== 'undefined'){
      var map = paramMap[key];
      delete paramMap[key];
      return map;
    }
    return null;
  },

 /**
  * @function
  * @description Calls on the browser to bookmark the selection currently stored in selectionDetails. Works for FF and IE
  */
  bookmarkSelection : function(){
    var title = window.c20g.Session.selectionDetail.title;
    var selectionNum = window.c20g.Session.selectionDetail.selectionNumber;
    var selectionId = window.c20g.Session.selectionDetail.selectionId;
    var url = window.c20g.URL.getWebAppUrl()+'/protected/index.html#$t=selection&$s='+selectionId;
    window.c20g.Util.bookmark(url, selectionNum + ' - ' + title);
  },

 /**
  * @function
  * @description Generic bookmark utility function. Works for FF and IE
  * @param {string} title The title of the bookmark.
  * @param {string} url The URL to bookmark.
  */
  bookmark : function(url, title){
    if (window.sidebar) { //FF
      window.sidebar.addPanel(title, url, '');
    } else if( window.external) { //IE
      window.external.AddFavorite(url, title);
    } else {
      window.c20g.Log.warn('Unable to add bookmark for '+title);
    }
  },
  
 /**
  * @function
  * @description Utility function to ensure that the autocomplete lines up property with the textbox on both FF and IE>
  * @param {string} elementId The ID of the textbox.
  * @ignore
  */  
  offsetHelper : function(elementId) {
    var el = $('#'+elementId);
    
    var topFromPos = el.position().top;
    var topFromCss = parseFloat(el.css('top').replace('px', ''));
    var leftFromPos = el.position().left;
    var leftFromCss = parseFloat(el.css('left').replace('px', ''));
    
    var offsetY = topFromPos - topFromCss;
    var offsetX = leftFromPos - leftFromCss;

    //alert('offsetting top: ' + offsetY + '; offsetting left: ' + offsetX);
    el.css('top', topFromCss-offsetY);
    el.css('left', leftFromCss-offsetX);
  },
  
  /**
   * @function
   * @description This method makes a SOAP call to retrieve the exchange rate and converted USD amount
   * @param (string) The currency code
   * @param (number) The base amount to convert to USD
   * @param (date) Exchange rate of this date would be used to calculate the amount. To get the current exchange rate pass empty string.
   * @param (function) The callback function will be passed the parameter {exchangeRate:XXX, usdAmount:XXX}
   * or null if there was an error.
   */
  calculateUSDAmount : function(currencyCode, amount, exchangeDate, callback) {
    var soapReq = window.c20g.Soap.jsonToSOAPRequest({CurrencyCode:currencyCode, CurrencyAmount:amount, ExchangeDate:exchangeDate}, "GetCurrencyInUSDBPM ",
        "http://cordys.com/c20gEC/BPM_Utilities/1.0", "http://cordys.com/c20gEC/Utilities/GetCurrencyInUSDBPM");
    SOAPClient.Proxy = window.c20g.URL.getGatewayUrl();
    SOAPClient.SendRequest(soapReq, function(respObj){
      if(!window.c20g.Soap.isResponseValid(respObj)){ callback(null); }
      var response = respObj.Body[0].GetCurrencyInUSDBPMResponse[0].GetCurrencyInUSDResponse[0];
      var result = {exchangeRate : response.ExchangeRate[0].Text,
                    usdAmount    : response.AmountInUSD[0].Text };
      callback(result);
    });
  },

 /**
  * @function
  * @description Color codes the channel header depending on the current state of the selection stored in session.
  * @param {boolean} useDefault Uses the default coloring with the bank text font.
  */
  colorCodeChannel : function(useDefault){
    if(window.c20g.Util.isFirmUser() || useDefault){
      $('.cHeader h2').css('color', '#222');
    } else {
      var status = window.c20g.Session.selectionDetail.statusId;
      var dclass = status === '1' ? 'created' :
                   status === '2' ? 'eoi' :
                   status === '3' ? 'rfp' :
                   status === '4' ? 'evaluation' :
                   status === '5' ? 'award' :
                   status === '6' ? 'postselection' :
                   status === '7' ? 'complete' : '';
      $('.channel').attr('class', 'channel '+dclass);
    }
  },

  /**
   * @function
   * @description Calculates the file size in KB and returns a string with the KB appended.
   * @param (number) size The size of the file in bytes.
   * @returns {string} The display value of the size in KB.
   */
  calcFileSize : function(size){
    return Math.ceil(size/1000)+' KB';
  },

  showLoading : function(){
    var left=document.documentElement.clientWidth/2 - 75;
    var top=document.documentElement.clientHeight/2 - 60;
    $('#loading').css({
      'left' : left+'px',
      'top' : top+'px'
    }).show();
    $('.buttonset').children("input[type=button]").attr('disabled','disabled');
  },

  hideLoading : function(){
    $('#loading').hide();
    $('.buttonset').children("input[type=button]").attr('disabled','');
  }
};

/**
* @namespace Container Log object. Will hold the methods that will be used for client side logging.<br/>
*/
window.c20g.Log = {

 /**
  * @property {string} level
  * @description Defines the client side logging level. Only logging calls of equal to or greater severity are logged to the server. All others are ignored.
  */
  level : 'warn', //TODO: tokenize

 /**
  * @class Object containing the logging levels.
  * @property {number} debug Value = 1;
  * @property {number} info Value = 2;
  * @property {number} warn Value = 3;
  * @property {number} error Value = 4;
  * @property {number} fatal Value = 5;
  */
  levelList : {
    debug : 1,
    info : 2,
    warn : 3,
    error : 4,
    fatal : 5
  },

 /**
  * @function
  * @description Logs a message to the server under the debug level.
  * @param {string} message The message that will be logged under the debug level.
  */
  debug : function(message){
    window.c20g.Log.log('debug', message);
  },

 /**
  * @function
  * @description Logs a message to the server under the info level.
  * @param {string} message The message that will be logged under the info level.
  */
  info : function(message){
    window.c20g.Log.log('info', message);
  },

 /**
  * @function
  * @description Logs a message to the server under the warn level.
  * @param {string} message The message that will be logged under the warn level.
  */
  warn : function(message){
    window.c20g.Log.log('warn', message);
  },

 /**
  * @function
  * @description Logs a message to the server under the error level.
  * @param {string} message The message that will be logged under the error level.
  */
  error : function(message){
    window.c20g.Log.log('error', message);
  },

 /**
  * @function
  * @description Logs a message to the server under the fatal level.
  * @param {string} message The message that will be logged under the fatal level.
  */
  fatal : function(message){
    window.c20g.Log.log('fatal', message);
  },

 /**
  * @function
  * @description Sends a soap request to the server passing the log level and the message to be logged.
  * @param {string} severity The severity at which the message should be logged. Should be one of 'debug', 'info', 'warn', 'error', 'fatal'.
  * @param {string} message The message that will be logged.
  */
  log : function(severity, message){
    var defLevelIdx = window.c20g.Log.levelList[window.c20g.Log.level];
    var levelIdx = window.c20g.Log.levelList[severity];

    if(levelIdx >= defLevelIdx){
      var soapParams = [
        {name : 'severity', value : severity},
        {name : 'message', value : message} ];
      
      var sr = window.c20g.Soap.constructSimpleSOAPRequest("log", "http://cordys.com/c20gEC/SRV_Logger/1.0", soapParams);
      SOAPClient.Proxy = window.c20g.URL.getGatewayProxy();
      SOAPClient.SendRequest(sr);
    }
  }
};

/**
* @namespace Container Tooltip object. Will hold the properties and functions that relate to Tooltips. <br/>
*/
window.c20g.Tooltip = {
  
 /**
  * @function
  * @description This method will retrieve all tooltip on the current page, append the info message to each and set the tooltip behavior on mouse over.
  *   For this to work, all tooptips must already be loaded on the page and stored with the hidden div 'tooltipholder'. The index.html pages handles this
  *   initialization.
  * @param The context of the tooltips to initialize.
  */
  initialize : function(context){
    var imgURL = window.c20g.URL.isURLProtected() ? '<img src="../img/tooltip.png">' : '<img src="./img/tooltip.png">';
    $('.tooltip', context).html(imgURL).each(function(){
      var refid = $(this).attr('refid');
      $(this).attr('rel', '#'+refid).cluetip({
        arrows: false,
        cluetipClass: 'rounded',
        dropShadow: false,
        local: true
      });
    });
  }

};


window.c20g.PageHelp = {
 /**
  * @function
  * @description This method will open a new window with the help requested  
  * @param The context of the help to show.
  */
  attachHelp : function(context){
    $('.pagehelp', context).click(function(){
      var refid = $(this).attr('refid');
      window.open("../pagehelp.html#" + refid, null, "height=800,width=800,scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no,location=no");
    });
  }
};


window.c20g.UploadConnection = {
 /**
  * @function
  * @description Alert the user if the connection is lost during or before uploading begins. Error will appear in div with id='error_uploadError'. Div must have value of whatever is being uploaded. Example: &lt;div class="infobigred" id="error_uploadError" value="Proposal"/&gt;
  */
  detect: function(){
    if(window.c20g.UploadConnection.ping.on === false){
	  window.c20g.UploadConnection.ping.on = true;
	  $('.form').ajaxError(function(event, request, settings,exception) {
		if(request.status === 12029 || request.status !== 405){
			window.c20g.Form.clearValidationMessage('uploadError');
			window.c20g.Form.showValidationMessage('uploadError', 'validation.uploadFailed',[$('#error_uploadError').val()]);
			window.c20g.Util.hideLoading();
		}
	  });
	  var req = function () {
		$.ajax({
		    type: 'GET',
			url : window.c20g.URL.getGatewayProxy(),
			complete : function () {
			   if(window.c20g.UploadConnection.ping.on ===true){
					setTimeout(function () {
						req();
					}, 5000);
				}
			}
		});
	   };
	  req(); 
	} 
},
 /**
  * @function
  * @description Stop trying to detect internet connection. 
  */
  stop: function(){
	window.c20g.UploadConnection.ping.on = false;
  },
/**
  * @class Object defining the attributes value of the current active ping to check upload connection. <br/>
  * @property {boolean} on The indicator of whether or not the ajax call is switched on or off.
  */
  ping : {
    on: false
  }
};
