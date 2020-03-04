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

// This script pulls raw election data parsed from the Fresno County Registrar of Voters and prints it. JSON is refreshed every 10 minutes during election reporting.

////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////
// Parse JSON data with JQuery
///////////////////////////////////////////

// Overview Data

$.ajax({
  url: '/wp-content/elections/03_2020/data/overview.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var overview = resp.data;
  $.each( overview, function( key, overview ){
    var overview_data = (overview.item);

    $('#fresno-county-overview').append(overview_data);

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Fresno Mayor

$.ajax({
  url: '/wp-content/elections/03_2020/data/may.json'
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#fresno-county-data').append(resp_string);
  var may = resp.data;
  $.each( may, function( key, may ){
    var may_index = (may.index);
    var may_item = (may.item);
    var may_name = may_item.toLowerCase();
    var may_votes = (may.votePrcnt);
    var may_num = (may.voteNum);
    var may_data = '<div class="fresno-item index-item-' + may_index + ' fresno-candidate"' + ' data-value="' + may_num + '">' +
                    '<span class="item-name">' + may_name + '</span>' +
                    (may_index != '0' ? ': ' : "") + ' ' +
                    (may_votes != null ? may_votes + ' &nbsp;|&nbsp; ' : "") +
                    may_num + '</div>';

    $('#formatted-mayor-data').append(may_data);

    $('#formatted-mayor-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-mayor-data');

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Fresno City Council

///////////////////////////////////////////

// City Council District 4

$.ajax({
  url: '/wp-content/elections/03_2020/data/cc4.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cc4 = resp.data;
  $.each( cc4, function( key, cc4 ){
    var cc4_index = (cc4.index);
    var cc4_item = (cc4.item);
    var cc4_name = cc4_item.toLowerCase();
    var cc4_votes = (cc4.votePrcnt);
    var cc4_num = (cc4.voteNum);
    var cc4_data = '<div class="fresno-item index-item-' + cc4_index + ' fresno-candidate"' + ' data-value="' + cc4_num + '">' +
                   '<span class="item-name">' + cc4_name + '</span>' +
                   (cc4_index != '0' ? ': ' : "") + ' ' +
                   (cc4_votes != null ? cc4_votes + ' &nbsp;|&nbsp; ' : "") +
                   cc4_num + '</div>';

    $('#formatted-cc4-data').append(cc4_data);

    $('#formatted-cc4-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-cc4-data');

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Fresno Ballot Measures

///////////////////////////////////////////

// Measure A

$.ajax({
  url: '/wp-content/elections/03_2020/data/msrA.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var msrA = resp.data;
  $.each( msrA, function( key, msrA ){
    var msrA_index = (msrA.index);
    var msrA_item = (msrA.item);
    var msrA_name = msrA_item.toLowerCase();
    var msrA_votes = (msrA.votePrcnt);
    var msrA_num = (msrA.voteNum);
    var msrA_data = '<div class="fresno-item ballot-index-item-' + msrA_index + ' fresno-measure"' + ' data-value="' + msrA_num + '">' +
                    '<div class="' + (msrA_name == 'bonds - yes' ? 'yesPercent' : " ") + (msrA_name == 'bonds - no' ? 'noPercent' : " ") + '">' + '<span class="item-name ' + '">' + msrA_name + '</span>' + 
                    (msrA_index != '0' ? ': ' : "") + ' ' + 
                    (msrA_votes != null ? msrA_votes + ' &nbsp;|&nbsp; ' : "") + 
                    msrA_num + '</div>' + '</div>';

    $('#formatted-msrA-data').append(msrA_data);

    $('#formatted-msrA-data').find('.fresno-measure').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-msrA-data');

  });

});

///////////////////////////////////////////

// Measure C

$.ajax({
  url: '/wp-content/elections/03_2020/data/msrC.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var msrC = resp.data;
  $.each( msrC, function( key, msrC ){
    var msrC_index = (msrC.index);
    var msrC_item = (msrC.item);
    var msrC_name = msrC_item.toLowerCase();
    var msrC_votes = (msrC.votePrcnt);
    var msrC_num = (msrC.voteNum);
    var msrC_data = '<div class="fresno-item ballot-index-item-' + msrC_index + ' fresno-measure"' + ' data-value="' + msrC_num + '">' +
                    '<div class="' + (msrC_name == 'bonds - yes' ? 'yesPercent' : " ") + (msrC_name == 'bonds - no' ? 'noPercent' : " ") + '">' + '<span class="item-name ' + '">' + msrC_name + '</span>' + 
                    (msrC_index != '0' ? ': ' : "") + ' ' + 
                    (msrC_votes != null ? msrC_votes + ' &nbsp;|&nbsp; ' : "") + 
                    msrC_num + '</div>' + '</div>';

    $('#formatted-msrC-data').append(msrC_data);

    $('#formatted-msrC-data').find('.fresno-measure').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-msrC-data');

  });

});

///////////////////////////////////////////

// Measure M

$.ajax({
  url: '/wp-content/elections/03_2020/data/msrM.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var msrM = resp.data;
  $.each( msrM, function( key, msrM ){
    var msrM_index = (msrM.index);
    var msrM_item = (msrM.item);
    var msrM_name = msrM_item.toLowerCase();
    var msrM_votes = (msrM.votePrcnt);
    var msrM_num = (msrM.voteNum);
    var msrM_data = '<div class="fresno-item ballot-index-item-' + msrM_index + (msrM_index > '6' ? ' fresno-measure"' + ' data-value="' + msrM_num + '">' : '">') +
                    '<div class="' + (msrM_name == 'bonds - yes' ? 'yesPercent' : " ") + (msrM_name == 'bonds - no' ? 'noPercent' : " ") + '">' + '<span class="item-name ' + '">' + msrM_name + '</span>' + 
                    (msrM_index != '0' ? ': ' : "") + ' ' + 
                    (msrM_votes != null ? msrM_votes + ' &nbsp;|&nbsp; ' : "") + 
                    msrM_num + '</div>' + '</div>';

    $('#formatted-msrM-data').append(msrM_data);

    $('#formatted-msrM-data').find('.fresno-measure').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-msrM-data');

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Fresno County Superior Court

///////////////////////////////////////////

// FCSCJ 6

$.ajax({
  url: '/wp-content/elections/03_2020/data/fcscj6.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fcscj6 = resp.data;
  $.each( fcscj6, function( key, fcscj6 ){
    var fcscj6_index = (fcscj6.index);
    var fcscj6_item = (fcscj6.item);
    var fcscj6_name = fcscj6_item.toLowerCase();
    var fcscj6_votes = (fcscj6.votePrcnt);
    var fcscj6_num = (fcscj6.voteNum);
    var fcscj6_data = '<div class="fresno-item index-item-' + fcscj6_index + ' fresno-candidate"' + ' data-value="' + fcscj6_num + '">' +
                   '<span class="item-name">' + fcscj6_name + '</span>' + 
                   (fcscj6_index != '0' ? ': ' : "") + ' ' + 
                   (fcscj6_votes != null ? fcscj6_votes + ' &nbsp;|&nbsp; ' : "") + 
                   fcscj6_num + '</div>';

    $('#formatted-fcscj6-data').append(fcscj6_data);

    $('#formatted-fcscj6-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-fcscj6-data');

  });

});

///////////////////////////////////////////

// FCSCJ 11

$.ajax({
  url: '/wp-content/elections/03_2020/data/fcscj11.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fcscj11 = resp.data;
  $.each( fcscj11, function( key, fcscj11 ){
    var fcscj11_index = (fcscj11.index);
    var fcscj11_item = (fcscj11.item);
    var fcscj11_name = fcscj11_item.toLowerCase();
    var fcscj11_votes = (fcscj11.votePrcnt);
    var fcscj11_num = (fcscj11.voteNum);
    var fcscj11_data = '<div class="fresno-item index-item-' + fcscj11_index + ' fresno-candidate"' + ' data-value="' + fcscj11_num + '">' +
                   '<span class="item-name">' + fcscj11_name + '</span>' + 
                   (fcscj11_index != '0' ? ': ' : "") + ' ' + 
                   (fcscj11_votes != null ? fcscj11_votes + ' &nbsp;|&nbsp; ' : "") + 
                   fcscj11_num + '</div>';

    $('#formatted-fcscj11-data').append(fcscj11_data);

    $('#formatted-fcscj11-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-fcscj11-data');

  });

});

///////////////////////////////////////////