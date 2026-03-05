// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * jquery.numberformatter - Formatting/Parsing Numbers in jQuery
 *
 * Copyright 2011 Michael Abernethy, Andrew Parry
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/
/**
 * ナンバーウィジェットを定義します。
 *
 * @author T.Aono 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'ui-widget ui-widget-content ui-corner-all geui-grsnumber',
		disabledClass = 'ui-state-disabled geui-grsnumber-disabled',
		readonlyClass = 'geui-grsnumber-readonly',
		labelClass = 'geui-grsnumber-label';
	/**
	 * geui.grsnumber ウィジェットクラス
	 *
	 * ダイアログ表示用のウィジェット です。
	 *
	 * @extend {$.geui.gformatwidgetbase}
	 * @author T.Aono 2011/3/11
	 * @since 3.9.0
	 */
	$.widget('geui.grsnumber', $.geui.grstext, {
		_baseClass: baseClass,
		_disabledClass: disabledClass,
		_readonlyClass: readonlyClass,
		_labelClass: labelClass,
		/**
		 * オプションを定義します。
		 *
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		options: {
			locale: null
		},

		/**
		 * 生成処理を行います。
		 *
		 * @private
		 * @author kobayashi 2011/06/25
		 * @since 3.9.0
		 */
		_create: function() {
			this.options.locale = this.options.locale || $.ge.locale;
			var regional = $.geui.grsnumber.regional[this.options.locale] || $.geui.grsnumber.defaults;
			this.options = $.extend({}, regional, this.options);
			$.geui.grstext.prototype._create.call(this);
			var self = this;
			this.element.on('focus.grsnumber', function() {
				if (!self.options.readonly && !self.options.disabled) {
					var value = self._parseNumber(self.val(), self.options);
					setTimeout(function() {
						if (self.element.is(':focus')) {
							var pos = self._getCaretPosition();
							if (pos.start === 0 && pos.end === self.element[0].value.length) {
								self.val(value ? value : '');
								$(self.element[0]).trigger('select');
							} else if (pos.start === pos.end) {
								self.val(value ? value : '');
								self._setCaretPosition(pos);
							}
						}
					}, 0);
				}
			});
			this.element.on('blur.grsnumber', function() {
				if (!self.options.readonly && !self.options.disabled) {
					var value = self._formatNumber(self.val(), self.options);
					self.val(value ? value : '');
				}
			});
			this.element.on('keypress.grsnumber', function($event) {
				var input = $event.charCode ? String.fromCharCode($event.charCode) : String.fromCharCode($event.which);
				if (!input) {
					return;
				}
				if (input.match(/[A-z]/ig)) {
					if ($event.ctrlKey) {
						return true;
					}
					$event.preventDefault();
				}
			});
		},

		/**
		 * 初期化処理を行います。
		 *
		 * @private
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		_init: function() {
			//this._extendOptions();
			this.val(this._parseNumber(this.val(), this.options));
			this.val(this._formatNumber(this.val(), this.options));
			$.geui.grstext.prototype._init.apply(this);
		},
		/**
		 * 破棄処理を行います。
		 *
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.off('focus.grsnumber');
			this.element.off('blur.grsnumber');
			this.element.off('keypress.grsnumber');
			this.val(this._parseNumber(this.val(), this.options));
			$.geui.grstext.prototype.destroy.apply(this);
		},
		/**
		 * 数値の文字列をフォーマットします。
		 *
		 * @private
		 * @author kobayashi 2011/07/04
		 * @since 3.9.0
		 */
		_formatNumber: function(numberString, options) {
			if (!numberString) {
				return null;
			}
			if (!numberString.match(/^[-]?[0-9]+([\.0-9]+)?$/ig)) {
				return numberString;
			}
			// 0トリム実行し数値文字列比較が実行できるようにする
			var checkString = numberString.match(/\./i) ? numberString.replace(/^[ 　0]*/ig, '').replace(/[ 　0]*$/ig, '') : numberString.replace(/^[ 　]*/ig, '').replace(/[ 　]*$/ig, '');
			checkString = numberString.match(/^-/i) ? checkString.replace(/^[-]?0+/ig, '-') : checkString.replace(/^[-]?0+/ig, '');
			checkString = checkString.replace(/^\./i, '0.');
			checkString = checkString.replace(/\.$/i, '');
			var number = Number(checkString);
			if (isNaN(number) || checkString !== number.toString() || number >= Number.MAX_VALUE && number <= Number.MIN_VALUE) {
				return numberString;
			}

			var returnString = '';
			if (numberString.indexOf('.') === -1) {
				numberString += '.';
			}
			var digit = numberString.lastIndexOf('.');
			if (options.format.indexOf('.') > -1) {
				var decimalPortion = options.dec;
				var decimalFormat = options.format.substring(options.format.lastIndexOf('.') + 1);

				// round or truncate number as needed
				numberString = options.round ? number.toFixed(decimalFormat.length) : numberString.substring(0, digit + decimalFormat.length + 1);

				for (var i = 0, ilength = digit + decimalFormat.length + 1; i < ilength; i++) {
					if (!numberString.charAt(i)) numberString += '0';
				}
				var decimalString = numberString.substring(numberString.lastIndexOf('.') + 1);

				for (var j = 0, jlength = decimalFormat.length; j < jlength; j++) {
					if (decimalFormat.charAt(j) === '#' && decimalString.charAt(j) !== '0') {
						decimalPortion += decimalString.charAt(j);
						continue;
					} else if (decimalFormat.charAt(j) === '#' && decimalString.charAt(j) === '0') {
						var notParsed = decimalString.substring(j);
						if (notParsed.match('[1-9]')) {
							decimalPortion += decimalString.charAt(j);
							continue;
						} else
							break;
					} else if (decimalFormat.charAt(j) === '0')
						decimalPortion += decimalString.charAt(j);
				}
				returnString += decimalPortion;
				if (!decimalFormat.match(/[^#]/i) && returnString.match(/\.$/i)) {
					returnString = returnString.replace(/\.$/i, '');
				}
			} else {
				if (options.round === true) {
					number = Math.round(number);
				}
			}

			var ones = Math.floor(number);
			if (number < 0)
				ones = Math.ceil(number);

			var onesFormat = '';
			if (options.format.indexOf('.') === -1)
				onesFormat = options.format;
			else
				onesFormat = options.format.substring(0, options.format.indexOf('.'));

			var onePortion = '';
			if (!(ones === 0 && onesFormat.substr(onesFormat.length - 1, 1) === '#')) {
				// find how many digits are in the group
				var oneText = String(Math.abs(ones));
				var groupLength = 9999;
				if (onesFormat.lastIndexOf(',') !== -1)
					groupLength = onesFormat.length - onesFormat.lastIndexOf(',') - 1;
				var groupCount = 0;
				for (var k = oneText.length - 1; k > -1; k--) {
					onePortion = oneText.charAt(k) + onePortion;
					groupCount++;
					if (groupCount === groupLength && k !== 0) {
						onePortion = options.group + onePortion;
						groupCount = 0;
					}
				}
			}

			returnString = onePortion + returnString;

			if (number < 0)
				returnString = options.neg + returnString;
			return returnString;

		},
		/**
		 * フォーマットされた数値の文字列を変換します。
		 *
		 * @private
		 * @author kobayashi 2011/07/04
		 * @since 3.9.0
		 */
		_parseNumber: function(numberString, options) {
			if (!numberString) {
				return null;
			}
			var valid = '1234567890.-,' + options.dec + options.group + options.neg;
			if (numberString.match(new RegExp(valid, 'ig'))) {
				return numberString;
			}
			var returnString = numberString.replace(new RegExp(options.group, 'ig'), '');
			returnString = returnString.replace(options.dec, '.').replace(options.neg, '-');
			returnString = returnString.match(/\./i) ? returnString.replace(/^[ 　0]*/ig, '').replace(/[ 　0]*$/ig, '') : returnString.replace(/^[ 　]*/ig, '').replace(/[ 　]*$/ig, '');
			returnString = returnString.replace(/^\./i, '0.');
			returnString = returnString.replace(/\.$/i, '');
			return returnString;
		},
		/**
		 * このwidgetの設定値を取得又は返します。
		 * widget固有の値を新たに定義する場合はこのメソッドをオーバーライドしてください。
		 *
		 * @param value 設定値
		 * @return 設定値
		 * @author kobayashi 2011/07/18
		 * @since 3.9.0
		 */
		number: function() {
			if (!arguments || arguments.length <= 0) {
				return Number($.geui.gfieldwidgetbase.prototype.val.apply(this, arguments));
			}
			$.geui.gfieldwidgetbase.prototype.val.apply(this, arguments);
		},
		_setOptions: function(options) {
			var self = this;
			var opts = options;
			if (options && options.locale !== self.options.locale) {
				var regional = $.geui.grsnumber.regional[options.locale];
				opts = $.extend({}, regional, options);
			}
			$.each(opts, function(key, opt) {
				self._setOption(key, opt);
			});
			return self;
		},
		/**
		 * キャレット位置を取得します。
		 *
		 * @author kikuchi 2015/08/21
		 * @since 3.16.0
		 */
		_getCaretPosition: function() {
			var element = this.element[0];
			var position = {
				start: 0,
				end: 0
			};
			if (element.setSelectionRange) {
				position = {
					start: element.selectionStart,
					end: element.selectionEnd
				};
			} else if (document.selection) { // IE8
				var range = document.selection.createRange();
				var length = range.text.length;
				var textRange = element.createTextRange();
				var allLength = textRange.text.length;
				textRange.setEndPoint('StartToStart', range);
				var startPosition = allLength - textRange.text.length;
				var endPosition = startPosition + length;

				position = {
					start: startPosition,
					end: endPosition
				};
			}
			return position;
		},
		/**
		 * キャレット位置を設定します。
		 *
		 * @author kikuchi 2015/08/21
		 * @since 3.16.0
		 */
		_setCaretPosition: function(position) {
			var element = this.element[0];
			if (element.setSelectionRange) {
				element.selectionEnd = position.end;
				element.selectionStart = position.start;
			} else if (document.selection) { // IE8
				var range = element.createTextRange();
				range.collapse();
				range.moveEnd('character', position.end);
				range.moveStart('character', position.start);
				range.trigger('select');
			}
		}
	});
	$.extend($.geui.grsnumber, {
		defaults: { // Global defaults
			format: '#,##0.00',
			locale: 'en',
			round: true,
			dec: '.',
			group: ',',
			neg: '-'
		},
		regional: { // Localisations
			'': { // English
				format: '#,##0.00',
				locale: 'en',
				round: true,
				dec: '.',
				group: ',',
				neg: '-'
			}
		}
	});
	$.extend($.geui.grsnumber.defaults, $.geui.grsnumber.regional['']);
})(jQuery);
