package com.c20g.cordys.ac.jackrabbit.connector;

import com.c20g.cordys.ac.jackrabbit.messages.Messages;
import com.eibus.connector.nom.Connector;
import com.eibus.localization.ILocalizableString;
import com.eibus.management.IManagedComponent;
import com.eibus.soap.ApplicationConnector;
import com.eibus.soap.ApplicationTransaction;
import com.eibus.soap.Processor;
import com.eibus.soap.SOAPTransaction;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;

public class JackrabbitConnector extends ApplicationConnector {
	
	/**
	 * Contains the logger instance.
	 */
	private static CordysLogger logger = CordysLogger.getCordysLogger(JackrabbitConnector.class);
	/**
	 * Holds the name of the connector.
	 */
	private static final String CONNECTOR_NAME = "Jackrabbit Connector";
	/**
	 * Holds the configuration object for this connector.
	 */
	private JackrabbitConfiguration config;
	private Connector connector;

	/**
	 * This method gets called when the processor is started. It reads the
	 * configuration of the processor and creates the connector with the proper
	 * parameters. It will also create a client connection to Cordys.
	 * 
	 * @param pProcessor
	 *            The processor that is started.
	 */
	public void open(Processor pProcessor) {
		try {
			logger.debug("Starting the connector...");

			if (logger.isInfoEnabled()) {
				logger.info(Messages.CONNECTOR_STARTING);
			}

			logger.debug("Initializing configuration...");
			// Get the configuration
			config = new JackrabbitConfiguration(getConfiguration());

			// Open the client connector
			connector = Connector.getInstance(CONNECTOR_NAME);

			if (!connector.isOpen()) {
				connector.open();
			}

			if (logger.isInfoEnabled()) {
				logger.info(Messages.CONNECTOR_STARTED);
			}
			logger.debug("Jackrabbit Connector started...");

		} catch (Exception e) {
			logger.fatal(e, Messages.CONNECTOR_START_EXCEPTION);
			throw new IllegalStateException(e);
		}
	}

	/**
	 * This method gets called when the processor is being stopped.
	 * 
	 * @param pProcessor
	 *            The processor that is being stopped.
	 */
	public void close(Processor pProcessor) {
		try {
			if (logger.isInfoEnabled()) {
				logger.info(Messages.CONNECTOR_STOPPED);
			}
		} catch (Exception e) {
			logger.log(Severity.ERROR, e, Messages.CONNECTOR_STOPPED);
		}
	}

	/**
	 * This method gets called when the processor is ordered to rest.
	 * 
	 * @param processor
	 *            The processor that is to be in reset state
	 */
	public void reset(Processor processor) {
	}

	/**
	 * This method creates the transaction that will handle the requests.
	 * 
	 * @param stTransaction
	 *            The SOAP-transaction containing the message.
	 * 
	 * @return The newly created transaction.
	 */
	public ApplicationTransaction createTransaction(SOAPTransaction stTransaction) {
		return new JackrabbitTransaction(this, config, connector);
	}

	/**
	 * Returns the configuration object.
	 * 
	 * @return The configuration object for this application connector.
	 */
	public JackrabbitConfiguration getConfigurationObject() {
		return config;
	}

	/**
	 * Standard management method. Allows adding custom counters, alert
	 * definitions and problems definitions to this connector. Note that this
	 * method is called by the SOAP processor.
	 * 
	 * @return The JMX managed component created by the super class.
	 */
	protected IManagedComponent createManagedComponent() {
		IManagedComponent mc = super.createManagedComponent();
		return mc;
	}

	/**
	 * Standard management method.
	 * 
	 * @return JMX name for this application connector.
	 */
	protected String getManagementName() {
		return "Jackrabbit Connector";
	}

	/**
	 * Standard management method.
	 * 
	 * @return JMX type for this application connector.
	 */
	protected String getManagedComponentType() {
		return "AppConnector";
	}

	/**
	 * Standard management method.
	 * 
	 * @return JMX description for this application connector.
	 */
	protected ILocalizableString getManagementDescription() {
		return Messages.CONNECTOR_MANAGEMENT_DESCRIPTION;
	}

}
