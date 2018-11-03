///////////////////////////////////////////
//
//   2018 Hannah Reilly
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

request.open('GET', 'https://api.sos.ca.gov/returns/status', true);
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

///////////////////////////////////////////

// Governor

$.ajax({
  url: "https://api.sos.ca.gov/returns/governor"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  // Only needed once per category
  var statewide_header = resp.Reporting + '<br>' + resp.ReportingTime;
  $('#statewide-reporting-content').append(statewide_header);

  var gov_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-gov-data').append(gov_header);

  var gov_obj = resp.candidates;

  $.each( gov_obj, function( key, gov ){
    var gov_name = (gov.Name);
    var gov_prty = (gov.Party);
    var gov_votes = (gov.Percent);
    var gov_data = '<div class="election-candidate" data-value="' + gov_votes + '">' + '<span class="' + gov_prty + '">' + gov_name + '</span>:' + ' ' + gov_votes + '%' + '</div>';

    $('#formatted-gov-data').append(gov_data);

    $('#formatted-gov-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-gov-data');

  });

});

///////////////////////////////////////////

// Lt. Governor

$.ajax({
  url: "https://api.sos.ca.gov/returns/lieutenant-governor"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var ltgov_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-ltgov-data').append(ltgov_header);

  var ltgov_obj = resp.candidates;

  $.each( ltgov_obj, function( key, ltgov ){
    var ltgov_name = (ltgov.Name);
    var ltgov_prty = (ltgov.Party);
    var ltgov_votes = (ltgov.Percent);
    var ltgov_data = '<div class="election-candidate" data-value="' + ltgov_votes + '">' + '<span class="' + ltgov_prty + '">' + ltgov_name + '</span>:' + ' ' + ltgov_votes + '%' + '</div>';

    $('#formatted-ltgov-data').append(ltgov_data);

    $('#formatted-ltgov-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-ltgov-data');

  });

});

///////////////////////////////////////////

// Secretary of State

$.ajax({
  url: "https://api.sos.ca.gov/returns/secretary-of-state"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var sos_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-sos-data').append(sos_header);

  var sos_obj = resp.candidates;

  $.each( sos_obj, function( key, sos ){
    var sos_name = (sos.Name);
    var sos_prty = (sos.Party);
    var sos_votes = (sos.Percent);
    var sos_data = '<div class="election-candidate" data-value="' + sos_votes + '">' + '<span class="' + sos_prty + '">' + sos_name + '</span>:' + ' ' + sos_votes + '%' + '</div>';

    $('#formatted-sos-data').append(sos_data);

    $('#formatted-sos-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-sos-data');

  });

});

///////////////////////////////////////////

// Attorney General

$.ajax({
  url: "https://api.sos.ca.gov/returns/attorney-general"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var attGen_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-attGen-data').append(attGen_header);

  var attGen_obj = resp.candidates;

  $.each( attGen_obj, function( key, attGen ){
    var attGen_name = (attGen.Name);
    var attGen_prty = (attGen.Party);
    var attGen_votes = (attGen.Percent);
    var attGen_data = '<div class="election-candidate" data-value="' + attGen_votes + '">' + '<span class="' + attGen_prty + '">' + attGen_name + '</span>:' + ' ' + attGen_votes + '%' + '</div>';

    $('#formatted-attGen-data').append(attGen_data);

    $('#formatted-attGen-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-attGen-data');

  });

});

///////////////////////////////////////////

// Treasurer

$.ajax({
  url: "https://api.sos.ca.gov/returns/treasurer"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var trsr_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-trsr-data').append(trsr_header);

  var trsr_obj = resp.candidates;

  $.each( trsr_obj, function( key, trsr ){
    var trsr_name = (trsr.Name);
    var trsr_prty = (trsr.Party);
    var trsr_votes = (trsr.Percent);
    var trsr_data = '<div class="election-candidate" data-value="' + trsr_votes + '">' + '<span class="' + trsr_prty + '">' + trsr_name + '</span>:' + ' ' + trsr_votes + '%' + '</div>';

    $('#formatted-trsr-data').append(trsr_data);

    $('#formatted-trsr-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-trsr-data');

  });

});

///////////////////////////////////////////

// Controller

