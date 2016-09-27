package com.c20g.cordys.ac.rolemgmt;

import java.util.HashSet;
import java.util.Set;

import com.c20g.cordys.ac.rolemgmt.command.AddUserToRole;
import com.c20g.cordys.ac.rolemgmt.command.ClearRoleMembers;
import com.c20g.cordys.ac.rolemgmt.command.GetDynamicRoleDN;
import com.c20g.cordys.ac.rolemgmt.command.GetRoleActors;
import com.c20g.cordys.ac.rolemgmt.command.RemoveUserFromRole;
import com.c20g.cordys.ac.rolemgmt.command.VerifyRoleExists;
import com.c20g.cordys.ac.rolemgmt.command.VerifyUserExists;
import com.eibus.soap.ApplicationTransaction;
import com.eibus.soap.BodyBlock;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;

public class DynamicRoleMgmtTransaction implements ApplicationTransaction {
	
	private static CordysLogger LOGGER = CordysLogger.getCordysLogger(DynamicRoleMgmtTransaction.class);
	
	private DynamicRoleMgmtConfiguration configuration;
	
	private static final String SERVICE_TYPE = "DynamicRoleManagement";
	private Set<String> serviceTypes = new HashSet<String>();
	
	public DynamicRoleMgmtTransaction(DynamicRoleMgmtConfiguration config) {
		this.configuration = config;
		serviceTypes.add(SERVICE_TYPE);
		LOGGER.log(Severity.DEBUG, "Transaction created");
	}

	@Override
	public void abort() {
		LOGGER.log(Severity.WARN, "Transaction aborted");
	}

	@Override
	public boolean canProcess(String serviceType) {
		return serviceTypes.contains(serviceType);
	}

	@Override
	public void commit() {
		LOGGER.log(Severity.INFO, "Transaction committed");
	}

