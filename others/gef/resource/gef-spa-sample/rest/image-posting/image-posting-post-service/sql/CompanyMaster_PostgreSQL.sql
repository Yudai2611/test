CREATE TABLE CompanyMaster (
	CompanyCD		 VARCHAR(5)	NOT NULL,
	ParentCD		 VARCHAR(5),
	NAME			 VARCHAR(255),
	STATUS			DECIMAL(1,0)
);

INSERT INTO CompanyMaster VALUES('15', '00', '京セラコミュニケーションシステム', '1');