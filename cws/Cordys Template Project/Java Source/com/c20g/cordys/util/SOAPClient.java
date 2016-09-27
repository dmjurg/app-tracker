package com.c20g.cordys.util;

import com.eibus.connector.nom.Connector;
import com.eibus.directory.soap.DirectoryException;
import com.eibus.exception.ExceptionGroup;
import com.eibus.exception.TimeoutException;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import com.eibus.xml.nom.Document;
import com.eibus.xml.nom.Node;
import com.eibus.xml.xpath.NodeSet;
import com.eibus.xml.xpath.XPath;
import com.eibus.xml.xpath.XPathMetaInfo;

public class SOAPClient {
	
	private static CordysLogger logger = CordysLogger.getCordysLogger(SOAPClient.class);
	private Document document;
	private String organization;
	private String user;
	
	private Connector connector;
	
	public SOAPClient(Document document, String user, String organization) throws Exception
	{
		this.document = document;
		this.user = user;
		this.organization = organization;
		try 
		{
			this.connector = Connector.getInstance("Anonymous");
			if ( ! this.connector.isOpen() )
			{
				this.connector.open();
			}
		}
		catch (ExceptionGroup exceptionGroup) 
		{
			logger.log(Severity.ERROR, exceptionGroup);
			throw exceptionGroup;
		} 
		catch (DirectoryException dirException) 
		{
			logger.log(Severity.ERROR, dirException);
			throw dirException;
		}
	}
	
	/**
	 * This method returns XML Document.
	 * @return
	 */
	public final Document getDocument()
	{
		return document;
	}
	
	/**
	 * This method prepares request and sends to SOAP Server.
	 * @param iNamespace namespace of the method.
	 * @param iMethodName method name
	 * @param requestBodies
	 * @return
	 */
	public final int sendRequest(String iNamespace, String iMethodName, String ...requestBodies) throws Exception
	{
		int request = createRequest(iNamespace, iMethodName, requestBodies);
		return sendRequest(request);
	}
	
	public final int sendRequest(int requestNode) throws Exception
	{
		logger.log(Severity.DEBUG, Node.writeToString(requestNode, true));
		int response = 0;
		try 
		{
			response = connector.sendAndWait(requestNode);
		} 
		catch(ExceptionGroup eGroup)
		{
			logger.log(Severity.ERROR, "Exception Group sending request \n" + eGroup.getMessage(), eGroup);
			throw new Exception(eGroup);
		}
		catch(TimeoutException timeoutException)
		{
			logger.log(Severity.ERROR, "TimeOut Exception occured. \n" + timeoutException.getMessage(), timeoutException);
			throw timeoutException;
		}	 
		finally
		{
			Node.delete(requestNode);
			requestNode = 0;
		}
		logger.log(Severity.DEBUG, Node.writeToString(response, true));
		return response;
	}
	
	public final int createRequest(String iNamespace, String iMethodName, String ...requestBodies) throws Exception
	{
		int request = 0;
		try
		{
			request	= connector.createSOAPMethod(this.user, this.organization, iNamespace, iMethodName);
			logger.log(Severity.DEBUG, Node.writeToString(request, true));
			int methodBody = 0;
			if ( requestBodies != null )
			{
				for(String requestBody : requestBodies)
				{
					methodBody = getDocument().parseString(requestBody); 
					Node.appendToChildren(methodBody, 0, request);
				}
			}
		}
		catch(Exception exception)
		{
			logger.log(Severity.ERROR, exception);	
			throw exception;
		}
		return request;
	}
	
	public boolean hasSoapFault(int responseNode)
	{
		logger.log(Severity.DEBUG, "In hasSoapFault : " + Node.writeToString(responseNode, true));
		//TODO: extract out namespace SOAP
		XPathMetaInfo metaInfo = new XPathMetaInfo();
		metaInfo.addNamespaceBinding("SOAP", "http://schemas.xmlsoap.org/soap/envelope/");
		NodeSet nodeSet = XPath.getMatchingNodeSet("//SOAP:Envelope/SOAP:Body/SOAP:Fault", metaInfo, 
				responseNode);
		logger.log(Severity.DEBUG, "In hasSoapFault return : " + nodeSet.hasNext());
		return nodeSet.hasNext();
	}

}
