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

insert into `gemenu` (`ObjectID`, `CompanyCode`, `MenuID`, `DisplayNameResourceID`, `ParentMenuObjectID`, `ApplicationType`, `MenuType`, `StartModule`, `Parameter`, `IsItem`, `Status`, `RoleObjectID`, `Description`, `SortIndex`, `UpdatedDT`, `UpdatedPerson`, `ExclusiveFG`) values('ZZZ0648d-f0ce-44f0-aa76-0903ce47bc01','15','HomeREST','ZZZ0648d-f0ce-44f0-aa76-0903ce47bc11',NULL,'SPASampleRest','Entry','/home',NULL,'1','1',NULL,NULL,'0',NULL,NULL,NULL);
insert into `gemenu` (`ObjectID`, `CompanyCode`, `MenuID`, `DisplayNameResourceID`, `ParentMenuObjectID`, `ApplicationType`, `MenuType`, `StartModule`, `Parameter`, `IsItem`, `Status`, `RoleObjectID`, `Description`, `SortIndex`, `UpdatedDT`, `UpdatedPerson`, `ExclusiveFG`) values('ZZZ0648d-f0ce-44f0-aa76-0903ce47bc02','15','PostingPicture','ZZZ0648d-f0ce-44f0-aa76-0903ce47bc12','ZZZ0648d-f0ce-44f0-aa76-0903ce47bc01','SPASampleRest','Entry','/home/application',NULL,'1','1',NULL,NULL,'1',NULL,NULL,NULL);
insert into `gemenulocalizationresource` (`CompanyCode`, `ResourceID`, `Value`, `Locale`) values('15','ZZZ0648d-f0ce-44f0-aa76-0903ce47bc11','Home','en');
insert into `gemenulocalizationresource` (`CompanyCode`, `ResourceID`, `Value`, `Locale`) values('15','ZZZ0648d-f0ce-44f0-aa76-0903ce47bc11','Home','ja');
insert into `gemenulocalizationresource` (`CompanyCode`, `ResourceID`, `Value`, `Locale`) values('15','ZZZ0648d-f0ce-44f0-aa76-0903ce47bc12','Posting　Picture','en');
insert into `gemenulocalizationresource` (`CompanyCode`, `ResourceID`, `Value`, `Locale`) values('15','ZZZ0648d-f0ce-44f0-aa76-0903ce47bc12','画像投稿','ja');
COMMIT;