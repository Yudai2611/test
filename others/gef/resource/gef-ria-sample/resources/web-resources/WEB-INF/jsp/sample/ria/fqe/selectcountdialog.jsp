<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:geframe="http://www.kccs.co.jp/geframe/taglib"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8" />
<gp:includeview id="selectcountdialogView">
	<gr:dialog id="SelectCountDialog" title="件数確認結果" options="{width:120, modal:true}" style="text-align: center;display:none;">
		<div>
			<br />
			<gp:label id="SelectCount" format="#0"/>件
			<br />
			<br />
		</div>
		<gp:button id="SelectCountOkBtn" value="OK" style="width: 20mm;">
			<gp:widgetevent event="click" element="SelectCountDialog" widgetname="grdialog" method="close"/>
		</gp:button>
	</gr:dialog>
</gp:includeview>
</jsp:root>
