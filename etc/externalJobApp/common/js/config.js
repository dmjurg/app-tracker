window.c20g.config = {
	url : {
		gateway_protocol : 'http://',
		gateway_host : 'teamcounterpoint.com',
		// gateway_host : 'localhost',
		// gateway_host : '192.168.1.42',
		gateway_virtual_dir : '/cordys',		
		gateway_path : '/com.eibus.web.soap.Gateway.wcp',		
		app_organization_key : '?organization=',
		// app_organization_dn : 'o%3Dcordys-blank%2Ccn%3Dcordys%2Ccn%3Ddev%2Co%3Dwb.ad.worldbank.org',
		app_organization_dn : 'o%3Dapp-portal%2Ccn%3Dcordys%2Ccn%3Dttw%2Co%3Dworldbank.org',		
		
		getGatewayUrl : function() {
			return [this.getWebServiceUrl(), this.gateway_path, this.app_organization_key, this.app_organization_dn].join('');
		},

		getWebServiceUrl : function() {
			return [this.gateway_protocol, this.gateway_host, this.gateway_virtual_dir].join('');
		},
		
		getOrganizationDn : function () {
			return 'o=app-portal,cn=cordys,cn=ttw,o=worldbank.org';
		},
		
		formFolder: "forms/protected/html",
		tabsFolder: "tabs/html",		
		pickersFolder: "pickers/html",
		viewsFolder: "views/protected/html"

	}
	
};

