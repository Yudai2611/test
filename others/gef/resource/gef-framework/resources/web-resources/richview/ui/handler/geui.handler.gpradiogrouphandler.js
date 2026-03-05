// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPRadioGroupTag}専用のハンドラを定義します。
 *
 * @author kawakami 2013/06/12
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler.gpradiogrouphandler = $.geui.handler.gpradiogrouphandler || function() {};
	$.geui.handler.gpradiogrouphandler.prototype = new $.geui.handler.gvariablebasehandler();
	var XHTML_ATTRIBUTE_RADIOGROUP_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.RadioGroup');
	$.extend($.geui.handler.gpradiogrouphandler.prototype, {
		/**
		 * 指定されたgroup要素(HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定し、
		 * 指定されたgroup要素に所属するoptionのcheckedに反映します。
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author kawakami 2013/06/12
		 * @since 3.12.0
		 */
		val: function(groupelement, value) {
			var $group = $.geui.getElement(groupelement);
			if (!$group.length) return null;
			if (!arguments || arguments.length <= 1) {
				return $group.val();
			}

			$group.val(value);

			function syncChecked(group) {
				var CACHE_KEY = 'radiooptions',
					options = group.data(CACHE_KEY) || [];
				if (!options.length) {
					var selector = $.ge.escSelectorString(XHTML_ATTRIBUTE_RADIOGROUP_NAME);
					options = $('input[' + selector + '=\'' + group.attr('id') + '\']') || [];
					if (!options.length) {
						return;
					}
					group.data(CACHE_KEY, options);
				}
				$.each(options, function(index, option) {
					var $option = $(option);
					$option.prop('checked', $option.val() === $group.val());
				});
			}
			syncChecked($group);
		}
	});
	$.geui.handler.set('gpradiogroup', new $.geui.handler.gpradiogrouphandler());
})(jQuery);
