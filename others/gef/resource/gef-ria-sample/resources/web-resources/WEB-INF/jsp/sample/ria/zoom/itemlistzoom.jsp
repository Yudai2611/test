<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<gp:includeview id="ItemListZoomView" viewclass="sample.ria.zoom.ItemListZoomView">
<gr:zoomdialog id="ItemListZoom" title="商品マスタズーム" options="{width:400, height:680}" style="display:none;">
	<gr:imgindicator src="${gf:ctxpath()}/geframe/images/ajax-indicator.gif" id="ZoomItemListOpenIndicator" alt="" style="z-index:1000;display:none;"/>
	<gp:ajaxevent event="open" actionbean="sample.ria.zoom.ItemListZoomAction" actionmethod="doSearch" render="ItemListZoomFormRender" form="itemListZoomForm" indicator="ZoomItemListOpenIndicator" mode="search" grzoomdialog="ItemListZoom" validate="none"/>
	<gp:ajaxrender id="ItemListZoomFormRender">
		<gp:form id="itemListZoomForm" method="post" focus="Code_0">
			<gp:ajaxrender id="ZoomItemListRender">
				<gp:list id="ZoomItemList" style="width:100%" listsize="10" zebrarow="true">
					<gp:listcaption>
						<gp:listpager id="ZoomItemListPager" previous="ZoomItemListPager.Previous" next="ZoomItemListPager.Next" listelement="ZoomItemList" style="display:block;text-align:right;">
							<gr:imgindicator src="${gf:ctxpath()}/geframe/images/ajax-indicator.gif" id="ZoomItemListPagerIndicator" alt="" style="display:none;"/>
							<gp:button id="ZoomItemListPager.Previous"  value="&lt;" title="前ページへ">
								<gp:ajaxevent event="click" actionbean="sample.ria.zoom.ItemListZoomAction" actionmethod="doSearch" render="ZoomItemListRender" indicator="[%pfx]ZoomItemListPagerIndicator" mode="previous" options="{destpage:'ZoomItemListPager.Previous'}"/>
							</gp:button>
							<gp:button id="ZoomItemListPager.Next" value="&gt;" title="次ページへ">
								<gp:ajaxevent event="click" actionbean="sample.ria.zoom.ItemListZoomAction" actionmethod="doSearch" render="ZoomItemListRender" indicator="[%pfx]ZoomItemListPagerIndicator" mode="next" options="{destpage:'ZoomItemListPager.Next'}"/>
							</gp:button>
							<gp:listcountlabel id="ZoomItemListPager.ListCount" listelement="ZoomItemList"/>
						</gp:listpager>
					</gp:listcaption>
					<gp:listheader>
						<gp:listheaderline>
							<gp:listheadercell id="ItemCD_H" style="text-align:left;white-space:nowrap;">商品コード</gp:listheadercell>
							<gp:listheadercell id="ItemNA_H" style="text-align:left;white-space:nowrap;">商品名称</gp:listheadercell>
							<gp:listheadercell id="UnitPrice_H" style="text-align:right;white-space:nowrap;">単価</gp:listheadercell>
						</gp:listheaderline>
					</gp:listheader>
					<gp:listrow>
						<gp:listrowline>
							<gp:listrowcell id="ItemCD_0_C" style="text-align:left;white-space:nowrap;">
								<gp:linkedlabel id="ItemCD" >
									<gr:zoomcloseevent element="ItemListZoom" event="click">
										<gr:zoomreturn key="key1" element="[%pfx]ItemCD"/>
										<gr:zoomreturn key="key2" element="[%pfx]ItemNA"/>
										<gr:zoomreturn key="key3" element="[%pfx]UnitPrice"/>
									</gr:zoomcloseevent>
								</gp:linkedlabel>
							</gp:listrowcell>
							<gp:listrowcell id="ItemNA_C" style="text-align:left;white-space:nowrap;">
								<gp:label id="ItemNA"/>
							</gp:listrowcell>
							<gp:listrowcell id="UnitPrice_C" style="text-align:right;white-space:nowrap;">
								<gp:label id="UnitPrice" format="###,##0.###" />
							</gp:listrowcell>
						</gp:listrowline>
					</gp:listrow>
				</gp:list>
			</gp:ajaxrender>
		</gp:form>
		<hr/>
		<div style="text-align:center">
			<gp:button id="ItemListZoomClose" value="閉じる" accesskey="x">
				<gp:widgetevent element="ItemListZoom" event="click" widgetname="grzoomdialog" method="close" />
			</gp:button>
		</div>
	</gp:ajaxrender>
</gr:zoomdialog>
</gp:includeview>
</jsp:root>