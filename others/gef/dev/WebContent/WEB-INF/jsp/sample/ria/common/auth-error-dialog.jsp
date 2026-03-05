<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
<jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> ]]></jsp:text>
<gp:view>
	<gp:html xmlns:ghx="http://www.kccs.co.jp/2011/geframe/xhtml1-extension/XMLSchema">
		<gp:body>
			<gp:ajaxrender id="geframe.richview.SystemError.Render">
				<gr:systemerrordialog id="geframe.richview.SystemError" title="システムエラー" options="{width:700,height:500}" style="text-align:center;">
					<gp:img id="imgtitle" alt="" src="${gf:ctxpath()}/public/images/title.gif" style="border:0px;"/>
					<br /><br /><br />
					<h2 style="color:red;font-size:large;"><gp:labelvalue id="message" value="${gf:resource('ACCESS-PROHIBITED')}"/></h2><br/>
					<hr width="600" /><br />
					<span><gp:labelvalue id="description1" value="${gf:resource('SESSION-TIMEOUT')}"/></span><br/>
					<span><gp:labelvalue id="description2" value="${gf:resource('LOGIN-AGAIN')}"/></span><br/><br/>
					<gp:anchor id="login" href="${gf:ctxpath()}/login.jsp" target="_parent">
						<gp:labelvalue id="caption" value="${gf:resource('GO-TO-LOGIN-PAGE')}"/>
					</gp:anchor>
				</gr:systemerrordialog>
			</gp:ajaxrender>
		</gp:body>
	</gp:html>
</gp:view>
</jsp:root>