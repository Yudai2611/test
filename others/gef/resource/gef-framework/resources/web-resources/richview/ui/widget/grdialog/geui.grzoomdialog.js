// Copyright 2011-2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * ズームダイアログウィジェットを定義します。
 *
 * @author yamashita 2011/04/23
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'geui-grzoomdialog';
	/**
	 * geui.grzoomdialog ウィジェットクラス
	 *
	 * Zoomダイアログ表示用のウィジェットです。
	 *
	 * @extend {$.geui.grdialog}
	 * @author yamashita 2011/04/23
	 * @since 3.9.0
	 */
	$.widget('geui.grzoomdialog', $.geui.grdialog, {
		_baseClass: baseClass,
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		options: {
			modal: true,
			autoOpen: false,
			params: null,
			receives: null,
			returns: null,
			currentEvent: null,
			isTriggeredFromDialog: false, // ダイアログ上で発火された通信処理の場合、trueを返却
			openTriggerElement: null, // ダイアログをオープンしたトリガHTMLのID属性を示す
			openTriggerEventType: null // ダイアログをオープンした時のイベント属性を示す
		},
		/**
		 * ズーム画面を表示する際に引き渡すパラメータを追加します。
		 *
		 * @param event イベント
		 * @param options オプション
		 *           name : パラメータ名
		 *           element : 値の取得元エレメントID
		 *           value : パラメータ値
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		addParam: function(event, options) {
			!this.options.params && (this.options.params = []);
			this.options.params.push({
				name: options.name,
				value: options.element ? $.geui.val(options.element) : options.value
			});
		},
		/**
		 * ズーム画面で項目が選択された時に、Zoom画面から取得する値を追加します。
		 *
		 * @param event イベント
		 * @param options オプション
		 *           key : キー名
		 *           element : 値の代入先エレメントID
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		addReceive: function(event, options) {
			!this.options.receives && (this.options.receives = {});
			this.options.receives[options.key] = options.element;
		},
		/**
		 * ズーム画面で項目が選択された時に、Zoom画面が返す値を追加します。
		 *
		 * @param event イベント
		 * @param options オプション
		 *           key : キー名
		 *           element : 値の代入先エレメントID
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		addReturn: function(event, options) {
			!this.options.returns && (this.options.returns = {});
			this.options.returns[options.key] = options.element;
		},
		/**
		 * イベント用パラメータを生成し取得します。
		 *
		 * @param event イベント
		 * @return [{name:'aaa01',value:'bbb01'},{name:'aaa02',value:'bbb01'}]の形式
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		decorateActionParam: function(event, options, $form) {
			/*jshint unused:false*/
			var id = this.element.attr('id'),
				params = [];
			if (event.type !== (this.widgetEventPrefix + 'open')) { // ページリフレッシュの後、ダイアログの状態を復元するための仕掛け。オープンイベント発火時は対象外（無限ループの可能性があるため）
				$.merge(params, [{
					name: id + '.isTriggeredFromDialog',
					value: true
				}, {
					name: id + '.openTriggerElement',
					value: this.options.currentEvent.target.id
				}, {
					name: id + '.openTriggerEventType',
					value: this.options.currentEvent.type
				}]);
			}
			return $.merge(params, this.options.params || []);
		},
		/**
		 * 現在のイベントを取得又は設定します。
		 *
		 * @param event イベント
		 * @return イベント
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		currentEvent: function(event) {
			if (!event) {
				return this.options.currentEvent;
			}
			this.options.currentEvent = event;
		},
		/**
		 * ズームダイアログを閉じます。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		close: function() {
			if (!this.options.returns || !this.options.receives) {
				this._close();
				return;
			}
			var receives = this.options.receives;
			$.each(this.options.returns, function(key, value) {
				var $ret = $.ge.idSelector(value);
				if (!$ret.length)
					return;
				var $rec = $.ge.idSelector(receives[key]);
				if (!$rec.length)
					return;
				$.geui.val($rec, $.geui.val($ret));
			});
			this._close();
		},
		/**
		 * ズームダイアログを閉じます。
		 *
		 * @private
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		_close: function() {
			$.geui.grdialog.prototype.close.apply(this);
			this.options.currentEvent && $.geui.focus($.ge.event.currentTarget(this.options.currentEvent));
			this.clear();
		},
		/**
		 * クリア処理を行います。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		clear: function() {
			this.options.params = null;
			this.options.returns = null;
			this.options.receives = null;
			this.options.currentEvent = null;
		},
		_trigger: function(type, event, data) {
			if (type !== 'open' || !this.options.isTriggeredFromDialog) {
				$.Widget.prototype._trigger.call(this, type, event, data);
			}
			if (type === 'open') {
				this.options.isTriggeredFromDialog = false;
				this.options.openTriggerElement = null;
				this.options.openTriggerEventType = null;
			}
		}
	});
})(jQuery);
