package com.c20g.cordys.ac.rolemgmt.command;

import com.c20g.cordys.ac.rolemgmt.DynamicRoleMgmtConfiguration;
import com.c20g.cordys.ac.rolemgmt.util.NOMResourceManager;
import com.c20g.cordys.ac.rolemgmt.util.Utilities;
import com.eibus.connector.nom.Connector;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;
import com.eibus.xml.xpath.NodeSet;
import com.eibus.xml.xpath.XPath;

public class VerifyRoleExists {
	
	private static final CordysLogger LOGGER = CordysLogger.getCordysLogger(VerifyRoleExists.class);
	
	public static void execute(int responseNode, String caseID, String roleCode, DynamicRoleMgmtConfiguration configuration) throws Exception {
		
		// int soapResponse = Node.createElement("VerifyRoleExistsResponse", responseNode);
		int soapResponse = responseNode;
		
		// make sure the parent for this "case" exists
		String parentRoleDN = Utilities.getCaseRoleTreeDN(
				caseID, 
				configuration.getAppRoleShortName(), 
				configuration.getAppPrefix(), 
				configuration.getOrganizationDN());
		
		Connector conn = Utilities.getConnectorInstance();
		
		int soapMethod = conn.createSOAPMethod(
                configuration.getAdminUserDN(),
                configuration.getOrganizationDN(), 
                "http://schemas.cordys.com/1.0/ldap", 
                "GetLDAPObject");
		Node.createTextElement("dn", parentRoleDN, soapMethod);
		
		LOGGER.log(Severity.DEBUG, "Getting LDAP object for " + parentRoleDN);
		LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
		
		int env = Node.getParent(Node.getParent(soapMethod));
        int response = conn.sendAndWait(env);
        
        LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        
        XPath parentRoleXPath = XPath.getXPathInstance("//entry");
        NodeSet parentRoleNodeSet = parentRoleXPath.selectNodeSet(response);

        if(!parentRoleNodeSet.hasNext()) {
        	
        	LOGGER.log(Severity.INFO, "Parent role " + parentRoleDN + " does not exist, so creating");
        	
        	NOMResourceManager.freeNode(response);
        	NOMResourceManager.freeNode(env);
        	// NOMResourceManager.freeNode(soapMethod);
        	
        	soapMethod = conn.createSOAPMethod(
                    configuration.getAdminUserDN(),
                    configuration.getOrganizationDN(), 
                    "http://schemas.cordys.com/1.0/ldap", 
                    "Update");
        	int tuple = Node.createElement("tuple", soapMethod);
        	int newNode = Node.createElement("new", tuple);
        	int entry = Node.createElement("entry", newNode);
        	Node.setAttribute(entry, "dn", parentRoleDN);
        	int busOrgRoleType = Node.createElement("busorganizationalroletype", entry);
        	Node.createTextElement("string", "Internal", busOrgRoleType);
        	int description = Node.createElement("description", entry);
        	Node.createTextElement("string", configuration.getAppPrefix(), description);
        	int role = Node.createElement("role", entry);
        	Node.createTextElement("string", configuration.getEveryoneInCordysRoleDN(), role);
        	int cn = Node.createElement("cn", entry);
        	String cnString = configuration.getAppRoleShortName() + caseID;
        	Node.createTextElement("string", cnString, cn);
        	int objectclass = Node.createElement("objectclass", entry);
        	Node.createTextElement("string", "top", objectclass);
        	Node.createTextElement("string", "busorganizationalrole", objectclass);
        	Node.createTextElement("string", "busorganizationalobject", objectclass);
        	
        	LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
        	
        	env = Node.getParent(Node.getParent(soapMethod));
            response = conn.sendAndWait(env);
            
            LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        }
		
		// make sure the actual role exists
		String roleDN = Utilities.getRoleDN(
				configuration.getAppRoleShortName(), 
				caseID, 
				roleCode, 
				configuration.getAppPrefix(), 
				configuration.getOrganizationDN());
		
		LOGGER.debug("Getting LDAP object for " + roleDN);
		
		NOMResourceManager.freeNode(response);
		NOMResourceManager.freeNode(env);
		// NOMResourceManager.freeNode(soapMethod);
    	
    	soapMethod = conn.createSOAPMethod(
                configuration.getAdminUserDN(),
                configuration.getOrganizationDN(), 
                "http://schemas.cordys.com/1.0/ldap", 
                "GetLDAPObject");
		Node.createTextElement("dn", roleDN, soapMethod);
    	
		LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
		
		env = Node.getParent(Node.getParent(soapMethod));
        response = conn.sendAndWait(env);
        
        LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        
        XPath roleXPath = XPath.getXPathInstance("//entry");
        NodeSet roleNodeSet = roleXPath.selectNodeSet(response);
        
        if(!roleNodeSet.hasNext()) {
        	
        	LOGGER.log(Severity.INFO, "Role " + roleDN + " doesn't exist, so creating");
        	
        	NOMResourceManager.freeNode(response);
        	NOMResourceManager.freeNode(env);
        	// NOMResourceManager.freeNode(soapMethod);
        	
        	soapMethod = conn.createSOAPMethod(
                    configuration.getAdminUserDN(),
                    configuration.getOrganizationDN(), 
                    "http://schemas.cordys.com/1.0/ldap", 
                    "Update");
        	int tuple = Node.createElement("tuple", soapMethod);
        	int newNode = Node.createElement("new", tuple);
        	int entry = Node.createElement("entry", newNode);
        	Node.setAttribute(entry, "dn", roleDN);
        	int busOrgRoleType = Node.createElement("busorganizationalroletype", entry);
        	Node.createTextElement("string", "Internal", busOrgRoleType);
        	int description = Node.createElement("description", entry);
        	Node.createTextElement("string", configuration.getAppPrefix(), description);
        	int role = Node.createElement("role", entry);
        	Node.createTextElement("string", configuration.getEveryoneInCordysRoleDN(), role);
        	int cn = Node.createElement("cn", entry);
        	String cnString = configuration.getAppRoleShortName() + caseID + "_" + roleCode;
        	Node.createTextElement("string", cnString, cn);
        	int objectclass = Node.createElement("objectclass", entry);
        	Node.createTextElement("string", "top", objectclass);
        	Node.createTextElement("string", "busorganizationalrole", objectclass);
        	Node.createTextElement("string", "busorganizationalobject", objectclass);
        	
        	LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
        	
        	env = Node.getParent(Node.getParent(soapMethod));
            response = conn.sendAndWait(env);
            
            LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        }
        
        Node.createTextElement("roleDN", roleDN, soapResponse);
	}

}
