<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<gp:includeview id="header-ria-inc">
	<link href="${gf:ctxpath()}/richview/lib/jqueryui/jquery-ui.custom.css" rel="stylesheet" type="text/css" charset="utf-8"/>
	<link href="${gf:ctxpath()}/richview/ge-richview.css" rel="stylesheet" type="text/css" charset="utf-8"/>
	<gp:script type="text/javascript" src="${gf:ctxpath()}/richview/lib/jquery/jquery.js" charset="utf-8"/>
	<gp:script type="text/javascript" src="${gf:ctxpath()}/richview/lib/jqueryui/jquery-ui.custom.js" charset="utf-8"/>
	<gp:script type="text/javascript" src="${gf:ctxpath()}/richview/ge-richview.js" charset="utf-8"/>
	<gp:script type="text/javascript" src="${gf:ctxpath()}/richview/ge-richview.i18n.js" charset="utf-8"/>
</gp:includeview>
</jsp:root>