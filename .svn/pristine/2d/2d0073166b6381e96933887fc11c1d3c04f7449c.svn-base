package com.c20g.cordys.ac.jackrabbit.exception;

@SuppressWarnings("serial")
public class JackrabbitException extends Exception {
	
	/**
	 * The prefix for the error codes.
	 */
	private static final String EC_PREFIX = "JE_";
	/**
	 * The error code for general connector level errors.
	 */
	public static final String EC_CONNECTOR = EC_PREFIX + "00001";
	/**
	 * The error code for general configuration level errors.
	 */
	public static final String EC_CONFIGURATION = EC_PREFIX + "00002";
	/**
	 * The error code for general processing level errors.
	 */
	public static final String EC_PROCESSING = EC_PREFIX + "00003";

	/**
	 * Creates a new instance of <code>JackrabbitException</code> without a
	 * cause.
	 * 
	 * @param sErrorCode
	 *            The error code for this exception.
	 */
	public JackrabbitException(String sErrorCode) {
		super(sErrorCode);
	}

	/**
	 * Creates a new instance of <code>JackrabbitException</code> based on the
	 * the throwable.
	 * 
	 * @param sErrorCode
	 *            The error code for this exception.
	 * @param tCause
	 *            The exception that caused this exception.
	 */
	public JackrabbitException(String sErrorCode, Throwable tThrowable) {
		super(sErrorCode, tThrowable);
	}

	/**
	 * Creates a new instance of <code>JackrabbitException</code> based on the
	 * the throwable.
	 * 
	 * @param sErrorCode
	 *            The error code for this exception.
	 * @param sShortMessage
	 *            A short message for this exception.
	 */
	public JackrabbitException(String sErrorCode, String sShortMessage) {
		super(sErrorCode + "/nShort Message:::" + sShortMessage);
	}

	/**
	 * Constructs an instance of <code>JackrabbitException</code> with the
	 * specified detail message.
	 * 
	 * @param sErrorCode
	 *            The error code for this exception.
	 * @param sShortMessage
	 *            A short message for this exception.
	 * @param tCause
	 *            The exception that caused this exception.
	 */
	public JackrabbitException(String sErrorCode, String sShortMessage,
			Throwable tCause) {
		super(sErrorCode + "/nShort Message:::" + sShortMessage, tCause);
	}

	/**
	 * Creates a new JackrabbitException object.
	 * 
	 * @param sErrorCode
	 *            The error code for this exception.
	 * @param sShortMessage
	 *            A short message for this exception.
	 * @param sDetailedMessage
	 *            A more detailed message for the exception.
	 */
	public JackrabbitException(String sErrorCode, String sShortMessage,
			String sDetailedMessage) {
		super(sErrorCode + "/nShort Message:::" + sShortMessage
				+ "/nDetailed Message:::" + sDetailedMessage);
	}

	/**
	 * Creates a new JackrabbitException object.
	 * 
	 * @param sErrorCode
	 *            The error code for this exception.
	 * @param sShortMessage
	 *            A short message for this exception.
	 * @param sDetailedMessage
	 *            A more detailed message for the exception.
	 * @param tCause
	 *            The exception that caused this exception.
	 */
	public JackrabbitException(String sErrorCode, String sShortMessage,
			String sDetailedMessage, Throwable tCause) {
		super(sErrorCode + "/nShort Message:::" + sShortMessage
				+ "/nDetailed Message:::" + sDetailedMessage, tCause);
	}

}
