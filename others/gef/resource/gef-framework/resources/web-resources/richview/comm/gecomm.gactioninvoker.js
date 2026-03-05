/*
 * Copyright 2022-2024 Kyocera Communication Systems Co., Ltd All rights reserved.
 */
/**
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.gecomm.gactioninvoker = $.gecomm.gactioninvoker || {};
	/**
	 * 通信関連を取り扱うクラスです.
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.gecomm.gactioninvoker, {
		/**
		 * ajaxを実行します.
		 *
		 * @param options オプション
		 * @author yamashita 2011/03/31
		 * @since 3.9.0
		 */
		ajax: function(options) {
			return $.ajax(options);
		},
		/**
		 * submitを実行します.
		 *
		 * @param options オプション
		 * @author yamashita 2011/03/31
		 * @since 3.9.0
		 */
		submit: function($form) {
			return $form.trigger('submit');
		}
	});
})(jQuery);
