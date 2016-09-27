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

public class CreateDynamicRoleStructure {
	
	private static final CordysLogger LOGGER = CordysLogger.getCordysLogger(CreateDynamicRoleStructure.class);
	
	public static void execute(DynamicRoleMgmtConfiguration configuration) throws Exception {
		String roleRootDN = Utilities.getRootRoleTreeDN(configuration.getAppPrefix(), configuration.getOrganizationDN());
		Connector conn = Utilities.getConnectorInstance();
		
		LOGGER.log(Severity.INFO, "Creating dynamic role structure under " + roleRootDN);
		
		int soapMethod = conn.createSOAPMethod(
                configuration.getAdminUserDN(),
                configuration.getOrganizationDN(), 
                "http://schemas.cordys.com/1.0/ldap", 
                "GetLDAPObject");
		Node.createTextElement("dn", roleRootDN, soapMethod);
		
		int env = Node.getParent(Node.getParent(soapMethod));
        int response = conn.sendAndWait(env);
        
        LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
        
        XPath rootRoleXPath = XPath.getXPathInstance("//entry");
        NodeSet rootRoleNodeSet = rootRoleXPath.selectNodeSet(response);

        if(!rootRoleNodeSet.hasNext()) {
        	
        	LOGGER.log(Severity.INFO, "Dynamic role root not found; initializing role structure");
        	
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
        	Node.setAttribute(entry, "dn", roleRootDN);
        	int busOrgRoleType = Node.createElement("busorganizationalroletype", entry);
        	Node.createTextElement("string", "Internal", busOrgRoleType);
        	int description = Node.createElement("description", entry);
        	Node.createTextElement("string", configuration.getAppPrefix(), description);
        	int role = Node.createElement("role", entry);
        	Node.createTextElement("string", configuration.getEveryoneInCordysRoleDN(), role);
        	int cn = Node.createElement("cn", entry);
        	Node.createTextElement("string", configuration.getAppPrefix(), cn);
        	int objectclass = Node.createElement("objectclass", entry);
        	Node.createTextElement("string", "top", objectclass);
        	Node.createTextElement("string", "busorganizationalrole", objectclass);
        	Node.createTextElement("string", "busorganizationalobject", objectclass);
        	
        	LOGGER.log(Severity.DEBUG, Node.writeToString(soapMethod, true));
        	
        	env = Node.getParent(Node.getParent(soapMethod));
            response = conn.sendAndWait(env);
        	
            LOGGER.log(Severity.DEBUG, Node.writeToString(response, true));
            
            NOMResourceManager.freeNode(env);
            NOMResourceManager.freeNode(response);
        }
	}

}
