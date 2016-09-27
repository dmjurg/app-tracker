package com.c20g.cordys.ac.rolemgmt.util;

import java.util.Random;

import com.eibus.connector.nom.Connector;

public class Utilities {
	
	public static String getUserDN(String userCN, String organizationDN) {
		return "cn=" + userCN + ",cn=organizational users," + organizationDN;
	}
	
	public static String getAuthUserDN(String userCN, String authUsersDN) {
		return "cn=" + userCN + "," + authUsersDN; 
	}
	
	public static String getRoleDN(
			String appRoleShortName, String caseID, String roleCode, String appPrefix, String organizationDN) {
		return "cn=" + appRoleShortName + caseID +"_" + roleCode + 
				",cn=" + appRoleShortName + caseID + ",cn=" + appPrefix + 
				",cn=organizational roles," + organizationDN;
	}
	
	public static String getOrgRoleDN(String roleCN, String organizationDN) {
		return "cn="+ roleCN + ",cn=organizational roles," + organizationDN;
	}
	
	public static String getRootRoleTreeDN(String appPrefix, String organizationDN) {
		return "cn=" + appPrefix + ",cn=organizational roles," + organizationDN;
	}
	
	public static String getCaseRoleTreeDN(String caseID, String appRoleShortName, String appPrefix, String organizationDN) {
		return "cn=" + appRoleShortName + caseID + "," + getRootRoleTreeDN(appPrefix, organizationDN);
	}
	
	public static Connector getConnectorInstance() throws Exception {
		Random random = new Random();
		Connector conn = Connector.getInstance("RoleMgmt-Client" + "-" + random.nextInt(100));
		conn.open();
        conn.setDocPerThreadConfig(Connector.USE_MULTI_DOC);
        
		return conn;
	}

}
