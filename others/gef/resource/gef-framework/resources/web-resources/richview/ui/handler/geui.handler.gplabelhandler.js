// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPLabelTag}専用のハンドラを定義します。
 *
 * @author yamashita 2011/08/22
 * @since 3.9.0
 */
(function($, undefined) {
	$.geui.handler.gplabelhandler = $.geui.handler.gplabelhandler || function() {};
	$.geui.handler.gplabelhandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gplabelhandler.prototype, {
		_MULTILINE_KEY: 'isMultiline',
		/**
		 * 指定された要素の初期値を、multiline属性値に応じて設定します。
		 *
		 * @param id id属性値
		 * @param options オプション文字列
		 * @author kikuchi 2014/09/03
		 * @since 3.16.0
		 */
		init: function(id, options) {
			var op = JSON.parse(options || 'null') || {}; // optionsに関数は詰められない前提
			var $element = $.geui.getElement(id);
			if (!$element.length) return;

			var initValue = $element.text();
			var $hidden = $.ge.idSelector($element.attr('id') + '_hdn');
			$hidden.val(initValue);
			$element.attr($.ge.property.get('geui.XHtml.Ex.Attr.Initvalue'), initValue);

			$element.data(this._MULTILINE_KEY, op.isMultiline);
			if (op.isMultiline === true) {
				$.geui.multiline($element);
			} else {
				$element.text(initValue);
			}
		},
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
			var id = $element.attr('id');
			var $hidden = $.ge.idSelector(id + '_hdn');
			if (!arguments || arguments.length <= 1) {
				return $hidden[0] !== undefined ? $hidden.val() : $element.text();
			}
			$element.text(value);
			$hidden.val(value);
			if ($element.data(this._MULTILINE_KEY) === true) {
				$.geui.multiline($element);
			}
		}
	});
	$.geui.handler.set('gplabel', new $.geui.handler.gplabelhandler());
})(jQuery);
