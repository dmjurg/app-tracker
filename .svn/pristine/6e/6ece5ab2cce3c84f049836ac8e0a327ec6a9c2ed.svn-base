window.c20g.ws.template = {
	SampleBPM: function(startInfo, callback) {
		var paramNS = "http://schemas.c20g.com/bpm/sample/1.0";		
		var soapBody = window.c20g.Soap.constructSimpleSOAPBody(
			"SampleBPM", //web service name
			"http://schemas.c20g.com/bpm/sample/1.0", //web service namespace
			[
				{ name : "StartInfo", value : startInfo, ns : paramNS },
			],
			paramNS
		);		
		var sr = new SOAPRequest("SampleBPM", soapBody);
		SOAPClient.Proxy = window.c20g.config.url.getGatewayUrl();
		SOAPClient.SendRequest(sr, function(response) {
			callback(response);
		});
	}	
};