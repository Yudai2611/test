// Copyright 2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPSelectTag}専用のハンドラを定義します。
 *
 * @author KCCS kikuchi 2014/06/24
 * @since 3.16.0
 */
(function($, undefined) {
	$.geui.handler.gpselecthandler = $.geui.handler.gpselecthandler || function() {};
	$.geui.handler.gpselecthandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gpselecthandler.prototype, {
		/**
		 * 指定された要素の初期値を設定します。
		 *
		 * @param id id属性
		 * @author KCCS kikuchi 2014/07/01
		 * @since 3.16.0
		 */
		init: function(id) {
			var $element = $.geui.getElement(id);
			if (!$element.length) return;
			var initValue = this.val($element);
			$element.attr($.ge.property.get('geui.XHtml.Ex.Attr.Initvalue'), initValue);
			this.val($element, initValue);
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author KCCS kikuchi 2014/06/24
		 * @since 3.16.0
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var id = $element.attr('id');
			var $hidden = $.ge.idSelector(id + '_hdn');
			if (!arguments || arguments.length <= 1) {
				var val = $element.val();
				if (val === null) { // HTML標準に準拠
					var options = $element.find('option');
					if (options.length > 0) {
						var selectedOps = options.filter(':selected');
						if (selectedOps.length > 0) {
							val = selectedOps.last().val();
						} else {
							val = options.first().val();
						}
					}
				}
				return val;
			}
			$element.val(value);
			$hidden.val(value);
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値をクリアします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return 値
		 * @author KCCS kikuchi 2014/06/24
		 * @since 3.16.0
		 */
		clear: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			if ($.geui.booleanAttr($element, $.ge.property.get('geui.XHtml.Ex.Attr.Clear'))) {
				this.val($element, $element.find('option:first').val());
			}
		}
	});
	$.geui.handler.set('gpselect', new $.geui.handler.gpselecthandler());
})(jQuery);
