// Copyright 2011-2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * デフォルトハンドラを定義します。
 *
 * @author yamashita 2011/08/22
 * @since 3.9.0
 */
(function($, undefined) {
	$.geui.handler.gdefaulthandler = $.geui.handler.gdefaulthandler || function() {};
	$.geui.handler.gdefaulthandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.geui.handler.set('', new $.geui.handler.gdefaulthandler());
})(jQuery);
