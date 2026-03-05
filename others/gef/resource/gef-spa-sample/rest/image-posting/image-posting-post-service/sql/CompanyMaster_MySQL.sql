CREATE TABLE CompanyMaster (
	CompanyCD CHAR(5) NOT NULL,
	ParentCD CHAR(5),
	NAME CHAR(255),
	STATUS INT(1)
);
INSERT INTO CompanyMaster VALUES('15', '00', '京セラコミュニケーションシステム', '1');