// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * イメージインジケータウィジェットを定義します。
 *
 * @author yamashita 2011/04/23
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'geui-grimgindicator';
	/**
	 * geui.grimgindicator ウィジェットクラス
	 *
	 * イメージインジケータ表示制御用のウィジェット です。
	 *
	 * @extend {$.geui.grimgindicator}
	 * @author yamashita 2011/04/23
	 * @since 3.9.0
	 */
	$.widget('geui.grimgindicator', $.geui.grindicator, {
		_baseClass: baseClass
	});
})(jQuery);
