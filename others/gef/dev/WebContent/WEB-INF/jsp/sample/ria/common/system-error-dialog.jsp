<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8" isErrorPage="true" />
<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
<jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> ]]></jsp:text>
<gp:view viewclass="sample.ria.common.SystemErrorDialogView">
	<gp:html xmlns:ghx="http://www.kccs.co.jp/2011/geframe/xhtml1-extension/XMLSchema">
		<gp:body>
			<gp:ajaxrender id="geframe.richview.SystemError.Render">
				<gr:systemerrordialog id="systemErrorDialog" title="システムエラー" options="{width:1000,height:660}">
					<font color="red" size="5" >System Error</font>
					<br />
					<br />
					<gp:list id="errorList" listsize="5" style="width:100%;">
						<gp:listheader>
							<gp:listheaderline>
								<gp:listheadercell id="errorKindLabel_H" style="min-width:50px;width:5%;">
									<gp:labelvalue id="errorKindLabel" value="ErrorType" />
								</gp:listheadercell>
								<gp:listheadercell id="errorcodeLabel_H" style="min-width:200px;width:20%;">
									<gp:labelvalue id="errorcodeLabel" value="ErrorCode"/>
								</gp:listheadercell>
								<gp:listheadercell id="errorMessageLabel_H" style="width:auto;">
									<gp:labelvalue id="errorMessageLabel" value="ErrorMessage" />
								</gp:listheadercell>
							</gp:listheaderline>
						</gp:listheader>
						<gp:listrow>
							<gp:listrowline>
								<gp:listrowcell id="ErrorKind_C">
									<gp:label id="ErrorKind" style="width:auto;" />
								</gp:listrowcell>
								<gp:listrowcell id="ErrorCode_C">
									<gp:label id="ErrorCode" style="width:auto;" />
								</gp:listrowcell>
								<gp:listrowcell id="ErrorMessage_C">
									<gp:label id="ErrorMessage" style="width:auto;" />
								</gp:listrowcell>
							</gp:listrowline>
						</gp:listrow>
					</gp:list>
					<gp:textarea id="trace" rows="25" cols="100" wrap="off" style="width:auto;" readonly="true"/>
					<hr/>
					<gp:button id="back" value="閉じる" >
						<gp:widgetevent element="systemErrorDialog" event="click" widgetname="grsystemerrordialog" method="close" />
					</gp:button>
					<br />
				</gr:systemerrordialog>
			</gp:ajaxrender>
		</gp:body>
	</gp:html>
</gp:view>
</jsp:root>
