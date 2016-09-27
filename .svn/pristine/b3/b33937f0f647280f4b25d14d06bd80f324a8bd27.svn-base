package com.c20g.cordys.ac.jackrabbit.connector;

import java.util.HashMap;

import javax.jcr.RepositoryException;
import javax.xml.namespace.QName;

import com.c20g.cordys.ac.jackrabbit.exception.JackrabbitException;
import com.c20g.cordys.ac.jackrabbit.messages.Messages;
import com.c20g.cordys.ac.jackrabbit.repository.DocumentSystem;
import com.c20g.cordys.ac.jackrabbit.repository.Workspace;
import com.eibus.connector.nom.Connector;
import com.eibus.soap.ApplicationTransaction;
import com.eibus.soap.BodyBlock;
import com.eibus.soap.fault.Fault;
import com.eibus.soap.fault.FaultDetail;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;

public class JackrabbitTransaction implements ApplicationTransaction {
	
	private static CordysLogger logger = CordysLogger.getCordysLogger(JackrabbitTransaction.class);
	private static final String SERVICE_TYPE = "JACKRABBIT";
	private HashMap<String, String> hmSeviceTypes;
	private JackrabbitConnector acAppConnector;

	/**
	 * Creates the transaction object.
	 * 
	 * @param acAppConnector
	 *            The application connector object.
	 * @param acConfig
	 *            The configuration of the application connector.
	 * @param cConnector
	 *            The connector to use to send messages to Cordys.
	 */
	public JackrabbitTransaction(JackrabbitConnector acAppConnector, JackrabbitConfiguration acConfig,
			Connector cConnector) {
		this.acAppConnector = acAppConnector;

		hmSeviceTypes = new HashMap<String, String>();
		hmSeviceTypes.put(SERVICE_TYPE, SERVICE_TYPE);

		if (logger.isDebugEnabled()) {
			logger.debug("Transaction created.");
		}
	}

	/**
	 * This will be called when a transaction is being aborted
	 */
	public void abort() {
		if (logger.isInfoEnabled()) {
			logger.info(Messages.TRANSACTION_ABORT);
		}
	}

	/**
	 * This method returns returns if this transaction can process requests of
	 * the given type.
	 * 
	 * @param sType
	 *            The type of message that needs to be processed
	 * 
	 * @return true if the type can be processed. Otherwise false.
	 */
	public boolean canProcess(String sType) {
		boolean bReturn = false;

		if (hmSeviceTypes.containsKey(sType)) {
			bReturn = true;
		}
		return bReturn;
	}

	/**
	 * This method is called when the transaction is committed
	 */
	public void commit() {
		if (logger.isInfoEnabled()) {
			logger.info(Messages.TRANSACTION_COMMIT);
		}
	}

	/**
	 * This method processes the received request.
	 * 
	 * @param bbRequest
	 *            The request-bodyblock.
	 * @param bbResponse
	 *            The response-bodyblock.
	 * 
	 * @return true if the connector has to send the response. If someone else
	 *         sends the response false is returned.
	 */
	public boolean process(BodyBlock bbRequest, BodyBlock bbResponse) {
		boolean bReturn = true;

		if (logger.isDebugEnabled()) {
			logger.debug("Incoming SOAP request.");
			logger.debug(Node.getRoot(bbRequest.getXMLNode()));
		}

		try {
			logger.debug("Request received...");
			logger.debug("handling request...");
			handleMessage(bbRequest, bbResponse);

		} catch (Throwable e) {
			String sMessage = e.getMessage();
			logger.error(e, Messages.TRANSACTION_ERROR, sMessage);
			if (sMessage == null || sMessage.length() == 0) {
				sMessage = e.getClass().getName();
			}
			Fault fault = bbResponse.createSOAPFault(new QName("Server.Exception"), Messages.TRANSACTION_SOAP_FAULT,
					sMessage);
			FaultDetail detail = fault.getDetail();

			if (e instanceof JackrabbitException) {
				JackrabbitException aec = (JackrabbitException) e;
				detail.addDetailEntry(new QName("detailedmessage"), Messages.TRANSACTION_SOAP_FAULT_DETAIL_ENTRY,
						aec.getMessage());
			}
			detail.addDetailEntry(e);
			if (bbRequest.isAsync()) {
				bbRequest.continueTransaction();
				bReturn = false;
			}
		}

		if (logger.isDebugEnabled()) {
			logger.debug("Returning SOAP response.");
			logger.debug(Node.getRoot(bbResponse.getXMLNode()));
		}

		return bReturn;
	}

