package com.c20g.cordys.ac.rolemgmt;

import java.util.ArrayList;
import java.util.List;

import com.c20g.cordys.ac.rolemgmt.command.CreateDynamicRoleStructure;
import com.eibus.soap.ApplicationConnector;
import com.eibus.soap.ApplicationTransaction;
import com.eibus.soap.Processor;
import com.eibus.soap.SOAPTransaction;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;

public class DynamicRoleMgmtConnector extends ApplicationConnector {
	
	private static CordysLogger LOGGER = CordysLogger.getCordysLogger(DynamicRoleMgmtConnector.class);
	
	private static String CONNECTOR_NAME = "Dynamic Role Connector";

	private DynamicRoleMgmtConfiguration configuration = null;
	
	int processorConfigNode = 0;
	
	public void open(Processor processor) {
		LOGGER.log(Severity.INFO, "Opening " + CONNECTOR_NAME);
		
		// load the configuration
		int configNode = processor.getProcessorConfigurationNode();
		LOGGER.log(Severity.DEBUG, "Configuration: " + Node.writeToString(configNode, true));
		
		try {
			configuration = DynamicRoleMgmtConfiguration.getConfiguration(getConfiguration());
			
			// make sure everything is set up correctly
			validateConfiguration();
			
		} catch (Exception e) {
			throw new IllegalStateException("Error loading / validating configuration for " + CONNECTOR_NAME, e);
		}
		
		LOGGER.log(Severity.INFO, CONNECTOR_NAME + " opened");

	}
	
	public void close(Processor processor) {
		LOGGER.log(Severity.INFO, "Closing " + CONNECTOR_NAME);
	}
	
	public void reset(Processor processor) {
		LOGGER.log(Severity.INFO, "Resetting " + CONNECTOR_NAME);
	}
	
	public ApplicationTransaction createTransaction(SOAPTransaction transaction) {
		return new DynamicRoleMgmtTransaction(configuration);
	}
	
	private void validateConfiguration() throws Exception {
		LOGGER.log(Severity.DEBUG, "Validating configuration for " + CONNECTOR_NAME);
		LOGGER.log(Severity.DEBUG, this.configuration.toString());
		
		CreateDynamicRoleStructure.execute(configuration);
		
		LOGGER.log(Severity.DEBUG, "Configuration validated");
	}
	
}
