package com.c20g.cordys.ac.rolemgmt;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;
import com.eibus.xml.xpath.XPath;

public class DynamicRoleMgmtConfiguration {
	
	private static final CordysLogger LOGGER = CordysLogger.getCordysLogger(DynamicRoleMgmtConfiguration.class);
	
	private String organizationDN;      // o=ttw,cn=cordys,cn=c20g,o=c20g.com
	private String appPrefix;           // cases
	private String appRoleShortName;    // case
	private List<String> defaultRoles;
	private String authUsersDN;         // cn=authenticated users,cn=cordys,cn=c20g,o=c20g.com
	private String adminUserDN;
	private String everyoneInCordysRoleDN; // cn=everyone,cn=Cordys ESBServer,cn=cordys,cn=ttw,o=worldbank.org
	
	public String getOrganizationDN() {
		return organizationDN;
	}
	public void setOrganizationDN(String organizationDN) {
		this.organizationDN = organizationDN;
	}
	
	public String getAppPrefix() {
		return appPrefix;
	}
	public void setAppPrefix(String appPrefix) {
		this.appPrefix = appPrefix;
	}
	
	public String getAppRoleShortName() {
		return appRoleShortName;
	}
	public void setAppRoleShortName(String appRoleShortName) {
		this.appRoleShortName = appRoleShortName;
	}
	
	public List<String> getDefaultRoles() {
		return defaultRoles;
	}
	public void setDefaultRoles(List<String> defaultRoles) {
		this.defaultRoles = defaultRoles;
	}	
	
	public String getAuthUsersDN() {
		return authUsersDN;
	}
	public void setAuthUsersDN(String authUsersDN) {
		this.authUsersDN = authUsersDN;
	}
	
	public String getAdminUserDN() {
		return adminUserDN;
	}
	public void setAdminUserDN(String adminUserDN) {
		this.adminUserDN = adminUserDN;
	}
	
	public String getEveryoneInCordysRoleDN() {
		return everyoneInCordysRoleDN;
	}
	public void setEveryoneInCordysRoleDN(String everyoneInCordysRoleDN) {
		this.everyoneInCordysRoleDN = everyoneInCordysRoleDN;
	}
	
	
	public static DynamicRoleMgmtConfiguration getConfiguration(int configNode) throws Exception {
		
		DynamicRoleMgmtConfiguration config = new DynamicRoleMgmtConfiguration();
		
		LOGGER.log(Severity.DEBUG, "Received configuration: " + Node.writeToString(configNode, true));
		
		int orgDnNode = XPath.getFirstMatch("//organizationDN", null, configNode);
		String orgDn = Node.getData(orgDnNode);
		config.setOrganizationDN(orgDn);
		
		int appPrefixNode = XPath.getFirstMatch("//appPrefix", null, configNode);
		String appPrefix = Node.getData(appPrefixNode);
		config.setAppPrefix(appPrefix);
		
		int appRoleShortNameNode = XPath.getFirstMatch("//appRoleShortName", null, configNode);
		String appRoleShortName = Node.getData(appRoleShortNameNode);
		config.setAppRoleShortName(appRoleShortName);
		
		int defaultRolesNode = XPath.getFirstMatch("//defaultRoles", null, configNode);
		String defaultRoles = Node.getData(defaultRolesNode);
		String[] rolesArray = defaultRoles.split(";");
		List<String> defaultRolesList = new ArrayList<String>();
		for(int i = 0; i < rolesArray.length; i++) {
			defaultRolesList.add(rolesArray[i].trim());
		}
		config.setDefaultRoles(defaultRolesList);
		
		int authUsersDNNode = XPath.getFirstMatch("//authUsersDN", null, configNode);
		String authUsersDN = Node.getData(authUsersDNNode);
		config.setAuthUsersDN(authUsersDN);
		
		int adminUserDNNode = XPath.getFirstMatch("//adminUserDN", null, configNode);
		String adminUserDN = Node.getData(adminUserDNNode);
		config.setAdminUserDN(adminUserDN);
		
		int everyoneInCordysRoleDNNode = XPath.getFirstMatch("//everyoneInCordysRoleDN", null, configNode);
		String everyoneInCordysRoleDN = Node.getData(everyoneInCordysRoleDNNode);
		config.setEveryoneInCordysRoleDN(everyoneInCordysRoleDN);
		
		LOGGER.log(Severity.DEBUG, "Parsed configuration into: " + config.toString());
		
		return config;
	}
	
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("DynamicRoleMgmtConfiguration : { ");
		sb.append("organizationDN -> ").append(organizationDN).append("; ");
		sb.append("appPrefix -> ").append(appPrefix).append("; ");
		sb.append("appRoleShortName -> ").append(appRoleShortName).append("; ");
		sb.append("defaultRoles -> [ ");
		Iterator<String> itrDefaultRoles = defaultRoles.iterator();
		while(itrDefaultRoles.hasNext()) {
			String tempRole = itrDefaultRoles.next();
			sb.append(tempRole);
			if(itrDefaultRoles.hasNext()) {
				sb.append(", ");
			}
		}
		sb.append(" ]; ");
		sb.append("authUsersDN -> ").append(authUsersDN).append("; ");
		sb.append("adminUserDN -> ").append(adminUserDN).append("; ");
		sb.append("everyoneInCordysRoleDN -> ").append(everyoneInCordysRoleDN);
		sb.append(" }");
		return sb.toString();
	}

}