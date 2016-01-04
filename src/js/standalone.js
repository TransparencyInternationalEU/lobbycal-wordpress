var meetingsUrl = "http://localhost:8080/api/meetings/dt/8,47";

var lc2pShowStart = '1';
// Display column for start date?
var lc2pShowEnd = '1';
// Display column for first name? '1' : yes, else don't
var lc2pShowFirstName = '1';
// Display column for last name? '1' : yes, else don't
var lc2pShowLastName = '1';
// Display column for title? '1' : yes, else don't
var lc2pShowTitle = '1';
// Display column for partner? '1' : yes, else don't
var lc2pShowPartner = '1';
// Display column for tags? '1' : yes, else don't
var lc2pShowTags = '1';
// Display tags with title? '1' : yes, else don't
var lc2pShowTagsTitle = '1';
// Default order at first load
var lc2pOrder = "startDate desc";

var lc2pDateFormat = 'DD/MM/YYYY';
var lc2pPerPage = 10;

if (lc2pDateFormat != "") {
	momentDateFormat = lc2pDateFormat;
	console.log(lc2pDateFormat);
	console.log(momentDateFormat);
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

$(document).ready(function() {
	$.fn.dataTable.moment(momentDateFormat);

	var dt = $('#lobbycal').DataTable({
		'ajax' : meetingsUrl,
		'serverSide' : true,
        "info":     false,
		columns : [ {
			data : 'startDate',
			searchable : false,
			visible : (lc2pShowStart == "1"),
			name : 'startDate',
			render : function(date, type, full) {
				return moment(date).format(momentDateFormat)
			}
		}, {
			data : 'endDate',
			searchable : false,
			visible : (lc2pShowEnd == "1"),
			name : 'endDate',
			render : function(date, type, full) {
				return moment(date).format(momentDateFormat)
			}
		}, {
			data : 'userFirstName',
			searchable : false,
			visible : (lc2pShowFirstName == "1"),
			name : 'userFirstName'
		}, {
			data : 'userLastName',
			searchable : false,
			visible : (lc2pShowLastName == "1"),
			name : 'userLastName'
		}, {
			data : 'mPartner',
			searchable : false,
			visible : (lc2pShowPartner == "1"),
			name : 'partner'
		},{
			data :   'title',
			visible : (lc2pShowTitle == "1"),
			name : 'title',
			render : function(data, type, row) {
				if ( lc2pShowTagsTitle == "1") {
					var tgs = dt.column('tag').data();
					return data+ " " +mTags(tgs[0].split(" "));
				} else {
					return data;
				}
			}
		}, {
			data : 'mTag',
			searchable : false,
			visible : (lc2pShowTags == "1"),
			name : 'tag',
			render : function(data, type, row) {
				return mTags(data.split(" "));
			}
		} ],
		pageLength : parseInt(lc2pPerPage),
		lengthMenu : [ parseInt(lc2pPerPage) ]
	});
	var order = lc2pOrder.split(' ', 2)[1];
	var cname = lc2pOrder.split(' ', 1)[0]

	console.log(cname);
	var cindx = dt.column(cname ).index();
	console.log(cindx);
	if (cindx === undefined) {
		cindx = 1;
	}
	console.log(cindx);
	console.log(order);
	dt.order([cindx , order]).draw();
	$('#lobbycal tbody').on('click', 'span', function() {
		// var cell = dt.cell( $(".tag"));
		console.log(this.innerHTML);
		$('.dataTables_filter input').val(this.innerHTML);
		$('.dataTables_filter input').click();
		dt.search(this.innerHTML).draw();
	});

});

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

function mTags(tags) {
	var res = "";
	jQuery.each(tags, function(key, tag) {
		if (tag != "") {
			res += "<span class=\"tag " + (tag) + "\">" + (tag)
					+ "</span><br/>";
		}
	});
	return res;
}

