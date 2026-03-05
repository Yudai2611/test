// Copyright 2013-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * RIA部品の拡張機能を定義します。
 *
 * @author yamashita 2013/06/06
 * @since 3.12.0
 */

/*!
 * jQuery UI Datepicker 1.13.0
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
;(function($, undefined) {

	$.extend($.ui, {
		datepicker: {
			version: "1.13.0"
		}
	});

	var PROP_NAME = 'geui-grdate';
	var datepicker_instActive;

	function datepicker_getZindex(elem) {
		var position, value;
		while (elem.length && elem[0] !== document) {

			// Ignore z-index if position is set to a value where z-index is ignored by the browser
			// This makes behavior of this function consistent across browsers
			// WebKit always returns auto if the element is positioned
			position = elem.css("position");
			if (position === "absolute" || position === "relative" || position === "fixed") {

				// IE returns 0 when zIndex is not specified
				// other browsers return a string
				// we ignore the case of nested elements with an explicit value of 0
				// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
				value = parseInt(elem.css("zIndex"), 10);
				if (!isNaN(value) && value !== 0) {
					return value;
				}
			}
			elem = elem.parent();
		}

		return 0;
	}

	/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

	function Datepicker() {
		this._curInst = null; // The current instance in use
		this._keyEvent = false; // If the last event was a key event
		this._disabledInputs = []; // List of date picker inputs that have been disabled
		this._datepickerShowing = false; // True if the popup picker is showing , false if not
		this._inDialog = false; // True if showing within a "dialog", false if not
		this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
		this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
		this._appendClass = "ui-datepicker-append"; // The name of the append marker class
		this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
		this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
		this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
		this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
		this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
		this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
		this.regional = []; // Available regional settings, indexed by language code
		this.regional[""] = { // Default regional settings
			closeText: "Done", // Display text for close link
			prevText: "Prev", // Display text for previous month link
			nextText: "Next", // Display text for next month link
			currentText: "Today", // Display text for current month link
			monthNames: ["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"
			], // Names of months for drop-down and formatting
			monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
			dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
			dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
			dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], // Column headings for days starting at Sunday
			weekHeader: "Wk", // Column header for week of the year
			dateFormat: "mm/dd/yy", // See format options on parseDate
			firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
			isRTL: false, // True if right-to-left language, false if left-to-right
			showMonthAfterYear: false, // True if the year select precedes month, false for month then year
			yearSuffix: "", // Additional text to append to the year in the month headers,
			selectMonthLabel: "Select month", // Invisible label for month selector
			selectYearLabel: "Select year" // Invisible label for year selector
		};
		this._defaults = { // Global defaults for all the date picker instances
			showOn: "focus", // "focus" for popup on focus,
			// "button" for trigger button, or "both" for either
			showAnim: "fadeIn", // Name of jQuery animation for popup
			showOptions: {}, // Options for enhanced animations
			defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
			appendText: "", // Display text following the input box, e.g. showing the format
			buttonText: "...", // Text for trigger button
			buttonImage: "", // URL for trigger button image
			buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
			hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
			navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
			gotoCurrent: false, // True if today link goes back to current selection instead
			changeMonth: false, // True if month can be selected directly, false if only prev/next
			changeYear: false, // True if year can be selected directly, false if only prev/next
			yearRange: "c-10:c+10", // Range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
			showOtherMonths: false, // True to show dates in other months, false to leave blank
			selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
			showWeek: false, // True to show week of the year, false to not show it
			calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
			shortYearCutoff: "+10", // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with "+" for current year + value
			minDate: null, // The earliest selectable date, or null for no limit
			maxDate: null, // The latest selectable date, or null for no limit
			duration: "fast", // Duration of display/closure
			beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
			beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
			onSelect: null, // Define a callback function when a date is selected
			onChangeMonthYear: null, // Define a callback function when the month or year is changed
			onClose: null, // Define a callback function when the datepicker is closed
			onUpdateDatepicker: null, // Define a callback function when the datepicker is updated
			numberOfMonths: 1, // Number of months to show at a time
			showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
			stepMonths: 1, // Number of months to step back/forward
			stepBigMonths: 12, // Number of months to step back/forward for the big links
			altField: "", // Selector for an alternate field to store selected dates into
			altFormat: "", // The date format to use for the alternate field
			constrainInput: true, // The input is constrained by the current date format
			showButtonPanel: false, // True to show button panel, false to not show it
			autoSize: false, // True to size the input for the date format, false to leave as is
			disabled: false // The initial disabled state
		};
		$.extend(this._defaults, this.regional[""]);
		this.regional.en = $.extend(true, {}, this.regional[""]);
		this.regional["en-US"] = $.extend(true, {}, this.regional.en);
		this.dpDiv = datepicker_bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
	}

	$.extend(Datepicker.prototype, {

		/* Class name added to elements to indicate already configured with a date picker. */
		markerClassName: "hasDatepicker",

		//Keep track of the maximum number of rows displayed (see #7043)
		maxRows: 4,

		// TODO rename to "widget" when switching to widget factory
		_widgetDatepicker: function() {
			return this.dpDiv;
		},

		/* Override the default settings for all instances of the date picker.
		 * @param  settings  object - the new settings to use as defaults (anonymous object)
		 * @return the manager object
		 */
		setDefaults: function(settings) {
			datepicker_extendRemove(this._defaults, settings || {});
			return this;
		},

		/* Attach the date picker to a jQuery selection.
		 * @param  target	element - the target input field or division or span
		 * @param  settings  object - the new settings to use for this date picker instance (anonymous)
		 */
		_attachDatepicker: function(target, settings) {
			var nodeName, inline, inst;
			nodeName = target.nodeName.toLowerCase();
			inline = (nodeName === "div" || nodeName === "span");
			if (!target.id) {
				this.uuid += 1;
				target.id = "dp" + this.uuid;
			}
			inst = this._newInst($(target), inline);
			inst.settings = $.extend({}, settings || {});
			if (nodeName === "input") {
				this._connectDatepicker(target, inst);
			} else if (inline) {
				this._inlineDatepicker(target, inst);
			}
		},

		/* Create a new instance object. */
		_newInst: function(target, inline) {
			var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
			return {
				id: id,
				input: target, // associated target
				selectedDay: 0,
				selectedMonth: 0,
				selectedYear: 0, // current selection
				drawMonth: 0,
				drawYear: 0, // month being drawn
				inline: inline, // is datepicker inline or not
				dpDiv: (!inline ? this.dpDiv : // presentation div
					datepicker_bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))
			};
		},

		/* Attach the date picker to an input field. */
		_connectDatepicker: function(target, inst) {
			var input = $(target);
			inst.append = $([]);
			inst.trigger = $([]);
			if (input.hasClass(this.markerClassName)) {
				return;
			}
			this._attachments(input, inst);
			input.addClass(this.markerClassName).on("keydown", this._doKeyDown).
			on("keypress", this._doKeyPress).on("keyup", this._doKeyUp);
			this._autoSize(inst);
			$.data(target, PROP_NAME, inst);

			//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
			if (inst.settings.disabled) {
				this._disableDatepicker(target);
			}
		},

		/* Make attachments based on settings. */
		_attachments: function(input, inst) {
			var showOn, buttonText, buttonImage,
				appendText = this._get(inst, "appendText"),
				isRTL = this._get(inst, "isRTL");

			if (inst.append) {
				inst.append.remove();
			}
			if (appendText) {
				inst.append = $("<span>")
					.addClass(this._appendClass)
					.text(appendText);
				input[isRTL ? "before" : "after"](inst.append);
			}

			input.off("focus", this._showDatepicker);

			if (inst.trigger) {
				inst.trigger.remove();
			}

			showOn = this._get(inst, "showOn");
			if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
				input.on("focus", this._showDatepicker);
				// ##### CUSTOMIZE [2013/06/11][yamashita] クリック時にカレンダーがポップアップしないバグを解消 [start] ####
				input.on("click", this._showDatepicker);
				// ##### CUSTOMIZE [2013/06/11][yamashita] クリック時にカレンダーがポップアップしないバグを解消 [end] ####
			}
			if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
				buttonText = this._get(inst, "buttonText");
				buttonImage = this._get(inst, "buttonImage");

				if (this._get(inst, "buttonImageOnly")) {
					inst.trigger = $("<img>")
						.addClass(this._triggerClass)
						.attr({
							src: buttonImage,
							alt: buttonText,
							title: buttonText
						});
				} else {
					inst.trigger = $("<button type='button'>")
						.addClass(this._triggerClass);
					if (buttonImage) {
						inst.trigger.html(
							$("<img>")
							.attr({
								src: buttonImage,
								alt: buttonText,
								title: buttonText
							})
						);
					} else {
						inst.trigger.text(buttonText);
					}
				}

				input[isRTL ? "before" : "after"](inst.trigger);
				inst.trigger.on("click", function() {
					if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
						$.datepicker._hideDatepicker();
					} else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
						$.datepicker._hideDatepicker();
						$.datepicker._showDatepicker(input[0]);
					} else {
						$.datepicker._showDatepicker(input[0]);
					}
					return false;
				});
			}
		},

		/* Apply the maximum length for the date format. */
		_autoSize: function(inst) {
			if (this._get(inst, "autoSize") && !inst.inline) {
				var findMax, max, maxI, i,
					date = new Date(2009, 12 - 1, 20), // Ensure double digits
					dateFormat = this._get(inst, "dateFormat");

				if (dateFormat.match(/[DM]/)) {
					findMax = function(names) {
						max = 0;
						maxI = 0;
						for (i = 0; i < names.length; i++) {
							if (names[i].length > max) {
								max = names[i].length;
								maxI = i;
							}
						}
						return maxI;
					};
					date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
						"monthNames" : "monthNamesShort"))));
					date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
						"dayNames" : "dayNamesShort"))) + 20 - date.getDay());
				}
				inst.input.attr("size", this._formatDate(inst, date).length);
			}
		},

		/* Attach an inline date picker to a div. */
		_inlineDatepicker: function(target, inst) {
			var divSpan = $(target);
			if (divSpan.hasClass(this.markerClassName)) {
				return;
			}
			divSpan.addClass(this.markerClassName).append(inst.dpDiv);
			$.data(target, PROP_NAME, inst);
			this._setDate(inst, this._getDefaultDate(inst), true);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);

			//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
			if (inst.settings.disabled) {
				this._disableDatepicker(target);
			}

			// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
			// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
			inst.dpDiv.css("display", "block");
		},

		/* Pop-up the date picker in a "dialog" box.
		 * @param  input element - ignored
		 * @param  date	string or Date - the initial date to display
		 * @param  onSelect  function - the function to call when a date is selected
		 * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
		 * @param  pos int[2] - coordinates for the dialog's position within the screen or
		 *					event - with x/y coordinates or
		 *					leave empty for default (screen centre)
		 * @return the manager object
		 */
		_dialogDatepicker: function(input, date, onSelect, settings, pos) {
			var id, browserWidth, browserHeight, scrollX, scrollY,
				inst = this._dialogInst; // internal instance

			if (!inst) {
				this.uuid += 1;
				id = "dp" + this.uuid;
				this._dialogInput = $("<input type='text' id='" + id +
					"' style='position: absolute; top: -100px; width: 0px;'/>");
				this._dialogInput.on("keydown", this._doKeyDown);
				$("body").append(this._dialogInput);
				inst = this._dialogInst = this._newInst(this._dialogInput, false);
				inst.settings = {};
				$.data(this._dialogInput[0], PROP_NAME, inst);
			}
			datepicker_extendRemove(inst.settings, settings || {});
			date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
			this._dialogInput.val(date);

			this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
			if (!this._pos) {
				browserWidth = document.documentElement.clientWidth;
				browserHeight = document.documentElement.clientHeight;
				scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				this._pos = // should use actual width/height below
				[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
			}

			// Move input on screen for focus, but hidden behind dialog
			this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
			inst.settings.onSelect = onSelect;
			this._inDialog = true;
			this.dpDiv.addClass(this._dialogClass);
			this._showDatepicker(this._dialogInput[0]);
			if ($.blockUI) {
				$.blockUI(this.dpDiv);
			}
			$.data(this._dialogInput[0], PROP_NAME, inst);
			return this;
		},

		/* Detach a datepicker from its control.
		 * @param  target	element - the target input field or division or span
		 */
		_destroyDatepicker: function(target) {
			var nodeName,
				$target = $(target),
				inst = $.data(target, PROP_NAME);

			if (!$target.hasClass(this.markerClassName)) {
				return;
			}

			nodeName = target.nodeName.toLowerCase();
			$.removeData(target, PROP_NAME);
			if (nodeName === "input") {
				inst.append.remove();
				inst.trigger.remove();
				$target.removeClass(this.markerClassName).
				off("focus", this._showDatepicker).
				off("keydown", this._doKeyDown).
				off("keypress", this._doKeyPress).
				off("keyup", this._doKeyUp);
			} else if (nodeName === "div" || nodeName === "span") {
				$target.removeClass(this.markerClassName).empty();
			}

			if (datepicker_instActive === inst) {
				datepicker_instActive = null;
				this._curInst = null;
			}
		},

		/* Enable the date picker to a jQuery selection.
		 * @param  target	element - the target input field or division or span
		 */
		_enableDatepicker: function(target) {
			var nodeName, inline,
				$target = $(target),
				inst = $.data(target, PROP_NAME);

			if (!$target.hasClass(this.markerClassName)) {
				return;
			}

			nodeName = target.nodeName.toLowerCase();
			if (nodeName === "input") {
				target.disabled = false;
				inst.trigger.filter("button").
				each(function() {
					this.disabled = false;
				}).end().
				filter("img").css({
					opacity: "1.0",
					cursor: ""
				});
			} else if (nodeName === "div" || nodeName === "span") {
				inline = $target.children("." + this._inlineClass);
				inline.children().removeClass("ui-state-disabled");
				inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", false);
			}
			this._disabledInputs = $.map(this._disabledInputs,

				// Delete entry

				function(value) {
					return (value === target ? null : value);
				});
		},

		/* Disable the date picker to a jQuery selection.
		 * @param  target	element - the target input field or division or span
		 */
		_disableDatepicker: function(target) {
			var nodeName, inline,
				$target = $(target),
				inst = $.data(target, PROP_NAME);

			if (!$target.hasClass(this.markerClassName)) {
				return;
			}

			nodeName = target.nodeName.toLowerCase();
			if (nodeName === "input") {
				target.disabled = true;
				inst.trigger.filter("button").
				each(function() {
					this.disabled = true;
				}).end().
				filter("img").css({
					opacity: "0.5",
					cursor: "default"
				});
			} else if (nodeName === "div" || nodeName === "span") {
				inline = $target.children("." + this._inlineClass);
				inline.children().addClass("ui-state-disabled");
				inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
				prop("disabled", true);
			}
			this._disabledInputs = $.map(this._disabledInputs,

				// Delete entry

				function(value) {
					return (value === target ? null : value);
				});
			this._disabledInputs[this._disabledInputs.length] = target;
		},

		/* Is the first field in a jQuery collection disabled as a datepicker?
		 * @param  target	element - the target input field or division or span
		 * @return boolean - true if disabled, false if enabled
		 */
		_isDisabledDatepicker: function(target) {
			if (!target) {
				return false;
			}
			for (var i = 0; i < this._disabledInputs.length; i++) {
				if (this._disabledInputs[i] === target) {
					return true;
				}
			}
			return false;
		},

		/* Retrieve the instance data for the target control.
		 * @param  target  element - the target input field or division or span
		 * @return  object - the associated instance data
		 * @throws  error if a jQuery problem getting data
		 */
		_getInst: function(target) {
			try {
				return $.data(target, PROP_NAME);
			} catch (err) {
				throw "Missing instance data for this datepicker";
			}
		},

		/* Update or retrieve the settings for a date picker attached to an input field or division.
		 * @param  target  element - the target input field or division or span
		 * @param  name	object - the new settings to update or
		 *				string - the name of the setting to change or retrieve,
		 *				when retrieving also "all" for all instance settings or
		 *				"defaults" for all global defaults
		 * @param  value   any - the new value for the setting
		 *				(omit if above is an object or to retrieve a value)
		 */
		_optionDatepicker: function(target, name, value) {
			var settings, date, minDate, maxDate,
				inst = this._getInst(target);

			if (arguments.length === 2 && typeof name === "string") {
				return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
					(inst ? (name === "all" ? $.extend({}, inst.settings) :
						this._get(inst, name)) : null));
			}

			settings = name || {};
			if (typeof name === "string") {
				settings = {};
				settings[name] = value;
			}

			if (inst) {
				if (this._curInst === inst) {
					this._hideDatepicker();
				}

				date = this._getDateDatepicker(target, true);
				minDate = this._getMinMaxDate(inst, "min");
				maxDate = this._getMinMaxDate(inst, "max");
				datepicker_extendRemove(inst.settings, settings);

				// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
				if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
					inst.settings.minDate = this._formatDate(inst, minDate);
				}
				if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
					inst.settings.maxDate = this._formatDate(inst, maxDate);
				}
				if ("disabled" in settings) {
					if (settings.disabled) {
						this._disableDatepicker(target);
					} else {
						this._enableDatepicker(target);
					}
				}
				this._attachments($(target), inst);
				this._autoSize(inst);
				this._setDate(inst, date);
				this._updateAlternate(inst);
				this._updateDatepicker(inst);
			}
		},

		// Change method deprecated
		_changeDatepicker: function(target, name, value) {
			this._optionDatepicker(target, name, value);
		},

		/* Redraw the date picker attached to an input field or division.
		 * @param  target  element - the target input field or division or span
		 */
		_refreshDatepicker: function(target) {
			var inst = this._getInst(target);
			if (inst) {
				this._updateDatepicker(inst);
			}
		},

		/* Set the dates for a jQuery selection.
		 * @param  target element - the target input field or division or span
		 * @param  date	Date - the new date
		 */
		_setDateDatepicker: function(target, date) {
			var inst = this._getInst(target);
			if (inst) {
				this._setDate(inst, date);
				this._updateDatepicker(inst);
				this._updateAlternate(inst);
			}
		},

		/* Get the date(s) for the first entry in a jQuery selection.
		 * @param  target element - the target input field or division or span
		 * @param  noDefault boolean - true if no default date is to be used
		 * @return Date - the current date
		 */
		_getDateDatepicker: function(target, noDefault) {
			var inst = this._getInst(target);
			if (inst && !inst.inline) {
				this._setDateFromField(inst, noDefault);
			}
			return (inst ? this._getDate(inst) : null);
		},

		/* Handle keystrokes. */
		_doKeyDown: function(event) {
			var onSelect, dateStr, sel,
				inst = $.datepicker._getInst(event.target),
				handled = true,
				isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

			inst._keyEvent = true;
			if ($.datepicker._datepickerShowing) {
				switch (event.keyCode) {
					case 9:
						$.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
					case 13:
						sel = $("td." + $.datepicker._dayOverClass + ":not(." +
							$.datepicker._currentClass + ")", inst.dpDiv);
						if (sel[0]) {
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
						}

						onSelect = $.datepicker._get(inst, "onSelect");
						if (onSelect) {
							dateStr = $.datepicker._formatDate(inst);

							// Trigger custom callback
							onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
						} else {
							$.datepicker._hideDatepicker();
						}

						return false; // don't submit the form
					case 27:
						$.datepicker._hideDatepicker();
						break; // hide on escape
					case 33:
						$.datepicker._adjustDate(event.target, (event.ctrlKey ? -$.datepicker._get(inst, "stepBigMonths") : -$.datepicker._get(inst, "stepMonths")), "M");
						break; // previous month/year on page up/+ ctrl
					case 34:
						$.datepicker._adjustDate(event.target, (event.ctrlKey ? +$.datepicker._get(inst, "stepBigMonths") : +$.datepicker._get(inst, "stepMonths")), "M");
						break; // next month/year on page down/+ ctrl
					case 35:
						if (event.ctrlKey || event.metaKey) {
							$.datepicker._clearDate(event.target);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
					case 36:
						if (event.ctrlKey || event.metaKey) {
							$.datepicker._gotoToday(event.target);
						}
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
					case 37:
						if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
						}
						handled = event.ctrlKey || event.metaKey;

						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ? -$.datepicker._get(inst, "stepBigMonths") : -$.datepicker._get(inst, "stepMonths")), "M");
						}

						// next month/year on alt +left on Mac
						break;
					case 38:
						if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, -7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
					case 39:
						if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
						}
						handled = event.ctrlKey || event.metaKey;

						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ? +$.datepicker._get(inst, "stepBigMonths") : +$.datepicker._get(inst, "stepMonths")), "M");
						}

						// next month/year on alt +right
						break;
					case 40:
						if (event.ctrlKey || event.metaKey) {
							$.datepicker._adjustDate(event.target, +7, "D");
						}
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
					default:
						handled = false;
				}
			} else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
				$.datepicker._showDatepicker(this);
			} else {
				handled = false;
			}

			if (handled) {
				event.preventDefault();
				event.stopPropagation();
			}
		},

		/* Filter entered characters - based on date format. */
		_doKeyPress: function(event) {
			var chars, chr,
				inst = $.datepicker._getInst(event.target);

			if ($.datepicker._get(inst, "constrainInput")) {
				chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
				chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
				return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
			}
		},

		/* Synchronise manual entry and field/alternate field. */
		_doKeyUp: function(event) {
			var date,
				inst = $.datepicker._getInst(event.target);

			if (inst.input.val() !== inst.lastVal) {
				try {
					date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"), (inst.input ? inst.input.val() : null),
						$.datepicker._getFormatConfig(inst));

					if (date) { // only if valid
						$.datepicker._setDateFromField(inst);
						$.datepicker._updateAlternate(inst);
						$.datepicker._updateDatepicker(inst);
					}
				} catch (err) {}
			}
			return true;
		},

		/* Pop-up the date picker for a given input field.
		 * If false returned from beforeShow event handler do not show.
		 * @param  input  element - the input field attached to the date picker or
		 *					event - if triggered by focus
		 */
		_showDatepicker: function(input) {
			input = input.target || input;
			if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
				input = $("input", input.parentNode)[0];
			}

			if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
				return;
			}

			var inst, beforeShow, beforeShowSettings, isFixed,
				offset, showAnim, duration;

			inst = $.datepicker._getInst(input);
			if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
				$.datepicker._curInst.dpDiv.stop(true, true);
				if (inst && $.datepicker._datepickerShowing) {
					$.datepicker._hideDatepicker($.datepicker._curInst.input[0]);
				}
			}

			beforeShow = $.datepicker._get(inst, "beforeShow");
			beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
			if (beforeShowSettings === false) {
				return;
			}
			datepicker_extendRemove(inst.settings, beforeShowSettings);

			inst.lastVal = null;
			$.datepicker._lastInput = input;
			$.datepicker._setDateFromField(inst);

			if ($.datepicker._inDialog) { // hide cursor
				input.value = "";
			}
			if (!$.datepicker._pos) { // position below input
				$.datepicker._pos = $.datepicker._findPos(input);
				$.datepicker._pos[1] += input.offsetHeight; // add the height
			}

			isFixed = false;
			$(input).parents().each(function() {
				isFixed |= $(this).css("position") === "fixed";
				return !isFixed;
			});

			offset = {
				left: $.datepicker._pos[0],
				top: $.datepicker._pos[1]
			};
			$.datepicker._pos = null;

			//to avoid flashes on Firefox
			inst.dpDiv.empty();

			// determine sizing offscreen
			inst.dpDiv.css({
				position: "absolute",
				display: "block",
				top: "-1000px"
			});
			$.datepicker._updateDatepicker(inst);

			// fix width for dynamic number of date pickers
			// and adjust position before showing
			offset = $.datepicker._checkOffset(inst, offset, isFixed);
			inst.dpDiv.css({
				position: ($.datepicker._inDialog && $.blockUI ?
					"static" : (isFixed ? "fixed" : "absolute")),
				display: "none",
				left: offset.left + "px",
				top: offset.top + "px"
			});

			if (!inst.inline) {
				showAnim = $.datepicker._get(inst, "showAnim");
				duration = $.datepicker._get(inst, "duration");
				inst.dpDiv.css("z-index", datepicker_getZindex($(input)) + 1);
				$.datepicker._datepickerShowing = true;

				if ($.effects && $.effects.effect[showAnim]) {
					inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
				} else {
					inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
				}

				if ($.datepicker._shouldFocusInput(inst)) {
					inst.input.trigger("focus");
				}

				$.datepicker._curInst = inst;
			}
		},

		/* Generate the date picker content. */
		_updateDatepicker: function(inst) {
			this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
			datepicker_instActive = inst; // for delegate hover events
			inst.dpDiv.empty().append(this._generateHTML(inst));
			this._attachHandlers(inst);

			var origyearshtml,
				numMonths = this._getNumberOfMonths(inst),
				cols = numMonths[1],
				width = 17,
				activeCell = inst.dpDiv.find("." + this._dayOverClass + " a"),
				onUpdateDatepicker = $.datepicker._get(inst, "onUpdateDatepicker");

			if (activeCell.length > 0) {
				datepicker_handleMouseover.apply(activeCell.get(0));
			}

			inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
			if (cols > 1) {
				inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
			}
			inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
				"Class"]("ui-datepicker-multi");
			inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
				"Class"]("ui-datepicker-rtl");

			if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput(inst)) {
				inst.input.trigger("focus");
			}

			// Deffered render of the years select (to avoid flashes on Firefox)
			if (inst.yearshtml) {
				origyearshtml = inst.yearshtml;
				setTimeout(function() {

					//assure that inst.yearshtml didn't change.
					if (origyearshtml === inst.yearshtml && inst.yearshtml) {
						inst.dpDiv.find("select.ui-datepicker-year").first().replaceWith(inst.yearshtml);
					}
					origyearshtml = inst.yearshtml = null;
				}, 0);
			}

			if (onUpdateDatepicker) {
				onUpdateDatepicker.apply((inst.input ? inst.input[0] : null), [inst]);
			}
		},

		// #6694 - don't focus the input if it's already focused
		// this breaks the change event in IE
		// Support: IE and jQuery <1.9
		_shouldFocusInput: function(inst) {
			return inst.input && inst.input.is(":visible") && !inst.input.is(":disabled") && !inst.input.is(":focus");
		},

		/* Check positioning to remain on screen. */
		_checkOffset: function(inst, offset, isFixed) {
			var dpWidth = inst.dpDiv.outerWidth(),
				dpHeight = inst.dpDiv.outerHeight(),
				inputWidth = inst.input ? inst.input.outerWidth() : 0,
				inputHeight = inst.input ? inst.input.outerHeight() : 0,
				viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
				viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

			offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
			offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
			offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

			// Now check if datepicker is showing outside window viewport - move to a better place if so.
			offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
				Math.abs(offset.left + dpWidth - viewWidth) : 0);
			offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
				Math.abs(dpHeight + inputHeight) : 0);

			return offset;
		},

		/* Find an object's position on the screen. */
		_findPos: function(obj) {
			var position,
				inst = this._getInst(obj),
				isRTL = this._get(inst, "isRTL");

			while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.pseudos.hidden(obj))) {
				obj = obj[isRTL ? "previousSibling" : "nextSibling"];
			}

			position = $(obj).offset();
			return [position.left, position.top];
		},

		/* Hide the date picker from view.
		 * @param  input  element - the input field attached to the date picker
		 */
		_hideDatepicker: function(input) {
			var showAnim, duration, postProcess, onClose,
				inst = this._curInst;

			if (!inst || (input && inst !== $.data(input, PROP_NAME))) {
				return;
			}

			if (this._datepickerShowing) {
				// ##### CUSTOMIZE [2013/06/11][yamashita] カレンダーを閉じる（日付選択や閉じる押下）時、テキストにフォーカスが移動するよう改修 [start] ####
				inst.input.trigger("focus");
				// ##### CUSTOMIZE [2013/06/11][yamashita] カレンダーを閉じる（日付選択や閉じる押下）時、テキストにフォーカスが移動するよう改修 [end] ####
				showAnim = this._get(inst, "showAnim");
				duration = this._get(inst, "duration");
				postProcess = function() {
					$.datepicker._tidyDialog(inst);
				};

				// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
				if ($.effects && ($.effects.effect[showAnim] || $.effects[showAnim])) {
					inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
				} else {
					inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
						(showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
				}

				if (!showAnim) {
					postProcess();
				}
				this._datepickerShowing = false;

				onClose = this._get(inst, "onClose");
				if (onClose) {
					onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
				}

				this._lastInput = null;
				if (this._inDialog) {
					this._dialogInput.css({
						position: "absolute",
						left: "0",
						top: "-100px"
					});
					if ($.blockUI) {
						$.unblockUI();
						$("body").append(this.dpDiv);
					}
				}
				this._inDialog = false;
			}
		},

		/* Tidy up after a dialog display. */
		_tidyDialog: function(inst) {
			inst.dpDiv.removeClass(this._dialogClass).off(".ui-datepicker-calendar");
		},

		/* Close date picker if clicked elsewhere. */
		_checkExternalClick: function(event) {
			if (!$.datepicker._curInst) {
				return;
			}

			var $target = $(event.target),
				inst = $.datepicker._getInst($target[0]);

			if ((($target[0].id !== $.datepicker._mainDivId &&
					$target.parents("#" + $.datepicker._mainDivId).length === 0 && !$target.hasClass($.datepicker.markerClassName) && !$target.closest("." + $.datepicker._triggerClass).length &&
					$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI))) ||
				($target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst)) {
				$.datepicker._hideDatepicker();
			}
		},

		/* Adjust one of the date sub-fields. */
		_adjustDate: function(id, offset, period) {
			var target = $(id),
				inst = this._getInst(target[0]);

			if (this._isDisabledDatepicker(target[0])) {
				return;
			}
			this._adjustInstDate(inst, offset, period);
			this._updateDatepicker(inst);
		},

		/* Action for current link. */
		_gotoToday: function(id) {
			var date,
				target = $(id),
				inst = this._getInst(target[0]);

			if (this._get(inst, "gotoCurrent") && inst.currentDay) {
				inst.selectedDay = inst.currentDay;
				inst.drawMonth = inst.selectedMonth = inst.currentMonth;
				inst.drawYear = inst.selectedYear = inst.currentYear;
			} else {
				date = new Date();
				inst.selectedDay = date.getDate();
				inst.drawMonth = inst.selectedMonth = date.getMonth();
				inst.drawYear = inst.selectedYear = date.getFullYear();
			}
			this._notifyChange(inst);
			this._adjustDate(target);
		},

		/* Action for selecting a new month/year. */
		_selectMonthYear: function(id, select, period) {
			var target = $(id),
				inst = this._getInst(target[0]);

			inst["selected" + (period === "M" ? "Month" : "Year")] =
				inst["draw" + (period === "M" ? "Month" : "Year")] =
				parseInt(select.options[select.selectedIndex].value, 10);

			this._notifyChange(inst);
			this._adjustDate(target);
		},

		/* Action for selecting a day. */
		_selectDay: function(id, month, year, td) {
			var inst,
				target = $(id);

			if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
				return;
			}

			inst = this._getInst(target[0]);
			inst.selectedDay = inst.currentDay = parseInt($("a", td).attr("data-date"));
			inst.selectedMonth = inst.currentMonth = month;
			inst.selectedYear = inst.currentYear = year;
			this._selectDate(id, this._formatDate(inst,
				inst.currentDay, inst.currentMonth, inst.currentYear));
		},

		/* Erase the input field and hide the date picker. */
		_clearDate: function(id) {
			var target = $(id);
			this._selectDate(target, "");
		},

		/* Update the input field with the selected date. */
		_selectDate: function(id, dateStr) {
			var onSelect,
				target = $(id),
				inst = this._getInst(target[0]);

			dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
			if (inst.input) {
				inst.input.val(dateStr);
			}
			this._updateAlternate(inst);

			onSelect = this._get(inst, "onSelect");
			if (onSelect) {
				onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]); // trigger custom callback
			} else if (inst.input) {
				inst.input.trigger("change"); // fire the change event
			}

			if (inst.inline) {
				this._updateDatepicker(inst);
			} else {
				this._hideDatepicker();
				this._lastInput = inst.input[0];
				if (typeof(inst.input[0]) !== "object") {
					inst.input.trigger("focus"); // restore focus
				}
				this._lastInput = null;
			}
		},

		/* Update any alternate field to synchronise with the main field. */
		_updateAlternate: function(inst) {
			var altFormat, date, dateStr,
				altField = this._get(inst, "altField");

			if (altField) { // update alternate field too
				altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
				date = this._getDate(inst);
				dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
				$(document).find(altField).val(dateStr);
			}
		},

		/* Set as beforeShowDay function to prevent selection of weekends.
		 * @param  date  Date - the date to customise
		 * @return [boolean, string] - is this date selectable?, what is its CSS class?
		 */
		noWeekends: function(date) {
			var day = date.getDay();
			return [(day > 0 && day < 6), ""];
		},

		/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
		 * @param  date  Date - the date to get the week for
		 * @return  number - the number of the week within the year that contains this date
		 */
		iso8601Week: function(date) {
			var time,
				checkDate = new Date(date.getTime());

			// Find Thursday of this week starting on Monday
			checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

			time = checkDate.getTime();
			checkDate.setMonth(0); // Compare with Jan 1
			checkDate.setDate(1);
			return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
		},

		/* Parse a string value into a date object.
		 * See formatDate below for the possible formats.
		 *
		 * @param  format string - the expected format of the date
		 * @param  value string - the date in the above format
		 * @param  settings Object - attributes include:
		 *					shortYearCutoff  number - the cutoff year for determining the century (optional)
		 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
		 *					dayNames		string[7] - names of the days from Sunday (optional)
		 *					monthNamesShort string[12] - abbreviated names of the months (optional)
		 *					monthNames		string[12] - names of the months (optional)
		 * @return  Date - the extracted date value or null if value is blank
		 */
		parseDate: function(format, value, settings) {
			if (format == null || value == null) {
				throw "Invalid arguments";
			}

			value = (typeof value === "object" ? value.toString() : value + "");
			if (value === "") {
				return null;
			}

			var iFormat, dim, extra,
				iValue = 0,
				shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
				shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
					new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
				dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
				dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
				monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
				monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
				year = -1,
				month = -1,
				day = -1,
				doy = -1,
				literal = false,
				date,

				// Check whether a format character is doubled
				lookAhead = function(match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
					if (matches) {
						iFormat++;
					}
					return matches;
				},

				// Extract a number from the string value
				getNumber = function(match) {
					var isDoubled = lookAhead(match),
						size = (match === "@" ? 14 : (match === "!" ? 20 :
							(match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
						minSize = (match === "y" ? size : 1),
						digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
						num = value.substring(iValue).match(digits);
					if (!num) {
						throw "Missing number at position " + iValue;
					}
					iValue += num[0].length;
					return parseInt(num[0], 10);
				},

				// Extract a name from the string value and convert to an index
				getName = function(match, shortNames, longNames) {
					var index = -1,
						names = $.map(lookAhead(match) ? longNames : shortNames, function(v, k) {
							return [[k, v]];
						}).sort(function(a, b) {
							return -(a[1].length - b[1].length);
						});

					$.each(names, function(i, pair) {
						var name = pair[1];
						if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
							index = pair[0];
							iValue += name.length;
							return false;
						}
					});
					if (index !== -1) {
						return index + 1;
					} else {
						throw "Unknown name at position " + iValue;
					}
				},

				// Confirm that a literal character matches the string value
				checkLiteral = function() {
					if (value.charAt(iValue) !== format.charAt(iFormat)) {
						throw "Unexpected literal at position " + iValue;
					}
					iValue++;
				};

			for (iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal) {
					if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
						literal = false;
					} else {
						checkLiteral();
					}
				} else {
					switch (format.charAt(iFormat)) {
						case "d":
							day = getNumber("d");
							break;
						case "D":
							getName("D", dayNamesShort, dayNames);
							break;
						case "o":
							doy = getNumber("o");
							break;
						case "m":
							month = getNumber("m");
							break;
						case "M":
							month = getName("M", monthNamesShort, monthNames);
							break;
						case "y":
							year = getNumber("y");
							break;
						case "@":
							date = new Date(getNumber("@"));
							year = date.getFullYear();
							month = date.getMonth() + 1;
							day = date.getDate();
							break;
						case "!":
							date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
							year = date.getFullYear();
							month = date.getMonth() + 1;
							day = date.getDate();
							break;
						case "'":
							if (lookAhead("'")) {
								checkLiteral();
							} else {
								literal = true;
							}
							break;
						default:
							checkLiteral();
					}
				}
			}

			if (iValue < value.length) {
				extra = value.substr(iValue);
				if (!/^\s+/.test(extra)) {
					throw "Extra/unparsed characters found in date: " + extra;
				}
			}

			if (year === -1) {
				year = new Date().getFullYear();
			} else if (year < 100) {
				year += new Date().getFullYear() - new Date().getFullYear() % 100 +
					(year <= shortYearCutoff ? 0 : -100);
			}

			if (doy > -1) {
				month = 1;
				day = doy;
				do {
					dim = this._getDaysInMonth(year, month - 1);
					if (day <= dim) {
						break;
					}
					month++;
					day -= dim;
				} while (true);
			}

			date = this._daylightSavingAdjust(new Date(year, month - 1, day));
			if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
				throw "Invalid date"; // E.g. 31/02/00
			}
			return date;
		},

		/* Standard date formats. */
		ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
		COOKIE: "D, dd M yy",
		ISO_8601: "yy-mm-dd",
		RFC_822: "D, d M y",
		RFC_850: "DD, dd-M-y",
		RFC_1036: "D, d M y",
		RFC_1123: "D, d M yy",
		RFC_2822: "D, d M yy",
		RSS: "D, d M y", // RFC 822
		TICKS: "!",
		TIMESTAMP: "@",
		W3C: "yy-mm-dd", // ISO 8601

		_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
			Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

		/* Format a date object into a string value.
		 * The format can be combinations of the following:
		 * d  - day of month (no leading zero)
		 * dd - day of month (two digit)
		 * o  - day of year (no leading zeros)
		 * oo - day of year (three digit)
		 * D  - day name short
		 * DD - day name long
		 * m  - month of year (no leading zero)
		 * mm - month of year (two digit)
		 * M  - month name short
		 * MM - month name long
		 * y  - year (two digit)
		 * yy - year (four digit)
		 * @ - Unix timestamp (ms since 01/01/1970)
		 * ! - Windows ticks (100ns since 01/01/0001)
		 * "..." - literal text
		 * '' - single quote
		 *
		 * @param  format string - the desired format of the date
		 * @param  date Date - the date value to format
		 * @param  settings Object - attributes include:
		 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
		 *					dayNames		string[7] - names of the days from Sunday (optional)
		 *					monthNamesShort string[12] - abbreviated names of the months (optional)
		 *					monthNames		string[12] - names of the months (optional)
		 * @return  string - the date in the above format
		 */
		formatDate: function(format, date, settings) {
			if (!date) {
				return "";
			}

			var iFormat,
				dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
				dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
				monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
				monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,

				// Check whether a format character is doubled
				lookAhead = function(match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
					if (matches) {
						iFormat++;
					}
					return matches;
				},

				// Format a number, with leading zero if necessary
				formatNumber = function(match, value, len) {
					var num = "" + value;
					if (lookAhead(match)) {
						while (num.length < len) {
							num = "0" + num;
						}
					}
					return num;
				},

				// Format a name, short or long as requested
				formatName = function(match, value, shortNames, longNames) {
					return (lookAhead(match) ? longNames[value] : shortNames[value]);
				},
				output = "",
				literal = false;

			if (date) {
				for (iFormat = 0; iFormat < format.length; iFormat++) {
					if (literal) {
						if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
							literal = false;
						} else {
							output += format.charAt(iFormat);
						}
					} else {
						switch (format.charAt(iFormat)) {
							case "d":
								output += formatNumber("d", date.getDate(), 2);
								break;
							case "D":
								output += formatName("D", date.getDay(), dayNamesShort, dayNames);
								break;
							case "o":
								output += formatNumber("o",
									Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
								break;
							case "m":
								output += formatNumber("m", date.getMonth() + 1, 2);
								break;
							case "M":
								//#### CUSTOMIZE [2013/06/13][yamashita] 返却値をmonthNamesにするよう改修 [start] ####
								// output += formatName( "M", date.getMonth(), monthNamesShort, monthNames );
								output += formatName("M", date.getMonth(), monthNames, monthNames);
								//#### CUSTOMIZE [2013/06/13][yamashita] 返却値をmonthNamesにするよう改修 [end] ####
								break;
							case "y":
								output += (lookAhead("y") ? date.getFullYear() :
									(date.getFullYear() % 100 < 10 ? "0" : "") + date.getFullYear() % 100);
								break;
							case "@":
								output += date.getTime();
								break;
							case "!":
								output += date.getTime() * 10000 + this._ticksTo1970;
								break;
							case "'":
								if (lookAhead("'")) {
									output += "'";
								} else {
									literal = true;
								}
								break;
							default:
								output += format.charAt(iFormat);
						}
					}
				}
			}
			return output;
		},

		/* Extract all possible characters from the date format. */
		_possibleChars: function(format) {
			var iFormat,
				chars = "",
				literal = false,

				// Check whether a format character is doubled
				lookAhead = function(match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
					if (matches) {
						iFormat++;
					}
					return matches;
				};

			for (iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal) {
					if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
						literal = false;
					} else {
						chars += format.charAt(iFormat);
					}
				} else {
					switch (format.charAt(iFormat)) {
						case "d":
						case "m":
						case "y":
						case "@":
							chars += "0123456789";
							break;
						case "D":
						case "M":
							return null; // Accept anything
						case "'":
							if (lookAhead("'")) {
								chars += "'";
							} else {
								literal = true;
							}
							break;
						default:
							chars += format.charAt(iFormat);
					}
				}
			}
			return chars;
		},

		/* Get a setting value, defaulting if necessary. */
		_get: function(inst, name) {
			return inst.settings[name] !== undefined ?
				inst.settings[name] : this._defaults[name];
		},

		/* Parse existing date and initialise date picker. */
		_setDateFromField: function(inst, noDefault) {
			if (inst.input.val() === inst.lastVal) {
				return;
			}

			var dateFormat = this._get(inst, "dateFormat"),
				dates = inst.lastVal = inst.input ? inst.input.val() : null,
				defaultDate = this._getDefaultDate(inst),
				date = defaultDate,
				settings = this._getFormatConfig(inst);

			try {
				date = this.parseDate(dateFormat, dates, settings) || defaultDate;
			} catch (event) {
				dates = (noDefault ? "" : dates);
			}
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
			inst.currentDay = (dates ? date.getDate() : 0);
			inst.currentMonth = (dates ? date.getMonth() : 0);
			inst.currentYear = (dates ? date.getFullYear() : 0);
			this._adjustInstDate(inst);
		},

		/* Retrieve the default date shown on opening. */
		_getDefaultDate: function(inst) {
			return this._restrictMinMax(inst,
				this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
		},

		/* A date may be specified as an exact value or a relative one. */
		_determineDate: function(inst, date, defaultDate) {
			var offsetNumeric = function(offset) {
				var date = new Date();
				date.setDate(date.getDate() + offset);
				return date;
			},
				offsetString = function(offset) {
					try {
						return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
							offset, $.datepicker._getFormatConfig(inst));
					} catch (e) {

						// Ignore
					}

					var date = (offset.toLowerCase().match(/^c/) ?
						$.datepicker._getDate(inst) : null) || new Date(),
						year = date.getFullYear(),
						month = date.getMonth(),
						day = date.getDate(),
						pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
						matches = pattern.exec(offset);

					while (matches) {
						switch (matches[2] || "d") {
							case "d":
							case "D":
								day += parseInt(matches[1], 10);
								break;
							case "w":
							case "W":
								day += parseInt(matches[1], 10) * 7;
								break;
							case "m":
							case "M":
								month += parseInt(matches[1], 10);
								day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
								break;
							case "y":
							case "Y":
								year += parseInt(matches[1], 10);
								day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
								break;
						}
						matches = pattern.exec(offset);
					}
					return new Date(year, month, day);
				},
				newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
					(typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

			newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
			if (newDate) {
				newDate.setHours(0);
				newDate.setMinutes(0);
				newDate.setSeconds(0);
				newDate.setMilliseconds(0);
			}
			return this._daylightSavingAdjust(newDate);
		},

		/* Handle switch to/from daylight saving.
		 * Hours may be non-zero on daylight saving cut-over:
		 * > 12 when midnight changeover, but then cannot generate
		 * midnight datetime, so jump to 1AM, otherwise reset.
		 * @param  date  (Date) the date to check
		 * @return  (Date) the corrected date
		 */
		_daylightSavingAdjust: function(date) {
			if (!date) {
				return null;
			}
			date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
			return date;
		},

		/* Set the date(s) directly. */
		_setDate: function(inst, date, noChange) {
			var clear = !date,
				origMonth = inst.selectedMonth,
				origYear = inst.selectedYear,
				newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

			inst.selectedDay = inst.currentDay = newDate.getDate();
			inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
			inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
			if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
				this._notifyChange(inst);
			}
			this._adjustInstDate(inst);
			if (inst.input) {
				inst.input.val(clear ? "" : this._formatDate(inst));
			}
		},

		/* Retrieve the date(s) directly. */
		_getDate: function(inst) {
			var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
				this._daylightSavingAdjust(new Date(
					inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
		},

		/* Attach the onxxx handlers.  These are declared statically so
		 * they work with static code transformers like Caja.
		 */
		_attachHandlers: function(inst) {
			var stepMonths = this._get(inst, "stepMonths"),
				id = "#" + inst.id.replace(/\\\\/g, "\\");
			inst.dpDiv.find("[data-handler]").map(function() {
				var handler = {
					prev: function() {
						$.datepicker._adjustDate(id, -stepMonths, "M");
					},
					next: function() {
						$.datepicker._adjustDate(id, +stepMonths, "M");
					},
					hide: function() {
						$.datepicker._hideDatepicker();
					},
					today: function() {
						$.datepicker._gotoToday(id);
					},
					selectDay: function() {
						$.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
						return false;
					},
					selectMonth: function() {
						$.datepicker._selectMonthYear(id, this, "M");
						return false;
					},
					selectYear: function() {
						$.datepicker._selectMonthYear(id, this, "Y");
						return false;
					}
				};
				$(this).on(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
			});
		},

		/* Generate the HTML for the current state of the date picker. */
		_generateHTML: function(inst) {
			var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
				controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
				monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
				selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
				cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
				printDate, dRow, tbody, daySettings, otherMonth, unselectable,
				tempDate = new Date(),
				today = this._daylightSavingAdjust(
					new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
				isRTL = this._get(inst, "isRTL"),
				showButtonPanel = this._get(inst, "showButtonPanel"),
				hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
				navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
				numMonths = this._getNumberOfMonths(inst),
				showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
				stepMonths = this._get(inst, "stepMonths"),
				isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
				currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
					new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
				minDate = this._getMinMaxDate(inst, "min"),
				maxDate = this._getMinMaxDate(inst, "max"),
				drawMonth = inst.drawMonth - showCurrentAtPos,
				drawYear = inst.drawYear;

			if (drawMonth < 0) {
				drawMonth += 12;
				drawYear--;
			}
			if (maxDate) {
				maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
					maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
				maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
				while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
					drawMonth--;
					if (drawMonth < 0) {
						drawMonth = 11;
						drawYear--;
					}
				}
			}
			inst.drawMonth = drawMonth;
			inst.drawYear = drawYear;

			prevText = this._get(inst, "prevText");
			prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
				this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
				this._getFormatConfig(inst)));

			if (this._canAdjustMonth(inst, -1, drawYear, drawMonth)) {
				prev = $("<a>")
					.attr({
						"class": "ui-datepicker-prev ui-corner-all",
						"data-handler": "prev",
						"data-event": "click",
						title: prevText
					})
					.append(
						$("<span>")
						.addClass("ui-icon ui-icon-circle-triangle-" +
							(isRTL ? "e" : "w"))
						.text(prevText)
				)[0].outerHTML;
			} else if (hideIfNoPrevNext) {
				prev = "";
			} else {
				prev = $("<a>")
					.attr({
						"class": "ui-datepicker-prev ui-corner-all ui-state-disabled",
						title: prevText
					})
					.append(
						$("<span>")
						.addClass("ui-icon ui-icon-circle-triangle-" +
							(isRTL ? "e" : "w"))
						.text(prevText)
				)[0].outerHTML;
			}

			nextText = this._get(inst, "nextText");
			nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
				this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
				this._getFormatConfig(inst)));

			if (this._canAdjustMonth(inst, +1, drawYear, drawMonth)) {
				next = $("<a>")
					.attr({
						"class": "ui-datepicker-next ui-corner-all",
						"data-handler": "next",
						"data-event": "click",
						title: nextText
					})
					.append(
						$("<span>")
						.addClass("ui-icon ui-icon-circle-triangle-" +
							(isRTL ? "w" : "e"))
						.text(nextText)
				)[0].outerHTML;
			} else if (hideIfNoPrevNext) {
				next = "";
			} else {
				next = $("<a>")
					.attr({
						"class": "ui-datepicker-next ui-corner-all ui-state-disabled",
						title: nextText
					})
					.append(
						$("<span>")
						.attr("class", "ui-icon ui-icon-circle-triangle-" +
							(isRTL ? "w" : "e"))
						.text(nextText)
				)[0].outerHTML;
			}

			currentText = this._get(inst, "currentText");
			gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
			currentText = (!navigationAsDateFormat ? currentText :
				this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

			controls = "";
			if (!inst.inline) {
				controls = $("<button>")
					.attr({
						type: "button",
						"class": "ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all",
						"data-handler": "hide",
						"data-event": "click"
					})
					.text(this._get(inst, "closeText"))[0].outerHTML;
			}

			buttonPanel = "";
			if (showButtonPanel) {
				buttonPanel = $("<div class='ui-datepicker-buttonpane ui-widget-content'>")
					.append(isRTL ? controls : "")
					.append(this._isInRange(inst, gotoDate) ?
						$("<button>")
						.attr({
							type: "button",
							"class": "ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all",
							"data-handler": "today",
							"data-event": "click"
						})
						.text(currentText) :
						"")
					.append(isRTL ? "" : controls)[0].outerHTML;
			}

			firstDay = parseInt(this._get(inst, "firstDay"), 10);
			firstDay = (isNaN(firstDay) ? 0 : firstDay);

			showWeek = this._get(inst, "showWeek");
			dayNames = this._get(inst, "dayNames");
			dayNamesMin = this._get(inst, "dayNamesMin");
			monthNames = this._get(inst, "monthNames");
			monthNamesShort = this._get(inst, "monthNamesShort");
			beforeShowDay = this._get(inst, "beforeShowDay");
			showOtherMonths = this._get(inst, "showOtherMonths");
			selectOtherMonths = this._get(inst, "selectOtherMonths");
			defaultDate = this._getDefaultDate(inst);
			html = "";

			for (row = 0; row < numMonths[0]; row++) {
				group = "";
				this.maxRows = 4;
				for (col = 0; col < numMonths[1]; col++) {
					selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
					cornerClass = " ui-corner-all";
					calender = "";
					if (isMultiMonth) {
						calender += "<div class='ui-datepicker-group";
						if (numMonths[1] > 1) {
							switch (col) {
								case 0:
									calender += " ui-datepicker-group-first";
									cornerClass = " ui-corner-" + (isRTL ? "right" : "left");
									break;
								case numMonths[1] - 1:
									calender += " ui-datepicker-group-last";
									cornerClass = " ui-corner-" + (isRTL ? "left" : "right");
									break;
								default:
									calender += " ui-datepicker-group-middle";
									cornerClass = "";
									break;
							}
						}
						calender += "'>";
					}
					calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
						(/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
						(/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
						this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
							row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
					"</div><table class='ui-datepicker-calendar'><thead>" +
						"<tr>";
					thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
					for (dow = 0; dow < 7; dow++) { // days of the week
						day = (dow + firstDay) % 7;
						thead += "<th scope='col'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
							"<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
					}
					calender += thead + "</tr></thead><tbody>";
					daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
					if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
						inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
					}
					leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
					curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
					numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
					this.maxRows = numRows;
					printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
					for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
						calender += "<tr>";
						tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
							this._get(inst, "calculateWeek")(printDate) + "</td>");
						for (dow = 0; dow < 7; dow++) { // create date picker days
							daySettings = (beforeShowDay ?
								beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
							otherMonth = (printDate.getMonth() !== drawMonth);
							unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
								(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
							tbody += "<td class='" +
								((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
							(otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
							((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
								(defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?

								// or defaultDate is current printedDate and defaultDate is selectedDate
								" " + this._dayOverClass : "") + // highlight selected day
							(unselectable ? " " + this._unselectableClass + " ui-state-disabled" : "") + // highlight unselectable days
							(otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
								(printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
								(printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
							((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
							(unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
							(otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
								(unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
									(printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
									(printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
									(otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
									"' href='#' aria-current='" + (printDate.getTime() === currentDate.getTime() ? "true" : "false") + // mark date as selected for screen reader
									"' data-date='" + printDate.getDate() + // store date as data
									"'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
							printDate.setDate(printDate.getDate() + 1);
							printDate = this._daylightSavingAdjust(printDate);
						}
						calender += tbody + "</tr>";
					}
					drawMonth++;
					if (drawMonth > 11) {
						drawMonth = 0;
						drawYear++;
					}
					calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
						((numMonths[0] > 0 && col === numMonths[1] - 1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
					group += calender;
				}
				html += group;
			}
			html += buttonPanel;
			inst._keyEvent = false;
			return html;
		},

		/* Generate the month and year header. */
		_generateMonthYearHeader: function(inst, drawMonth, drawYear, minDate, maxDate,
			secondary, monthNames, monthNamesShort) {

			var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
				changeMonth = this._get(inst, "changeMonth"),
				changeYear = this._get(inst, "changeYear"),
				showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
				selectMonthLabel = this._get(inst, "selectMonthLabel"),
				selectYearLabel = this._get(inst, "selectYearLabel"),
				html = "<div class='ui-datepicker-title'>",
				monthHtml = "";

			// Month selection
			if (secondary || !changeMonth) {
				//#### CUSTOMIZE [2013/06/11][yamashita] ショートネームで統一 [start] ####
				// monthHtml += "<span class='ui-datepicker-month'>" + monthNames[ drawMonth ] + "</span>";
				monthHtml += "<span class='ui-datepicker-month'>" + monthNamesShort[drawMonth] + "</span>";
				//#### CUSTOMIZE [2013/06/11][yamashita] ショートネームで統一 [end] ####
			} else {
				inMinYear = (minDate && minDate.getFullYear() === drawYear);
				inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
				monthHtml += "<select class='ui-datepicker-month' aria-label='" + selectMonthLabel + "' data-handler='selectMonth' data-event='change'>";
				for (month = 0; month < 12; month++) {
					if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
						monthHtml += "<option value='" + month + "'" +
							(month === drawMonth ? " selected='selected'" : "") +
							">" + monthNamesShort[month] + "</option>";
					}
				}
				monthHtml += "</select>";
			}

			if (!showMonthAfterYear) {
				html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
			}

			// Year selection
			if (!inst.yearshtml) {
				inst.yearshtml = "";
				if (secondary || !changeYear) {
					html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
				} else {

					// determine range of years to display
					years = this._get(inst, "yearRange").split(":");
					thisYear = new Date().getFullYear();
					determineYear = function(value) {
						var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
							(value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
								parseInt(value, 10)));
						return (isNaN(year) ? thisYear : year);
					};
					year = determineYear(years[0]);
					endYear = Math.max(year, determineYear(years[1] || ""));
					year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
					endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
					inst.yearshtml += "<select class='ui-datepicker-year' aria-label='" + selectYearLabel + "' data-handler='selectYear' data-event='change'>";
					for (; year <= endYear; year++) {
						inst.yearshtml += "<option value='" + year + "'" +
							(year === drawYear ? " selected='selected'" : "") +
							">" + year + "</option>";
					}
					inst.yearshtml += "</select>";

					html += inst.yearshtml;
					inst.yearshtml = null;
				}
			}

			html += this._get(inst, "yearSuffix");
			if (showMonthAfterYear) {
				html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
			}
			html += "</div>"; // Close datepicker_header
			return html;
		},

		/* Adjust one of the date sub-fields. */
		_adjustInstDate: function(inst, offset, period) {
			var year = inst.selectedYear + (period === "Y" ? offset : 0),
				month = inst.selectedMonth + (period === "M" ? offset : 0),
				day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
				date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
			if (period === "M" || period === "Y") {
				this._notifyChange(inst);
			}
		},

		/* Ensure a date is within any min/max bounds. */
		_restrictMinMax: function(inst, date) {
			var minDate = this._getMinMaxDate(inst, "min"),
				maxDate = this._getMinMaxDate(inst, "max"),
				newDate = (minDate && date < minDate ? minDate : date);
			return (maxDate && newDate > maxDate ? maxDate : newDate);
		},

		/* Notify change of month/year. */
		_notifyChange: function(inst) {
			var onChange = this._get(inst, "onChangeMonthYear");
			if (onChange) {
				onChange.apply((inst.input ? inst.input[0] : null), [inst.selectedYear, inst.selectedMonth + 1, inst]);
			}
		},

		/* Determine the number of months to show. */
		_getNumberOfMonths: function(inst) {
			var numMonths = this._get(inst, "numberOfMonths");
			return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
		},

		/* Determine the current maximum date - ensure no time components are set. */
		_getMinMaxDate: function(inst, minMax) {
			return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
		},

		/* Find the number of days in a given month. */
		_getDaysInMonth: function(year, month) {
			return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
		},

		/* Find the day of the week of the first of a month. */
		_getFirstDayOfMonth: function(year, month) {
			return new Date(year, month, 1).getDay();
		},

		/* Determines if we should allow a "next/prev" month display change. */
		_canAdjustMonth: function(inst, offset, curYear, curMonth) {
			var numMonths = this._getNumberOfMonths(inst),
				date = this._daylightSavingAdjust(new Date(curYear,
					curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

			if (offset < 0) {
				date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
			}
			return this._isInRange(inst, date);
		},

		/* Is the given date in the accepted range? */
		_isInRange: function(inst, date) {
			var yearSplit, currentYear,
				minDate = this._getMinMaxDate(inst, "min"),
				maxDate = this._getMinMaxDate(inst, "max"),
				minYear = null,
				maxYear = null,
				years = this._get(inst, "yearRange");
			if (years) {
				yearSplit = years.split(":");
				currentYear = new Date().getFullYear();
				minYear = parseInt(yearSplit[0], 10);
				maxYear = parseInt(yearSplit[1], 10);
				if (yearSplit[0].match(/[+\-].*/)) {
					minYear += currentYear;
				}
				if (yearSplit[1].match(/[+\-].*/)) {
					maxYear += currentYear;
				}
			}

			return ((!minDate || date.getTime() >= minDate.getTime()) &&
				(!maxDate || date.getTime() <= maxDate.getTime()) &&
				(!minYear || date.getFullYear() >= minYear) &&
				(!maxYear || date.getFullYear() <= maxYear));
		},

		/* Provide the configuration settings for formatting/parsing. */
		_getFormatConfig: function(inst) {
			var shortYearCutoff = this._get(inst, "shortYearCutoff");
			shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
				new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
			return {
				shortYearCutoff: shortYearCutoff,
				dayNamesShort: this._get(inst, "dayNamesShort"),
				dayNames: this._get(inst, "dayNames"),
				monthNamesShort: this._get(inst, "monthNamesShort"),
				monthNames: this._get(inst, "monthNames")
			};
		},

		/* Format the given date for display. */
		_formatDate: function(inst, day, month, year) {
			if (!day) {
				inst.currentDay = inst.selectedDay;
				inst.currentMonth = inst.selectedMonth;
				inst.currentYear = inst.selectedYear;
			}
			var date = (day ? (typeof day === "object" ? day :
					this._daylightSavingAdjust(new Date(year, month, day))) :
				this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
			return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
		}
	});

	/*
	 * Bind hover events for datepicker elements.
	 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
	 * Global datepicker_instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
	 */

	function datepicker_bindHover(dpDiv) {
		var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
		return dpDiv.on("mouseout", selector, function() {
			$(this).removeClass("ui-state-hover");
			if (this.className.indexOf("ui-datepicker-prev") !== -1) {
				$(this).removeClass("ui-datepicker-prev-hover");
			}
			if (this.className.indexOf("ui-datepicker-next") !== -1) {
				$(this).removeClass("ui-datepicker-next-hover");
			}
		})
			.on("mouseover", selector, datepicker_handleMouseover);
	}

	function datepicker_handleMouseover() {
		if (!$.datepicker._isDisabledDatepicker(datepicker_instActive.inline ? datepicker_instActive.dpDiv.parent()[0] : datepicker_instActive.input[0])) {
			$(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
			$(this).addClass("ui-state-hover");
			if (this.className.indexOf("ui-datepicker-prev") !== -1) {
				$(this).addClass("ui-datepicker-prev-hover");
			}
			if (this.className.indexOf("ui-datepicker-next") !== -1) {
				$(this).addClass("ui-datepicker-next-hover");
			}
		}
	}

	/* jQuery extend now ignores nulls! */

	function datepicker_extendRemove(target, props) {
		$.extend(target, props);
		for (var name in props) {
			if (props[name] == null) {
				target[name] = props[name];
			}
		}
		return target;
	}

	/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
					Object - settings for attaching new datepicker functionality
   @return  jQuery object */
	$.fn.datepicker = function(options) {

		/* Verify an empty collection wasn't passed - Fixes #6976 */
		if (!this.length) {
			return this;
		}

		/* Initialise the date picker. */
		if (!$.datepicker.initialized) {
			$(document).on("mousedown", $.datepicker._checkExternalClick);
			$.datepicker.initialized = true;
		}

		/* Append datepicker main container to body if not exist. */
		if ($("#" + $.datepicker._mainDivId).length === 0) {
			$("body").append($.datepicker.dpDiv);
		}

		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
			return $.datepicker["_" + options + "Datepicker"].
			apply($.datepicker, [this[0]].concat(otherArgs));
		}
		if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
			return $.datepicker["_" + options + "Datepicker"].
			apply($.datepicker, [this[0]].concat(otherArgs));
		}
		return this.each(function() {
			if (typeof options === "string") {
				$.datepicker["_" + options + "Datepicker"]
					.apply($.datepicker, [this].concat(otherArgs));
			} else {
				$.datepicker._attachDatepicker(this, options);
			}
		});
	};

	$.datepicker = new Datepicker(); // singleton instance
	$.datepicker.initialized = false;
	$.datepicker.uuid = new Date().getTime();
	$.datepicker.version = "1.13.0";

})(jQuery);
/**
 * jQuery UI dialog patch
 *
 * @author kikuchi 2013/11/13
 * @since 3.12.0
 */
/*!
 * jQuery UI Dialog 1.13.0
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
(function($, undefined) {
	if ($.ui && $.ui.dialog) {
		$.widget('ui.dialog', $.ui.dialog, {
			_createOverlay: function() {
				if (!this.options.modal) {
					return;
				}

				var jqMinor = $.fn.jquery.substring(0, 4);

				// We use a delay in case the overlay is created from an
				// event that we're going to be cancelling (#2804)
				var isOpening = true;
				this._delay(function() {
					isOpening = false;
				});

				if (!this.document.data('ui-dialog-overlays')) {

					// Prevent use of anchors and inputs
					// This doesn't use `_on()` because it is a shared event handler
					// across all open modal dialogs.
					this.document.on('focusin.ui-dialog', function(event) {
						if (isOpening) {
							return;
						}

						var instance = this._trackingInstances()[0];
						if (!instance._allowInteraction(event)) {
							event.preventDefault();
							instance._focusTabbable();

							// Support: jQuery >=3.4 <3.6 only
							// Focus re-triggering in jQuery 3.4/3.5 makes the original element
							// have its focus event propagated last, breaking the re-targeting.
							// Trigger focus in a delay in addition if needed to avoid the issue
							// See https://github.com/jquery/jquery/issues/4382
							if (jqMinor === '3.4.' || jqMinor === '3.5.') {
								instance._delay(instance._restoreTabbableFocus);
							}
						}
					}.bind(this));
				}

				this.overlay = $('<div>')
					.appendTo(this._appendTo());
				this._addClass(this.overlay, null, 'ui-widget-overlay ui-front');
				//#### CUSTOMIZE [2013/11/13][kikuchi] IEにおいて、'filter:alpha(opacity=)'で透過処理を施したオーバーレイ画像（モーダルオープン時の背景画像）がメモリリークする問題を解消 [start]
				//				this._on( this.overlay, {
				//					mousedown: '_keepFocus'
				//				} );
				var that = this;
				this.overlay.on('mousedown.dialog', function(event) {
					that._keepFocus(event);
				});
				//#### CUSTOMIZE [2013/11/13][kikuchi] IEにおいて、'filter:alpha(opacity=)'で透過処理を施したオーバーレイ画像（モーダルオープン時の背景画像）がメモリリークする問題を解消 [end]
				this.document.data('ui-dialog-overlays', (this.document.data('ui-dialog-overlays') || 0) + 1);
			},

			_destroyOverlay: function() {
				if (!this.options.modal) {
					return;
				}

				if (this.overlay) {
					var overlays = this.document.data('ui-dialog-overlays') - 1;

					if (!overlays) {
						this.document.off('focusin.ui-dialog');
						this.document.removeData('ui-dialog-overlays');
					} else {
						this.document.data('ui-dialog-overlays', overlays);
					}
					//#### CUSTOMIZE [2013/11/13][kikuchi] IEにおいて、'filter:alpha(opacity=)'で透過処理を施したオーバーレイ画像（モーダルオープン時の背景画像）がメモリリークする問題を解消 [start]
					this.overlay.off('mousedown.dialog');
					//#### CUSTOMIZE [2013/11/13][kikuchi] IEにおいて、'filter:alpha(opacity=)'で透過処理を施したオーバーレイ画像（モーダルオープン時の背景画像）がメモリリークする問題を解消 [end]
					this.overlay.remove();
					this.overlay = null;
				}
			}
		});
	}
})(jQuery);
/**
 * zIndex取得関数
 * 
 * elemのzIndex取得。elem自体は、zIndexがなかった場合、親のzIndexを遡って取得します。
 * 
 * @deprecated 非推奨の関数 $.fn.zIndex()の削除に伴う互換のため、$.geex.getZIndex()を追加します。
 * @create 2022/03/31
 * @author KCSS
 * @since 22.3.0
 */
(function($, undefined) {
	$.geex = $.geex || {};
	$.extend($.geex, {
		getZIndex: function( elem ) {
			var position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
			return 0;
		}
	})
})(jQuery);
// Copyright 2011-2016 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * 共通ユーティリティ機能を定義します。
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.ge = $.ge || {};
	var _defaultLocale = 'en';
	var _defaultContextPath = '/geframe';
	/**
	 * 共通ユーティリティクラスです。
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.ge, {
		/**
		 * デフォルトロケールを取得または設定します。
		 *
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		locale: _defaultLocale,
		/**
		 * デフォルトコンテキストパスを取得または設定します。
		 *
		 * @author hamanaka 2011/07/14
		 * @since 3.9.0
		 */
		contextPath: _defaultContextPath,
		/**
		 * セレクタ文字列をエスケープします。
		 *
		 * @param エスケープ対象の文字列
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		escSelectorString: function(value) {
			if (!value) return value;
			var regexp = new RegExp('(!|\"|#|\\$|%|&|\'|\\(|\\)|\\*|\\+|,|\\.|\\/|:|;|<|=|>|\\?|@|\\[|\\]|\\^|`|\\{|\\||\\}|~|\\\\)', 'g');
			return value.replace(regexp, '\\$1');
		},
		/**
		 * 正規表現で使用する文字をエスケープします。
		 *
		 * @param value エスケープ対象の文字列
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		escRegExp: function(value) {
			return value.replace(/\\/g, '\\\\').replace(/\./g, '\\.').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\^/g, '\\^').replace(/\$/g, '\\$').replace(/\+/g, '\\+').replace(/\?/g, '\\?').replace(/\*/g, '\\*').replace(/\|/g, '\\|').replace(/\{/g, '\\{').replace(/\}/g, '\\}');
		},
		/**
		 * 指定されたセレクタ文字列が示すjQueryオブジェクトを取得します。
		 * 第一引数が未定義値やnull等であった場合でもjQueryオブジェクトを返却します。
		 *
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		idSelector: function(selector, context) {
			var $context = $.geui.getElement(context);
			if (!$context.length || $context[0] === document) {
				return $(document.getElementById(selector));
			} else {
				return $context.find('#' + $.ge.escSelectorString(selector));
			}
		}
	});
})(jQuery);
/**
 * 共通プロパティを定義します。
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.ge = $.ge || {};
	$.ge.property = $.ge.property || {};
	/**
	 * プロパティ定義情報を格納します。
	 * 静的なプロパティ情報を設定する際は、事前に_defaultPropertiesに指定します。
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	var _defaultProperties = {
		//####### gectrl #######
		'gectrl.SystemError.Render.Key': 'geframe.richview.SystemError.Render',
		'gectrl.SystemError.Render.Block.Key': 'geframe.richview.SystemError.Render.script.block',
		'gectrl.SystemError.Message.HttpNot200': 'A communication failure has occurred.',
		'gectrl.SystemError.Message.UnHandle.ServerError': 'An exception occurred on the server side can not handle.',
		'gectrl.Exitcode.Key': 'exit-code',
		'gectrl.Onetimetoken.Key': 'onetime-token',
		'gectrl.Viewid.Key': 'view-id',
		//####### gecomm #######
		'gecomm.SendInterval': 100,
		'gecomm.TimeoutInterval': 5000,
		'gecomm.PoolSize': 2,
		'gecomm.Ajax.UrlSuffix': '.ajax-action',
		'gecomm.Submit.UrlSuffix': '.view-action',
		'gecomm.Viewid.Key': 'viewid',
		'gecomm.Onetimetoken.Key': 'onetimetoken',
		'gecomm.Backward.Key': 'backward',
		'gecomm.Request.Data.Id': 'gecomm.grequestcreator.requestdata.id',
		//####### geui   #######
		'geui.Namespace': 'geui',
		'geui.SystemError.Name': 'grsystemerrordialog',
		'geui.SystemError.Class.Name': 'geui-grsystemerrordialog',
		'geui.SystemError.Options': '{"width": 320, "title": "SYSTEM ERROR"}',
		'geui.XHtml.Ex.Attr.Namespace': 'ghx:namespace',
		'geui.XHtml.Ex.Attr.Widgetclass': 'ghx:widgetclass',
		'geui.XHtml.Ex.Attr.Options': 'ghx:options',
		'geui.XHtml.Ex.Attr.Clear': 'ghx:clear',
		'geui.XHtml.Ex.Attr.Tag': 'ghx:tag',
		'geui.XHtml.Ex.Attr.Initvalue': 'ghx:initvalue',
		'geui.XHtml.Ex.Attr.RadioGroup': 'ghx:radiogroup'
	};
	/**
	 * 共通プロパティクラスです。
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.ge.property, {
		/**
		 * 指定されたプロパティを登録します.
		 * プロパティ値が未定義値又はnull等の場合nullが登録されます。
		 *
		 * @param {string} key プロパティ名
		 * @param {string} value プロパティ値
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		set: function(key, value) {
			this._properties[key] = value ? value : null;
		},
		/**
		 * 指定されたプロパティ名に対応する値を返します。
		 *
		 * @param {string} key プロパティ名
		 * @return プロパティの値
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		get: function(key) {
			var value = this._properties[key];
			return value ? value : null;
		},
		/**
		 * プロパティを設定します。
		 *
		 * @param {{string:string}} values {プロパティ名:プロパティ値}
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		setProperties: function(values) {
			this._properties = {};
			var self = this;
			$.each(values, function(key, value) {
				self.set(key, value);
			});
		},
		/**
		 * プロパティをデフォルト値に戻します。
		 *
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		refresh: function() {
			this._properties = $.extend({}, _defaultProperties);
		},
		/**
		 * プロパティの内容を返します。
		 *
		 * @return {{string:string}} {プロパティ名:プロパティ値}
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		getProperties: function() {
			return this._properties;
		}
	});
	$.ge.property._properties = $.extend({}, _defaultProperties);
})(jQuery);
/**
 * 通信状態を定義します。
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.ge = $.ge || {};
	$.ge.process = $.ge.process || {};
	/**
	 * 通信状態を表します。
	 * ・$.ge.process.AJAXACTIVE   ： Ajax通信中
	 * ・$.ge.process.SUBMITACTIVE ： Submit通信中
	 * ・$.ge.process.STOP         ： 停止中
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.ge.process, {
		AJAXACTIVE: 1,
		SUBMITACTIVE: 2,
		STOP: 5
	});
	$.ge.process.state = $.ge.process.STOP;
})(jQuery);
/**
 * イベントハンドラーを定義します。eventオブジェクトのマルチブラウザ対応機能を提供します。
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.ge = $.ge || {};
	$.ge.event = $.ge.event || {};
	/**
	 * 共通イベント
	 *
	 * @author yamashita 2011/07/03
	 * @since 3.9.0
	 */
	$.extend($.ge.event, {
		/**
		 * ターゲットeventを取得します。
		 * ※マルチブラウザ対応（ie=event.srcElement, other=event.currentTarget）
		 *
		 * @param event イベントオブジェクト
		 * @return ターゲットevent
		 * @author yamashita 2011/07/03
		 * @since 3.9.0
		 */
		target: function(event) {
			return $($.ge.event.fix(event).target);
		},
		/**
		 * カレントeventを取得します。
		 * ※マルチブラウザ対応（ie=event.srcElement, other=event.currentTarget）
		 *
		 * @param event イベントオブジェクト
		 * @return カレントevent
		 * @author yamashita 2011/07/03
		 * @since 3.9.0
		 */
		currentTarget: function(event) {
			return $($.ge.event.fix(event).currentTarget);
		},
		/**
		 * eventオブジェクトをJQueryのeventオブジェクトに変換します。
		 * ※マルチブラウザ対応（ie=event.srcElement, other=event.currentTarget）
		 *
		 * @param event イベントオブジェクト
		 * @return JQueryのイベントオブジェクト
		 * @author yamashita 2011/07/03
		 * @since 3.9.0
		 */
		fix: function(event) {
			return $.event.fix(event);
		}
	});
})(jQuery);

// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * 通信関連の共通機能を定義します。
 *
 * @author yamashita 2011/08/27
 * @since 3.12.0
 */
(function($, undefined) {
	$.gecomm = $.gecomm || {};
})(jQuery);

/*
 * Copyright 2022-2024 Kyocera Communication Systems Co., Ltd All rights reserved.
 */
/**
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.gecomm.gactioninvoker = $.gecomm.gactioninvoker || {};
	/**
	 * 通信関連を取り扱うクラスです.
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.gecomm.gactioninvoker, {
		/**
		 * ajaxを実行します.
		 *
		 * @param options オプション
		 * @author yamashita 2011/03/31
		 * @since 3.9.0
		 */
		ajax: function(options) {
			return $.ajax(options);
		},
		/**
		 * submitを実行します.
		 *
		 * @param options オプション
		 * @author yamashita 2011/03/31
		 * @since 3.9.0
		 */
		submit: function($form) {
			return $form.trigger('submit');
		}
	});
})(jQuery);

/*
 * Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
 */

/**
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */
(function($, undefined) {
	$.gecomm.grequestcreator = $.gecomm.grequestcreator || {};
	/**
	 * HTTPリクエストデータを生成するクラスです。（Ajax、Submit共通）
	 *
	 * @class HTTPリクエストデータを生成
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.gecomm.grequestcreator, {
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		options: {
			actionparams: {
				httpmethod: 'post'
			},
			timeout: $.ge.property.get('gecomm.TimeoutInterval')
		},
		/**
		 * 指定したオプションの内容に基づいて、サブミット用のリクエストデータ生成します。
		 *
		 * @param event イベント
		 * @param options オプション
		 * {
		 *  actionbean: アクションクラス,
		 *  actionmethod: 【必須】アクションメソッド,
		 *  form: (サブミット対象の)Form要素のid属性,
		 *  mode: モード,
		 *  httpmethod: HTTPメソッド,
		 *  indicator: 処理中インジケータのid属性,
		 *  dialogmsg: 確認ダイアログメッセージ,
		 *  customdialog: カスタムダイアログのid属性※サポートしていません。将来、対応する予定です。
		 *  target: Form要素のtarget属性,
		 *  forward: 【必須】フォワード先JSPのパス
		 * }
		 * @return サブミット対象のForm要素を内包したJQueryオブジェクト
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		createSubmitData: function(event, options) {
			var o = $.extend(true, {}, $.gecomm.grequestcreator.options, options);
			var actionparams = o.actionparams || {};
			var url = $.gecomm.grequestcreator._createUrl(event, $.ge.property.get('gecomm.Submit.UrlSuffix'));
			$.gecomm.grequestcreator._setCommType(actionparams, 'submit');
			return $.gecomm.grequestcreator._createRequestForm(event, o, actionparams, url);
		},
		/**
		 * 指定したオプションの内容に基づいて、Ajax用のリクエストデータ生成します。
		 *
		 * バージョン21.9で、リクエストパラメータ（JSON）のフォーマットの変更点：
		 * 　　変更前、httpmethodは、optionsに配下
		 * 　　変更後、httpmethodは、options.actionparamsに配下
		 * 本来httpmethodは、広義的なaction情報であるので、options.actionparamsに移すべき
		 * これで、Ignore機能に、前回発行されたリクエストのhttpmethod情報を復元できる
		 *
		 * @param event イベント
		 * @param options オプション
		 * {
		 *  actionbean: アクションクラス,
		 *  actionmethod: 【必須】アクションメソッド,
		 *  form: (サブミット対象の)Form要素のid属性,
		 *  mode: モード,
		 *  indicator: 処理中インジケータのid属性,
		 *  dialogmsg: 確認ダイアログメッセージ,
		 *  customdialog: カスタムダイアログのid属性※サポートしていません。将来、対応する予定です。
		 *  target: Form要素のtarget属性,
		 *  forward: フォワード先JSPのパス,
		 *  render: レンダリング対象のid属性（カンマ区切りで複数指定可能）
		 *  actionparams : {
		 *    httpmethod : HTTPメソッド,
		 *    ajaxSettings : {
		 *        async : 同期・非同期属性
		 *    }
		 *  }
		 * }
		 * @return Ajax対象のForm要素を内包したJQueryオブジェクト
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		createAjaxData: function(event, options) {
			options = options || {};
			var o = $.extend(true, {}, $.gecomm.grequestcreator.options, options);
			var url = $.gecomm.grequestcreator._createUrl(event, $.ge.property.get('gecomm.Ajax.UrlSuffix'));
			var actionparams = o.actionparams || {};
			var ajaxSettings = $.extend(true, {}, actionparams.ajaxSettings);
			$.gecomm.grequestcreator._setCommType(actionparams, 'ajax');
			var $form = $.gecomm.grequestcreator._createRequestForm(event, o, actionparams, url);
			var ajaxData = null;
			ajaxData = actionparams.download ?
				$.gecomm.grequestcreator.createAjaxDataAttachment(url, o, ajaxSettings) :
				$.gecomm.grequestcreator.createAjaxDataXml(url, o, ajaxSettings);

			if (actionparams.upload && window.FormData) {
				return $.extend(true, {
					data: new FormData($form[0]),
					processData: false,
					contentType: false
				}, ajaxData);
			} else {
				return $.extend(true, {
					data: $form.serialize()
				}, ajaxData);
			}
		},
		createAjaxDataAttachment: function(url, o, ajaxSettings) {
			return $.extend(true, {
				url: url,
				dataType: false,
				processData: false,
				xhrFields: {
					responseType: 'blob'
				},
				complete: o.complete,
				type: o.actionparams.httpmethod
			}, ajaxSettings);
		},
		createAjaxDataXml: function(url, o, ajaxSettings) {
			return $.extend(true, {
				url: url,
				dataType: 'xml',
				complete: o.complete,
				type: o.actionparams.httpmethod
			}, ajaxSettings);
		},
		_createRequestForm: function(event, options, actionparams, url) {
			var o = $.extend(true, {}, actionparams);
			o.actionid || $.gecomm.grequestcreator._putParam(o, 'actionid', $.ge.event.currentTarget(event).attr('id'));
			var $form = $.gecomm.grequestcreator._getActionForm(o);
			delete o.form;
			$.gecomm.grequestcreator._addFormAttr($form, 'action', url);
			$.gecomm.grequestcreator._addFormAttr($form, 'target', o.target);
			$.gecomm.grequestcreator._putParam(o, 'actionform', $form.attr('id'));
			$.gecomm.grequestcreator._putParam(o, 'actiontarget', o.target);
			delete o.target;
			var params = $.gecomm.grequestcreator._parseArray(event, o, $form);
			$.gecomm.grequestcreator._addInputs($form, params);
			return $form;
		},
		_setCommType: function(options, type) {
			$.gecomm.grequestcreator._putParam(options, 'commtype', type);
		},
		_getActionForm: function(actionparams) {
			var $form = actionparams.actionform ? $.ge.idSelector(actionparams.actionform) : $.ge.idSelector(actionparams.actionid).closest('form');
			return $form.length ? $form : $.gecomm.grequestcreator._createDefaultForm();
		},
		_addFormAttr: function($form, attr, value) {
			value === null || value === undefined || $form.attr(attr, value);
		},
		/**
		 * キー重複は上書する。
		 */
		_putParam: function(actionparams, key, value) {
			actionparams[key] = value;
		},
		_removeContents: function() {
			var reqDataId = $.ge.property.get('gecomm.Request.Data.Id');
			$.ge.idSelector(reqDataId).remove();
		},
		_getContents: function($form) {
			var reqDataId = $.ge.property.get('gecomm.Request.Data.Id');
			var $contents = $.ge.idSelector(reqDataId);
			if (!$contents.length) {
				$contents = $('<span id="' + reqDataId + '"/>');
				$contents.appendTo($form);
			}
			return $contents;
		},
		_addInput: function($form, options) {
			var $input = $('<input/>');
			$.each(options, function(key, value) {
				if (!key) return;
				$input.attr(key, value === null || value === undefined ? '' : value);
			});
			var $contents = $.gecomm.grequestcreator._getContents($form);
			$input.appendTo($contents);
		},
		_addInputs: function($form, params) { // params=[{name: 'key1', value: 'value1'}, {name: 'key2', value: 'value2'}, ...} => <input type='hidden' id='key1' name='key1' value='value1'/><input type='hidden' id='key2' name='key2' value='value2'/> ...
			$.gecomm.grequestcreator._removeContents();
			$.map(params, function(p) {
				return $.gecomm.grequestcreator._addInput($form, {
					type: 'hidden',
					name: p.name,
					value: p.value
				});
			}).join('');
			var viewid = $.ge.property.get('gecomm.Viewid.Key'),
				onetimetoken = $.ge.property.get('gecomm.Onetimetoken.Key'),
				backward = $.ge.property.get('gecomm.Backward.Key');
			$.gecomm.grequestcreator._addInput($form, {
				type: 'hidden',
				name: 'reqoptions',
				value: JSON.stringify(params)
			}); // 再リクエスト用に（callback 評価後の）optionsをポストする（hiddenパラメータ除く）
			$.gecomm.grequestcreator._addInput($form, {
				type: 'hidden',
				name: viewid,
				value: $.ge.idSelector(viewid).val()
			});
			$.gecomm.grequestcreator._addInput($form, {
				type: 'hidden',
				name: onetimetoken,
				value: $.ge.idSelector(onetimetoken).val()
			});
			$.gecomm.grequestcreator._addInput($form, {
				type: 'hidden',
				name: backward,
				value: $.ge.idSelector(backward).val()
			});
		},
		_parseArray: function(event, options, $form) {
			var params = [];
			$.each(options, function(key, value) {
				if ($.isFunction(value)) {
					var values = value(event, options, $form);
					values && $.each(values, function(i, p) { // value => [{name: key1, value: value1}, {name: key2, value: value2}, ...]
						params.push(p);
					});
				}
			});
			$.each(options, function(key, value) {
				if ($.isFunction(value)) {
					return true;
				} else if (Array.isArray(value)) {
					$.each(value, function(i, v) {
						params.push({
							name: key,
							value: v
						});
					});
				} else {
					params.push({
						name: key,
						value: value
					});
				}
			});
			return params;
		},
		_submitFormid: 'submitform',
		_createDefaultForm: function() {
			$.ge.idSelector($.gecomm.grequestcreator._submitFormid).remove();
			return $('<form/>')
				.attr('id', $.gecomm.grequestcreator._submitFormid)
				.appendTo('body');
		},
		_createUrl: function(event, suffix) {
			var url = $.ge.contextPath;
			url += '/';
			url += $.ge.event.currentTarget(event).attr('id');
			url += suffix;
			return url;
		}
	});
})(jQuery);

// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * UIの共通機能を定義します。
 *
 * @author T.Aono 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	$.geui = $.geui || {};
	var XHTML_ATTRIBUTE_NAMESPACE_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.Namespace'),
		XHTML_ATTRIBUTE_CLASSNAME_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.Widgetclass'),
		XHTML_ATTRIBUTE_OPTIONS_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.Options'),
		XHTML_ATTRIBUTE_CLEAR_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.Clear'),
		XHTML_ATTRIBUTE_TAG_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.Tag');
	$.extend($.geui, {
		/**
		 * widget クラスの属性、メソッドをコピー元からコピー対象にコピーします。
		 *
		 * @param {$.ui.widget.prototype} dist コピー先 widget のprototype
		 * @param {$.ui.widget.prototype} from コピー元 widget のprototype
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		extend: function(dist, from) {
			$.extend(dist, $.extend(true, {}, from, dist));
		},
		/**
		 * ウィジェットを生成します。
		 *
		 * [widgetclass][namespace][options] の属性を保持してる HTML エレメントを指定内容に従い widget 化します。
		 *
		 * [widgetClass] … widget化対象のクラス名称を指定
		 * [namespace] … widget化対象のクラスの名前空間を指定
		 * [options] … widget化対象のクラスの初期化の際に引き渡す options を指定
		 *
		 * @param context HTMLエレメント
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		createWidgets: function(context) {
			/**
			// IE7又はIE8で、namespace付き属性名セレクタを使用し、
			// 検索範囲内にtableタグが存在するときエラーが発生します。
			// これを回避するために「:not(table)」を前に付ける。
			// jquery.js v1.6.1の場合、3973行目又は4509行目を参照。
			 */
			var $context = $.geui.getElement(context);
			$context = $context.length ? $context : $(document);
			$context.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_CLASSNAME_NAME) + ']').filter(function() {
				return $.geui.isWidget(this);
			}).each(function() {
				$.geui.createWidget(this);
			});
		},
		/**
		 * ウィジェットを破棄します。
		 *
		 * [widgetclass][namespace][options] の属性を保持してる HTML エレメントを指定内容に従い widget を破棄します。
		 *
		 * [widgetClass] … widget化対象のクラス名称を指定
		 * [namespace] … widget化対象のクラスの名前空間を指定
		 * [options] … widget化対象のクラスの初期化の際に引き渡す options を指定
		 *
		 * @param context HTMLエレメント
		 * @author kikuchi 2013/06/04
		 * @since 3.12.0
		 */
		destroyWidgets: function(context) {
			/**
			// IE7又はIE8で、namespace付き属性名セレクタを使用し、
			// 検索範囲内にtableタグが存在するときエラーが発生します。
			// これを回避するために「:not(table)」を前に付ける。
			// jquery.js v1.6.1の場合、3973行目又は4509行目を参照。
			 */
			var $context = $.geui.getElement(context);
			$context = $context.length ? $context : $(document);
			$context.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_CLASSNAME_NAME) + ']').filter(function() {
				return $.geui.isWidget(this);
			}).each(function() {
				$.geui.destroyWidget(this);
			});
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）のウィジェットを破棄します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		destroyWidget: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				widget.destroy();
				return;
			}
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）をウィジェット化します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return 生成したウィジェットオブジェクト
		 * @return widgetオブジェクト
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		createWidget: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var widgetNamespace = $.geui.attr($element, XHTML_ATTRIBUTE_NAMESPACE_NAME);
			var widgetClass = $.geui.attr($element, XHTML_ATTRIBUTE_CLASSNAME_NAME);
			if (!widgetNamespace || !widgetClass) {
				return;
			}
			var options = $.geui.getOptions($element);
			var instance = $.geui.getWidget($element, widgetNamespace, widgetClass);
			if (instance) {
				instance.option(options || {})._init();
			} else {
				var fn = $[widgetNamespace][widgetClass];
				if (!fn) {
					var errormsg = 'Given "namespace" or "widgetclass" value is incorrect.(id=';
					errormsg += $element.attr('id');
					errormsg += ', namespace=';
					errormsg += widgetNamespace;
					errormsg += ', widgetclass=';
					errormsg += widgetClass;
					errormsg += ')';
					/*jshint newcap:false */
					throw Error(errormsg);
				}
				/*jshint newcap:false */
				instance = new fn(options, $element[0]);
				$.data($element[0], widgetNamespace + '-' + widgetClass, instance);
			}
			return instance ? instance : null;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）のオプションを取得します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return オプション
		 * @author kikuchi 2013/07/24
		 * @since 3.12.0
		 */
		getOptions: function(element) {
			/*jshint evil:true*/
			var $element = $.geui.getElement(element);
			if (!$element.length) return null;
			var widgetOptions = $.geui.attr($element, XHTML_ATTRIBUTE_OPTIONS_NAME);
			var options = {};
			typeof widgetOptions === 'string' && (eval('options =' + widgetOptions)); // $.parseJSON(widgetOptions)では、「関数」を評価できないためevalを使用
			return options;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたHTMLエレメントの属性値を取得または設定します。
		 *
		 * GEF22.3、jQueryバージョンアップにて対応内容：
		 * jQuery 1.9前は、
		 *   $().attr("value")は、$().prop("value")と同じく、propertyのvalue値を取得します。
		 * それに従って、GEFは、以下の実装になりました。
		 *   $.geui.attr()値取得：$().attr(attrName)で取得
		 *   $.geui.attr()値設定：$().attr(attrName, value)で設定
		 *
		 * jQuery 1.9以降は、以下の変更点があります。
		 *   $().attr("value")：attributeのvalue値を取得します。
		 *   $().val()　或は　$().prop("value")：propertyのvalue値を取得します。
		 *
		 * GEFは、migration.jsを使うことで、意識せずその変更点を吸収しました。
		 * GEF22.3、jQueryバージョンアップにて、migration.jsも消しましたので、
		 * バージョンアップ前後の相違点を吸収するため、実装は以下に変更しました。
		 *   $.geui.attr()値取得：
		 *     propertyに属性ある場合、propertyから取得（$().prop())
		 *     propertyに属性ない場合、attributeから取得($().attr())
		 *   $.geui.attr()値設定：
		 *     propertyにも、attributeにも両方設定（.prop()、.attr())
		 *
		 *   https://github.com/jquery/jquery-migrate/blob/main/warnings.md
		 *     jQuery.fn.attr('value') no longer gets properties
		 *     jQuery.fn.attr('value', val) no longer sets properties
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param attrName 属性名
		 * @param value 設定値
		 * @return HTMLエレメントが存在する：属性値、HTMLエレメントが存在しない：null
		 * @author kikuchi 2013/07/24
		 * @since 3.12.0
		 */
		attr: function(element, attrName, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return null;
			if (arguments.length === 2) {
				return typeof($element.prop(attrName)) !== 'undefined' ? $element.prop(attrName) : $element.attr(attrName);
			}
			$element.prop(attrName, value);
			$element.attr(attrName, value);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたHTMLエレメントの属性値を、boolean型に変換して返します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param attrName 属性名
		 * @param defaultbool 属性値がundefinedであった場合の返り値
		 * @return 属性値がundefined：デフォルト値、属性値が"false"：false、その他：javascript標準のboolean変換値
		 * @author kikuchi 2013/07/24
		 * @since 3.12.0
		 */
		booleanAttr: function(element, attrName, defaultBool) {
			var val = $.geui.attr(element, attrName);
			if (val === undefined) return typeof defaultBool === 'boolean' ? defaultBool : true; //undefinedはデフォルトtrue
			if (val === 'false') return false;
			return !!val;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットを有効化します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/08/24
		 * @since 3.9.0
		 */
		enable: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				widget.enable && widget.enable();
				return;
			}
			var $element = $.geui.getElement(element);
			$element.length && $element.prop('disabled', false);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットを無効化します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/08/24
		 * @since 3.9.0
		 */
		disable: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				widget.disable && widget.disable();
				return;
			}
			var $element = $.geui.getElement(element);
			$element.length && $element.prop('disabled', true);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）の状態がdisabledかどうかを判定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/10/13
		 * @since 3.10.0
		 */
		isDisabled: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				return !!widget.options.disabled;
			}
			var $element = $.geui.getElement(element);
			if ($element.length) {
				return !!$element.prop('disabled'); //マルチブラウザ対応（IE:false chrome,firefox:undefinedを返すため"!!"を付加）
			}
			return false;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットを読取専用にします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/08/27
		 * @since 3.9.0
		 */
		readonly: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				widget.readonly && widget.readonly();
				return;
			}
			var $element = $.geui.getElement(element);
			$element.length && $element.prop('readonly', true);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットを読取可能にします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/08/27
		 * @since 3.9.0
		 */
		readwrite: function(element) {
			var widget = $.geui.getWidget(element);
			if (widget) {
				widget.readwrite && widget.readwrite();
				return;
			}
			var $element = $.geui.getElement(element);
			$element.length && $element.prop('readonly', false);
		},
		/**
		 * ウィジェットかどうかを判定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return true: ウィジェット false: ウィジェット以外
		 * @author yamashita 2011/06/13
		 * @since 3.9.0
		 */
		isWidget: function(element) {
			return $.geui.attr(element, XHTML_ATTRIBUTE_NAMESPACE_NAME) && $.geui.attr(element, XHTML_ATTRIBUTE_CLASSNAME_NAME) ? true : false;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットの値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 設定値
		 * @return 設定値
		 * @author kikuchi 2013/07/24
		 * @since 3.12.0
		 */
		val: function(element, value) {
			if (!arguments.length) return;
			var widget = $.geui.getWidget(element);
			if (widget && widget.isVariable) {
				if (arguments.length === 1) {
					return widget.val();
				}
				widget.val(value);
				return;
			}
			var tag = $.geui.attr(element, XHTML_ATTRIBUTE_TAG_NAME);
			if (arguments.length === 1) {
				return $.geui.handler.get(tag).val(element);
			}
			$.geui.handler.get(tag).val(element, value);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットを取得します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return ウィジェット
		 * @author yamashita 2011/06/13
		 * @since 3.9.0
		 */
		getWidget: function(element, wNamespace, wClass) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return null;
			var widgetNamespace = wNamespace || $.geui.attr($element, XHTML_ATTRIBUTE_NAMESPACE_NAME);
			var widgetClass = wClass || $.geui.attr($element, XHTML_ATTRIBUTE_CLASSNAME_NAME);
			var widget = widgetClass ? $element.data(widgetNamespace + '-' + widgetClass) : null;
			return widget ? widget : null;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたHTMLエレメントをjQueryオブジェクトに変換して返します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return jQueryオブジェクト
		 * @author yamashita 2013/07/01
		 * @since 3.12.0
		 */
		getElement: function(element) {
			if (element instanceof jQuery) return element;
			return typeof element === 'string' ? $.ge.idSelector(element) : $(element);
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたHTMLエレメントのクリア属性に値（FALSE）を設定します。
		 * 第二引数(recursive)にtrueを指定した場合、そのHTMLエレメント内の子エレメントに対して再帰的にクリア属性に値（FALSE）を設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param recursive true: 再帰する, false: 再帰しない
		 * @author hamanaka 2011/07/30
		 * @since 3.9.0
		 */
		setClearFalse: function(element, recursive) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			$element.attr(XHTML_ATTRIBUTE_CLEAR_NAME, 'false');
			recursive && $element.find('*').each(function() {
				$(this).attr(XHTML_ATTRIBUTE_CLEAR_NAME, 'false');
			});
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたシステムエラー通知ウィジェットを表示します。
		 * エラーオブジェクト（Error）が指定されている場合、そのエラーメッセージをコンテンツに設定します。
		 *
		 * @param error エラーオブジェクト（Error）
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		showSystemError: function(error, element) { // error instanceof Error
			var $element = $.geui.getElement(element);
			if (!$element.length) {
				$element = $.geui._createSystemErrorDialog(error);
			}
			var widget = $.geui.getWidget($element);
			widget && widget.showError();
		},
		/**
		 * システムエラー通知用のコンテンツを取得します。
		 *
		 * @private
		 * @return システムエラー通知用のコンテンツ
		 * @author yamashita 2013/06/18
		 * @since 3.12.0
		 */
		getSystemErrorContents: function() {
			return $('.' + $.ge.escSelectorString($.ge.property.get('geui.SystemError.Class.Name')));
		},
		/**
		 * デフォルトのシステムエラー通知ウィジェットを生成します。
		 *
		 * @private
		 * @return システムエラー通知ウィジェット
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		_createSystemErrorDialog: function(error) {
			var $contents = $.geui.getSystemErrorContents();
			$contents.length && $contents.remove();
			var $dialog = $('<div/>')
				.attr(XHTML_ATTRIBUTE_NAMESPACE_NAME, $.ge.property.get('geui.Namespace'))
				.attr(XHTML_ATTRIBUTE_CLASSNAME_NAME, $.ge.property.get('geui.SystemError.Name'))
				.attr(XHTML_ATTRIBUTE_OPTIONS_NAME, $.ge.property.get('geui.SystemError.Options'))
				.appendTo('body');
			error && error.message && $dialog.html(error.message);
			$.geui.setClearFalse($dialog, true);
			$.geui.createWidget($dialog);
			return $dialog;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたインジケータウィジェットを表示します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		showIndicator: function(element) {
			var widget = $.geui.getWidget(element);
			widget && widget.show();
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたインジケータウィジェットを非表示します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		hideIndicator: function(element) {
			var widget = $.geui.getWidget(element);
			widget && widget.hide();
		},
		/**
		 * 指定したオプションを基に、確認ダイアログを表示します。
		 * ※カスタムダイアログ表示（options.customdialog）は、現在、サポートしていません。
		 *
		 * @param options オプション
		 * {
		 *  dialogmsg: 確認ダイアログメッセージ
		 * }
		 * @return
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		confirmAction: function(options) {
			/*jshint noempty:false*/
			if (!options) return true;
			if (options.dialogmsg) {
				return window.confirm(options.dialogmsg);
			} else if (options.customdialog) {
				// TODO: [2011/04/25][yamashita]カスタムダイアログオープン	戻り値はfalse、メソッドはshowDialogとする
				//				var $dialog = $(options.customdialog);
				//				return $dialog.show;
			}
			return true;
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたウィジェットの値をクリアします。
		 *
		 * @param event イベントオブジェクト
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param options オプション
		 * {
		 *  element: リセット対象のXHTMLエレメント または id属性 または JQueryオブジェクト,
		 * }
		 * @author hamanaka 2011/07/30
		 * @since 3.9.0
		 */
		clear: function(event, options) {
			if (!options) return;
			// 1.クリア範囲が指定されているかどうか
			var $context = $.geui.getElement(options.element);
			// 2.イベント発火したエレメントはあるか
			var $event = event ? $.ge.event.target(event) : null;
			// クリア範囲が指定されていなければ、イベント発火元からクリア範囲を取得
			var $element = (!$context.length && $event) ? $event.closest('form') : $context;
			if (!$element.length) {
				return;
			}
			$.geui._clearWidget($element);
			$.geui._clearPlain($element);
			$.geui._clearXhtml($element);
		},
		/**
		 * 指定したJQueryオブジェクトに関連付けられたウィジェット、あるいは、その配下のウィジェットの値をクリアします。
		 *
		 * @param $element jQueryオブジェクト
		 * @author hamanaka 2011/07/29
		 * @since 3.10.0.D
		 */
		_clearWidget: function($element) {
			/**
			// IE7又はIE8で、namespace付き属性名セレクタを使用し、
			// 検索範囲内にtableタグが存在するときエラーが発生します。
			// これを回避するために「:not(table)」を前に付ける。
			// jquery.js v1.6.1の場合、3973行目又は4509行目を参照。
			 */
			var $elem = $.geui.getElement($element);
			$elem = $elem.length ? $elem : $(document);
			$elem.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_CLASSNAME_NAME) + ']').filter(function() {
				return $.geui.isWidget(this);
			}).each(function() {
				var widget = $.geui.getWidget(this);
				widget && widget.clear && widget.clear();
			});
		},
		/**
		 * 指定したJQueryオブジェクトに関連付けられたHTMLエレメント、あるいは、その配下のHTMLエレメントの値をクリアします。
		 * クリア処理は、ハンドラ経由でプレーン系コントロールのみとなります。
		 *
		 * @param $element jQueryオブジェクト
		 * @author yamashita 2011/09/13
		 * @since 3.10.0.D
		 */
		_clearPlain: function($element) {
			var $elem = $.geui.getElement($element);
			$elem = $elem.length ? $elem : $(document);
			$elem.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_TAG_NAME) + ']').each(function() {
				var tag = $.geui.attr(this, XHTML_ATTRIBUTE_TAG_NAME);
				var handler = $.geui.handler.get(tag);
				handler && handler.clear && handler.clear(this);
			});
		},
		/**
		 * 指定したJQueryオブジェクトに関連付けられたHTMLエレメント、あるいは、その配下のHTMLエレメントの値をクリアします。
		 *
		 * @param $element jQueryオブジェクト
		 * @author hamanaka 2011/07/29
		 * @since 3.10.0.D
		 */
		_clearXhtml: function($element) {
			var $elem = $.geui.getElement($element);
			$elem = $elem.length ? $elem : $(document);
			$elem.find(':input[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_CLEAR_NAME) + '=true]').filter(function() {
				return !$.geui.isWidget(this);
			}).each(function() {
				var $this = $(this);
				$this.is(':not(:button):not(:submit):not(:reset):not(:image):not(:radio)') && $this.val('');
				$this.is(':radio,:checkbox') && $this.prop('checked', false);
				$this.is('select') && $this.find('option:first').prop('selected', true);
			});
		},
		/**
		 * 指定したフォーム上に存在する全てのプレーン、ウィジェット、HTMLエレメントの値をリセットします。
		 *
		 * @param event イベントオブジェクト
		 * @param options オプション
		 * {
		 *  element: リセット対象のXHTMLエレメント または id属性 または JQueryオブジェクト,
		 * }
		 * @author yamashita 2011/09/18
		 * @since 3.9.0
		 */
		resetAll: function(event, options) {
			if (!options) return;
			var $context = $.geui.getElement(options.element);
			var $event = event ? $.ge.event.target(event) : null;
			var $form = (!$context.length && $event) ? $event.closest('form') : $context;
			if (!$form.length || !$form[0].reset) {
				return;
			}
			$form[0].reset();
			$.geui.reset(event, {
				element: $form
			});
		},
		/**
		 * 指定したフォーム上に存在する（RIA含む）全てのウィジェット、HTMLエレメントの値をリセットします。
		 * ※formのリセット処理（form.reset()）は行いません。
		 *
		 * @param event イベントオブジェクト
		 * @param options オプション
		 * {
		 *  element: リセット対象のXHTMLエレメント または id属性 または JQueryオブジェクト,
		 * }
		 * @author yamashita 2011/07/30
		 * @since 3.9.0
		 */
		reset: function(event, options) {
			if (!options) return;
			var $context = $.geui.getElement(options.element);
			var $event = event ? $.ge.event.target(event) : null;
			var $form = (!$context.length && $event) ? $event.closest('form') : $context;
			if (!$form.length || !$form[0].reset) {
				return;
			}
			$.geui._resetPlain($form);
			$.geui._resetWidget($form);
		},
		/**
		 * 指定したフォーム上に存在する全てのウィジェットの値をリセットします。
		 *
		 * @param $form リセット対象のFORMエレメント jQueryオブジェクト
		 * @author hamanaka 2011/07/29
		 * @since 3.10.0.D
		 */
		_resetWidget: function($form) {
			/**
			// IE7又はIE8で、namespace付き属性名セレクタを使用し、
			// 検索範囲内にtableタグが存在するときエラーが発生します。
			// これを回避するために「:not(table)」を前に付ける。
			// jquery.js v1.6.1の場合、3973行目又は4509行目を参照。
			 */
			var $elem = $.geui.getElement($form);
			$elem = $elem.length ? $elem : $(document);
			$elem.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_CLASSNAME_NAME) + ']').filter(function() {
				return $.geui.isWidget(this);
			}).each(function() {
				var widget = $.geui.getWidget(this);
				widget && widget.reset && widget.reset();
			});
		},
		/**
		 * 指定したフォーム上に存在する全てのプレーン系のHTMLエレメントの値をリセットします。
		 * この処理は拡張属性ghx:tagが指定されている要素のみ対象とします.
		 *
		 * @param $element リセット範囲のエレメント jQueryオブジェクト
		 * @author yamashita 2011/09/13
		 * @since 3.10.0.D
		 */
		_resetPlain: function($element) {
			var $elem = $.geui.getElement($element);
			$elem = $elem.length ? $elem : $(document);
			$elem.find(':not(table)[' + $.ge.escSelectorString(XHTML_ATTRIBUTE_TAG_NAME) + ']').each(function() {
				var tag = $.geui.attr(this, XHTML_ATTRIBUTE_TAG_NAME);
				var handler = $.geui.handler.get(tag);
				handler && handler.reset && handler.reset(this);
			});
		},
		/**
		 * 指定した要素（HTMLエレメント または id属性 または JQueryオブジェクト）に関連付けられたHTMLエレメントをフォーカス状態にします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return true:フォーカス状態に成功、false:フォーカス状態に失敗
		 * @author yamashita 2011/07/08
		 * @since 3.9.0
		 */
		focus: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return false;
			$element.trigger('focus');
			// focusイベントの発火が行われたのでtrue
			return true;
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値に含まれる改行を有効化します。<br/>
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param val 値
		 * @author yamashita 2013/06/18
		 * @since 3.12.0
		 */
		multiline: function(element, val) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var text = val || $element.text();
			text = text.replace(/&/g, '&#38;');
			text = text.replace(/ /g, '&#160;');
			text = text.replace(/</g, '&#60;');
			text = text.replace(/>/g, '&#62;');
			text = text.replace(/"/g, '&#34;');
			text = text.replace(/'/g, '&#39;');
			text = text.replace(/\t/g, '&#160;&#160;&#160;&#160;');
			text = text.replace(/\\/g, '&#165;');
			text = text.replace(/[\r\n]/g, '<br/>');
			$element.html(text);
		}
	});
	$(function() {
		$.geui.createWidgets(document);
	});
})(jQuery);

