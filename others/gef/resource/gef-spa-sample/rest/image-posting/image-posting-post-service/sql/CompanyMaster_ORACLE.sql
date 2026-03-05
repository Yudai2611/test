CREATE TABLE CompanyMaster (
	CompanyCD		 VARCHAR2(5)	NOT NULL,
	ParentCD		 VARCHAR2(5),
	NAME			 VARCHAR2(255),
	STATUS			NUMBER(1,0)
);

INSERT INTO CompanyMaster VALUES('15', '00', '京セラコミュニケーションシステム', '1');