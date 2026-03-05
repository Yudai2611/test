<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
<jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">]]></jsp:text>
<gp:view viewclass="sample.ria.headerdetail.OrderDetailView" scope="session">
<gp:html version="XHTML 1.0 Transitional" xmlns:ghx="http://www.kccs.co.jp/2011/geframe/xhtml1-extension/XMLSchema">
<head>
	<meta http-equiv="Expires" content="0" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Cache-Control" content="no-cache" />
	<meta http-equiv="Content-Style-Type" content="text/css" />
	<meta http-equiv="Content-Script-Type" content="text/javascript" />
	<title>ヘッダー明細更新画面</title>
	<gp:jspinclude id="Header" page="/WEB-INF/jsp/sample/ria/common/header-ria-inc.jsp"/>
	<link href="${gf:ctxpath()}/public/css/sample.css" rel="stylesheet" type="text/css" charset="utf-8"/>
	<gp:script type="text/javascript" src="${gf:ctxpath()}/public/js/sample.js" charset="utf-8"/>
	<gp:script type="text/javascript" charset="utf-8">
	<![CDATA[
	function calculateOrderAT(src) {
		var srcid = src.id.split(".");
		var index = srcid[1];
		try{
			var $orderqt = $.ge.idSelector("OrderDetailList." + index + ".OrderQT");
			var $unitprice = $.ge.idSelector("OrderDetailList." + index + ".UnitPrice");
			var $orderat = $.ge.idSelector("OrderDetailList." + index + ".OrderAT");

			//","（カンマ）の除去
			var rgexp = new RegExp(",", "g");
			qt = eval($orderqt.val().replace(rgexp, ""));
			price = eval($unitprice.val().replace(rgexp, ""));


			//合計金額の計算
			$orderat.val(qt * price);

			//数値以外なら出力しない
			if(isNaN($orderat.val())){
				$orderat.val("");
				return;
			}

			//最大値を超えた場合
			max = 9999 * 99999999.999
			if(parseInt($orderat.val()) >= max ){
				$orderat.val("Nan");
			}

			str = $orderat.val();

			//小数点以下の繰上げ
			str = Math.round($orderat.val()).toString();

			$orderat.val(commaGrant(str));

			//orderat.value = n;

			//伝票の合計金額を計算
			var $allAT = $.ge.idSelector("AllAT");

			listsize = $("#OrderDetailList")[0].rows.length;
			listsize = (listsize-2)/2;
			sumAT =  0 ;
			for ( i=0; listsize > i; i++)
			{
				var $detailAT = $.ge.idSelector("OrderDetailList." + i + ".OrderAT");
				if (!$detailAT.length) continue;
				//カンマの除去

				var regexp = new RegExp(",", "g");
				numberDetail = eval($detailAT.val().replace(regexp, ""));

				if (isNaN(numberDetail) ) {
					numberDetail = 0;
				}
				sumAT += numberDetail;

			}

			$allAT.val(commaGrant(sumAT.toString()));


		} catch (e) { $orderat.val("");throw e;}

		return;
	}

	function commaGrant(str) {
		cnt = 0;
			n= "";

			//","（カンマ）の付与
			for (i = str.length - 1; i >= 0; i--)
			{
				n = str.charAt(i) + n;

				//合計金額が負の値の処理
				if (i > 0){
					if (str.charAt(i - 1) == "-"){
						cnt = 0;
					}
				}

				cnt++;
				if (cnt % 3 == 0){
					if (i != 0){
						n = "," + n;
					}
				}
			}
		return n;
	}
	]]>
	</gp:script>
