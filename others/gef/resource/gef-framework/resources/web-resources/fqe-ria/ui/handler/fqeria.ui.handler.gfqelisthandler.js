/** Copyright 2023 Kyocera Communication Systems Co., Ltd All rights reserved. */

/**
 * {GTag}専用のハンドラを定義します。
 *
 * @author oka 2023/10/25
 * @since 23.10.0
 */
(function($, undefined) {
	$.gfqelisthandler = {};
	$.contextId = null;
	$.extend($.gfqelisthandler, {
		getSelector: function(listId) {
			$.contextId = listId;
			return this;
		},
		/**
		 * リストの属性値の再設定をします.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		refresh: function() {
			var $rows = $.gfqelisthandler.getSelector($.contextId).getRows();
			$rows.filter(':even').addClass('geui-gplist-odd-row').removeClass('geui-gplist-even-row');
			$rows.filter(':odd').removeClass('geui-gplist-odd-row').addClass('geui-gplist-even-row');
			for (var i = 0; i < $rows.length; i++) {
				var $element = $($rows.get(i)).find('td, input, select, textarea, span');
				$.gfqelisthandler.setIndex($element, i);
				$.gfqelisthandler.setIndex($($rows.get(i)), i);
			}
		},

		/**
		 * リストのid属性値、name属性値の再設定をします.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @param $elemnt リスト
		 * @param i リストインデックス
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		setIndex: function($element, i) {
			$element.each(function() {
				var $this = $(this);
				var id = $this.attr('id');
				id && (id = id.replace(/\.\d+\.|\.temp\./, '.' + i + '.')) && $this.attr('id', id);
				var name = $this.attr('name');
				name && (name = name.replace(/\.\d+\.|\.temp\./, '.')) && $this.attr('name', name);
			});
		},
		/**
		 * 行を追加します.
		 *
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		add: function(element, idColumn, idColumnName) {
			var listId = $.contextId;
			var $rows = $.gfqelisthandler.getSelector(listId).getRows();
			var $maxlistsize = $.ge.idSelector(listId + '.maxlistsize');
			if (parseInt($.geui.attr($maxlistsize, 'value'), 10) <= $rows.length) {
				return;
			}
			var getTempRow = function(listId) {
				return $('#' + $.ge.escSelectorString(listId) + ' tbody tr[class~="temprow"]:eq(0)');
			};
			var $tempRow = getTempRow(listId).clone(true);
			var decorateRow = function(element, $destRow, idColumn, idColumnName) {
				var $curRow = $(element).parents('tr:first');
				var $columnId = $.geui.attr($curRow.find('[id$="' + idColumn + '"]'), 'value');
				var $columnName = $.geui.attr($curRow.find('[id$="' + idColumnName + '_hdn"]'), 'value');
				$.geui.attr($destRow.find('[id$="' + idColumn + '"]'), 'value', $columnId);
				$.geui.attr($destRow.find('[id$="' + idColumnName + '_hdn"]'), 'value', $columnName);
				$destRow.find('[id$="' + idColumnName + '"]').html($columnName);
			};
			$tempRow.removeClass('temprow');
			$('#' + $.ge.escSelectorString(listId) + ' tbody').append($tempRow);
			$tempRow.removeClass('hasDatepicker')
				.removeData('datepicker')
				.unbind()
				.datepicker();
			$.gfqelisthandler.getSelector(listId).refresh();
			decorateRow(element, $tempRow, idColumn, idColumnName);
			return $tempRow;

		},
		/**
		 * 画面に展開されているリストを取得します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @returns リスト
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		getRows: function() {
			return $('#' + $.ge.escSelectorString($.contextId) + ' tbody tr:not([class~="temprow"])');
		},
		/**
		 * 指定したリストを削除します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @parm リスト内の子要素
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		remove: function(element) {
			var $row = $(element).closest('tr');
			$row.remove();
			$.gfqelisthandler.getSelector($.contextId).refresh();
		},
		/**
		 * 選択した行を上位へ移動します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		moveUpRow: function() {
			var listId = $.contextId;
			var $rows = $.gfqelisthandler.getSelector(listId).getRows();
			if ($rows.filter(':first').hasClass('selected')) {
				return;
			}
			$rows.filter('.selected').each(function() {
				$(this).after($(this).prev());
			});
			$.gfqelisthandler.getSelector(listId).refresh();
		},
		/**
		 * 選択した行を下位へ移動します.
		 *
		 * @deprecated 内部処理制御用のため使用しないでください.
		 * @create 2023/10/25
		 * @author KCCS oka
		 * @since 23.10.0
		 */
		moveDownRow: function() {
			var listId = $.contextId;
			var $rows = $.gfqelisthandler.getSelector(listId).getRows();
			if ($rows.filter(':last').hasClass('selected')) {
				return;
			}
			$($rows.filter('.selected').get().reverse()).each(function() {
				$(this).before($(this).next());
			});
			$.gfqelisthandler.getSelector(listId).refresh();
		}
	});
})(jQuery);
