<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
<jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> ]]></jsp:text>
<gp:view viewclass="sample.ria.common.LoginView" >
<gp:html>
<head>
	<meta http-equiv="Expires" content="0"/>
	<meta http-equiv="Pragma" content="no-cache"/>
	<meta http-equiv="Cache-Control" content="no-cache"/>
	<meta http-equiv="Content-Style-Type" content="text/css"/>
	<meta http-equiv="Content-Script-Type" content="text/javascript"/>
	<title>ログイン画面</title>
	<gp:jspinclude id="header" page="/WEB-INF/jsp/sample/ria/common/header-ria-inc.jsp"/>
</head>
<gp:body id="body">
	<gr:keybind keycode="13" event="click" element="login"/>
	<gr:errordialog elements=",formMain" id="edialog" options="{width:700,height:300}" title="${gf:resource('VALIDATE-RESULT-VIEW')}" style="display:none;">
		<gp:jspinclude id="error" page="/WEB-INF/jsp/sample/ria/common/validate-error.jsp"/>
	</gr:errordialog>
	<div style="width:100%;heigth:100%;position:absolute;bottom:25%">
	<gp:form id="formMain" method="post" focus="companycd" >
		<table border="0" width="100%" height="100%">
			<tr>
				<td width="33%"></td>
				<td width="33%" align="center">
					<table border="0" width="33%">
						<tr>
							<td width="100%">
								<table border="0" cellpadding="0" cellspacing="0">
									<tr>
										<td><gp:img id="shim1251" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:125px; height:1px; border:0px;"/></td>
										<td><gp:img id="shim631" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:63px; height:1px; border:0px;"/></td>
										<td><gp:img id="shim231" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:23px; height:1px; border:0px;"/></td>
										<td><gp:img id="shim541" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:51px; height:1px; border:0px;"/></td>
										<td><gp:img id="shim241" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:24px; height:1px; border:0px;"/></td>
										<td><gp:img id="shim941" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:94px; height:1px; border:0px;"/></td>
										<td><gp:img id="shim11" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:1px; height:1px; border:0px;"/></td>
									</tr>
									<tr valign="top"><!-- row 1 -->
										<td colspan="6" align='center'><gp:img id="title" alt="" src="${gf:ctxpath()}/public/images/title.gif" style="border:0px;"/></td>
										<td><gp:img id="shim185" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:1px; height:85px; border:0px;"/></td>
									</tr>
									<tr valign="top"><!-- row 2 -->
										<td colspan="6"><gp:img id="box_1" alt="" src="${gf:ctxpath()}/public/images/login/box_1.gif" style="width:380px; height:29px; border:0px;"/></td>
										<td><gp:img id="shim129" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:1px; height:29px; border:0px;"/></td>
									</tr>
									<tr valign="top"><!-- row 3 -->
										<td colspan="2"><gp:img id="box_2_companycode" alt="" src="${gf:ctxpath()}/public/images/login/box_2_companycode.gif" style="width:188px; height:29px; border:0px;"/></td>
										<td colspan="4" style="background-image:url(public/images/login/box_3.gif);text-align:left;" valign="middle">
											<gp:text id="companycd" maxlength="5" style="ime-mode:disabled;text-align:left;" size="15"/>
										</td>
										<td><gp:img id="shim129" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:1px; height:29px; border:0px;"/></td>
									</tr>
									<tr valign="top"><!-- row 4 -->
										<td colspan="2"><gp:img id="box_4_userid" alt="" src="${gf:ctxpath()}/public/images/login/box_4_userid.gif" style="width:188px; height:29px; border:0px;"/></td>
										<td colspan="4" style="background-image:url(public/images/login/box_5.gif);text-align:left;" valign="middle">
											<gp:text id="userid" style="ime-mode:disabled;text-align:left;"  size="15"/>
										</td>
										<td><gp:img id="shim129" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:1px; height:29px; border:0px;"/></td>
									</tr>
									<tr valign="top"><!-- row 5 -->
										<td colspan="2"><gp:img id="box_6_password" alt="" src="${gf:ctxpath()}/public/images/login/box_6_password.gif" style="width:188px; height:29px; border:0px;"/></td>
										<td colspan="4" style="background-image:url(public/images/login/box_7.gif);text-align:left;" valign="middle">
											<gp:password id="password" style="ime-mode:disabled;text-align:left;" size="15"/>
										</td>
										<td><gp:img id="shim129" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:1px; height:29px; border:0px;"/></td>
									</tr>
									<tr valign="top"><!-- row 6 -->
										<td colspan="6"><gp:img id="box_8" alt="" src="${gf:ctxpath()}/public/images/login/box_8.gif" style="width:380px; height:7px; border:0px;"/></td>
										<td><gp:img id="shim17" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:1px; height:7px; border:0px;"/></td>
									</tr>
									<tr valign="top"><!-- row 7 -->
										<td colspan="3"><gp:img id="box_9" alt="" src="${gf:ctxpath()}/public/images/login/box_9.gif" style="width:211px; height:21px; border:0px;"/></td>
										<td colspan="2">
											<gp:linkedimg alt="ログイン" src="${gf:ctxpath()}/public/images/login/login.gif" id="login" title="ログイン" imgstyle="border:none;">
												<gp:submitevent event="click" actionbean="sample.ria.common.AuthenticateAction" forward="/WEB-INF/jsp/sample/ria/menu/menu.jsp" actionmethod="loginAndFindMenu"/>
											</gp:linkedimg>
										</td>
										<td><gp:img id="box_10" alt="" src="${gf:ctxpath()}/public/images/login/box_10.gif" style="width:94px; height:21px; border:0px;"/></td>
										<td><gp:img id="shim121" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:1px; height:21px; border:0px;"/></td>
									</tr>
									<tr valign="top"><!-- row 8 -->
										<td colspan="6"><gp:img id="box_11" alt="" src="${gf:ctxpath()}/public/images/login/box_11.gif" style="width:380px; height:27px; border:0px;"/></td>
										<td><gp:img id="shim127" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:1px; height:27px; border:0px;"/></td>
									</tr>
									<tr valign="top"><!-- row 9 -->
										<td colspan="6">
											<p align="center"><gp:img id="copyright" alt="" src="${gf:ctxpath()}/public/images/login/copyright.gif" style="width:378px; height:17px; border:0px;"/></p>
										</td>
										<td><gp:img id="shim123" alt="" src="${gf:ctxpath()}/public/images/login/shim.gif" style="width:1px; height:23px; border:0px;"/></td>
									</tr>
									<tr>
										<td width="100%" height="60"></td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
				</td>
				<td width="34%" align="right" valign="bottom">
					<select name="locale">
						<option value="en">English</option>
						<option value="ja" selected="selected">Japanese</option>
						<option value=""></option>
					</select>
				</td>
			</tr>
		</table>
	</gp:form>
	</div>
</gp:body>
</gp:html>
</gp:view>
</jsp:root>