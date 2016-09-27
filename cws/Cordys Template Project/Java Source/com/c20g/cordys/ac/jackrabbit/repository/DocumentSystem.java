package com.c20g.cordys.ac.jackrabbit.repository;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import javax.jcr.NodeIterator;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.version.Version;
import javax.jcr.version.VersionHistory;
import javax.jcr.version.VersionIterator;
import javax.jcr.version.VersionManager;

import sun.misc.BASE64Encoder;

import com.c20g.cordys.ac.jackrabbit.messages.Messages;
import com.eibus.util.logger.CordysLogger;
import com.eibus.xml.nom.Node;

public class DocumentSystem {
	
	private static CordysLogger logger = CordysLogger.getCordysLogger(DocumentSystem.class);
	private Workspace ws;

	public DocumentSystem(Workspace ws) {
		this.ws = ws;
	}

	public int createDocument(String folderId, String fileName, String title, String description, String comment,
			String createdOn, String createdBy, String lastModified, String lastModifiedBy, String documentType,
			String documentContents, int responseNode) throws RepositoryException, Exception {
		Session session = ws.login();
		String extension = DocumentSystemUtils.getFileExtension(fileName);
		String mimeType = DocumentSystemUtils.getMimeType(fileName, extension);
		String tempfilename = "fsks" + System.currentTimeMillis() + extension;
		javax.jcr.Node fol = session.getNodeByIdentifier(folderId);
		javax.jcr.Node doc = fol.addNode(tempfilename, ws.getConfig().getFileCustomNodetype());

		String fileSizeInKB = DocumentSystemUtils.calculateFileSize(documentContents);

		// Add Property Definition Values
		doc.setProperty("fileName", fileName);
		doc.setProperty("title", title);
		doc.setProperty("extension", extension);
		doc.setProperty("description", description);
		doc.setProperty("comment", comment);
		doc.setProperty("createdOn", createdOn);
		doc.setProperty("createdBy", createdBy);
		doc.setProperty("lastModified", lastModified);
		doc.setProperty("lastModifiedBy", lastModifiedBy);
		doc.setProperty("documentType", documentType);
		doc.setProperty("fileSizeInKB", fileSizeInKB);

		// Add Document Contents
		javax.jcr.Node doccontents = doc.addNode("jcr:content", "nt:resource");
		doccontents.setProperty("jcr:mimeType", mimeType);
		doccontents.setProperty("jcr:encoding", "");
		doccontents.setProperty("jcr:data", documentContents);

		session.save();
		ws.logout(session);

		// Build Response
		Node.createTextElement("uuid", doc.getIdentifier(), responseNode);
		Node.createTextElement("fileSizeInKB", String.valueOf(fileSizeInKB), responseNode);
		Node.createTextElement("extension", extension, responseNode);
		return responseNode;
	}

	public int createDocumentFromPath(String folderId, String fileName, String title, String description,
			String comment, String createdOn, String createdBy, String lastModified, String lastModifiedBy,
			String documentType, String filePath, int responseNode) throws RepositoryException, Exception {
		FileInputStream fis = null;
		byte[] bytes = null;
		try {
			File file = new File(filePath);
			fis = new FileInputStream(file);
			bytes = new byte[(int) file.length()];
			fis.read(bytes);
		} catch (IOException ioe) {
			logger.error(ioe, Messages.GENERAL_ERROR, ioe.getMessage());
			throw ioe;
		} finally {
			try {
				fis.close();
			} catch (Exception e) {
			}
		}

		BASE64Encoder encoder = new BASE64Encoder();
		return createDocument(folderId, fileName, title, description, comment, createdOn, createdBy, lastModified,
				lastModifiedBy, documentType, encoder.encode(bytes), responseNode);
	}

	public int createDocumentVersion(String fileUUID, String fileName, String title, String description,
			String comment, String lastModified, String lastModifiedBy, String documentType, String documentContents,
			int responseNode) throws RepositoryException, Exception {

		Session session = ws.login();
		javax.jcr.Node doc = session.getNodeByIdentifier(fileUUID);
		if (!(DocumentSystemUtils.getFileExtension(doc.getName())
				.equals(DocumentSystemUtils.getFileExtension(fileName)))) {
			throw new Exception("New version must have the same extension");
		}

		String fileSizeInKB = DocumentSystemUtils.calculateFileSize(documentContents);

		VersionManager vm = session.getWorkspace().getVersionManager();
		vm.checkout(doc.getPath());

		// Add Property Definition Values
		doc.setProperty("fileName", fileName);
		doc.setProperty("title", title);
		doc.setProperty("description", description);
		doc.setProperty("comment", comment);
		doc.setProperty("lastModified", lastModified);
		doc.setProperty("lastModifiedBy", lastModifiedBy);
		doc.setProperty("documentType", documentType);
		doc.setProperty("fileSizeInKB", fileSizeInKB);

		// Add Document Contents
		javax.jcr.Node doccontents = doc.getNode("jcr:content");
		doccontents.setProperty("jcr:data", documentContents);

		session.save();
		vm.checkin(doc.getPath());
		ws.logout(session);

		// Build Response
		Node.createTextElement("uuid", doc.getIdentifier(), responseNode);
		Node.createTextElement("fileSizeInKB", String.valueOf(fileSizeInKB), responseNode);
		Node.createTextElement("extension", DocumentSystemUtils.getFileExtension(fileName), responseNode);
		return responseNode;
	}

