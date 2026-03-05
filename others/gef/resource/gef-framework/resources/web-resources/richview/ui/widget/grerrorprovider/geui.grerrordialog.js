// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エラーダイアログウィジェットを定義します。
 *
 * @author yamashita 2011/06/08
 * @since 3.9.0
 */
(function($, undefined) {
	var contentIdSuffix = '.validate-error-block',
		labelIdSuffix = '.label',
		baseClass = 'geui-grerrordialog',
		labelClass = 'geui-grerrordialog-label',
		contentClass = 'geui-grerrordialog-content',
		contentTitlebarClass = 'geui-grerrordialog-content-titlebar';
	/**
	 * geui.grerrordialog ウィジェットクラス
	 *
	 * エラーダイアログ表示用のウィジェット です。
	 *
	 * @extend {$.geui.grerrorprovider}
	 * @author yamashita 2011/06/08
	 * @since 3.9.0
	 */
	$.widget('geui.grerrordialog', $.geui.grerrorprovider, {
		_baseClass: baseClass,
		_zIndex: 'auto',
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/06/08
		 * @since 3.9.0
		 */
		options: {
			errorlabel: 'Validate Errors',
			autoOpen: false,
			anchor: true
		},
		/**
		 * 生成処理を行います。
		 *
		 * @private
		 * @author yamashita 2011/06/08
		 * @since 3.9.0
		 */
		_create: function() {
			/*jshint scripturl:true*/
			var self = this;
			// 不要なdiv要素を除去
			//   ※ajax時にダイアログがレンダリングされている状態で、複数回ajaxを実行する場合、
			//     ダイアログがウィジェット化される度に、ウィジェットを構成するdiv要素がbody下部に移動され、
			//     消えずに残っていくため
			$('div #' + $.ge.escSelectorString(this.element.attr('id') + contentIdSuffix)).each(function() {
				if (this !== self.element.children()[0]) $(this).remove();
			});
			$.geui.grerrorprovider.prototype._create.call(this);
			this.contentDiv = $.ge.idSelector(this.element.attr('id') + contentIdSuffix);
			/*jshint newcap:false */
			if (!this.contentDiv.length) throw Error('content (div) block does not exist.');
			if (this.options.anchor) {
				this.labelAnchor = $('<a/>')
					.attr('id', this.element.attr('id') + labelIdSuffix)
					.attr('href', 'javascript:void(0);')
					.on('contextmenu.grerrordialog', function(event) { // 右クリックメニュー無効化
						event.returnValue = false;
					})
					.on('click.grerrordialog', function(event) {
						/*jshint unused:false */
						self.showError();
						return false;
					})
					.text(this.options.errorlabel)
					.addClass(labelClass)
					.insertBefore(this.contentDiv);
				$.geui.setClearFalse(this.labelAnchor, true);
			}
			this.contentDiv.dialog(this.options);
			this.contentDiv.addClass(contentClass);
			var first = this.contentDiv.parents('.ui-dialog:first');
			this._zIndex = first.css('z-index');
			first.css('z-index', 9999); // 常に最前面に表示されるようにする。ただし、表示した後は、元のz-indexに戻す
			first.find('.ui-dialog-titlebar')
				.addClass(contentTitlebarClass);
			this.options.isError ? this.showError() : this.hideError();
		},
		/**
		 * エラーダイアログのコンテンツをオープンします。
		 *
		 * @author yamashita 2011/07/18
		 * @since 3.9.0
		 */
		open: function() {
			var self = this;
			self.contentDiv && self.contentDiv.dialog('open');
			setTimeout(
				function() {
					if (!self.contentDiv) return;
					self.contentDiv.parents('.ui-dialog:first').css('z-index', self._zIndex);
					self.contentDiv.dialog('moveToTop');
				}, 0);
		},
		/**
		 * エラーダイアログのコンテンツをクローズします。
		 *
		 * @author yamashita 2011/07/18
		 * @since 3.9.0
		 */
		close: function() {
			this.contentDiv && this.contentDiv.dialog('close');
		},
		/**
		 * エラーダイアログを活性化させます。
		 *
		 * @see {$.geui.grerrorprovider#showError}
		 * @author yamashita 2011/07/18
		 * @since 3.9.0
		 */
		showError: function() {
			if (!this.options.isError) return;
			this.open();
			$.geui.grerrorprovider.prototype.showError.call(this);
		},
		/**
		 * エラーダイアログを非活性化させます。
		 *
		 * @see {$.geui.grerrorprovider#hideError}
		 * @author yamashita 2011/07/18
		 * @since 3.9.0
		 */
		hideError: function() {
			this.close();
			$.geui.grerrorprovider.prototype.hideError.call(this);
		},
		/**
		 * 破棄処理を行います。
		 *
		 * @see {$.geui.grerrorprovider#destroy}
		 * @author yamashita 2011/07/18
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.css('display', 'none'); //destory後に要素を隠す
			if ( !! this.labelAnchor) {
				this.labelAnchor
					.off('contextmenu.grerrordialog')
					.off('click.grerrordialog')
					.remove();
				this.labelAnchor = null;
			}
			var clone = this.contentDiv
				.dialog('destroy')
				.removeClass(contentClass)
				.clone(true);
			clone.appendTo(this.element);
			this.contentDiv.remove();
			this.contentDiv = null;
			this.element.off('.dialog');
			this.widget().off('.dialog');
			$.geui.grerrorprovider.prototype.destroy.call(this);
		}
	});
})(jQuery);
