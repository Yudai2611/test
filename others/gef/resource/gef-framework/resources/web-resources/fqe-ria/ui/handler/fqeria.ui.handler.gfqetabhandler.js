/** Copyright 2023 Kyocera Communication Systems Co., Ltd All rights reserved. */

/**
 * {GFQETabTag}専用のハンドラを定義します。
 *
 * @author oka 2023/10/25
 * @since 23.10.0
 */
(function($, undefined) {
	$.gfqetabhandler = {};
	$.contextId = null;
	$.extend($.gfqetabhandler, {
		getSelector: function(tabsId) {
			$.contextId = tabsId;
			return this;
		},
		/**
		 * tabの初期化処理をします.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		init: function(tabsId) {
			var $tabs = $.ge.idSelector(tabsId).tabs();
			$tabs.tabs({
				activate: function() {
					var $tabIndex = $tabs.tabs('option', 'active');
					var $tabSelectedHdn = $.ge.idSelector(tabsId + '.selected');
					$tabSelectedHdn.val($tabIndex);
				}
			});
			$('#' + $.ge.escSelectorString(tabsId) + ' div[class="hidden"]').each(function() {
				$(this).appendTo('#escape');
				$(this).attr('class', '');
			});
			var $tabSelected = $.ge.idSelector(tabsId + '.selected').val();
			$tabs.tabs('option', 'active', $tabSelected);
		},
		/**
		 * tabの展開数を設定します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		setDisplaySize: function(size) {
			var $dispsize = $.ge.idSelector($.contextId + '.displaysize');
			$.geui.attr($dispsize, 'value', size);
		},
		/**
		 * tabを追加します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		add: function() {
			var tabsId = $.contextId;
			var $tabElm = $.gfqetabhandler.getSelector(tabsId).getElement();

			var $escapeElm = $('#escape div:first');
			if ($escapeElm.length === 0) {
				return;
			}
			var $addTabId = $escapeElm.attr('id').substring('escape_'.length);
			var $tabElmTemp = $.gfqetabhandler.getSelector(tabsId).getElement().clone();

			var $tabs = $.ge.idSelector(tabsId);

			var decorateTab = function(addTabId, $destTab) {
				var $displayNum = Number($.gfqetabhandler.getSelector(tabsId).getElement()[0].innerText.match(/\d+/)) + 1;

				$.geui.attr($('input[id="' + tabsId + '.index-' + addTabId.substring('tab-'.length) + '"]'), 'value', $displayNum);
				$.geui.attr($destTab, 'aria-controls', addTabId);
				$.geui.attr($destTab, 'aria-labelledby', 'ui-id-' + addTabId.substring('tab-'.length));
				$.geui.attr($destTab.find('a'), 'href', '#' + addTabId);
				$.geui.attr($destTab.find('a'), 'id', 'ui-id-' + addTabId.substring('tab-'.length));
				$destTab.find('a span').html('条件' + $displayNum);

				return $destTab;
			};

			$tabElm = decorateTab($addTabId, $tabElmTemp, tabsId);
			$('#' + $.ge.escSelectorString(tabsId) + ' ul').append($tabElm);
			var $tabPanel = $escapeElm.clone();
			$.geui.attr($tabPanel, 'id', $addTabId);
			$('#' + $.ge.escSelectorString(tabsId)).append($tabPanel);
			$escapeElm.remove();
			$tabs.tabs('refresh');
			var size = $.gfqetabhandler.getSelector(tabsId).length();
			var tabsIndex = size - 1;

			$.gfqetabhandler.getSelector(tabsId).setDisplaySize(size);
			$tabs.tabs('option', 'active', tabsIndex);
		},
		/**
		 * tabを削除します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		remove: function() {
			var tabsId = $.contextId;
			var $tabs = $.ge.idSelector(tabsId);
			var $removeTabIndex = $tabs.tabs('option', 'active');
			var getDivTab = function(tabsId, index) {
				return $('#' + $.ge.escSelectorString(tabsId) + ' div[id^="tab-"]:eq(' + index + ')');
			};
			var getTabPanelDivElm = function(tabsId, index) {
				if (typeof index === 'undefined') {
					return $('#' + $.ge.escSelectorString(tabsId) + ' div[role="tabpanel"]:last');
				} else {
					return $('#' + $.ge.escSelectorString(tabsId) + ' div[role="tabpanel"]:eq(' + index + ')');
				}
			};
			var $removeTab = getDivTab(tabsId, $removeTabIndex);
			var $removeTabID = $.gfqetabhandler.getSelector(tabsId).length() - 1;
			$removeTab.find('table tbody tr').not('.temprow').remove();
			var tabsLength = $.gfqetabhandler.getSelector(tabsId).length();
			if (tabsLength > 1) {
				var $escapeElm = $('<div id="escape_tab-' + (tabsLength - 1) + '"></div>').prependTo('#escape');
				$escapeElm.append($removeTab.children());
				$.gfqetabhandler.getSelector(tabsId).refresh($escapeElm, $removeTabID);
				$.gfqetabhandler.getSelector(tabsId).getElement($removeTabIndex).remove();
				getTabPanelDivElm(tabsId, $removeTabIndex).remove();
				var tabRename = function(tabsId, tablengthBefore) {
					var elmRename = function(tabsId, index) {
						var $tabElm = $.gfqetabhandler.getSelector(tabsId).getElement(index);
						$.geui.attr($tabElm, 'aria-controls', 'tab-' + index);
						$.geui.attr($tabElm, 'aria-labelledby', 'ui-id-' + index);
						$.geui.attr($tabElm.find('a'), 'href', '#tab-' + index);
						$.geui.attr($tabElm.find('a'), 'id', 'ui-id-' + index);

						var $tabPnanelElm = getTabPanelDivElm(tabsId, index);
						$.geui.attr($tabPnanelElm, 'id', 'tab-' + index);
						$.geui.attr($tabPnanelElm, 'aria-labelledby', 'ui-id-' + index);
					};
					var tabsLength = tablengthBefore - 1;
					$.gfqetabhandler.getSelector(tabsId).setDisplaySize(tabsLength);
					for (var i = 0; i < tabsLength; i++) {
						$.gfqetabhandler.getSelector(tabsId).refresh(getDivTab(tabsId, i), i);
						elmRename(tabsId, i);
					}
				};
				tabRename(tabsId, tabsLength);

				$tabs.tabs('refresh');
				$tabs.tabs('option', 'active', $removeTabIndex);
			}
		},
		/**
		 * tabを構成するdiv要素を取得します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		getTabAtIndex: function(index) {
			return $('#' + $.ge.escSelectorString($.contextId) + ' div[id^="tab-"]:eq(' + index + ')');
		},
		/**
		 * tabのid、name、class属性値を再設定します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		refresh: function refreshTab($tab, tabIndex) {
			if (typeof tabIndex === 'number') {
				var renameTabAttr = function($element, attr, index) {
					var value = $element.attr(attr);
					if (value !== undefined) {
						value = value.replace(/\d+/, index);
						$element.attr(attr, value);

					}
				};
				$tab.find('div,table,span,input,select,textarea').each(function() {
					renameTabAttr($(this), 'id', tabIndex);
					renameTabAttr($(this), 'name', tabIndex);
					renameTabAttr($(this), 'class', tabIndex);
				});
			}

		},

		/**
		 * tab要素を取得します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		getElement: function(index) {
			var tabsId = $.contextId;
			if (typeof index === 'undefined') {
				return $('#' + $.ge.escSelectorString(tabsId) + ' ul>li:last');
			} else {
				return $('#' + $.ge.escSelectorString(tabsId) + ' ul>li:eq(' + index + ')');
			}
		},

		/**
		 * tabのインデックスを振り直します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		renameTagLabel: function(tabIndex) {
			var tabsId = $.contextId;
			var tabLabel = $.ge.idSelector('tablabel').html();
			$('#' + $.ge.escSelectorString(tabsId) + ' ul li:eq(' + tabIndex + ') a span').text(tabLabel + (tabIndex + 1));
		},
		/**
		 * tab数を取得します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		length: function() {
			return $('#' + $.ge.escSelectorString($.contextId) + ' ul li').length;
		}
	});
})(jQuery);
