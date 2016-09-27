SELECT *
FROM c20g_project a, c20g_client b
WHERE a.client_id=b.id AND a.active_flag=1
ORDER BY b.client_name, a.project_name


SELECT a.id, a.google_doc_url, a.submitted_date, b.description status
FROM pt_status_report a, pt_lu_status_report_status b
WHERE a.report_status_id=b.id AND a.project_id=1
ORDER BY a.submitted_date DESC



SELECT week_of, count(id)
FROM pt_status_report
GROUP BY week_of


SELECT week_of, count(id) FROM pt_status_report WHERE report_status_id=1 GROUP BY week_of;

SELECT week_of, count(id) FROM pt_status_report WHERE report_status_id=2 GROUP BY week_of;


SELECT DISTINCT week_of  FROM pt_status_report ORDER BY week_of DESC;


SELECT 
	week_of,
	SUM(CASE WHEN report_status_id=1 THEN 1 ELSE 0 END) AS COUNT_ASSIGNED, 
	SUM(CASE WHEN report_status_id=2 THEN 1 ELSE 0 END) AS COUNT_SUBMITTED
FROM pt_status_report
GROUP BY week_of
ORDER BY week_of DESC;


SELECT 
	pt_status_report.id , 
	pt_status_report.google_doc_url , 
	pt_status_report.submitted_date , 
	pt_lu_status_report_status.description "status", 
	pt_status_report.week_of 
FROM pt_status_report,pt_lu_status_report_status 
WHERE pt_status_report.report_status_id=pt_lu_status_report_status.id AND pt_status_report.project_id=:projectId 
ORDER BY pt_status_report.submitted_date DESC

