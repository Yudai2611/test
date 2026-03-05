// Copyright 2013-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * Dateウィジェットを定義します。
 * （以下、本ウィジェットを「Dateウィジェット」と呼ぶ）
 *
 * アーキテクチャの概要
 * ・Dateウィジェットは、$.datepickerと$.geui.grstextを継承している。
 * ・Dateウィジェットのコンストラクタは、$.geui.grdateである。
 * ・差分のメソッドは、$.datepickerを拡張することで追加している。※1
 * ・$.geui.grdate.prototypeにも、差分のメソッドを一部追加している。※2
 * ・$.fn.grdateは、メソッド実行のインターフェースである。※3（$.fn.datepickerに習って実装）
 *
 * ※1.
 * $.datepickerは、全カレンダーで共有するインスタンスであり、"共通状態"を"クロージャ"として保持している。
 * そのため複製できず、機能追加するためには、$.datepickerそのものを拡張せざるをえない。
 * ※2.
 * Dateウィジェットのベースクラス($.geui.grstext)のメソッドや、$.geuiが持つユーティリティ的なメソッドは、インスタンスから直接メソッドを呼び出す。※3
 * そのため、インスタンス側にもメソッド実行のためのインターフェースが必要となる。
 * ※3.
 * 通常のメソッド実行：$element.grdate('method') ⇒ $.fn.grdate('method')が実行される。
 * インスタンスから直接メソッド実行：$element.data('geui-grdate').method() ⇒ $.geui.grdateのprototypeに定義したメソッドが実行される。
 *
 *
 * その他詳細について
 * ・$.geui.grstextを継承する際、インスタンスをnewしている理由
 * ベースクラスをインスタンス化して継承しないとプロトタイプチェーンが作れないため。
 * ベースのオプションを変更しないために、クローンで置き換えている。（base.optionsは、ベースクラスのoptionsを"参照"しているため）
 *
 * ・bindings / hoverable / focasableについて
 * ウィジェットが標準で保持する変数。それぞれ「イベントがバインドされている要素の集合」「mouseoverしたらスタイルクラスが切り替わる要素の集合」「focusしたらスタイルクラスが切り替わる要素の集合」を示す
 * ウィジェット標準のdestroyメソッド内で破棄される。undefindeではエラーがでるため、Dateウィジェットでも定義している。
 *
 *
 * @author kikuchi 2013/06/13
 * @since 3.12.0
 */
