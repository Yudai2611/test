// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * Dialogウィジェットを定義します。
 *
 * @author yamashita 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'geui-grdialog';
	/**
	 * geui.grdialog ウィジェットクラス
	 *
	 * ダイアログ表示用のウィジェットです。
	 *
	 * @extend {$.ui.dialog}
	 * @author yamashita 2011/3/11
	 * @since 3.9.0
	 */
	$.widget('geui.grdialog', $.ui.dialog, {
		_baseClass: baseClass,
		_clone: null,
		/**
		 * オプションを表します。
		 *
		 * @author kikuchi 2013/5/31
		 * @since 3.12.0
		 */
		options: {
			autoReset: true,
			focus: null
		},
		/**
		 * 生成処理を行います。
		 *
		 * @author yamashita 2011/3/11
		 * @since 3.9.0
		 */
		_create: function() {
			this._clean();
			var self = this;
			// setTimeout()を利用してダイアログ初期状態のキャッシュ作成のタイミングを遅らせています。
			// ※実行キューの順序保障のため（ダイアログが内包する全てのHTML要素にイベントがバインドされた後、クローンを作成する）
			// 【詳細説明】
			// ①タイミングを遅らせる理由
			//   ウィジェット化処理・イベントバインド処理は、$(document).ready()のタイミングで実行される。（DOM構築後のタイミング）
			//   イベントバインド処理よりも先に、ウィジェット化処理（このメソッド）が実行される。
			//   このタイミング(_create)でクローンを作成しても、HTML要素にイベントはバインドされていないため、クローン作成のタイミングをイベントバインド後まで遅らせる必要がある。
			// ②setTimeout()を使用する理由
			//   javascriptはシングルスレッドである。（実行キューを1つだけしか持っていない）
			//   $(document).ready()のタイミングで、ウィジェット化処理・イベントバインド処理が「実行キュー」に登録される。（1度キューに登録された処理の実行順番は不変となる）
			//   setTimeout()は、実行キューにたまっている処理が完了後、指定秒待ってから引数のファンクションを実行するメソッドである。
			// ⇒つまり、下記の処理は、「（実行キューに登録済の）"ウィジェット化・イベントバインド処理"が終了次第、ただちにクローンを作成しろ」という命令となる。
			setTimeout(function() {
				$.geui.destroyWidgets(self.element);
				self._clone = self.element.clone(true);
			}, 0);
			this.element.addClass(this._baseClass);
			$.ui.dialog.prototype._create.call(this);
		},
		/**
		 * 初期化処理を行います。
		 *
		 * @author kikuchi 2013/5/31
		 * @since 3.12.0
		 */
		_init: function() {
			var self = this;
			// setTimeout()を利用して_initのタイミングを遅らせています。
			// ※実行キューの順序保障のため（autoReset機能を利用する場合、ダイアログを初期化した後にダイアログをオープンさせる）
			// 【詳細説明】
			//   autoOpen機能を利用する場合、_initのタイミングでダイアログがオープンされる。(jqueryui の仕様）
			//   さらにautoReset機能を利用することを想定すると、オープン前にダイアログを初期化する必要がある。
			//   しかし、_initのタイミングではクローンが作成されていない。（_create:のコメント参照）
			//   そのため下記の処理では、_initのタイミングを遅らせることで、クローン作成後にダイアログがオープンするようにしている。
			setTimeout(function() {
				$.ui.dialog.prototype._init.call(self);
			}, 0);
		},
		/**
		 * ダイアログのコンテンツをオープンします。
		 *
		 * @author kikuchi 2013/06/05
		 * @since 3.12.0
		 */
		open: function() {
			if (this.isOpen()) {
				return;
			}

			if (this.options.autoReset) {
				this.element
					.empty()
					.append(this._clone.children().clone(true));
			}
			$.geui.createWidgets(this.element);
			$.ui.dialog.prototype.open.call(this);
			if ( !! this.options.focus) {
				var hasFocus = $.ge.idSelector(this.options.focus, this.element);
				if (hasFocus.length > 0) {
					hasFocus.eq(0).trigger('focus');
				}
			}
		},
		/**
		 * 破棄処理を行います。
		 *
		 * @author yamashita 2011/3/11
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element
				.off('.dialog')
				.off(this.widgetName + 'open')
				.removeClass(this._baseClass);
			this.widget().off('.dialog')
				.off(this.widgetName + 'open');
			$.ui.dialog.prototype.destroy.apply(this, arguments);
			$.Widget.prototype.destroy.apply(this, arguments); //destroy()の最後で実行する必要あり
		},
		/**
		 * 不要なdiv要素を除去します。
		 * ※ajax時にダイアログがレンダリングされている場合に複数回ajaxを実行すると、
		 * ダイアログがウィジェット化される度に、ウィジェットを構成するdiv要素がbody下部に溜まっていくため
		 *
		 * @author kikuchi 2013/5/31
		 * @since 3.12.0
		 */
		_clean: function() {
			var self = this;
			$('div #' + $.ge.escSelectorString(this.element.attr('id'))).each(function() {
				this !== self.element[0] && $(this).remove();
			});
		}
	});
})(jQuery);
