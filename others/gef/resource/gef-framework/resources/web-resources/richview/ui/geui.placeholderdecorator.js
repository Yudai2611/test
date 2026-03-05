// Copyright 2013-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPTextTag}{GPPasswordTag}{GPTextAreaTag}専用のプレースホルダハンドラを定義します。
 *
 * @author kawakami 2013/07/29
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.placeholderdecorator = $.geui.placeholderdecorator || {};
	$.extend($.geui.placeholderdecorator, {
		/**
		 * idで指定されたtext/password/textareaに対するプレースホルダをdecorateします。
		 * @param element id属性
		 * @author kawakami 2013/07/29
		 * @since 3.12.0
		 */
		decorate: function(id) {
			const ID = id;
			const PLACEHOLDER_ID = ID + '-placeholder';
			// 下記コードの本セレクター関数利用の目的を記載します：
			//   ﾀﾞｲｱﾛｸﾞの性質上、オリジナルとクローンを生成し、表示・非表示の表面上操作を実施するが、
			//   実態となるHTMLエレメントは同一のID値で生成されるため、セレクターを利用したjQueryオブジェクトの取得には、
			//   同一IDにて毎回最新の実態となるHTMLエレメントを取得しなければならない。
			var selector = function(id) {
				return $.ge.idSelector(id);
			};
			var hide = function() {
				selector(PLACEHOLDER_ID).css('zIndex', parseInt(selector(ID).get(0).style.zIndex, null));
				if (selector(PLACEHOLDER_ID).length > 0) {
					selector(PLACEHOLDER_ID)[0].style.display = 'none';
				}
			};
			var toggle = function() {
				if (selector(ID).val() === '') {
					selector(PLACEHOLDER_ID).css('zIndex', parseInt(selector(ID).get(0).style.zIndex, null) + 1);
					if (selector(PLACEHOLDER_ID).length > 0) {
						selector(PLACEHOLDER_ID)[0].style.display = 'inline-block';
					}
				} else {
					hide();
				}
			};
			var focus = function() {
				selector(ID).trigger('focus');
				if (selector(ID).attr('id') === $(document.activeElement).attr('id')) {
					selector(ID).trigger('focus');
				}
			};
			selector(PLACEHOLDER_ID).on('click', focus);
			selector(ID).on('blur', toggle);
			selector(ID).on('focus', hide);
			selector(ID).on('val.placeholderdecorator', toggle);
			toggle();
		}
	});
})(jQuery);
