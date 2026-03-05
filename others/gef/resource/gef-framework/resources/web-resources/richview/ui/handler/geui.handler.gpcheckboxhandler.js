// Copyright 2013-2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPLabelTag}専用のハンドラを定義します。
 *
 * @author yamashita 2013/03/12
 * @since 3.10.0.D
 */
(function($, undefined) {
	$.geui.handler.gpcheckboxhandler = $.geui.handler.gpcheckboxhandler || function() {};
	$.geui.handler.gpcheckboxhandler.prototype = new $.geui.handler.gvariablebasehandler();
	/** チェック状態の値を設定します。 */
	var _CHECKED_VALUE = '1',
		_UNCHECKED_VALUE = '0';
	$.extend($.geui.handler.gpcheckboxhandler.prototype, {
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
				return $element.prop('checked') ? _CHECKED_VALUE : _UNCHECKED_VALUE;
			}
			var val = typeof value === 'boolean' ? value ? _CHECKED_VALUE : _UNCHECKED_VALUE : value;
			$element.prop('checked', val === _CHECKED_VALUE); //set
			$hidden.val(val);
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値をクリアします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return 値
		 * @author kikuchi 2014/03/31
		 * @since 3.13.0
		 */
		clear: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			if ($.geui.booleanAttr($element, $.ge.property.get('geui.XHtml.Ex.Attr.Clear'))) {
				this.val($element, _UNCHECKED_VALUE);
			}
		}
	});
	$.geui.handler.set('gpcheckbox', new $.geui.handler.gpcheckboxhandler());
})(jQuery);