$.ajax({
  url: "https://api.sos.ca.gov/returns/controller"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var cont_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-cont-data').append(cont_header);

  var cont_obj = resp.candidates;

  $.each( cont_obj, function( key, cont ){
    var cont_name = (cont.Name);
    var cont_prty = (cont.Party);
    var cont_votes = (cont.Percent);
    var cont_data = '<div class="election-candidate" data-value="' + cont_votes + '">' + '<span class="' + cont_prty + '">' + cont_name + '</span>:' + ' ' + cont_votes + '%' + '</div>';

    $('#formatted-cont-data').append(cont_data);

    $('#formatted-cont-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-cont-data');

  });

});

///////////////////////////////////////////

// Superintendent of Public Instruction

$.ajax({
  url: "https://api.sos.ca.gov/returns/superintendent-of-public-instruction"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var sopi_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-sopi-data').append(sopi_header);

  var sopi_obj = resp.candidates;

  $.each( sopi_obj, function( key, sopi ){
    var sopi_name = (sopi.Name);
    var sopi_prty = (sopi.Party);
    var sopi_votes = (sopi.Percent);
    var sopi_data = '<div class="election-candidate" data-value="' + sopi_votes + '">' + '<span class="' + sopi_prty + '">' + sopi_name + '</span>:' + ' ' + sopi_votes + '%' + '</div>';

    $('#formatted-sopi-data').append(sopi_data);

    $('#formatted-sopi-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-sopi-data');

  });

});

///////////////////////////////////////////

// Insurance Commissioner

$.ajax({
  url: "https://api.sos.ca.gov/returns/insurance-commissioner"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var insCom_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-insCom-data').append(insCom_header);

  var insCom_obj = resp.candidates;

  $.each( insCom_obj, function( key, insCom ){
    var insCom_name = (insCom.Name);
    var insCom_prty = (insCom.Party);
    var insCom_votes = (insCom.Percent);
    var insCom_data = '<div class="election-candidate" data-value="' + insCom_votes + '">' + '<span class="' + insCom_prty + '">' + insCom_name + '</span>:' + ' ' + insCom_votes + '%' + '</div>';

    $('#formatted-insCom-data').append(insCom_data);

    $('#formatted-insCom-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-insCom-data');

  });

});

///////////////////////////////////////////

// United States Senate

