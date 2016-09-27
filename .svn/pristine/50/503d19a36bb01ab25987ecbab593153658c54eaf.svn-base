package com.c20g.cordys.ac.rolemgmt.util;

import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;

public class NOMResourceManager {

	private static final CordysLogger LOGGER = CordysLogger.getCordysLogger(NOMResourceManager.class);
	
	public static void freeNode(int node) {
		int tempNodePointer = node;
		try {
			Node.delete(node);
		}
		catch(Exception e) {
			LOGGER.log(Severity.WARN, "Error freeing node -> " + tempNodePointer);
		}
	}
	
}
