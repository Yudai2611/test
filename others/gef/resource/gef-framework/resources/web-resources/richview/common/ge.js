// Copyright 2011-2016 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * 共通ユーティリティ機能を定義します。
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.ge = $.ge || {};
	var _defaultLocale = 'en';
	var _defaultContextPath = '/geframe';
	/**
	 * 共通ユーティリティクラスです。
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.ge, {
		/**
		 * デフォルトロケールを取得または設定します。
		 *
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		locale: _defaultLocale,
		/**
		 * デフォルトコンテキストパスを取得または設定します。
		 *
		 * @author hamanaka 2011/07/14
		 * @since 3.9.0
		 */
		contextPath: _defaultContextPath,
		/**
		 * セレクタ文字列をエスケープします。
		 *
		 * @param エスケープ対象の文字列
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		escSelectorString: function(value) {
			if (!value) return value;
			var regexp = new RegExp('(!|\"|#|\\$|%|&|\'|\\(|\\)|\\*|\\+|,|\\.|\\/|:|;|<|=|>|\\?|@|\\[|\\]|\\^|`|\\{|\\||\\}|~|\\\\)', 'g');
			return value.replace(regexp, '\\$1');
		},
		/**
		 * 正規表現で使用する文字をエスケープします。
		 *
		 * @param value エスケープ対象の文字列
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		escRegExp: function(value) {
			return value.replace(/\\/g, '\\\\').replace(/\./g, '\\.').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\^/g, '\\^').replace(/\$/g, '\\$').replace(/\+/g, '\\+').replace(/\?/g, '\\?').replace(/\*/g, '\\*').replace(/\|/g, '\\|').replace(/\{/g, '\\{').replace(/\}/g, '\\}');
		},
		/**
		 * 指定されたセレクタ文字列が示すjQueryオブジェクトを取得します。
		 * 第一引数が未定義値やnull等であった場合でもjQueryオブジェクトを返却します。
		 *
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		idSelector: function(selector, context) {
			var $context = $.geui.getElement(context);
			if (!$context.length || $context[0] === document) {
				return $(document.getElementById(selector));
			} else {
				return $context.find('#' + $.ge.escSelectorString(selector));
			}
		}
	});
})(jQuery);
/**
 * 共通プロパティを定義します。
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.ge = $.ge || {};
	$.ge.property = $.ge.property || {};
	/**
	 * プロパティ定義情報を格納します。
	 * 静的なプロパティ情報を設定する際は、事前に_defaultPropertiesに指定します。
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	var _defaultProperties = {
		//####### gectrl #######
		'gectrl.SystemError.Render.Key': 'geframe.richview.SystemError.Render',
		'gectrl.SystemError.Render.Block.Key': 'geframe.richview.SystemError.Render.script.block',
		'gectrl.SystemError.Message.HttpNot200': 'A communication failure has occurred.',
		'gectrl.SystemError.Message.UnHandle.ServerError': 'An exception occurred on the server side can not handle.',
		'gectrl.Exitcode.Key': 'exit-code',
		'gectrl.Onetimetoken.Key': 'onetime-token',
		'gectrl.Viewid.Key': 'view-id',
		//####### gecomm #######
		'gecomm.SendInterval': 100,
		'gecomm.TimeoutInterval': 5000,
		'gecomm.PoolSize': 2,
		'gecomm.Ajax.UrlSuffix': '.ajax-action',
		'gecomm.Submit.UrlSuffix': '.view-action',
		'gecomm.Viewid.Key': 'viewid',
		'gecomm.Onetimetoken.Key': 'onetimetoken',
		'gecomm.Backward.Key': 'backward',
		'gecomm.Request.Data.Id': 'gecomm.grequestcreator.requestdata.id',
		//####### geui   #######
		'geui.Namespace': 'geui',
		'geui.SystemError.Name': 'grsystemerrordialog',
		'geui.SystemError.Class.Name': 'geui-grsystemerrordialog',
		'geui.SystemError.Options': '{"width": 320, "title": "SYSTEM ERROR"}',
		'geui.XHtml.Ex.Attr.Namespace': 'ghx:namespace',
		'geui.XHtml.Ex.Attr.Widgetclass': 'ghx:widgetclass',
		'geui.XHtml.Ex.Attr.Options': 'ghx:options',
		'geui.XHtml.Ex.Attr.Clear': 'ghx:clear',
		'geui.XHtml.Ex.Attr.Tag': 'ghx:tag',
		'geui.XHtml.Ex.Attr.Initvalue': 'ghx:initvalue',
		'geui.XHtml.Ex.Attr.RadioGroup': 'ghx:radiogroup'
	};
	/**
	 * 共通プロパティクラスです。
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.ge.property, {
		/**
		 * 指定されたプロパティを登録します.
		 * プロパティ値が未定義値又はnull等の場合nullが登録されます。
		 *
		 * @param {string} key プロパティ名
		 * @param {string} value プロパティ値
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		set: function(key, value) {
			this._properties[key] = value ? value : null;
		},
		/**
		 * 指定されたプロパティ名に対応する値を返します。
		 *
		 * @param {string} key プロパティ名
		 * @return プロパティの値
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		get: function(key) {
			var value = this._properties[key];
			return value ? value : null;
		},
		/**
		 * プロパティを設定します。
		 *
		 * @param {{string:string}} values {プロパティ名:プロパティ値}
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		setProperties: function(values) {
			this._properties = {};
			var self = this;
			$.each(values, function(key, value) {
				self.set(key, value);
			});
		},
		/**
		 * プロパティをデフォルト値に戻します。
		 *
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		refresh: function() {
			this._properties = $.extend({}, _defaultProperties);
		},
		/**
		 * プロパティの内容を返します。
		 *
		 * @return {{string:string}} {プロパティ名:プロパティ値}
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		getProperties: function() {
			return this._properties;
		}
	});
	$.ge.property._properties = $.extend({}, _defaultProperties);
})(jQuery);
/**
 * 通信状態を定義します。
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.ge = $.ge || {};
	$.ge.process = $.ge.process || {};
	/**
	 * 通信状態を表します。
	 * ・$.ge.process.AJAXACTIVE   ： Ajax通信中
	 * ・$.ge.process.SUBMITACTIVE ： Submit通信中
	 * ・$.ge.process.STOP         ： 停止中
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.ge.process, {
		AJAXACTIVE: 1,
		SUBMITACTIVE: 2,
		STOP: 5
	});
	$.ge.process.state = $.ge.process.STOP;
})(jQuery);
/**
 * イベントハンドラーを定義します。eventオブジェクトのマルチブラウザ対応機能を提供します。
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.ge = $.ge || {};
	$.ge.event = $.ge.event || {};
	/**
	 * 共通イベント
	 *
	 * @author yamashita 2011/07/03
	 * @since 3.9.0
	 */
	$.extend($.ge.event, {
		/**
		 * ターゲットeventを取得します。
		 * ※マルチブラウザ対応（ie=event.srcElement, other=event.currentTarget）
		 *
		 * @param event イベントオブジェクト
		 * @return ターゲットevent
		 * @author yamashita 2011/07/03
		 * @since 3.9.0
		 */
		target: function(event) {
			return $($.ge.event.fix(event).target);
		},
		/**
		 * カレントeventを取得します。
		 * ※マルチブラウザ対応（ie=event.srcElement, other=event.currentTarget）
		 *
		 * @param event イベントオブジェクト
		 * @return カレントevent
		 * @author yamashita 2011/07/03
		 * @since 3.9.0
		 */
		currentTarget: function(event) {
			return $($.ge.event.fix(event).currentTarget);
		},
		/**
		 * eventオブジェクトをJQueryのeventオブジェクトに変換します。
		 * ※マルチブラウザ対応（ie=event.srcElement, other=event.currentTarget）
		 *
		 * @param event イベントオブジェクト
		 * @return JQueryのイベントオブジェクト
		 * @author yamashita 2011/07/03
		 * @since 3.9.0
		 */
		fix: function(event) {
			return $.event.fix(event);
		}
	});
})(jQuery);
