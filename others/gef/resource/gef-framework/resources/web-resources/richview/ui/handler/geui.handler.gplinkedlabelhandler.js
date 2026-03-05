// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPLinkedLabelTag}専用のハンドラを定義します。
 *
 * @author yamashita 2013/03/12
 * @since 3.10.0.D
 */
(function($, undefined) {
	$.geui.handler.gplinkedlabelhandler = $.geui.handler.gplinkedlabelhandler || function() {};
	$.geui.handler.gplinkedlabelhandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gplinkedlabelhandler.prototype, {
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author yamashita 2013/03/12
		 * @since 3.10.0.D
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var id = $element.attr('id');
			var $hidden = $.ge.idSelector(id + '_hdn');
			if (!arguments || arguments.length <= 1) {
				return $hidden[0] !== undefined ? $hidden.val() : $element.text();
			}
			$element.text(value);
			$hidden.val(value);
		}
	});
	$.geui.handler.set('gplinkedlabel', new $.geui.handler.gplinkedlabelhandler());
})(jQuery);
