<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">

<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<gp:includeview id="submit-indicator-inc">
	<gr:customindicator id="submit-indicator" style="z-index:1000;width:250px;border-style:solid;border-width:1px;padding:10px;background-color:white;text-align:center;display:none;">
		<gp:img id="submit-indicator-img" src="${gf:ctxpath()}/geframe/images/submit-indicator.gif" alt="" style="text-align:center;margin-bottom:1px;"/><br/>
		<gp:labelvalue id="submit-indicator-img-label" value="${gf:resource('PLEASE-WAIT')}"/>
	</gr:customindicator>
</gp:includeview>
</jsp:root>