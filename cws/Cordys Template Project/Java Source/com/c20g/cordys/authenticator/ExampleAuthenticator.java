package com.c20g.cordys.authenticator;

import java.util.Properties;
import java.util.ResourceBundle;

import com.eibus.security.authentication.AuthenticationException;
import com.eibus.security.authentication.Authenticator;
import com.eibus.security.authentication.InvalidAuthenticatorException;
import com.eibus.security.identity.Credentials;
import com.eibus.security.identity.InvalidCredentialsException;
import com.eibus.security.identity.UsernamePasswordCredentials;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;

public class ExampleAuthenticator implements Authenticator {

	CordysLogger logger = CordysLogger.getCordysLogger(ExampleAuthenticator.class);
	
	@Override
	public boolean authenticate(Credentials credentials) throws InvalidCredentialsException, AuthenticationException {
		
		if ((credentials == null) || !(credentials instanceof UsernamePasswordCredentials)) {
			throw new InvalidCredentialsException("CordysValidatorAuthenticator cannot handle credentials of type "
					+ credentials.getClass().getName());
		}
		
		String userID = ((UsernamePasswordCredentials) credentials).getUserName();
		logger.log(Severity.DEBUG, "Authenticating user : " + userID);
		
		String password = ((UsernamePasswordCredentials) credentials).getPassword();
		
		//
		// do some authentication logic here
		//
		
		return true; // or false if authentication failed
	}

	@Override
	public void close() {
	}

	@Override
	public void open(Properties properties) throws InvalidAuthenticatorException {
	}
	
}
