/*
 * Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
 */

/**
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.gecomm.grequestcreator = $.gecomm.grequestcreator || {};
	/**
	 * HTTPリクエストデータを生成するクラスです。（Ajax、Submit共通）
	 *
	 * @class HTTPリクエストデータを生成
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.gecomm.grequestcreator, {
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		options: {
			actionparams: {
				httpmethod: 'post'
			},
			timeout: $.ge.property.get('gecomm.TimeoutInterval')
		},
		/**
		 * 指定したオプションの内容に基づいて、サブミット用のリクエストデータ生成します。
		 *
		 * @param event イベント
		 * @param options オプション
		 * {
		 *  actionbean: アクションクラス,
		 *  actionmethod: 【必須】アクションメソッド,
		 *  form: (サブミット対象の)Form要素のid属性,
		 *  mode: モード,
		 *  httpmethod: HTTPメソッド,
		 *  indicator: 処理中インジケータのid属性,
		 *  dialogmsg: 確認ダイアログメッセージ,
		 *  customdialog: カスタムダイアログのid属性※サポートしていません。将来、対応する予定です。
		 *  target: Form要素のtarget属性,
		 *  forward: 【必須】フォワード先JSPのパス
		 * }
		 * @return サブミット対象のForm要素を内包したJQueryオブジェクト
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		createSubmitData: function(event, options) {
			var o = $.extend(true, {}, $.gecomm.grequestcreator.options, options);
			var actionparams = o.actionparams || {};
			var url = $.gecomm.grequestcreator._createUrl(event, $.ge.property.get('gecomm.Submit.UrlSuffix'));
			$.gecomm.grequestcreator._setCommType(actionparams, 'submit');
			return $.gecomm.grequestcreator._createRequestForm(event, o, actionparams, url);
		},
		/**
		 * 指定したオプションの内容に基づいて、Ajax用のリクエストデータ生成します。
		 *
		 * バージョン21.9で、リクエストパラメータ（JSON）のフォーマットの変更点：
		 * 　　変更前、httpmethodは、optionsに配下
		 * 　　変更後、httpmethodは、options.actionparamsに配下
		 * 本来httpmethodは、広義的なaction情報であるので、options.actionparamsに移すべき
		 * これで、Ignore機能に、前回発行されたリクエストのhttpmethod情報を復元できる
		 *
		 * @param event イベント
		 * @param options オプション
		 * {
		 *  actionbean: アクションクラス,
		 *  actionmethod: 【必須】アクションメソッド,
		 *  form: (サブミット対象の)Form要素のid属性,
		 *  mode: モード,
		 *  indicator: 処理中インジケータのid属性,
		 *  dialogmsg: 確認ダイアログメッセージ,
		 *  customdialog: カスタムダイアログのid属性※サポートしていません。将来、対応する予定です。
		 *  target: Form要素のtarget属性,
		 *  forward: フォワード先JSPのパス,
		 *  render: レンダリング対象のid属性（カンマ区切りで複数指定可能）
		 *  actionparams : {
		 *    httpmethod : HTTPメソッド,
		 *    ajaxSettings : {
		 *        async : 同期・非同期属性
		 *    }
		 *  }
		 * }
		 * @return Ajax対象のForm要素を内包したJQueryオブジェクト
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		createAjaxData: function(event, options) {
			options = options || {};
			var o = $.extend(true, {}, $.gecomm.grequestcreator.options, options);
			var url = $.gecomm.grequestcreator._createUrl(event, $.ge.property.get('gecomm.Ajax.UrlSuffix'));
			var actionparams = o.actionparams || {};
			var ajaxSettings = $.extend(true, {}, actionparams.ajaxSettings);
			$.gecomm.grequestcreator._setCommType(actionparams, 'ajax');
			var $form = $.gecomm.grequestcreator._createRequestForm(event, o, actionparams, url);
			var ajaxData = null;
			ajaxData = actionparams.download ?
				$.gecomm.grequestcreator.createAjaxDataAttachment(url, o, ajaxSettings) :
				$.gecomm.grequestcreator.createAjaxDataXml(url, o, ajaxSettings);

			if (actionparams.upload && window.FormData) {
				return $.extend(true, {
					data: new FormData($form[0]),
					processData: false,
					contentType: false
				}, ajaxData);
			} else {
				return $.extend(true, {
					data: $form.serialize()
				}, ajaxData);
			}
		},
		createAjaxDataAttachment: function(url, o, ajaxSettings) {
			return $.extend(true, {
				url: url,
				dataType: false,
				processData: false,
				xhrFields: {
					responseType: 'blob'
				},
				complete: o.complete,
				type: o.actionparams.httpmethod
			}, ajaxSettings);
		},
		createAjaxDataXml: function(url, o, ajaxSettings) {
			return $.extend(true, {
				url: url,
				dataType: 'xml',
				complete: o.complete,
				type: o.actionparams.httpmethod
			}, ajaxSettings);
		},
		_createRequestForm: function(event, options, actionparams, url) {
			var o = $.extend(true, {}, actionparams);
			o.actionid || $.gecomm.grequestcreator._putParam(o, 'actionid', $.ge.event.currentTarget(event).attr('id'));
			var $form = $.gecomm.grequestcreator._getActionForm(o);
			delete o.form;
			$.gecomm.grequestcreator._addFormAttr($form, 'action', url);
			$.gecomm.grequestcreator._addFormAttr($form, 'target', o.target);
			$.gecomm.grequestcreator._putParam(o, 'actionform', $form.attr('id'));
			$.gecomm.grequestcreator._putParam(o, 'actiontarget', o.target);
			delete o.target;
			var params = $.gecomm.grequestcreator._parseArray(event, o, $form);
			$.gecomm.grequestcreator._addInputs($form, params);
			return $form;
		},
		_setCommType: function(options, type) {
			$.gecomm.grequestcreator._putParam(options, 'commtype', type);
		},
		_getActionForm: function(actionparams) {
			var $form = actionparams.actionform ? $.ge.idSelector(actionparams.actionform) : $.ge.idSelector(actionparams.actionid).closest('form');
			return $form.length ? $form : $.gecomm.grequestcreator._createDefaultForm();
		},
		_addFormAttr: function($form, attr, value) {
			value === null || value === undefined || $form.attr(attr, value);
		},
		/**
		 * キー重複は上書する。
		 */
		_putParam: function(actionparams, key, value) {
			actionparams[key] = value;
		},
		_removeContents: function() {
			var reqDataId = $.ge.property.get('gecomm.Request.Data.Id');
			$.ge.idSelector(reqDataId).remove();
		},
		_getContents: function($form) {
			var reqDataId = $.ge.property.get('gecomm.Request.Data.Id');
			var $contents = $.ge.idSelector(reqDataId);
			if (!$contents.length) {
				$contents = $('<span id="' + reqDataId + '"/>');
				$contents.appendTo($form);
			}
			return $contents;
		},
		_addInput: function($form, options) {
			var $input = $('<input/>');
			$.each(options, function(key, value) {
				if (!key) return;
				$input.attr(key, value === null || value === undefined ? '' : value);
			});
			var $contents = $.gecomm.grequestcreator._getContents($form);
			$input.appendTo($contents);
		},
		_addInputs: function($form, params) { // params=[{name: 'key1', value: 'value1'}, {name: 'key2', value: 'value2'}, ...} => <input type='hidden' id='key1' name='key1' value='value1'/><input type='hidden' id='key2' name='key2' value='value2'/> ...
			$.gecomm.grequestcreator._removeContents();
			$.map(params, function(p) {
				return $.gecomm.grequestcreator._addInput($form, {
					type: 'hidden',
					name: p.name,
					value: p.value
				});
			}).join('');
			var viewid = $.ge.property.get('gecomm.Viewid.Key'),
				onetimetoken = $.ge.property.get('gecomm.Onetimetoken.Key'),
				backward = $.ge.property.get('gecomm.Backward.Key');
			$.gecomm.grequestcreator._addInput($form, {
				type: 'hidden',
				name: 'reqoptions',
				value: JSON.stringify(params)
			}); // 再リクエスト用に（callback 評価後の）optionsをポストする（hiddenパラメータ除く）
			$.gecomm.grequestcreator._addInput($form, {
				type: 'hidden',
				name: viewid,
				value: $.ge.idSelector(viewid).val()
			});
			$.gecomm.grequestcreator._addInput($form, {
				type: 'hidden',
				name: onetimetoken,
				value: $.ge.idSelector(onetimetoken).val()
			});
			$.gecomm.grequestcreator._addInput($form, {
				type: 'hidden',
				name: backward,
				value: $.ge.idSelector(backward).val()
			});
		},
		_parseArray: function(event, options, $form) {
			var params = [];
			$.each(options, function(key, value) {
				if ($.isFunction(value)) {
					var values = value(event, options, $form);
					values && $.each(values, function(i, p) { // value => [{name: key1, value: value1}, {name: key2, value: value2}, ...]
						params.push(p);
					});
				}
			});
			$.each(options, function(key, value) {
				if ($.isFunction(value)) {
					return true;
				} else if (Array.isArray(value)) {
					$.each(value, function(i, v) {
						params.push({
							name: key,
							value: v
						});
					});
				} else {
					params.push({
						name: key,
						value: value
					});
				}
			});
			return params;
		},
		_submitFormid: 'submitform',
		_createDefaultForm: function() {
			$.ge.idSelector($.gecomm.grequestcreator._submitFormid).remove();
			return $('<form/>')
				.attr('id', $.gecomm.grequestcreator._submitFormid)
				.appendTo('body');
		},
		_createUrl: function(event, suffix) {
			var url = $.ge.contextPath;
			url += '/';
			url += $.ge.event.currentTarget(event).attr('id');
			url += suffix;
			return url;
		}
	});
})(jQuery);
