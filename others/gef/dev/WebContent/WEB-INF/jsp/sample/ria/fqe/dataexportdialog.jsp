<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
	xmlns:geframe="http://www.kccs.co.jp/geframe/taglib"
	xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
	xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
	xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
	<jsp:directive.page contentType="text/html; charset=UTF-8" />
	<gp:includeview id="DataExportDialogView">
		<gr:dialog id="DataExportDialog" title="データ出力ダイアログ" options="{width:400,height:180,autoOpen:false,modal:true}" style="text-align: center;display:none;" >
			<div class="dialogInput">
				<gp:label id="ExportDialogLabel" value="ファイル名："/>
				<gp:text id="DialogExportName"  maxlength="50" style="width: 265px;" styleclass="dialog-text text"/>
			</div>
			<div style="text-align: right;">
				<gp:button id="ExportBtn"  value="出力" title="出力" showaccesskey="true" styleclass="confirm-btn" accesskey="G">
					<gp:submitevent event="click" actionbean="sample.ria.fqe.action.ExportAction" mode="export" actionmethod="export" options="{affectState: false}"  form="formMain" forward="dataexport.jsp" />
					<gp:widgetevent element="DataExportDialog" event="click" widgetname="grdialog" method="close" />
				</gp:button>
				<gp:button id="ExportCancelBtn"  value="キャンセル" title="キャンセル" showaccesskey="true" styleclass="confirm-btn" accesskey="B">
					<gp:widgetevent element="DataExportDialog" event="click" widgetname="grdialog" method="close" />
				</gp:button>
			</div>
		</gr:dialog>
	</gp:includeview>
</jsp:root>