console.log(lc2pUrl);
// var lc2pUrl = "http://localhost:8080/api/meetings/dt/22,26,35,36,43,45,47";
console.log(lc2pUrl);
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

jQuery(document).ready(function() {
	jQuery.fn.dataTable.moment(momentDateFormat);
	jQuery('#lobbycal').DataTable().destroy();
	var dt = jQuery('#lobbycal').DataTable({
		'ajax' : lc2pUrl,
		'serverSide' : true,
		"info" : false,
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
		}, {
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
	var cindx = dt.column(cname).index();
	console.log(cindx);
	if (cindx === undefined) {
		cindx = 1;
	}
	console.log(cindx);
	console.log(order);
	dt.order([ cindx, order ]).draw();
	jQuery('#lobbycal tbody').on('click', 'span', function() {
		// var cell = dt.cell( $(".tag"));
		console.log(this.innerHTML);
		jQuery('.dataTables_filter input').val(this.innerHTML);
		jQuery('.dataTables_filter input').click();
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
