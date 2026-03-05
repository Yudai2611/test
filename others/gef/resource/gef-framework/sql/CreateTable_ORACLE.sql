Create Table GERole ( 
	ObjectID		 CHAR(36)	NOT NULL,
	CompanyCode		 VARCHAR2(5)	NOT NULL,
	RoleID			 VARCHAR2(50) 	NOT NULL,
	DisplayNameResourceID	 CHAR(36) 	NOT NULL,
	AuthoritySet		 VARCHAR2(1023),
	Description		 VARCHAR2(255),
	UpdatedDT		 DATE,
	UpdatedPerson		 VARCHAR2(20),
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
	CompanyCode	 VARCHAR2(5)	NOT NULL,
	ResourceID 	 CHAR(36) 	NOT NULL,
	Value		 VARCHAR2(1023),
	Locale		 VARCHAR2(20)	NOT NULL,
	CONSTRAINT PK_GERoleLocalizationResource PRIMARY KEY
	(
		CompanyCode,
		ResourceID,
		Locale
	)
 );
CREATE TABLE GEMenu ( 
	ObjectID		 CHAR(36)	NOT NULL,
	CompanyCode		 VARCHAR2(5)	NOT NULL,
	MenuID			 VARCHAR2(50)	NOT NULL,
	DisplayNameResourceID	 CHAR(36)	NOT NULL,
	ParentMenuObjectID	 CHAR(36),
	ApplicationType		 VARCHAR2(50)	NOT NULL,
	MenuType		 VARCHAR2(50),
	StartModule		 VARCHAR2(255),
	Parameter		 VARCHAR2(255),
	IsItem			 NUMBER(1,0)	NOT NULL,
	Status			 NUMBER(1,0)	NOT NULL,
	RoleObjectID		 CHAR(36),
	Description		 VARCHAR2(255),
	SortIndex		 NUMBER(4,0),
	UpdatedDT		 DATE,
	UpdatedPerson		 VARCHAR2(20),
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
	CompanyCode	 	VARCHAR2(5)	NOT NULL,
	ResourceID 	 	CHAR(36) 	NOT NULL,
	Value		 	VARCHAR2(1023),
	Locale		 	VARCHAR2(20)	NOT NULL,
	CONSTRAINT PK_GEMenuLocalizationResource PRIMARY KEY
	(
		CompanyCode,
		ResourceID,
		Locale
	)
 ); 
CREATE TABLE CompanyMaster (
	CompanyCD		 VARCHAR2(5)	NOT NULL,
	ParentCD		 VARCHAR2(5),
	Name			 VARCHAR2(255),
	Status			NUMBER(1,0)
 );
CREATE UNIQUE INDEX AK_CompanyMaster_1
 ON CompanyMaster(
	CompanyCD
);

CREATE TABLE EmploymentRankMaster (
	CompanyCD		VARCHAR2(5)		NOT NULL,
	ID				VARCHAR2(50)	NOT NULL,
	Name			VARCHAR2(255),
	Status			NUMBER(1,0)
 );
CREATE UNIQUE INDEX AK_EmploymentRankMaster_1
 ON EmploymentRankMaster(
	CompanyCD,
	ID
);

CREATE TABLE OrganizationMaster (
	CompanyCD		VARCHAR2(5)		NOT NULL,
	ID			 	VARCHAR2(50)	NOT NULL,
	ParentID		VARCHAR2(50),
	Name			VARCHAR2(255),
	Status			NUMBER(1,0)
 );
CREATE UNIQUE INDEX AK_OrganizationMaster_1
 ON OrganizationMaster(
	CompanyCD,
	ID
);

CREATE TABLE UserMaster (
	CompanyCD		VARCHAR2(5)		NOT NULL,
	ID			 	VARCHAR2(50)	NOT NULL,
	Name			VARCHAR2(255),
	Password		VARCHAR2(50),
	Status			NUMBER(1,0)
 );
CREATE UNIQUE INDEX AK_UserMaster_1
 ON UserMaster(
	CompanyCD,
	ID
);

CREATE TABLE UserOrganizationMap (
	CompanyCD		 	VARCHAR2(5)		NOT NULL,
	UserID			 	VARCHAR2(50)	NOT NULL,
	OrganizationID		VARCHAR2(50)	NOT NULL
 );
CREATE UNIQUE INDEX AK_UserOrganizationMap_1
 ON UserOrganizationMap(
	CompanyCD,
	UserID,
	OrganizationID
);

CREATE TABLE UserRankMap (
	CompanyCD		 VARCHAR2(5)	NOT NULL,
	UserID			 VARCHAR2(50)	NOT NULL,
	RankID			 VARCHAR2(50)	NOT NULL
 );
CREATE UNIQUE INDEX AK_UserRankMap_1
 ON UserRankMap(
	CompanyCD,
	UserID,
	RankID
);