$.ajax({
  url: "https://api.sos.ca.gov/returns/us-senate"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  var ussen_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-ussen-data').append(ussen_header);

  var ussen_obj = resp.candidates;

  $.each( ussen_obj, function( key, ussen ){
    var ussen_name = (ussen.Name);
    var ussen_prty = (ussen.Party);
    var ussen_votes = (ussen.Percent);
    var ussen_data = '<div class="election-candidate" data-value="' + ussen_votes + '">' + '<span class="' + ussen_prty + '">' + ussen_name + '</span>:' + ' ' + ussen_votes + '%' + '</div>';

    $('#formatted-ussen-data').append(ussen_data);

    $('#formatted-ussen-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-ussen-data');

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// District Races

///////////////////////////////////////////

// U.S Congress CA 4

$.ajax({
  url: "https://api.sos.ca.gov/returns/us-rep/district/4"
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#raw-data').append(resp_string);
  var usca4_obj = resp.candidates;
  var usca4_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-usca4-data').append(usca4_header);

  $.each( usca4_obj, function( key, usca4 ){
    var usca4_name = (usca4.Name);
    var usca4_prty = (usca4.Party);
    var usca4_votes = (usca4.Percent);
    var usca4_data = '<div class="election-candidate" data-value="' + usca4_votes + '">' + '<span class="' + usca4_prty + '">' + usca4_name + '</span>:' + ' ' + usca4_votes + '%' + '</div>';

    $('#formatted-usca4-data').append(usca4_data);

    $('#formatted-usca4-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-usca4-data');

  });

});

///////////////////////////////////////////

// U.S Congress CA 10

$.ajax({
  url: "https://api.sos.ca.gov/returns/us-rep/district/10"
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#raw-data').append(resp_string);
  var usca10_obj = resp.candidates;
  var usca10_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-usca10-data').append(usca10_header);

  $.each( usca10_obj, function( key, usca10 ){
    var usca10_name = (usca10.Name);
    var usca10_prty = (usca10.Party);
    var usca10_votes = (usca10.Percent);
    var usca10_data = '<div class="election-candidate" data-value="' + usca10_votes + '">' + '<span class="' + usca10_prty + '">' + usca10_name + '</span>:' + ' ' + usca10_votes + '%' + '</div>';

    $('#formatted-usca10-data').append(usca10_data);

    $('#formatted-usca10-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-usca10-data');

  });

});

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

///////////////////////////////////////////

// U.S Congress CA 23

$.ajax({
  url: "https://api.sos.ca.gov/returns/us-rep/district/23"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var usca23_obj = resp.candidates;
  var usca23_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-usca23-data').append(usca23_header);

  $.each( usca23_obj, function( key, usca23 ){
    var usca23_name = (usca23.Name);
    var usca23_prty = (usca23.Party);
    var usca23_votes = (usca23.Percent);
    var usca23_data = '<div class="election-candidate" data-value="' + usca23_votes + '">' + '<span class="' + usca23_prty + '">' + usca23_name + '</span>:' + ' ' + usca23_votes + '%' + '</div>';

    $('#formatted-usca23-data').append(usca23_data);

    $('#formatted-usca23-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-usca23-data');

  });

});

///////////////////////////////////////////

// CA Senate District 8

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-senate/district/8"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var casen8_obj = resp.candidates;
  var casen8_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-casen8-data').append(casen8_header);

  $.each( casen8_obj, function( key, casen8 ){
    var casen8_name = (casen8.Name);
    var casen8_prty = (casen8.Party);
    var casen8_votes = (casen8.Percent);
    var casen8_data = '<div class="election-candidate" data-value="' + casen8_votes + '">' + '<span class="' + casen8_prty + '">' + casen8_name + '</span>:' + ' ' + casen8_votes + '%' + '</div>';

    $('#formatted-casen8-data').append(casen8_data);

    $('#formatted-casen8-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-casen8-data');

  });

});

///////////////////////////////////////////

// CA Senate District 12

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-senate/district/12"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var casen12_obj = resp.candidates;
  var casen12_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-casen12-data').append(casen12_header);

  $.each( casen12_obj, function( key, casen12 ){
    var casen12_name = (casen12.Name);
    var casen12_prty = (casen12.Party);
    var casen12_votes = (casen12.Percent);
    var casen12_data = '<div class="election-candidate" data-value="' + casen12_votes + '">' + '<span class="' + casen12_prty + '">' + casen12_name + '</span>:' + ' ' + casen12_votes + '%' + '</div>';

    $('#formatted-casen12-data').append(casen12_data);

    $('#formatted-casen12-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-casen12-data');

  });

});

///////////////////////////////////////////

// CA Senate District 14

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-senate/district/14"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var casen14_obj = resp.candidates;
  var casen14_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-casen14-data').append(casen14_header);

  $.each( casen14_obj, function( key, casen14 ){
    var casen14_name = (casen14.Name);
    var casen14_prty = (casen14.Party);
    var casen14_votes = (casen14.Percent);
    var casen14_data = '<div class="election-candidate" data-value="' + casen14_votes + '">' + '<span class="' + casen14_prty + '">' + casen14_name + '</span>:' + ' ' + casen14_votes + '%' + '</div>';

    $('#formatted-casen14-data').append(casen14_data);

    $('#formatted-casen14-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-casen14-data');

  });

});

///////////////////////////////////////////

// State Assembly District 5

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/5"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var sad5_obj = resp.candidates;
  var sad5_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-sad5-data').append(sad5_header);

  $.each( sad5_obj, function( key, sad5 ){
    var sad5_name = (sad5.Name);
    var sad5_prty = (sad5.Party);
    var sad5_votes = (sad5.Percent);
    var sad5_data = '<div class="election-candidate" data-value="' + sad5_votes + '">' + '<span class="' + sad5_prty + '">' + sad5_name + '</span>:' + ' ' + sad5_votes + '%' + '</div>';

    $('#formatted-sad5-data').append(sad5_data);

    $('#formatted-sad5-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-sad5-data');

  });

});

///////////////////////////////////////////

// State Assembly District 21

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/21"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var sad21_obj = resp.candidates;
  var sad21_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-sad21-data').append(sad21_header);

  $.each( sad21_obj, function( key, sad21 ){
    var sad21_name = (sad21.Name);
    var sad21_prty = (sad21.Party);
    var sad21_votes = (sad21.Percent);
    var sad21_data = '<div class="election-candidate" data-value="' + sad21_votes + '">' + '<span class="' + sad21_prty + '">' + sad21_name + '</span>:' + ' ' + sad21_votes + '%' + '</div>';

    $('#formatted-sad21-data').append(sad21_data);

    $('#formatted-sad21-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-sad21-data');

  });

});

