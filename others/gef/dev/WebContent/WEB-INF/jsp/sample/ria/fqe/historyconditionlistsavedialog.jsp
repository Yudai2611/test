<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
	xmlns:geframe="http://www.kccs.co.jp/geframe/taglib"
	xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
	xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
	xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
	<jsp:directive.page contentType="text/html; charset=UTF-8" />
	<gp:includeview id="SaveDialogView">
		<gr:dialog id="SaveDialog" title="条件保存画面" options="{width:400,height:180,autoOpen:false,modal:true}" style="text-align: center;display:none;">
			<div class="dialogInput">
				<gp:label id="SaveDialogLabel" value="登録名："/>
				<gp:text id="DialogSaveName" style="width:290px;" maxlength="50" styleclass="dialog-text text" />
			</div>
			<div style="text-align: right;">
				<gp:button id="SaveOkBtn"  value="保存" title="保存" showaccesskey="true" styleclass="confirm-btn" accesskey="I"  >
					<gp:submitevent event="click" actionbean="sample.ria.fqe.action.HistoryConditionAction" mode="save" actionmethod="saveHistory" options="{affectState: false}" form="formMain" forward="dataexport.jsp" />
					<gp:widgetevent element="SaveDialog" event="click" widgetname="grdialog" method="close" />
				</gp:button>
				<gp:button id="SaveCancelBtn"  value="キャンセル" title="キャンセル" showaccesskey="true" styleclass="confirm-btn" accesskey="N">
					<gp:widgetevent element="SaveDialog" event="click" widgetname="grdialog" method="close" />
				</gp:button>
			</div>
		</gr:dialog>
	</gp:includeview>
</jsp:root>
