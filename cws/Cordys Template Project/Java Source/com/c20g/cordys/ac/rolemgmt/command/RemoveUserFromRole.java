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

public class RemoveUserFromRole {
	
	private static final CordysLogger LOGGER = CordysLogger.getCordysLogger(RemoveUserFromRole.class);
	
	public static void execute(int responseNode, String userCN, String caseID, String roleCode, DynamicRoleMgmtConfiguration configuration) throws Exception {
		
		// int soapResponse = Node.createElement("RemoveUserFromRoleResponse", responseNode);
		int soapResponse = responseNode;
		
		Connector conn = Utilities.getConnectorInstance();
		
		int soapMethod = conn.createSOAPMethod(
                configuration.getAdminUserDN(),
                configuration.getOrganizationDN(), 
                "http://schemas.cordys.com/1.0/ldap", 
                "GetLDAPObject");
		Node.createTextElement("dn", Utilities.getUserDN(userCN, configuration.getOrganizationDN()), soapMethod);
		
		LOGGER.log(Severity.DEBUG, "Getting LDAP object for " + 
				Utilities.getUserDN(userCN, configuration.getOrganizationDN()));
		
		int env = Node.getParent(Node.getParent(soapMethod));
        int response = conn.sendAndWait(env);
        
        LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        
        String roleDN = Utilities.getRoleDN(
        		configuration.getAppRoleShortName(), 
        		caseID, 
        		roleCode, 
        		configuration.getAppPrefix(), 
        		configuration.getOrganizationDN());
        
        LOGGER.log(Severity.DEBUG, "Removing role " + roleDN + " from " + userCN);
        
        XPath orgUserXPath = XPath.getXPathInstance("//entry");
        NodeSet orgUserNodeSet = orgUserXPath.selectNodeSet(response);
        int oldLdapEntry = 0;
        int ldapEntry = 0;
        if(!orgUserNodeSet.hasNext()) {
        	int tempNode = Node.createElement("tempNode", soapResponse);
        	VerifyUserExists.execute(tempNode, userCN, configuration);
        	NOMResourceManager.freeNode(tempNode);
        }

    	int entry = ResultNode.getElementNode(orgUserNodeSet.next());
    	ldapEntry = Node.clone(entry, true);
    	oldLdapEntry = Node.clone(entry, true);

		int ldapChild = Node.getFirstChild(ldapEntry);
		int roleNodeToRemove = 0;
		while(ldapChild != 0) {
			if("role".equals(Node.getName(ldapChild))) {
				int roleChild = Node.getFirstChild(ldapChild);
				while(roleChild != 0) {
					if(roleDN.equals(Node.getData(roleChild))) {
						// NOMResourceManager.freeNode(roleChild);
						roleNodeToRemove = roleChild;
					}
					roleChild = Node.getNextSibling(roleChild);
				}
			}
			ldapChild = Node.getNextSibling(ldapChild);
		}
		
		if(roleNodeToRemove != 0) {
			NOMResourceManager.freeNode(roleNodeToRemove);
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
