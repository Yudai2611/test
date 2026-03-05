$(function() {
	var addDetailPrompt = function(event, element) {
		var form = $('#formMain')[0];
		var sSize;
		var $element = $.ge.event.target(event);
		var input = '';
		var ime;
		var elements = form.elements;
		for (i = 0; i < elements.length; i++) {
			if (elements[i].tagName == 'INPUT' && elements[i].type == 'text' && (!elements[i].disabled && !elements[i].readOnly)) {
				try {
					input = elements[i];
					ime = input.style.imeMode;
					input.style.imeMode = 'inactive';
					input.focus();
					break;
				} catch (ex) {}
			} else if (elements[i].tagName == 'INPUT' && elements[i].type == 'file' && (!elements[i].disabled && !elements[i].readOnly)) {
				try {
					input = elements[i];
					ime = input.style.imeMode;
					input.style.imeMode = 'inactive';
					input.focus();
					break;
				} catch(ex) {}
			} else if (elements[i].tagName == 'TEXTAREA' && (!elements[i].disabled && !elements[i].readOnly)) {
				try {
					input = elements[i];
					ime = input.style.imeMode;
					input.style.imeMode = 'inactive';
					input.focus();
					break;
				} catch (ex) {}
			}
		}
		sSize = window.prompt( '追加する明細の行数を指定してください[1-100]', '1' );
		try {
			if (input != '') {
				input.style.imeMode = ime;
				input.focus();
			}
		} catch (e) {}
		if (sSize == null || sSize.replace(/\s+/,'') == '') {
			return false;
		}
		if (isNaN(sSize)) {
			alert('数値を入力してください[1-100]');
			return false;
		}
		if (sSize < 1 || sSize > 100) {
			alert('数値を入力してください[1-100]');
			return false;
		}
		if (Math.ceil(sSize)!=sSize) {
			alert('整数を入力してください[1-100]');
			return false;
		}
		sSize = parseInt(sSize);
		$.ge.idSelector(element).val(sSize);
		return true;
	};
	var addRowAction = function(event) {
		if (!addDetailPrompt(event, 'AddRowSize')) return;
		$.gectrl.gappcontroller.invokeSubmitAction(event, {
			actionparams: {
					actionbean: 'sample.ria.headerdetail.OrderDetailAction',
					forward: '/WEB-INF/jsp/sample/ria/headerdetail/orderdetail.jsp',
					form: 'formMain',
					validate: 'error',
					actionmethod: 'doAddRow',
					indicator: 'submit-indicator'
			}
		});
	};
	$.ge.idSelector('AddRowF').on('click', function(event) {
		addRowAction(event);
	});
	$.ge.idSelector('AddRowH').on('click', function(event) {
		addRowAction(event);
	});
});
