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

//////////////////////////////////////////////////////////////////////////////////////

// District Races

///////////////////////////////////////////

// U.S Congress CA 16

$.ajax({
  url: "https://api.sos.ca.gov/returns/us-rep/district/16"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var usca16_obj = resp.candidates;
  var usca16_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '</div>';

  $('#formatted-usca16-data').append(usca16_header);

  $.each( usca16_obj, function( key, usca16 ){
    var usca16_name = (usca16.Name);
    var usca16_prty = (usca16.Party);
    var usca16_votes = (usca16.Percent);
    var usca16_data = '<div class="election-candidate" data-value="' + usca16_votes + '">' + '<span class="' + usca16_prty + '">' + usca16_name + '</span>:' + ' ' + usca16_votes + '%' + '</div>';

    $('#formatted-usca16-data').append(usca16_data);

    $('#formatted-usca16-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-usca16-data');

  });

});

///////////////////////////////////////////

// U.S Congress CA 21

$.ajax({
  url: "https://api.sos.ca.gov/returns/us-rep/district/21"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var usca21_obj = resp.candidates;
  var usca21_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-usca21-data').append(usca21_header);

  $.each( usca21_obj, function( key, usca21 ){
    var usca21_name = (usca21.Name);
    var usca21_prty = (usca21.Party);
    var usca21_votes = (usca21.Percent);
    var usca21_data = '<div class="election-candidate" data-value="' + usca21_votes + '">' + '<span class="' + usca21_prty + '">' + usca21_name + '</span>:' + ' ' + usca21_votes + '%' + '</div>';

    $('#formatted-usca21-data').append(usca21_data);

    $('#formatted-usca21-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-usca21-data');

  });

});

///////////////////////////////////////////

// U.S Congress CA 22

$.ajax({
  url: "https://api.sos.ca.gov/returns/us-rep/district/22"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var usca22_obj = resp.candidates;
  var usca22_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-usca22-data').append(usca22_header);

  $.each( usca22_obj, function( key, usca22 ){
    var usca22_name = (usca22.Name);
    var usca22_prty = (usca22.Party);
    var usca22_votes = (usca22.Percent);
    var usca22_data = '<div class="election-candidate" data-value="' + usca22_votes + '">' + '<span class="' + usca22_prty + '">' + usca22_name + '</span>:' + ' ' + usca22_votes + '%' + '</div>';

    $('#formatted-usca22-data').append(usca22_data);

    $('#formatted-usca22-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-usca22-data');

  });

});

// End data from CA SoS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////