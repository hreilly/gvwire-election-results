///////////////////////////////////////////
//
//   2018 Hannah Reilly
//
///////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Live search and no-conflict mode.

////////////////////////////////////////////////////////////////////////////////////

// Enable no-conflict for legacy JQuery features
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
  var resp_string = JSON.stringify(resp);

  // Print raw data to the specified div id
  $('#raw-data').append(resp_string);

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
    var msr_data = '<div class="ballot-measure election-results-group srchbl">' + '<h3>Measure ' + msr_num + ': ' + msr_name + '</h3>' +
                   '<div class="yesPercent">' + 'Yes:&nbsp;' + msr_yes + '%' + '</div>' +
                   '<div class="noPercent">' + 'No:&nbsp;' + msr_no + '%' + '</div>' + '</div>';

    $('#msr-data-container').append(msr_data);
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
    var gov_data = '<div class="election-candidate">' + '<span class="' + gov_prty + '">' + gov_name + '</span>:' + ' ' + gov_votes + '%' + '</div>';

    $('#formatted-gov-data').append(gov_data);

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
    var ltgov_data = '<div class="election-candidate">' + '<span class="' + ltgov_prty + '">' + ltgov_name + '</span>:' + ' ' + ltgov_votes + '%' + '</div>';

    $('#formatted-ltgov-data').append(ltgov_data);

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
    var sos_data = '<div class="election-candidate">' + '<span class="' + sos_prty + '">' + sos_name + '</span>:' + ' ' + sos_votes + '%' + '</div>';

    $('#formatted-sos-data').append(sos_data);

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
    var attGen_data = '<div class="election-candidate">' + '<span class="' + attGen_prty + '">' + attGen_name + '</span>:' + ' ' + attGen_votes + '%' + '</div>';

    $('#formatted-attGen-data').append(attGen_data);

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
    var trsr_data = '<div class="election-candidate">' + '<span class="' + trsr_prty + '">' + trsr_name + '</span>:' + ' ' + trsr_votes + '%' + '</div>';

    $('#formatted-trsr-data').append(trsr_data);

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
    var cont_data = '<div class="election-candidate">' + '<span class="' + cont_prty + '">' + cont_name + '</span>:' + ' ' + cont_votes + '%' + '</div>';

    $('#formatted-cont-data').append(cont_data);

  });

});

///////////////////////////////////////////

// Superintendent of Public Instruction

