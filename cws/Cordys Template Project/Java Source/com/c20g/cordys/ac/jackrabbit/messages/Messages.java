package com.c20g.cordys.ac.jackrabbit.messages;

import com.eibus.localization.message.Message;
import com.eibus.localization.message.MessageSet;

public class Messages {
	
	public static final MessageSet MESSAGE_SET = MessageSet
			.getMessageSet("feinsuch.jackrabbit.messages");

	/** Problem with Configuration XML */
	public static final Message XML_CONFIG_ISSUE = MESSAGE_SET.getMessage("xmlConfigIssue");

	/** Management description for Jackrabbit Connector */
	public static final Message CONNECTOR_MANAGEMENT_DESCRIPTION = MESSAGE_SET.getMessage("connectorManagementDescription");

	/** Coelib version mismatch. */
	public static final Message COELIB_VERSION_MISMATCH = MESSAGE_SET.getMessage("coelibVersionMismatch");

	/** Starting Jackrabbit Connector connector */
	public static final Message CONNECTOR_STARTING = MESSAGE_SET.getMessage("connectorStarting");

	/** Jackrabbit Connector connector started. */
	public static final Message CONNECTOR_STARTED = MESSAGE_SET.getMessage("connectorStarted");

	/** An error occurred while starting the Jackrabbit Connector connector. */
	public static final Message CONNECTOR_START_EXCEPTION = MESSAGE_SET.getMessage("connectorStartException");

	/** Jackrabbit Connector connector stopped. */
	public static final Message CONNECTOR_STOPPED = MESSAGE_SET.getMessage("connectorStopped");

	/** Resetting Jackrabbit Connector connector */
	public static final Message CONNECTOR_RESET = MESSAGE_SET.getMessage("connectorReset");

	/** Aborted the transaction. */
	public static final Message TRANSACTION_ABORT = MESSAGE_SET.getMessage("transactionAbort");

	/** Committed the transaction. */
	public static final Message TRANSACTION_COMMIT = MESSAGE_SET.getMessage("transactionCommit");

	/** An error occurred while processing the SOAP request: {0} */
	public static final Message TRANSACTION_ERROR = MESSAGE_SET.getMessage("transactionError");

	/** An error occurred while processing the SOAP request: {0} */
	public static final Message TRANSACTION_SOAP_FAULT = MESSAGE_SET.getMessage("transactionSoapFault");

	/** An error occurred while processing the SOAP request: {0} */
	public static final Message TRANSACTION_SOAP_FAULT_DETAIL_ENTRY = MESSAGE_SET.getMessage("transactionSoapFaultDetailEntry");

	/** Error details: {0} */
	public static final Message GENERAL_ERROR = MESSAGE_SET.getMessage("generalError");

}
