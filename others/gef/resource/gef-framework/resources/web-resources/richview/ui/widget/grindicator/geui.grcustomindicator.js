// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * カスタムインジケータウィジェットを定義します。
 *
 * @author yamashita 2011/06/16
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'geui-grcustomindicator';
	/**
	 * geui.grcustomindicator ウィジェットクラス
	 *
	 * カスタムインジケータ表示制御用のウィジェット です。
	 *
	 * @extend {$.geui.grcustomindicator}
	 * @author yamashita 2011/06/16
	 * @since 3.9.0
	 */
	$.widget('geui.grcustomindicator', $.geui.grindicator, {
		_baseClass: baseClass
	});
})(jQuery);
