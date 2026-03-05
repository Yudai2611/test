// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エレメントハンドラの共通機能を定義します。
 *
 * @author yamashita 2013/08/27
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler = $.geui.handler || {};
	$.extend($.geui.handler, {
		_handlerMap: {},
		/**
		 * 指定したキーに該当するハンドラクラスを取得します。
		 *
		 * @param key キー
		 * @return ハンドラクラス
		 * @author yamashita 2011/08/22
		 * @since 3.9.0
		 */
		get: function(key) {
			var handler = this._handlerMap[key ? key : ''];
			return handler ? handler : this._handlerMap[''];
		},
		set: function(key, handler) {
			this._handlerMap[key] = handler;
		}
	});
})(jQuery);
