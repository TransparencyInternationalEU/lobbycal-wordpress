var burl = "http://localhost:8080/api/meetings/dt/9,53,8,6";

var lc2pShowStart = '1';
// Display column for start date?
var lc2pShowEnd = '';
// Display column for first name? '1' : yes, else don't
var lc2pShowFirstName = '1';
// Display column for last name? '1' : yes, else don't
var lc2pShowLastName = '';
// Display column for title? '1' : yes, else don't
var lc2pShowTitle = '1';
// Display column for partner? '1' : yes, else don't
var lc2pShowPartner = '1';
// Display column for tags? '1' : yes, else don't
var lc2pShowTags = '1';
// Display tags with title? '1' : yes, else don't
var lc2pShowTagsTitle = '';

var lc2pDateFormat = 'DD/MM/YYYY';
var lc2pPerPage= 5;

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
		'ajax' : burl,
		'serverSide' : true,
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
			data : 'partners',
			searchable : false,
			visible : (lc2pShowPartner == "1"),
			name : 'partners',
			render : function(data, type, row) {
				return partners(data);
			},
		}, {
			data : 'mPartner',
			visible : (lc2pShowPartner == "1"),
			name : 'mPartner'
		}, {
			data : 'title',
			visible : (lc2pShowTitle == "1"),
			name : 'title'
		}, {
			data : 'tags',
			searchable : false,
			visible : (lc2pShowTags == "1"),
			render : function(data, type, row) {
				return tags(data);
			}
		}, {
			data : 'mTag',
			visible : (lc2pShowTags == "1"),
			name : 'mTag'
		} ],
		pageLength : parseInt(lc2pPerPage),
		lengthMenu : [ parseInt(lc2pPerPage) ]
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