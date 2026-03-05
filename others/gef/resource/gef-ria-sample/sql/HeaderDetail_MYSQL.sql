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

INSERT INTO GEMenu VALUES('ZZZe1360-2858-4f2e-b0b9-b52b62a43446','15','HeaderDetail','036f674f-2b9d-449c-8fd1-d5eae336270c','ZZZ0648d-f0ce-44f0-aa76-0903ce47bd02','RIAClientItem','Entry','/WEB-INF/jsp/sample/ria/headerdetail/orderlist.jsp',null,1,1,null,null,0,STR_TO_DATE('11-07-22','%y-%m-%d'),'admin','W74I61A27BB4G1YRN19ETH72X7RP8LFF    ');
INSERT INTO GEMenuLocalizationResource VALUES ('15','036f674f-2b9d-449c-8fd1-d5eae336270c','ヘッダー明細更新','ja');
INSERT INTO GEMenuLocalizationResource VALUES ('15','036f674f-2b9d-449c-8fd1-d5eae336270c','HeaderDetail','en');

INSERT INTO SNumbering VALUES ('15','admin',STR_TO_DATE('2010-02-20','%Y-%m-%d'),'admin',STR_TO_DATE('2010-02-20','%Y-%m-%d'),'3115179F2A284C02980CE29FCF850FE7','D02','伝票番号','D',1,999999,1,51);

INSERT INTO ItemMaster VALUES ('15','admin',STR_TO_DATE('2010-01-01','%Y-%m-%d'),'admin',STR_TO_DATE('2010-01-01','%Y-%m-%d'),'04D3C9B7A7124C86AA3C911D9DDF86FA',STR_TO_DATE('2010-02-01','%Y-%m-%d'),STR_TO_DATE('2010-02-02','%Y-%m-%d'),'00001','商品１','ｼｮｳﾋﾝ000001','小','T01',10000,'0','0',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',STR_TO_DATE('2010-01-01','%Y-%m-%d'),'admin',STR_TO_DATE('2010-01-01','%Y-%m-%d'),'879996D990B04EC1A785C772A903FE3F',STR_TO_DATE('2010-02-02','%Y-%m-%d'),STR_TO_DATE('2010-02-03','%Y-%m-%d'),'00002','商品２','ｼｮｳﾋﾝ000002','小','T02',20000,'0','0',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',STR_TO_DATE('2010-01-01','%Y-%m-%d'),'admin',STR_TO_DATE('2010-01-01','%Y-%m-%d'),'E639CA0219FA47E6A769E35F790A351D',STR_TO_DATE('2010-02-02','%Y-%m-%d'),STR_TO_DATE('2010-02-03','%Y-%m-%d'),'00003','商品３','ｼｮｳﾋﾝ000003','小','T03',30000,'0','0',NULL);

COMMIT;