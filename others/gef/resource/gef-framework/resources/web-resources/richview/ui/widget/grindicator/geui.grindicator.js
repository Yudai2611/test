// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 *
 *
 * @author yamashita 2011/04/23
 * @since 3.9.0
 */
(function($, undefined) {
	/**
	 * geui.grindicator Widgetクラス
	 *
	 * インジケータ表示制御用のWidget です。
	 *
	 * @author yamashita 2011/04/23
	 * @since 3.9.0
	 */
	$.widget('geui.grindicator', {
		/**
		 * オプション
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		options: {
			horizontal: true,
			vertical: true
		},
		/**
		 * 基底クラス
		 *
		 * @private
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		_baseClass: '',
		/**
		 * 初期化処理を実行します。
		 *
		 * @private
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		_create: function() {
			this.element.hide();
			this.center();
			var self = this;
			$(this.parent).on('resize.grindicator', function(event) {
				/*jshint unused:false*/
				self.center();
			});
			this.element.addClass(this._baseClass);
		},
		/**
		 * 親要素を取得します。
		 *
		 * @private
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		_getParent: function() {
			var $parent = this.element.parent();
			var tagName = $parent.prop('tagName');
			return !tagName || tagName.toLowerCase() === 'body' ? $(window) : $parent;
		},
		/**
		 * ウィジェットを表示状態にします。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		show: function() {
			this.element.show();
			this.element.children().show();
			this.center();
		},
		/**
		 * ウィジェットを非表示にします。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		hide: function() {
			this.element.hide();
			this.element.children().hide();
		},
		/**
		 * ウィジェットを中央寄せにします。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		center: function() {
			var elementStyle = this.element[0].style;
			elementStyle.position = 'absolute';
			!this.parent && (this.parent = this._getParent());
			var parentPosition = this.element.parent().css('position');
			var offsetParent = null; //position 属性が relative、 absolute、 fixed のいずれかである、最も近い祖先要素

			if ( !! this.options.horizontal) {
				var newPosX = Math.floor((this.parent.outerWidth(true) / 2) - (this.element.outerWidth(true) / 2));
				if (parentPosition === 'static') {
					// ##### CUSTOMIZE [2023/10/13][yangfeng] インジケーターが表示を大幅に上（ページ上部）に表示されてしまう　バグを解消 [start] ####
					// TODO JQuery3.3.1のバグ（#1081と#3479）により暫定対応
					//     https://github.com/jquery/api.jquery.com/issues/1081
					//     https://github.com/jquery/jquery/issues/3479
					// JQuery将来のVerUpで直せば、元に戻す予定
					//   newPosX = newPosX + this.element.parent().position().left;
					newPosX = newPosX + this.element.parent().offset().left;
					// ##### CUSTOMIZE [2023/10/13][yangfeng] インジケーターが表示を大幅に上（ページ上部）に表示されてしまう　バグを解消 [end] ####
					offsetParent = this.element.offsetParent();
					if (offsetParent[0] !== $('html')[0]) { //祖先に'static'以外の要素がある
						newPosX = newPosX + offsetParent.scrollLeft();
					} else {
						newPosX = newPosX + this.parent.scrollLeft(); //this.parent==$(window)
					}
				} else {
					newPosX = newPosX + this.element.parent().scrollLeft();
				}
				elementStyle.left = newPosX + 'px';
			}

			if ( !! this.options.vertical) {
				var newPosY = Math.floor((this.parent.outerHeight(true) / 2) - (this.element.outerHeight(true) / 2));
				if (parentPosition === 'static') {
					offsetParent = !! offsetParent ? offsetParent : this.element.offsetParent();
					// ##### CUSTOMIZE [2023/10/13][yangfeng] インジケーターが表示を大幅に上（ページ上部）に表示されてしまう　バグを解消 [start] ####
					// TODO JQuery3.3.1のバグ（#1081と#3479）により暫定対応
					//     https://github.com/jquery/api.jquery.com/issues/1081
					//     https://github.com/jquery/jquery/issues/3479
					// JQuery将来のVerUpで直せば、元に戻す予定
					//   newPosY = newPosY + this.element.parent().position().top;
					newPosY = newPosY + this.element.parent().offset().top;
					// ##### CUSTOMIZE [2023/10/13][yangfeng] インジケーターが表示を大幅に上（ページ上部）に表示されてしまう　バグを解消 [end] ####
					if (offsetParent[0] !== $('html')[0]) { //祖先に'static'以外の要素がある
						newPosY = newPosY + offsetParent.scrollTop();
					} else {
						newPosY = newPosY + this.parent.scrollTop(); //this.parent==$(window)
					}
				} else {
					newPosY = newPosY + this.element.parent().scrollTop();
				}
				elementStyle.top = newPosY + 'px';
			}
		},
		/**
		 * widget の破棄処理を実行します。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		destroy: function() {
			$(this.parent).off('resize.grindicator');
			this.parent = null;
			this.element.removeClass(this._baseClass);
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);