	public int createFolder(String parentFolderId, String folderName, String description, String createdOn,
			String createdBy, int responseNode) throws RepositoryException {

		Session session = ws.login();
		javax.jcr.Node pf = null;
		if (parentFolderId == null || parentFolderId.equals("")) {
			pf = session.getNode(ws.getRootFolderPath(session));
		} else {
			pf = session.getNodeByIdentifier(parentFolderId);
		}
		javax.jcr.Node f = pf.addNode(folderName, ws.getConfig().getFolderCustomNodetype());

		// Add Property Definition Values
		f.setProperty("title", folderName);
		f.setProperty("description", description);
		f.setProperty("createdOn", createdOn);
		f.setProperty("createdBy", createdBy);

		session.save();
		ws.logout(session);

		// Build Response
		Node.createTextElement("uuid", f.getIdentifier(), responseNode);
		return responseNode;
	}

	public int getDocument(String uuid, int responseNode) throws RepositoryException {
		Session session = ws.login();
		javax.jcr.Node doc = session.getNodeByIdentifier(uuid);
		DocumentSystemUtils.buildDocumentResponse(responseNode, doc, false, true);
		ws.logout(session);
		return responseNode;
	}

	public int getDocumentVersion(String uuid, String version, int responseNode) throws RepositoryException {
		Session session = ws.login();
		javax.jcr.Node doc = session.getNodeByIdentifier(uuid);
		VersionHistory vh = session.getWorkspace().getVersionManager().getVersionHistory(doc.getPath());
		Version v = vh.getVersion(version);
		javax.jcr.Node vfn = v.getFrozenNode();
		DocumentSystemUtils.buildDocumentResponse(responseNode, vfn, false, true);
		ws.logout(session);
		return responseNode;
	}

	public int getDocumentVersions(String uuid, int responseNode) throws RepositoryException {
		Session session = ws.login();
		javax.jcr.Node doc = session.getNodeByIdentifier(uuid);
		VersionHistory vh = session.getWorkspace().getVersionManager().getVersionHistory(doc.getPath());
		VersionIterator vi = vh.getAllVersions();

		while (vi.hasNext()) {
			int versionNode = Node.createElement("version", responseNode);
			Version v = vi.nextVersion();
			String vn = v.getName();
			if (!vn.equals("jcr:rootVersion")) {
				javax.jcr.Node vfn = v.getFrozenNode();
				Node.createTextElement("version", vn, versionNode);
				DocumentSystemUtils.buildDocumentResponse(versionNode, vfn, false, false);
			}
		}
		ws.logout(session);
		return responseNode;
	}

	public int getFolderContents(String uuid, int responseNode) throws RepositoryException {
		Session session = ws.login();
		javax.jcr.Node folder = session.getNodeByIdentifier(uuid);
		int currentNode = Node.createElement("current", responseNode);
		DocumentSystemUtils.buildFolderResponse(currentNode, folder, ws.getConfig().getFolderCustomNodetype(), false);

		int foldersNode = Node.createElement("folders", responseNode);
		int filesNode = Node.createElement("files", responseNode);
		NodeIterator ni = folder.getNodes();
		while (ni.hasNext()) {
			javax.jcr.Node n = ni.nextNode();
			if (n.getPrimaryNodeType().getName().equals(ws.getConfig().getFolderCustomNodetype())) {
				int folderNode = Node.createElement("folder", foldersNode);
				DocumentSystemUtils.buildFolderResponse(folderNode, n, ws.getConfig().getFolderCustomNodetype(), true);
			} else if (n.getPrimaryNodeType().getName().equals(ws.getConfig().getFileCustomNodetype())) {
				int fileNode = Node.createElement("file", filesNode);
				DocumentSystemUtils.buildDocumentResponse(fileNode, n, true, false);
			}
		}
		ws.logout(session);
		return responseNode;
	}

	public int moveDocument(String uuid, String targetUUID, int responseNode) throws RepositoryException {
		Session session = ws.login();
		javax.jcr.Node source = session.getNodeByIdentifier(uuid);
		javax.jcr.Node target = session.getNodeByIdentifier(targetUUID);
		if (!target.hasNode(source.getName())) {
			session.move(source.getPath(), target.getPath() + "/" + source.getName());
			session.save();
		}
		ws.logout(session);
		return responseNode;
	}