// Copyright 2013-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPTextTag}{GPPasswordTag}{GPTextAreaTag}専用のプレースホルダハンドラを定義します。
 *
 * @author kawakami 2013/07/29
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.placeholderdecorator = $.geui.placeholderdecorator || {};
	$.extend($.geui.placeholderdecorator, {
		/**
		 * idで指定されたtext/password/textareaに対するプレースホルダをdecorateします。
		 * @param element id属性
		 * @author kawakami 2013/07/29
		 * @since 3.12.0
		 */
		decorate: function(id) {
			const ID = id;
			const PLACEHOLDER_ID = ID + '-placeholder';
			// 下記コードの本セレクター関数利用の目的を記載します：
			//   ﾀﾞｲｱﾛｸﾞの性質上、オリジナルとクローンを生成し、表示・非表示の表面上操作を実施するが、
			//   実態となるHTMLエレメントは同一のID値で生成されるため、セレクターを利用したjQueryオブジェクトの取得には、
			//   同一IDにて毎回最新の実態となるHTMLエレメントを取得しなければならない。
			var selector = function(id) {
				return $.ge.idSelector(id);
			};
			var hide = function() {
				selector(PLACEHOLDER_ID).css('zIndex', parseInt(selector(ID).get(0).style.zIndex, null));
				if (selector(PLACEHOLDER_ID).length > 0) {
					selector(PLACEHOLDER_ID)[0].style.display = 'none';
				}
			};
			var toggle = function() {
				if (selector(ID).val() === '') {
					selector(PLACEHOLDER_ID).css('zIndex', parseInt(selector(ID).get(0).style.zIndex, null) + 1);
					if (selector(PLACEHOLDER_ID).length > 0) {
						selector(PLACEHOLDER_ID)[0].style.display = 'inline-block';
					}
				} else {
					hide();
				}
			};
			var focus = function() {
				selector(ID).trigger('focus');
				if (selector(ID).attr('id') === $(document.activeElement).attr('id')) {
					selector(ID).trigger('focus');
				}
			};
			selector(PLACEHOLDER_ID).on('click', focus);
			selector(ID).on('blur', toggle);
			selector(ID).on('focus', hide);
			selector(ID).on('val.placeholderdecorator', toggle);
			toggle();
		}
	});
})(jQuery);

// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * 通信制御関連の共通機能を定義します。
 *
 * @author yamashita 2011/08/27
 * @since 3.12.0
 */
(function($, undefined) {
	$.gectrl = $.gectrl || {};
})(jQuery);

/*
 * Copyright 2011-2021 Kyocera Communication Systems Co., Ltd All rights reserved.
 */
/**
 * 通信関連を取り扱う機能群を定義します。
 *
 * @author yamashita 2011/05/01
 * @since 3.9.0
 */


(function($, undefined) {
	$.gectrl.gappcontroller = $.gectrl.gappcontroller || {};
	/**
	 * 通信関連のファサードクラスです。
	 *
	 * @author yamashita 2011/05/01
	 * @since 3.9.0
	 */
	$.extend($.gectrl.gappcontroller, {
		SCRIPT_BLOCK_ID_SUFFIX: '.script.block',
		/**
		 * Ajaxを実行します。
		 *
		 * @param event イベントオブジェクト
		 * @param options オプション
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		invokeAjaxAction: function(event, options) {
			if ($.ge.process.state === $.ge.process.SUBMITACTIVE) {
				return;
			}
			var focusedElement = document.activeElement;
			var focusedElementId = focusedElement ? focusedElement.id : null;

			$.gectrl.gappcontroller._isInvariantStateAction(options) || ($.ge.process.state = $.ge.process.AJAXACTIVE);
			try {
				$.geui.showIndicator( !! options.actionparams ? options.actionparams.indicator : {});
				var request = $.gecomm.grequestcreator.createAjaxData(event, options);
				var ajax = $.gecomm.gactioninvoker.ajax(request);
				ajax.always(
					function(data, textStatus, xhr) {
						var error = null;
						try {
							$.gectrl.gappcontroller.load(xhr, data);
						} catch (e) {
							error = e;
						} finally {
							$.gectrl.gappcontroller.finish(options.actionparams, error);
							if (focusedElementId !== null) {
								document.getElementById(focusedElementId).focus();
							}
						}
					});
			} catch (e) {
				$.gectrl.gappcontroller.finish(options.actionparams, e);
			}

		},
		/**
		 * サブミットを実行します。
		 *
		 * @param event イベントオブジェクト
		 * @param options オプション
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		invokeSubmitAction: function(event, options) {
			if ($.ge.process.state !== $.ge.process.STOP) {
				return;
			}
			$.gectrl.gappcontroller._isInvariantStateAction(options) || ($.ge.process.state = $.ge.process.SUBMITACTIVE);
			try {
				var $form = $.gecomm.grequestcreator.createSubmitData(event, options);
				$.gecomm.gactioninvoker.submit($form);
				$.geui.showIndicator( !! options.actionparams ? options.actionparams.indicator : {}); // IE対応。submit前はアニメーション画像が有効にならない既知バグがある。
			} catch (e) {
				$.gectrl.gappcontroller.finish(options.actionparams, e);
			}
		},
		/**
		 * プロセス状態が不変なアクションかどうかを判定します。
		 *
		 * @param options オプション
		 * @return 判定フラグ<true>:状態が不変なアクション<false>:その他
		 * @author yamashita 2011/08/05
		 * @since 3.9.0
		 */
		_isInvariantStateAction: function(options) {
			return !!options && !! options.actionparams && options.actionparams.affectState !== undefined && options.actionparams.affectState !== null && !! !options.actionparams.affectState;
		},
		_extractFilenameFromContentDisposition: function(contentDisposition) {
			if (!contentDisposition) {
				return null;
			}
			var filename = contentDisposition.split(/;(.+)/)[1].split(/=(.+)/)[1];
			if (filename.toLowerCase().startsWith('utf-8\'\''))
				filename = decodeURIComponent(filename.replace('utf-8\'\'', ''));
			else
				filename = filename.replace(/['"]/g, '');
			return filename;
		},
		load: function(xhr, data) {
			/*jshint unused:false */
			if (xhr.status === 0) return;
			/*jshint newcap:false */
			if (xhr.status !== 200) throw Error($.ge.property.get('gectrl.SystemError.Message.HttpNot200') + ' http_status=' + xhr.status); // HttpStatusCodeが200以外;
			$.gectrl.gappcontroller.loadData(xhr, data);
		},
		loadData: function(xhr, blob) {
			var contentDisposition = xhr.getResponseHeader('Content-Disposition');
			if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
				var downloadLink = document.createElement('a');
				downloadLink.href = window.URL.createObjectURL(blob);
				downloadLink.download = $.gectrl.gappcontroller._extractFilenameFromContentDisposition(contentDisposition);
				downloadLink.style.display = 'none';

				document.body.appendChild(downloadLink);

				downloadLink.click();
				document.body.removeChild(downloadLink);
			} else {
				var xml = xhr.responseXML;
				if (!xml) {
					return; // レスポンスが空の場合、何もしない。主に、Renderが指定されていない、またはレスポンス不要なAjax通信時が該当する。
				}
				var $xml = $(xml);
				$.gectrl.gappcontroller.loadXml($xml);
				if ($xml.find($.ge.property.get('gectrl.Exitcode.Key')).text() === 'system-error') {
					throw new GServerAppException();
				}
			}
		},

		/**
		 * 通信の後処理を行います。
		 *
		 * @param options オプション
		 * @param errors エラーオブジェクト
		 * @author yamashita 2011/07/15
		 * @since 3.9.0
		 */
		finish: function(options, error) {
			$.geui.hideIndicator(options.indicator);
			$.ge.process.state = $.ge.process.STOP;
			error && $.gectrl.gappcontroller.handleError(error);
		},
		/**
		 * エラー処理を行います。
		 *
		 * @param error エラーオブジェクト
		 * @author yamashita 2011/07/15
		 * @since 3.9.0
		 */
		handleError: function(error) {
			$.ge.process.state = $.ge.process.STOP;
			var element = error && error instanceof GServerAppException ? $.geui.getSystemErrorContents() : null;
			$.geui.showSystemError(error, element);
		},
		/**
		 * XMLをロードします。
		 *
		 * @param $xml JQuery化したxmlオブジェクト
		 * @author yamashita 2011/05/01
		 * @since 3.9.0
		 */
		loadXml: function($xml) {
			var onetimeToken = $xml.find($.ge.property.get('gectrl.Onetimetoken.Key')).text();
			onetimeToken && $.ge.idSelector($.ge.property.get('gecomm.Onetimetoken.Key')).val(onetimeToken);
			var viewid = $xml.find($.ge.property.get('gectrl.Viewid.Key')).text();
			viewid && $.ge.idSelector($.ge.property.get('gecomm.Viewid.Key')).val(viewid);
			var $renders = $xml.find('render');
			var elements = [];
			$renders.each(function() {
				/*jshint evil:true */
				var element = $(this).attr('element'); // $(this) = '<render element="ItemCD" ..><span id="ItemCD"><input type="text" id="ItemCD" ../></render>...'
				var $content = $(this).children();
				var script = '';
				$.gectrl.gappcontroller._cleanError(element);
				var $element = $.ge.idSelector(element);
				if (!$element.length) {
					$element = $.gectrl.gappcontroller._createContents($content);
				}
				var slen = $content.attr('id').length;
				if ($content.attr('id').substring(slen - $.gectrl.gappcontroller.SCRIPT_BLOCK_ID_SUFFIX.length, slen) === $.gectrl.gappcontroller.SCRIPT_BLOCK_ID_SUFFIX) {
					$content.find('script').each(function() {
						script += $(this)[0].innerHTML || $(this)[0].text; // クロスブラウザ対応)
					});
					script && eval(script); // クロスブラウザ対応
				} else {
					// xml形式では、textareaなどのタグが空要素である場合、閉じタグが無くなってしまう。(<textarea></textarea> ⇒ <textarea/>)
					// そのため、xml文字列をHTML形式にパースしてから出力させる
					var content = $content[0].outerHTML || $content[0].xml; // クロスブラウザ対応)
					var $html = $.parseHTML(content);
					$element.empty(); //ネイティブメソッドを使ってのDOM置き換えを行うとjQueryのキャッシュ上にエレメントがリークする為事前にempty()を呼ぶ
					$element[0].innerHTML = $html[0].innerHTML;
				}
				elements.push($element);
			});
			$.each(elements, function() {
				$.geui.createWidgets(this);
			});
		},
		_cleanError: function(element) {
			var renderKey = $.ge.property.get('gectrl.SystemError.Render.Key'),
				renderBlockKey = $.ge.property.get('gectrl.SystemError.Render.Block.Key');
			if (renderKey !== element && renderBlockKey !== element) return;
			$.ge.idSelector(element).remove();
			renderKey === element && $.geui.getSystemErrorContents().remove();
		},
		/**
		 * ページ上に存在しないコンテンツをbody要素配下に生成します。
		 *
		 * @author yamashita 2011/09/13
		 * @since 3.9.0
		 */
		_createContents: function($content) {
			var $element = null;
			$content.each(function() { // systemerror or その他コンテンツをロード
				var type = this.nodeName.toLowerCase();
				if (type !== '#comment') {
					$element = $(this.outerHTML || $(this)[0].xml); // クロスブラウザ対応。【outerHTMLを利用する理由】 $(this).html() == $(this)[0].innerHTMLは、名前空間が対象要素に自動挿入されている。この状態で、BODYにアペンドすると、（おそらく）ブラウザが拡張属性の名前空間を解決し、拡張属性のプレフィックスを勝手に除去する。このため、後工程のウィジェット化に失敗してしまう。
					$element.appendTo('body');
					return false;
				}
			});
			return $element;
		},
		/**
		 * 「改行コード×２」を「改行コード×１」へ変換します。
		 * これは、Ajax処理結果であるXmlHttpResponse#responseXMLに改行が含まれている場合、IE9-では「改行コード（厳密には'%0A'：ラインフィード）」が2倍となることに起因します。
		 * IE9+やFireFox、Chromeでは、想定通り改行コードは'%D%A'で取得できるため問題ありません。
		 *
		 * @param str 置換対象の文字列
		 * @author yamashita 2011/07/15
		 * @returns 置換後の文字列
		 * @since 3.12.0
		 */
		_escapeIE: function(str) {
			return window.unescape(window.escape(str).replace(/%0A%0A/g, '%0A'));
		}
	});

	function GServerAppException() {}
})(jQuery);

// Copyright 2012 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * ウィジェットの共通機能を定義します。
 *
 * @author T.Aono 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	$.widget('geui.gvariablewidgetbase', {
		/**
		 * ウィジェットのBaseスタイルクラスを表します。
		 *
		 * @private
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		_baseClass: '',
		/**
		 * ウィジェットのdisable状態のスタイルクラスを表します。
		 * @private
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		_disabledClass: '',
		/**
		 * ウィジェットのreadonly状態のスタイルクラスを表します。
		 * @private
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		_readonlyClass: '',
		/**
		 * Variable系ウィジェットかどうかを判断します。
		 */
		isVariable: true,
		/**
		 * ウィジェット生成時の初期値を表します。
		 * @private
		 */
		_creationValue: null,
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		options: {
			disabled: false,
			clear: true,
			readonly: false
		},
		/**
		 * ウィジェットの生成処理を行います。
		 *
		 * @private
		 * @author Y.Hamanaka 2011/06/20
		 * @since 3.9.0
		 */
		_create: function() {
			this.element.addClass(this._baseClass);
		},
		/**
		 * ウィジェットの初期化処理を行います。
		 *
		 * @private
		 * @author Y.Hamanaka 2011/06/20
		 * @since 3.9.0
		 */
		_init: function() {
			this._creationValue = this.val();
			this.refresh();
		},
		/**
		 * ウィジェットの値をクリアします。
		 *
		 * this.options.clear が true の場合のみ実施されます。
		 *
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		clear: function() {
			if (!this.options.clear) return;
			this.val('');
		},
		/**
		 * ウィジェットの値をリセットします。
		 *
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		reset: function() {
			this.val(this._creationValue);
		},
		/**
		 * ウィジェットの値を取得または設定します。
		 *
		 * @param value 設定値
		 * @return 設定値
		 * @author Y,Hamanaka 2011/07/09
		 * @since 3.9.0
		 */
		val: function() {
			if (!arguments || arguments.length <= 0) {
				return this.element.val();
			}
			this.element.val(arguments[0]);
		},
		/**
		 * ウィジェットのdisabledオプションを更新します。
		 *
		 * @private
		 * @param {boolean} disabled true:無効/false:有効
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		_setDisabled: function(disabled) {
			// $.Widget.disableの再起呼び出しによる無限ループを止めるため、
			// 設定済みの値と同じ値が渡されたときは処理を行わないようにする。
			if (this.options.disabled === disabled) {
				return;
			}
			this.options.disabled = !! disabled;
			this.refresh();
		},
		/**
		 * ウィジェットを有効化します。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		enable: function() {
			this._setDisabled(false);
		},
		/**
		 * ウィジェットを無効化します。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		disable: function() {
			this._setDisabled(true);
		},
		/**
		 * ウィジェットのreadonlyオプションを更新します。
		 *
		 * @private
		 * @param {boolean} readonly true:読取専用/false:読書き
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		_setReadonly: function(readonly) {
			// $.Widget.disableの再起呼び出しによる無限ループを止めるため、
			// 設定済みの値と同じ値が渡されたときは処理を行わないようにする。
			if (this.options.readonly === readonly) {
				return;
			}
			this.options.readonly = !! readonly;
			this.refresh();
		},
		/**
		 * ウィジェットを読取専用にします。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		readonly: function() {
			this._setReadonly(true);
		},
		/**
		 * ウィジェットを読書可能にします。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		readwrite: function() {
			this._setReadonly(false);
		},
		/**
		 * ウィジェットの状態をリフレッシュします。
		 *
		 * @author Y.Hamanaka 2011/06/14
		 * @since 3.9.0
		 */
		refresh: function() {
			this.element.attr($.ge.property.get('geui.XHtml.Ex.Attr.Clear'), !! this.options.clear);
			if (this.options.disabled) {
				this.element.addClass(this._disabledClass);
				this.element.removeClass(this._readonlyClass);
				this.element.prop('disabled', true);
				this.element.prop('readonly', false);
				$.Widget.prototype.disable.apply(this, arguments);
				return;
			}
			$.Widget.prototype.enable.apply(this, arguments);
			if (this.options.readonly) {
				this.element.removeClass(this._disabledClass);
				this.element.addClass(this._readonlyClass);
				this.element.prop('disabled', false);
				this.element.prop('readonly', true);
			} else {
				this.element.removeClass(this._disabledClass);
				this.element.removeClass(this._readonlyClass);
				this.element.prop('disabled', false);
				this.element.prop('readonly', false);
			}
		},
		/**
		 * ウィジェットの破棄処理を行います。
		 *
		 * @author Y.Hamanaka 2011/06/17
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.removeClass(this._baseClass);
			this.element.removeClass(this._disabledClass);
			this.element.removeClass(this._readonlyClass);
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);
/**
 *
 * @author T.Aono 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	/**
	 * フィールドタイプを保持
	 *
	 * @type {Object.<string>}
	 * @const
	 */
	var FIELD_TYPE = {
		field: 'field',
		label: 'label'
	};
	/**
	 * geui.gfieldwidgetbase クラス
	 *
	 * form の input 要素等のラベル表示、入力フィールド表示の切替処理のインターフェイス実装のWidget です。
	 * 本Widget を継承したWidgetクラスではWidget化対象のHTMLエレメントの種別に応じて処理をオーバライドしてください。
	 *
	 * @class フィールドウィジェットの基底クラス
	 * @extend {$.geui.gvariablewidgetbase}
	 * @author T.Aono 2011/03/11
	 * @since 3.9.0
	 */
	$.widget('geui.gfieldwidgetbase', $.geui.gvariablewidgetbase, {
		/**
		 * 子クラスは専用のlabelClassスタイルを設定しておく
		 * @private
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		_labelClass: '',
		/**
		 * widget設定
		 *   fieldType {string} フィールド種別を指定します。
		 */
		options: {
			fieldType: FIELD_TYPE.field
		},
		/**
		 * ラベル情報を設定するSPANエレメントを格納します。
		 * @private
		 */
		_label: null,

		/**
		 * 初期化処理を実行します。
		 *
		 * @private
		 * @author Y.Hamanaka 2011/05/10
		 * @since 3.9.0
		 */
		_create: function() {
			var thisObject = this;
			this.element.on('change.gfieldwidgetbase', function($event) {
				/*jshint unused:false*/
				thisObject.val(thisObject.val());
			});
			$.geui.gvariablewidgetbase.prototype._create.apply(this);
		},
		/**
		 * 表示種別を指定値で切替ます。
		 * 指定されたフィールド種別に設定を切替え、変更後のフィールド種別を返します.
		 *
		 * @private
		 * @param {string} fieldType フィールド種別
		 * @return フィールド種別
		 * @author Y.Hamanaka 2011/04/31
		 * @since 3.9.0
		 */
		_setFieldType: function() {
			if (arguments.length > 0) {
				if (FIELD_TYPE.field !== arguments[0] && FIELD_TYPE.label !== arguments[0]) {
					throw new Error('illegal parameter[' + arguments[0] + '].');
				}
				this.options.fieldType = arguments[0];
				this._trigger('changeFieldType', null, {
					fieldType: arguments[0]
				});
				this.refresh();
			}
			return this.options.fieldType;
		},
		/**
		 * このwidgetをラベル表示状態にします。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		changeLabel: function() {
			this._setFieldType(FIELD_TYPE.label);
		},
		/**
		 * このwidgetをフィールド表示状態にします。
		 *
		 * @author hamanaka 2011/07/01
		 * @since 3.9.0
		 */
		changeField: function() {
			this._setFieldType(FIELD_TYPE.field);
		},
		/**
		 * このwidgetを再表示します.<br>
		 * widgetの状態により表示内容を変更する場合は、このメソッドをオーバーライドしてください。
		 *
		 * @author Y.Hamanaka 2011/06/14
		 * @since 3.9.0
		 */
		refresh: function() {
			$.geui.gvariablewidgetbase.prototype.refresh.apply(this);
			if (this.options.fieldType === FIELD_TYPE.label) {
				if (!this._label) {
					this._label = $('<span/>').text(this.val() === null ? '' : this.val()).hide();
					this._label.addClass(this._labelClass);
					this.element.after(this._label);
					this.options.clear || $.geui.setClearFalse(this._label);
				}
				this.element.hide();
				this._label.show();
				this._label[0].style.display = 'inline';
			} else if (this.options.fieldType === FIELD_TYPE.field) {
				this.element.show();
				this.element[0].style.display = 'inline';
				if (this._label) {
					this._label.hide();
				}
			}
		},
		/**
		 * このwidgetの設定値を取得又は返します。
		 * widget固有の値を新たに定義する場合はこのメソッドをオーバーライドしてください。
		 *
		 * @param value 設定値
		 * @return 設定値
		 * @author Y,Hamanaka 2011/07/09
		 * @since 3.9.0
		 */
		val: function() {
			if (!arguments || arguments.length <= 0) {
				return $.geui.gvariablewidgetbase.prototype.val.apply(this, arguments);
			}
			if (this._label) {
				this._label.text(arguments[0]);
			}
			$.geui.gvariablewidgetbase.prototype.val.apply(this, arguments);
		},
		/**
		 * widget の破棄処理を実行します。
		 *
		 * @author Y.Hamanaka 2011/04/19
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.off('change.gfieldwidgetbase');
			this.element.show();
			if (this._label) {
				this._label.removeClass(this._labelClass);
				this._label.remove();
			}
			this._label = null;
			$.geui.gvariablewidgetbase.prototype.destroy.apply(this);
		}
	});
	$.geui.gfieldwidgetbase.prototype.FIELD_TYPE = FIELD_TYPE;
})(jQuery);

// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エレメントハンドラの共通機能を定義します。
 *
 * @author yamashita 2013/08/27
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler = $.geui.handler || {};
	$.extend($.geui.handler, {
		_handlerMap: {},
		/**
		 * 指定したキーに該当するハンドラクラスを取得します。
		 *
		 * @param key キー
		 * @return ハンドラクラス
		 * @author yamashita 2011/08/22
		 * @since 3.9.0
		 */
		get: function(key) {
			var handler = this._handlerMap[key ? key : ''];
			return handler ? handler : this._handlerMap[''];
		},
		set: function(key, handler) {
			this._handlerMap[key] = handler;
		}
	});
})(jQuery);

// Copyright 2013-2016 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * Variable系のデフォルトハンドラを定義します。
 *
 * @author yamashita 2013/08/27
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler.gvariablebasehandler = $.geui.handler.gvariablebasehandler || function() {};
	$.extend($.geui.handler.gvariablebasehandler.prototype, {
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author yamashita 2011/08/22
		 * @since 3.9.0
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			if (arguments.length <= 1) {
				return $element.val();
			}
			$element.val(value);
			$element.trigger('val.placeholderdecorator');
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値をクリアします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return 値
		 * @author yamashita 2013/08/27
		 * @since 3.12.0
		 */
		clear: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			if ($.geui.booleanAttr($element, $.ge.property.get('geui.XHtml.Ex.Attr.Clear'))) {
				this.val($element, '');
			}
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値をリセットします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @author yamashita 2013/08/27
		 * @since 3.12.0
		 */
		reset: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var initValue = $element.attr($.ge.property.get('geui.XHtml.Ex.Attr.Initvalue'));
			initValue !== undefined && this.val($element, initValue);
		}
	});
})(jQuery);

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

// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPLabelTag}専用のハンドラを定義します。
 *
 * @author yamashita 2011/08/22
 * @since 3.9.0
 */
(function($, undefined) {
	$.geui.handler.gplabelhandler = $.geui.handler.gplabelhandler || function() {};
	$.geui.handler.gplabelhandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gplabelhandler.prototype, {
		_MULTILINE_KEY: 'isMultiline',
		/**
		 * 指定された要素の初期値を、multiline属性値に応じて設定します。
		 *
		 * @param id id属性値
		 * @param options オプション文字列
		 * @author kikuchi 2014/09/03
		 * @since 3.16.0
		 */
		init: function(id, options) {
			var op = JSON.parse(options || 'null') || {}; // optionsに関数は詰められない前提
			var $element = $.geui.getElement(id);
			if (!$element.length) return;

			var initValue = $element.text();
			var $hidden = $.ge.idSelector($element.attr('id') + '_hdn');
			$hidden.val(initValue);
			$element.attr($.ge.property.get('geui.XHtml.Ex.Attr.Initvalue'), initValue);

			$element.data(this._MULTILINE_KEY, op.isMultiline);
			if (op.isMultiline === true) {
				$.geui.multiline($element);
			} else {
				$element.text(initValue);
			}
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author yamashita 2011/08/22
		 * @since 3.9.0
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var id = $element.attr('id');
			var $hidden = $.ge.idSelector(id + '_hdn');
			if (!arguments || arguments.length <= 1) {
				return $hidden[0] !== undefined ? $hidden.val() : $element.text();
			}
			$element.text(value);
			$hidden.val(value);
			if ($element.data(this._MULTILINE_KEY) === true) {
				$.geui.multiline($element);
			}
		}
	});
	$.geui.handler.set('gplabel', new $.geui.handler.gplabelhandler());
})(jQuery);

// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPLinkedLabelTag}専用のハンドラを定義します。
 *
 * @author yamashita 2013/03/12
 * @since 3.10.0.D
 */
(function($, undefined) {
	$.geui.handler.gplinkedlabelhandler = $.geui.handler.gplinkedlabelhandler || function() {};
	$.geui.handler.gplinkedlabelhandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gplinkedlabelhandler.prototype, {
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author yamashita 2013/03/12
		 * @since 3.10.0.D
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var id = $element.attr('id');
			var $hidden = $.ge.idSelector(id + '_hdn');
			if (!arguments || arguments.length <= 1) {
				return $hidden[0] !== undefined ? $hidden.val() : $element.text();
			}
			$element.text(value);
			$hidden.val(value);
		}
	});
	$.geui.handler.set('gplinkedlabel', new $.geui.handler.gplinkedlabelhandler());
})(jQuery);

// Copyright 2013-2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPMenuLinkedLabelTag}専用のハンドラを定義します。
 *
 * @author yamashita 2013/07/20
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler.gpmenulinkedlabelhandler = $.geui.handler.gpmenulinkedlabelhandler || function() {};
	$.geui.handler.gpmenulinkedlabelhandler.prototype = new $.geui.handler.gplinkedlabelhandler();
	$.extend($.geui.handler.gpmenulinkedlabelhandler.prototype, {
		/**
		 * アクションパラメータを装飾します。
		 *
		 * @author yamashita 2013/07/20
		 * @since 3.12.0
		 */
		decorateActionParam: function(event, options, $form) {
			var params = [],
				id = $form.attr('id') + '.menuid';
			var $element = $.ge.idSelector(id);
			$element.length && $element.remove();
			options.menuid ||
				params.push({
					name: 'menuid',
					value: null
				});
			return params;
		}
	});
	$.geui.handler.set('gpmenulinkedlabel', new $.geui.handler.gpmenulinkedlabelhandler());
})(jQuery);

// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPPasswordTag}専用のハンドラを定義します。
 *
 * @author kikuchi 2013/10/31
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler.set('gppassword', new $.geui.handler.gdefaulthandler());
})(jQuery);

// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPRadioTag}専用のハンドラを定義します。
 *
 * @author kikuchi 2013/09/24
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler.gpradiohandler = $.geui.handler.gpradiohandler || function() {};
	$.geui.handler.gpradiohandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gpradiohandler.prototype, {
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値をクリアします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return 値
		 * @author kikuchi 2013/11/01
		 * @since 3.12.0
		 */
		clear: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			if ($.geui.booleanAttr($element, $.ge.property.get('geui.XHtml.Ex.Attr.Clear'))) {
				$element.prop('checked', false);
			}
		}
	});
	$.geui.handler.set('gpradio', new $.geui.handler.gpradiohandler());
})(jQuery);

// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPRadioGroupTag}専用のハンドラを定義します。
 *
 * @author kawakami 2013/06/12
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler.gpradiogrouphandler = $.geui.handler.gpradiogrouphandler || function() {};
	$.geui.handler.gpradiogrouphandler.prototype = new $.geui.handler.gvariablebasehandler();
	var XHTML_ATTRIBUTE_RADIOGROUP_NAME = $.ge.property.get('geui.XHtml.Ex.Attr.RadioGroup');
	$.extend($.geui.handler.gpradiogrouphandler.prototype, {
		/**
		 * 指定されたgroup要素(HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定し、
		 * 指定されたgroup要素に所属するoptionのcheckedに反映します。
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author kawakami 2013/06/12
		 * @since 3.12.0
		 */
		val: function(groupelement, value) {
			var $group = $.geui.getElement(groupelement);
			if (!$group.length) return null;
			if (!arguments || arguments.length <= 1) {
				return $group.val();
			}

			$group.val(value);

			function syncChecked(group) {
				var CACHE_KEY = 'radiooptions',
					options = group.data(CACHE_KEY) || [];
				if (!options.length) {
					var selector = $.ge.escSelectorString(XHTML_ATTRIBUTE_RADIOGROUP_NAME);
					options = $('input[' + selector + '=\'' + group.attr('id') + '\']') || [];
					if (!options.length) {
						return;
					}
					group.data(CACHE_KEY, options);
				}
				$.each(options, function(index, option) {
					var $option = $(option);
					$option.prop('checked', $option.val() === $group.val());
				});
			}
			syncChecked($group);
		}
	});
	$.geui.handler.set('gpradiogroup', new $.geui.handler.gpradiogrouphandler());
})(jQuery);

// Copyright 2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPSelectTag}専用のハンドラを定義します。
 *
 * @author KCCS kikuchi 2014/06/24
 * @since 3.16.0
 */
(function($, undefined) {
	$.geui.handler.gpselecthandler = $.geui.handler.gpselecthandler || function() {};
	$.geui.handler.gpselecthandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gpselecthandler.prototype, {
		/**
		 * 指定された要素の初期値を設定します。
		 *
		 * @param id id属性
		 * @author KCCS kikuchi 2014/07/01
		 * @since 3.16.0
		 */
		init: function(id) {
			var $element = $.geui.getElement(id);
			if (!$element.length) return;
			var initValue = this.val($element);
			$element.attr($.ge.property.get('geui.XHtml.Ex.Attr.Initvalue'), initValue);
			this.val($element, initValue);
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author KCCS kikuchi 2014/06/24
		 * @since 3.16.0
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var id = $element.attr('id');
			var $hidden = $.ge.idSelector(id + '_hdn');
			if (!arguments || arguments.length <= 1) {
				var val = $element.val();
				if (val === null) { // HTML標準に準拠
					var options = $element.find('option');
					if (options.length > 0) {
						var selectedOps = options.filter(':selected');
						if (selectedOps.length > 0) {
							val = selectedOps.last().val();
						} else {
							val = options.first().val();
						}
					}
				}
				return val;
			}
			$element.val(value);
			$hidden.val(value);
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値をクリアします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return 値
		 * @author KCCS kikuchi 2014/06/24
		 * @since 3.16.0
		 */
		clear: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			if ($.geui.booleanAttr($element, $.ge.property.get('geui.XHtml.Ex.Attr.Clear'))) {
				this.val($element, $element.find('option:first').val());
			}
		}
	});
	$.geui.handler.set('gpselect', new $.geui.handler.gpselecthandler());
})(jQuery);

// Copyright 2013-2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPLabelTag}専用のハンドラを定義します。
 *
 * @author yamashita 2013/03/12
 * @since 3.10.0.D
 */
(function($, undefined) {
	$.geui.handler.gpcheckboxhandler = $.geui.handler.gpcheckboxhandler || function() {};
	$.geui.handler.gpcheckboxhandler.prototype = new $.geui.handler.gvariablebasehandler();
	/** チェック状態の値を設定します。 */
	var _CHECKED_VALUE = '1',
		_UNCHECKED_VALUE = '0';
	$.extend($.geui.handler.gpcheckboxhandler.prototype, {
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author yamashita 2013/03/12
		 * @since 3.10.0.D
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var id = $element.attr('id');
			var $hidden = $.ge.idSelector(id + '_hdn');
			if (!arguments || arguments.length <= 1) {
				return $element.prop('checked') ? _CHECKED_VALUE : _UNCHECKED_VALUE;
			}
			var val = typeof value === 'boolean' ? value ? _CHECKED_VALUE : _UNCHECKED_VALUE : value;
			$element.prop('checked', val === _CHECKED_VALUE); //set
			$hidden.val(val);
		},
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値をクリアします。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @return 値
		 * @author kikuchi 2014/03/31
		 * @since 3.13.0
		 */
		clear: function(element) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			if ($.geui.booleanAttr($element, $.ge.property.get('geui.XHtml.Ex.Attr.Clear'))) {
				this.val($element, _UNCHECKED_VALUE);
			}
		}
	});
	$.geui.handler.set('gpcheckbox', new $.geui.handler.gpcheckboxhandler());
})(jQuery);

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

// Copyright 2013 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPHiddenTag}専用のハンドラを定義します。
 *
 * @author kikuchi 2013/09/24
 * @since 3.12.0
 */
(function($, undefined) {
	$.geui.handler.set('gphidden', new $.geui.handler.gdefaulthandler());
})(jQuery);

// Copyright 2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPImgTag}専用のハンドラを定義します。
 *
 * @author KCCS kikuchi 2014/07/16
 * @since 3.16.0
 */
(function($, undefined) {
	$.geui.handler.gpimghandler = $.geui.handler.gpimghandler || function() {};
	$.geui.handler.gpimghandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gpimghandler.prototype, {
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author KCCS kikuchi 2014/07/16
		 * @since 3.16.0
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var id = $element.attr('id');
			var $hidden = $.ge.idSelector(id + '_hdn');
			if (!arguments || arguments.length <= 1) {
				return $element.attr('src');
			}
			$element.attr('src', value);
			$hidden.val(value);
		}
	});
	$.geui.handler.set('gpimg', new $.geui.handler.gpimghandler());
})(jQuery);

// Copyright 2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPLinkedImgTag}専用のハンドラを定義します。
 *
 * @author KCCS kikuchi 2014/07/22
 * @since 3.16.0
 */
(function($, undefined) {
	$.geui.handler.gplinkedimghandler = $.geui.handler.gplinkedimghandler || function() {};
	$.geui.handler.gplinkedimghandler.prototype = new $.geui.handler.gvariablebasehandler();
	$.extend($.geui.handler.gplinkedimghandler.prototype, {
		/**
		 * 指定された要素（HTMLエレメント または id属性 または JQueryオブジェクト）の値を取得または設定します。
		 *
		 * @param element HTMLエレメント または id属性 または JQueryオブジェクト
		 * @param value 値
		 * @return 値
		 * @author KCCS kikuchi 2014/07/22
		 * @since 3.16.0
		 */
		val: function(element, value) {
			var $element = $.geui.getElement(element);
			if (!$element.length) return;
			var id = $element.attr('id');
			var $hidden = $.ge.idSelector(id + '_hdn');
			if (!arguments || arguments.length <= 1) {
				return $element.find('img').attr('src');
			}
			$element.find('img').attr('src', value);
			$hidden.val(value);
		}
	});
	$.geui.handler.set('gplinkedimg', new $.geui.handler.gplinkedimghandler());
})(jQuery);

// Copyright 2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * {GPTextareaTag}専用のハンドラを定義します。
 *
 * @author KCCS kikuchi 2014/09/23
 * @since 3.16.0
 */
(function($, undefined) {
	$.geui.handler.set('gptextarea', new $.geui.handler.gdefaulthandler());
})(jQuery);

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

// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * jquery.numberformatter - Formatting/Parsing Numbers in jQuery
 *
 * Copyright 2011 Michael Abernethy, Andrew Parry
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/
/**
 * ナンバーウィジェットを定義します。
 *
 * @author T.Aono 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'ui-widget ui-widget-content ui-corner-all geui-grsnumber',
		disabledClass = 'ui-state-disabled geui-grsnumber-disabled',
		readonlyClass = 'geui-grsnumber-readonly',
		labelClass = 'geui-grsnumber-label';
	/**
	 * geui.grsnumber ウィジェットクラス
	 *
	 * ダイアログ表示用のウィジェット です。
	 *
	 * @extend {$.geui.gformatwidgetbase}
	 * @author T.Aono 2011/3/11
	 * @since 3.9.0
	 */
	$.widget('geui.grsnumber', $.geui.grstext, {
		_baseClass: baseClass,
		_disabledClass: disabledClass,
		_readonlyClass: readonlyClass,
		_labelClass: labelClass,
		/**
		 * オプションを定義します。
		 *
		 * @author yamashita 2011/06/25
		 * @since 3.9.0
		 */
		options: {
			locale: null
		},

		/**
		 * 生成処理を行います。
		 *
		 * @private
		 * @author kobayashi 2011/06/25
		 * @since 3.9.0
		 */
		_create: function() {
			this.options.locale = this.options.locale || $.ge.locale;
			var regional = $.geui.grsnumber.regional[this.options.locale] || $.geui.grsnumber.defaults;
			this.options = $.extend({}, regional, this.options);
			$.geui.grstext.prototype._create.call(this);
			var self = this;
			this.element.on('focus.grsnumber', function() {
				if (!self.options.readonly && !self.options.disabled) {
					var value = self._parseNumber(self.val(), self.options);
					setTimeout(function() {
						if (self.element.is(':focus')) {
							var pos = self._getCaretPosition();
							if (pos.start === 0 && pos.end === self.element[0].value.length) {
								self.val(value ? value : '');
								$(self.element[0]).trigger('select');
							} else if (pos.start === pos.end) {
								self.val(value ? value : '');
								self._setCaretPosition(pos);
							}
						}
					}, 0);
				}
			});
			this.element.on('blur.grsnumber', function() {
				if (!self.options.readonly && !self.options.disabled) {
					var value = self._formatNumber(self.val(), self.options);
					self.val(value ? value : '');
				}
			});
			this.element.on('keypress.grsnumber', function($event) {
				var input = $event.charCode ? String.fromCharCode($event.charCode) : String.fromCharCode($event.which);
				if (!input) {
					return;
				}
				if (input.match(/[A-z]/ig)) {
					if ($event.ctrlKey) {
						return true;
					}
					$event.preventDefault();
				}
			});
		},

		/**
		 * 初期化処理を行います。
		 *
		 * @private
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		_init: function() {
			//this._extendOptions();
			this.val(this._parseNumber(this.val(), this.options));
			this.val(this._formatNumber(this.val(), this.options));
			$.geui.grstext.prototype._init.apply(this);
		},
		/**
		 * 破棄処理を行います。
		 *
		 * @author T.Aono 2011/03/31
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.off('focus.grsnumber');
			this.element.off('blur.grsnumber');
			this.element.off('keypress.grsnumber');
			this.val(this._parseNumber(this.val(), this.options));
			$.geui.grstext.prototype.destroy.apply(this);
		},
		/**
		 * 数値の文字列をフォーマットします。
		 *
		 * @private
		 * @author kobayashi 2011/07/04
		 * @since 3.9.0
		 */
		_formatNumber: function(numberString, options) {
			if (!numberString) {
				return null;
			}
			if (!numberString.match(/^[-]?[0-9]+([\.0-9]+)?$/ig)) {
				return numberString;
			}
			// 0トリム実行し数値文字列比較が実行できるようにする
			var checkString = numberString.match(/\./i) ? numberString.replace(/^[ 　0]*/ig, '').replace(/[ 　0]*$/ig, '') : numberString.replace(/^[ 　]*/ig, '').replace(/[ 　]*$/ig, '');
			checkString = numberString.match(/^-/i) ? checkString.replace(/^[-]?0+/ig, '-') : checkString.replace(/^[-]?0+/ig, '');
			checkString = checkString.replace(/^\./i, '0.');
			checkString = checkString.replace(/\.$/i, '');
			var number = Number(checkString);
			if (isNaN(number) || checkString !== number.toString() || number >= Number.MAX_VALUE && number <= Number.MIN_VALUE) {
				return numberString;
			}

			var returnString = '';
			if (numberString.indexOf('.') === -1) {
				numberString += '.';
			}
			var digit = numberString.lastIndexOf('.');
			if (options.format.indexOf('.') > -1) {
				var decimalPortion = options.dec;
				var decimalFormat = options.format.substring(options.format.lastIndexOf('.') + 1);

				// round or truncate number as needed
				numberString = options.round ? number.toFixed(decimalFormat.length) : numberString.substring(0, digit + decimalFormat.length + 1);

				for (var i = 0, ilength = digit + decimalFormat.length + 1; i < ilength; i++) {
					if (!numberString.charAt(i)) numberString += '0';
				}
				var decimalString = numberString.substring(numberString.lastIndexOf('.') + 1);

				for (var j = 0, jlength = decimalFormat.length; j < jlength; j++) {
					if (decimalFormat.charAt(j) === '#' && decimalString.charAt(j) !== '0') {
						decimalPortion += decimalString.charAt(j);
						continue;
					} else if (decimalFormat.charAt(j) === '#' && decimalString.charAt(j) === '0') {
						var notParsed = decimalString.substring(j);
						if (notParsed.match('[1-9]')) {
							decimalPortion += decimalString.charAt(j);
							continue;
						} else
							break;
					} else if (decimalFormat.charAt(j) === '0')
						decimalPortion += decimalString.charAt(j);
				}
				returnString += decimalPortion;
				if (!decimalFormat.match(/[^#]/i) && returnString.match(/\.$/i)) {
					returnString = returnString.replace(/\.$/i, '');
				}
			} else {
				if (options.round === true) {
					number = Math.round(number);
				}
			}

			var ones = Math.floor(number);
			if (number < 0)
				ones = Math.ceil(number);

			var onesFormat = '';
			if (options.format.indexOf('.') === -1)
				onesFormat = options.format;
			else
				onesFormat = options.format.substring(0, options.format.indexOf('.'));

			var onePortion = '';
			if (!(ones === 0 && onesFormat.substr(onesFormat.length - 1, 1) === '#')) {
				// find how many digits are in the group
				var oneText = String(Math.abs(ones));
				var groupLength = 9999;
				if (onesFormat.lastIndexOf(',') !== -1)
					groupLength = onesFormat.length - onesFormat.lastIndexOf(',') - 1;
				var groupCount = 0;
				for (var k = oneText.length - 1; k > -1; k--) {
					onePortion = oneText.charAt(k) + onePortion;
					groupCount++;
					if (groupCount === groupLength && k !== 0) {
						onePortion = options.group + onePortion;
						groupCount = 0;
					}
				}
			}

			returnString = onePortion + returnString;

			if (number < 0)
				returnString = options.neg + returnString;
			return returnString;

		},
		/**
		 * フォーマットされた数値の文字列を変換します。
		 *
		 * @private
		 * @author kobayashi 2011/07/04
		 * @since 3.9.0
		 */
		_parseNumber: function(numberString, options) {
			if (!numberString) {
				return null;
			}
			var valid = '1234567890.-,' + options.dec + options.group + options.neg;
			if (numberString.match(new RegExp(valid, 'ig'))) {
				return numberString;
			}
			var returnString = numberString.replace(new RegExp(options.group, 'ig'), '');
			returnString = returnString.replace(options.dec, '.').replace(options.neg, '-');
			returnString = returnString.match(/\./i) ? returnString.replace(/^[ 　0]*/ig, '').replace(/[ 　0]*$/ig, '') : returnString.replace(/^[ 　]*/ig, '').replace(/[ 　]*$/ig, '');
			returnString = returnString.replace(/^\./i, '0.');
			returnString = returnString.replace(/\.$/i, '');
			return returnString;
		},
		/**
		 * このwidgetの設定値を取得又は返します。
		 * widget固有の値を新たに定義する場合はこのメソッドをオーバーライドしてください。
		 *
		 * @param value 設定値
		 * @return 設定値
		 * @author kobayashi 2011/07/18
		 * @since 3.9.0
		 */
		number: function() {
			if (!arguments || arguments.length <= 0) {
				return Number($.geui.gfieldwidgetbase.prototype.val.apply(this, arguments));
			}
			$.geui.gfieldwidgetbase.prototype.val.apply(this, arguments);
		},
		_setOptions: function(options) {
			var self = this;
			var opts = options;
			if (options && options.locale !== self.options.locale) {
				var regional = $.geui.grsnumber.regional[options.locale];
				opts = $.extend({}, regional, options);
			}
			$.each(opts, function(key, opt) {
				self._setOption(key, opt);
			});
			return self;
		},
		/**
		 * キャレット位置を取得します。
		 *
		 * @author kikuchi 2015/08/21
		 * @since 3.16.0
		 */
		_getCaretPosition: function() {
			var element = this.element[0];
			var position = {
				start: 0,
				end: 0
			};
			if (element.setSelectionRange) {
				position = {
					start: element.selectionStart,
					end: element.selectionEnd
				};
			} else if (document.selection) { // IE8
				var range = document.selection.createRange();
				var length = range.text.length;
				var textRange = element.createTextRange();
				var allLength = textRange.text.length;
				textRange.setEndPoint('StartToStart', range);
				var startPosition = allLength - textRange.text.length;
				var endPosition = startPosition + length;

				position = {
					start: startPosition,
					end: endPosition
				};
			}
			return position;
		},
		/**
		 * キャレット位置を設定します。
		 *
		 * @author kikuchi 2015/08/21
		 * @since 3.16.0
		 */
		_setCaretPosition: function(position) {
			var element = this.element[0];
			if (element.setSelectionRange) {
				element.selectionEnd = position.end;
				element.selectionStart = position.start;
			} else if (document.selection) { // IE8
				var range = element.createTextRange();
				range.collapse();
				range.moveEnd('character', position.end);
				range.moveStart('character', position.start);
				range.trigger('select');
			}
		}
	});
	$.extend($.geui.grsnumber, {
		defaults: { // Global defaults
			format: '#,##0.00',
			locale: 'en',
			round: true,
			dec: '.',
			group: ',',
			neg: '-'
		},
		regional: { // Localisations
			'': { // English
				format: '#,##0.00',
				locale: 'en',
				round: true,
				dec: '.',
				group: ',',
				neg: '-'
			}
		}
	});
	$.extend($.geui.grsnumber.defaults, $.geui.grsnumber.regional['']);
})(jQuery);

