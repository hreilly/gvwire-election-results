///////////////////////////////////////////
//
//   2020 Hannah Reilly
//
///////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////

// AJAX loading animation

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("ajax-loading");    },
     ajaxStop: function() { $body.removeClass("ajax-loading"); }    
});

////////////////////////////////////////////////////////////////////////////////////

// Live search and no-conflict mode.

// Enable no-conflict for legacy JQuery features on site
// $.noConflict(true);

// Live filter results
$(document).ready(function(){
    $("#live-filter-results").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".srchbl").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// This script pulls raw election data from the CA Secretary of State API and prints it. API is refreshed every 5 minutes during election reporting.

////////////////////////////////////////////////////////////////////////////////////

// Vanilla JS test request to verify connection to API and JSON integrity. All GET requests should return a value of 200.

var request = new XMLHttpRequest();

request.open('GET', 'https://api.sos.ca.gov/returns/ballot-measures', true);
request.onload = function () {

  var data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
    console.log('Connection to CA SoS API successful!');
  } else {
    console.log('Error, no connection.');
  }
}

request.send();

///////////////////////////////////////////
// Parse data with JQuery
///////////////////////////////////////////

// Ballot Measures

// Use ajax to call the API and execute a function when done
$.ajax({
  url: "https://api.sos.ca.gov/returns/ballot-measures"
}).done(function(resp) {

  // Stringify JSON data and assign to variable
  //var resp_string = JSON.stringify(resp);

  // Print raw data to the specified div id
  //$('#raw-data').append(resp_string);

  // Create array from the specified response key (using [] if the key uses a hyphen)
  var msr_obj = resp['ballot-measures'];

  // Call the header content
  var msr_header = '<div class="election-category-header">' + '<h2>' + resp.raceTitle + '</h2>' +
                       '<p>' + resp.Reporting + '<br>' +
                       resp.ReportingTime + '</p>' + '</div>';

  // Print the data to the specified div id
  $('#msr-data-header').append(msr_header);

  // Loop through the array for each object in the 'msr_obj' array
  $.each( msr_obj, function( key, msr ){
    var msr_num = (msr.Number);
    var msr_name = (msr.Name);
    var msr_yes = (msr.yesPercent);
    var msr_no = (msr.noPercent);

    var msr_data = '<div id="ballot-measure-' + msr_num + '" class="ballot-measure election-results-group srchbl">' + '<h3>Measure ' + msr_num + ': ' + msr_name + '</h3>' + '</div>';
    
    $('#msr-data-container').append(msr_data);

    var msr_votes = {};
    msr_votes['noPercent'] = msr_no;
    msr_votes['yesPercent'] = msr_yes;
  
    $.each( msr_votes, function(key, value){
      var vote_percents = '<div class="measure-vote-item ' + key + '" data-value="' + value + '">' + value + '%' + '</div>';

      $('#ballot-measure-' + msr_num).append(vote_percents);

      $('#ballot-measure-' + msr_num).find('.measure-vote-item').sort(function (a, b) {
        return $(b).attr('data-value') - $(a).attr('data-value');
      })
      .appendTo('#ballot-measure-' + msr_num);

    });

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Presidential Primary Races

///////////////////////////////////////////

// Democratic

$.ajax({
  url: "https://api.sos.ca.gov/returns/president/party/democratic"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  // Only needed once per category
  var statewide_header = resp.Reporting + '<br>' + resp.ReportingTime;
  $('#statewide-reporting-content').append(statewide_header);

  var dem_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-dem-data').append(dem_header);

  var dem_obj = resp.candidates;

  $.each( dem_obj, function( key, dem ){
    var dem_name = (dem.Name);
    var dem_prty = (dem.Party);
    var dem_votes = (dem.Percent);
    var dem_data = '<div class="election-candidate" data-value="' + dem_votes + '">' + '<span class="' + dem_prty + '">' + dem_name + '</span>:' + ' ' + dem_votes + '%' + '</div>';

    $('#formatted-dem-data').append(dem_data);

    $('#formatted-dem-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-dem-data');

  });

});

///////////////////////////////////////////

// Republican

$.ajax({
  url: "https://api.sos.ca.gov/returns/president/party/republican"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var rep_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-rep-data').append(rep_header);

  var rep_obj = resp.candidates;

  $.each( rep_obj, function( key, rep ){
    var rep_name = (rep.Name);
    var rep_prty = (rep.Party);
    var rep_votes = (rep.Percent);
    var rep_data = '<div class="election-candidate" data-value="' + rep_votes + '">' + '<span class="' + rep_prty + '">' + rep_name + '</span>:' + ' ' + rep_votes + '%' + '</div>';

    $('#formatted-rep-data').append(rep_data);

    $('#formatted-rep-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-rep-data');

  });

});

///////////////////////////////////////////

// American Independent

$.ajax({
  url: "https://api.sos.ca.gov/returns/president/party/american-independent"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var amin_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-amin-data').append(amin_header);

  var amin_obj = resp.candidates;

  $.each( amin_obj, function( key, amin ){
    var amin_name = (amin.Name);
    var amin_prty = (amin.Party);
    var amin_votes = (amin.Percent);
    var amin_data = '<div class="election-candidate" data-value="' + amin_votes + '">' + '<span class="' + amin_prty + '">' + amin_name + '</span>:' + ' ' + amin_votes + '%' + '</div>';

    $('#formatted-amin-data').append(amin_data);

    $('#formatted-amin-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-amin-data');

  });

});

///////////////////////////////////////////

// Green

$.ajax({
  url: "https://api.sos.ca.gov/returns/president/party/green"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var grn_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-grn-data').append(grn_header);

  var grn_obj = resp.candidates;

  $.each( grn_obj, function( key, grn ){
    var grn_name = (grn.Name);
    var grn_prty = (grn.Party);
    var grn_votes = (grn.Percent);
    var grn_data = '<div class="election-candidate" data-value="' + grn_votes + '">' + '<span class="' + grn_prty + '">' + grn_name + '</span>:' + ' ' + grn_votes + '%' + '</div>';

    $('#formatted-grn-data').append(grn_data);

    $('#formatted-grn-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-grn-data');

  });

});

///////////////////////////////////////////

// Libertarian

$.ajax({
  url: "https://api.sos.ca.gov/returns/president/party/libertarian"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var lib_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-lib-data').append(lib_header);

  var lib_obj = resp.candidates;

  $.each( lib_obj, function( key, lib ){
    var lib_name = (lib.Name);
    var lib_prty = (lib.Party);
    var lib_votes = (lib.Percent);
    var lib_data = '<div class="election-candidate" data-value="' + lib_votes + '">' + '<span class="' + lib_prty + '">' + lib_name + '</span>:' + ' ' + lib_votes + '%' + '</div>';

    $('#formatted-lib-data').append(lib_data);

    $('#formatted-lib-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-lib-data');

  });

});

///////////////////////////////////////////

// Peace and Freedom

$.ajax({
  url: "https://api.sos.ca.gov/returns/president/party/peace-and-freedom"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var paf_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-paf-data').append(paf_header);

  var paf_obj = resp.candidates;

  $.each( paf_obj, function( key, paf ){
    var paf_name = (paf.Name);
    var paf_prty = (paf.Party);
    var paf_votes = (paf.Percent);
    var paf_data = '<div class="election-candidate" data-value="' + paf_votes + '">' + '<span class="' + paf_prty + '">' + paf_name + '</span>:' + ' ' + paf_votes + '%' + '</div>';

    $('#formatted-paf-data').append(paf_data);

    $('#formatted-paf-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-paf-data');

  });

});

// End data from CA SoS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////