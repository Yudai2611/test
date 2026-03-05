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

insert into gemenu (ObjectID, CompanyCode, MenuID, DisplayNameResourceID, ParentMenuObjectID, ApplicationType, MenuType, StartModule, Parameter, IsItem, Status, RoleObjectID, Description, SortIndex, UpdatedDT, UpdatedPerson, ExclusiveFG) values('ZZZ0648d-f0ce-44f0-aa76-0903ce47bc12','15','HeaderDetailRIA','ZZZ0648d-f0ce-44f0-aa76-0903ce47br12','ZZZ0648d-f0ce-44f0-aa76-0903ce47bc11','SPASampleRIA','Entry','/home/application',NULL,'1','1',NULL,NULL,'2',NULL,NULL,NULL);
insert into gemenu (ObjectID, CompanyCode, MenuID, DisplayNameResourceID, ParentMenuObjectID, ApplicationType, MenuType, StartModule, Parameter, IsItem, Status, RoleObjectID, Description, SortIndex, UpdatedDT, UpdatedPerson, ExclusiveFG) values('ZZZ0648d-f0ce-44f0-aa76-0903ce47bc11','15','HomeRIA','ZZZ0648d-f0ce-44f0-aa76-0903ce47br11',NULL,'SPASampleRIA','Entry','/home',NULL,'1','1',NULL,NULL,'1',NULL,NULL,NULL);
insert into gemenulocalizationresource (CompanyCode, ResourceID, Value, Locale) values('15','ZZZ0648d-f0ce-44f0-aa76-0903ce47br11','Home','en');
insert into gemenulocalizationresource (CompanyCode, ResourceID, Value, Locale) values('15','ZZZ0648d-f0ce-44f0-aa76-0903ce47br11','Home','ja');
insert into gemenulocalizationresource (CompanyCode, ResourceID, Value, Locale) values('15','ZZZ0648d-f0ce-44f0-aa76-0903ce47br12','Header Detail','en');
insert into gemenulocalizationresource (CompanyCode, ResourceID, Value, Locale) values('15','ZZZ0648d-f0ce-44f0-aa76-0903ce47br12','ヘーダ明細','ja');
COMMIT;