// Copyright 2013-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * Dateウィジェットを定義します。
 * （以下、本ウィジェットを「Dateウィジェット」と呼ぶ）
 *
 * アーキテクチャの概要
 * ・Dateウィジェットは、$.datepickerと$.geui.grstextを継承している。
 * ・Dateウィジェットのコンストラクタは、$.geui.grdateである。
 * ・差分のメソッドは、$.datepickerを拡張することで追加している。※1
 * ・$.geui.grdate.prototypeにも、差分のメソッドを一部追加している。※2
 * ・$.fn.grdateは、メソッド実行のインターフェースである。※3（$.fn.datepickerに習って実装）
 *
 * ※1.
 * $.datepickerは、全カレンダーで共有するインスタンスであり、"共通状態"を"クロージャ"として保持している。
 * そのため複製できず、機能追加するためには、$.datepickerそのものを拡張せざるをえない。
 * ※2.
 * Dateウィジェットのベースクラス($.geui.grstext)のメソッドや、$.geuiが持つユーティリティ的なメソッドは、インスタンスから直接メソッドを呼び出す。※3
 * そのため、インスタンス側にもメソッド実行のためのインターフェースが必要となる。
 * ※3.
 * 通常のメソッド実行：$element.grdate('method') ⇒ $.fn.grdate('method')が実行される。
 * インスタンスから直接メソッド実行：$element.data('geui-grdate').method() ⇒ $.geui.grdateのprototypeに定義したメソッドが実行される。
 *
 *
 * その他詳細について
 * ・$.geui.grstextを継承する際、インスタンスをnewしている理由
 * ベースクラスをインスタンス化して継承しないとプロトタイプチェーンが作れないため。
 * ベースのオプションを変更しないために、クローンで置き換えている。（base.optionsは、ベースクラスのoptionsを"参照"しているため）
 *
 * ・bindings / hoverable / focasableについて
 * ウィジェットが標準で保持する変数。それぞれ「イベントがバインドされている要素の集合」「mouseoverしたらスタイルクラスが切り替わる要素の集合」「focusしたらスタイルクラスが切り替わる要素の集合」を示す
 * ウィジェット標準のdestroyメソッド内で破棄される。undefindeではエラーがでるため、Dateウィジェットでも定義している。
 *
 *
 * @author kikuchi 2013/06/13
 * @since 3.12.0
 */
(function($, undefined) {
	var baseClass = 'ui-widget ui-widget-content ui-corner-all geui-grdate',
		disabledClass = 'ui-state-disabled geui-grdate-disabled',
		readonlyClass = 'geui-grdate-readonly',
		labelClass = 'geui-grdate-label';

	var PROP_NAME = 'geui-grdate';
	var uuid = 0;
	var widgetName = 'grdate';
	var calledByConstructor = false;

	$.geui.grdate = function(options, element) {
		try {
			var $element = $(element);
			this.element = $element;
			this.widgetName = widgetName;
			this.uuid = uuid++;
			this.eventNamespace = '.' + this.widgetName + this.uuid;
			var self = this;

			var locale = options.locale || this.options.locale || $.ge.locale;
			var regional = $.datepicker.regional[locale];
			this.options = $.extend({}, regional, this.options, options);

			$element.addClass(baseClass);
			this._hidden = $.ge.idSelector($element.attr('id') + '_hdn');
			if (this._hidden[0] === undefined) {
				this._creationName = this.element.attr('name') || this.element.attr('id');
				this.element.removeAttr('name');
				this._appendHidden();
			} else {
				this._creationName = this._hidden.attr('name') || this.element.attr('id');
			}
			$element.on('change.grdate', function($event) {
				/*jshint unused:false*/
				self.val(self.val());
			});
			if (this.options.disabled) {
				this._hidden.removeAttr('name');
			}
			calledByConstructor = true;
			$element.grdate(this.options);
			$.extend(this, getInstance(element));

			this._creationValue = $element.val();
			// $.datepickerのrefreshは不要（インスタンス生成時に同時に行われるため）
			$.geui.grstext.prototype.refresh.call(this);
			this.val(this.val());
		} finally {
			calledByConstructor = false;
		}
	};
	// プロトタイプチェーンのため、ベースクラスをインスタンス化（最上部コメント参照）
	var base = new $.geui.grstext();
	base.options = $.extend({}, base.options);
	$.geui.grdate.prototype = $.widget.extend(base, {
		_baseClass: baseClass,
		_disabledClass: disabledClass,
		_readonlyClass: readonlyClass,
		_labelClass: labelClass,

		bindings: $(), //$.Widget.destroyでのエラー回避（最上部コメント参照）
		hoverable: $(), //$.Widget.destroyでのエラー回避（最上部コメント参照）
		focusable: $(), //$.Widget.destroyでのエラー回避（最上部コメント参照）
		options: {
			locale: null,
			showButtonPanel: true
		},
		_initDatepicker: function(target, options) {
			var inst = getInstance(target);
			var opt = options;
			if (options && options.locale !== inst.options.locale) {
				var locale = options.locale;
				var regional = $.datepicker.regional[locale];
				opt = $.extend({}, regional, options);
			}
			$.extend(inst.options, opt);
			$.datepicker._attachDatepicker(target, options);
			$.geui.grstext.prototype._init.call(inst);
		},
		_appendHidden: function() {
			if (this._hidden && this._hidden[0]) return;
			this._hidden = $('<input>')
				.attr('id', this.element.attr('id') + '_hdn')
				.attr('type', 'hidden')
				.val(this.element.val())
				.attr($.ge.property.get('geui.XHtml.Ex.Attr.Clear'), 'false');
			if (!this.options.disabled && this._creationName) {
				this._hidden.attr('name', this._creationName);
			}
			this.element.after(this._hidden);
		},
		_removeHidden: function() {
			if (!this._hidden) return;
			this._hidden.remove();
			this._hidden = null;
		},
		val: function() {
			if (!arguments || arguments.length <= 0) {
				return $.datepicker._valDatepicker(this.element[0]);
			}
			$.datepicker._valDatepicker(this.element[0], arguments[0], arguments[1]);
		},
		clear: function() {
			$.datepicker._clearDatepicker(this.element[0]);
		},
		reset: function() {
			$.datepicker._resetDatepicker(this.element[0]);
		},
		refresh: function() {
			$.datepicker._refreshDatepicker(this.element[0]);
		},
		destroy: function() {
			$.datepicker._destroyDatepicker(this.element[0]);
		},
		_setOption: function(key, value) {
			this.options[key] = value;
			this.settings[key] = value;
			if (key === 'disabled') {
				this.element
					.toggleClass(this.widgetFullName + '-disabled ui-state-disabled', !! value)
					.attr('aria-disabled', value);
			}
			return this;
		}
	});
	$.extend($.datepicker, {
		//#### CUSTOMIZE [2013/07/23][kikuchi] IEにおいて、閉じるボタン押下すると、カレンダーが閉じた後に再びポップアップする問題を解消 [start] ####
		_cancelShow: false,
		_hideDatepicker: function(input) {
			if ($.datepicker._curInst && $.datepicker._curInst.settings.showOn !== 'button') { //'button':showOnの許可値(focus/button/both)に対応
				if ($.datepicker._datepickerShowing) {
					$.datepicker._cancelShow = true;
				}
			}
			$.datepicker.__proto__._hideDatepicker.call($.datepicker, input);
		},
		_showDatepicker: function(input) {
			if ($.datepicker._cancelShow) {
				$.datepicker._cancelShow = false;
				return;
			}
			$.datepicker.__proto__._showDatepicker.call($.datepicker, input);
		},
		//#### CUSTOMIZE [2013/07/23][kikuchi] IEにおいて、閉じるボタン押下すると、カレンダーが閉じた後に再びポップアップする問題を解消 [end] ####
		_attachDatepicker: function(target, settings) {
			var nodeName, inline, inst;
			nodeName = target.nodeName.toLowerCase();
			inline = (nodeName === 'div' || nodeName === 'span');
			if (!target.id) {
				this.uuid += 1;
				target.id = 'dp' + this.uuid;
			}
			inst = this._newInst($(target), inline);
			inst.settings = $.extend({}, settings || {});
			inst.options = inst.settings;
			inst.element = inst.input;
			if (nodeName === 'input') {
				this._connectDatepicker(target, inst);
			} else if (inline) {
				this._inlineDatepicker(target, inst);
			}
		},
		_valDatepicker: function(target, value) {
			/*jshint unused:false*/
			var inst = getInstance(target);
			if (!arguments || arguments.length <= 1) {
				return inst.input.val();
			}
			inst.input.val(arguments[1]);
			inst._label && inst._label.text(arguments[1]);
			inst._hidden && inst._hidden.val(this._valDatepicker(target));
		},
		_clearDatepicker: function(target) {
			var inst = getInstance(target);
			if (!inst.options.clear) return;
			$.datepicker._valDatepicker(target, '');
		},
		_resetDatepicker: function(target) {
			var inst = getInstance(target);
			$.datepicker._valDatepicker(target, inst._creationValue);
		},
		_enableDatepicker: function(target) {
			var inst = getInstance(target);
			if (!inst.options.readonly) {
				$.datepicker.__proto__._enableDatepicker.call($.datepicker, target);
			}
			$.geui.grstext.prototype._setDisabled.call(inst, false);
		},
		_disableDatepicker: function(target) {
			var inst = getInstance(target);
			$.datepicker.__proto__._disableDatepicker.call($.datepicker, target);
			$.geui.grstext.prototype._setDisabled.call(inst, true);
		},
		_readonlyDatepicker: function(target) {
			var inst = getInstance(target);
			$.datepicker.__proto__._disableDatepicker.call($.datepicker, target);
			if (!inst.options.disabled) {
				target.disabled = false;
				inst.input.prop('readonly', true);
			}
			$.geui.grstext.prototype._setReadonly.call(inst, true);
		},
		_readwriteDatepicker: function(target) {
			var inst = getInstance(target);
			if (!inst.options.disabled) {
				$.datepicker.__proto__._enableDatepicker.call($.datepicker, target);
			}
			inst.input.prop('readonly', false);
			$.geui.grstext.prototype._setReadonly.call(inst, false);
		},
		_refreshDatepicker: function(target) {
			var inst = getInstance(target);
			$.datepicker.__proto__._refreshDatepicker.call($.datepicker, target);

			$.geui.grstext.prototype.refresh.apply(inst, arguments);

			if (inst.settings.disabled) {
				$.geui.grstext.prototype.disable.apply(inst, arguments);
				$.datepicker._disableDatepicker(target);
				inst._hidden && inst._hidden.removeAttr('name');
				return;
			}
			if (inst.settings.readonly) {
				$.datepicker._enableDatepicker(target);
				$.datepicker._readonlyDatepicker(target);
			} else {
				$.datepicker._enableDatepicker(target);
				$.datepicker._readwriteDatepicker(target);
			}
			inst._hidden && inst._hidden.attr('name', inst._creationName);
		},
		_destroyDatepicker: function(target) {
			var inst = getInstance(target);
			$.datepicker.__proto__._destroyDatepicker.call($.datepicker, target);
			inst.input.off('change.grdate');
			$.geui.grstext.prototype.destroy.apply(inst);
			inst._removeHidden();
		},
		_optionDatepicker: function(target, name, value) {
			var inst = getInstance(target);

			if (arguments.length === 2 && typeof name === 'string') {
				return $.geui.grstext.prototype.option.call(inst, name);
			}
			$.datepicker.__proto__._optionDatepicker.apply($.datepicker, arguments);
			$.geui.grstext.prototype.option.apply(inst, [name, value]);

			var settings = name || {};
			if (typeof name === 'string') {
				settings = {};
				settings[name] = value;
			}
			if ('readonly' in settings) {
				if (settings.readonly) {
					this._readonlyDatepicker(target);
				} else {
					this._readwriteDatepicker(target);
				}
			}
			this._valDatepicker(target, this._valDatepicker(target));
		},
		_connectDatepicker: function(target, inst) {
			$.datepicker.__proto__._connectDatepicker.apply($.datepicker, arguments);
			if (inst.settings.readonly) {
				$.datepicker._readonlyDatepicker(target);
			}
		},
		_inlineDatepicker: function(target, inst) {
			$.datepicker.__proto__._inlineDatepicker.apply($.datepicker, arguments);
			if (inst.settings.readonly) {
				$.datepicker._readonlyDatepicker(target);
			}
		}
	});

	function getInstance(target) {
		return $.data(target, PROP_NAME);
	}
	$.fn.grdate = function(options) {

		/* Verify an empty collection wasn't passed - Fixes #6976 */
		if (!this.length) {
			return this;
		}

		/* Initialise the date picker. */
		if (!$.datepicker.initialized) {
			$(document).on('mousedown', $.datepicker._checkExternalClick);
			$.datepicker.initialized = true;
		}

		/* Append datepicker main container to body if not exist. */
		if ($.ge.idSelector($.datepicker._mainDivId).length === 0) {
			$('body').append($.datepicker.dpDiv);
		}

		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options === 'string' && (options === 'isDisabled' || options === 'getDate' || options === 'widget' || options === 'val')) {
			return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
		}
		if (options === 'option' && arguments.length === 2 && typeof arguments[1] === 'string') {
			return $.datepicker['_' + options + 'Datepicker'].
			apply($.datepicker, [this[0]].concat(otherArgs));
		}
		if (typeof options === 'string') {
			return this.each(function() {
				$.datepicker['_' + options + 'Datepicker'].
				apply($.datepicker, [this].concat(otherArgs));
			});
		}
		//MethodCallでない場合
		if (calledByConstructor) { //$.geui.createWidgetからウィジェット化された場合
			return this.each(function() {
				$.datepicker._attachDatepicker(this, options);
			});
		} else { //直接ウィジェット化された場合
			return this.each(function() {
				var instance = getInstance(this);
				if (instance) {
					$.geui.grdate.prototype._initDatepicker(this, options); //initのケース
				} else {
					$.data(this, PROP_NAME, new $.geui.grdate($.extend({}, options), this)); //createのケース
				}
			});
		}
	};
})(jQuery);

// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * Dialogウィジェットを定義します。
 *
 * @author yamashita 2011/03/31
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'geui-grdialog';
	/**
	 * geui.grdialog ウィジェットクラス
	 *
	 * ダイアログ表示用のウィジェットです。
	 *
	 * @extend {$.ui.dialog}
	 * @author yamashita 2011/3/11
	 * @since 3.9.0
	 */
	$.widget('geui.grdialog', $.ui.dialog, {
		_baseClass: baseClass,
		_clone: null,
		/**
		 * オプションを表します。
		 *
		 * @author kikuchi 2013/5/31
		 * @since 3.12.0
		 */
		options: {
			autoReset: true,
			focus: null
		},
		/**
		 * 生成処理を行います。
		 *
		 * @author yamashita 2011/3/11
		 * @since 3.9.0
		 */
		_create: function() {
			this._clean();
			var self = this;
			// setTimeout()を利用してダイアログ初期状態のキャッシュ作成のタイミングを遅らせています。
			// ※実行キューの順序保障のため（ダイアログが内包する全てのHTML要素にイベントがバインドされた後、クローンを作成する）
			// 【詳細説明】
			// ①タイミングを遅らせる理由
			//   ウィジェット化処理・イベントバインド処理は、$(document).ready()のタイミングで実行される。（DOM構築後のタイミング）
			//   イベントバインド処理よりも先に、ウィジェット化処理（このメソッド）が実行される。
			//   このタイミング(_create)でクローンを作成しても、HTML要素にイベントはバインドされていないため、クローン作成のタイミングをイベントバインド後まで遅らせる必要がある。
			// ②setTimeout()を使用する理由
			//   javascriptはシングルスレッドである。（実行キューを1つだけしか持っていない）
			//   $(document).ready()のタイミングで、ウィジェット化処理・イベントバインド処理が「実行キュー」に登録される。（1度キューに登録された処理の実行順番は不変となる）
			//   setTimeout()は、実行キューにたまっている処理が完了後、指定秒待ってから引数のファンクションを実行するメソッドである。
			// ⇒つまり、下記の処理は、「（実行キューに登録済の）"ウィジェット化・イベントバインド処理"が終了次第、ただちにクローンを作成しろ」という命令となる。
			setTimeout(function() {
				$.geui.destroyWidgets(self.element);
				self._clone = self.element.clone(true);
			}, 0);
			this.element.addClass(this._baseClass);
			$.ui.dialog.prototype._create.call(this);
		},
		/**
		 * 初期化処理を行います。
		 *
		 * @author kikuchi 2013/5/31
		 * @since 3.12.0
		 */
		_init: function() {
			var self = this;
			// setTimeout()を利用して_initのタイミングを遅らせています。
			// ※実行キューの順序保障のため（autoReset機能を利用する場合、ダイアログを初期化した後にダイアログをオープンさせる）
			// 【詳細説明】
			//   autoOpen機能を利用する場合、_initのタイミングでダイアログがオープンされる。(jqueryui の仕様）
			//   さらにautoReset機能を利用することを想定すると、オープン前にダイアログを初期化する必要がある。
			//   しかし、_initのタイミングではクローンが作成されていない。（_create:のコメント参照）
			//   そのため下記の処理では、_initのタイミングを遅らせることで、クローン作成後にダイアログがオープンするようにしている。
			setTimeout(function() {
				$.ui.dialog.prototype._init.call(self);
			}, 0);
		},
		/**
		 * ダイアログのコンテンツをオープンします。
		 *
		 * @author kikuchi 2013/06/05
		 * @since 3.12.0
		 */
		open: function() {
			if (this.isOpen()) {
				return;
			}

			if (this.options.autoReset) {
				this.element
					.empty()
					.append(this._clone.children().clone(true));
			}
			$.geui.createWidgets(this.element);
			$.ui.dialog.prototype.open.call(this);
			if ( !! this.options.focus) {
				var hasFocus = $.ge.idSelector(this.options.focus, this.element);
				if (hasFocus.length > 0) {
					hasFocus.eq(0).trigger('focus');
				}
			}
		},
		/**
		 * 破棄処理を行います。
		 *
		 * @author yamashita 2011/3/11
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element
				.off('.dialog')
				.off(this.widgetName + 'open')
				.removeClass(this._baseClass);
			this.widget().off('.dialog')
				.off(this.widgetName + 'open');
			$.ui.dialog.prototype.destroy.apply(this, arguments);
			$.Widget.prototype.destroy.apply(this, arguments); //destroy()の最後で実行する必要あり
		},
		/**
		 * 不要なdiv要素を除去します。
		 * ※ajax時にダイアログがレンダリングされている場合に複数回ajaxを実行すると、
		 * ダイアログがウィジェット化される度に、ウィジェットを構成するdiv要素がbody下部に溜まっていくため
		 *
		 * @author kikuchi 2013/5/31
		 * @since 3.12.0
		 */
		_clean: function() {
			var self = this;
			$('div #' + $.ge.escSelectorString(this.element.attr('id'))).each(function() {
				this !== self.element[0] && $(this).remove();
			});
		}
	});
})(jQuery);

