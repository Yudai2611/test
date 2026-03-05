CREATE TABLE CompanyMaster (
	CompanyCD		 VARCHAR(5)	NOT NULL,
	ParentCD		 VARCHAR(5),
	Name			 VARCHAR(255),
	Status			DECIMAL(1,0),
	CONSTRAINT PK_CompanyMaster PRIMARY KEY
	(
		CompanyCD
	)
 );
CREATE UNIQUE INDEX AK_CompanyMaster_1
 ON CompanyMaster(
	CompanyCD
);
CREATE TABLE EmploymentRankMaster (
	CompanyCD		VARCHAR(5)		NOT NULL,
	ID				VARCHAR(50)	NOT NULL,
	Name			VARCHAR(255),
	Status			DECIMAL(1,0),
	CONSTRAINT PK_EmploymentRankMaster PRIMARY KEY
	(
		CompanyCD,
		ID
	)
 );
CREATE UNIQUE INDEX AK_EmploymentRankMaster_1
 ON EmploymentRankMaster(
	CompanyCD,
	ID
);
CREATE TABLE OrganizationMaster (
	CompanyCD		VARCHAR(5)	NOT NULL,
	ID			 	VARCHAR(50)	NOT NULL,
	ParentID		VARCHAR(50),
	Name			VARCHAR(255),
	Status			DECIMAL(1,0),
	CONSTRAINT PK_OrganizationMaster PRIMARY KEY
	(
		CompanyCD,
		ID
	)
 );
CREATE UNIQUE INDEX AK_OrganizationMaster_1
 ON OrganizationMaster(
	CompanyCD,
	ID
);
CREATE TABLE UserMaster (
	CompanyCD		VARCHAR(5)	NOT NULL,
	ID			 	VARCHAR(50)	NOT NULL,
	Name			VARCHAR(255),
	Password		VARCHAR(50),
	Status			DECIMAL(1,0),
	CONSTRAINT PK_UserMaster PRIMARY KEY
	(
		CompanyCD,
		ID
	)
 );
CREATE UNIQUE INDEX AK_UserMaster_1
 ON UserMaster(
	CompanyCD,
	ID
);
CREATE TABLE UserOrganizationMap (
	CompanyCD		 	VARCHAR(5)	NOT NULL,
	UserID			 	VARCHAR(50)	NOT NULL,
	OrganizationID		VARCHAR(50)	NOT NULL,
	CONSTRAINT PK_UserOrganizationMap PRIMARY KEY
	(
		CompanyCD,
		UserID,
		OrganizationID
	)
 );
CREATE UNIQUE INDEX AK_UserOrganizationMap_1
ON UserOrganizationMap(
	CompanyCD,
	UserID,
	OrganizationID
);
CREATE TABLE UserRankMap (
	CompanyCD		 VARCHAR(5)	NOT NULL,
	UserID			 VARCHAR(50)	NOT NULL,
	RankID			 VARCHAR(50)	NOT NULL,
	CONSTRAINT PK_UserRankMap PRIMARY KEY
	(
		CompanyCD,
		UserID,
		RankID
	)
 );
CREATE UNIQUE INDEX AK_UserRankMap_1
ON UserRankMap(
	CompanyCD,
	UserID,
	RankID
);
INSERT INTO CompanyMaster VALUES('15','00','京セラコミュニケーションシステム',1);
INSERT INTO EmploymentRankMaster VALUES('15','kyocera','一般社員',1);
INSERT INTO EmploymentRankMaster VALUES('15','admin','管理者',1);
INSERT INTO OrganizationMaster VALUES('15','ict',NULL,'ICT事業開発本部',1);
INSERT INTO OrganizationMaster VALUES('15','sys','ict','システム開発課',1);
INSERT INTO OrganizationMaster VALUES('15','sys_kyusyu','ict','九州システム開発課',1);
INSERT INTO OrganizationMaster VALUES('15','gijutsu',NULL,'技術本部',1);
INSERT INTO OrganizationMaster VALUES('15','jissou','gijutsu','実装技術課',1);
INSERT INTO UserMaster VALUES('15','admin','Administrator','admin',1);
INSERT INTO UserMaster VALUES('15','kyocera','京セラ太郎','kyocera',1);
INSERT INTO UserOrganizationMap VALUES('15','admin','jissou');
INSERT INTO UserOrganizationMap VALUES('15','kyocera','sys');
INSERT INTO UserRankMap VALUES('15','admin','admin');
INSERT INTO UserRankMap VALUES('15','kyocera','kyocera');
COMMIT;