$.ajax({
  url: "https://api.sos.ca.gov/returns/superintendent-of-public-instruction"
}).done(function(resp) {
  var resp_string = JSON.stringify(resp);
  $('#raw-data').append(resp_string);

  var sopi_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-sopi-data').append(sopi_header);

  var sopi_obj = resp.candidates;

  $.each( sopi_obj, function( key, sopi ){
    var sopi_name = (sopi.Name);
    var sopi_prty = (sopi.Party);
    var sopi_votes = (sopi.Percent);
    var sopi_data = '<div class="election-candidate">' + '<span class="' + sopi_prty + '">' + sopi_name + '</span>:' + ' ' + sopi_votes + '%' + '</div>';

    $('#formatted-sopi-data').append(sopi_data);

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
    var insCom_data = '<div class="election-candidate">' + '<span class="' + insCom_prty + '">' + insCom_name + '</span>:' + ' ' + insCom_votes + '%' + '</div>';

    $('#formatted-insCom-data').append(insCom_data);

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
    var ussen_data = '<div class="election-candidate">' + '<span class="' + ussen_prty + '">' + ussen_name + '</span>:' + ' ' + ussen_votes + '%' + '</div>';

    $('#formatted-ussen-data').append(ussen_data);

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// District Races

///////////////////////////////////////////

// U.S Congress CA 4

$.ajax({
  url: "https://api.sos.ca.gov/returns/us-rep/district/4"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var usca4_obj = resp.candidates;
  var usca4_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-usca4-data').append(usca4_header);

  $.each( usca4_obj, function( key, usca4 ){
    var usca4_name = (usca4.Name);
    var usca4_prty = (usca4.Party);
    var usca4_votes = (usca4.Percent);
    var usca4_data = '<div class="election-candidate">' + '<span class="' + usca4_prty + '">' + usca4_name + '</span>:' + ' ' + usca4_votes + '%' + '</div>';

    $('#formatted-usca4-data').append(usca4_data);

  });

});

///////////////////////////////////////////

// U.S Congress CA 10

$.ajax({
  url: "https://api.sos.ca.gov/returns/us-rep/district/10"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var usca10_obj = resp.candidates;
  var usca10_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-usca10-data').append(usca10_header);

  $.each( usca10_obj, function( key, usca10 ){
    var usca10_name = (usca10.Name);
    var usca10_prty = (usca10.Party);
    var usca10_votes = (usca10.Percent);
    var usca10_data = '<div class="election-candidate">' + '<span class="' + usca10_prty + '">' + usca10_name + '</span>:' + ' ' + usca10_votes + '%' + '</div>';

    $('#formatted-usca10-data').append(usca10_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-usca16-data').append(usca16_header);

  $.each( usca16_obj, function( key, usca16 ){
    var usca16_name = (usca16.Name);
    var usca16_prty = (usca16.Party);
    var usca16_votes = (usca16.Percent);
    var usca16_data = '<div class="election-candidate">' + '<span class="' + usca16_prty + '">' + usca16_name + '</span>:' + ' ' + usca16_votes + '%' + '</div>';

    $('#formatted-usca16-data').append(usca16_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-usca21-data').append(usca21_header);

  $.each( usca21_obj, function( key, usca21 ){
    var usca21_name = (usca21.Name);
    var usca21_prty = (usca21.Party);
    var usca21_votes = (usca21.Percent);
    var usca21_data = '<div class="election-candidate">' + '<span class="' + usca21_prty + '">' + usca21_name + '</span>:' + ' ' + usca21_votes + '%' + '</div>';

    $('#formatted-usca21-data').append(usca21_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-usca22-data').append(usca22_header);

  $.each( usca22_obj, function( key, usca22 ){
    var usca22_name = (usca22.Name);
    var usca22_prty = (usca22.Party);
    var usca22_votes = (usca22.Percent);
    var usca22_data = '<div class="election-candidate">' + '<span class="' + usca22_prty + '">' + usca22_name + '</span>:' + ' ' + usca22_votes + '%' + '</div>';

    $('#formatted-usca22-data').append(usca22_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-usca23-data').append(usca23_header);

  $.each( usca23_obj, function( key, usca23 ){
    var usca23_name = (usca23.Name);
    var usca23_prty = (usca23.Party);
    var usca23_votes = (usca23.Percent);
    var usca23_data = '<div class="election-candidate">' + '<span class="' + usca23_prty + '">' + usca23_name + '</span>:' + ' ' + usca23_votes + '%' + '</div>';

    $('#formatted-usca23-data').append(usca23_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-casen8-data').append(casen8_header);

  $.each( casen8_obj, function( key, casen8 ){
    var casen8_name = (casen8.Name);
    var casen8_prty = (casen8.Party);
    var casen8_votes = (casen8.Percent);
    var casen8_data = '<div class="election-candidate">' + '<span class="' + casen8_prty + '">' + casen8_name + '</span>:' + ' ' + casen8_votes + '%' + '</div>';

    $('#formatted-casen8-data').append(casen8_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-casen12-data').append(casen12_header);

  $.each( casen12_obj, function( key, casen12 ){
    var casen12_name = (casen12.Name);
    var casen12_prty = (casen12.Party);
    var casen12_votes = (casen12.Percent);
    var casen12_data = '<div class="election-candidate">' + '<span class="' + casen12_prty + '">' + casen12_name + '</span>:' + ' ' + casen12_votes + '%' + '</div>';

    $('#formatted-casen12-data').append(casen12_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-casen14-data').append(casen14_header);

  $.each( casen14_obj, function( key, casen14 ){
    var casen14_name = (casen14.Name);
    var casen14_prty = (casen14.Party);
    var casen14_votes = (casen14.Percent);
    var casen14_data = '<div class="election-candidate">' + '<span class="' + casen14_prty + '">' + casen14_name + '</span>:' + ' ' + casen14_votes + '%' + '</div>';

    $('#formatted-casen14-data').append(casen14_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-sad5-data').append(sad5_header);

  $.each( sad5_obj, function( key, sad5 ){
    var sad5_name = (sad5.Name);
    var sad5_prty = (sad5.Party);
    var sad5_votes = (sad5.Percent);
    var sad5_data = '<div class="election-candidate">' + '<span class="' + sad5_prty + '">' + sad5_name + '</span>:' + ' ' + sad5_votes + '%' + '</div>';

    $('#formatted-sad5-data').append(sad5_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-sad21-data').append(sad21_header);

  $.each( sad21_obj, function( key, sad21 ){
    var sad21_name = (sad21.Name);
    var sad21_prty = (sad21.Party);
    var sad21_votes = (sad21.Percent);
    var sad21_data = '<div class="election-candidate">' + '<span class="' + sad21_prty + '">' + sad21_name + '</span>:' + ' ' + sad21_votes + '%' + '</div>';

    $('#formatted-sad21-data').append(sad21_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-sad23-data').append(sad23_header);

  $.each( sad23_obj, function( key, sad23 ){
    var sad23_name = (sad23.Name);
    var sad23_prty = (sad23.Party);
    var sad23_votes = (sad23.Percent);
    var sad23_data = '<div class="election-candidate">' + '<span class="' + sad23_prty + '">' + sad23_name + '</span>:' + ' ' + sad23_votes + '%' + '</div>';

    $('#formatted-sad23-data').append(sad23_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-sad26-data').append(sad26_header);

  $.each( sad26_obj, function( key, sad26 ){
    var sad26_name = (sad26.Name);
    var sad26_prty = (sad26.Party);
    var sad26_votes = (sad26.Percent);
    var sad26_data = '<div class="election-candidate">' + '<span class="' + sad26_prty + '">' + sad26_name + '</span>:' + ' ' + sad26_votes + '%' + '</div>';

    $('#formatted-sad26-data').append(sad26_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-sad31-data').append(sad31_header);

  $.each( sad31_obj, function( key, sad31 ){
    var sad31_name = (sad31.Name);
    var sad31_prty = (sad31.Party);
    var sad31_votes = (sad31.Percent);
    var sad31_data = '<div class="election-candidate">' + '<span class="' + sad31_prty + '">' + sad31_name + '</span>:' + ' ' + sad31_votes + '%' + '</div>';

    $('#formatted-sad31-data').append(sad31_data);

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
                            '<div class="election-details">' + resp.Reporting + '<br>' +
                            resp.ReportingTime + '<div>' + '</div>';

  $('#formatted-sad32-data').append(sad32_header);

  $.each( sad32_obj, function( key, sad32 ){
    var sad32_name = (sad32.Name);
    var sad32_prty = (sad32.Party);
    var sad32_votes = (sad32.Percent);
    var sad32_data = '<div class="election-candidate">' + '<span class="' + sad32_prty + '">' + sad32_name + '</span>:' + ' ' + sad32_votes + '%' + '</div>';

    $('#formatted-sad32-data').append(sad32_data);

  });

});

// End data from CA SoS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// This script pulls raw election data parsed from the Fresno County Registrar of Voters and prints it. JSON is refreshed every 10 minutes during election reporting.

////////////////////////////////////////////////////////////////////////////////////

var request = new XMLHttpRequest();

request.open('GET', 'https://res.cloudinary.com/granville-homes/raw/upload/v1541017376/cc3.json', true);
request.onload = function () {

  if (request.status >= 200 && request.status < 400) {
    console.log('Connection to FCROV data successful!');
  } else {
    console.log('Error, no connection.');
  }
}

request.send();

///////////////////////////////////////////
// Parse JSON data with JQuery
///////////////////////////////////////////

// Time Data

$.ajax({
  url: '/python/data/time.json'
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#fresno-county-data').append(resp_string);
  var fresnoTime = resp.data;
  $.each( fresnoTime, function( key, fresnoTime ){
    var fresnoTime_time = (fresnoTime.time);

    $('#fresno-county-time').append(fresnoTime_time);

  });

});

// Overview Data

$.ajax({
  url: '/python/data/overview.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var city_council_3 = resp.data;
  $.each( city_council_3, function( key, cc3 ){
    var cc3_index = (cc3.index);
    var cc3_item = (cc3.item);
    var cc3_name = cc3_item.toLowerCase();
    var cc3_votes = (cc3.votePrcnt);
    var cc3_num = (cc3.voteNum);
    var cc3_data = '<div class="fresno-item index-item-' + cc3_index + '">' +
                   '<span class="item-name">' + cc3_name + '</span>' +
                   (cc3_num != false ? ': ' : "") + ' ' +
                   (cc3_votes != false ? cc3_votes + ' &nbsp;|&nbsp; ' : "") +
                   cc3_num + '</div>';

    $('#formatted-city-council-3-data').append(cc3_data);

  });

});

///////////////////////////////////////////

// City Council District 3

$.ajax({
  url: '/python/data/cc3.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var city_council_3 = resp.data;
  $.each( city_council_3, function( key, cc3 ){
    var cc3_index = (cc3.index);
    var cc3_item = (cc3.item);
    var cc3_name = cc3_item.toLowerCase();
    var cc3_votes = (cc3.votePrcnt);
    var cc3_num = (cc3.voteNum);
    var cc3_data = '<div class="fresno-item index-item-' + cc3_index + '">' +
                   '<span class="item-name">' + cc3_name + '</span>' +
                   (cc3_num != false ? ': ' : "") + ' ' +
                   (cc3_votes != false ? cc3_votes + ' &nbsp;|&nbsp; ' : "") +
                   cc3_num + '</div>';

    $('#formatted-city-council-3-data').append(cc3_data);

  });

});

///////////////////////////////////////////

// City Council District 5

$.ajax({
  url: 'https://res.cloudinary.com/granville-homes/raw/upload/v1541017375/cc5.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var city_council_5 = resp.data;
  $.each( city_council_5, function( key, cc5 ){
    var cc5_index = (cc5.index);
    var cc5_item = (cc5.item);
    var cc5_name = cc5_item.toLowerCase();
    var cc5_votes = (cc5.votePrcnt);
    var cc5_num = (cc5.voteNum);
    var cc5_data = '<div class="fresno-item index-item-' + cc5_index + '">' +
                   '<span class="item-name">' + cc5_name + '</span>' +
                   (cc5_num != false ? ':&nbsp; ' : "") + ' ' +
                   (cc5_votes != false ? cc5_votes + ' &nbsp;|&nbsp; ' : "") +
                   cc5_num + '</div>';

    $('#formatted-city-council-5-data').append(cc5_data);

  });

});

///////////////////////////////////////////

// City Council District 7

$.ajax({
  url: 'https://res.cloudinary.com/granville-homes/raw/upload/v1541017375/cc7.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var city_council_7 = resp.data;
  $.each( city_council_7, function( key, cc7 ){
    var cc7_index = (cc7.index);
    var cc7_item = (cc7.item);
    var cc7_name = cc7_item.toLowerCase();
    var cc7_votes = (cc7.votePrcnt);
    var cc7_num = (cc7.voteNum);
    var cc7_data = '<div class="fresno-item index-item-' + cc7_index + '">' +
                   '<span class="item-name">' + cc7_name + '</span>' + 
                   (cc7_num != false ? ': ' : "") + ' ' + 
                   (cc7_votes != false ? cc7_votes + ' &nbsp;|&nbsp; ' : "") + 
                   cc7_num + '</div>';

    $('#formatted-city-council-7-data').append(cc7_data);

  });

});
