// Copyright 2013-2016 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * Variable系のデフォルトハンドラを定義します。
 *
 * @author yamashita 2013/08/27
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler.gvariablebasehandler = $.geui.handler.gvariablebasehandler || function() {};
	$.extend($.geui.handler.gvariablebasehandler.prototype, {
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author yamashita 2011/08/22
		 * @since 3.9.0
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			if (arguments.length <= 1) {
				return $element.val();
			}
			$element.val(value);
			$element.trigger('val.placeholderdecorator');
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値をクリアします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return 値
		 * @author yamashita 2013/08/27
		 * @since 3.12.0
		 */
		clear: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			if ($.geui.booleanAttr($element, $.ge.property.get('geui.XHtml.Ex.Attr.Clear'))) {
				this.val($element, '');
			}
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値をリセットします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2013/08/27
		 * @since 3.12.0
		 */
		reset: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var initValue = $element.attr($.ge.property.get('geui.XHtml.Ex.Attr.Initvalue'));
			initValue !== undefined && this.val($element, initValue);
		}
	});
})(jQuery);
