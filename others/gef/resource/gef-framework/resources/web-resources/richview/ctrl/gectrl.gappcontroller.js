/*
 * Copyright 2011-2021 Kyocera Communication Systems Co., Ltd All rights reserved.
 */
/**
 * 通信関連を取り扱う機能群を定義します。
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */


(function($, undefined) {
	$.gectrl.gappcontroller = $.gectrl.gappcontroller || {};
	/**
	 * 通信関連のファサードクラスです。
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.gectrl.gappcontroller, {
		SCRIPT_BLOCK_ID_SUFFIX: '.script.block',
		/**
		 * Ajaxを実行します。
		 *
		 * @param event イベントオブジェクト
		 * @param options オプション
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		invokeAjaxAction: function(event, options) {
			if ($.ge.process.state === $.ge.process.SUBMITACTIVE) {
				return;
			}
			var focusedElement = document.activeElement;
			var focusedElementId = focusedElement ? focusedElement.id : null;

			$.gectrl.gappcontroller._isInvariantStateAction(options) || ($.ge.process.state = $.ge.process.AJAXACTIVE);
			try {
				$.geui.showIndicator( !! options.actionparams ? options.actionparams.indicator : {});
				var request = $.gecomm.grequestcreator.createAjaxData(event, options);
				var ajax = $.gecomm.gactioninvoker.ajax(request);
				ajax.always(
					function(data, textStatus, xhr) {
						var error = null;
						try {
							$.gectrl.gappcontroller.load(xhr, data);
						} catch (e) {
							error = e;
						} finally {
							$.gectrl.gappcontroller.finish(options.actionparams, error);
							if (focusedElementId !== null) {
								document.getElementById(focusedElementId).focus();
							}
						}
					});
			} catch (e) {
				$.gectrl.gappcontroller.finish(options.actionparams, e);
			}

		},
		/**
		 * サブミットを実行します。
		 *
		 * @param event イベントオブジェクト
		 * @param options オプション
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		invokeSubmitAction: function(event, options) {
			if ($.ge.process.state !== $.ge.process.STOP) {
				return;
			}
			$.gectrl.gappcontroller._isInvariantStateAction(options) || ($.ge.process.state = $.ge.process.SUBMITACTIVE);
			try {
				var $form = $.gecomm.grequestcreator.createSubmitData(event, options);
				$.gecomm.gactioninvoker.submit($form);
				$.geui.showIndicator( !! options.actionparams ? options.actionparams.indicator : {}); // IE対応。submit前はアニメーション画像が有効にならない既知バグがある。
			} catch (e) {
				$.gectrl.gappcontroller.finish(options.actionparams, e);
			}
		},
		/**
		 * プロセス状態が不変なアクションかどうかを判定します。
		 *
		 * @param options オプション
		 * @return 判定フラグ<true>:状態が不変なアクション<false>:その他
		 * @author yamashita 2011/08/05
		 * @since 3.9.0
		 */
		_isInvariantStateAction: function(options) {
			return !!options && !! options.actionparams && options.actionparams.affectState !== undefined && options.actionparams.affectState !== null && !! !options.actionparams.affectState;
		},
		_extractFilenameFromContentDisposition: function(contentDisposition) {
			if (!contentDisposition) {
				return null;
			}
			var filename = contentDisposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
			if (filename.toLowerCase().startsWith('utf-8\'\''))
				filename = decodeURIComponent(filename.replace('utf-8\'\'', ''));
			else
				filename = filename.replace(/['"]/g, '');
			return filename;
		},
		load: function(xhr, data) {
			/*jshint unused:false */
			if (xhr.status === 0) return;
			/*jshint newcap:false */
			if (xhr.status !== 200) throw Error($.ge.property.get('gectrl.SystemError.Message.HttpNot200') + ' http_status=' + xhr.status); // HttpStatusCodeが200以外;
			$.gectrl.gappcontroller.loadData(xhr, data);
		},
		loadData: function(xhr, blob) {
			var contentDisposition = xhr.getResponseHeader('Content-Disposition');
			if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
				var downloadLink = document.createElement('a');
				downloadLink.href = window.URL.createObjectURL(blob);
				downloadLink.download = $.gectrl.gappcontroller._extractFilenameFromContentDisposition(contentDisposition);
				downloadLink.style.display = 'none';

				document.body.appendChild(downloadLink);

				downloadLink.click();
				document.body.removeChild(downloadLink);
			} else {
				var xml = xhr.responseXML;
				if (!xml) {
					return; // レスポンスが空の場合、何もしない。主に、Renderが指定されていない、またはレスポンス不要なAjax通信時が該当する。
				}
				var $xml = $(xml);
				$.gectrl.gappcontroller.loadXml($xml);
				if ($xml.find($.ge.property.get('gectrl.Exitcode.Key')).text() === 'system-error') {
					throw new GServerAppException();
				}
			}
		},

		/**
		 * 通信の後処理を行います。
		 *
		 * @param options オプション
		 * @param errors エラーオブジェクト
		 * @author yamashita 2011/07/15
		 * @since 3.9.0
		 */
		finish: function(options, error) {
			$.geui.hideIndicator(options.indicator);
			$.ge.process.state = $.ge.process.STOP;
			error && $.gectrl.gappcontroller.handleError(error);
		},
		/**
		 * エラー処理を行います。
		 *
		 * @param error エラーオブジェクト
		 * @author yamashita 2011/07/15
		 * @since 3.9.0
		 */
		handleError: function(error) {
			$.ge.process.state = $.ge.process.STOP;
			var element = error && error instanceof GServerAppException ? $.geui.getSystemErrorContents() : null;
			$.geui.showSystemError(error, element);
		},
		/**
		 * XMLをロードします。
		 *
		 * @param $xml JQuery化したxmlオブジェクト
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		loadXml: function($xml) {
			var onetimeToken = $xml.find($.ge.property.get('gectrl.Onetimetoken.Key')).text();
			onetimeToken && $.ge.idSelector($.ge.property.get('gecomm.Onetimetoken.Key')).val(onetimeToken);
			var viewid = $xml.find($.ge.property.get('gectrl.Viewid.Key')).text();
			viewid && $.ge.idSelector($.ge.property.get('gecomm.Viewid.Key')).val(viewid);
			var $renders = $xml.find('render');
			var elements = [];
			$renders.each(function() {
				/*jshint evil:true */
				var element = $(this).attr('element'); // $(this) = '<render element="ItemCD" ..><span id="ItemCD"><input type="text" id="ItemCD" ../></render>...'
				var $content = $(this).children();
				var script = '';
				$.gectrl.gappcontroller._cleanError(element);
				var $element = $.ge.idSelector(element);
				if (!$element.length) {
					$element = $.gectrl.gappcontroller._createContents($content);
				}
				var slen = $content.attr('id').length;
				if ($content.attr('id').substring(slen - $.gectrl.gappcontroller.SCRIPT_BLOCK_ID_SUFFIX.length, slen) === $.gectrl.gappcontroller.SCRIPT_BLOCK_ID_SUFFIX) {
					$content.find('script').each(function() {
						script += $(this)[0].innerHTML || $(this)[0].text; // クロスブラウザ対応)
					});
					script && eval(script); // クロスブラウザ対応
				} else {
					// xml形式では、textareaなどのタグが空要素である場合、閉じタグが無くなってしまう。(<textarea></textarea> ⇒ <textarea/>)
					// そのため、xml文字列をHTML形式にパースしてから出力させる
					var content = $content[0].outerHTML || $content[0].xml; // クロスブラウザ対応)
					var $html = $.parseHTML(content);
					$element.empty(); //ネイティブメソッドを使ってのDOM置き換えを行うとjQueryのキャッシュ上にエレメントがリークする為事前にempty()を呼ぶ
					$element[0].innerHTML = $html[0].innerHTML;
				}
				elements.push($element);
			});
			$.each(elements, function() {
				$.geui.createWidgets(this);
			});
		},
		_cleanError: function(element) {
			var renderKey = $.ge.property.get('gectrl.SystemError.Render.Key'),
				renderBlockKey = $.ge.property.get('gectrl.SystemError.Render.Block.Key');
			if (renderKey !== element && renderBlockKey !== element) return;
			$.ge.idSelector(element).remove();
			renderKey === element && $.geui.getSystemErrorContents().remove();
		},
		/**
		 * ページ上に存在しないコンテンツをbody要素配下に生成します。
		 *
		 * @author yamashita 2011/09/13
		 * @since 3.9.0
		 */
		_createContents: function($content) {
			var $element = null;
			$content.each(function() { // systemerror or その他コンテンツをロード
				var type = this.nodeName.toLowerCase();
				if (type !== '#comment') {
					$element = $(this.outerHTML || $(this)[0].xml); // クロスブラウザ対応。【outerHTMLを利用する理由】 $(this).html() == $(this)[0].innerHTMLは、名前空間が対象要素に自動挿入されている。この状態で、BODYにアペンドすると、（おそらく）ブラウザが拡張属性の名前空間を解決し、拡張属性のプレフィックスを勝手に除去する。このため、後工程のウィジェット化に失敗してしまう。
					$element.appendTo('body');
					return false;
				}
			});
			return $element;
		},
		/**
		 * 「改行コード×２」を「改行コード×１」へ変換します。
		 * これは、Ajax処理結果であるXmlHttpResponse#responseXMLに改行が含まれている場合、IE9-では「改行コード（厳密には'%0A'：ラインフィード）」が2倍となることに起因します。
		 * IE9+やFireFox、Chromeでは、想定通り改行コードは'%D%A'で取得できるため問題ありません。
		 *
		 * @param str 置換対象の文字列
		 * @author yamashita 2011/07/15
		 * @returns 置換後の文字列
		 * @since 3.12.0
		 */
		_escapeIE: function(str) {
			return window.unescape(window.escape(str).replace(/%0A%0A/g, '%0A'));
		}
	});

	function GServerAppException() {}
})(jQuery);