	public int deleteContent(String uuid, int responseNode) throws RepositoryException {
		Session session = ws.login();
		javax.jcr.Node n = session.getNodeByIdentifier(uuid);
		if (n.getPrimaryNodeType().getName().equals(ws.getConfig().getFileCustomNodetype())) {
			deleteDocument(n, session);
		} else if (n.getPrimaryNodeType().getName().equals(ws.getConfig().getFolderCustomNodetype())) {
			deleteFolder(n, session);
		}
		session.save();
		ws.logout(session);
		return responseNode;
	}

	private void deleteDocument(javax.jcr.Node d, Session session) throws RepositoryException {
		VersionManager vm = session.getWorkspace().getVersionManager();
		String baseVersion = vm.getBaseVersion(d.getPath()).getName();
		VersionHistory vh = vm.getVersionHistory(d.getPath());
		VersionIterator vi = vh.getAllVersions();
		while (vi.hasNext()) {
			Version v = vi.nextVersion();
			if (!v.getName().equals("jcr:rootVersion") && !v.getName().equals(baseVersion)) {
				vh.removeVersion(v.getName());
			}
		}
		d.remove();
	}

	private void deleteFolder(javax.jcr.Node f, Session session) throws RepositoryException {
		NodeIterator ni = f.getNodes();
		while (ni.hasNext()) {
			javax.jcr.Node n = ni.nextNode();
			if (n.getPrimaryNodeType().getName().equals(ws.getConfig().getFileCustomNodetype())) {
				deleteDocument(n, session);
			} else if (n.getPrimaryNodeType().getName().equals(ws.getConfig().getFolderCustomNodetype())) {
				deleteFolder(n, session);
			}
		}
		f.remove();
	}

	public int doesFolderExist(String pathFromRoot, int responseNode) throws RepositoryException {
		Session session = ws.login();
		boolean isAbsolute = pathFromRoot.startsWith("/");
		String newPathFromRoot = (isAbsolute ? "" : ws.getRootFolderPath(session) + "/") + pathFromRoot;
		boolean exists = session.itemExists(newPathFromRoot);
		Node.createTextElement("result", exists ? "Yes" : "No", responseNode);
		if (exists) {
			javax.jcr.Node folder = session.getNode(newPathFromRoot);
			Node.createTextElement("uuid", folder.getIdentifier(), responseNode);
		} else {
			Node.createTextElement("uuid", "", responseNode);
		}
		ws.logout(session);
		return responseNode;
	}

	public int getFolder(String uuid, int responseNode) throws RepositoryException {
		Session session = ws.login();
		javax.jcr.Node folder = session.getNodeByIdentifier(uuid);
		DocumentSystemUtils.buildFolderResponse(responseNode, folder, ws.getConfig().getFolderCustomNodetype(), false);
		ws.logout(session);
		return responseNode;
	}

	public int getFolderByPath(String pathFromRoot, int responseNode) throws RepositoryException {
		Session session = ws.login();
		javax.jcr.Node folder = null;
		if (pathFromRoot.equals("")) {
			folder = session.getNode(ws.getRootFolderPath(session));
		} else {
			folder = session.getNode(ws.getRootFolderPath(session) + "/" + pathFromRoot);
		}
		DocumentSystemUtils.buildFolderResponse(responseNode, folder, ws.getConfig().getFolderCustomNodetype(), true);
		ws.logout(session);
		return responseNode;
	}

	public int updateFolderMetadata(String uuid, String folderName, String description, int responseNode)
			throws RepositoryException {
		Session session = ws.login();
		javax.jcr.Node folder = session.getNodeByIdentifier(uuid);
		if (!folderName.equals(folder.getName())) {
			session.move(folder.getPath(), folder.getParent().getPath() + "/" + folderName);
			folder.setProperty("title", folderName.equals("") ? folder.getProperty("title").getString() : folderName);
			folder.setProperty("description", description.equals("") ? folder.getProperty("description").getString()
					: description);
			session.save();
		}
		ws.logout(session);
		return responseNode;
	}

	public int updateDocumentMetadata(String uuid, String fileName, String title, String description, String comment,
			String lastModified, String lastModifiedBy, String documentType, int responseNode)
			throws RepositoryException {
		Session session = ws.login();
		javax.jcr.Node file = session.getNodeByIdentifier(uuid);
		if (!fileName.equals(file.getName())) {
			file.setProperty("fileName", fileName.equals("") ? file.getProperty("fileName").getString() : fileName);
			file.setProperty("title", title.equals("") ? file.getProperty("title").getString() : title);
			file.setProperty("description", description.equals("") ? file.getProperty("description").getString()
					: description);
			file.setProperty("comment", comment.equals("") ? file.getProperty("comment").getString() : comment);
			file.setProperty("lastModified", lastModified.equals("") ? file.getProperty("lastModified").getString()
					: lastModified);
			file.setProperty("lastModifiedBy", lastModifiedBy.equals("") ? file.getProperty("lastModifiedBy")
					.getString() : lastModifiedBy);
			file.setProperty("documentType", documentType.equals("") ? file.getProperty("documentType").getString()
					: documentType);
			session.save();
		}
		ws.logout(session);
		return responseNode;
	}

}
