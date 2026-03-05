CREATE TABLE OrderHeader (
	CompanyCD		 VARCHAR(5)	NOT NULL,
	RegisteredPerson	 VARCHAR(20),
	RegisteredDT		 TIMESTAMP	NULL,
	UpdatedPerson		 VARCHAR(20),
	UpdatedDT		 TIMESTAMP	NULL,
	ExclusiveFG		 CHAR(32),
	SlipNO			 VARCHAR(15)	NOT NULL,
	CorporateNA_KANA	 VARCHAR(40),
	CorporateNA		 VARCHAR(40),
	CONSTRAINT PK_OrderHeader PRIMARY KEY
	(
		CompanyCD,
		SlipNO
	)
 );
CREATE UNIQUE INDEX AK_OrderHeader_1
ON OrderHeader(
	CompanyCD,
	SlipNO
);

CREATE TABLE OrderDetail (
	CompanyCD		 VARCHAR(5)	NOT NULL,
	RegisteredPerson	 VARCHAR(20),
	RegisteredDT		 TIMESTAMP	NULL,
	UpdatedPerson		 VARCHAR(20),
	UpdatedDT		 TIMESTAMP	NULL,
	ExclusiveFG		 CHAR(32),
	SlipNO			 VARCHAR(15)	NOT NULL,
	DetailNo		DECIMAL(3,0)	NOT NULL,
	ItemCD			 VARCHAR(15)	NOT NULL,
	OrderQT			 DECIMAL(6,0),
	UnitPrice		 DECIMAL(15,3),
	OrderAT			 DECIMAL(12,0),
	StockFG			 VARCHAR(1),
	InspectionFG		 VARCHAR(1),
	DeliveryDT		 TIMESTAMP	NULL,
	Remark			 VARCHAR(100),
	DetailID		 VARCHAR(32),
	CONSTRAINT PK_OrderDetail PRIMARY KEY
	(
		CompanyCD,
		SlipNO,
		DetailNo
	)
 );
CREATE UNIQUE INDEX AK_OrderDetail_1
ON OrderDetail(
	CompanyCD,
	SlipNO,
	DetailNo
);
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
	CONSTRAINT PK_ItemMaster_1 PRIMARY KEY
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

INSERT INTO SNumbering VALUES ('15','admin',to_date('2010-02-20','%Y-%m-%d'),'admin',to_date('2010-02-20','%Y-%m-%d'),'3115179F2A284C02980CE29FCF850FE7','D02','伝票番号','D',1,999999,1,51);

INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item001','名００１','カナ００１','大','T01',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item002','名００２','カナ００２','大','T02',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item003','名００３','カナ００３','大','T03',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item004','名００４','カナ００４','大','T04',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item005','名００５','カナ００５','大','T05',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item006','名００６','カナ００６','大','T06',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item007','名００７','カナ００７','大','T07',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item008','名００８','カナ００８','大','T08',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item009','名００９','カナ００９','大','T09',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item010','名０１０','カナ０１０','大','T10',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item011','名０１１','カナ０１１','大','T11',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item012','名０１２','カナ０１２','大','T12',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item013','名０１３','カナ０１３','大','T13',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item014','名０１４','カナ０１４','大','T14',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item015','名０１５','カナ０１５','大','T15',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item016','名０１６','カナ０１６','大','T16',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item017','名０１７','カナ０１７','大','T17',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item018','名０１８','カナ０１８','大','T18',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item019','名０１９','カナ０１９','大','T19',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item020','名０２０','カナ０２０','大','T20',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item021','名０２１','カナ０２１','大','T21',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item022','名０２２','カナ０２２','大','T22',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item023','名０２３','カナ０２３','大','T23',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item024','名０２４','カナ０２４','大','T24',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item025','名０２５','カナ０２５','大','T25',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item026','名０２６','カナ０２６','大','T26',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item027','名０２７','カナ０２７','大','T27',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item028','名０２８','カナ０２８','大','T28',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item029','名０２９','カナ０２９','大','T29',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item030','名０３０','カナ０３０','大','T30',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item031','名０３１','カナ０３１','大','T31',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item032','名０３２','カナ０３２','大','T32',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item033','名０３３','カナ０３３','大','T33',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item034','名０３４','カナ０３４','大','T34',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item035','名０３５','カナ０３５','大','T35',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item036','名０３６','カナ０３６','大','T36',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item037','名０３７','カナ０３７','大','T37',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item038','名０３８','カナ０３８','大','T38',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item039','名０３９','カナ０３９','大','T39',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item040','名０４０','カナ０４０','大','T40',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item041','名０４１','カナ０４１','大','T41',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item042','名０４２','カナ０４２','大','T42',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item043','名０４３','カナ０４３','大','T43',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item044','名０４４','カナ０４４','大','T44',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item045','名０４５','カナ０４５','大','T45',1234.567,'1','1',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',to_date('2007-01-01','%Y-%m-%d'),'admin',to_date('2007-01-01','%Y-%m-%d'),NULL,to_date('2007-01-07','%Y-%m-%d'),to_date('2007-07-31','%Y-%m-%d'),'item046','名０４６','カナ０４６','大','T46',1234.567,'1','1',NULL);

INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'3798519715644A5A9872AB39F989D889','D00001',1,'00001',11,11111.001,122221,'0','0',to_date('11-11-11','%Y-%m-%d'),'明細１','F91601051D8E4B8DA7F6E6BDB16565BE');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'14B314E60FB14794B5D1F52AF32F45FE','D00001',2,'00002',2000,200,400000,'1','1',to_date('30-01-01','%Y-%m-%d'),'明細２&#xA;明細２','3312AA0D8371491192866B581D4C329B');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'640A9CBF5F8743FE8BB81662448F110A','D00003',1,'00001',11,11111.001,122221,'1','1',to_date('11-11-11','%Y-%m-%d'),'明細１','DB06EC93993447E7B7AAB3EEDA654F41');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'850A84F64E8849928D21A83A4E3AABCA','D00004',1,'00001',11,11111.001,122221,'1','1',to_date('11-11-11','%Y-%m-%d'),'明細１','9779896BFE40427D9C812E082E9BE0AD');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'67DDE1C76AEF45AD98681C6302248CCE','D00004',2,'00002',22,22222.002,488884,'0','0',to_date('22-02-02','%Y-%m-%d'),'明細２','A989AEB3498C4EC2AB49F66EC70B94C7');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'48D494626AB74FACA0FCBBE96AF5F30D','D00004',3,'00003',33,33333.003,1099989,'0','0',to_date('33-03-03','%Y-%m-%d'),'明細３','97B3A9198E9D42A18E50C626CFAF18FF');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'B77CA49DFB5E428E9E3E66A9E34F2758','D00006',1,'00001',11,11111.001,122221,'0','0',to_date('11-11-11','%Y-%m-%d'),'明細１','BCADC0037FF84A788CC4E9AEB149FBC1');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'22724BB10CF9471A943AE6EFB9CACD9A','D00007',1,'00001',11,11111.001,122221,'1','1',to_date('11-11-11','%Y-%m-%d'),'明細１','4F13A08FBA9E4DE79BC54BECBDB6BF31');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'B3E4A38892DA450CBFB76A75AA74B471','D00007',2,'00002',22,22222.002,488884,'0','0',to_date('22-02-02','%Y-%m-%d'),'明細２','62ADC1E169AB4047B155A02726ADC0BC');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'692C2DF46DD3411FB7A9B2AB4CF02E47','D00007',3,'00003',33,33333.003,1099989,'0','0',to_date('33-03-03','%Y-%m-%d'),'明細３','53BD414288F44D78BC497B128E835138');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'7B94ADCD18E748B2A1A96235CEB20F86','D00009',1,'00001',11,11111.001,122221,'1','1',to_date('11-11-11','%Y-%m-%d'),'明細１','AA354C7EA46744699BA731077CEB148B');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'1DE20AD5374A4DD0A9F6138D1DBF9E96','D00009',2,'00002',22,22222.002,488884,'0','0',to_date('22-02-02','%Y-%m-%d'),'明細２','20131AFF77D749B7B0E8802FEF4E0705');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'2947E540388F4D30B1C6CB8CBF4A7152','D00009',3,'00003',33,33333.003,1099989,'0','0',to_date('33-03-03','%Y-%m-%d'),'明細３','E3236B42AF064BED90721C2A22F54E7D');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'4385954BA4E240F0853159E31346CC4B','D00009',4,'00001',11,11111.001,122221,'0','0',to_date('33-03-03','%Y-%m-%d'),'明細４','021CE43FB3074BC5AF992FC12F5FE557');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'B0AC8AD2DA084A278B299208F7701495','D00009',5,'00001',11,11111.001,122221,'1','0',to_date('33-03-03','%Y-%m-%d'),'明細５','DBE7F9A7CD6D47AC890CA127A90FA2FE');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'b522197688574d119ecd36518539c099','D00024',1,'item001',11,1234.567,13580,'1','1',to_date('33-03-03','%Y-%m-%d'),'明細１','IRAP5Y1QGYE38E7JLABTLPQE91PIS3DL');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'b2a269e69dcc4326b833128159842e57','D00024',2,'item002',22,1234.567,27160,'0','0',to_date('33-03-03','%Y-%m-%d'),'明細２','OISODNCKVFF53Q964U6XGTI4KMYQVEB4');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'c89d60d6f7cc4c54b724218e9c7fe095','D00024',3,'item003',33,1234.567,40741,'0','0',to_date('33-03-03','%Y-%m-%d'),'明細３','W67DIM3TQ86VQVAY5S2KPT9CV0MLQUL1');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'bc6b22f3b2e44c31b1a64dbbc0c93adc','D00025',1,'item001',11,1234.567,13580,'1','1',to_date('33-03-03','%Y-%m-%d'),'明細１','OJC4TL2S35Y8596RG8AZ7GQ4CERJSMFO');
INSERT INTO OrderDetail VALUES ('15','admin',to_date('10-02-20','%y-%m-%d'),'admin',to_date('10-02-20','%Y-%m-%d'),'B0AC8AD2DA084A278B299208F7701495','D00026',1,'item001',11,1234.567,13580,'1','1',to_date('11-11-11','%Y-%m-%d'),'明細１','DBE7F9A7CD6D47AC890CA127A90FA2FE');

INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-01','%y-%m-%d'),'admin',to_date('10-01-01','%y-%m-%d'),'FA2C766223724957A19756314F2584AD','D00001','ﾄﾘﾋｷｻｷ001','取引先001');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-02','%y-%m-%d'),'admin',to_date('10-01-02','%y-%m-%d'),'C7A957956A3D4E22A8648359CB65360F','D00002','ﾄﾘﾋｷｻｷ002','取引先002');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-03','%y-%m-%d'),'admin',to_date('10-01-03','%y-%m-%d'),'8E819D2984AD4C27BFE6860BB405E34C','D00003','ﾄﾘﾋｷｻｷ003','取引先003');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-04','%y-%m-%d'),'admin',to_date('10-01-04','%y-%m-%d'),'9EB2B598F1E544BCA13A054F522B26FA','D00004','ﾄﾘﾋｷｻｷ004','取引先004');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-05','%y-%m-%d'),'admin',to_date('10-01-05','%y-%m-%d'),'070C82339B8B412FBE8065C85BC89E02','D00005','ﾄﾘﾋｷｻｷ005','取引先005');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-06','%y-%m-%d'),'admin',to_date('10-01-06','%y-%m-%d'),'A2BFF620345D4679A7884C1B030F9BEE','D00006','ﾄﾘﾋｷｻｷ006','取引先006');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-07','%y-%m-%d'),'admin',to_date('10-01-07','%y-%m-%d'),'69F0F6CCB0EC4EF68E5CE1A33137DC82','D00007','ﾄﾘﾋｷｻｷ007','取引先007');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-08','%y-%m-%d'),'admin',to_date('10-01-08','%y-%m-%d'),'391C05ADE7C5433EA8F41A3E2AB0998B','D00008','ﾄﾘﾋｷｻｷ008','取引先008');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-09','%y-%m-%d'),'admin',to_date('10-01-09','%y-%m-%d'),'13FB0A681FA04D72B761A882122F35D9','D00009','ﾄﾘﾋｷｻｷ009','取引先009');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-10','%y-%m-%d'),'admin',to_date('10-01-10','%y-%m-%d'),'6D64144D38394FCCBE87ED6EFDE46054','D00010','ﾄﾘﾋｷｻｷ010','取引先010');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-11','%y-%m-%d'),'admin',to_date('10-01-11','%y-%m-%d'),'6E3C8211ABD94D7D82DE433F699A8469','D00011','ｶｲｼｬ011','会社011');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-12','%y-%m-%d'),'admin',to_date('10-01-12','%y-%m-%d'),'3AF5611D7F8B4B5B84CA3221E1F99B17','D00012','ｶｲｼｬ012','会社012');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-13','%y-%m-%d'),'admin',to_date('10-01-13','%y-%m-%d'),'BE0EEC6FFE2E48839F5297AA45430836','D00013','ｶｲｼｬ013','会社013');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-14','%y-%m-%d'),'admin',to_date('10-01-14','%y-%m-%d'),'97382861B5BA40E08232E8B1EAC2069A','D00014','ｶｲｼｬ014','会社014');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-15','%y-%m-%d'),'admin',to_date('10-01-15','%y-%m-%d'),'7B01E4DF69E7482681D4C9715B769C07','D00015','ｶｲｼｬ015','会社015');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-16','%y-%m-%d'),'admin',to_date('10-01-16','%y-%m-%d'),'670DA99F34174CD3A36B7A07BA64285D','D00016','ｶｲｼｬ016','会社016');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-17','%y-%m-%d'),'admin',to_date('10-01-17','%y-%m-%d'),'C47E9D6426B9486E8F8A6D8C9A00D79F','D00017','ｶｲｼｬ017','会社017');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-18','%y-%m-%d'),'admin',to_date('10-01-18','%y-%m-%d'),'363D4FD18B18478B82360106C0586A1E','D00018','ｶｲｼｬ018','会社018');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-19','%y-%m-%d'),'admin',to_date('10-01-19','%y-%m-%d'),'4292E1F243F64BB8959871FF13F1B820','D00019','ｶｲｼｬ019','会社019');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-20','%y-%m-%d'),'admin',to_date('10-01-20','%y-%m-%d'),'8B41C889B3B3497BBC3252B6376731C6','D00020','ｶｲｼｬ020','会社020');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-21','%y-%m-%d'),'admin',to_date('10-01-21','%y-%m-%d'),'1C8D20BFE69147C480AA612B6C05766B','D00021','ｶｲｼｬ021','会社021');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-22','%y-%m-%d'),'admin',to_date('10-01-22','%y-%m-%d'),'D33C326A24464CEEB384FFE7D4B0971D','D00022','ｶｲｼｬ022','会社022');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-23','%y-%m-%d'),'admin',to_date('10-01-23','%y-%m-%d'),'191388498308489B86A854055572F200','D00023','ｶｲｼｬ023','会社023');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-24','%y-%m-%d'),'admin',to_date('10-01-24','%y-%m-%d'),'147E4EFDC3C44C228726C4FF7D1B59BE','D00024','ｶｲｼｬ024','会社024');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-25','%y-%m-%d'),'admin',to_date('10-01-25','%y-%m-%d'),'CC6BDFF60BD340BDB99460928AD8CEE3','D00025','ｶｲｼｬ025','会社025');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-26','%y-%m-%d'),'admin',to_date('10-01-26','%y-%m-%d'),'F4B5E440D1C148908386F220FAD53E5D','D00026','ｶｲｼｬ026','会社026');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-27','%y-%m-%d'),'admin',to_date('10-01-27','%y-%m-%d'),'912F8CF826F94EE6A413AA6AE349F815','D00027','ｶｲｼｬ027','会社027');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-28','%y-%m-%d'),'admin',to_date('10-01-28','%y-%m-%d'),'CBCF6FC46035479EBFDB033D6BFD9A0F','D00028','ｶｲｼｬ028','会社028');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-29','%y-%m-%d'),'admin',to_date('10-01-29','%y-%m-%d'),'3F06CD51F81F41618DACB53A3839703B','D00029','ｶｲｼｬ029','会社029');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-30','%y-%m-%d'),'admin',to_date('10-01-30','%y-%m-%d'),'64423D280EAC4B659AFC12D7A559F4D1','D00030','ｶｲｼｬ030','会社030');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-01-31','%y-%m-%d'),'admin',to_date('10-01-31','%y-%m-%d'),'AF749CA297624A6AA7CEDEAA4A1C1C04','D00031','ｶｲｼｬ031','会社031');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-01','%y-%m-%d'),'admin',to_date('10-02-01','%y-%m-%d'),'2F4ADD8C9B064DE198F00F96B3B954F9','D00032','ｶｲｼｬ032','会社032');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-02','%y-%m-%d'),'admin',to_date('10-02-02','%y-%m-%d'),'618C8BBA9BCF41038356895AC9CE49C1','D00033','ｶｲｼｬ033','会社033');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-03','%y-%m-%d'),'admin',to_date('10-02-03','%y-%m-%d'),'4092DCE2778644CEB5653A3AD68BBA1F','D00034','ｶｲｼｬ034','会社034');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-04','%y-%m-%d'),'admin',to_date('10-02-04','%y-%m-%d'),'F54F54B8777D4B338BAFE6A7B0C48339','D00035','ｶｲｼｬ035','会社035');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-05','%y-%m-%d'),'admin',to_date('10-02-05','%y-%m-%d'),'7EDADF0A53CA43B5AC2BD0304C2BF4A1','D00036','ｶｲｼｬ036','会社036');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-06','%y-%m-%d'),'admin',to_date('10-02-06','%y-%m-%d'),'BF8673C53F684780BECDFBA3A7FB171C','D00037','ｶｲｼｬ037','会社037');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-07','%y-%m-%d'),'admin',to_date('10-02-07','%y-%m-%d'),'CB6DE47568F648AE82CB7E589DA505C4','D00038','ｶｲｼｬ038','会社038');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-08','%y-%m-%d'),'admin',to_date('10-02-08','%y-%m-%d'),'49FDEF7D68BB412088AD583B2798AD74','D00039','ｶｲｼｬ039','会社039');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-09','%y-%m-%d'),'admin',to_date('10-02-09','%y-%m-%d'),'01BA30C4F0E440869F2A840E8CAD88E7','D00040','ｶｲｼｬ040','会社040');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-10','%y-%m-%d'),'admin',to_date('10-02-10','%y-%m-%d'),'173D6464AD7C450181F18F8AA91C4D95','D00041','ｶｲｼｬ041','会社041');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-11','%y-%m-%d'),'admin',to_date('10-02-11','%y-%m-%d'),'715472B8CECE4332AC2643B6C1D227BC','D00042','ｶｲｼｬ042','会社042');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-12','%y-%m-%d'),'admin',to_date('10-02-12','%y-%m-%d'),'2F9FEE8E4DCC4A7D9A4783489AC345A6','D00043','ｶｲｼｬ043','会社043');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-13','%y-%m-%d'),'admin',to_date('10-02-13','%y-%m-%d'),'2FF4AC2577804F55AB408A577CACFE3D','D00044','ｶｲｼｬ044','会社044');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-14','%y-%m-%d'),'admin',to_date('10-02-14','%y-%m-%d'),'E7C5B4FBCE2B416188628066ECBA623D','D00045','ｶｲｼｬ045','会社045');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-15','%y-%m-%d'),'admin',to_date('10-02-15','%y-%m-%d'),'4D579652C21A4404A1996BC1B86898A8','D00046','ｶｲｼｬ046','会社046');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-16','%y-%m-%d'),'admin',to_date('10-02-16','%y-%m-%d'),'F0953C71DCFE4672BC60978EADF6B6E9','D00047','ｶｲｼｬ047','会社047');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-17','%y-%m-%d'),'admin',to_date('10-02-17','%y-%m-%d'),'218BC471F61C4388A7D91B2B195C7C7D','D00048','ｶｲｼｬ048','会社048');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-18','%y-%m-%d'),'admin',to_date('10-02-18','%y-%m-%d'),'925F31A1F8A24CE39D98B0621451625A','D00049','ｶｲｼｬ049','会社049');
INSERT INTO OrderHeader VALUES ('15','admin',to_date('10-02-19','%y-%m-%d'),'admin',to_date('10-02-19','%y-%m-%d'),'C25520436A864E11A145BCF730CF5E2E','D00050','ｶｲｼｬ050','会社050');

COMMIT;