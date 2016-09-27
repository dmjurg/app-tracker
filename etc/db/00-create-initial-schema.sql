------------------------------------------------------------------
-- CREATE / CONFIG (c20g network; 192.168.1.42)                 --
------------------------------------------------------------------

-- MariaDB [(none)]> create database app_portal;
-- Query OK, 1 row affected (0.00 sec)

-- MariaDB [(none)]> grant all privileges on app_portal.* to 'app_portal'@'%' identified by 'app_portal';
-- Query OK, 0 rows affected (0.00 sec)

-- MariaDB [(none)]> grant all privileges on app_portal.* to 'app_portal'@'localhost' identified by 'app_portal';
-- Query OK, 0 rows affected (0.00 sec)


------------------------------------------------------------------
-- GENERAL TABLES                                               --
------------------------------------------------------------------


-- http://c20g.com/apps/db/common/client
CREATE TABLE c20g_client (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	client_name VARCHAR(100) NOT NULL
) 
ENGINE=InnoDB;

-- http://c20g.com/apps/db/common/clientcontact
CREATE TABLE c20g_client_contact (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	client_id INTEGER NOT NULL,
	contact_name VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL,
	FOREIGN KEY (client_id) REFERENCES c20g_client(id)
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/common/project
CREATE TABLE c20g_project (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	client_id INTEGER NOT NULL,
	project_name VARCHAR(100) NOT NULL,
	description VARCHAR(1000),
	manager_cn VARCHAR(30) NOT NULL,
	client_primary_contact_id INTEGER NOT NULL,
	active_flag TINYINT NOT NULL DEFAULT 1,
	FOREIGN KEY (client_id) REFERENCES c20g_client(id)
)
ENGINE=InnoDB;


INSERT INTO c20g_client (client_name) VALUES ('OpenText');
SET @client_opentext_id = LAST_INSERT_ID();

INSERT INTO c20g_project (client_id, project_name, description, manager_cn, client_primary_contact_id, active_flag) VALUES (@client_opentext_id, 'General', '', 'bill', 0, 1);

INSERT INTO c20g_client (client_name) VALUES ('World Bank');
SET @client_wbg_id = LAST_INSERT_ID();

INSERT INTO c20g_project (client_id, project_name, description, manager_cn, client_primary_contact_id, active_flag) VALUES (@client_wbg_id, 'eConsultant2', '', 'bill', 0, 1);
INSERT INTO c20g_project (client_id, project_name, description, manager_cn, client_primary_contact_id, active_flag) VALUES (@client_wbg_id, 'eTendering', '', 'bill', 0, 1);
INSERT INTO c20g_project (client_id, project_name, description, manager_cn, client_primary_contact_id, active_flag) VALUES (@client_wbg_id, 'TTW', '', 'bill', 0, 1);
INSERT INTO c20g_project (client_id, project_name, description, manager_cn, client_primary_contact_id, active_flag) VALUES (@client_wbg_id, 'PPTS', '', 'bill', 0, 1);


INSERT INTO c20g_client (client_name) VALUES ('DHS');
SET @client_dhs_id = LAST_INSERT_ID();

INSERT INTO c20g_project (client_id, project_name, description, manager_cn, client_primary_contact_id, active_flag) VALUES (@client_dhs_id, 'CHEMSEC', '', 'bill', 0, 1);

INSERT INTO c20g_client (client_name) VALUES ('NIAID');
SET @client_niaid_id = LAST_INSERT_ID();

INSERT INTO c20g_project (client_id, project_name, description, manager_cn, client_primary_contact_id, active_flag) VALUES (@client_niaid_id, 'Recruitment Position Approval', '', 'bill', 0, 1);

INSERT INTO c20g_client (client_name) VALUES ('Feinsuch');
SET @client_feinsuch_id = LAST_INSERT_ID();

INSERT INTO c20g_project (client_id, project_name, description, manager_cn, client_primary_contact_id, active_flag) VALUES (@client_feinsuch_id, 'NJ Foreclosure', '', 'bill', 0, 1);

INSERT INTO c20g_client (client_name) VALUES ('State Department');
SET @client_statedept_id = LAST_INSERT_ID();

INSERT INTO c20g_project (client_id, project_name, description, manager_cn, client_primary_contact_id, active_flag) VALUES (@client_statedept_id, 'DRL', '', 'bill', 0, 1);

-- remove TTW
DELETE FROM c20g_project WHERE project_name='TTW';

-- fix project managers
UPDATE c20g_project SET manager_cn='bill' WHERE project_name='General';
UPDATE c20g_project SET manager_cn='glarson' WHERE project_name='eConsultant2';
UPDATE c20g_project SET manager_cn='areber' WHERE project_name='eTendering';
UPDATE c20g_project SET manager_cn='psasidhara' WHERE project_name='PPTS';
UPDATE c20g_project SET manager_cn='jedwards' WHERE project_name='CHEMSEC';
UPDATE c20g_project SET manager_cn='ksoman' WHERE project_name='Recruitment Position Approval';
UPDATE c20g_project SET manager_cn='keady' WHERE project_name='NJ Foreclosure';
UPDATE c20g_project SET manager_cn='tshah' WHERE project_name='DRL';


------------------------------------------------------------------
-- EXPENSE REPORTING                                            --
------------------------------------------------------------------

-- http://c20g.com/apps/db/expense/reportstatus
CREATE TABLE exp_lu_report_status (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	description VARCHAR(20) NOT NULL
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/expense/expensecategory
CREATE TABLE exp_lu_expense_category (
	id INTEGER NOT NULL PRIMARY KEY,
	description VARCHAR(50) NOT NULL
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/expense/expensereport
CREATE TABLE exp_expense_report (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	employee_cn VARCHAR(30) NOT NULL,
	project_id INTEGER,
	created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	submitted_date TIMESTAMP,
	approver_cn VARCHAR(30),
	approved_date TIMESTAMP,
	status_id INTEGER NOT NULL,
	FOREIGN KEY (project_id) REFERENCES c20g_project(id),
	FOREIGN KEY (status_id) REFERENCES exp_expense_report(id)
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/expense/expensereportitem
CREATE TABLE exp_report_line_item (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	expense_report_id INTEGER NOT NULL,
	expense_category_id INTEGER NOT NULL,
	expense_date DATE,
	description VARCHAR(1000) NOT NULL,
	price NUMERIC(15,2) NOT NULL,
	receipt_image_uuid VARCHAR(100),
	FOREIGN KEY (expense_report_id) REFERENCES exp_expense_report(id),
	FOREIGN KEY (expense_category_id) REFERENCES exp_lu_expense_category(id)
)
ENGINE=InnoDB;


INSERT INTO exp_lu_report_status (id, description) VALUES (1, 'Submitted');
INSERT INTO exp_lu_report_status (id, description) VALUES (2, 'Rejected');
INSERT INTO exp_lu_report_status (id, description) VALUES (3, 'Approved');
INSERT INTO exp_lu_report_status (id, description) VALUES (4, 'Cancelled');

INSERT INTO exp_lu_expense_category (id, description) VALUES (1, 'Dining / Entertainment');
INSERT INTO exp_lu_expense_category (id, description) VALUES (2, 'Education');
INSERT INTO exp_lu_expense_category (id, description) VALUES (3, 'Gas');
INSERT INTO exp_lu_expense_category (id, description) VALUES (4, 'Miscellaneous');
INSERT INTO exp_lu_expense_category (id, description) VALUES (5, 'Parking');
INSERT INTO exp_lu_expense_category (id, description) VALUES (6, 'Travel');


------------------------------------------------------------------
-- PROJECT STATUS TRACKING                                      --
------------------------------------------------------------------

-- http://c20g.com/apps/db/projtrac/projectemployee
CREATE TABLE pt_project_emp (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	project_id INTEGER NOT NULL,
	employee_cn VARCHAR(30) NOT NULL,
	FOREIGN KEY (project_id) REFERENCES c20g_project(id)
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/projtrac/projectclientcc
CREATE TABLE pt_project_client_cc (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	project_id INTEGER NOT NULL,
	client_contact_id INTEGER NOT NULL,
	FOREIGN KEY (project_id) REFERENCES c20g_project(id),
	FOREIGN KEY (client_contact_id) REFERENCES c20g_client_contact(id)
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/projtrac/statusreportstatus
CREATE TABLE pt_lu_status_report_status (
	id INTEGER NOT NULL PRIMARY KEY,
	description VARCHAR(30) NOT NULL
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/projtrac/statusreport
CREATE TABLE pt_status_report (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	project_id INTEGER NOT NULL,
	report_status_id INTEGER NOT NULL,
	google_doc_url VARCHAR(500),
	submitted_date TIMESTAMP,
	FOREIGN KEY (project_id) REFERENCES c20g_project(id),
	FOREIGN KEY (report_status_id) REFERENCES pt_lu_status_report_status(id)
)
ENGINE=InnoDB;

ALTER TABLE pt_status_report ADD week_of VARCHAR(20);

INSERT INTO pt_lu_status_report_status (id, description) VALUES (1, 'Assigned');
INSERT INTO pt_lu_status_report_status (id, description) VALUES (2, 'Submitted');


------------------------------------------------------------------
-- SIMPLE TASK TRACKING                                         --
------------------------------------------------------------------

-- http://c20g.com/apps/db/tasktrac/taskstatus
CREATE TABLE tt_lu_task_status (
	id INTEGER NOT NULL PRIMARY KEY,
	description VARCHAR(30) NOT NULL
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/tasktrac/task
CREATE TABLE tt_task (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	creator_cn VARCHAR(30) NOT NULL,
	assignee_cn VARCHAR(30) NOT NULL,
	title VARCHAR(100) NOT NULL,
	instructions TEXT,
	task_status_id INTEGER NOT NULL,
	completed_date TIMESTAMP,
	FOREIGN KEY (task_status_id) REFERENCES tt_lu_task_status (id)
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/tasktrac/taskcomment
CREATE TABLE tt_task_comment (
	id INTEGER NOT NULL PRIMARY KEY,
	task_id INTEGER NOT NULL,
	user_cn VARCHAR(30) NOT NULL,
	comment_date TIMESTAMP,
	comment TEXT,
	FOREIGN KEY (task_id) REFERENCES tt_task (id)
)
ENGINE=InnoDB;

INSERT INTO tt_lu_task_status (id, description) VALUES (1, 'Draft');
INSERT INTO tt_lu_task_status (id, description) VALUES (2, 'Submitted');
INSERT INTO tt_lu_task_status (id, description) VALUES (3, 'Returned');
INSERT INTO tt_lu_task_status (id, description) VALUES (4, 'Complete');


------------------------------------------------------------------
-- COUNTERPOINT KUDOS                                           --
------------------------------------------------------------------

-- http://c20g.com/apps/db/kudos/kudocategory
CREATE TABLE ck_lu_kudo_category (
	id INTEGER NOT NULL PRIMARY KEY,
	description VARCHAR(30) NOT NULL
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/kudos/kudo
CREATE TABLE ck_kudo (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	kudo_category_id INTEGER NOT NULL,
	creator_cn VARCHAR(30) NOT NULL,
	recipient_cn VARCHAR(30) NOT NULL,
	created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	description TEXT NOT NULL,
	FOREIGN KEY (kudo_category_id) REFERENCES ck_lu_kudo_category (id)
)
ENGINE=InnoDB;

INSERT INTO ck_lu_kudo_category (id, description) VALUES (1, 'Recruiting');
INSERT INTO ck_lu_kudo_category (id, description) VALUES (2, 'Interviewing');
INSERT INTO ck_lu_kudo_category (id, description) VALUES (3, 'Tech Talks');
INSERT INTO ck_lu_kudo_category (id, description) VALUES (4, 'Center of Excellence');
INSERT INTO ck_lu_kudo_category (id, description) VALUES (5, 'Referrals');
INSERT INTO ck_lu_kudo_category (id, description) VALUES (6, 'Corporate Development');
INSERT INTO ck_lu_kudo_category (id, description) VALUES (7, 'Miscellaneous');
INSERT INTO ck_lu_kudo_category (id, description) VALUES (8, 'Internal Development Projects');



------------------------------------------------------------------
-- COUNTERPOINT E-FORMS                                         --
------------------------------------------------------------------

-- http://c20g.com/apps/db/eforms/formfolder
CREATE TABLE form_folder (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	parent_id INTEGER,
	FOREIGN KEY (parent_id) REFERENCES form_folder (id)
)
ENGINE=InnoDB;

-- http://c20g.com/apps/db/eforms/form
CREATE TABLE form_form (
	id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	folder_id INTEGER NOT NULL,
	form_key VARCHAR(20) NOT NULL,
	version INTEGER NOT NULL DEFAULT 1,
	form_name VARCHAR(100) NOT NULL,
	description VARCHAR(1000),
	created_by VARCHAR(30) NOT NULL,
	created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	json TEXT NOT NULL,
	FOREIGN KEY (folder_id) REFERENCES form_folder (id)
)
ENGINE=InnoDB;

