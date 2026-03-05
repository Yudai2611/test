// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 *
 * @author Y.Hamanaka 2011/05/07
 * @since 3.9.0
 */
(function($, undefined) {
	/**
	 * geui.grenterkeyfocus ウィジェットクラス
	 *
	 * エンターキーフォーカス制御用のウィジェット です。
	 *
	 * @author T.Aono 2011/6/20
	 * @since 3.9.0
	 */
	$.widget('geui.grenterkeyfocus', {
		/**
		 * オプション
		 *
		 * @author Y.Hamanaka 2011/06/20
		 * @since 3.9.0
		 */
		options: {
			auto: true
		},
		/**
		 * 初期化処理を実行します。
		 *
		 * @private
		 * @author Y.Hamanaka 2011/06/20
		 * @since 3.9.0
		 */
		_init: function() {
			var $element = this.element;
			// 登録
			var thisWidget = this;
			$element.on('keydown.grenterkeyfocus', function($event) {
				// Enterキー以外は何もしない
				if ($event.keyCode !== $.ui.keyCode.ENTER) {
					return true;
				}
				// altキーやctrlキー押下時は改行文字を入力
				if ($event.altKey || $event.ctrlKey) {
					thisWidget._insertNewLine($event);
					return false;
				}

				// 現在フォーカスのあるエレメントを取得
				var $focusElem = $(document.activeElement);
				// バブリングしないようにする
				if ($focusElem && $focusElem.is('a,:button,:submit,:image,:reset')) {
					// anchor等はEnterキー本来の動作をキャンセルしない
					$event.stopPropagation();
					return true;
				}
				if ($event.shiftKey) {
					thisWidget._focusPrevTarget($focusElem);
				} else {
					thisWidget._focusNextTarget($focusElem);
				}
				// Enterキー本来の動作をキャンセルするためにfalseを返す
				return false;
			});
		},
		/**
		 * 改行文字が入力可能なフィールドに対して、キャレット位置に改行文字を挿入します。
		 *
		 * @private
		 * @param {object} $event jqueryイベントオブジェクト
		 * @author Y.Hamanaka 2011/07/05
		 * @since 3.9.0
		 */
		_insertNewLine: function($event) {
			var $eventElem = $($event.target);
			if ($eventElem.is('textarea') && !$eventElem.prop('readonly')) {
				if (document.selection && document.selection.createRange) {
					var r = document.selection.createRange();
					r.text = '\n';
					r.trigger('select');
				} else {
					var s = $eventElem.val();
					var ps = $eventElem[0].selectionStart;
					var pe = $eventElem[0].selectionEnd;
					$eventElem.val(s.substr(0, ps) + '\n' + s.substr(pe));
					$eventElem[0].setSelectionRange(ps + 1, ps + 1);
				}
				// フィールドの値を変更しているのでchangeイベントを発火させる
				var evt = $.Event('change');
				evt.target = $eventElem;
				$eventElem.trigger(evt);
			}
		},
		/**
		 * 指定された要素の次要素にフォーカス(キャレット)を移動します。
		 * 次要素が無い場合、指定された要素内にある最初の要素にフォーカス(キャレット)を移動します。
		 *
		 * @private
		 * @author Y.Hamanaka 2011/05/09
		 * @since 3.9.0
		 */
		_focusNextTarget: function($elem) {
			var list = this._findFocusableElements(this.element);
			var elemId = $elem.attr('id');
			var n = list.length;
			var found = false;
			for (var i = 0; i < n; i++) {
				if (found) {
					return $(list[i]).trigger('focus').trigger('select');
				}
				if ($(list[i]).attr('id') === elemId) {
					found = true;
				}
			}
			if (n > 0) {
				return $(list[0]).trigger('focus').trigger('select');
			}
		},
		/**
		 * 指定された要素の前要素にフォーカス(キャレット)を移動します。
		 * 前要素が無い場合、指定された要素内にある最後の要素にフォーカス(キャレット)を移動します。
		 *
		 * @private
		 * @author Y.Hamanaka 2011/05/09
		 * @since 3.9.0
		 */
		_focusPrevTarget: function($elem) {
			var list = this._findFocusableElements(this.element);
			var elemId = $elem.attr('id');
			var n = list.length;
			var found = false;
			for (var i = n - 1; i >= 0; i--) {
				if (found) {
					return $(list[i]).trigger('focus').trigger('select');
				}
				if ($(list[i]).attr('id') === elemId) {
					found = true;
				}
			}
			if (n > 0) {
				return $(list[n - 1]).trigger('focus').trigger('select');
			}
		},
		/**
		 * 指定された要素内にある、フォーカス(キャレット)移動可能な要素一覧を取得し返します。
		 * 取得した要素一覧はoptions.autoの値によって並び替えられます。
		 *
		 * @private
		 * @author Y.Hamanaka 2011/05/09
		 * @since 3.9.0
		 */
		_findFocusableElements: function($elem) {
			var elements = $elem.find('a:visible,:input:enabled:visible');
			if (this.options.auto) {
				return elements;
			}
			var filtered = this._filterUnfocusable(elements);
			filtered.sort(
				/**
				 * 取得した一覧を並び替えるためのcomparatorです。
				 * IE8/Chromeは安定ソートではないため、元々のDOMツリー順序で順位付けが必要
				 * 且つIE8では、JSからのtabindexセットで不正な値をセットすると1となる
				 *
				 * @private
				 * @author Y.Hamanaka 2011/05/09
				 * @since 3.9.0
				 */

				function(small, big) {
					var $small = $(small),
						$big = $(big);
					// small<bigなら負、small>bigなら正、small=bigなら０
					var smallTabIndex = $small.attr('tabindex');
					var bigTabIndex = $big.attr('tabindex');
					// 数値に変換出来ない値は、指定されていないものとする
					try {
						smallTabIndex = parseFloat(smallTabIndex);
						if (smallTabIndex > -1 && smallTabIndex < 1) {
							smallTabIndex = undefined;
						}
					} catch (e) {
						smallTabIndex = undefined;
					}
					try {
						bigTabIndex = parseFloat(bigTabIndex);
						if (bigTabIndex > -1 && bigTabIndex < 1) {
							bigTabIndex = undefined;
						}
					} catch (e) {
						bigTabIndex = undefined;
					}
					// tabindexが指定されていない場合は、指定されているもの"より大きい"とする
					if (!smallTabIndex && bigTabIndex) {
						return 1;
					}
					if (smallTabIndex && !bigTabIndex) {
						return -1;
					}
					if (!smallTabIndex && !bigTabIndex) {
						//DOM順に並べる
						var smallorigidx = parseInt($small.data('org-index'), null);
						var bigorigidx = parseInt($big.data('org-index'), null);

						return smallorigidx - bigorigidx;
					}

					return smallTabIndex - bigTabIndex;
				}
			);
			return filtered;
		},
		/**
		 * 指定された要素リスト内でフォーカス対象外の要素を取り除きます。
		 * @private
		 * @author kawakami 2013/07/09
		 * @since 3.12.0
		 */
		_filterUnfocusable: function($elements) {
			var elements = [];
			$.each($elements, function(i, elem) {
				var $elem = $(elem);
				var tabindex = $elem.attr('tabindex');
				if (tabindex && tabindex <= -1) {
					return true;
				}
				$elem.data('org-index', i);
				elements.push(elem);
			});
			return $(elements);
		},
		/**
		 * widget の破棄処理を実行します。
		 *
		 * @author Y.Hamanaka 2011/04/24
		 * @since 3.9.0
		 */
		destroy: function() {
			$.Widget.prototype.destroy.apply(this, arguments);
			this.element.off('keydown.grenterkeyfocus');
		}
	});
})(jQuery);
