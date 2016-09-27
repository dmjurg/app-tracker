package com.c20g.cordys.dispatcher;

import java.util.ArrayList;
import java.util.Collection;

import com.cordys.notification.customdispatch.CustomTaskDispatcher;
import com.cordys.notification.customdispatch.TaskInformation;
import com.cordys.notification.task.IAssignment;
import com.eibus.util.logger.CordysLogger;

public class ExampleDispatchAlgorithm implements CustomTaskDispatcher {
	
	private static final CordysLogger logger = CordysLogger.getCordysLogger(ExampleDispatchAlgorithm.class);

	@Override
	public Collection<IAssignment> getAssignments(TaskInformation taskInformation) {
		
		ArrayList<IAssignment> assignments = (ArrayList<IAssignment>) taskInformation.getAssignments();
		logger.debug("Assignment(s) to: " + assignments);
		
		//
		// add or update assignments for task here
		//
		
		return assignments;
	}

}
