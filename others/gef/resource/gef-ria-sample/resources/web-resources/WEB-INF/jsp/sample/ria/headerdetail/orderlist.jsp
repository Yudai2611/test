<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
<jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">]]></jsp:text>
<gp:view viewclass="sample.ria.headerdetail.OrderListView" scope="request">
<gp:html version="XHTML 1.0 Transitional" xmlns:ghx="http://www.kccs.co.jp/2011/geframe/xhtml1-extension/XMLSchema">
<head>
	<meta http-equiv="Expires" content="0" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Cache-Control" content="no-cache" />
	<meta http-equiv="Content-Style-Type" content="text/css" />
	<meta http-equiv="Content-Script-Type" content="text/javascript" />
	<title>ヘッダー明細一覧画面</title>
	<gp:jspinclude id="Header" page="/WEB-INF/jsp/sample/ria/common/header-ria-inc.jsp"/>
	<link href="${gf:ctxpath()}/public/css/sample.css" rel="stylesheet" type="text/css" charset="utf-8"/>
</head>
<gp:body id="body">
	<gp:jspinclude page="/geframe/jsp/submit-indicator.jsp" id="submit-indicator"/>
		<gr:keybind keycode="13" element="Search" event="click"/>
		<gp:jspinclude id="SystemHeader" page="/WEB-INF/jsp/sample/ria/common/header.jsp"/>
		<gp:form id="formMain" method="post" focus="SlipNO_0">
			<table class="condition" cellspacing="1">
				<tr>
					<td class="label">
						<gp:label id="SlipNO_L" value="伝票番号"/>
					</td>
					<td>
						<gp:text id="SlipNO_0" maxlength="15" size="20" style="ime-mode:disabled">
							<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxByteLengthValidator" args="10" level="error"/>
						</gp:text>
					</td>
				</tr>
				<tr>
					<td class="label">
						<gp:label id="CorporateNA_L" value="取引先名称"/>
					</td>
					<td>
						<gp:text id="CorporateNA_1" maxlength="40" size="65" style="ime-mode:active"/>
					</td>
				</tr>
			</table>
			<br/>
			<gp:button id="Search" value="検索" accesskey="F">
				<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderListAction" actionmethod="doSearch" indicator="submit-indicator" mode="search" forward="orderlist.jsp"/>
			</gp:button>
			<gp:button id="Clear" value="クリア" accesskey="R">
				<gp:clearevent event="click" />
			</gp:button>
			<gp:button id="Entry"  value="登録画面" accesskey="N">
				<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderListAction" actionmethod="doEntry" indicator="submit-indicator" mode="search" forward="orderdetail.jsp" validate="none"/>
			</gp:button>
			<hr width="100%" />
		<gp:ajaxrender id="OrderListRender">
			<gp:list id="OrderList" listsize="10" style="width:100%;" isemptymsg="false">
				<gp:listcaption>
					<gp:listpager id="OrderListPager" first="OrderListPager.First" previous="OrderListPager.Previous" next="OrderListPager.Next" last="OrderListPager.Last" listelement="OrderList" style="display:block;text-align:right;">
						<gr:imgindicator src="${gf:ctxpath()}/geframe/images/ajax-indicator.gif" id="OrderListPagerIndicator" alt="" style="display:none;"/>
						<gp:button id="OrderListPager.First"  value="&lt;&lt;" title="先頭ページへ">
							<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderListAction" actionmethod="doSearch"  indicator="[%pfx]OrderListPagerIndicator" mode="first" forward="orderlist.jsp" options="{destpage:'OrderListPager.First'}"/>
						</gp:button>
						<gp:button id="OrderListPager.Previous"  value="&lt;" title="前ページへ">
							<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderListAction" actionmethod="doSearch" indicator="[%pfx]OrderListPagerIndicator" mode="previous" forward="orderlist.jsp" options="{destpage:'OrderListPager.Previous'}"/>
						</gp:button>
						<gp:listpagination id="OrderListPager.Pagination">
							<gp:ajaxevent event="click" actionbean="sample.ria.headerdetail.OrderListAction" actionmethod="doPaginationSearch" render="OrderListRender" indicator="[%pfx]OrderListPagerIndicator"/>
						</gp:listpagination>
						<gp:button id="OrderListPager.Next"  value="&gt;" title="次ページへ">
							<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderListAction" actionmethod="doSearch" indicator="[%pfx]OrderListPagerIndicator"  mode="next" forward="orderlist.jsp" options="{destpage:'OrderListPager.Next'}"/>
						</gp:button>
						<gp:button id="OrderListPager.Last"  value="&gt;&gt;" title="最終ページへ">
							<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderListAction" actionmethod="doSearch" indicator="[%pfx]OrderListPagerIndicator"  mode="last" forward="orderlist.jsp" options="{destpage:'OrderListPager.Last'}"/>
						</gp:button>
						<gp:listcountlabel id="OrderListPager.ListCount" listelement="OrderList"/>
					</gp:listpager>
				</gp:listcaption>
				<gp:listheader>
					<gp:listheaderline>
						<gp:listheadercell id="No_H" style="width:3%;text-align:right;">No.</gp:listheadercell>
						<gp:listheadercell id="SlipNO_H" style="width:12%;">伝票番号</gp:listheadercell>
						<gp:listheadercell id="CorporateNA_H" style="width:30%;">取引先名称</gp:listheadercell>
						<gp:listheadercell id="CorporateNA_KANA_H" style="width:31%;">取引先名称(カナ)</gp:listheadercell>
						<gp:listheadercell id="UpdatedPerson_H" style="width:12%;text-align:right;">データ更新者</gp:listheadercell>
						<gp:listheadercell id="UpdatedDT_H" style="width:12%;text-align:right;">データ更新日時</gp:listheadercell>
					</gp:listheaderline>
				</gp:listheader>
				<gp:listrow>
					<gp:listrowline>
						<gp:listnumbercell id="No" style="text-align:right;"/>
						<gp:listrowcell id="SlipNO_C">
							<gp:linkedlabel id="SlipNO" >
								<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderListAction" actionmethod="doEdit" forward="orderdetail.jsp" indicator="submit-indicator" validate="none"/>
							</gp:linkedlabel>
						</gp:listrowcell>
						<gp:listrowcell id="CorporateNA_C">
							<gp:label id="CorporateNA" clear="false"/>
						</gp:listrowcell>
						<gp:listrowcell id="CorporateNA_KANA_C">
							<gp:label id="CorporateNA_KANA" clear="false"/>
						</gp:listrowcell>
						<gp:listrowcell id="UpdatedPerson_C">
							<gp:label id="UpdatedPerson" clear="false"/>
						</gp:listrowcell>
						<gp:listrowcell id="UpdatedDT_C">
							<gp:label id="UpdatedDT" clear="false" format="yyyy/MM/dd HH:mm:ss"/>
						</gp:listrowcell>
					</gp:listrowline>
				</gp:listrow>
			</gp:list>
		</gp:ajaxrender>
		</gp:form>
</gp:body>
</gp:html>
</gp:view>
</jsp:root>
