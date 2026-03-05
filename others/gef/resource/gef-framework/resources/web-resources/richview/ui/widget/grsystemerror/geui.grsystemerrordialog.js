// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * システムエラーダイアログウィジェットを定義します。
 *
 * @author yamashita 2011/06/21
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'geui-grsystemerrordialog',
		contentTitlebarClass = 'geui-grsystemerrordialog-content-titlebar';
	/**
	 * geui.grsystemerrordialog ウィジェットクラス
	 *
	 * システムエラーダイアログ表示用のウィジェット です。
	 *
	 * @extend {$.ui.dialog}
	 * @author yamashita 2011/06/21
	 * @since 3.9.0
	 */
	$.widget('geui.grsystemerrordialog', $.ui.dialog, {
		_baseClass: baseClass,
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		options: {
			modal: true,
			autoOpen: false
		},
		/**
		 * 生成処理を行います。
		 *
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		_create: function() {
			// 不要なdiv要素を除去
			//   ※ajax時にダイアログがレンダリングされている状態で、複数回ajaxを実行する場合、
			//     ダイアログがウィジェット化される度に、ウィジェットを構成するdiv要素がbody下部に移動され、
			//     消えずに残っていくため
			var self = this;
			$('div #' + $.ge.escSelectorString(this.element.attr('id'))).each(function() {
				if (this !== self.element[0]) $(this).remove();
			});
			this.element.addClass(this._baseClass);
			$.ui.dialog.prototype._create.call(this);
			this.element.parents('.ui-dialog:first').find('.ui-dialog-titlebar').addClass(contentTitlebarClass);
		},
		/**
		 * システムエラーダイアログを表示します。
		 *
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		showError: function() {
			this.open();
		},
		/**
		 * システムエラーダイアログを非表示にします。
		 *
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		hideError: function() {
			this.close();
		},
		/**
		 * 破棄処理を行います。
		 *
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.removeClass(this._baseClass);
			this.element.off('.dialog');
			this.widget().off('.dialog');
			$.ui.dialog.prototype.destroy.call(this);
			$.Widget.prototype.destroy.apply(this, arguments); //destroy()の最後で実行する必要あり
		}
	});
})(jQuery);
