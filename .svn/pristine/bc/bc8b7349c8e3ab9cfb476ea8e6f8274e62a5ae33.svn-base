package com.c20g.cordys.ac.jackrabbit.connector;

import com.c20g.cordys.ac.jackrabbit.exception.JackrabbitException;
import com.c20g.cordys.ac.jackrabbit.messages.Messages;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Node;
import com.eibus.xml.xpath.XPath;
import com.eibus.xml.xpath.XPathMetaInfo;

public class JackrabbitConfiguration {
	
	/**
	 * Contains the logger instance.
	 */
	private static CordysLogger logger = CordysLogger.getCordysLogger(JackrabbitConfiguration.class);

	private String connectionURL;
	private String userName;
	private String password;
	private String rootFolder;
	private String namespacePrefix;
	private String namespace;
	private String folderCustomNodetype;
	private String fileCustomNodetype;

	private static final String NS_JACKRABBIT_CONFIG = "http://c20g.com/jackrabbit";

	/**
	 * Creates the constructor.This loads the configuration object and pass it
	 * to XMLProperties for processing.
	 * 
	 * @param iConfigNode
	 *            The xml-node that contains the configuration.
	 */
	public JackrabbitConfiguration(int iConfigNode) throws JackrabbitException {
		if (iConfigNode == 0) {
			throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
					"Configuration not found");
		}

		if (logger.isDebugEnabled()) {
			logger.debug("The current configuration:\n" + Node.writeToString(iConfigNode, false));
		}

		if (!Node.getName(iConfigNode).equals("configuration")) {
			throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
					"Root-tag of the configuration should be <configuration>");
		}

		try {
			buildObject(iConfigNode);
		} catch (Exception e) {
			logger.log(Severity.ERROR, e, Messages.XML_CONFIG_ISSUE);
			throw new JackrabbitException(JackrabbitException.EC_CONFIGURATION,
					"Exception while creating the configuration-object.", e);
		}
	}
	
	/**
	 * A constructor for local testing
	 */
	public JackrabbitConfiguration(){
		connectionURL = "http://localhost:8081/rmi";
		userName = "admin";
		password = "admin";
		rootFolder = "FSKSRoot";
		fileCustomNodetype = "fsks:document";
		folderCustomNodetype = "fsks:folder";
	}

	/**
	 * Standard getter method.
	 * 
	 * @return Jackrabbit connection URL defined in the connector configuration.
	 */
	public String getConnectionString() {
		return connectionURL;
	}

	/**
	 * Standard getter method.
	 * 
	 * @return user name defined in the connector configuration.
	 */
	public String getUserName() {
		return userName;
	}

	/**
	 * Standard getter method.
	 * 
	 * @return password defined in the connector configuration.
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * Standard getter method.
	 * 
	 * @return Root Folder name defined in the connector configuration.
	 */
	public String getRootFolder() {
		return rootFolder;
	}

	/**
	 * Standard getter method.
	 * 
	 * @return Namespace prefix defined for the repository application.
	 */
	public String getNamespacePrefix() {
		return namespacePrefix;
	}

	/**
	 * Standard getter method.
	 * 
	 * @return Namespace URI defined for the repository application.
	 */
	public String getNamespace() {
		return namespace;
	}

	/**
	 * Standard getter method.
	 * 
	 * @return Folder Custom Nodetypes defined for the repository application.
	 */
	public String getFolderCustomNodetype() {
		return folderCustomNodetype;
	}
	
	/**
	 * Standard getter method.
	 * 
	 * @return File Custom Nodetypes defined for the repository application.
	 */
	public String getFileCustomNodetype() {
		return fileCustomNodetype;
	}

	private void buildObject(int configNode) {
		logger.debug("configuration node is : " + configNode);

		XPathMetaInfo xmi = new XPathMetaInfo();
		xmi.addNamespaceBinding("ns", NS_JACKRABBIT_CONFIG);

		int connection = XPath.getFirstMatch("ns:connection", xmi, configNode);

		connectionURL = Node.getData(XPath.getFirstMatch("ns:rmi_url", xmi, connection));
		userName = Node.getData(XPath.getFirstMatch("ns:username", xmi, connection));
		password = Node.getData(XPath.getFirstMatch("ns:password", xmi, connection));
		rootFolder = Node.getData(XPath.getFirstMatch("ns:rootfolder", xmi, connection));
		namespacePrefix = Node.getData(XPath.getFirstMatch("ns:nsprefix", xmi, connection));
		namespace = Node.getData(XPath.getFirstMatch("ns:nsqualified", xmi, connection));
		folderCustomNodetype = Node.getData(XPath.getFirstMatch("ns:foldercustomnodetype", xmi, connection));
		fileCustomNodetype = Node.getData(XPath.getFirstMatch("ns:filecustomnodetype", xmi, connection));

		if (logger.isDebugEnabled()) {
			logger.debug("connectionURL : " + connectionURL);
			logger.debug("userName : " + userName);
			logger.debug("password : " + password);
			logger.debug("rootFolder : " + rootFolder);
			logger.debug("namespacePrefix : " + namespacePrefix);
			logger.debug("namespace : " + namespace);
			logger.debug("folderCustomNodetype" + folderCustomNodetype);
			logger.debug("fileCustomNodetype" + fileCustomNodetype);
		}
	}

}
