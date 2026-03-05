CREATE TABLE SNumbering (
	CompanyCD		 VARCHAR(5)	NOT NULL,
	RegisteredPerson	 VARCHAR(20),
	RegisteredDT		 TIMESTAMP	NULL,
	UpdatedPerson		 VARCHAR(20),
	UpdatedDT		 TIMESTAMP	NULL,
	ExclusiveFG		 CHAR(32),
	Code			 VARCHAR(10)	NOT NULL,
	Name			 VARCHAR(40),
	ConstValue		 VARCHAR(10),
	StartValue		 DECIMAL(8,0),
	EndValue		 DECIMAL(8,0),
	IncrementValue		 DECIMAL(8,0),
	CurrentValue		 DECIMAL(8,0),
	CONSTRAINT PK_SNumbering PRIMARY KEY
	(
		CompanyCD,
		Code
	)
 );
CREATE UNIQUE INDEX AK_SNumbering_1
ON SNumbering(
	CompanyCD,
	Code
);

CREATE TABLE ItemMaster (
	CompanyCD		 VARCHAR(5)	NOT NULL,
	RegisteredPerson	 VARCHAR(20),
	RegisteredDT		 TIMESTAMP	NULL,
	UpdatedPerson		 VARCHAR(20),
	UpdatedDT		 TIMESTAMP	NULL,
	ExclusiveFG		 CHAR(32),
	StartDT			 TIMESTAMP	NULL,
	InvalidDT		 TIMESTAMP	NULL,
	ItemCD			 VARCHAR(15)	NOT NULL,
	ItemNA			 VARCHAR(50),
	ItemNA_KANA		 VARCHAR(20),
	Standard		 VARCHAR(20),
	Unit			 VARCHAR(3),
	UnitPrice		 DECIMAL(15,3),
	StockFG			 VARCHAR(1),
	InspectionFG		 VARCHAR(1),
	StockQT			 DECIMAL(6,0),
	CONSTRAINT PK_ItemMaster PRIMARY KEY
	(
		CompanyCD,
		ItemCD
	)
 );
CREATE UNIQUE INDEX AK_ItemMaster_1
ON ItemMaster(
	CompanyCD,
	ItemCD
);

CREATE TABLE UnitMaster ( 
	CompanyCD		 VARCHAR(5)	NOT NULL,
	RegisteredPerson	 VARCHAR(20),
	RegisteredDT		 TIMESTAMP	NULL,
	UpdatedPerson		 VARCHAR(20),
	UpdatedDT		 TIMESTAMP	NULL,
	ExclusiveFG		 CHAR(32),
	Code			 VARCHAR(3)	NOT NULL,
	Name			 VARCHAR(20),
	CONSTRAINT PK_ItemMaster PRIMARY KEY
	(
		CompanyCD,
		Code
	)
 ); 
CREATE UNIQUE INDEX AK_UnitMaster_1 
ON UnitMaster(
	CompanyCD,
	Code
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

INSERT INTO GEMenu VALUES('ZZZ0648d-f0ce-44f0-aa76-0903ce47bd02','15','Sample_KCCS_Menu_ver03','f63039db-a5c2-4319-9e16-88c167b8c4d5','ZZZAAAAVGNXAG5Q6E4FDNG00000000000000','RIAClientCategory',null,null,null,0,1,null,null,0,STR_TO_DATE('11-07-22','%y-%m-%d'),'admin','FJQ8FC1UXA5XDRE1EYS8KQW6LHH81RS3    ');
INSERT INTO GEMenu VALUES('ZZZAAAAVGNXAG5Q6E4FDNG00000000000000','15','Sample_KCCS_Menu','JL7PIRB4RAQWBS3XZRU6DXUQ99U7AFKJ    ',NULL,'RIAClientCategory',NULL,NULL,NULL,0,1,NULL,NULL,0,STR_TO_DATE('11-07-22','%y-%m-%d'),'admin','XOJFOPL6JY5J9XOWCMARGXPB4D38Q2PE    ');
INSERT INTO GEMenuLocalizationResource VALUES('15','JL7PIRB4RAQWBS3XZRU6DXUQ99U7AFKJ    ','GreenEARTH Web Framework','ja');
INSERT INTO GEMenuLocalizationResource VALUES('15','JL7PIRB4RAQWBS3XZRU6DXUQ99U7AFKJ    ','GreenEARTH Web Framework','en');
INSERT INTO GEMenuLocalizationResource VALUES('15','f63039db-a5c2-4319-9e16-88c167b8c4d5','GreenEARTH Framework Sample','ja');
INSERT INTO GEMenuLocalizationResource VALUES('15','f63039db-a5c2-4319-9e16-88c167b8c4d5','GreenEARTH Framework Sample','en');

COMMIT;