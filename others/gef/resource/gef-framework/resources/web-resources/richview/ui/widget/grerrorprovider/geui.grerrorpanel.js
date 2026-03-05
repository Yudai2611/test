// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エラーパネルウィジェットを定義します。
 *
 * @author yamashita 2011/06/11
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'ui-widget geui-grerrorpanel';
	/**
	 * geui.grerrorpanel ウィジェットクラス
	 *
	 * エラーパネル表示用のウィジェット です。
	 *
	 * @extend {$.geui.grerrorprovider}
	 * @author yamashita 2011/06/11
	 * @since 3.9.0
	 */
	$.widget('geui.grerrorpanel', $.geui.grerrorprovider, {
		_baseClass: baseClass,
		/**
		 * 生成処理を行います。
		 *
		 * @private
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		_create: function() {
			$.geui.grerrorprovider.prototype._create.call(this);
			this.options.isError ? this.showError() : this.hideError();
		}
	});
})(jQuery);
