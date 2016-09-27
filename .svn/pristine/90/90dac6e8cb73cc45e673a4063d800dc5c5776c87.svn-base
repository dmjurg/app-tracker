package com.c20g.cordys.gateway;

import java.util.ResourceBundle;

import com.eibus.localization.message.internal.WebGatewayMessages;
import com.eibus.soap.fault.Fault;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.web.gateway.SOAPTransaction;
import com.eibus.web.isapi.ExtensionControlBlock;
import com.eibus.web.isapi.Request;
import com.eibus.xml.nom.Document;
import com.eibus.xml.nom.Node;
import com.eibus.xml.nom.XMLException;
import com.eibus.xml.xpath.XPath;
import com.eibus.xml.xpath.XPathMetaInfo;

public class ExampleGateway {
	
	private static CordysLogger logger = CordysLogger.getCordysLogger(ExampleGateway.class);

	private Document[] workerDocs;
	private int docIdx;
	private static XPathMetaInfo metaInfo = new XPathMetaInfo();
	ResourceBundle frameworkProps;
	private int whiteList;

	static {
		metaInfo.addNamespaceBinding("SOAP", "http://schemas.xmlsoap.org/soap/envelope/");
	}

	public ExampleGateway() throws XMLException {
		workerDocs = new Document[10];
		for (int i = 0; i < 10; i++) {
			workerDocs[i] = new Document();
		}
	}

	protected synchronized Document getDocument() {
		docIdx = ++docIdx % workerDocs.length;
		if (logger.isDebugEnabled()) {
			logger.debug("GETTING DOC - doc num : " + docIdx);
		}
		return workerDocs[docIdx];
	}

	/**
	 * Overriding the default gateway "getOSIdentity" method to create the user
	 */
	public String getOSIdentity(SOAPTransaction soapTransaction) {
		Document doc = getDocument();
		int originalRequestXML = 0;
		ExtensionControlBlock ecb = soapTransaction.getExtensionControlBlock();
		Request request = ecb.getRequest();

		String userID = "bmarkmann";

		try {
			originalRequestXML = doc.load(request.binaryRead());
			
			//
			// do some validation here
			//
			
			
		} catch (XMLException exception) {
			logger.log(Severity.ERROR, exception);
			soapTransaction.raiseSOAPFault(Fault.Codes.SERVER, 500,
					WebGatewayMessages.WG_SOAPTRANSACTION_INVALID_SOAPMESSAGE, null, exception);
			return null;
		} catch (Exception exception) {
			logger.log(Severity.ERROR, exception);
			soapTransaction.raiseSOAPFault(Fault.Codes.SERVER, 500,
					WebGatewayMessages.WG_SOAPTRANSACTION_INVALID_SOAPMESSAGE, null, exception);
			return null;
		} finally {
			if (originalRequestXML != 0) {
				Node.delete(originalRequestXML);
			}
		}
		return userID;
	}

}
