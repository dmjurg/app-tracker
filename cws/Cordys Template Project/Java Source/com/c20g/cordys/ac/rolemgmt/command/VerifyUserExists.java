package com.c20g.cordys.ac.rolemgmt.command;

import java.util.Iterator;

import com.c20g.cordys.ac.rolemgmt.DynamicRoleMgmtConfiguration;
import com.c20g.cordys.ac.rolemgmt.util.NOMResourceManager;
import com.c20g.cordys.ac.rolemgmt.util.Utilities;
import com.eibus.connector.nom.Connector;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;
import com.eibus.xml.xpath.NodeSet;
import com.eibus.xml.xpath.XPath;

public class VerifyUserExists {
	
	private static final CordysLogger LOGGER = CordysLogger.getCordysLogger(VerifyUserExists.class);
	
	public static void execute(int responseNode, String userCN, DynamicRoleMgmtConfiguration configuration) throws Exception {

		// int soapResponse = Node.createElement("VerifyUserExistsResponse", responseNode);
		int soapResponse = responseNode;
		
		Connector conn = Utilities.getConnectorInstance();
		
		// check if the authenticated user exists
        int soapMethod = conn.createSOAPMethod(
                configuration.getAdminUserDN(),
                configuration.getOrganizationDN(), 
                "http://schemas.cordys.com/1.0/ldap", 
                "GetLDAPObject");
        Node.createTextElement("dn", Utilities.getAuthUserDN(userCN, configuration.getAuthUsersDN()), soapMethod);
        
        LOGGER.log(Severity.DEBUG, "Getting LDAP object for " + Utilities.getAuthUserDN(userCN, configuration.getAuthUsersDN()));
        LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
        
        int env = Node.getParent(Node.getParent(soapMethod));
        int response = conn.sendAndWait(env);
        
        LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        
        XPath authUserXPath = XPath.getXPathInstance("//entry");
        NodeSet authUserNodeSet = authUserXPath.selectNodeSet(response);
        if(authUserNodeSet.size() == 0) {
        	
        	LOGGER.log(Severity.INFO, 
        			"Authenticated user " + userCN + " does not exist, so creating " + 
        					Utilities.getAuthUserDN(userCN, configuration.getAuthUsersDN()));
        	
        	// if auth user doesn't exist, create
        	int createAuthUserSoapMethod = conn.createSOAPMethod(
        			configuration.getAdminUserDN(),
        			configuration.getOrganizationDN(),
        			"http://schemas.cordys.com/1.0/ldap",
        			"Update");
        	int tuple = Node.createElement("tuple", createAuthUserSoapMethod);
        	int old = Node.createElement("new", tuple);
        	int entry = Node.createElement("entry", old);
        	Node.setAttribute(entry, "dn", Utilities.getAuthUserDN(userCN, configuration.getAuthUsersDN()));
        	int defaultContext = Node.createElement("defaultcontext", entry);
        	Node.createTextElement("string", configuration.getOrganizationDN(), defaultContext);
        	int userPassword = Node.createElement("userPassword", entry);
        	Node.createTextElement("string", "{MD5}", userPassword);
        	int description = Node.createElement("description", entry);
        	Node.createTextElement("string", userCN, description);
        	int osidentity = Node.createElement("osidentity", entry);
        	Node.createTextElement("string", userCN, osidentity);
        	int cn = Node.createElement("cn", entry);
        	Node.createTextElement("string", userCN, cn);
        	int authenticationtype = Node.createElement("authenticationtype", entry);
        	Node.createTextElement("string", "custom", authenticationtype);
        	int objectclass = Node.createElement("objectclass", entry);
        	Node.createTextElement("string", "top", objectclass);
        	Node.createTextElement("string", "busauthenticationuser", objectclass);
        	
        	LOGGER.log(Severity.DEBUG, "Creating authenticated user");
        	LOGGER.log(Severity.DEBUG, Node.writeToString(createAuthUserSoapMethod, true));
        	
        	int authUserReqEnv = Node.getParent(Node.getParent(createAuthUserSoapMethod));
            int authUserResponse = conn.sendAndWait(authUserReqEnv);
            
            LOGGER.log(Severity.DEBUG, Node.writeToString(authUserResponse, true));
            
            NOMResourceManager.freeNode(authUserResponse);
            NOMResourceManager.freeNode(authUserReqEnv);
            // NOMResourceManager.freeNode(createAuthUserSoapMethod);
        }
        
        NOMResourceManager.freeNode(soapMethod);
        NOMResourceManager.freeNode(env);
        NOMResourceManager.freeNode(response);
        
        // make sure the org user exists
        soapMethod = conn.createSOAPMethod(
        		configuration.getAdminUserDN(),
                configuration.getOrganizationDN(), 
                "http://schemas.cordys.com/1.0/ldap", 
                "GetLDAPObject");
        Node.createTextElement("dn", Utilities.getUserDN(userCN, configuration.getOrganizationDN()), soapMethod);
		
        LOGGER.log(Severity.DEBUG, "Getting LDAP object for " + Utilities.getUserDN(userCN, configuration.getOrganizationDN()));
        LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
        
        env = Node.getParent(Node.getParent(soapMethod));
        response = conn.sendAndWait(env);
        
        LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        
        XPath orgUserXPath = XPath.getXPathInstance("//entry");
        NodeSet orgUserNodeSet = orgUserXPath.selectNodeSet(response);
        if(orgUserNodeSet.size() == 0) {
        	
        	LOGGER.log(Severity.INFO, 
        			"Organization user " + userCN + " does not exist, so creating " + 
        					Utilities.getUserDN(userCN, configuration.getOrganizationDN()));
        	
        	// if org user doesn't exist, create it
        	int createOrgUserSoapMethod = conn.createSOAPMethod(
        			configuration.getAdminUserDN(),
        			configuration.getOrganizationDN(),
        			"http://schemas.cordys.com/1.0/ldap",
        			"Update");
        	int tuple = Node.createElement("tuple", createOrgUserSoapMethod);
        	int newNode = Node.createElement("new", tuple);
        	int entry = Node.createElement("entry", newNode);
        	Node.setAttribute(entry, "dn", Utilities.getUserDN(userCN, configuration.getOrganizationDN()));
        	int authenticationuser = Node.createElement("authenticationuser", entry);
        	Node.createTextElement("string", Utilities.getAuthUserDN(userCN, configuration.getAuthUsersDN()), authenticationuser);
        	int description = Node.createElement("description", entry);
        	Node.createTextElement("string", userCN, description);
        	int cn = Node.createElement("cn", entry);
        	Node.createTextElement("string", userCN, cn);
        	int objectclass = Node.createElement("objectclass", entry);
        	Node.createTextElement("string", "top", objectclass);
        	Node.createTextElement("string", "busorganizationaluser", objectclass);
        	Node.createTextElement("string", "busorganizationalobject", objectclass);
        	int role = Node.createElement("role", entry);
        	Iterator<String> itrRoles = configuration.getDefaultRoles().iterator();
        	while(itrRoles.hasNext()) {
        		String tempRole = itrRoles.next();
        		Node.createTextElement("string", Utilities.getOrgRoleDN(tempRole, configuration.getOrganizationDN()), role);
        	}
        	
        	LOGGER.log(Severity.DEBUG, "Creating organization user");
        	LOGGER.log(Severity.DEBUG, Node.writeToString(createOrgUserSoapMethod, true));
        	
        	int orgUserReqEnv = Node.getParent(Node.getParent(createOrgUserSoapMethod));
            int orgUserResponse = conn.sendAndWait(orgUserReqEnv);
            
            LOGGER.log(Severity.DEBUG, Node.writeToString(orgUserResponse, true));
            
            NOMResourceManager.freeNode(orgUserResponse);
            NOMResourceManager.freeNode(orgUserReqEnv);
            // NOMResourceManager.freeNode(createOrgUserSoapMethod);
        }
        
        Node.createTextElement("userDN", Utilities.getUserDN(userCN, configuration.getOrganizationDN()), soapResponse);
        
	}

}