(function($, undefined) {
	var baseClass = 'ui-widget ui-widget-content ui-corner-all geui-grdate',
		disabledClass = 'ui-state-disabled geui-grdate-disabled',
		readonlyClass = 'geui-grdate-readonly',
		labelClass = 'geui-grdate-label';

	var PROP_NAME = 'geui-grdate';
	var uuid = 0;
	var widgetName = 'grdate';
	var calledByConstructor = false;

	$.geui.grdate = function(options, element) {
		try {
			var $element = $(element);
			this.element = $element;
			this.widgetName = widgetName;
			this.uuid = uuid++;
			this.eventNamespace = '.' + this.widgetName + this.uuid;
			var self = this;

			var locale = options.locale || this.options.locale || $.ge.locale;
			var regional = $.datepicker.regional[locale];
			this.options = $.extend({}, regional, this.options, options);

			$element.addClass(baseClass);
			this._hidden = $.ge.idSelector($element.attr('id') + '_hdn');
			if (this._hidden[0] === undefined) {
				this._creationName = this.element.attr('name') || this.element.attr('id');
				this.element.removeAttr('name');
				this._appendHidden();
			} else {
				this._creationName = this._hidden.attr('name') || this.element.attr('id');
			}
			$element.on('change.grdate', function($event) {
				/*jshint unused:false*/
				self.val(self.val());
			});
			if (this.options.disabled) {
				this._hidden.removeAttr('name');
			}
			calledByConstructor = true;
			$element.grdate(this.options);
			$.extend(this, getInstance(element));

			this._creationValue = $element.val();
			// $.datepickerのrefreshは不要（インスタンス生成時に同時に行われるため）
			$.geui.grstext.prototype.refresh.call(this);
			this.val(this.val());
		} finally {
			calledByConstructor = false;
		}
	};
	// プロトタイプチェーンのため、ベースクラスをインスタンス化（最上部コメント参照）
	var base = new $.geui.grstext();
	base.options = $.extend({}, base.options);
	$.geui.grdate.prototype = $.widget.extend(base, {
		_baseClass: baseClass,
		_disabledClass: disabledClass,
		_readonlyClass: readonlyClass,
		_labelClass: labelClass,

		bindings: $(), //$.Widget.destroyでのエラー回避（最上部コメント参照）
		hoverable: $(), //$.Widget.destroyでのエラー回避（最上部コメント参照）
		focusable: $(), //$.Widget.destroyでのエラー回避（最上部コメント参照）
		options: {
			locale: null,
			showButtonPanel: true
		},
		_initDatepicker: function(target, options) {
			var inst = getInstance(target);
			var opt = options;
			if (options && options.locale !== inst.options.locale) {
				var locale = options.locale;
				var regional = $.datepicker.regional[locale];
				opt = $.extend({}, regional, options);
			}
			$.extend(inst.options, opt);
			$.datepicker._attachDatepicker(target, options);
			$.geui.grstext.prototype._init.call(inst);
		},
		_appendHidden: function() {
			if (this._hidden && this._hidden[0]) return;
			this._hidden = $('<input>')
				.attr('id', this.element.attr('id') + '_hdn')
				.attr('type', 'hidden')
				.val(this.element.val())
				.attr($.ge.property.get('geui.XHtml.Ex.Attr.Clear'), 'false');
			if (!this.options.disabled && this._creationName) {
				this._hidden.attr('name', this._creationName);
			}
			this.element.after(this._hidden);
		},
		_removeHidden: function() {
			if (!this._hidden) return;
			this._hidden.remove();
			this._hidden = null;
		},
		val: function() {
			if (!arguments || arguments.length <= 0) {
				return $.datepicker._valDatepicker(this.element[0]);
			}
			$.datepicker._valDatepicker(this.element[0], arguments[0], arguments[1]);
		},
		clear: function() {
			$.datepicker._clearDatepicker(this.element[0]);
		},
		reset: function() {
			$.datepicker._resetDatepicker(this.element[0]);
		},
		refresh: function() {
			$.datepicker._refreshDatepicker(this.element[0]);
		},
		destroy: function() {
			$.datepicker._destroyDatepicker(this.element[0]);
		},
		_setOption: function(key, value) {
			this.options[key] = value;
			this.settings[key] = value;
			if (key === 'disabled') {
				this.element
					.toggleClass(this.widgetFullName + '-disabled ui-state-disabled', !! value)
					.attr('aria-disabled', value);
			}
			return this;
		}
	});
	$.extend($.datepicker, {
		//#### CUSTOMIZE [2013/07/23][kikuchi] IEにおいて、閉じるボタン押下すると、カレンダーが閉じた後に再びポップアップする問題を解消 [start] ####
		_cancelShow: false,
		_hideDatepicker: function(input) {
			if ($.datepicker._curInst && $.datepicker._curInst.settings.showOn !== 'button') { //'button':showOnの許可値(focus/button/both)に対応
				if ($.datepicker._datepickerShowing) {
					$.datepicker._cancelShow = true;
				}
			}
			$.datepicker.__proto__._hideDatepicker.call($.datepicker, input);
		},
		_showDatepicker: function(input) {
			if ($.datepicker._cancelShow) {
				$.datepicker._cancelShow = false;
				return;
			}
			$.datepicker.__proto__._showDatepicker.call($.datepicker, input);
		},
		//#### CUSTOMIZE [2013/07/23][kikuchi] IEにおいて、閉じるボタン押下すると、カレンダーが閉じた後に再びポップアップする問題を解消 [end] ####
		_attachDatepicker: function(target, settings) {
			var nodeName, inline, inst;
			nodeName = target.nodeName.toLowerCase();
			inline = (nodeName === 'div' || nodeName === 'span');
			if (!target.id) {
				this.uuid += 1;
				target.id = 'dp' + this.uuid;
			}
			inst = this._newInst($(target), inline);
			inst.settings = $.extend({}, settings || {});
			inst.options = inst.settings;
			inst.element = inst.input;
			if (nodeName === 'input') {
				this._connectDatepicker(target, inst);
			} else if (inline) {
				this._inlineDatepicker(target, inst);
			}
		},
		_valDatepicker: function(target, value) {
			/*jshint unused:false*/
			var inst = getInstance(target);
			if (!arguments || arguments.length <= 1) {
				return inst.input.val();
			}
			inst.input.val(arguments[1]);
			inst._label && inst._label.text(arguments[1]);
			inst._hidden && inst._hidden.val(this._valDatepicker(target));
		},
		_clearDatepicker: function(target) {
			var inst = getInstance(target);
			if (!inst.options.clear) return;
			$.datepicker._valDatepicker(target, '');
		},
		_resetDatepicker: function(target) {
			var inst = getInstance(target);
			$.datepicker._valDatepicker(target, inst._creationValue);
		},
		_enableDatepicker: function(target) {
			var inst = getInstance(target);
			if (!inst.options.readonly) {
				$.datepicker.__proto__._enableDatepicker.call($.datepicker, target);
			}
			$.geui.grstext.prototype._setDisabled.call(inst, false);
		},
		_disableDatepicker: function(target) {
			var inst = getInstance(target);
			$.datepicker.__proto__._disableDatepicker.call($.datepicker, target);
			$.geui.grstext.prototype._setDisabled.call(inst, true);
		},
		_readonlyDatepicker: function(target) {
			var inst = getInstance(target);
			$.datepicker.__proto__._disableDatepicker.call($.datepicker, target);
			if (!inst.options.disabled) {
				target.disabled = false;
				inst.input.prop('readonly', true);
			}
			$.geui.grstext.prototype._setReadonly.call(inst, true);
		},
		_readwriteDatepicker: function(target) {
			var inst = getInstance(target);
			if (!inst.options.disabled) {
				$.datepicker.__proto__._enableDatepicker.call($.datepicker, target);
			}
			inst.input.prop('readonly', false);
			$.geui.grstext.prototype._setReadonly.call(inst, false);
		},
		_refreshDatepicker: function(target) {
			var inst = getInstance(target);
			$.datepicker.__proto__._refreshDatepicker.call($.datepicker, target);

			$.geui.grstext.prototype.refresh.apply(inst, arguments);

			if (inst.settings.disabled) {
				$.geui.grstext.prototype.disable.apply(inst, arguments);
				$.datepicker._disableDatepicker(target);
				inst._hidden && inst._hidden.removeAttr('name');
				return;
			}
			if (inst.settings.readonly) {
				$.datepicker._enableDatepicker(target);
				$.datepicker._readonlyDatepicker(target);
			} else {
				$.datepicker._enableDatepicker(target);
				$.datepicker._readwriteDatepicker(target);
			}
			inst._hidden && inst._hidden.attr('name', inst._creationName);
		},
		_destroyDatepicker: function(target) {
			var inst = getInstance(target);
			$.datepicker.__proto__._destroyDatepicker.call($.datepicker, target);
			inst.input.off('change.grdate');
			$.geui.grstext.prototype.destroy.apply(inst);
			inst._removeHidden();
		},
		_optionDatepicker: function(target, name, value) {
			var inst = getInstance(target);

			if (arguments.length === 2 && typeof name === 'string') {
				return $.geui.grstext.prototype.option.call(inst, name);
			}
			$.datepicker.__proto__._optionDatepicker.apply($.datepicker, arguments);
			$.geui.grstext.prototype.option.apply(inst, [name, value]);

			var settings = name || {};
			if (typeof name === 'string') {
				settings = {};
				settings[name] = value;
			}
			if ('readonly' in settings) {
				if (settings.readonly) {
					this._readonlyDatepicker(target);
				} else {
					this._readwriteDatepicker(target);
				}
			}
			this._valDatepicker(target, this._valDatepicker(target));
		},
		_connectDatepicker: function(target, inst) {
			$.datepicker.__proto__._connectDatepicker.apply($.datepicker, arguments);
			if (inst.settings.readonly) {
				$.datepicker._readonlyDatepicker(target);
			}
		},
		_inlineDatepicker: function(target, inst) {
			$.datepicker.__proto__._inlineDatepicker.apply($.datepicker, arguments);
			if (inst.settings.readonly) {
				$.datepicker._readonlyDatepicker(target);
			}
		}
	});

	function getInstance(target) {
		return $.data(target, PROP_NAME);
	}
	$.fn.grdate = function(options) {

		/* Verify an empty collection wasn't passed - Fixes #6976 */
		if (!this.length) {
			return this;
		}

		/* Initialise the date picker. */
		if (!$.datepicker.initialized) {
			$(document).on('mousedown', $.datepicker._checkExternalClick);
			$.datepicker.initialized = true;
		}

		/* Append datepicker main container to body if not exist. */
		if ($.ge.idSelector($.datepicker._mainDivId).length === 0) {
			$('body').append($.datepicker.dpDiv);
		}

		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options === 'string' && (options === 'isDisabled' || options === 'getDate' || options === 'widget' || options === 'val')) {
			return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
		}
		if (options === 'option' && arguments.length === 2 && typeof arguments[1] === 'string') {
			return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
		}
		if (typeof options === 'string') {
			return this.each(function() {
				$.datepicker['_' + options + 'Datepicker'].
				apply($.datepicker, [this].concat(otherArgs));
			});
		}
		//MethodCallでない場合
		if (calledByConstructor) { //$.geui.createWidgetからウィジェット化された場合
			return this.each(function() {
				$.datepicker._attachDatepicker(this, options);
			});
		} else { //直接ウィジェット化された場合
			return this.each(function() {
				var instance = getInstance(this);
				if (instance) {
					$.geui.grdate.prototype._initDatepicker(this, options); //initのケース
				} else {
					$.data(this, PROP_NAME, new $.geui.grdate($.extend({}, options), this)); //createのケース
				}
			});
		}
	};
})(jQuery);