///////////////////////////////////////////

// State Assembly District 23

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/23"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var sad23_obj = resp.candidates;
  var sad23_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-sad23-data').append(sad23_header);

  $.each( sad23_obj, function( key, sad23 ){
    var sad23_name = (sad23.Name);
    var sad23_prty = (sad23.Party);
    var sad23_votes = (sad23.Percent);
    var sad23_data = '<div class="election-candidate" data-value="' + sad23_votes + '">' + '<span class="' + sad23_prty + '">' + sad23_name + '</span>:' + ' ' + sad23_votes + '%' + '</div>';

    $('#formatted-sad23-data').append(sad23_data);

    $('#formatted-sad23-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-sad23-data');

  });

});

///////////////////////////////////////////

// State Assembly District 26

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/26"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var sad26_obj = resp.candidates;
  var sad26_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-sad26-data').append(sad26_header);

  $.each( sad26_obj, function( key, sad26 ){
    var sad26_name = (sad26.Name);
    var sad26_prty = (sad26.Party);
    var sad26_votes = (sad26.Percent);
    var sad26_data = '<div class="election-candidate" data-value="' + sad26_votes + '">' + '<span class="' + sad26_prty + '">' + sad26_name + '</span>:' + ' ' + sad26_votes + '%' + '</div>';

    $('#formatted-sad26-data').append(sad26_data);

    $('#formatted-sad26-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-sad26-data');

  });

});

///////////////////////////////////////////

// State Assembly District 31

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/31"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var sad31_obj = resp.candidates;
  var sad31_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-sad31-data').append(sad31_header);

  $.each( sad31_obj, function( key, sad31 ){
    var sad31_name = (sad31.Name);
    var sad31_prty = (sad31.Party);
    var sad31_votes = (sad31.Percent);
    var sad31_data = '<div class="election-candidate" data-value="' + sad31_votes + '">' + '<span class="' + sad31_prty + '">' + sad31_name + '</span>:' + ' ' + sad31_votes + '%' + '</div>';

    $('#formatted-sad31-data').append(sad31_data);

    $('#formatted-sad31-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-sad31-data');

  });

});

///////////////////////////////////////////

// State Assembly District 32

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/32"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var sad32_obj = resp.candidates;
  var sad32_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-sad32-data').append(sad32_header);

  $.each( sad32_obj, function( key, sad32 ){
    var sad32_name = (sad32.Name);
    var sad32_prty = (sad32.Party);
    var sad32_votes = (sad32.Percent);
    var sad32_data = '<div class="election-candidate" data-value="' + sad32_votes + '">' + '<span class="' + sad32_prty + '">' + sad32_name + '</span>:' + ' ' + sad32_votes + '%' + '</div>';

    $('#formatted-sad32-data').append(sad32_data);

    $('#formatted-sad32-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-sad32-data');

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
  url: '/data/overview.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var overview = resp.data;
  $.each( overview, function( key, overview ){
    var overview_voters = (overview.voters);
    var overview_precincts = (overview.precincts);
    var overview_data = overview_voters + '<br>' + overview_precincts;

    $('#fresno-county-overview').append(overview_data);

  });

});

// Time Data

