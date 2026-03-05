// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エラーラベルウィジェットを定義します。
 *
 * @author yamashita 2011/06/16
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'ui-widget geui-grerrorlabel';
	/**
	 * geui.grerrorlabel ウィジェットクラス
	 *
	 * エラーラベル表示用のウィジェット です。
	 *
	 * @extend {$.geui.grerrorprovider}
	 * @author yamashita 2011/06/16
	 * @since 3.9.0
	 */
	$.widget('geui.grerrorlabel', $.geui.grerrorprovider, {
		_baseClass: baseClass,
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/06/16
		 * @since 3.9.0
		 */
		options: {
			errormsg: null
		},
		/**
		 * 生成処理を行います。
		 *
		 * @private
		 * @author yamashita 2011/06/16
		 * @since 3.9.0
		 */
		_create: function() {
			$.geui.grerrorprovider.prototype._create.call(this);
			this.element.text(this.options.errormsg);
			this.options.isError ? this.showError() : this.hideError();
		}
	});
})(jQuery);
