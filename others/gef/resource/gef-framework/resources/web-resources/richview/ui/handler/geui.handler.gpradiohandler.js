// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPRadioTag}専用のハンドラを定義します。
 *
 * @author kikuchi 2013/09/24
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler.gpradiohandler = $.geui.handler.gpradiohandler || function() {};
	$.geui.handler.gpradiohandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gpradiohandler.prototype, {
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値をクリアします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return 値
		 * @author kikuchi 2013/11/01
		 * @since 3.12.0
		 */
		clear: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			if ($.geui.booleanAttr($element, $.ge.property.get('geui.XHtml.Ex.Attr.Clear'))) {
				$element.prop('checked', false);
			}
		}
	});
	$.geui.handler.set('gpradio', new $.geui.handler.gpradiohandler());
})(jQuery);
