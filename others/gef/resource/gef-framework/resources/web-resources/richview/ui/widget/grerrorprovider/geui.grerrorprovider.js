// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エラー通知用ウィジェットの共通機能を定義します。
 *
 * @author yamashita 2011/06/11
 * @since 3.9.0
 */
(function($, undefined) {
	/**
	 * geui.grerrorprovider ウィジェットクラス
	 *
	 * @author yamashita 2011/06/11
	 * @since 3.9.0
	 */
	$.widget('geui.grerrorprovider', {
		_baseClass: '',
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		options: {
			isError: false
		},
		/**
		 * 生成処理を行います。
		 *
		 * @private
		 * @author yamashita 2011/06/16
		 * @since 3.9.0
		 */
		_create: function() {
			this.element.addClass(this._baseClass);
		},
		/**
		 * エラー表示を表示します。
		 *
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		showError: function() {
			this.element.show();
		},
		/**
		 * エラーを表示を隠します。
		 *
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		hideError: function() {
			this.element.hide();
		},
		/**
		 * 破棄処理を行います。
		 *
		 * @author yamashita 2011/06/16
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.removeClass(this._baseClass);
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);
