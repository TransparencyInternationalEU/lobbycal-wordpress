//Initial data set : Please change the url to the one you received with your registration email 

var meetingsURL = lc2pUrl;
var momentDateFormat = "LLL";
if (lc2pDateFormat != "") {
	momentDateFormat = lc2pDateFormat;
}

(function(factory) {
	if (typeof define === "function" && define.amd) {
		define([ "jquery", "moment", "datatables" ], factory);
	} else {
		factory(jQuery, moment);
	}
}(function($, moment) {

	$.fn.dataTable.moment = function(format, locale) {
		var types = $.fn.dataTable.ext.type;

		// Add type detection
		types.detect.unshift(function(d) {
			// Strip HTML tags if possible
			if (d && d.replace) {
				d = d.replace(/<.*?>/g, '');
			}

			// Null and empty values are acceptable
			if (d === '' || d === null) {
				return 'moment-' + format;
			}

			return moment(d, format, locale, true).isValid() ? 'moment-'
					+ format : null;
		});

		// Add sorting method - use an integer for the sorting
		types.order['moment-' + format + '-pre'] = function(d) {
			return d === '' || d === null ? -Infinity : parseInt(moment(
					d.replace ? d.replace(/<.*?>/g, '') : d, format, locale,
					true).format('x'), 10);
		};
	};

}));
ko.observableArray.fn.subscribeArrayChanged = function(addCallback,
		deleteCallback) {
	var previousValue = undefined;
	this.subscribe(function(_previousValue) {
		previousValue = _previousValue.slice(0);
	}, undefined, 'beforeChange');
	this.subscribe(function(latestValue) {
		var editScript = ko.utils.compareArrays(previousValue, latestValue);
		for (var i = 0, j = editScript.length; i < j; i++) {
			switch (editScript[i].status) {
			case "retained":
				break;
			case "deleted":
				if (deleteCallback)
					deleteCallback(editScript[i].value);
				break;
			case "added":
				if (addCallback)
					addCallback(editScript[i].value);
				break;
			}
		}
		previousValue = undefined;
	});
};

function partners(partners) {
	var res = "";
	jQuery
			.each(
					partners,
					function(key, partner) {
						if (partner.transparencyRegisterID != "") {
							res += ('<a href="http://ec.europa.eu/transparencyregister/public/consultation/displaylobbyist.do?id='
									+ partner.transparencyRegisterID
									+ '">'
									+ partner.name + '</a>');
						} else {
							if (partner.name != "") {
								res += (partner.name);
							}
						}
						res = "<span class=\"partner\">" + res + "</span><br/>";
					});
	return res;
}

function loadPage(nr) {
	console.log("succ");
	 meetingsURL = meetingsURL + "?page=" + nr;
	if (lc2pMax != "") {
		meetingsURL = meetingsURL + "&per_page=" + lc2pMax;
	} else {
		meetingsURL = meetingsURL + "&per_page=9999";
		console.log(lc2pMax)
	 }
	jQuery.when(jQuery.getJSON(meetingsURL)).then(
			function(data, textStatus, jqXHR) {

				console.log(jqXHR.getResponseHeader('X-Total-Count'));
				console.log(data);

				sooo = jqXHR.responseJSON;
				var meetings = ko.mapping.fromJS([]);
				jQuery.fn.dataTable.moment(momentDateFormat);
				console.log(meetingsURL);

				var dt = $('#lobbycal').DataTable({
					data :  { "data": data},
					"info" : false,
					columns : [ {
						data : 'startDate()',
						visible : (lc2pShowStart == "1")
					}, {
						data : 'endDate()',
						visible : (lc2pShowEnd == "1")
					}, {
						data : 'userFirstName()',
						visible : (lc2pShowFirstName == "1")
					}, {
						data : 'userLastName()',
						visible : (lc2pShowLastName == "1")
					}, {
						data : 'partners()',
						visible : (lc2pShowPartner == "1")
					}, {
						data : 'title()',
						visible : (lc2pShowTitle == "1")
					}, {
						data : 'tags()',
						visible : (lc2pShowTags == "1")
					} ],
					order : [ [ 1, "desc" ] ],
					pageLength : parseInt(lc2pPerPage),
					lengthMenu : [ parseInt(lc2pPerPage) ]
				});

				// make tags clickable

				$('#lobbycal tbody').on('click', 'span', function() {
					// var cell = dt.cell( $(".tag"));
					console.log(this.innerHTML);
					$('.dataTables_filter input').val(this.innerHTML);
					$('.dataTables_filter input').click();
					dt.search(this.innerHTML).draw();
				});

				// Update the table when the `meetings` array has items
				// added or removed
				meetings.subscribeArrayChanged(function(addedItem) {
					dt.row.add(addedItem).draw();
				}, function(deletedItem) {
					var rowIdx = dt.column(0).data().indexOf(deletedItem.id);
					dt.row(rowIdx).remove().draw();
				});
				// Convert the data set into observable objects, and
				// will also add the
				// initial data to the table
				ko.mapping.fromJS(sooo, {
					key : function(data) {
						return ko.utils.unwrapObservable(data.id);
					},
					create : function(options) {
						return new Meeting(options.data, dt);
					}
				}, meetings);
			});
}

function tags(tags) {
	var res = "";
	jQuery.each(tags, function(key, tag) {
		if (tag.i18nKey != "") {
			res += "<span class=\"tag " + (tag.i18nKey) + "\">" + (tag.en)
					+ "</span><br/>";
		}
	});
	return res;
}
// Meeting object
var Meeting = function(data, dt) {
	this.id = data.id;
	this.startDate = ko.observable(moment(data.startDate).format(
			momentDateFormat));
	this.endDate = ko.observable(moment(data.endDate).format(momentDateFormat));

	this.userLogin = ko.observable(data.userLogin);
	this.userFirstName = ko.observable(data.userFirstName);
	this.userLastName = ko.observable(data.userLastName);

	if (partners.length != 0) {
		this.partners = ko.observable(partners(data.partners));
	}

	var titleF = data.title;
	if (tags.length != 0 && lc2pShowTagsTitle == "1") {
		titleF += "<br/>" + tags(data.tags);
	}

	this.title = ko.observable(titleF);

	if (tags.length != 0) {
		this.tags = ko.observable(tags(data.tags));
	} else {
		this.tags = "";
	}
	this.full = ko.computed(function() {
		return this.title() + " " + this.startDate();
	}, this);

	// Subscribe a listener to the observable properties for the table
	// and invalidate the DataTables row when they change so it will redraw
	var that = this;
	jQuery.each([ 'startDate', 'endDate', 'userFirstName', 'userLastName',
			'partners', 'title', 'tags' ], function(i, prop) {
		that[prop].subscribe(function(val) {
			// Find the row in the DataTable and invalidate it, which
			// will
			// cause DataTables to re-read the data
			var rowIdx = dt.column(0).data().indexOf(that.id);
			dt.row(rowIdx).invalidate();
		});
	});
};
var sooo;

jQuery(document).ready(function($) {
	loadPage(1);

});