// Copyright 2011-2014 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * ズームダイアログウィジェットを定義します。
 *
 * @author yamashita 2011/04/23
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'geui-grzoomdialog';
	/**
	 * geui.grzoomdialog ウィジェットクラス
	 *
	 * Zoomダイアログ表示用のウィジェットです。
	 *
	 * @extend {$.geui.grdialog}
	 * @author yamashita 2011/04/23
	 * @since 3.9.0
	 */
	$.widget('geui.grzoomdialog', $.geui.grdialog, {
		_baseClass: baseClass,
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		options: {
			modal: true,
			autoOpen: false,
			params: null,
			receives: null,
			returns: null,
			currentEvent: null,
			isTriggeredFromDialog: false, // ダイアログ上で発火された通信処理の場合、trueを返却
			openTriggerElement: null, // ダイアログをオープンしたトリガHTMLのID属性を示す
			openTriggerEventType: null // ダイアログをオープンした時のイベント属性を示す
		},
		/**
		 * ズーム画面を表示する際に引き渡すパラメータを追加します。
		 *
		 * @param event イベント
		 * @param options オプション
		 *           name : パラメータ名
		 *           element : 値の取得元エレメントID
		 *           value : パラメータ値
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		addParam: function(event, options) {
			!this.options.params && (this.options.params = []);
			this.options.params.push({
				name: options.name,
				value: options.element ? $.geui.val(options.element) : options.value
			});
		},
		/**
		 * ズーム画面で項目が選択された時に、Zoom画面から取得する値を追加します。
		 *
		 * @param event イベント
		 * @param options オプション
		 *           key : キー名
		 *           element : 値の代入先エレメントID
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		addReceive: function(event, options) {
			!this.options.receives && (this.options.receives = {});
			this.options.receives[options.key] = options.element;
		},
		/**
		 * ズーム画面で項目が選択された時に、Zoom画面が返す値を追加します。
		 *
		 * @param event イベント
		 * @param options オプション
		 *           key : キー名
		 *           element : 値の代入先エレメントID
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		addReturn: function(event, options) {
			!this.options.returns && (this.options.returns = {});
			this.options.returns[options.key] = options.element;
		},
		/**
		 * イベント用パラメータを生成し取得します。
		 *
		 * @param event イベント
		 * @return [{name:'aaa01',value:'bbb01'},{name:'aaa02',value:'bbb01'}]の形式
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		decorateActionParam: function(event, options, $form) {
			/*jshint unused:false*/
			var id = this.element.attr('id'),
				params = [];
			if (event.type !== (this.widgetEventPrefix + 'open')) { // ページリフレッシュの後、ダイアログの状態を復元するための仕掛け。オープンイベント発火時は対象外（無限ループの可能性があるため）
				$.merge(params, [{
					name: id + '.isTriggeredFromDialog',
					value: true
				}, {
					name: id + '.openTriggerElement',
					value: this.options.currentEvent.target.id
				}, {
					name: id + '.openTriggerEventType',
					value: this.options.currentEvent.type
				}]);
			}
			return $.merge(params, this.options.params || []);
		},
		/**
		 * 現在のイベントを取得又は設定します。
		 *
		 * @param event イベント
		 * @return イベント
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		currentEvent: function(event) {
			if (!event) {
				return this.options.currentEvent;
			}
			this.options.currentEvent = event;
		},
		/**
		 * ズームダイアログを閉じます。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		close: function() {
			if (!this.options.returns || !this.options.receives) {
				this._close();
				return;
			}
			var receives = this.options.receives;
			$.each(this.options.returns, function(key, value) {
				var $ret = $.ge.idSelector(value);
				if (!$ret.length)
					return;
				var $rec = $.ge.idSelector(receives[key]);
				if (!$rec.length)
					return;
				$.geui.val($rec, $.geui.val($ret));
			});
			this._close();
		},
		/**
		 * ズームダイアログを閉じます。
		 *
		 * @private
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		_close: function() {
			$.geui.grdialog.prototype.close.apply(this);
			this.options.currentEvent && $.geui.focus($.ge.event.currentTarget(this.options.currentEvent));
			this.clear();
		},
		/**
		 * クリア処理を行います。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		clear: function() {
			this.options.params = null;
			this.options.returns = null;
			this.options.receives = null;
			this.options.currentEvent = null;
		},
		_trigger: function(type, event, data) {
			if (type !== 'open' || !this.options.isTriggeredFromDialog) {
				$.Widget.prototype._trigger.call(this, type, event, data);
			}
			if (type === 'open') {
				this.options.isTriggeredFromDialog = false;
				this.options.openTriggerElement = null;
				this.options.openTriggerEventType = null;
			}
		}
	});
})(jQuery);

// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エラー通知用ウィジェットの共通機能を定義します。
 *
 * @author yamashita 2011/06/11
 * @since 3.9.0
 */
(function($, undefined) {
	/**
	 * geui.grerrorprovider ウィジェットクラス
	 *
	 * @author yamashita 2011/06/11
	 * @since 3.9.0
	 */
	$.widget('geui.grerrorprovider', {
		_baseClass: '',
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		options: {
			isError: false
		},
		/**
		 * 生成処理を行います。
		 *
		 * @private
		 * @author yamashita 2011/06/16
		 * @since 3.9.0
		 */
		_create: function() {
			this.element.addClass(this._baseClass);
		},
		/**
		 * エラー表示を表示します。
		 *
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		showError: function() {
			this.element.show();
		},
		/**
		 * エラーを表示を隠します。
		 *
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		hideError: function() {
			this.element.hide();
		},
		/**
		 * 破棄処理を行います。
		 *
		 * @author yamashita 2011/06/16
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.removeClass(this._baseClass);
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);

// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エラーダイアログウィジェットを定義します。
 *
 * @author yamashita 2011/06/08
 * @since 3.9.0
 */
(function($, undefined) {
	var contentIdSuffix = '.validate-error-block',
		labelIdSuffix = '.label',
		baseClass = 'geui-grerrordialog',
		labelClass = 'geui-grerrordialog-label',
		contentClass = 'geui-grerrordialog-content',
		contentTitlebarClass = 'geui-grerrordialog-content-titlebar';
	/**
	 * geui.grerrordialog ウィジェットクラス
	 *
	 * エラーダイアログ表示用のウィジェット です。
	 *
	 * @extend {$.geui.grerrorprovider}
	 * @author yamashita 2011/06/08
	 * @since 3.9.0
	 */
	$.widget('geui.grerrordialog', $.geui.grerrorprovider, {
		_baseClass: baseClass,
		_zIndex: 'auto',
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/06/08
		 * @since 3.9.0
		 */
		options: {
			errorlabel: 'Validate Errors',
			autoOpen: false,
			anchor: true
		},
		/**
		 * 生成処理を行います。
		 *
		 * @private
		 * @author yamashita 2011/06/08
		 * @since 3.9.0
		 */
		_create: function() {
			/*jshint scripturl:true*/
			var self = this;
			// 不要なdiv要素を除去
			//   ※ajax時にダイアログがレンダリングされている状態で、複数回ajaxを実行する場合、
			//     ダイアログがウィジェット化される度に、ウィジェットを構成するdiv要素がbody下部に移動され、
			//     消えずに残っていくため
			$('div #' + $.ge.escSelectorString(this.element.attr('id') + contentIdSuffix)).each(function() {
				if (this !== self.element.children()[0]) $(this).remove();
			});
			$.geui.grerrorprovider.prototype._create.call(this);
			this.contentDiv = $.ge.idSelector(this.element.attr('id') + contentIdSuffix);
			/*jshint newcap:false */
			if (!this.contentDiv.length) throw Error('content (div) block does not exist.');
			if (this.options.anchor) {
				this.labelAnchor = $('<a/>')
					.attr('id', this.element.attr('id') + labelIdSuffix)
					.attr('href', 'javascript:void(0);')
					.on('contextmenu.grerrordialog', function(event) { // 右クリックメニュー無効化
						event.returnValue = false;
					})
					.on('click.grerrordialog', function(event) {
						/*jshint unused:false */
						self.showError();
						return false;
					})
					.text(this.options.errorlabel)
					.addClass(labelClass)
					.insertBefore(this.contentDiv);
				$.geui.setClearFalse(this.labelAnchor, true);
			}
			this.contentDiv.dialog(this.options);
			this.contentDiv.addClass(contentClass);
			var first = this.contentDiv.parents('.ui-dialog:first');
			this._zIndex = first.css('z-index');
			first.css('z-index', 9999); // 常に最前面に表示されるようにする。ただし、表示した後は、元のz-indexに戻す
			first.find('.ui-dialog-titlebar')
				.addClass(contentTitlebarClass);
			this.options.isError ? this.showError() : this.hideError();
		},
		/**
		 * エラーダイアログのコンテンツをオープンします。
		 *
		 * @author yamashita 2011/07/18
		 * @since 3.9.0
		 */
		open: function() {
			var self = this;
			self.contentDiv && self.contentDiv.dialog('open');
			setTimeout(
				function() {
					if (!self.contentDiv) return;
					self.contentDiv.parents('.ui-dialog:first').css('z-index', self._zIndex);
					self.contentDiv.dialog('moveToTop');
				}, 0);
		},
		/**
		 * エラーダイアログのコンテンツをクローズします。
		 *
		 * @author yamashita 2011/07/18
		 * @since 3.9.0
		 */
		close: function() {
			this.contentDiv && this.contentDiv.dialog('close');
		},
		/**
		 * エラーダイアログを活性化させます。
		 *
		 * @see {$.geui.grerrorprovider#showError}
		 * @author yamashita 2011/07/18
		 * @since 3.9.0
		 */
		showError: function() {
			if (!this.options.isError) return;
			this.open();
			$.geui.grerrorprovider.prototype.showError.call(this);
		},
		/**
		 * エラーダイアログを非活性化させます。
		 *
		 * @see {$.geui.grerrorprovider#hideError}
		 * @author yamashita 2011/07/18
		 * @since 3.9.0
		 */
		hideError: function() {
			this.close();
			$.geui.grerrorprovider.prototype.hideError.call(this);
		},
		/**
		 * 破棄処理を行います。
		 *
		 * @see {$.geui.grerrorprovider#destroy}
		 * @author yamashita 2011/07/18
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.css('display', 'none'); //destory後に要素を隠す
			if ( !! this.labelAnchor) {
				this.labelAnchor
					.off('contextmenu.grerrordialog')
					.off('click.grerrordialog')
					.remove();
				this.labelAnchor = null;
			}
			var clone = this.contentDiv
				.dialog('destroy')
				.removeClass(contentClass)
				.clone(true);
			clone.appendTo(this.element);
			this.contentDiv.remove();
			this.contentDiv = null;
			this.element.off('.dialog');
			this.widget().off('.dialog');
			$.geui.grerrorprovider.prototype.destroy.call(this);
		}
	});
})(jQuery);

// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エラーラベルウィジェットを定義します。
 *
 * @author yamashita 2011/06/16
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'ui-widget geui-grerrorlabel';
	/**
	 * geui.grerrorlabel ウィジェットクラス
	 *
	 * エラーラベル表示用のウィジェット です。
	 *
	 * @extend {$.geui.grerrorprovider}
	 * @author yamashita 2011/06/16
	 * @since 3.9.0
	 */
	$.widget('geui.grerrorlabel', $.geui.grerrorprovider, {
		_baseClass: baseClass,
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/06/16
		 * @since 3.9.0
		 */
		options: {
			errormsg: null
		},
		/**
		 * 生成処理を行います。
		 *
		 * @private
		 * @author yamashita 2011/06/16
		 * @since 3.9.0
		 */
		_create: function() {
			$.geui.grerrorprovider.prototype._create.call(this);
			this.element.text(this.options.errormsg);
			this.options.isError ? this.showError() : this.hideError();
		}
	});
})(jQuery);

// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * システムエラーダイアログウィジェットを定義します。
 *
 * @author yamashita 2011/06/21
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'geui-grsystemerrordialog',
		contentTitlebarClass = 'geui-grsystemerrordialog-content-titlebar';
	/**
	 * geui.grsystemerrordialog ウィジェットクラス
	 *
	 * システムエラーダイアログ表示用のウィジェット です。
	 *
	 * @extend {$.ui.dialog}
	 * @author yamashita 2011/06/21
	 * @since 3.9.0
	 */
	$.widget('geui.grsystemerrordialog', $.ui.dialog, {
		_baseClass: baseClass,
		/**
		 * オプションを表します。
		 *
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		options: {
			modal: true,
			autoOpen: false
		},
		/**
		 * 生成処理を行います。
		 *
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		_create: function() {
			// 不要なdiv要素を除去
			//   ※ajax時にダイアログがレンダリングされている状態で、複数回ajaxを実行する場合、
			//     ダイアログがウィジェット化される度に、ウィジェットを構成するdiv要素がbody下部に移動され、
			//     消えずに残っていくため
			var self = this;
			$('div #' + $.ge.escSelectorString(this.element.attr('id'))).each(function() {
				if (this !== self.element[0]) $(this).remove();
			});
			this.element.addClass(this._baseClass);
			$.ui.dialog.prototype._create.call(this);
			this.element.parents('.ui-dialog:first').find('.ui-dialog-titlebar').addClass(contentTitlebarClass);
		},
		/**
		 * システムエラーダイアログを表示します。
		 *
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		showError: function() {
			this.open();
		},
		/**
		 * システムエラーダイアログを非表示にします。
		 *
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		hideError: function() {
			this.close();
		},
		/**
		 * 破棄処理を行います。
		 *
		 * @author yamashita 2011/06/21
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.removeClass(this._baseClass);
			this.element.off('.dialog');
			this.widget().off('.dialog');
			$.ui.dialog.prototype.destroy.call(this);
			$.Widget.prototype.destroy.apply(this, arguments); //destroy()の最後で実行する必要あり
		}
	});
})(jQuery);

// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エンターキー制御機能を定義します。
 * @author Y.Hamanaka 2011/04/07
 * @since 3.9.0
 */
(function($, undefined) {
	/*
	$.gekey.keycodes[8] = 'BS';
	$.gekey.keycodes[9] = 'Tab';
	$.gekey.keycodes[13] = 'Enter';
	$.gekey.keycodes[16] = 'Shift';
	$.gekey.keycodes[17] = 'Ctrl';
	$.gekey.keycodes[18] = 'Alt';
	$.gekey.keycodes[19] = 'Pause';
	$.gekey.keycodes[27] = 'Esc';
	$.gekey.keycodes[28] = '変換';
	$.gekey.keycodes[29] = '無変換';
	$.gekey.keycodes[32] = 'Space';
	$.gekey.keycodes[33] = 'PgUp';
	$.gekey.keycodes[34] = 'PgDn';
	$.gekey.keycodes[35] = 'End';
	$.gekey.keycodes[36] = 'Home';
	$.gekey.keycodes[37] = '←';
	$.gekey.keycodes[38] = '↑';
	$.gekey.keycodes[39] = '→';
	$.gekey.keycodes[40] = '↓';
	$.gekey.keycodes[45] = 'Ins';
	$.gekey.keycodes[46] = 'Del';
	$.gekey.keycodes[48] = '0';
	$.gekey.keycodes[49] = '1';
	$.gekey.keycodes[50] = '2';
	$.gekey.keycodes[51] = '3';
	$.gekey.keycodes[52] = '4';
	$.gekey.keycodes[53] = '5';
	$.gekey.keycodes[54] = '6';
	$.gekey.keycodes[55] = '7';
	$.gekey.keycodes[56] = '8';
	$.gekey.keycodes[57] = '9';
	$.gekey.keycodes[65] = 'A';
	$.gekey.keycodes[66] = 'B';
	$.gekey.keycodes[67] = 'C';
	$.gekey.keycodes[68] = 'D';
	$.gekey.keycodes[69] = 'E';
	$.gekey.keycodes[70] = 'F';
	$.gekey.keycodes[71] = 'G';
	$.gekey.keycodes[72] = 'H';
	$.gekey.keycodes[73] = 'I';
	$.gekey.keycodes[74] = 'J';
	$.gekey.keycodes[75] = 'K';
	$.gekey.keycodes[76] = 'L';
	$.gekey.keycodes[77] = 'M';
	$.gekey.keycodes[78] = 'N';
	$.gekey.keycodes[79] = 'O';
	$.gekey.keycodes[80] = 'P';
	$.gekey.keycodes[81] = 'Q';
	$.gekey.keycodes[82] = 'R';
	$.gekey.keycodes[83] = 'S';
	$.gekey.keycodes[84] = 'T';
	$.gekey.keycodes[85] = 'U';
	$.gekey.keycodes[86] = 'V';
	$.gekey.keycodes[87] = 'W';
	$.gekey.keycodes[88] = 'X';
	$.gekey.keycodes[89] = 'Y';
	$.gekey.keycodes[90] = 'Z';
	$.gekey.keycodes[91] = 'Win';
	$.gekey.keycodes[93] = 'Ctx';
	$.gekey.keycodes[96] = '0';//テンキー
	$.gekey.keycodes[97] = '1';//テンキー
	$.gekey.keycodes[98] = '2';//テンキー
	$.gekey.keycodes[99] = '3';//テンキー
	$.gekey.keycodes[100] = '4';//テンキー
	$.gekey.keycodes[101] = '5';//テンキー
	$.gekey.keycodes[102] = '6';//テンキー
	$.gekey.keycodes[103] = '7';//テンキー
	$.gekey.keycodes[104] = '8';//テンキー
	$.gekey.keycodes[105] = '9';//テンキー
	$.gekey.keycodes[106] = '*';//テンキー
	$.gekey.keycodes[107] = '+';//テンキー
	$.gekey.keycodes[109] = '-';//テンキー
	$.gekey.keycodes[110] = '.';//テンキー
	$.gekey.keycodes[111] = '/';//テンキー
	$.gekey.keycodes[112] = 'F1';
	$.gekey.keycodes[113] = 'F2';
	$.gekey.keycodes[114] = 'F3';
	$.gekey.keycodes[115] = 'F4';
	$.gekey.keycodes[116] = 'F5';
	$.gekey.keycodes[117] = 'F6';
	$.gekey.keycodes[118] = 'F7';
	$.gekey.keycodes[119] = 'F8';
	$.gekey.keycodes[120] = 'F9';
	$.gekey.keycodes[121] = 'F10';
	$.gekey.keycodes[122] = 'F11';
	$.gekey.keycodes[123] = 'F12';
	$.gekey.keycodes[144] = 'NumLock';
	$.gekey.keycodes[146] = 'ScrLock';
	$.gekey.keycodes[186] = '*';//本当は「:」
	$.gekey.keycodes[187] = ';';
	$.gekey.keycodes[188] = '<';//本当は「,」
	$.gekey.keycodes[189] = '-';
	$.gekey.keycodes[190] = '>';//本当は「.」
	$.gekey.keycodes[191] = '/';
	$.gekey.keycodes[192] = '@';
	$.gekey.keycodes[219] = '[';
	$.gekey.keycodes[220] = '\\';
	$.gekey.keycodes[221] = ']';
	$.gekey.keycodes[222] = '^';
	$.gekey.keycodes[226] = '\\';
	$.gekey.keycodes[240] = 'CapsLock';
	$.gekey.keycodes[242] = 'カナ';
	$.gekey.keycodes[244] = '半/全';
	*/
	/**
	 * geui.grkeybind Widgetクラス
	 *
	 * キーバインド表示制御用のWidget です。
	 *
	 * @author Y.Hamanaka 2011/04/07
	 * @since 3.9.0
	 */
	$.widget('geui.grkeybind', {
		/**
		 * ブラウザキーコードに任意の処理をバインドします。
		 * @param options
		 *  element            : 対象UIのID属性
		 *  event              : 対象イベントの名前
		 *  keycode {int}      : ブラウザのキーコードまたは特殊キーを示します。必ず指定する必要があります。
		 *  isAlt {boolean}    : ブラウザのALT修飾キーが押下されているかどうかを示します。true:押下されている（デフォルトfalse）
		 *  isCtrl {boolean}   : ブラウザのCTRL修飾キーが押下されているかどうかを示します。true:押下されている（デフォルトfalse）
		 *  isShift {boolean}  : ブラウザのSHIFT修飾キーが押下されているかどうかを示します。true:押下されている（デフォルトfalse）
		 *  func {function}    : JavaScript関数を示します。必ず指定する必要があります。
		 *  bubbling {boolean} : 上位(祖先)コンテナのキー制御を実行(バブリング)するかどうかを示します。true:実行する（デフォルトfalse）
		 *
		 * @author Y.Hamanaka 2011/04/07
		 * @since 3.9.0
		 */
		_init: function() {
			var keycode = this.options.keycode;
			var isCtrl = this.options.isCtrl;
			var isAlt = this.options.isAlt;
			var isShift = this.options.isShift;
			var func = this.options.func;
			var event = this.options.event;
			var element = this.options.element;
			var bubbling = this.options.bubbling;
			this.element.on('keydown.grkeybind', function($event) {
				/*jshint eqeqeq:false*/
				if (keycode != $event.keyCode) {
					return true;
				}
				if (!(isAlt && $event.altKey || !isAlt && !$event.altKey)) {
					return true;
				}
				if (!(isCtrl && $event.ctrlKey || !isCtrl && !$event.ctrlKey)) {
					return true;
				}
				if (!(isShift && $event.shiftKey || !isShift && !$event.shiftKey)) {
					return true;
				}
				if (event !== undefined && element !== undefined) {
					if (!$.geui.isDisabled(element)) {
						if (document.activeElement.id !== element || $.ui.keyCode.ENTER !== $event.keyCode || event !== 'click') {
							$.ge.idSelector(element).trigger(event); // Enterキー押下時のブラウザデフォルトイベント（click）実行の重複を排除
						}
					}
				} else if (func !== undefined) {
					(function() {
						/*jshint evil:true*/
						eval(func);
					})();
				}
				bubbling || $event.stopPropagation();
				return true;
			});
		},
		_setOptions: function(options) {
			this.options = {};
			return this._super(options);
		},
		/**
		 * widget の破棄処理を実行します。
		 *
		 * @author Y.Hamanaka 2011/04/19
		 * @since 3.9.0
		 */
		destroy: function() {
			this.element.off('keydown.grkeybind');
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);

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

// Copyright 2011 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 * エラーパネルウィジェットを定義します。
 *
 * @author yamashita 2011/06/11
 * @since 3.9.0
 */
(function($, undefined) {
	var baseClass = 'ui-widget geui-grerrorpanel';
	/**
	 * geui.grerrorpanel ウィジェットクラス
	 *
	 * エラーパネル表示用のウィジェット です。
	 *
	 * @extend {$.geui.grerrorprovider}
	 * @author yamashita 2011/06/11
	 * @since 3.9.0
	 */
	$.widget('geui.grerrorpanel', $.geui.grerrorprovider, {
		_baseClass: baseClass,
		/**
		 * 生成処理を行います。
		 *
		 * @private
		 * @author yamashita 2011/06/11
		 * @since 3.9.0
		 */
		_create: function() {
			$.geui.grerrorprovider.prototype._create.call(this);
			this.options.isError ? this.showError() : this.hideError();
		}
	});
})(jQuery);

// Copyright 2011-2022 Kyocera Communication Systems Co., Ltd All rights reserved.
/**
 *
 *
 * @author yamashita 2011/04/23
 * @since 3.9.0
 */
(function($, undefined) {
	/**
	 * geui.grindicator Widgetクラス
	 *
	 * インジケータ表示制御用のWidget です。
	 *
	 * @author yamashita 2011/04/23
	 * @since 3.9.0
	 */
	$.widget('geui.grindicator', {
		/**
		 * オプション
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		options: {
			horizontal: true,
			vertical: true
		},
		/**
		 * 基底クラス
		 *
		 * @private
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		_baseClass: '',
		/**
		 * 初期化処理を実行します。
		 *
		 * @private
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		_create: function() {
			this.element.hide();
			this.center();
			var self = this;
			$(this.parent).on('resize.grindicator', function(event) {
				/*jshint unused:false*/
				self.center();
			});
			this.element.addClass(this._baseClass);
		},
		/**
		 * 親要素を取得します。
		 *
		 * @private
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		_getParent: function() {
			var $parent = this.element.parent();
			var tagName = $parent.prop('tagName');
			return !tagName || tagName.toLowerCase() === 'body' ? $(window) : $parent;
		},
		/**
		 * ウィジェットを表示状態にします。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		show: function() {
			this.element.show();
			this.element.children().show();
			this.center();
		},
		/**
		 * ウィジェットを非表示にします。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		hide: function() {
			this.element.hide();
			this.element.children().hide();
		},
		/**
		 * ウィジェットを中央寄せにします。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		center: function() {
			var elementStyle = this.element[0].style;
			elementStyle.position = 'absolute';
			!this.parent && (this.parent = this._getParent());
			var parentPosition = this.element.parent().css('position');
			var offsetParent = null; //position 属性が relative、 absolute、 fixed のいずれかである、最も近い祖先要素

			if ( !! this.options.horizontal) {
				var newPosX = Math.floor((this.parent.outerWidth(true) / 2) - (this.element.outerWidth(true) / 2));
				if (parentPosition === 'static') {
					// ##### CUSTOMIZE [2023/10/13][yangfeng] インジケーターが表示を大幅に上（ページ上部）に表示されてしまう　バグを解消 [start] ####
					// TODO JQuery3.3.1のバグ（#1081と#3479）により暫定対応
					//     https://github.com/jquery/api.jquery.com/issues/1081
					//     https://github.com/jquery/jquery/issues/3479
					// JQuery将来のVerUpで直せば、元に戻す予定
					//   newPosX = newPosX + this.element.parent().position().left;
					newPosX = newPosX + this.element.parent().offset().left;
					// ##### CUSTOMIZE [2023/10/13][yangfeng] インジケーターが表示を大幅に上（ページ上部）に表示されてしまう　バグを解消 [end] ####
					offsetParent = this.element.offsetParent();
					if (offsetParent[0] !== $('html')[0]) { //祖先に'static'以外の要素がある
						newPosX = newPosX + offsetParent.scrollLeft();
					} else {
						newPosX = newPosX + this.parent.scrollLeft(); //this.parent==$(window)
					}
				} else {
					newPosX = newPosX + this.element.parent().scrollLeft();
				}
				elementStyle.left = newPosX + 'px';
			}

			if ( !! this.options.vertical) {
				var newPosY = Math.floor((this.parent.outerHeight(true) / 2) - (this.element.outerHeight(true) / 2));
				if (parentPosition === 'static') {
					offsetParent = !! offsetParent ? offsetParent : this.element.offsetParent();
					// ##### CUSTOMIZE [2023/10/13][yangfeng] インジケーターが表示を大幅に上（ページ上部）に表示されてしまう　バグを解消 [start] ####
					// TODO JQuery3.3.1のバグ（#1081と#3479）により暫定対応
					//     https://github.com/jquery/api.jquery.com/issues/1081
					//     https://github.com/jquery/jquery/issues/3479
					// JQuery将来のVerUpで直せば、元に戻す予定
					//   newPosY = newPosY + this.element.parent().position().top;
					newPosY = newPosY + this.element.parent().offset().top;
					// ##### CUSTOMIZE [2023/10/13][yangfeng] インジケーターが表示を大幅に上（ページ上部）に表示されてしまう　バグを解消 [end] ####
					if (offsetParent[0] !== $('html')[0]) { //祖先に'static'以外の要素がある
						newPosY = newPosY + offsetParent.scrollTop();
					} else {
						newPosY = newPosY + this.parent.scrollTop(); //this.parent==$(window)
					}
				} else {
					newPosY = newPosY + this.element.parent().scrollTop();
				}
				elementStyle.top = newPosY + 'px';
			}
		},
		/**
		 * widget の破棄処理を実行します。
		 *
		 * @author yamashita 2011/04/23
		 * @since 3.9.0
		 */
		destroy: function() {
			$(this.parent).off('resize.grindicator');
			this.parent = null;
			this.element.removeClass(this._baseClass);
			$.Widget.prototype.destroy.apply(this, arguments);
		}
	});
})(jQuery);

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
