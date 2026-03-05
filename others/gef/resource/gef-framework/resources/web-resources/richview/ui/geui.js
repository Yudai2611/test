// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * UIの共通機能を定義します。
 *
 * @author T.Aono 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	$.geui = $.geui || {};
	var XHTML_ATTRIBUTE_NAMESPACE_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.Namespace'),
		XHTML_ATTRIBUTE_CLASSNAME_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.Widgetclass'),
		XHTML_ATTRIBUTE_OPTIONS_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.Options'),
		XHTML_ATTRIBUTE_CLEAR_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.Clear'),
		XHTML_ATTRIBUTE_TAG_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.Tag');
	$.extend($.geui, {
		/**
		 * widget クラスの属性、メソッドをコピー元からコピー対象にコピーします。
		 *
		 * @param {$.ui.widget.prototype} dist コピー先 widget のprototype
		 * @param {$.ui.widget.prototype} from コピー元 widget のprototype
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		extend: function(dist, from) {
			$.extend(dist, $.extend(true, {}, from, dist));
		},
		/**
		 * ウィジェットを生成します。
		 *
		 * [widgetclass][namespace][options] の属性を保持してる HTML エレメントを指定内容に従い widget 化します。
		 *
		 * [widgetClass] … widget化対象のクラス名称を指定
		 * [namespace] … widget化対象のクラスの名前空間を指定
		 * [options] … widget化対象のクラスの初期化の際に引き渡す options を指定
		 *
		 * @param context HTMLエレメント
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		createWidgets: function(context) {
			/**
			// IE7又はIE8で、namespace付き属性名セレクタを使用し、
			// 検索範囲内にtableタグが存在するときエラーが発生します。
			// これを回避するために「:not(table)」を前に付ける。
			// jquery.js v1.6.1の場合、3973行目又は4509行目を参照。
			 */
			var $context = $.geui.getElement(context);
			$context = $context.length ? $context : $(document);
			$context.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_CLASSNAME_NAME) + ']').filter(function() {
				return $.geui.isWidget(this);
			}).each(function() {
				$.geui.createWidget(this);
			});
		},
		/**
		 * ウィジェットを破棄します。
		 *
		 * [widgetclass][namespace][options] の属性を保持してる HTML エレメントを指定内容に従い widget を破棄します。
		 *
		 * [widgetClass] … widget化対象のクラス名称を指定
		 * [namespace] … widget化対象のクラスの名前空間を指定
		 * [options] … widget化対象のクラスの初期化の際に引き渡す options を指定
		 *
		 * @param context HTMLエレメント
		 * @author kikuchi 2013/06/04
		 * @since 3.12.0
		 */
		destroyWidgets: function(context) {
			/**
			// IE7又はIE8で、namespace付き属性名セレクタを使用し、
			// 検索範囲内にtableタグが存在するときエラーが発生します。
			// これを回避するために「:not(table)」を前に付ける。
			// jquery.js v1.6.1の場合、3973行目又は4509行目を参照。
			 */
			var $context = $.geui.getElement(context);
			$context = $context.length ? $context : $(document);
			$context.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_CLASSNAME_NAME) + ']').filter(function() {
				return $.geui.isWidget(this);
			}).each(function() {
				$.geui.destroyWidget(this);
			});
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）のウィジェットを破棄します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		destroyWidget: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				widget.destroy();
				return;
			}
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）をウィジェット化します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return 生成したウィジェットオブジェクト
		 * @return widgetオブジェクト
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		createWidget: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var widgetNamespace = $.geui.attr($element, XHTML_ATTRIBUTE_NAMESPACE_NAME);
			var widgetClass = $.geui.attr($element, XHTML_ATTRIBUTE_CLASSNAME_NAME);
			if (!widgetNamespace || !widgetClass) {
				return;
			}
			var options = $.geui.getOptions($element);
			var instance = $.geui.getWidget($element, widgetNamespace, widgetClass);
			if (instance) {
				instance.option(options || {})._init();
			} else {
				var fn = $[widgetNamespace][widgetClass];
				if (!fn) {
					var errormsg = 'Given "namespace" or "widgetclass" value is incorrect.(id=';
					errormsg += $element.attr('id');
					errormsg += ', namespace=';
					errormsg += widgetNamespace;
					errormsg += ', widgetclass=';
					errormsg += widgetClass;
					errormsg += ')';
					/*jshint newcap:false */
					throw Error(errormsg);
				}
				/*jshint newcap:false */
				instance = new fn(options, $element[0]);
				$.data($element[0], widgetNamespace + '-' + widgetClass, instance);
			}
			return instance ? instance : null;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）のオプションを取得します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return オプション
		 * @author kikuchi 2013/07/24
		 * @since 3.12.0
		 */
		getOptions: function(element) {
			/*jshint evil:true*/
			var $element = $.geui.getElement(element);
			if (!$element.length) return null;
			var widgetOptions = $.geui.attr($element, XHTML_ATTRIBUTE_OPTIONS_NAME);
			var options = {};
			typeof widgetOptions === 'string' && (eval('options =' + widgetOptions)); // $.parseJSON(widgetOptions)では、「関数」を評価できないためevalを使用
			return options;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたHTMLエレメントの属性値を取得または設定します。
		 *
		 * GEF22.3、jQueryバージョンアップにて対応内容：
		 * jQuery 1.9前は、
		 *   $().attr("value")は、$().prop("value")と同じく、propertyのvalue値を取得します。
		 * それに従って、GEFは、以下の実装になりました。
		 *   $.geui.attr()値取得：$().attr(attrName)で取得
		 *   $.geui.attr()値設定：$().attr(attrName, value)で設定
		 *
		 * jQuery 1.9以降は、以下の変更点があります。
		 *   $().attr("value")：attributeのvalue値を取得します。
		 *   $().val()　或は　$().prop("value")：propertyのvalue値を取得します。
		 *
		 * GEFは、migration.jsを使うことで、意識せずその変更点を吸収しました。
		 * GEF22.3、jQueryバージョンアップにて、migration.jsも消しましたので、
		 * バージョンアップ前後の相違点を吸収するため、実装は以下に変更しました。
		 *   $.geui.attr()値取得：
		 *     propertyに属性ある場合、propertyから取得（$().prop())
		 *     propertyに属性ない場合、attributeから取得($().attr())
		 *   $.geui.attr()値設定：
		 *     propertyにも、attributeにも両方設定（.prop()、.attr())
		 *
		 *   https://github.com/jquery/jquery-migrate/blob/main/warnings.md
		 *     jQuery.fn.attr('value') no longer gets properties
		 *     jQuery.fn.attr('value', val) no longer sets properties
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param attrName 属性名
		 * @param value 設定値
		 * @return HTMLエレメントが存在する：属性値、HTMLエレメントが存在しない：null
		 * @author kikuchi 2013/07/24
		 * @since 3.12.0
		 */
		attr: function(element, attrName, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return null;
			if (arguments.length === 2) {
				return typeof($element.prop(attrName)) !== 'undefined' ? $element.prop(attrName) : $element.attr(attrName);
			}
			$element.prop(attrName, value);
			$element.attr(attrName, value);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたHTMLエレメントの属性値を、boolean型に変換して返します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param attrName 属性名
		 * @param defaultbool 属性値がundefinedであった場合の返り値
		 * @return 属性値がundefined：デフォルト値、属性値が"false"：false、その他：javascript標準のboolean変換値
		 * @author kikuchi 2013/07/24
		 * @since 3.12.0
		 */
		booleanAttr: function(element, attrName, defaultBool) {
			var val = $.geui.attr(element, attrName);
			if (val === undefined) return typeof defaultBool === 'boolean' ? defaultBool : true; //undefinedはデフォルトtrue
			if (val === 'false') return false;
			return !!val;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットを有効化します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/08/24
		 * @since 3.9.0
		 */
		enable: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				widget.enable && widget.enable();
				return;
			}
			var $element = $.geui.getElement(element);
			$element.length && $element.prop('disabled', false);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットを無効化します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/08/24
		 * @since 3.9.0
		 */
		disable: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				widget.disable && widget.disable();
				return;
			}
			var $element = $.geui.getElement(element);
			$element.length && $element.prop('disabled', true);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）の状態がdisabledかどうかを判定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/10/13
		 * @since 3.10.0
		 */
		isDisabled: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				return !!widget.options.disabled;
			}
			var $element = $.geui.getElement(element);
			if ($element.length) {
				return !!$element.prop('disabled'); //マルチブラウザ対応（IE:false chrome,firefox:undefinedを返すため"!!"を付加）
			}
			return false;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットを読取専用にします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/08/27
		 * @since 3.9.0
		 */
		readonly: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				widget.readonly && widget.readonly();
				return;
			}
			var $element = $.geui.getElement(element);
			$element.length && $element.prop('readonly', true);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットを読取可能にします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/08/27
		 * @since 3.9.0
		 */
		readwrite: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				widget.readwrite && widget.readwrite();
				return;
			}
			var $element = $.geui.getElement(element);
			$element.length && $element.prop('readonly', false);
		},
		/**
		 * ウィジェットかどうかを判定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return true: ウィジェット false: ウィジェット以外
		 * @author yamashita 2011/06/13
		 * @since 3.9.0
		 */
		isWidget: function(element) {
			return $.geui.attr(element, XHTML_ATTRIBUTE_NAMESPACE_NAME) && $.geui.attr(element, XHTML_ATTRIBUTE_CLASSNAME_NAME) ? true : false;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットの値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 設定値
		 * @return 設定値
		 * @author kikuchi 2013/07/24
		 * @since 3.12.0
		 */
		val: function(element, value) {
			if (!arguments.length) return;
			var widget = $.geui.getWidget(element);
			if (widget && widget.isVariable) {
				if (arguments.length === 1) {
					return widget.val();
				}
				widget.val(value);
				return;
			}
			var tag = $.geui.attr(element, XHTML_ATTRIBUTE_TAG_NAME);
			if (arguments.length === 1) {
				return $.geui.handler.get(tag).val(element);
			}
			$.geui.handler.get(tag).val(element, value);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットを取得します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return ウィジェット
		 * @author yamashita 2011/06/13
		 * @since 3.9.0
		 */
		getWidget: function(element, wNamespace, wClass) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return null;
			var widgetNamespace = wNamespace || $.geui.attr($element, XHTML_ATTRIBUTE_NAMESPACE_NAME);
			var widgetClass = wClass || $.geui.attr($element, XHTML_ATTRIBUTE_CLASSNAME_NAME);
			var widget = widgetClass ? $element.data(widgetNamespace + '-' + widgetClass) : null;
			return widget ? widget : null;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたHTMLエレメントをjQueryオブジェクトに変換して返します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return jQueryオブジェクト
		 * @author yamashita 2013/07/01
		 * @since 3.12.0
		 */
		getElement: function(element) {
			if (element instanceof jQuery) return element;
			return typeof element === 'string' ? $.ge.idSelector(element) : $(element);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたHTMLエレメントのクリア属性に値（FALSE）を設定します。
		 * 第二引数(recursive)にtrueを指定した場合、そのHTMLエレメント内の子エレメントに対して再帰的にクリア属性に値（FALSE）を設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param recursive true: 再帰する, false: 再帰しない
		 * @author hamanaka 2011/07/30
		 * @since 3.9.0
		 */
		setClearFalse: function(element, recursive) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			$element.attr(XHTML_ATTRIBUTE_CLEAR_NAME, 'false');
			recursive && $element.find('*').each(function() {
				$(this).attr(XHTML_ATTRIBUTE_CLEAR_NAME, 'false');
			});
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたシステムエラー通知ウィジェットを表示します。
		 * エラーオブジェクト（Error）が指定されている場合、そのエラーメッセージをコンテンツに設定します。
		 *
		 * @param error エラーオブジェクト（Error）
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		showSystemError: function(error, element) { // error instanceof Error
			var $element = $.geui.getElement(element);
			if (!$element.length) {
				$element = $.geui._createSystemErrorDialog(error);
			}
			var widget = $.geui.getWidget($element);
			widget && widget.showError();
		},
		/**
		 * システムエラー通知用のコンテンツを取得します。
		 *
		 * @private
		 * @return システムエラー通知用のコンテンツ
		 * @author yamashita 2013/06/18
		 * @since 3.12.0
		 */
		getSystemErrorContents: function() {
			return $('.' + $.ge.escSelectorString($.ge.property.get('geui.SystemError.Class.Name')));
		},
		/**
		 * デフォルトのシステムエラー通知ウィジェットを生成します。
		 *
		 * @private
		 * @return システムエラー通知ウィジェット
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		_createSystemErrorDialog: function(error) {
			var $contents = $.geui.getSystemErrorContents();
			$contents.length && $contents.remove();
			var $dialog = $('<div/>')
				.attr(XHTML_ATTRIBUTE_NAMESPACE_NAME, $.ge.property.get('geui.Namespace'))
				.attr(XHTML_ATTRIBUTE_CLASSNAME_NAME, $.ge.property.get('geui.SystemError.Name'))
				.attr(XHTML_ATTRIBUTE_OPTIONS_NAME, $.ge.property.get('geui.SystemError.Options'))
				.appendTo('body');
			error && error.message && $dialog.html(error.message);
			$.geui.setClearFalse($dialog, true);
			$.geui.createWidget($dialog);
			return $dialog;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたインジケータウィジェットを表示します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		showIndicator: function(element) {
			var widget = $.geui.getWidget(element);
			widget && widget.show();
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたインジケータウィジェットを非表示します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		hideIndicator: function(element) {
			var widget = $.geui.getWidget(element);
			widget && widget.hide();
		},
		/**
		 * 指定したオプションを基に、確認ダイアログを表示します。
		 * ※カスタムダイアログ表示（options.customdialog）は、現在、サポートしていません。
		 *
		 * @param options オプション
		 * {
		 *  dialogmsg: 確認ダイアログメッセージ
		 * }
		 * @return
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		confirmAction: function(options) {
			/*jshint noempty:false*/
			if (!options) return true;
			if (options.dialogmsg) {
				return window.confirm(options.dialogmsg);
			} else if (options.customdialog) {
				// TODO: [2011/04/25][yamashita]カスタムダイアログオープン	戻り値はfalse、メソッドはshowDialogとする
				//				var $dialog = $(options.customdialog);
				//				return $dialog.show;
			}
			return true;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットの値をクリアします。
		 *
		 * @param event イベントオブジェクト
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param options オプション
		 * {
		 *  element: リセット対象のXHTMLエレメント または id属性 または JQueryオブジェクト,
		 * }
		 * @author hamanaka 2011/07/30
		 * @since 3.9.0
		 */
		clear: function(event, options) {
			if (!options) return;
			// 1.クリア範囲が指定されているかどうか
			var $context = $.geui.getElement(options.element);
			// 2.イベント発火したエレメントはあるか
			var $event = event ? $.ge.event.target(event) : null;
			// クリア範囲が指定されていなければ、イベント発火元からクリア範囲を取得
			var $element = (!$context.length && $event) ? $event.closest('form') : $context;
			if (!$element.length) {
				return;
			}
			$.geui._clearWidget($element);
			$.geui._clearPlain($element);
			$.geui._clearXhtml($element);
		},
		/**
		 * 指定したJQueryオブジェクトに関連付けられたウィジェット、あるいは、その配下のウィジェットの値をクリアします。
		 *
		 * @param $element jQueryオブジェクト
		 * @author hamanaka 2011/07/29
		 * @since 3.10.0.D
		 */
		_clearWidget: function($element) {
			/**
			// IE7又はIE8で、namespace付き属性名セレクタを使用し、
			// 検索範囲内にtableタグが存在するときエラーが発生します。
			// これを回避するために「:not(table)」を前に付ける。
			// jquery.js v1.6.1の場合、3973行目又は4509行目を参照。
			 */
			var $elem = $.geui.getElement($element);
			$elem = $elem.length ? $elem : $(document);
			$elem.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_CLASSNAME_NAME) + ']').filter(function() {
				return $.geui.isWidget(this);
			}).each(function() {
				var widget = $.geui.getWidget(this);
				widget && widget.clear && widget.clear();
			});
		},
		/**
		 * 指定したJQueryオブジェクトに関連付けられたHTMLエレメント、あるいは、その配下のHTMLエレメントの値をクリアします。
		 * クリア処理は、ハンドラ経由でプレーン系コントロールのみとなります。
		 *
		 * @param $element jQueryオブジェクト
		 * @author yamashita 2011/09/13
		 * @since 3.10.0.D
		 */
		_clearPlain: function($element) {
			var $elem = $.geui.getElement($element);
			$elem = $elem.length ? $elem : $(document);
			$elem.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_TAG_NAME) + ']').each(function() {
				var tag = $.geui.attr(this, XHTML_ATTRIBUTE_TAG_NAME);
				var handler = $.geui.handler.get(tag);
				handler && handler.clear && handler.clear(this);
			});
		},
		/**
		 * 指定したJQueryオブジェクトに関連付けられたHTMLエレメント、あるいは、その配下のHTMLエレメントの値をクリアします。
		 *
		 * @param $element jQueryオブジェクト
		 * @author hamanaka 2011/07/29
		 * @since 3.10.0.D
		 */
		_clearXhtml: function($element) {
			var $elem = $.geui.getElement($element);
			$elem = $elem.length ? $elem : $(document);
			$elem.find(':input[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_CLEAR_NAME) + '=true]').filter(function() {
				return !$.geui.isWidget(this);
			}).each(function() {
				var $this = $(this);
				$this.is(':not(:button):not(:submit):not(:reset):not(:image):not(:radio)') && $this.val('');
				$this.is(':radio,:checkbox') && $this.prop('checked', false);
				$this.is('select') && $this.find('option:first').prop('selected', true);
			});
		},
		/**
		 * 指定したフォーム上に存在する全てのプレーン、ウィジェット、HTMLエレメントの値をリセットします。
		 *
		 * @param event イベントオブジェクト
		 * @param options オプション
		 * {
		 *  element: リセット対象のXHTMLエレメント または id属性 または JQueryオブジェクト,
		 * }
		 * @author yamashita 2011/09/18
		 * @since 3.9.0
		 */
		resetAll: function(event, options) {
			if (!options) return;
			var $context = $.geui.getElement(options.element);
			var $event = event ? $.ge.event.target(event) : null;
			var $form = (!$context.length && $event) ? $event.closest('form') : $context;
			if (!$form.length || !$form[0].reset) {
				return;
			}
			$form[0].reset();
			$.geui.reset(event, {
				element: $form
			});
		},
		/**
		 * 指定したフォーム上に存在する（RIA含む）全てのウィジェット、HTMLエレメントの値をリセットします。
		 * ※formのリセット処理（form.reset()）は行いません。
		 *
		 * @param event イベントオブジェクト
		 * @param options オプション
		 * {
		 *  element: リセット対象のXHTMLエレメント または id属性 または JQueryオブジェクト,
		 * }
		 * @author yamashita 2011/07/30
		 * @since 3.9.0
		 */
		reset: function(event, options) {
			if (!options) return;
			var $context = $.geui.getElement(options.element);
			var $event = event ? $.ge.event.target(event) : null;
			var $form = (!$context.length && $event) ? $event.closest('form') : $context;
			if (!$form.length || !$form[0].reset) {
				return;
			}
			$.geui._resetPlain($form);
			$.geui._resetWidget($form);
		},
		/**
		 * 指定したフォーム上に存在する全てのウィジェットの値をリセットします。
		 *
		 * @param $form リセット対象のFORMエレメント jQueryオブジェクト
		 * @author hamanaka 2011/07/29
		 * @since 3.10.0.D
		 */
		_resetWidget: function($form) {
			/**
			// IE7又はIE8で、namespace付き属性名セレクタを使用し、
			// 検索範囲内にtableタグが存在するときエラーが発生します。
			// これを回避するために「:not(table)」を前に付ける。
			// jquery.js v1.6.1の場合、3973行目又は4509行目を参照。
			 */
			var $elem = $.geui.getElement($form);
			$elem = $elem.length ? $elem : $(document);
			$elem.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_CLASSNAME_NAME) + ']').filter(function() {
				return $.geui.isWidget(this);
			}).each(function() {
				var widget = $.geui.getWidget(this);
				widget && widget.reset && widget.reset();
			});
		},
		/**
		 * 指定したフォーム上に存在する全てのプレーン系のHTMLエレメントの値をリセットします。
		 * この処理は拡張属性ghx:tagが指定されている要素のみ対象とします.
		 *
		 * @param $element リセット範囲のエレメント jQueryオブジェクト
		 * @author yamashita 2011/09/13
		 * @since 3.10.0.D
		 */
		_resetPlain: function($element) {
			var $elem = $.geui.getElement($element);
			$elem = $elem.length ? $elem : $(document);
			$elem.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_TAG_NAME) + ']').each(function() {
				var tag = $.geui.attr(this, XHTML_ATTRIBUTE_TAG_NAME);
				var handler = $.geui.handler.get(tag);
				handler && handler.reset && handler.reset(this);
			});
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたHTMLエレメントをフォーカス状態にします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return true:フォーカス状態に成功、false:フォーカス状態に失敗
		 * @author yamashita 2011/07/08
		 * @since 3.9.0
		 */
		focus: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return false;
			$element.trigger('focus');
			// focusイベントの発火が行われたのでtrue
			return true;
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値に含まれる改行を有効化します。<br/>
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param val 値
		 * @author yamashita 2013/06/18
		 * @since 3.12.0
		 */
		multiline: function(element, val) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var text = val || $element.text();
			text = text.replace(/&/g, '&#38;');
			text = text.replace(/ /g, '&#160;');
			text = text.replace(/</g, '&#60;');
			text = text.replace(/>/g, '&#62;');
			text = text.replace(/"/g, '&#34;');
			text = text.replace(/'/g, '&#39;');
			text = text.replace(/\t/g, '&#160;&#160;&#160;&#160;');
			text = text.replace(/\\/g, '&#165;');
			text = text.replace(/[\r\n]/g, '<br/>');
			$element.html(text);
		}
	});
	$(function() {
		$.geui.createWidgets(document);
	});
})(jQuery);
