package com.c20g.cordys.ac.jackrabbit.repository;

import javax.jcr.RepositoryException;

import sun.misc.BASE64Decoder;
import sun.net.www.MimeTable;

import com.eibus.xml.nom.Node;

public class DocumentSystemUtils {
	
	public static String getFileExtension(String fileName) {
		String extension = "";
		if (fileName.indexOf(".") != -1) {
			extension = fileName.substring(fileName.lastIndexOf("."));
		}
		return extension;
	}

	public static String calculateFileSize(String documentContents) throws Exception {
		BASE64Decoder decoder = new BASE64Decoder();
		byte[] decoded = decoder.decodeBuffer(documentContents);
		return String.valueOf((float) Math.round((decoded.length / 1024f) * 100) / 100);
	}

	public static String getMimeType(String fileName, String extension) {
		MimeTable mt = MimeTable.getDefaultTable();
		String mimeType = mt.getContentTypeFor(fileName);
		if (mimeType == null) {
			if (extension.equals(".doc") || extension.equals(".docx")) {
				mimeType = "application/msword";
			} else if (extension.equals(".xls") || extension.equals(".xlsx")) {
				mimeType = "application/vnd.ms-excel";
			} else if (extension.equals(".ppt") || extension.equals(".pptx")) {
				mimeType = "application/mspowerpoint";
			} else {
				mimeType = "application/octet-stream";
			}
		}
		return mimeType;
	}

	public static int buildDocumentResponse(int parentDOMNode, javax.jcr.Node fileNode, boolean includeIdentifier,
			boolean includeContents) throws RepositoryException {
		if (includeIdentifier) {
			Node.createTextElement("uuid", fileNode.getIdentifier(), parentDOMNode);
		}
		Node.createTextElement("fileName", fileNode.getProperty("fileName").getString(), parentDOMNode);
		Node.createTextElement("title", fileNode.getProperty("title").getString(), parentDOMNode);
		Node.createTextElement("extension", fileNode.getProperty("extension").getString(), parentDOMNode);
		Node.createTextElement("description", fileNode.getProperty("description").getString(), parentDOMNode);
		Node.createTextElement("comment", fileNode.getProperty("comment").getString(), parentDOMNode);
		Node.createTextElement("createdOn", fileNode.getProperty("createdOn").getString(), parentDOMNode);
		Node.createTextElement("createdBy", fileNode.getProperty("createdBy").getString(), parentDOMNode);
		Node.createTextElement("lastModified", fileNode.getProperty("lastModified").getString(), parentDOMNode);
		Node.createTextElement("lastModifiedBy", fileNode.getProperty("lastModifiedBy").getString(), parentDOMNode);
		Node.createTextElement("documentType", fileNode.getProperty("documentType").getString(), parentDOMNode);
		Node.createTextElement("fileSizeInKB", fileNode.getProperty("fileSizeInKB").getString(), parentDOMNode);
		if (includeContents) {
			javax.jcr.Node doccontents = fileNode.getNode("jcr:content");
			Node.createTextElement("documentContents", doccontents.getProperty("jcr:data").getString(), parentDOMNode);
		}
		return parentDOMNode;
	}

	public static int buildFolderResponse(int parentDOMNode, javax.jcr.Node folderNode, String customType,
			boolean includeIdentifier) throws RepositoryException {
		if (includeIdentifier) {
			Node.createTextElement("uuid", folderNode.getIdentifier(), parentDOMNode);
		}
		Node.createTextElement("folderName", folderNode.getName(), parentDOMNode);
		Node.createTextElement("path", folderNode.getPath(), parentDOMNode);
		if (folderNode.getPrimaryNodeType().getName().equals(customType)) {
			Node.createTextElement("title", folderNode.getProperty("title").getString(), parentDOMNode);
			Node.createTextElement("description", folderNode.getProperty("description").getString(), parentDOMNode);
			Node.createTextElement("createdOn", folderNode.getProperty("createdOn").getString(), parentDOMNode);
			Node.createTextElement("createdBy", folderNode.getProperty("createdBy").getString(), parentDOMNode);
		}
		return parentDOMNode;
	}

}
