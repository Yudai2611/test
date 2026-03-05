<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:geframe="http://www.kccs.co.jp/geframe/taglib"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8" />

<gp:includeview id="DatasourceListView">
	<gr:zoomdialog id="DatasourceListZoom" title="データソース一覧画面" options="{width:400, height:450}" style="display:none; padding-left: 31.8px;">
		<gp:ajaxevent event="open" actionbean="sample.ria.fqe.action.DatasourceAction" actionmethod="findAllDatasourceMetadata"  render="DatasourceListFormRender" form="DatasourceListZoomForm" indicator="submit-indicator" grzoomdialog="DatasourceListZoom" validate="none"/>
		<gp:ajaxrender id="DatasourceListFormRender">
			<gp:form id="DatasourceListZoomForm" method="post">
				<gp:list id="datasourceList" style="width:100%; margin-top: 10px; table-layout: fixed;" listsize="10">
					<gp:listcaption>
                        <gp:listpager id="ZDHPager" previous="ZDHPager.Previous" next="ZDHPager.Next" listelement="datasourceList" style="display:block;text-align:right;" >
                            <gp:button id="ZDHPager.Previous"  value="&lt;" title="前ページへ" >
                                <gp:ajaxevent event="click" actionbean="sample.ria.fqe.action.DatasourceAction" actionmethod="findAllDatasourceMetadata" mode="previous" render="DatasourceListFormRender" indicator="[%pfx]ZDHPagerIndicator"/>
                            </gp:button>
                            <gp:button id="ZDHPager.Next"  value="&gt;" title="次ページへ">
                                <gp:ajaxevent event="click" actionbean="sample.ria.fqe.action.DatasourceAction" actionmethod="findAllDatasourceMetadata" mode="next" render="DatasourceListFormRender" indicator="[%pfx]ZDHPagerIndicator" />
                            </gp:button>
                            <div style="display: inline-block; width: 90px; margin-left: 10px;">
                            	<gp:listcountlabel id="DatasourceListCount" listelement="datasourceList" />
                            </div>
                        </gp:listpager>
                    </gp:listcaption>
					<gp:listheader id="DatasourceHeader" styleclass="row" style="text-align: center;">
						<gp:listheaderline >
							<gp:listheadercell id="No_H" style="width:20px;">No.</gp:listheadercell>
							<gp:listheadercell id="DatasourceName_H">データソース名</gp:listheadercell>
						</gp:listheaderline>
					</gp:listheader>
					<gp:listrow id="DatasourceRow" styleclass="row">
						<gp:listrowline>
							<gp:listnumbercell id="No" style="text-align:right;"/>
							<gp:listrowcell id="DatasourceName_C">
								<gp:linkedlabel id="datasourceLabel" >
									<gp:submitevent event="click" actionbean="sample.ria.fqe.action.DatasourceAction" actionmethod="findDatasourceMetadataById" mode="select" forward="dataexport.jsp" indicator="submit-indicator"/>
								</gp:linkedlabel>
								<gp:hidden id="datasourceId"/>
							</gp:listrowcell>
						</gp:listrowline>
					</gp:listrow>
				</gp:list>
			</gp:form>
		</gp:ajaxrender>
	</gr:zoomdialog>
</gp:includeview>
</jsp:root>
