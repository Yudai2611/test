CREATE TABLE OrderHeader (
	CompanyCD		 VARCHAR2(5)	NOT NULL,
	RegisteredPerson	 VARCHAR2(20),
	RegisteredDT		 DATE,
	UpdatedPerson		 VARCHAR2(20),
	UpdatedDT		 DATE,
	ExclusiveFG		 CHAR(32),
	SlipNO			 VARCHAR2(15)	NOT NULL,
	CorporateNA_KANA	 VARCHAR2(40),
	CorporateNA		 VARCHAR2(40)
 );
CREATE UNIQUE INDEX AK_OrderHeader_1
 ON OrderHeader(
	CompanyCD,
	SlipNO
);

CREATE TABLE OrderDetail (
	CompanyCD		 VARCHAR2(5)	NOT NULL,
	RegisteredPerson	 VARCHAR2(20),
	RegisteredDT		 DATE,
	UpdatedPerson		 VARCHAR2(20),
	UpdatedDT		 DATE,
	ExclusiveFG		 CHAR(32),
	SlipNO			 VARCHAR2(15)	NOT NULL,
	DetailNo		NUMBER(3,0)	NOT NULL,
	ItemCD			 VARCHAR2(15)	NOT NULL,
	OrderQT			 NUMBER(6,0),
	UnitPrice		 NUMBER(15,3),
	OrderAT			 NUMBER(12,0),
	StockFG			 VARCHAR2(1),
	InspectionFG		 VARCHAR2(1),
	DeliveryDT		 DATE,
	Remark			 VARCHAR2(100),
	DetailID		 VARCHAR2(32)
 );
CREATE UNIQUE INDEX AK_OrderDetail_1
 ON OrderDetail(
	CompanyCD,
	SlipNO,
	DetailNo
);

INSERT INTO GEMenu VALUES('ZZZe1360-2858-4f2e-b0b9-b52b62a43446','15','HeaderDetail','036f674f-2b9d-449c-8fd1-d5eae336270c','ZZZ0648d-f0ce-44f0-aa76-0903ce47bd02','RIAClientItem','Entry','/WEB-INF/jsp/sample/ria/headerdetail/orderlist.jsp',null,1,1,null,null,0,to_date('11-07-22','RR-MM-DD'),'admin','W74I61A27BB4G1YRN19ETH72X7RP8LFF    ');
INSERT INTO GEMenuLocalizationResource VALUES ('15','036f674f-2b9d-449c-8fd1-d5eae336270c','ヘッダー明細更新','ja');
INSERT INTO GEMenuLocalizationResource VALUES ('15','036f674f-2b9d-449c-8fd1-d5eae336270c','HeaderDetail','en');

INSERT INTO SNumbering VALUES ('15','admin',TO_DATE('2010-02-20','YYYY-MM-DD'),'admin',TO_DATE('2010-02-20','YYYY-MM-DD'),'3115179F2A284C02980CE29FCF850FE7','D02','伝票番号','D',1,999999,1,51);

INSERT INTO ItemMaster VALUES ('15','admin',TO_DATE('2010-01-01','YYYY-MM-DD'),'admin',TO_DATE('2010-01-01','YYYY-MM-DD'),'04D3C9B7A7124C86AA3C911D9DDF86FA',TO_DATE('2010-02-01','YYYY-MM-DD'),TO_DATE('2010-02-02','YYYY-MM-DD'),'00001','商品１','ｼｮｳﾋﾝ000001','小','T01',10000,'0','0',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',TO_DATE('2010-01-01','YYYY-MM-DD'),'admin',TO_DATE('2010-01-01','YYYY-MM-DD'),'879996D990B04EC1A785C772A903FE3F',TO_DATE('2010-02-02','YYYY-MM-DD'),TO_DATE('2010-02-03','YYYY-MM-DD'),'00002','商品２','ｼｮｳﾋﾝ000002','小','T02',20000,'0','0',NULL);
INSERT INTO ItemMaster VALUES ('15','admin',TO_DATE('2010-01-01','YYYY-MM-DD'),'admin',TO_DATE('2010-01-01','YYYY-MM-DD'),'E639CA0219FA47E6A769E35F790A351D',TO_DATE('2010-02-02','YYYY-MM-DD'),TO_DATE('2010-02-03','YYYY-MM-DD'),'00003','商品３','ｼｮｳﾋﾝ000003','小','T03',30000,'0','0',NULL);

COMMIT;