	@Override
	public boolean process(BodyBlock requestBlock, BodyBlock responseBlock) {
		boolean success = true;
		
		int requestNode = requestBlock.getXMLNode();
		int responseNode = responseBlock.getXMLNode();
		
		String methodName = Node.getLocalName(requestNode);
		LOGGER.debug("Incoming request for: " + methodName);
		
		try {
			
			if("CreateGreeting".equals(methodName)) {
				String name = null;
				int paramNode = Node.getFirstChild(requestNode);
				while(paramNode != 0) {
					if("name".equals(Node.getName(paramNode))) {
						name = Node.getData(paramNode);
					}
					paramNode = Node.getNextSibling(paramNode);
				}
				
				if(name == null) {
					success = false;
					LOGGER.log(Severity.WARN, "Could not get name value");
				}
				else {
					String greeting = "Hello, " + name;
					int response = Node.createElement("CreateGreetingResponse", responseNode);
					Node.createTextElement("greeting", greeting, response);
				}
			}
			else if("VerifyUserExists".equals(methodName)) {
				// get the user CN from the request
				String userCN = "";
				int paramNode = Node.getFirstChild(requestNode);
				while(paramNode != 0) {
					if("userCN".equals(Node.getName(paramNode))) {
						userCN = Node.getData(paramNode);
					}
					paramNode = Node.getNextSibling(paramNode);
				}
				LOGGER.debug("Verifying existence of user: " + userCN);
				VerifyUserExists.execute(responseNode, userCN, configuration);
			}
			else if("GetDynamicRoleDN".equals(methodName)) {
				// get the request parameters
				String caseID = "";
				String roleCode = "";
				int paramNode = Node.getFirstChild(requestNode);
				while(paramNode != 0) {
					if("caseID".equals(Node.getName(paramNode))) {
						caseID = Node.getData(paramNode);
					}
					else if("roleCode".equals(Node.getName(paramNode))) {
						roleCode = Node.getData(paramNode);
					}
					paramNode = Node.getNextSibling(paramNode);
				}
				LOGGER.debug("Getting role DN for: case -> " + caseID + " / role -> " + roleCode);
				GetDynamicRoleDN.execute(responseNode, caseID, roleCode, configuration);
			}
			else if("VerifyRoleExists".equals(methodName)) {
				// get the request parameters
				String caseID = "";
				String roleCode = "";
				int paramNode = Node.getFirstChild(requestNode);
				while(paramNode != 0) {
					if("caseID".equals(Node.getName(paramNode))) {
						caseID = Node.getData(paramNode);
					}
					else if("roleCode".equals(Node.getName(paramNode))) {
						roleCode = Node.getData(paramNode);
					}
					paramNode = Node.getNextSibling(paramNode);
				}
				LOGGER.debug("Verifying / creating role for: case -> " + caseID + " / role -> " + roleCode);
				VerifyRoleExists.execute(responseNode, caseID, roleCode, configuration);
			}
			else if("AddUserToRole".equals(methodName)) {
				// get the request parameters
				String userCN = "";
				String caseID = "";
				String roleCode = "";
				int paramNode = Node.getFirstChild(requestNode);
				while(paramNode != 0) {
					if("userCN".equals(Node.getName(paramNode))) {
						userCN = Node.getData(paramNode);
					}
					else if("caseID".equals(Node.getName(paramNode))) {
						caseID = Node.getData(paramNode);
					}
					else if("roleCode".equals(Node.getName(paramNode))) {
						roleCode = Node.getData(paramNode);
					}
					paramNode = Node.getNextSibling(paramNode);
				}
				LOGGER.debug("Adding role to user: user -> " + userCN + " / case -> " + caseID + " / role -> " + roleCode);
				AddUserToRole.execute(responseNode, userCN, caseID, roleCode, configuration);
			}
			else if("RemoveUserFromRole".equals(methodName)) {
				// get the request parameters
				String userCN = "";
				String caseID = "";
				String roleCode = "";
				int paramNode = Node.getFirstChild(requestNode);
				while(paramNode != 0) {
					if("userCN".equals(Node.getName(paramNode))) {
						userCN = Node.getData(paramNode);
					}
					else if("caseID".equals(Node.getName(paramNode))) {
						caseID = Node.getData(paramNode);
					}
					else if("roleCode".equals(Node.getName(paramNode))) {
						roleCode = Node.getData(paramNode);
					}
					paramNode = Node.getNextSibling(paramNode);
				}
				LOGGER.debug("Removing role from user: user -> " + userCN + " / case -> " + caseID + " / role -> " + roleCode);
				RemoveUserFromRole.execute(responseNode, userCN, caseID, roleCode, configuration);
			}
			else if("GetRoleActors".equals(methodName)) {
				// get the request parameters
				String caseID = "";
				String roleCode = "";
				int paramNode = Node.getFirstChild(requestNode);
				while(paramNode != 0) {
					if("caseID".equals(Node.getName(paramNode))) {
						caseID = Node.getData(paramNode);
					}
					else if("roleCode".equals(Node.getName(paramNode))) {
						roleCode = Node.getData(paramNode);
					}
					paramNode = Node.getNextSibling(paramNode);
				}
				LOGGER.debug("Getting actors for: case -> " + caseID + " / role -> " + roleCode);
				GetRoleActors.execute(responseNode, caseID, roleCode, configuration);
			}
			else if("ClearRoleMembers".equals(methodName)) {
				// get the request parameters
				String caseID = "";
				String roleCode = "";
				int paramNode = Node.getFirstChild(requestNode);
				while(paramNode != 0) {
					if("caseID".equals(Node.getName(paramNode))) {
						caseID = Node.getData(paramNode);
					}
					else if("roleCode".equals(Node.getName(paramNode))) {
						roleCode = Node.getData(paramNode);
					}
					paramNode = Node.getNextSibling(paramNode);
				}
				LOGGER.debug("Clearing all actors from role: case -> " + caseID + " / role -> " + roleCode);
				ClearRoleMembers.execute(responseNode, caseID, roleCode, configuration);
			}
			else {
				LOGGER.log(Severity.WARN, "Got unknown request type: " + methodName);
				return false;
			}
		}
		catch(Exception e) {
			LOGGER.log(Severity.ERROR, "Error processing request", e);
			success = false;
		}
		
		return success;
	}

}
