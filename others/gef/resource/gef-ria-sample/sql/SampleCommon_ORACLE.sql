CREATE TABLE SNumbering (
	CompanyCD		 VARCHAR2(5)	NOT NULL,
	RegisteredPerson	 VARCHAR2(20),
	RegisteredDT		 DATE,
	UpdatedPerson		 VARCHAR2(20),
	UpdatedDT		 DATE,
	ExclusiveFG		 CHAR(32),
	Code			 VARCHAR2(10)	NOT NULL,
	Name			 VARCHAR2(40),
	ConstValue		 VARCHAR2(10),
	StartValue		 NUMBER(8,0),
	EndValue		 NUMBER(8,0),
	IncrementValue		 NUMBER(8,0),
	CurrentValue		 NUMBER(8,0)
 );
CREATE UNIQUE INDEX AK_SNumbering_1
 ON SNumbering(
	CompanyCD,
	Code
);

CREATE TABLE ItemMaster (
	CompanyCD		 VARCHAR2(5)	NOT NULL,
	RegisteredPerson	 VARCHAR2(20),
	RegisteredDT		 DATE,
	UpdatedPerson		 VARCHAR2(20),
	UpdatedDT		 DATE,
	ExclusiveFG		 CHAR(32),
	StartDT			 DATE,
	InvalidDT		 DATE,
	ItemCD			 VARCHAR2(15)	NOT NULL,
	ItemNA			 VARCHAR2(50),
	ItemNA_KANA		 VARCHAR2(50),
	Standard		 VARCHAR2(20),
	Unit			 VARCHAR2(3),
	UnitPrice		 NUMBER(15,3),
	StockFG			 VARCHAR2(1),
	InspectionFG		VARCHAR2(1),
	StockQT			 NUMBER(6,0)
 );
CREATE UNIQUE INDEX AK_ItemMaster_1
 ON ItemMaster(
	CompanyCD,
	ItemCD
);

CREATE TABLE UnitMaster ( 
	CompanyCD		 VARCHAR2(5)	NOT NULL,
	RegisteredPerson	 VARCHAR2(20),
	RegisteredDT		 DATE,
	UpdatedPerson		 VARCHAR2(20),
	UpdatedDT		 DATE,
	ExclusiveFG		 CHAR(32),
	Code			 VARCHAR2(3)	NOT NULL,
	Name			 VARCHAR2(20)
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

INSERT INTO GEMenu VALUES('ZZZ0648d-f0ce-44f0-aa76-0903ce47bd02','15','Sample_KCCS_Menu_ver03','f63039db-a5c2-4319-9e16-88c167b8c4d5','ZZZAAAAVGNXAG5Q6E4FDNG00000000000000','RIAClientCategory',null,null,null,0,1,null,null,0,to_date('11-07-22','RR-MM-DD'),'admin','FJQ8FC1UXA5XDRE1EYS8KQW6LHH81RS3    ');
INSERT INTO GEMenu VALUES('ZZZAAAAVGNXAG5Q6E4FDNG00000000000000','15','Sample_KCCS_Menu','JL7PIRB4RAQWBS3XZRU6DXUQ99U7AFKJ    ',NULL,'RIAClientCategory',NULL,NULL,NULL,0,1,NULL,NULL,0,to_date('11-07-22','RR-MM-DD'),'admin','XOJFOPL6JY5J9XOWCMARGXPB4D38Q2PE    ');
INSERT INTO GEMenuLocalizationResource VALUES('15','JL7PIRB4RAQWBS3XZRU6DXUQ99U7AFKJ    ','GreenEARTH Web Framework','ja');
INSERT INTO GEMenuLocalizationResource VALUES('15','JL7PIRB4RAQWBS3XZRU6DXUQ99U7AFKJ    ','GreenEARTH Web Framework','en');
INSERT INTO GEMenuLocalizationResource VALUES('15','f63039db-a5c2-4319-9e16-88c167b8c4d5','GreenEARTH Framework Sample','ja');
INSERT INTO GEMenuLocalizationResource VALUES('15','f63039db-a5c2-4319-9e16-88c167b8c4d5','GreenEARTH Framework Sample','en');

COMMIT;