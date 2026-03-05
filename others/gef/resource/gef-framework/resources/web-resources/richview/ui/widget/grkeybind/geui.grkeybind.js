// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エンターキー制御機能を定義します。
 * @author Y.Hamanaka 2011/04/07
 * @since 3.9.0
 */
(function($, undefined) {
	/*
	$.gekey.keycodes[8] = 'BS';
	$.gekey.keycodes[9] = 'Tab';
	$.gekey.keycodes[13] = 'Enter';
	$.gekey.keycodes[16] = 'Shift';
	$.gekey.keycodes[17] = 'Ctrl';
	$.gekey.keycodes[18] = 'Alt';
	$.gekey.keycodes[19] = 'Pause';
	$.gekey.keycodes[27] = 'Esc';
	$.gekey.keycodes[28] = '変換';
	$.gekey.keycodes[29] = '無変換';
	$.gekey.keycodes[32] = 'Space';
	$.gekey.keycodes[33] = 'PgUp';
	$.gekey.keycodes[34] = 'PgDn';
	$.gekey.keycodes[35] = 'End';
	$.gekey.keycodes[36] = 'Home';
	$.gekey.keycodes[37] = '←';
	$.gekey.keycodes[38] = '↑';
	$.gekey.keycodes[39] = '→';
	$.gekey.keycodes[40] = '↓';
	$.gekey.keycodes[45] = 'Ins';
	$.gekey.keycodes[46] = 'Del';
	$.gekey.keycodes[48] = '0';
	$.gekey.keycodes[49] = '1';
	$.gekey.keycodes[50] = '2';
	$.gekey.keycodes[51] = '3';
	$.gekey.keycodes[52] = '4';
	$.gekey.keycodes[53] = '5';
	$.gekey.keycodes[54] = '6';
	$.gekey.keycodes[55] = '7';
	$.gekey.keycodes[56] = '8';
	$.gekey.keycodes[57] = '9';
	$.gekey.keycodes[65] = 'A';
	$.gekey.keycodes[66] = 'B';
	$.gekey.keycodes[67] = 'C';
	$.gekey.keycodes[68] = 'D';
	$.gekey.keycodes[69] = 'E';
	$.gekey.keycodes[70] = 'F';
	$.gekey.keycodes[71] = 'G';
	$.gekey.keycodes[72] = 'H';
	$.gekey.keycodes[73] = 'I';
	$.gekey.keycodes[74] = 'J';
	$.gekey.keycodes[75] = 'K';
	$.gekey.keycodes[76] = 'L';
	$.gekey.keycodes[77] = 'M';
	$.gekey.keycodes[78] = 'N';
	$.gekey.keycodes[79] = 'O';
	$.gekey.keycodes[80] = 'P';
	$.gekey.keycodes[81] = 'Q';
	$.gekey.keycodes[82] = 'R';
	$.gekey.keycodes[83] = 'S';
	$.gekey.keycodes[84] = 'T';
	$.gekey.keycodes[85] = 'U';
	$.gekey.keycodes[86] = 'V';
	$.gekey.keycodes[87] = 'W';
	$.gekey.keycodes[88] = 'X';
	$.gekey.keycodes[89] = 'Y';
	$.gekey.keycodes[90] = 'Z';
	$.gekey.keycodes[91] = 'Win';
	$.gekey.keycodes[93] = 'Ctx';
	$.gekey.keycodes[96] = '0';//テンキー
	$.gekey.keycodes[97] = '1';//テンキー
	$.gekey.keycodes[98] = '2';//テンキー
	$.gekey.keycodes[99] = '3';//テンキー
	$.gekey.keycodes[100] = '4';//テンキー
	$.gekey.keycodes[101] = '5';//テンキー
	$.gekey.keycodes[102] = '6';//テンキー
	$.gekey.keycodes[103] = '7';//テンキー
	$.gekey.keycodes[104] = '8';//テンキー
	$.gekey.keycodes[105] = '9';//テンキー
	$.gekey.keycodes[106] = '*';//テンキー
	$.gekey.keycodes[107] = '+';//テンキー
	$.gekey.keycodes[109] = '-';//テンキー
	$.gekey.keycodes[110] = '.';//テンキー
	$.gekey.keycodes[111] = '/';//テンキー
	$.gekey.keycodes[112] = 'F1';
	$.gekey.keycodes[113] = 'F2';
	$.gekey.keycodes[114] = 'F3';
	$.gekey.keycodes[115] = 'F4';
	$.gekey.keycodes[116] = 'F5';
	$.gekey.keycodes[117] = 'F6';
	$.gekey.keycodes[118] = 'F7';
	$.gekey.keycodes[119] = 'F8';
	$.gekey.keycodes[120] = 'F9';
	$.gekey.keycodes[121] = 'F10';
	$.gekey.keycodes[122] = 'F11';
	$.gekey.keycodes[123] = 'F12';
	$.gekey.keycodes[144] = 'NumLock';
	$.gekey.keycodes[146] = 'ScrLock';
	$.gekey.keycodes[186] = '*';//本当は「:」
	$.gekey.keycodes[187] = ';';
	$.gekey.keycodes[188] = '<';//本当は「,」
	$.gekey.keycodes[189] = '-';
	$.gekey.keycodes[190] = '>';//本当は「.」
	$.gekey.keycodes[191] = '/';
	$.gekey.keycodes[192] = '@';
	$.gekey.keycodes[219] = '[';
	$.gekey.keycodes[220] = '\\';
	$.gekey.keycodes[221] = ']';
	$.gekey.keycodes[222] = '^';
	$.gekey.keycodes[226] = '\\';
	$.gekey.keycodes[240] = 'CapsLock';
	$.gekey.keycodes[242] = 'カナ';
	$.gekey.keycodes[244] = '半/全';
	*/
	/**
	 * geui.grkeybind Widgetクラス
	 *
	 * キーバインド表示制御用のWidget です。
	 *
	 * @author Y.Hamanaka 2011/04/07
	 * @since 3.9.0
	 */
	$.widget('geui.grkeybind', {
		/**
		 * ブラウザキーコードに任意の処理をバインドします。
		 * @param options
		 *  element            : 対象UIのID属性
		 *  event              : 対象イベントの名前
		 *  keycode {int}      : ブラウザのキーコードまたは特殊キーを示します。必ず指定する必要があります。
		 *  isAlt {boolean}    : ブラウザのALT修飾キーが押下されているかどうかを示します。true:押下されている（デフォルトfalse）
		 *  isCtrl {boolean}   : ブラウザのCTRL修飾キーが押下されているかどうかを示します。true:押下されている（デフォルトfalse）
		 *  isShift {boolean}  : ブラウザのSHIFT修飾キーが押下されているかどうかを示します。true:押下されている（デフォルトfalse）
		 *  func {function}    : JavaScript関数を示します。必ず指定する必要があります。
		 *  bubbling {boolean} : 上位(祖先)コンテナのキー制御を実行(バブリング)するかどうかを示します。true:実行する（デフォルトfalse）
		 *
		 * @author Y.Hamanaka 2011/04/07
		 * @since 3.9.0
		 */
		_init: function() {
			var keycode = this.options.keycode;
			var isCtrl = this.options.isCtrl;
			var isAlt = this.options.isAlt;
			var isShift = this.options.isShift;
			var func = this.options.func;
			var event = this.options.event;
			var element = this.options.element;
			var bubbling = this.options.bubbling;
			this.element.on('keydown.grkeybind', function($event) {
				/*jshint eqeqeq:false*/
				if (keycode != $event.keyCode) {
					return true;
				}
				if (!(isAlt && $event.altKey || !isAlt && !$event.altKey)) {
					return true;
				}
				if (!(isCtrl && $event.ctrlKey || !isCtrl && !$event.ctrlKey)) {
					return true;
				}
				if (!(isShift && $event.shiftKey || !isShift && !$event.shiftKey)) {
					return true;
				}
				if (event !== undefined && element !== undefined) {
					if (!$.geui.isDisabled(element)) {
						if (document.activeElement.id !== element || $.ui.keyCode.ENTER !== $event.keyCode || event !== 'click') {
							$.ge.idSelector(element).trigger(event); // Enterキー押下時のブラウザデフォルトイベント（click）実行の重複を排除
						}
					}
				} else if (func !== undefined) {
					(function() {
						/*jshint evil:true*/
						eval(func);
					})();
				}
				bubbling || $event.stopPropagation();
				return true;
			});
		},
		_setOptions: function(options) {
			this.options = {};
			return this._super(options);
		},
		/**
		 * widget の破棄処理を実行します。
		 *
		 * @author Y.Hamanaka 2011/04/19
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.off('keydown.grkeybind');
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);
