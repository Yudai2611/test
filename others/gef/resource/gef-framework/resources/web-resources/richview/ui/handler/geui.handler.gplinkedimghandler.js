// Copyright 2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPLinkedImgTag}専用のハンドラを定義します。
 *
 * @author KCCS kikuchi 2014/07/22
 * @since 3.16.0
 */
(function($, undefined) {
	$.geui.handler.gplinkedimghandler = $.geui.handler.gplinkedimghandler || function() {};
	$.geui.handler.gplinkedimghandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gplinkedimghandler.prototype, {
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author KCCS kikuchi 2014/07/22
		 * @since 3.16.0
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var id = $element.attr('id');
			var $hidden = $.ge.idSelector(id + '_hdn');
			if (!arguments || arguments.length <= 1) {
				return $element.find('img').attr('src');
			}
			$element.find('img').attr('src', value);
			$hidden.val(value);
		}
	});
	$.geui.handler.set('gplinkedimg', new $.geui.handler.gplinkedimghandler());
})(jQuery);
