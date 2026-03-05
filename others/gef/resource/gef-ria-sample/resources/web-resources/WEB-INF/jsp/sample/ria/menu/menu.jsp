<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<jsp:text><![CDATA[<?xml version="1.0" encoding="UTF-8"?>]]></jsp:text>
<jsp:text><![CDATA[<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> ]]></jsp:text>
<gp:view viewclass="sample.ria.menu.MenuView">
<gp:html lang="ja" version="XHTML 1.0 Transitional" xmlns:ghx="http://www.kccs.co.jp/2011/geframe/xhtml1-extension/XMLSchema">
<head>
	<meta http-equiv="Expires" content="0" />
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="Cache-Control" content="no-cache" />
	<meta http-equiv="Content-Style-Type" content="text/css" />
	<meta http-equiv="Content-Script-Type" content="text/javascript" />
	<title>メニュー</title>
	<gp:jspinclude id="Header" page="/WEB-INF/jsp/sample/ria/common/header-ria-inc.jsp"/>
<style type="text/css">
	IMG
	{
		vertical-align: bottom;
	}
	#MenuList td
	{
		background-color: white !important; border: 1px solid #FFFFFF;
	}
</style>
</head>
<gp:body id="Body">
	<gp:jspinclude id="SystemHeader" page="/WEB-INF/jsp/sample/ria/common/header.jsp"/><br/>
	<gp:form id="FormMenu" method="post" >
		<gp:div id="menudiv" style="margin-left:20px;margin-top:20px;font-size:medium;">
			<gp:img id="ParentMenuImage" src="" alt="" style="width:28px; height:28px;"/>
			<gp:menulinkedlabel id="ParentMenuLink" value="GreenEARTH Web Framework" styleclass="linkedlabel_large_menuitem">
				<gp:submitevent event="click" actionbean="sample.ria.menu.MenuAction"  gpmenulinkedlabel="ParentMenuLink" actionmethod="launchMenu" forward="/WEB-INF/jsp/sample/ria/menu/menu.jsp" form="FormMenu" indicator="submit-indicator"/>
			</gp:menulinkedlabel>
			<br/>
		</gp:div>
		<gp:list id="MenuList" style="margin-left:60px;" zebrarow="false">
			<gp:listheader>
			</gp:listheader>
			<gp:listrow>
				<gp:listrowline>
					<gp:listrowcell id="MenuItem" style="width:500px;">
						<gp:img id="SubMenuImage" src="" alt="" style="width:18px; height:18px;"/>
						<gp:menulinkedlabel id="SubMenuLink">
							<gp:submitevent event="click" actionbean="sample.ria.menu.MenuAction" gpmenulinkedlabel="[%pfx]SubMenuLink" actionmethod="launchMenu" forward="/WEB-INF/jsp/sample/ria/menu/menu.jsp" form="FormMenu" indicator="submit-indicator"/>
						</gp:menulinkedlabel>
					</gp:listrowcell>
				</gp:listrowline>
			</gp:listrow>
		</gp:list>
	</gp:form>
	<gp:jspinclude page="/geframe/jsp/submit-indicator.jsp" id="submit-indicator"/>
</gp:body>
</gp:html>
</gp:view>
</jsp:root>