	private synchronized void handleMessage(BodyBlock bbRequest, BodyBlock bbResponse) throws JackrabbitException,
			Exception {
		Workspace ws = new Workspace(acAppConnector.getConfigurationObject());

		logger.debug("Handle message...");
		int requestNode = bbRequest.getXMLNode();
		int responseNode = bbResponse.getXMLNode();
		String methodName = Node.getLocalName(requestNode);

		logger.debug(methodName);
		logger.debug(requestNode);

		DocumentSystem ds = new DocumentSystem(ws);

		if ("CreateDocument".equals(methodName) || "CreateDocumentFromPath".equals(methodName)) {
			String folderId = Node.getDataWithDefault(Node.getElement(requestNode, "folderId"), "");
			String fileName = Node.getDataWithDefault(Node.getElement(requestNode, "fileName"), "");
			String title = Node.getDataWithDefault(Node.getElement(requestNode, "title"), "");
			String description = Node.getDataWithDefault(Node.getElement(requestNode, "description"), "");
			String comment = Node.getDataWithDefault(Node.getElement(requestNode, "comment"), "");
			String createdOn = Node.getDataWithDefault(Node.getElement(requestNode, "createdOn"), "");
			String createdBy = Node.getDataWithDefault(Node.getElement(requestNode, "createdBy"), "");
			String lastModified = Node.getDataWithDefault(Node.getElement(requestNode, "lastModified"), "");
			String lastModifiedBy = Node.getDataWithDefault(Node.getElement(requestNode, "lastModifiedBy"), "");
			String documentType = Node.getDataWithDefault(Node.getElement(requestNode, "documentType"), "");

			try {
				if ("CreateDocument".equals(methodName)) {
					String documentContents = Node.getDataWithDefault(Node.getElement(requestNode, "documentContents"),
							"");
					responseNode = ds.createDocument(folderId, fileName, title, description, comment, createdOn,
							createdBy, lastModified, lastModifiedBy, documentType, documentContents, responseNode);
				} else {
					String filePath = Node.getDataWithDefault(Node.getElement(requestNode, "filePath"), "");
					responseNode = ds.createDocumentFromPath(folderId, fileName, title, description, comment,
							createdOn, createdBy, lastModified, lastModifiedBy, documentType, filePath, responseNode);
				}
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("CreateDocumentVersion".equals(methodName)) {
			String fileUUID = Node.getDataWithDefault(Node.getElement(requestNode, "fileUUID"), "");
			String fileName = Node.getDataWithDefault(Node.getElement(requestNode, "fileName"), "");
			String title = Node.getDataWithDefault(Node.getElement(requestNode, "title"), "");
			String description = Node.getDataWithDefault(Node.getElement(requestNode, "description"), "");
			String comment = Node.getDataWithDefault(Node.getElement(requestNode, "comment"), "");
			String lastModified = Node.getDataWithDefault(Node.getElement(requestNode, "lastModified"), "");
			String lastModifiedBy = Node.getDataWithDefault(Node.getElement(requestNode, "lastModifiedBy"), "");
			String documentType = Node.getDataWithDefault(Node.getElement(requestNode, "documentType"), "");
			String documentContents = Node.getDataWithDefault(Node.getElement(requestNode, "documentContents"), "");

			try {
				responseNode = ds.createDocumentVersion(fileUUID, fileName, title, description, comment, lastModified,
						lastModifiedBy, documentType, documentContents, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("CreateFolder".equals(methodName)) {
			String parentFolderId = Node.getDataWithDefault(Node.getElement(requestNode, "parentFolderId"), "");
			String folderName = Node.getDataWithDefault(Node.getElement(requestNode, "folderName"), "");
			String description = Node.getDataWithDefault(Node.getElement(requestNode, "description"), "");
			String createdOn = Node.getDataWithDefault(Node.getElement(requestNode, "createdOn"), "");
			String createdBy = Node.getDataWithDefault(Node.getElement(requestNode, "createdBy"), "");

			try {
				responseNode = ds.createFolder(parentFolderId, folderName, description, createdOn, createdBy,
						responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository", e);
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("GetDocument".equals(methodName)) {
			String uuid = Node.getDataWithDefault(Node.getElement(requestNode, "uuid"), "");

			try {
				responseNode = ds.getDocument(uuid, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("GetDocumentVersion".equals(methodName)) {
			String uuid = Node.getDataWithDefault(Node.getElement(requestNode, "uuid"), "");
			String version = Node.getDataWithDefault(Node.getElement(requestNode, "version"), "");

			try {
				responseNode = ds.getDocumentVersion(uuid, version, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("GetDocumentVersions".equals(methodName)) {
			String uuid = Node.getDataWithDefault(Node.getElement(requestNode, "uuid"), "");

			try {
				responseNode = ds.getDocumentVersions(uuid, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("GetFolderContents".equals(methodName)) {
			String uuid = Node.getDataWithDefault(Node.getElement(requestNode, "uuid"), "");

			try {
				responseNode = ds.getFolderContents(uuid, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("MoveDocument".equals(methodName)) {
			String uuid = Node.getDataWithDefault(Node.getElement(requestNode, "uuid"), "");
			String targetUUID = Node.getDataWithDefault(Node.getElement(requestNode, "targetUUID"), "");

			try {
				responseNode = ds.moveDocument(uuid, targetUUID, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("DeleteContent".equals(methodName)) {
			String uuid = Node.getDataWithDefault(Node.getElement(requestNode, "uuid"), "");
			try {
				responseNode = ds.deleteContent(uuid, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Errored with incoming UUID: " + uuid);
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("DoesFolderExist".equals(methodName)) {
			String pathFromRoot = Node.getDataWithDefault(Node.getElement(requestNode, "pathFromRoot"), "");

			try {
				responseNode = ds.doesFolderExist(pathFromRoot, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("GetFolder".equals(methodName)) {
			String uuid = Node.getDataWithDefault(Node.getElement(requestNode, "uuid"), "");

			try {
				responseNode = ds.getFolder(uuid, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("GetFolderByPath".equals(methodName)) {
			String pathFromRoot = Node.getDataWithDefault(Node.getElement(requestNode, "pathFromRoot"), "");

			try {
				responseNode = ds.getFolderByPath(pathFromRoot, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("UpdateFolderMetadata".equals(methodName)) {
			String uuid = Node.getDataWithDefault(Node.getElement(requestNode, "uuid"), "");
			String folderName = Node.getDataWithDefault(Node.getElement(requestNode, "folderName"), "");
			String description = Node.getDataWithDefault(Node.getElement(requestNode, "description"), "");

			try {
				responseNode = ds.updateFolderMetadata(uuid, folderName, description, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository", e);
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		} else if ("UpdateDocumentMetadata".equals(methodName)) {
			String uuid = Node.getDataWithDefault(Node.getElement(requestNode, "uuid"), "");
			String fileName = Node.getDataWithDefault(Node.getElement(requestNode, "fileName"), "");
			String title = Node.getDataWithDefault(Node.getElement(requestNode, "title"), "");
			String description = Node.getDataWithDefault(Node.getElement(requestNode, "description"), "");
			String comment = Node.getDataWithDefault(Node.getElement(requestNode, "comment"), "");
			String lastModified = Node.getDataWithDefault(Node.getElement(requestNode, "lastModified"), "");
			String lastModifiedBy = Node.getDataWithDefault(Node.getElement(requestNode, "lastModifiedBy"), "");
			String documentType = Node.getDataWithDefault(Node.getElement(requestNode, "documentType"), "");

			try {
				responseNode = ds.updateDocumentMetadata(uuid, fileName, title, description, comment, lastModified,
						lastModifiedBy, documentType, responseNode);
				logger.debug(responseNode);
			} catch (RepositoryException e) {
				logger.log(Severity.ERROR, e, Messages.GENERAL_ERROR, "Error occured in the repository");
				throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
						"Exception from Jackrabbit Repository", e);
			} finally {
			}
		}
	}

}
