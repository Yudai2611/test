<?xml version="1.0" encoding="UTF-8"?>
<jsp:root version="2.0" xmlns:jsp="http://java.sun.com/JSP/Page"
xmlns:gp="http://www.kccs.co.jp/geframe/ria/plain/taglib"
xmlns:gr="http://www.kccs.co.jp/geframe/ria/rich/taglib"
xmlns:gf="http://www.kccs.co.jp/geframe/ria/function/taglib">
<jsp:directive.page contentType="text/html; charset=UTF-8"/>
<gp:includeview id="header-inc" viewclass="sample.ria.common.HeaderView">
	<style type="text/css">
		TABLE.header
		{
			font-size:13px;
			font-weight:bold;
			border-bottom: 4px #4B0082 double;
			width:100%;
		}
	</style>
	<gp:form id="MenuHeaderForm" method="post" >
		<table cellspacing="0" cellpadding="0" class="header">
			<tr>
				<td width="10%" rowspan="2">
					<gp:img id="Logo" alt="" src="${gf:ctxpath()}/public/images/greenearth_logo.gif" style="float:left; width:135px; height:45px;"  />
				</td>
				<td width="25%">
					<nobr><span class="b">Login User :<![CDATA[&nbsp;]]></span><gp:label id="UserID"/></nobr>
				</td>
				<td width="25%">
					<nobr>
						<span class="b">
							<![CDATA[&nbsp;]]>
							<gp:label id="MenuDisplayNameTitle" value="Program : " visible="false" />
						</span>
						<gp:label id="MenuDisplayName"/>
					</nobr>
				</td>
				<td class="right" width="40%" rowspan="2">
					<div style="text-align:right;">
						<nobr>
							<gp:menulinkedlabel id="MenuHeaderMenu" value="[ MENU ]">
								<gp:submitevent event="click" actionbean="sample.ria.menu.MenuAction" gpmenulinkedlabel="MenuHeaderMenu" actionmethod="launchMenu" forward="/WEB-INF/jsp/sample/ria/menu/menu.jsp" form="MenuHeaderForm" indicator="submit-indicator"/>
							</gp:menulinkedlabel>
							<gp:menulinkedlabel id="MenuHeaderTopMenu" value="[TOP MENU]">
								<gp:submitevent event="click" actionbean="sample.ria.menu.MenuAction" gpmenulinkedlabel="MenuHeaderTopMenu" actionmethod="launchMenu" forward="/WEB-INF/jsp/sample/ria/menu/menu.jsp" form="MenuHeaderForm" indicator="submit-indicator"/>
							</gp:menulinkedlabel>
				 			<gp:linkedlabel id="Logout" value="[ LOG OUT ]">
				 				<gp:submitevent event="click" actionbean="sample.ria.common.AuthenticateAction" forward="/WEB-INF/jsp/sample/ria/common/logout.jsp" actionmethod="logout" validate="none" indicator="submit-indicator"/>
				 			</gp:linkedlabel>
						</nobr>
						<br/>
						<nobr>
							<gp:text id="JumpTo" style="ime-mode:disabled;"/>
							<gp:linkedlabel id="MenuHeaderJump" value="[ JUMP ]"/>
			 			</nobr>
					</div>
				</td>
			</tr>
		</table>
	</gp:form>
	<script type="text/javascript">
		<![CDATA[
			var doMenuAction = function(event) {
				var $jumpTo = $('#JumpTo');
				$.ge.idSelector('MenuHeaderForm.menuid').val($jumpTo.val());
				$jumpTo.val('');
				$.gectrl.gappcontroller.invokeSubmitAction(event, {
						actionparams: {
								actionbean: 'sample.ria.menu.MenuAction',
								forward: '/WEB-INF/jsp/sample/ria/menu/menu.jsp',
								form: 'MenuHeaderForm',
								validate: 'none',
								actionmethod: 'launchMenu',
								indicator: 'submit-indicator'
						}
					});
				};
			$(function(){
				$.ge.idSelector('JumpTo').on('keypress', function(event) {
					if (event.keyCode !== 13 || event.shiftKey) {
						return;
					}
					doMenuAction(event);
				});
				$.ge.idSelector('MenuHeaderJump').on('click', function(event) {
					if ($(this).attr('href') === 'javascript:void(0);' || !$(this).attr('href')) {
						if (event.shiftKey === true) return false;
					}
					doMenuAction(event);
				});
			});
		]]>
	</script>
</gp:includeview>
</jsp:root>
