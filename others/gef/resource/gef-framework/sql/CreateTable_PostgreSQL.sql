Create Table GERole ( 
	ObjectID		 CHAR(36)	NOT NULL,
	CompanyCode		 VARCHAR(5)	NOT NULL,
	RoleID			 VARCHAR(50) 	NOT NULL,
	DisplayNameResourceID	 CHAR(36) 	NOT NULL,
	AuthoritySet		 VARCHAR(255),
	Description		 VARCHAR(255),
	UpdatedDT		 TIMESTAMP	NULL,
	UpdatedPerson		 VARCHAR(20),
	ExclusiveFG		 CHAR(36),
	CONSTRAINT PK_GERole PRIMARY KEY
	(
		ObjectID
	)
 ); 
CREATE UNIQUE INDEX AK_GERole_1 
 ON GERole(
	CompanyCode,
	RoleID
);
Create Table GERoleLocalizationResource ( 
	CompanyCode	 VARCHAR(5)	NOT NULL,
	ResourceID 	 CHAR(36) 	NOT NULL,
	Value		 VARCHAR(255),
	Locale		 VARCHAR(20)	NOT NULL,
	CONSTRAINT PK_GERoleLocalizationResource PRIMARY KEY
	(
		CompanyCode,
		ResourceID,
		Locale
	)
 );
CREATE TABLE GEMenu ( 
	ObjectID		 CHAR(36)	NOT NULL,
	CompanyCode		 VARCHAR(5)	NOT NULL,
	MenuID			 VARCHAR(50)	NOT NULL,
	DisplayNameResourceID	 CHAR(36)	NOT NULL,
	ParentMenuObjectID	 CHAR(36),
	ApplicationType		 VARCHAR(50)	NOT NULL,
	MenuType		 VARCHAR(50),
	StartModule		 VARCHAR(255),
	Parameter		 VARCHAR(255),
	IsItem			 DECIMAL(1,0)	NOT NULL,
	Status			 DECIMAL(1,0)	NOT NULL,
	RoleObjectID		 CHAR(36),
	Description		 VARCHAR(255),
	SortIndex		 DECIMAL(4,0),
	UpdatedDT		 TIMESTAMP	NULL,
	UpdatedPerson		 VARCHAR(20),
	ExclusiveFG		 CHAR(36),
	CONSTRAINT PK_GEMenu PRIMARY KEY
	(
		ObjectID
	)
 ); 
CREATE UNIQUE INDEX AK_GEMenu_1
 ON GEMenu(
	CompanyCode,
	MenuID
);
Create Table GEMenuLocalizationResource ( 
	CompanyCode	 	VARCHAR(5)	NOT NULL,
	ResourceID 	 	CHAR(36) 	NOT NULL,
	Value		 	VARCHAR(255),
	Locale		 	VARCHAR(20)	NOT NULL,
	CONSTRAINT PK_GEMenuLocalizationResource PRIMARY KEY
	(
		CompanyCode,
		ResourceID,
		Locale
	)
 );
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
