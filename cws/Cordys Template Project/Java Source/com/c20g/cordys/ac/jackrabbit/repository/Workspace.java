package com.c20g.cordys.ac.jackrabbit.repository;

import java.net.MalformedURLException;

import javax.jcr.Node;
import javax.jcr.Repository;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.SimpleCredentials;

import org.apache.jackrabbit.rmi.repository.URLRemoteRepository;

import com.c20g.cordys.ac.jackrabbit.connector.JackrabbitConfiguration;
import com.eibus.util.logger.CordysLogger;

public class Workspace {
	
	private static CordysLogger logger = CordysLogger.getCordysLogger(Workspace.class);

	private JackrabbitConfiguration config;
	private String rootFolderPath = "";

	public Workspace(JackrabbitConfiguration config) {
		this.config = config;
	}

	public Session login() throws RepositoryException {
		try {
			String rmi_url = config.getConnectionString();
			String username = config.getUserName();
			String password = config.getPassword();
			Repository repo = new URLRemoteRepository(rmi_url);
			Session session = repo.login(new SimpleCredentials(username, password.toCharArray()));
			logger.debug("Jackrabbit Connection established...");
			logger.debug("Login Details::{" + rmi_url + "}" + "{" + username + "}" + "{" + password + "}");
			return session;
		} catch (MalformedURLException e) {
			throw new RepositoryException(e);
		}
	}

	public void logout(Session session) {
		if (session != null) {
			logger.debug("Logging out the session...");
			session.logout();
		}
	}

	public String getRootFolderPath(Session session) throws RepositoryException {
		if (rootFolderPath == null || rootFolderPath.equals("")) {
			setRootFolderPath(session);
		}
		return rootFolderPath;
	}

	public void setRootFolderPath(Session session) throws RepositoryException {
		Node rootFolderNode = session.getRootNode();
		rootFolderNode = rootFolderNode.getNode(config.getRootFolder());
		rootFolderPath = rootFolderNode.getPath();
	}

	public JackrabbitConfiguration getConfig() {
		return config;
	}

}
