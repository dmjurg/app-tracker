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
import com.eibus.xml.xpath.ResultNode;
import com.eibus.xml.xpath.XPath;

public class AddUserToRole {
	
	private static final CordysLogger LOGGER = CordysLogger.getCordysLogger(AddUserToRole.class);
	
	public static void execute(int responseNode, String userCN, String caseID, String roleCode, DynamicRoleMgmtConfiguration configuration) throws Exception {
		
//		int soapResponse = Node.createElement("AddUserToRoleResponse", responseNode);
		int soapResponse = responseNode;
		
		Connector conn = Utilities.getConnectorInstance();
		
		int soapMethod = conn.createSOAPMethod(
                configuration.getAdminUserDN(),
                configuration.getOrganizationDN(), 
                "http://schemas.cordys.com/1.0/ldap", 
                "GetLDAPObject");
		Node.createTextElement(
				"dn", 
				Utilities.getUserDN(userCN, configuration.getOrganizationDN()), soapMethod);
		
		LOGGER.log(Severity.DEBUG, "Getting LDAP object for " + 
				Utilities.getUserDN(userCN, configuration.getOrganizationDN()));
		LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
		
		int env = Node.getParent(Node.getParent(soapMethod));
        int response = conn.sendAndWait(env);
        
        LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        
        int entry = 0;
        XPath orgUserXPath = XPath.getXPathInstance("//entry");
        NodeSet orgUserNodeSet = orgUserXPath.selectNodeSet(response);
        int oldLdapEntry = 0;
        int ldapEntry = 0;
        if(!orgUserNodeSet.hasNext()) {
        	int tempNode = Node.createElement("tempNode", soapResponse);
        	VerifyUserExists.execute(tempNode, userCN, configuration);
        	
        	NOMResourceManager.freeNode(tempNode);
        	NOMResourceManager.freeNode(response);
            NOMResourceManager.freeNode(env);
            // NOMResourceManager.freeNode(soapMethod);
            
            soapMethod = conn.createSOAPMethod(
                    configuration.getAdminUserDN(),
                    configuration.getOrganizationDN(), 
                    "http://schemas.cordys.com/1.0/ldap", 
                    "GetLDAPObject");
    		Node.createTextElement(
    				"dn", 
    				Utilities.getUserDN(userCN, configuration.getOrganizationDN()), soapMethod);
    		
    		LOGGER.log(Severity.DEBUG, "Getting LDAP object for " + 
    				Utilities.getUserDN(userCN, configuration.getOrganizationDN()));
    		LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
    		
    		env = Node.getParent(Node.getParent(soapMethod));
            response = conn.sendAndWait(env);
            
            LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
            
            orgUserXPath = XPath.getXPathInstance("//entry");
            orgUserNodeSet = orgUserXPath.selectNodeSet(response);
        }
    
    	entry = ResultNode.getElementNode(orgUserNodeSet.next());
    	ldapEntry = Node.clone(entry, true);
    	oldLdapEntry = Node.clone(entry, true);
    
        
        String newRoleDN = Utilities.getRoleDN(
        		configuration.getAppRoleShortName(), 
        		caseID, 
        		roleCode, 
        		configuration.getAppPrefix(), 
        		configuration.getOrganizationDN());
        
        int tempNode = Node.createElement("tempNode2", soapResponse);
        VerifyRoleExists.execute(tempNode, caseID, roleCode, configuration);
        NOMResourceManager.freeNode(tempNode);
        
        LOGGER.log(Severity.DEBUG, "Adding role " + newRoleDN + " to user " + userCN);
        
        int entryChild = Node.getFirstChild(ldapEntry);
        boolean foundRoles = false;
        while(entryChild != 0) {
        	if("role".equals(Node.getName(entryChild))) {
        		LOGGER.log(Severity.DEBUG, "Role node already exists");
        		foundRoles = true;
        		boolean alreadyHasRole = false;
        		int roleChild = Node.getFirstChild(entryChild);
        		while(roleChild != 0) {
        			LOGGER.log(Severity.DEBUG, "Found role: " + Node.getData(roleChild));
        			if(newRoleDN.equals(Node.getData(roleChild))) {
        				alreadyHasRole = true;
        				LOGGER.log(Severity.DEBUG, "User already has role");
        			}
        			roleChild = Node.getNextSibling(roleChild);
        		}
        		if(!alreadyHasRole) {
        			Node.createTextElement("string", newRoleDN, entryChild);
        			LOGGER.log(Severity.DEBUG, "User does not have role, so adding");
        		}
        	}
        	entryChild = Node.getNextSibling(entryChild);
        }
        if(!foundRoles) {
        	LOGGER.log(Severity.DEBUG, "Could not find role node in existing object, so adding");
        	int newRoles = Node.createElement("role", ldapEntry);
        	Node.createTextElement("string", newRoleDN, newRoles);
        	Iterator<String> itrDefaultRoles = configuration.getDefaultRoles().iterator();
        	while(itrDefaultRoles.hasNext()) {
        		String tempRole = itrDefaultRoles.next();
        		Node.createTextElement("string", tempRole, newRoles);
        	}
        }
        
        NOMResourceManager.freeNode(response);
        NOMResourceManager.freeNode(env);
        // NOMResourceManager.freeNode(soapMethod);
        
        soapMethod = conn.createSOAPMethod(
                configuration.getAdminUserDN(),
                configuration.getOrganizationDN(), 
                "http://schemas.cordys.com/1.0/ldap", 
                "Update");
		int tupleNode = Node.createElement("tuple", soapMethod);
		int tupleOld = Node.createElement("old", tupleNode);
		int tupleNew = Node.createElement("new", tupleNode);
		Node.appendToChildren(oldLdapEntry, tupleOld);
		Node.appendToChildren(ldapEntry, tupleNew);
		
		LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
		
		env = Node.getParent(Node.getParent(soapMethod));
        response = conn.sendAndWait(env);
        
        LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        
        NOMResourceManager.freeNode(response);
        NOMResourceManager.freeNode(env);
        // NOMResourceManager.freeNode(soapMethod);
        
		Node.createTextElement("result", "SUCCESS", soapResponse);
	}

}
