// Copyright 2013-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPListTag}専用のハンドラを定義します。
 *
 * @author kawakami 2013/07/23
 * @since 3.12.0
 */
(function($, undefined) {
	var _LIST_BLOCK_ID_SUFFIX = '_list_block',
		_LIST_HSCROLL_BLOCK_CLASS = '.geui-gplist-hscrollblock',
		_LIST_CAPTION_SCROLL_BLOCK_CLASS = '.geui-gplist-caption-scrollblock',
		_LIST_HEADER_SCROLL_BLOCK_CLASS = '.geui-gplist-header-scrollblock',
		_LIST_ROW_SCROLL_BLOCK_CLASS = '.geui-gplist-row-scrollblock',
		_LIST_FOOTER_SCROLL_BLOCK_CLASS = '.geui-gplist-footer-scrollblock',
		_LIST_CAPTION_TABLE_CLASS = '.geui-gplist-caption-table',
		_LIST_HEADER_TABLE_CLASS = '.geui-gplist-header-table',
		_LIST_FOOTER_TABLE_CLASS = '.geui-gplist-footer-table',
		_LIST_HSCROLLBAR_CONTENT_CLASS = '.geui-gplist-hscrollbar-content';
	$.geui.handler.gplisthandler = $.geui.handler.gplisthandler || function() {};
	$.extend($.geui.handler.gplisthandler.prototype, {
		/**
		 * 指定されたlist要素(id属性)を横スクロールテーブル用に初期化します.
		 * widthの設定を行う。
		 * @param id id属性
		 * @author kikuchi 2013/09/14
		 * @since 3.12.0
		 */
		horizontal: function(id) {
			var $block = $.ge.idSelector(id + _LIST_BLOCK_ID_SUFFIX);
			var $table = $.ge.idSelector(id);
			var $scrollblock = $block.find(_LIST_HSCROLL_BLOCK_CLASS);
			var tableStyle = $table[0] ? $table[0].style : {};
			var scrollblockStyle = $scrollblock[0] ? $scrollblock[0].style : {};

			var tableLayout = tableStyle.tableLayout;
			var scrollwidth = scrollblockStyle.width;

			tableStyle.width = '0px';
			tableStyle.tableLayout = 'fixed';
			var contentWidth = $table.outerWidth(true);
			contentWidth = $table.find('tr').length ? contentWidth : parseInt(scrollwidth, 10); // trがない = ヘッダー/明細/フッターがない
			tableStyle.width = contentWidth + 'px';
			scrollblockStyle.width = scrollwidth;

			tableStyle.tableLayout = tableLayout;
		},
		/**
		 * 指定されたlist要素(id属性)を縦スクロールテーブル用に初期化します.
		 * widthの設定と、ScrollBarの設定を行う。
		 * @param id id属性
		 * @author kikuchi 2013/09/14
		 * @since 3.12.0
		 */
		vertical: function(id) {
			var $block = $.ge.idSelector(id + _LIST_BLOCK_ID_SUFFIX);
			var $captionBlock = $block.find(_LIST_CAPTION_SCROLL_BLOCK_CLASS);
			var $headerBlock = $block.find(_LIST_HEADER_SCROLL_BLOCK_CLASS);
			var $rowBlock = $block.find(_LIST_ROW_SCROLL_BLOCK_CLASS);
			var $footerBlock = $block.find(_LIST_FOOTER_SCROLL_BLOCK_CLASS);

			var captionBlockStyle = $captionBlock[0] ? $captionBlock[0].style : {};
			var headerBlockStyle = $headerBlock[0] ? $headerBlock[0].style : {};
			var rowBlockStyle = $rowBlock[0] ? $rowBlock[0].style : {};
			var footerBlockStyle = $footerBlock[0] ? $footerBlock[0].style : {};
			var captionStyle = $captionBlock[0] ? $block.find(_LIST_CAPTION_TABLE_CLASS)[0].style : {};
			var headerStyle = $headerBlock[0] ? $block.find(_LIST_HEADER_TABLE_CLASS)[0].style : {};
			var rowStyle = $rowBlock[0] ? $.ge.idSelector(id)[0].style : {};
			var footerStyle = $footerBlock[0] ? $block.find(_LIST_FOOTER_TABLE_CLASS)[0].style : {};

			var hTableLayout = headerStyle.tableLayout;
			var rTableLayout = rowStyle.tableLayout;
			var fTableLayout = footerStyle.tableLayout;

			headerStyle.width = '0px';
			headerStyle.tableLayout = 'fixed';
			rowStyle.width = '0px';
			rowStyle.tableLayout = 'fixed';
			footerStyle.width = '0px';
			footerStyle.tableLayout = 'fixed';

			var contentWidth = this._getContentWidth($headerBlock, $rowBlock, $footerBlock);
			captionStyle.width = contentWidth + 'px';
			headerStyle.width = contentWidth + 'px';
			rowStyle.width = contentWidth + 'px';
			footerStyle.width = contentWidth + 'px';

			captionBlockStyle.width = contentWidth + 'px';
			headerBlockStyle.width = contentWidth + 'px';
			rowBlockStyle.width = contentWidth + 'px';
			footerBlockStyle.width = contentWidth + 'px';

			headerStyle.tableLayout = hTableLayout;
			rowStyle.tableLayout = rTableLayout;
			footerStyle.tableLayout = fTableLayout;

			this._setScrollbar($block, $captionBlock, $headerBlock, $rowBlock, $footerBlock);
		},
		/**
		 * 指定されたlist要素(id属性)を縦横スクロールテーブル用に初期化します.
		 * widthの設定と、ScrollBarの設定を行う。
		 * @param id id属性
		 * @author kikuchi 2013/09/14
		 * @since 3.12.0
		 */
		both: function(id) {
			var $block = $.ge.idSelector(id + _LIST_BLOCK_ID_SUFFIX);
			var $captionBlock = $block.find(_LIST_CAPTION_SCROLL_BLOCK_CLASS);
			var $headerBlock = $block.find(_LIST_HEADER_SCROLL_BLOCK_CLASS);
			var $rowBlock = $block.find(_LIST_ROW_SCROLL_BLOCK_CLASS);
			var $footerBlock = $block.find(_LIST_FOOTER_SCROLL_BLOCK_CLASS);

			var captionBlockStyle = $captionBlock[0] ? $captionBlock[0].style : {};
			var headerBlockStyle = $headerBlock[0] ? $headerBlock[0].style : {};
			var rowBlockStyle = $rowBlock[0] ? $rowBlock[0].style : {};
			var footerBlockStyle = $footerBlock[0] ? $footerBlock[0].style : {};
			var captionStyle = $captionBlock[0] ? $block.find(_LIST_CAPTION_TABLE_CLASS)[0].style : {};
			var headerStyle = $headerBlock[0] ? $block.find(_LIST_HEADER_TABLE_CLASS)[0].style : {};
			var rowStyle = $rowBlock[0] ? $.ge.idSelector(id)[0].style : {};
			var footerStyle = $footerBlock[0] ? $block.find(_LIST_FOOTER_TABLE_CLASS)[0].style : {};
			var scrollbarStyle = $block.find(_LIST_HSCROLLBAR_CONTENT_CLASS)[0].style;

			var scrollWidth = this._getScrollWidth($headerBlock, $rowBlock, $footerBlock);
			var hTableLayout = headerStyle.tableLayout;
			var rTableLayout = rowStyle.tableLayout;
			var fTableLayout = footerStyle.tableLayout;

			headerStyle.width = '0px';
			headerStyle.tableLayout = 'fixed';
			rowStyle.width = '0px';
			rowStyle.tableLayout = 'fixed';
			footerStyle.width = '0px';
			footerStyle.tableLayout = 'fixed';

			var contentWidth = this._getContentWidth($headerBlock, $rowBlock, $footerBlock);
			contentWidth = contentWidth ? contentWidth : parseInt(scrollWidth, 10); // contenWidthがない = ヘッダー/明細/フッターがない
			scrollbarStyle.width = contentWidth + 'px';
			captionStyle.width = contentWidth + 'px';
			headerStyle.width = contentWidth + 'px';
			rowStyle.width = contentWidth + 'px';
			footerStyle.width = contentWidth + 'px';
			captionBlockStyle.width = scrollWidth;
			headerBlockStyle.width = scrollWidth;
			rowBlockStyle.width = scrollWidth;
			footerBlockStyle.width = scrollWidth;

			headerStyle.tableLayout = hTableLayout;
			rowStyle.tableLayout = rTableLayout;
			footerStyle.tableLayout = fTableLayout;

			this._setScrollbar($block, $captionBlock, $headerBlock, $rowBlock, $footerBlock);
		},
		/**
		 * list要素のwidthを取得する.
		 * header,row,footerの順に優先的にwidthを取得します。
		 * @param $header ヘッダーブロック(jQueryオブジェクト)
		 * @param $row 明細ブロック(jQueryオブジェクト)
		 * @param $footer フッターブロック(jQueryオブジェクト)
		 * @author kikuchi 2013/09/14
		 * @since 3.12.0
		 */
		_getContentWidth: function($header, $row, $footer) {
			if ($header.length) {
				return $header.find('table').outerWidth(true);
			}
			if ($row.length) {
				if ($row.find('tr').length) {
					return $row.find('table').outerWidth(true);
				}
			}
			if ($footer.length) {
				return $footer.find('table').outerWidth(true);
			}
			return 0;
		},
		/**
		 * スクロール領域のwidthを取得する.
		 * header,row,footerの順に優先的にwidthを取得します。
		 * @param $header ヘッダーブロック(jQueryオブジェクト)
		 * @param $row 明細ブロック(jQueryオブジェクト)
		 * @param $footer フッターブロック(jQueryオブジェクト)
		 * @author kikuchi 2013/09/14
		 * @since 3.12.0
		 */
		_getScrollWidth: function($header, $row, $footer) {
			if ($header.length >= 1) {
				return $header[0].style.width;
			} else if ($row.length >= 1) {
				return $row[0].style.width;
			} else if ($footer.length >= 1) {
				return $footer[0].style.width;
			}
			return 0;
		},
		/**
		 * 指定されたlist要素内のScrollBarに対するイベントのバインドと、スクロール領域の設定を行う。
		 * @param $block テーブル全体のブロック(jQueryオブジェクト)
		 * @param $caption キャプションブロック(jQueryオブジェクト)
		 * @param $header ヘッダーブロック(jQueryオブジェクト)
		 * @param $row 明細ブロック(jQueryオブジェクト)
		 * @param $footer フッターブロック(jQueryオブジェクト)
		 * @author kikuchi 2013/09/14
		 * @since 3.12.0
		 */
		_setScrollbar: function($block, $caption, $header, $row, $footer) {
			var scrollbarWidth = function() {
				var body = document.body,
					width = 0,
					defaultOverflow = document.body.style.overflow;
				body.style.overflow = 'hidden';
				width = body.clientWidth;
				body.style.overflow = 'scroll';
				width -= body.clientWidth;
				if (!width) {
					width = body.offsetWidth - body.clientWidth;
				}
				body.style.overflow = defaultOverflow;
				return width;
			};
			var barwidth = scrollbarWidth();
			var scrollWidth = parseInt(this._getScrollWidth($header, $row, $footer), 10);
			var total = scrollWidth + barwidth;
			$row.length && ($row[0].style.width = '' + total + 'px');
			var $bar = $block.find('.geui-gplist-hscrollbar');
			if ($bar.length > 0) {
				var barStyle = $bar[0].style;
				barStyle.width = '' + scrollWidth + 'px';
				//　TODO:　[2017/02/07][kikuchi]
				//　　　　　　IE11で、「ｽｸﾛｰﾙ領域(div)の高さ <= ｽｸﾛｰﾙﾊﾞｰの高さ」の場合にｽｸﾛｰﾙﾊﾞｰが正常動作しないため、heightに1px追加。ﾚｲｱｳﾄ調整のためmarginTopに-1px追加。
				//　　　　　　ﾌﾞﾗｳｻﾞ側で問題が解消された場合や、IE11のサポートを終了する場合、本追加処理は削除すること。
				barStyle.height = '' + (barwidth + 1) + 'px';
				barStyle.marginTop = '-1px';
				$bar.on('scroll', function() {
					var scrollLeft = $bar.scrollLeft();
					$caption.length && $caption.scrollLeft(scrollLeft);
					$header.length && $header.scrollLeft(scrollLeft);
					$row.length && $row.scrollLeft(scrollLeft);
					$footer.length && $footer.scrollLeft(scrollLeft);
				});
			}
		}
	});
	$.geui.handler.set('gplist', new $.geui.handler.gplisthandler());
})(jQuery);
