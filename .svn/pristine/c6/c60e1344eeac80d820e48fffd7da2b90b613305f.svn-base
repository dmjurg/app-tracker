package com.c20g.cordys.ac.rolemgmt.command;

import com.c20g.cordys.ac.rolemgmt.DynamicRoleMgmtConfiguration;
import com.c20g.cordys.ac.rolemgmt.util.Utilities;
import com.eibus.connector.nom.Connector;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;
import com.eibus.xml.xpath.NodeSet;
import com.eibus.xml.xpath.ResultNode;
import com.eibus.xml.xpath.XPath;

public class GetRoleActors {
	
	private static final CordysLogger LOGGER = CordysLogger.getCordysLogger(GetRoleActors.class);
	
	public static void execute(int responseNode, String caseID, String roleCode, DynamicRoleMgmtConfiguration configuration) throws Exception {
		
		// int soapResponse = Node.createElement("GetRoleActorsResponse", responseNode);
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
        
        int actors = Node.createElement("actors", soapResponse);
        XPath orgUserXPath = XPath.getXPathInstance("//entry");
        NodeSet orgUserNodeSet = orgUserXPath.selectNodeSet(response);
        
        LOGGER.log(Severity.DEBUG, "Found " + orgUserNodeSet.size() + " search results");
        
        while(orgUserNodeSet.hasNext()) {
        	int entryNode = ResultNode.getElementNode(orgUserNodeSet.next());
        	String orgUserDN = Node.getAttribute(entryNode, "dn");
        	String orgUserDescription = Node.getDataWithDefault(Node.getElement(Node.getElement(entryNode, "description"), "string"), "");
        	String orgUserCN = Node.getDataWithDefault(Node.getElement(Node.getElement(entryNode, "cn"), "string"), "");
        	int actorNode = Node.createElement("actor", actors);
        	Node.setAttribute(actorNode, "dn", orgUserDN);
        	Node.createTextElement("cn", orgUserCN, actorNode);
        	Node.createTextElement("description", orgUserDescription, actorNode);
        }
	}

}
