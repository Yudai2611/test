// Copyright 2013-2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPMenuLinkedLabelTag}専用のハンドラを定義します。
 *
 * @author yamashita 2013/07/20
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler.gpmenulinkedlabelhandler = $.geui.handler.gpmenulinkedlabelhandler || function() {};
	$.geui.handler.gpmenulinkedlabelhandler.prototype = new $.geui.handler.gplinkedlabelhandler();
	$.extend($.geui.handler.gpmenulinkedlabelhandler.prototype, {
		/**
		 * アクションパラメータを装飾します。
		 *
		 * @author yamashita 2013/07/20
		 * @since 3.12.0
		 */
		decorateActionParam: function(event, options, $form) {
			var params = [],
				id = $form.attr('id') + '.menuid';
			var $element = $.ge.idSelector(id);
			$element.length && $element.remove();
			options.menuid ||
				params.push({
					name: 'menuid',
					value: null
				});
			return params;
		}
	});
	$.geui.handler.set('gpmenulinkedlabel', new $.geui.handler.gpmenulinkedlabelhandler());
})(jQuery);
