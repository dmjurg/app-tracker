package com.c20g.cordys.ac.rolemgmt.command;

import com.c20g.cordys.ac.rolemgmt.DynamicRoleMgmtConfiguration;
import com.c20g.cordys.ac.rolemgmt.util.Utilities;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;

public class GetDynamicRoleDN {
	
	private static final CordysLogger LOGGER = CordysLogger.getCordysLogger(GetDynamicRoleDN.class);
	
	public static void execute(int responseNode, String caseID, String roleCode, DynamicRoleMgmtConfiguration configuration) {
		//int response = Node.createElement("GetDynamicRoleDNResponse", responseNode);
		int response = responseNode;
		String roleDN = Utilities.getRoleDN(
				configuration.getAppRoleShortName(), 
				caseID, 
				roleCode, 
				configuration.getAppPrefix(), 
				configuration.getOrganizationDN());
		LOGGER.log(Severity.DEBUG, "DN for case " + caseID + ", role " + roleCode + " is " + roleDN);
		Node.createTextElement("roleDN", roleDN, response);
	}

}