$.ajax({
  url: '/data/time.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fresnoTime = resp.data;
  $.each( fresnoTime, function( key, fresnoTime ){
    var fresnoTime_time = (fresnoTime.time);
    var time_data = '<br>' + fresnoTime_time;

    $('#fresno-county-overview').append(time_data);

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Fresno City Council

///////////////////////////////////////////

// City Council District 3

$.ajax({
  url: '/data/cc3.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cc3 = resp.data;
  $.each( cc3, function( key, cc3 ){
    var cc3_index = (cc3.index);
    var cc3_item = (cc3.item);
    var cc3_name = cc3_item.toLowerCase();
    var cc3_votes = (cc3.votePrcnt);
    var cc3_num = (cc3.voteNum);
    var cc3_data = '<div class="fresno-item index-item-' + cc3_index + '">' +
                   '<span class="item-name">' + cc3_name + '</span>' +
                   (cc3_index != '0' ? ': ' : "") + ' ' +
                   (cc3_votes != false ? cc3_votes + ' &nbsp;|&nbsp; ' : "") +
                   cc3_num + '</div>';

    $('#formatted-cc3-data').append(cc3_data);

  });

});

///////////////////////////////////////////

// City Council District 5

$.ajax({
  url: '/data/cc5.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cc5 = resp.data;
  $.each( cc5, function( key, cc5 ){
    var cc5_index = (cc5.index);
    var cc5_item = (cc5.item);
    var cc5_name = cc5_item.toLowerCase();
    var cc5_votes = (cc5.votePrcnt);
    var cc5_num = (cc5.voteNum);
    var cc5_data = '<div class="fresno-item index-item-' + cc5_index + '">' +
                   '<span class="item-name">' + cc5_name + '</span>' +
                   (cc5_index != '0' ? ':&nbsp; ' : "") + ' ' +
                   (cc5_votes != false ? cc5_votes + ' &nbsp;|&nbsp; ' : "") +
                   cc5_num + '</div>';

    $('#formatted-cc5-data').append(cc5_data);

  });

});

///////////////////////////////////////////

// City Council District 7

$.ajax({
  url: '/data/cc7.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cc7 = resp.data;
  $.each( cc7, function( key, cc7 ){
    var cc7_index = (cc7.index);
    var cc7_item = (cc7.item);
    var cc7_name = cc7_item.toLowerCase();
    var cc7_votes = (cc7.votePrcnt);
    var cc7_num = (cc7.voteNum);
    var cc7_data = '<div class="fresno-item index-item-' + cc7_index + '">' +
                   '<span class="item-name">' + cc7_name + '</span>' + 
                   (cc7_index != '0' ? ': ' : "") + ' ' + 
                   (cc7_votes != false ? cc7_votes + ' &nbsp;|&nbsp; ' : "") + 
                   cc7_num + '</div>';

    $('#formatted-cc7-data').append(cc7_data);

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Fresno Ballot Measures

///////////////////////////////////////////

// Measure A

$.ajax({
  url: '/data/msrA.json'
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
    var msrA_data = '<div class="fresno-item ballot-index-item-' + msrA_index + '">' +
                    '<div class="' + (msrA_name == 'yes' ? 'yesPercent' : " ") + (msrA_name == 'no' ? 'noPercent' : " ") + '">' + '<span class="item-name ' + '">' + msrA_name + '</span>' + 
                    (msrA_index != '0' ? ': ' : "") + ' ' + 
                    (msrA_votes != false ? msrA_votes + ' &nbsp;|&nbsp; ' : "") + 
                    msrA_num + '</div>' + '</div>';

    $('#formatted-msrA-data').append(msrA_data);

  });

});

///////////////////////////////////////////

// Measure O

$.ajax({
  url: '/data/msrO.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var msrO = resp.data;
  $.each( msrO, function( key, msrO ){
    var msrO_index = (msrO.index);
    var msrO_item = (msrO.item);
    var msrO_name = msrO_item.toLowerCase();
    var msrO_votes = (msrO.votePrcnt);
    var msrO_num = (msrO.voteNum);
    var msrO_data = '<div class="fresno-item ballot-index-item-' + msrO_index + '">' +
                    '<div class="' + (msrO_name == 'yes' ? 'yesPercent' : " ") + (msrO_name == 'no' ? 'noPercent' : " ") + '">' + '<span class="item-name ' + '">' + msrO_name + '</span>' + 
                    (msrO_index != '0' ? ': ' : "") + ' ' + 
                    (msrO_votes != false ? msrO_votes + ' &nbsp;|&nbsp; ' : "") + 
                    msrO_num + '</div>' + '</div>';

    $('#formatted-msrO-data').append(msrO_data);

  });

});

///////////////////////////////////////////

// Measure P

$.ajax({
  url: '/data/msrP.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var msrP = resp.data;
  $.each( msrP, function( key, msrP ){
    var msrP_index = (msrP.index);
    var msrP_item = (msrP.item);
    var msrP_name = msrP_item.toLowerCase();
    var msrP_votes = (msrP.votePrcnt);
    var msrP_num = (msrP.voteNum);
    var msrP_data = '<div class="fresno-item ballot-index-item-' + msrP_index + '">' +
                    '<div class="' + (msrP_name == 'yes' ? 'yesPercent' : " ") + (msrP_name == 'no' ? 'noPercent' : " ") + '">' + '<span class="item-name ' + '">' + msrP_name + '</span>' + 
                    (msrP_index != '0' ? ': ' : "") + ' ' + 
                    (msrP_votes != false ? msrP_votes + ' &nbsp;|&nbsp; ' : "") + 
                    msrP_num + '</div>' + '</div>';

    $('#formatted-msrP-data').append(msrP_data);

  });

});

///////////////////////////////////////////

// Measure Q

$.ajax({
  url: '/data/msrQ.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var msrQ = resp.data;
  $.each( msrQ, function( key, msrQ ){
    var msrQ_index = (msrQ.index);
    var msrQ_item = (msrQ.item);
    var msrQ_name = msrQ_item.toLowerCase();
    var msrQ_votes = (msrQ.votePrcnt);
    var msrQ_num = (msrQ.voteNum);
    var msrQ_data = '<div class="fresno-item ballot-index-item-' + msrQ_index + '">' +
                    '<div class="' + (msrQ_name == 'yes' ? 'yesPercent' : " ") + (msrQ_name == 'no' ? 'noPercent' : " ") + '">' + '<span class="item-name ' + '">' + msrQ_name + '</span>' + 
                    (msrQ_index != '0' ? ': ' : "") + ' ' + 
                    (msrQ_votes != false ? msrQ_votes + ' &nbsp;|&nbsp; ' : "") + 
                    msrQ_num + '</div>' + '</div>';

    $('#formatted-msrQ-data').append(msrQ_data);

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// FUSD Reps

///////////////////////////////////////////

// FUSD 1

$.ajax({
  url: '/data/fusd1.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fusd1 = resp.data;
  $.each( fusd1, function( key, fusd1 ){
    var fusd1_index = (fusd1.index);
    var fusd1_item = (fusd1.item);
    var fusd1_name = fusd1_item.toLowerCase();
    var fusd1_votes = (fusd1.votePrcnt);
    var fusd1_num = (fusd1.voteNum);
    var fusd1_data = '<div class="fresno-item index-item-' + fusd1_index + '">' +
                   '<span class="item-name">' + fusd1_name + '</span>' + 
                   (fusd1_index != '0' ? ': ' : "") + ' ' + 
                   (fusd1_votes != false ? fusd1_votes + ' &nbsp;|&nbsp; ' : "") + 
                   fusd1_num + '</div>';

    $('#formatted-fusd1-data').append(fusd1_data);

  });

});

///////////////////////////////////////////

// FUSD 3

$.ajax({
  url: '/data/fusd3.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fusd3 = resp.data;
  $.each( fusd3, function( key, fusd3 ){
    var fusd3_index = (fusd3.index);
    var fusd3_item = (fusd3.item);
    var fusd3_name = fusd3_item.toLowerCase();
    var fusd3_votes = (fusd3.votePrcnt);
    var fusd3_num = (fusd3.voteNum);
    var fusd3_data = '<div class="fresno-item index-item-' + fusd3_index + '">' +
                   '<span class="item-name">' + fusd3_name + '</span>' + 
                   (fusd3_index != '0' ? ': ' : "") + ' ' + 
                   (fusd3_votes != false ? fusd3_votes + ' &nbsp;|&nbsp; ' : "") + 
                   fusd3_num + '</div>';

    $('#formatted-fusd3-data').append(fusd3_data);

  });

});

///////////////////////////////////////////

// FUSD 4

$.ajax({
  url: '/data/fusd4.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fusd4 = resp.data;
  $.each( fusd4, function( key, fusd4 ){
    var fusd4_index = (fusd4.index);
    var fusd4_item = (fusd4.item);
    var fusd4_name = fusd4_item.toLowerCase();
    var fusd4_votes = (fusd4.votePrcnt);
    var fusd4_num = (fusd4.voteNum);
    var fusd4_data = '<div class="fresno-item index-item-' + fusd4_index + '">' +
                   '<span class="item-name">' + fusd4_name + '</span>' + 
                   (fusd4_index != '0' ? ': ' : "") + ' ' + 
                   (fusd4_votes != false ? fusd4_votes + ' &nbsp;|&nbsp; ' : "") + 
                   fusd4_num + '</div>';

    $('#formatted-fusd4-data').append(fusd4_data);

  });

});

///////////////////////////////////////////

// FUSD 7

$.ajax({
  url: '/data/fusd7.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fusd7 = resp.data;
  $.each( fusd7, function( key, fusd7 ){
    var fusd7_index = (fusd7.index);
    var fusd7_item = (fusd7.item);
    var fusd7_name = fusd7_item.toLowerCase();
    var fusd7_votes = (fusd7.votePrcnt);
    var fusd7_num = (fusd7.voteNum);
    var fusd7_data = '<div class="fresno-item index-item-' + fusd7_index + '">' +
                   '<span class="item-name">' + fusd7_name + '</span>' + 
                   (fusd7_index != '0' ? ': ' : "") + ' ' + 
                   (fusd7_votes != false ? fusd7_votes + ' &nbsp;|&nbsp; ' : "") + 
                   fusd7_num + '</div>';

    $('#formatted-fusd7-data').append(fusd7_data);

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Central Unified Reps

///////////////////////////////////////////

// CenUSD 1

$.ajax({
  url: '/data/cenusd1.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cenusd1 = resp.data;
  $.each( cenusd1, function( key, cenusd1 ){
    var cenusd1_index = (cenusd1.index);
    var cenusd1_item = (cenusd1.item);
    var cenusd1_name = cenusd1_item.toLowerCase();
    var cenusd1_votes = (cenusd1.votePrcnt);
    var cenusd1_num = (cenusd1.voteNum);
    var cenusd1_data = '<div class="fresno-item index-item-' + cenusd1_index + '">' +
                   '<span class="item-name">' + cenusd1_name + '</span>' + 
                   (cenusd1_index != '0' ? ': ' : "") + ' ' + 
                   (cenusd1_votes != false ? cenusd1_votes + ' &nbsp;|&nbsp; ' : "") + 
                   cenusd1_num + '</div>';

    $('#formatted-cenusd1-data').append(cenusd1_data);

  });

});

///////////////////////////////////////////

// CenUSD 2

$.ajax({
  url: '/data/cenusd2.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cenusd2 = resp.data;
  $.each( cenusd2, function( key, cenusd2 ){
    var cenusd2_index = (cenusd2.index);
    var cenusd2_item = (cenusd2.item);
    var cenusd2_name = cenusd2_item.toLowerCase();
    var cenusd2_votes = (cenusd2.votePrcnt);
    var cenusd2_num = (cenusd2.voteNum);
    var cenusd2_data = '<div class="fresno-item index-item-' + cenusd2_index + '">' +
                   '<span class="item-name">' + cenusd2_name + '</span>' + 
                   (cenusd2_index != '0' ? ': ' : "") + ' ' + 
                   (cenusd2_votes != false ? cenusd2_votes + ' &nbsp;|&nbsp; ' : "") + 
                   cenusd2_num + '</div>';

    $('#formatted-cenusd2-data').append(cenusd2_data);

  });

});

///////////////////////////////////////////

// CenUSD 4

$.ajax({
  url: '/data/cenusd4.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cenusd4 = resp.data;
  $.each( cenusd4, function( key, cenusd4 ){
    var cenusd4_index = (cenusd4.index);
    var cenusd4_item = (cenusd4.item);
    var cenusd4_name = cenusd4_item.toLowerCase();
    var cenusd4_votes = (cenusd4.votePrcnt);
    var cenusd4_num = (cenusd4.voteNum);
    var cenusd4_data = '<div class="fresno-item index-item-' + cenusd4_index + '">' +
                   '<span class="item-name">' + cenusd4_name + '</span>' + 
                   (cenusd4_index != '0' ? ': ' : "") + ' ' + 
                   (cenusd4_votes != false ? cenusd4_votes + ' &nbsp;|&nbsp; ' : "") + 
                   cenusd4_num + '</div>';

    $('#formatted-cenusd4-data').append(cenusd4_data);

  });

});

///////////////////////////////////////////

// CenUSD 7

$.ajax({
  url: '/data/cenusd7.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cenusd7 = resp.data;
  $.each( cenusd7, function( key, cenusd7 ){
    var cenusd7_index = (cenusd7.index);
    var cenusd7_item = (cenusd7.item);
    var cenusd7_name = cenusd7_item.toLowerCase();
    var cenusd7_votes = (cenusd7.votePrcnt);
    var cenusd7_num = (cenusd7.voteNum);
    var cenusd7_data = '<div class="fresno-item index-item-' + cenusd7_index + '">' +
                   '<span class="item-name">' + cenusd7_name + '</span>' + 
                   (cenusd7_index != '0' ? ': ' : "") + ' ' + 
                   (cenusd7_votes != false ? cenusd7_votes + ' &nbsp;|&nbsp; ' : "") + 
                   cenusd7_num + '</div>';

    $('#formatted-cenusd7-data').append(cenusd7_data);

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Clovis Unified Reps

///////////////////////////////////////////

// CUSD 1

$.ajax({
  url: '/data/cusd1.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cusd1 = resp.data;
  $.each( cusd1, function( key, cusd1 ){
    var cusd1_index = (cusd1.index);
    var cusd1_item = (cusd1.item);
    var cusd1_name = cusd1_item.toLowerCase();
    var cusd1_votes = (cusd1.votePrcnt);
    var cusd1_num = (cusd1.voteNum);
    var cusd1_data = '<div class="fresno-item index-item-' + cusd1_index + '">' +
                   '<span class="item-name">' + cusd1_name + '</span>' + 
                   (cusd1_index != '0' ? ': ' : "") + ' ' + 
                   (cusd1_votes != false ? cusd1_votes + ' &nbsp;|&nbsp; ' : "") + 
                   cusd1_num + '</div>';

    $('#formatted-cusd1-data').append(cusd1_data);

  });

});

///////////////////////////////////////////

// CUSD 3

$.ajax({
  url: '/data/cusd3.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cusd3 = resp.data;
  $.each( cusd3, function( key, cusd3 ){
    var cusd3_index = (cusd3.index);
    var cusd3_item = (cusd3.item);
    var cusd3_name = cusd3_item.toLowerCase();
    var cusd3_votes = (cusd3.votePrcnt);
    var cusd3_num = (cusd3.voteNum);
    var cusd3_data = '<div class="fresno-item index-item-' + cusd3_index + '">' +
                   '<span class="item-name">' + cusd3_name + '</span>' + 
                   (cusd3_index != '0' ? ': ' : "") + ' ' + 
                   (cusd3_votes != false ? cusd3_votes + ' &nbsp;|&nbsp; ' : "") + 
                   cusd3_num + '</div>';

    $('#formatted-cusd3-data').append(cusd3_data);

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// SCCCD Reps

///////////////////////////////////////////

// SCCCD 4

$.ajax({
  url: '/data/scccd4.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var scccd4 = resp.data;
  $.each( scccd4, function( key, scccd4 ){
    var scccd4_index = (scccd4.index);
    var scccd4_item = (scccd4.item);
    var scccd4_name = scccd4_item.toLowerCase();
    var scccd4_votes = (scccd4.votePrcnt);
    var scccd4_num = (scccd4.voteNum);
    var scccd4_data = '<div class="fresno-item index-item-' + scccd4_index + '">' +
                   '<span class="item-name">' + scccd4_name + '</span>' + 
                   (scccd4_index != '0' ? ': ' : "") + ' ' + 
                   (scccd4_votes != false ? scccd4_votes + ' &nbsp;|&nbsp; ' : "") + 
                   scccd4_num + '</div>';

    $('#formatted-scccd4-data').append(scccd4_data);

  });

});

///////////////////////////////////////////

// SCCCD 5

$.ajax({
  url: '/data/scccd5.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var scccd5 = resp.data;
  $.each( scccd5, function( key, scccd5 ){
    var scccd5_index = (scccd5.index);
    var scccd5_item = (scccd5.item);
    var scccd5_name = scccd5_item.toLowerCase();
    var scccd5_votes = (scccd5.votePrcnt);
    var scccd5_num = (scccd5.voteNum);
    var scccd5_data = '<div class="fresno-item index-item-' + scccd5_index + '">' +
                   '<span class="item-name">' + scccd5_name + '</span>' + 
                   (scccd5_index != '0' ? ': ' : "") + ' ' + 
                   (scccd5_votes != false ? scccd5_votes + ' &nbsp;|&nbsp; ' : "") + 
                   scccd5_num + '</div>';

    $('#formatted-scccd5-data').append(scccd5_data);

  });

});
