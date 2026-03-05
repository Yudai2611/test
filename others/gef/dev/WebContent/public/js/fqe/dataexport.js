// Copyright 2022 Kyocera Communication Systems Co., Ltd All rights reserved.


var toggleAllCheck = function(listId, element) {
         var checked = $(element).prop('checked');

         var $checkbox = $('#' + $.ge.escSelectorString(listId) + ' input:checkbox');
         var $checkboxHdn = $checkbox.next();
         $checkbox.each(function() {
             $(this).prop('checked', checked);
        });
        $checkboxHdn.each(function() {
         checked ? $(this).val("1") : $(this).val("0");
     });
 }

/**
 * 全選択のチェックボックスの初期化をします.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var headerCheckboxStateKeeper = function() {
    var $headerCheck = $('#' + $.ge.escSelectorString('fieldList.header.isUsedAll'));
    var $checkboxes = $('#' + $.ge.escSelectorString('fieldList') + ' input:checkbox');


    var $columnCheckboxes = $checkboxes.slice(2, $checkboxes.length);
    var $checkbokSize =$columnCheckboxes.length;

    if($checkbokSize === 0) {
        return;
    }

    var $checkeIndex = 0;

    $columnCheckboxes.each(function() {
        var check = $(this).prop('checked');
        if (check) {
            $checkeIndex = ++$checkeIndex;
        }
    });
    if ($checkeIndex === $checkbokSize) {
        $headerCheck.attr("checked", "checked");
    }
}

/**
 * 初期化処理をします.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var initEvent = function() {
    $.ge.idSelector('SaveOkBtn').bind('click', function(event) {
    	$.geui.attr('historyName', "value", $.geui.attr('DialogSaveName', "value"));
    });
    $.ge.idSelector('ExportBtn').bind('click', function(event) {
    	$.geui.attr('exportName', "value", $.geui.attr('DialogExportName', "value"));
    });
    $('#filterFieldGroupList').tabs().tabs({
        beforeActivate: function(event, ui){
            var $index = ui.newPanel[0].id.slice(4);
            changeToMoveRowBtn('filterFieldList' + $index,'SearchColumnMoveUpBtn', 'SearchColumnMoveDownBtn');
            setAddSearchBtnState('filterFieldList' + $index);

        }
    });
    $.ge.idSelector('AddBtn').appendTo('ul[class~="ui-tabs-nav"]');

    $(function(){
    		var $columnId =[];
    		var $maxlistsize = $.ge.idSelector('sortFieldList.maxlistsize');
    		var $rows = $.gfqelisthandler.getSelector('sortFieldList').getRows();

    		$('input[name="sortFieldList.fieldId"]').each(function() {
    			$columnId.push($(this).attr('value'));
    		});

    		$('tr[id^="fieldList"]').each(function() {
    			var $btn = $(this).find('input[id$="AddSortConditionBtn"]');
    			if($.inArray($(this).find('input[name="fieldList.fieldId"]').attr('value'), $columnId) != -1) {

    				$btn.addClass('geui-gpbutton-disabled ui-state-disabled');
    				$btn.prop('disabled', true);
    			}
    			if (parseInt($.geui.attr($maxlistsize, "value")) < $rows.length + 1) {
    				$btn.addClass('geui-gpbutton-disabled ui-state-disabled');
    				$btn.prop('disabled', true);
    			}

    		});

    	$(function(){
            $("#datasourceLabel"). keydown(function(e) {
                if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
                    return false;
                } else {
                    return true;
                }
            });
        });
    });


    headerCheckboxStateKeeper();
    sortable();
    setFunctionBtnState('fieldList');
    moveDeleteBtn('filterFieldGroupList', 'init');
    setDeleteTabBtnState('filterFieldGroupList');
    $('#filterFieldGroupList').each(function(index){
        setAddSearchBtnState('filterFieldList' + index);
    });

    $('select[id^="filterFieldList"]').each(function() {
        changeValueField(this);
    });

 	$(document).ajaxStop( function() {
		if ($('div[aria-describedby="DatasourceListZoom"]').css('display') !== 'none') {
			$('a[id="datasourceList.0.datasourceLabel"]').focus();
		};
		if ($('div[aria-describedby="ConditionHistoryListZoom"]').css('display') !== 'none') {
			$('input[id="historyNameKeyword"]').focus();
		};
	});
}

/**
 * ダイアログの初期化処理をします.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var initDialog = function(element) {
    var $element = $.ge.idSelector(element);
    $.geui.focus($element);
}

/**
 * 出力ダイアログの初期化処理をします.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var initConfirmBtnStatus = function(textbox, button) {
    $.ge.idSelector(button).addClass('geui-gpbutton-disabled ui-state-disabled');
    $.ge.idSelector(button).prop('disabled', true);
    $.ge.idSelector(textbox).on("keydown keyup keypress change", function() {
        if($(this).val().length > 0) {
            $.ge.idSelector(button).removeClass('geui-gpbutton-disabled ui-state-disabled');
            $.ge.idSelector(button).prop('disabled', false);
        } else {
            $.ge.idSelector(button).addClass('geui-gpbutton-disabled ui-state-disabled');
            $.ge.idSelector(button).prop('disabled', true);
        }
    });
}

/**
 * フィルターフィールドの初期化処理をします.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var initSearchColumnList = function(){
    let exportFields = []
    let $exportColumnList = $("#exportColumnList_list_block").find("tbody tr td[id$='.Column_C']")
    $exportColumnList.each(function(){
        let $columnId = $(this).find("input[name$='.fieldId']")
        let $columnName = $(this).find("input[name$='.fieldLabel']")
        let $columnType = $(this).find("input[name$='.fieldDataType']")
        let columnIdValue = $columnId.val()
        if(columnIdValue != ""){
            exportFields[$columnId.val()] = [$columnType.val(), $columnName.val()]
        }
    });

    let $txtArea =$("#filterFieldGroupList").find('textarea');
    $txtArea.each(function(i, obj){
        obj.style.display = "inline"
    })

    let $sortColumnList = $("#sortFieldList").find("tbody tr td[id$='.Column_C']")
    $sortColumnList.each(function(){
        let $columnId = $(this).find("input[name$='.fieldId']")
        let $columnName = $(this).find("span[id$='.fieldLabel']")
        if($columnId.val() != ""){
            $columnName.html(exportFields[$columnId.val()][1])
        }
    });
}

/**
 * 検索条件カラムのセレクトタグのvalue属性値に従い、コントロールを変化させます.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var changeValueField = function(element) {
    var $selopt = $(element).find('option:selected');
    var $tr = $(element).parents('tr:first');
    var $txtarea = $tr.find('textarea');
        $.geui.handler.gpselecthandler.prototype.val(element, $selopt.val());
        if ($selopt.val() === '6' || $selopt.val() === '7') {
            $txtarea.css('height', '30px');
            $txtarea.css('resize','vertical');
            $txtarea.off("keydown");
        } else {
            $txtarea.css('height', '15px');
            $txtarea.css('resize','none');
            $.geui.val($txtarea, $txtarea.val().replace(/\r\n|\r|\n/g,''));
            $txtarea.on("keydown", function(e){
                if (e.keyCode == 13 && !e.shiftKey)
                {
                    e.preventDefault();
                }
            });
        }

        if ($selopt.val() === '11' || $selopt.val() === '12') {
            $.geui.readonly($txtarea);
            $.geui.val($txtarea, "");
            $txtarea.addClass('geui-gptext-readonly');
        } else {
            $.geui.readwrite($txtarea);
            $txtarea.removeClass('geui-gptext-readonly');
        }
    var css = $tr.attr('class');
    $tr.removeClass(css);
    $tr.addClass(css);
}

/**
 * 行の選択・非選択の状態を変更します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var changeSelectable = function(element, moveUpRowBtnId, moveDownBtnId) {
    var $tr = $(element).parents('tr:first');
    $tr.toggleClass('selected');
    $tr.children().toggleClass('selected');
    changeToMoveUpRowBtn($(element.closest('table')).attr('id'), moveUpRowBtnId);
    changeToMoveDownRowBtn($(element.closest('table')).attr('id'), moveDownBtnId);
}

/**
 * 行の選択・非選択の状態を変更します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var setDeleteBtnState = function(listId, button) {
     var $checkState = false;
     var $buttun = $('#' + button);
     var $key = $buttun.attr('accesskey');
     var $title = $buttun.val().replace(new RegExp('\\(' + $key +'\\)' ,'g'), '');

    $('#' + $.ge.escSelectorString(listId) + ' input:checkbox').each(function() {
        if($(this).prop('checked')){
         $checkState = true;
        }
   });

     $buttun.addClass('geui-gpbutton-disabled ui-state-disabled');
     $buttun.prop('disabled', true);

   if($checkState){

    $buttun.removeClass('geui-gpbutton-disabled ui-state-disabled');
    $buttun.prop('disabled', false);
    $buttun.attr('title', $title);

   }
}

/**
 * 行の選択・非選択の状態を変更します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var setFunctionBtnState = function(listId) {
    var $checkState = false;
    var $exportButtun = $('#DataExportBtn');
    var $saveButtun = $('#SaveBtn');

   $('#' + $.ge.escSelectorString(listId) + ' input:checkbox').each(function() {
       if($(this).prop('checked')){
        $checkState = true;
       }
    });

    $exportButtun.addClass('geui-gpbutton-disabled ui-state-disabled');
    $exportButtun.prop('disabled', true);
    $saveButtun.addClass('geui-gpbutton-disabled ui-state-disabled');
    $saveButtun.prop('disabled', true);


  if($checkState && $("#datasourceLabel").val()!==""){
       $exportButtun.removeClass('geui-gpbutton-disabled ui-state-disabled');
       $exportButtun.prop('disabled', false);
       $saveButtun.removeClass('geui-gpbutton-disabled ui-state-disabled');
       $saveButtun.prop('disabled', false);
  }
}

/**
 * 行の選択・非選択の状態を変更します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var setAddSearchBtnState = function(listId) {
    var $rows = $.gfqelisthandler.getSelector(listId).getRows();
    var $maxlistsize = $.ge.idSelector(listId + '.maxlistsize');
    if (parseInt($.geui.attr($maxlistsize, "value")) <= $rows.length) {
        $('tr[id^="fieldList"]').each(function() {
            var $btn = $(this).find('input[id$="AddSearchConditionBtn"]');
            $btn.addClass('geui-gpbutton-disabled ui-state-disabled');
            $btn.prop('disabled', true);
        });
    } else {
        $('tr[id^="fieldList"]').each(function() {
            var $btn = $(this).find('input[id$="AddSearchConditionBtn"]');
            $btn.removeClass('geui-gpbutton-disabled ui-state-disabled');
            $btn.prop('disabled', false);
        });
    }
}

/**
 * 検索条件カラムを追加します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var addSearchColumn = function(tabsId, listId, element, idColumn, idColumnName) {
    var $tabIndex = $.ge.idSelector(tabsId).tabs('option', 'active');
    $.gfqelisthandler.getSelector(listId + $tabIndex).add(element, idColumn, idColumnName);
    setAddSearchBtnState(listId + $tabIndex);
}

/**
 * 検索条件カラムを削除します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var removeSearchColumn = function(tabsId, listId, element) {
    var tabIndex = $.ge.idSelector(tabsId).tabs('option', 'active');
    $.gfqelisthandler.getSelector(listId + tabIndex).remove(element);
    setAddSearchBtnState(tabsId + listId);
}

/**
 * 検索条件カラムを上位に移動します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var moveUpSearchColumn = function(tabsId, listId, element) {
    var tabIndex=$.ge.idSelector(tabsId).tabs('option', 'active');
    $.gfqelisthandler.getSelector(listId + tabIndex).moveUpRow();
    changeToMoveUpRowBtn(listId + tabIndex, $(element).attr('id'));
    changeToMoveDownRowBtn(listId + tabIndex, $(element).nextAll('input').attr('id'));
}

/**
 * 検索条件カラムを上位に移動します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var changeToMoveUpRowBtn = function(listId, moveUpRowBtnId) {
    var $rows = $.gfqelisthandler.getSelector(listId).getRows();
    $('#'+ moveUpRowBtnId).removeClass('geui-gpbutton-disabled ui-state-disabled');
    $('#'+ moveUpRowBtnId).prop('disabled', false);
    $('#'+ moveUpRowBtnId).attr('title', $('#'+ moveUpRowBtnId).attr('value'));
    if (!$rows.hasClass('selected') || $rows.filter(':first').hasClass('selected')) {
        $('#'+ moveUpRowBtnId).addClass('geui-gpbutton-disabled ui-state-disabled');
        $('#'+ moveUpRowBtnId).prop('disabled', true);
    }
}

/**
 * 検索条件カラムを上位に移動します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var changeToMoveDownRowBtn = function(listId, moveDownBtnId) {
    var $rows = $.gfqelisthandler.getSelector(listId).getRows();
    $('#'+ moveDownBtnId).removeClass('geui-gpbutton-disabled ui-state-disabled');
    $('#'+ moveDownBtnId).prop('disabled', false);
    $('#'+ moveDownBtnId).attr('title', $('#'+ moveDownBtnId).attr('value'));
    if (!$rows.hasClass('selected') || $rows.filter(':last').hasClass('selected')) {
        $('#'+ moveDownBtnId).addClass('geui-gpbutton-disabled ui-state-disabled');
        $('#'+ moveDownBtnId).prop('disabled', true);
    }
}

/**
 * 検索条件カラムを上位に移動します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var changeStateToConditionBtn = function(listId) {

    var $rows = $.gfqelisthandler.getSelector(listId).getRows();
    $('#'+ moveDownBtnId).removeClass('geui-gpbutton-disabled ui-state-disabled');
    $('#'+ moveDownBtnId).prop('disabled', false);
    $('#'+ moveDownBtnId).attr('title', $('#'+ moveDownBtnId).attr('value'));
    if (!$rows.hasClass('selected') || $rows.filter(':last').hasClass('selected')) {
        $('#'+ moveDownBtnId).addClass('geui-gpbutton-disabled ui-state-disabled');
        $('#'+ moveDownBtnId).prop('disabled', true);
    }
}

/**
 * 検索条件カラムを上位に移動します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var changeToMoveRowBtn = function(listId, moveUpRowBtnId ,moveDownBtnId) {
    changeToMoveUpRowBtn(listId, moveUpRowBtnId);
    changeToMoveDownRowBtn(listId, moveDownBtnId);
}

/**
 * 検索条件カラムを上位に移動します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var changeToMoveFilterRowBtn = function (listId, tabsId, moveUpRowBtnId ,moveDownBtnId) {
    var tabIndex = $.ge.idSelector(tabsId).tabs().tabs('option', 'active');
    changeToMoveRowBtn(listId + tabIndex, moveUpRowBtnId ,moveDownBtnId);
}

/**
 * 検索条件カラムを上位に移動します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
 var moveUpColumn = function (listId, element){
    $.gfqelisthandler.getSelector(listId).moveUpRow();
    changeToMoveUpRowBtn(listId, $(element).attr('id'));
    changeToMoveDownRowBtn(listId, $(element).nextAll('input').attr('id'));
}


/**
 * 検索条件カラムを上位に移動します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var moveDownColumn = function(listId, element){
    $.gfqelisthandler.getSelector(listId).moveDownRow();
    changeToMoveDownRowBtn(listId, $(element).attr('id'));
    changeToMoveUpRowBtn(listId, $(element).prevAll('input').attr('id'));
}

/**
 * 検索条件カラムを下位に移動します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var moveDownSearchColumn = function(tabsId, listId, element) {
    var tabIndex=$.ge.idSelector(tabsId).tabs('option', 'active');
    $.gfqelisthandler.getSelector(listId + tabIndex).moveDownRow();
    changeToMoveDownRowBtn(listId + tabIndex, $(element).attr('id'));
    changeToMoveUpRowBtn(listId + tabIndex, $(element).prevAll('input').attr('id'));
}

/**
 * ソートカラムを追加します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var addSortColumn = function(listId, element, idColumn, idColumnName) {
    var $curRow = $(element).parents('tr:first');
    var fieldId = $.geui.attr($curRow.find('[id$="' + idColumn + '"]'), "value");
    var $maxlistsize = $.ge.idSelector(listId + '.maxlistsize');
    var $rows = $.gfqelisthandler.getSelector(listId).getRows();

    if (listId === 'sortFieldList') {
        if ($('#sortFieldList [id$="' + idColumn + '"][value="' + fieldId + '"]').length > 0) {
            return;
        }
    }
    if (parseInt($.geui.attr($maxlistsize, "value")) < $rows.length + 2) {
        $('tr[id^="fieldList"]').each(function() {
            var $btn = $(this).find('input[id$="AddSortConditionBtn"]');
                $btn.addClass('geui-gpbutton-disabled ui-state-disabled');
                $btn.prop('disabled', true);
        });
    }
    $(element).addClass('geui-gpbutton-disabled ui-state-disabled');
    $(element).prop('disabled', true);
    $.gfqelisthandler.getSelector(listId).add(element, idColumn, idColumnName);
}

/**
 * ソートカラムを追加します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var removeSortColumn = function (listId, element) {
    $(function(){
        var $columnId =[];
        var $maxlistsize = $.ge.idSelector('sortFieldList.maxlistsize');
        var $rows = $.gfqelisthandler.getSelector('sortFieldList').getRows();

        $('input[name="sortFieldList.fieldId"]').each(function() {
            $columnId.push($(this).attr('value'));
        });

        $('tr[id^="fieldList"]').each(function() {
            var $btn = $(this).find('input[id$="AddSortConditionBtn"]');

            $btn.removeClass('geui-gpbutton-disabled ui-state-disabled');
            $btn.prop('disabled', false);

            if($.inArray($(this).find('input[name="fieldList.fieldId"]').attr('value'), $columnId) != -1) {

                $btn.addClass('geui-gpbutton-disabled ui-state-disabled');
                $btn.prop('disabled', true);
            }

        });
    });
    var $columnId = $(element).parent().parent().find('input[name="' + listId + '.fieldId"]').attr('value');
     $('tr[id^="fieldList"]').each(function() {
        if($(this).find('input[name="fieldList.fieldId"]').attr('value')===$columnId) {
            $btn = $(this).find('input[id$="AddSortConditionBtn"]');
            $btn.removeClass('geui-gpbutton-disabled ui-state-disabled');
            $btn.prop('disabled', false);
        }
    });

    $.gfqelisthandler.getSelector(listId).remove(element);
}
/**
 * 出力条件履歴削除確認用のダイアログの表示と、アクションパラメータを生成します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var deleteConfirm = function() {

    var $isCheck = false;
    var $checkbox = $('#' + 'historyConditionList' + ' input:checkbox');
    $checkbox.each(function(){
        if($(this).prop('checked')){
            $isCheck =true;
        }
    });

    if($isCheck){
        if(window.confirm("本当に削除してもいいですか？")) {
            $.gectrl.gappcontroller.invokeAjaxAction(event, {
                actionparams: {
                        actionbean: 'sample.ria.fqe.action.HistoryConditionAction',
                        form: 'ConditionHistoryListForm',
                        validate: 'none',
                        actionmethod: 'deleteHistory',
                        indicator: 'ajax-indicator',
                        render: "ConditionHistoryListRender",
                        mode: "delete",
                        event: "click"
                }
            });
        };
    } else {
        window.alert("削除対象を選んでください。");
    }

}
/**
 * 検索条件リストのインデックスを再構築します.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var refreshSearchList = function(tabsId, listId) {
    var tabIndex=$.ge.idSelector(tabsId).tabs('option', 'active');
    $.gfqelisthandler.getSelector(listId + tabIndex).refresh();
}

var refreshList = function(listId) {
    $.gfqelisthandler.getSelector(listId).refresh();
}
/**
 * リストのドラッグ、アンド、ドロップ機能を提供しています.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var sortable = function () {
    $('.selectable tbody').sortable({
    opacity: 0.5,
    placeholder: "drag",
    axis: 'y',
});
}

/**
 * リストのドラッグ、アンド、ドロップ機能を提供しています.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var moveDeleteBtn = function (tabId, mode) {
    var $moveBtn = $('#' + tabId + ' div[id^="tab-"] span[id^="RemoveBtn"]');
    $('#' + tabId + ' li:last span[id^="RemoveBtn"]').remove();
    $moveBtn.each(function(){
        var $index = 0;
        if(mode === "init"){
            $index = parseInt($(this).parent().attr('id').slice(4)) + 1;
        } else {
            $index = parseInt($(this).parent().attr('id').slice(4)) + 2;
        }

        $(this).appendTo('#' + tabId + ' li:nth-child(' + $index + ')');

    })
}

/**
 * リストのドラッグ、アンド、ドロップ機能を提供しています.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var setDeleteTabBtnState = function (tabId) {
    var $firstBtn = $('#' + tabId + ' li[aria-controls="tab-0"] span[id^="RemoveBtn"]');
    var $tabDeployment = $('div[id^="tab-"]');

    $firstBtn.hide();
    if($tabDeployment.length>1){
        $firstBtn.show();
    }
}

/**
 * リストのドラッグ、アンド、ドロップ機能を提供しています.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var returnDeleteBtn = function (tabId, element) {
    var $tabIndex = $(element).parent().attr('aria-controls').slice(4);
    $(element).attr('value', 'RemoveBtn' + $tabIndex);
    $('#' + tabId).tabs('option', 'active', $tabIndex);
    $(element).prependTo('#tab-' + $tabIndex);
}

/**
 * tabを追加します（ドラッグ、アンド、ドロップ機能対応）.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var addTabSortable = function (tabsId) {

    var $escapeElm = $('div[id^="escape_tab-"]');
    if ($escapeElm.length === 1) {
        $('#AddBtn').hide();
    }

    $.gfqetabhandler.getSelector(tabsId).add();
    moveDeleteBtn(tabsId);
    setDeleteTabBtnState(tabsId);
    sortable();
}

/**
 * tabを削除します（ドラッグ、アンド、ドロップ機能対応）.
 *
 * @create 2023/10/25
 * @author KCCS oka
 * @since 23.10.0
 */
var removeTabSortable = function(tabsId, element) {
    $('#AddBtn').show();
    returnDeleteBtn(tabsId, element);
    $.gfqetabhandler.getSelector(tabsId).remove();
    setDeleteTabBtnState(tabsId);
}