</head>
<gp:body>
	<gp:div id="blockdiv">
		<gr:keybind keycode="13" element="EntryH" event="click"/>
		<gr:keybind keycode="13" element="UpdateH" event="click"/>
		<gp:jspinclude id="SystemHeader" page="/WEB-INF/jsp/sample/ria/common/header.jsp" />
		<gr:errordialog elements=",formMain" id="edialog" options="{width:700,height:240}" title="${gf:resource('VALIDATE-RESULT-VIEW')}" style="display:none;" errorlabel="${gf:resource('VALIDATE-ERRORS')}" anchor="true">
			<gp:jspinclude id="error" page="/WEB-INF/jsp/sample/ria/common/validate-error.jsp"/>
		</gr:errordialog>
		<gp:jspinclude id="ItemListZoom-inc" page="/WEB-INF/jsp/sample/ria/zoom/itemlistzoom.jsp" flush="true"/>
		<gp:form id="formMain" method="post" focus="CorporateNA_KANA">
			<gp:button id="EntryH" value="登録" accesskey="I">
				<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderDetailAction" actionmethod="doInsert" forward="orderlist.jsp" mode="insert" indicator="submit-indicator" dialogmsg="登録しますか？"/>
			</gp:button>
			<gp:button id="UpdateH" value="更新" accesskey="U">
				<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderDetailAction" actionmethod="doUpdate" forward="orderlist.jsp" mode="update" indicator="submit-indicator" dialogmsg="更新しますか？"/>
			</gp:button>
			<gp:button id="DeleteH" value="伝票削除" accesskey="B">
				<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderDetailAction" actionmethod="doDelete" forward="orderlist.jsp" mode="delete" indicator="submit-indicator" dialogmsg="伝票を削除しますか？"/>
			</gp:button>
			<gp:button id="AddRowH" value="行追加" accesskey="A"/>
			<gp:button id="DeleteRowH"  value="明細削除" accesskey="L">
				<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderDetailAction" actionmethod="doDeleteRow" forward="orderlist.jsp" mode="deleterow" indicator="submit-indicator" dialogmsg="選択明細を削除しますか？"/>
			</gp:button>
			<gp:button id="CancelH"  value="キャンセル" accesskey="C">
				<gp:submitevent event="click" actionbean="sample.ria.headerdetail.OrderDetailAction" actionmethod="doCancel" forward="orderlist.jsp" mode="cancel" indicator="submit-indicator" dialogmsg="前画面に戻りますか？" validate="none"/>
			</gp:button>
			<br/>
			<gp:hidden id="AddRowSize" value="1"/>
			<br />
			<table class="condition" cellspacing="1">
				<gp:hidden id="ExclusiveFG" />
				<tr>
					<td class="label">
						<gp:label id="lblSlipNO" value="伝票番号"/>
					</td>
					<td><gp:label id="SlipNO" /></td>
				</tr>
				<tr>
					<td class="label">
						<gp:label id="lblCorporateNA_KANA_Condition" value="取引先名称（カナ）"/>
					</td>
					<td>
						<gp:text id="CorporateNA_KANA" maxlength="40" size="65" label="取引先名称（カナ）" required="true">
							<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxByteLengthValidator" args="40" />
						</gp:text>
					</td>
				</tr>
				<tr>
					<td class="label">
						<gp:label id="lblCorporateNA_Condition" value="取引先名称"/>
					</td>
					<td>
						<gp:text id="CorporateNA" maxlength="40" size="65" required="true" style="ime-mode:active;" label="取引先名称">
							<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxByteLengthValidator" args="40"/>
						</gp:text>
					</td>
				</tr>
			</table>
			<hr />
			<table class="condition" cellspacing="1" >
				<tr>
					<td class="label">
						<gp:label id="AllAT_H" value="合計金額"/>
					</td>
					<td>
						<gr:snumber id="AllAT" format="###,##0" size="24" readonly="true" style="text-align:right"/>
					</td>
				</tr>
			</table>

			<gp:ajaxrender id="listrender">
				<gp:list id="OrderDetailList" listsize="10" style="width:100%;" isemptymsg="false">
					<gp:listheader>
						<gp:listheaderline>
							<gp:listheaderline>
								<gp:listheadercell id="No_H" rowspan="2" style="width:6%;text-align:right;">No.</gp:listheadercell>
								<gp:listheadercell id="Update_H" rowspan="2" style="width:5%;text-align:center;">選<br />択</gp:listheadercell>
								<gp:listheadercell id="ItemCD_H" colspan="3" style="width:25%;">商品コード</gp:listheadercell>
								<gp:listheadercell id="OrderQT_H" style="width:20%;text-align:right;">発注数</gp:listheadercell>
								<gp:listheadercell id="UnitPrice_H" style="width:15%;text-align:right;">単価</gp:listheadercell>
								<gp:listheadercell id="OrderAT_H" style="width:20%;text-align:right;">発注金額</gp:listheadercell>
							</gp:listheaderline>
							<gp:listheaderline>
								<gp:listheadercell id="DeliveryDT_H" style="width:10%;">納期</gp:listheadercell>
								<gp:listheadercell id="StockFG_H" style="width:120px;">在庫区分</gp:listheadercell>
								<gp:listheadercell id="InspectionFG_H" style="width:115px;">検査区分</gp:listheadercell>
								<gp:listheadercell id="Remark_H" colspan="3">備考</gp:listheadercell>
							</gp:listheaderline>
						</gp:listheaderline>
					</gp:listheader>
					<gp:listrow>
						<gp:listrowline>
							<gp:listnumbercell id="No" rowspan="2" style="text-align:right;" />
							<gp:listrowcell id="CheckFG_C" rowspan="2">
								<gp:checkbox id="CheckFG"/>
							</gp:listrowcell>
							<gp:listrowcell id="ItemCD_C" colspan="3">
								<gp:text id="ItemCD_0" maxlength="15" size="22" required="true" label="商品コード" style="ime-mode:disabled;">
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxByteLengthValidator" args="15"/>
								</gp:text>
								<gp:hidden id="AddRowFG" value="true" />
								<gp:hidden id="DetailNo" />
								<gp:hidden id="ExclusiveFG" />
								<gp:hidden id="DetailID" />
								<gp:linkedimg id="ItemListZoomImg" src="${gf:ctxpath()}/public/images/zoom.gif" alt="">
									<gr:zoomopenevent element="ItemListZoom" event="click">
										<gr:zoomparam name="ItemCD_0" element="[%pfx]ItemCD_0"/>
										<gr:zoomparam name="ZoomItemList.listsize" value="10"/>
										<gr:zoomreceive key="key1" element="[%pfx]ItemCD_0"/>
										<gr:zoomreceive key="key2" element="[%pfx]ItemNA"/>
										<gr:zoomreceive key="key3" element="[%pfx]UnitPrice"/>
									</gr:zoomopenevent>
								</gp:linkedimg>
								<gp:label id="ItemNA" value="商品名称"/>
							</gp:listrowcell>
							<gp:listrowcell id="OrderQT_C" style="text-align:right;">
								<gr:snumber id="OrderQT" format="###,##0" maxlength="5" size="13" style="ime-mode:disabled;text-align:right;" label="発注数" required="true">
									<gp:functionevent func="calculateOrderAT(this);" event="blur" />
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GNumberTypeValidator" stop="true" />
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxDecimalLengthValidator" args="@@0" stop="true" />
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMinValueValidator" args="@@0" stop="true" />
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxValueValidator" args="@@9999" />
								</gr:snumber>
							</gp:listrowcell>
							<gp:listrowcell id="UnitPrice_C" style="text-align:right;">
								<gr:snumber id="UnitPrice" format="###,##0.###" maxlength="14" size="24" style="ime-mode:disabled;text-align:right;" label="単価" required="true">
									<gp:functionevent func="calculateOrderAT(this);" event="blur" />
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GNumberTypeValidator" stop="true" />
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxDecimalLengthValidator" args="@@3" stop="true" />
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMinValueValidator" args="@@0" stop="true" />
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxValueValidator" args="@@99,999,999.999" />
								</gr:snumber>
							</gp:listrowcell>
							<gp:listrowcell id="OrderAT_C" style="text-align:right;">
								<gr:snumber id="OrderAT" format="###,##0" size="24" readonly="true" style="text-align:right" label="発注金額" />
							</gp:listrowcell>
						</gp:listrowline>
						<gp:listrowline>
							<gp:listrowcell id="DeliveryDT_C">
								<gr:date id="DeliveryDT" format="yyyy/MM/dd" maxlength="10" size="14" style="ime-mode:disabled;" label="納期" required="true">
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GDateTypeValidator" stop="true" />
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GNotPastValidator" />
								</gr:date>
							</gp:listrowcell>
							<gp:listrowcell id="StockFG_C">
								<gp:select id="StockFG" value="0">
									<gp:option value="0" label="在庫管理しない" />
									<gp:option value="1" label="在庫管理する" />
								</gp:select>
							</gp:listrowcell>
							<gp:listrowcell id="InspectionFG_C">
								<gp:select id="InspectionFG" value="0">
									<gp:option value="0" label="検査しない" />
									<gp:option value="1" label="検査する" />
								</gp:select>
							</gp:listrowcell>
							<gp:listrowcell id="Remark_C" colspan="3">
								<gp:textarea id="Remark" rows="2" cols="48" style="ime-mode:active;" label="備考">
									<gp:validate validator="jp.co.kccs.greenearth.framework.view.validator.GMaxByteLengthValidator" args="100" />
								</gp:textarea>
							</gp:listrowcell>
						</gp:listrowline>
					</gp:listrow>
				</gp:list>
			</gp:ajaxrender>
			<br/>
		</gp:form>
	</gp:div>
	<gp:jspinclude page="/geframe/jsp/submit-indicator.jsp" id="submit-indicator"/>
</gp:body>
</gp:html>
</gp:view>
</jsp:root>
