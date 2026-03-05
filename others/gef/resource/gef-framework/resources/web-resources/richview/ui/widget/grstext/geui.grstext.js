// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * テキストウィジェットを定義します。
 *
 * @author T.Aono 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'ui-widget ui-widget-content ui-corner-all geui-grstext',
		disabledClass = 'geui-grstext-disabled',
		readonlyClass = 'geui-grstext-readonly',
		labelClass = 'geui-grstext-label';
	/**
	 * geui.grstext ウィジェットクラス
	 *
	 * テキストフィールド表示制御用のウィジェットです。
	 *
	 * @extend { $.geui.gfieldwidgetbase}
	 * @author T.Aono 2011/3/11
	 * @since 3.9.0
	 */
	$.widget('geui.grstext', $.geui.gfieldwidgetbase, {
		_baseClass: baseClass,
		_disabledClass: disabledClass,
		_readonlyClass: readonlyClass,
		_labelClass: labelClass
	});
})(jQuery);
