package com.c20g.cordys.ac.rolemgmt.command;

import com.c20g.cordys.ac.rolemgmt.DynamicRoleMgmtConfiguration;
import com.c20g.cordys.ac.rolemgmt.util.NOMResourceManager;
import com.c20g.cordys.ac.rolemgmt.util.Utilities;
import com.eibus.connector.nom.Connector;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;
import com.eibus.xml.xpath.NodeSet;
import com.eibus.xml.xpath.ResultNode;
import com.eibus.xml.xpath.XPath;

public class ClearRoleMembers {
	
	private static final CordysLogger LOGGER = CordysLogger.getCordysLogger(ClearRoleMembers.class);
	
	public static void execute(int responseNode, String caseID, String roleCode, DynamicRoleMgmtConfiguration configuration) throws Exception {
		
		// int soapResponse = Node.createElement("ClearRoleMembersResponse", responseNode);
		int soapResponse = responseNode;
		
		Connector conn = Utilities.getConnectorInstance();
		
		LOGGER.log(Severity.DEBUG, "Searching LDAP for users with role " + Utilities.getRoleDN(
						configuration.getAppRoleShortName(), 
						caseID, 
						roleCode, 
						configuration.getAppPrefix(), 
						configuration.getOrganizationDN()));
		
		int soapMethod = conn.createSOAPMethod(
                configuration.getAdminUserDN(),
                configuration.getOrganizationDN(), 
                "http://schemas.cordys.com/1.0/ldap", 
                "SearchLDAP");
		
		Node.createTextElement("dn", "cn=organizational users," + configuration.getOrganizationDN(), soapMethod);
		Node.createTextElement("scope", "1", soapMethod);
		Node.createTextElement("filter", 
				"(role=" + Utilities.getRoleDN(
						configuration.getAppRoleShortName(), 
						caseID, 
						roleCode, 
						configuration.getAppPrefix(), 
						configuration.getOrganizationDN()) + ")", soapMethod);
		
		LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
		
		int env = Node.getParent(Node.getParent(soapMethod));
        int response = conn.sendAndWait(env);
        
        LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        
        XPath orgUserXPath = XPath.getXPathInstance("//entry");
        NodeSet orgUserNodeSet = orgUserXPath.selectNodeSet(response);
        
        LOGGER.log(Severity.DEBUG, "Got " + orgUserNodeSet.size() + " search results");
        
        while(orgUserNodeSet.hasNext()) {
        	int entryNode = ResultNode.getElementNode(orgUserNodeSet.next());
        	// String dn = Node.getAttribute(entryNode, "dn");
        	String cn = Node.getDataWithDefault(Node.getElement(Node.getElement(entryNode, "cn"), "string"), "");
        	int tempNode = Node.createElement("temp", soapResponse);
        	RemoveUserFromRole.execute(responseNode, cn, caseID, roleCode, configuration);
        	NOMResourceManager.freeNode(tempNode);
        }
        
        Node.createTextElement("result", "SUCCESS", soapResponse);
	}

}
