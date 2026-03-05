// Copyright 2012 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * ウィジェットの共通機能を定義します。
 *
 * @author T.Aono 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	$.widget('geui.gvariablewidgetbase', {
		/**
		 * ウィジェットのBaseスタイルクラスを表します。
		 *
		 * @private
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		_baseClass: '',
		/**
		 * ウィジェットのdisable状態のスタイルクラスを表します。
		 * @private
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		_disabledClass: '',
		/**
		 * ウィジェットのreadonly状態のスタイルクラスを表します。
		 * @private
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		_readonlyClass: '',
		/**
		 * Variable系ウィジェットかどうかを判断します。
		 */
		isVariable: true,
		/**
		 * ウィジェット生成時の初期値を表します。
		 * @private
		 */
		_creationValue: null,
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		options: {
			disabled: false,
			clear: true,
			readonly: false
		},
		/**
		 * ウィジェットの生成処理を行います。
		 *
		 * @private
		 * @author Y.Hamanaka 2011/06/20
		 * @since 3.9.0
		 */
		_create: function() {
			this.element.addClass(this._baseClass);
		},
		/**
		 * ウィジェットの初期化処理を行います。
		 *
		 * @private
		 * @author Y.Hamanaka 2011/06/20
		 * @since 3.9.0
		 */
		_init: function() {
			this._creationValue = this.val();
			this.refresh();
		},
		/**
		 * ウィジェットの値をクリアします。
		 *
		 * this.options.clear が true の場合のみ実施されます。
		 *
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		clear: function() {
			if (!this.options.clear) return;
			this.val('');
		},
		/**
		 * ウィジェットの値をリセットします。
		 *
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		reset: function() {
			this.val(this._creationValue);
		},
		/**
		 * ウィジェットの値を取得または設定します。
		 *
		 * @param value 設定値
		 * @return 設定値
		 * @author Y,Hamanaka 2011/07/09
		 * @since 3.9.0
		 */
		val: function() {
			if (!arguments || arguments.length <= 0) {
				return this.element.val();
			}
			this.element.val(arguments[0]);
		},
		/**
		 * ウィジェットのdisabledオプションを更新します。
		 *
		 * @private
		 * @param {boolean} disabled true:無効/false:有効
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		_setDisabled: function(disabled) {
			// $.Widget.disableの再起呼び出しによる無限ループを止めるため、
			// 設定済みの値と同じ値が渡されたときは処理を行わないようにする。
			if (this.options.disabled === disabled) {
				return;
			}
			this.options.disabled = !! disabled;
			this.refresh();
		},
		/**
		 * ウィジェットを有効化します。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		enable: function() {
			this._setDisabled(false);
		},
		/**
		 * ウィジェットを無効化します。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		disable: function() {
			this._setDisabled(true);
		},
		/**
		 * ウィジェットのreadonlyオプションを更新します。
		 *
		 * @private
		 * @param {boolean} readonly true:読取専用/false:読書き
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		_setReadonly: function(readonly) {
			// $.Widget.disableの再起呼び出しによる無限ループを止めるため、
			// 設定済みの値と同じ値が渡されたときは処理を行わないようにする。
			if (this.options.readonly === readonly) {
				return;
			}
			this.options.readonly = !! readonly;
			this.refresh();
		},
		/**
		 * ウィジェットを読取専用にします。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		readonly: function() {
			this._setReadonly(true);
		},
		/**
		 * ウィジェットを読書可能にします。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		readwrite: function() {
			this._setReadonly(false);
		},
		/**
		 * ウィジェットの状態をリフレッシュします。
		 *
		 * @author Y.Hamanaka 2011/06/14
		 * @since 3.9.0
		 */
		refresh: function() {
			this.element.attr($.ge.property.get('geui.XHtml.Ex.Attr.Clear'), !! this.options.clear);
			if (this.options.disabled) {
				this.element.addClass(this._disabledClass);
				this.element.removeClass(this._readonlyClass);
				this.element.prop('disabled', true);
				this.element.prop('readonly', false);
				$.Widget.prototype.disable.apply(this, arguments);
				return;
			}
			$.Widget.prototype.enable.apply(this, arguments);
			if (this.options.readonly) {
				this.element.removeClass(this._disabledClass);
				this.element.addClass(this._readonlyClass);
				this.element.prop('disabled', false);
				this.element.prop('readonly', true);
			} else {
				this.element.removeClass(this._disabledClass);
				this.element.removeClass(this._readonlyClass);
				this.element.prop('disabled', false);
				this.element.prop('readonly', false);
			}
		},
		/**
		 * ウィジェットの破棄処理を行います。
		 *
		 * @author Y.Hamanaka 2011/06/17
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.removeClass(this._baseClass);
			this.element.removeClass(this._disabledClass);
			this.element.removeClass(this._readonlyClass);
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);
/**
 *
 * @author T.Aono 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	/**
	 * フィールドタイプを保持
	 *
	 * @type {Object.<string>}
	 * @const
	 */
	var FIELD_TYPE = {
		field: 'field',
		label: 'label'
	};
	/**
	 * geui.gfieldwidgetbase クラス
	 *
	 * form の input 要素等のラベル表示、入力フィールド表示の切替処理のインターフェイス実装のWidget です。
	 * 本Widget を継承したWidgetクラスではWidget化対象のHTMLエレメントの種別に応じて処理をオーバライドしてください。
	 *
	 * @class フィールドウィジェットの基底クラス
	 * @extend {$.geui.gvariablewidgetbase}
	 * @author T.Aono 2011/03/11
	 * @since 3.9.0
	 */
	$.widget('geui.gfieldwidgetbase', $.geui.gvariablewidgetbase, {
		/**
		 * 子クラスは専用のlabelClassスタイルを設定しておく
		 * @private
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		_labelClass: '',
		/**
		 * widget設定
		 *   fieldType {string} フィールド種別を指定します。
		 */
		options: {
			fieldType: FIELD_TYPE.field
		},
		/**
		 * ラベル情報を設定するSPANエレメントを格納します。
		 * @private
		 */
		_label: null,

		/**
		 * 初期化処理を実行します。
		 *
		 * @private
		 * @author Y.Hamanaka 2011/05/10
		 * @since 3.9.0
		 */
		_create: function() {
			var thisObject = this;
			this.element.on('change.gfieldwidgetbase', function($event) {
				/*jshint unused:false*/
				thisObject.val(thisObject.val());
			});
			$.geui.gvariablewidgetbase.prototype._create.apply(this);
		},
		/**
		 * 表示種別を指定値で切替ます。
		 * 指定されたフィールド種別に設定を切替え、変更後のフィールド種別を返します.
		 *
		 * @private
		 * @param {string} fieldType フィールド種別
		 * @return フィールド種別
		 * @author Y.Hamanaka 2011/04/31
		 * @since 3.9.0
		 */
		_setFieldType: function() {
			if (arguments.length > 0) {
				if (FIELD_TYPE.field !== arguments[0] && FIELD_TYPE.label !== arguments[0]) {
					throw new Error('illegal parameter[' + arguments[0] + '].');
				}
				this.options.fieldType = arguments[0];
				this._trigger('changeFieldType', null, {
					fieldType: arguments[0]
				});
				this.refresh();
			}
			return this.options.fieldType;
		},
		/**
		 * このwidgetをラベル表示状態にします。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		changeLabel: function() {
			this._setFieldType(FIELD_TYPE.label);
		},
		/**
		 * このwidgetをフィールド表示状態にします。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		changeField: function() {
			this._setFieldType(FIELD_TYPE.field);
		},
		/**
		 * このwidgetを再表示します.<br>
		 * widgetの状態により表示内容を変更する場合は、このメソッドをオーバーライドしてください。
		 *
		 * @author Y.Hamanaka 2011/06/14
		 * @since 3.9.0
		 */
		refresh: function() {
			$.geui.gvariablewidgetbase.prototype.refresh.apply(this);
			if (this.options.fieldType === FIELD_TYPE.label) {
				if (!this._label) {
					this._label = $('<span/>').text(this.val() === null ? '' : this.val()).hide();
					this._label.addClass(this._labelClass);
					this.element.after(this._label);
					this.options.clear || $.geui.setClearFalse(this._label);
				}
				this.element.hide();
				this._label.show();
				this._label[0].style.display = 'inline';
			} else if (this.options.fieldType === FIELD_TYPE.field) {
				this.element.show();
				this.element[0].style.display = 'inline';
				if (this._label) {
					this._label.hide();
				}
			}
		},
		/**
		 * このwidgetの設定値を取得又は返します。
		 * widget固有の値を新たに定義する場合はこのメソッドをオーバーライドしてください。
		 *
		 * @param value 設定値
		 * @return 設定値
		 * @author Y,Hamanaka 2011/07/09
		 * @since 3.9.0
		 */
		val: function() {
			if (!arguments || arguments.length <= 0) {
				return $.geui.gvariablewidgetbase.prototype.val.apply(this, arguments);
			}
			if (this._label) {
				this._label.text(arguments[0]);
			}
			$.geui.gvariablewidgetbase.prototype.val.apply(this, arguments);
		},
		/**
		 * widget の破棄処理を実行します。
		 *
		 * @author Y.Hamanaka 2011/04/19
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.off('change.gfieldwidgetbase');
			this.element.show();
			if (this._label) {
				this._label.removeClass(this._labelClass);
				this._label.remove();
			}
			this._label = null;
			$.geui.gvariablewidgetbase.prototype.destroy.apply(this);
		}
	});
	$.geui.gfieldwidgetbase.prototype.FIELD_TYPE = FIELD_TYPE;
})(jQuery);
