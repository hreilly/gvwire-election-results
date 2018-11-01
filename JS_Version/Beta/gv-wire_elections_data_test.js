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
    $(".election-search-item").filter(function() {
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
  var msr_header = '<div class="election-category-header">' + '<h3>' + resp.raceTitle + '</h3>' +
                       resp.Reporting + '<br>' +
                       resp.ReportingTime + '</div>';

  // Print the data to the specified div id
  $('#msr-data-header').append(msr_header);

  // Loop through the array for each object in the 'msr_obj' array
  $.each( msr_obj, function( key, msr ){
    var msr_num = (msr.Number);
    var msr_name = (msr.Name);
    var msr_yes = (msr.yesPercent);
    var msr_no = (msr.noPercent);
    var msr_data = '<div class="ballot-measure election-results-group election-search-item">' + '<h3>Measure ' + msr_num + ': ' + msr_name + '</h3>' +
                   '<div>' + 'Yes:&nbsp;' + msr_yes + '%' + '<br>' +
                   'No:&nbsp;' + msr_no + '%' + '</div>' + '</div>';

    $('#msr-data-container').append(msr_data);
  });

});

///////////////////////////////////////////

// Governor

$.ajax({
  url: "https://api.sos.ca.gov/returns/governor"
}).done(function(resp) {
  var resp_string = JSON.stringify(resp);
  $('#raw-data').append(resp_string);
  var gov_obj = resp.candidates;
  var gov_header = '<div class="election-category-header">' + '<h3>' + resp.raceTitle + '</h3>' +
                       resp.Reporting + '<br>' +
                       resp.ReportingTime + '</div>';
  $('#formatted-gov-data').append(gov_header);

  $.each( gov_obj, function( key, gov ){
    var gov_name = (gov.Name);
    var gov_prty = (gov.Party);
    var gov_votes = (gov.Percent);
    var gov_data = '<div class="election-candidate">' + '<span class="' + gov_prty + '">' + gov_name + '</span>:' + ' ' + gov_votes + '%' + '</div>';

    $('#formatted-gov-data').append(gov_data);

  });

});

///////////////////////////////////////////

// 

///////////////////////////////////////////

// State Assembly District 5

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/5"
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#raw-data').append(resp_string);
  var st_asmbly_d5_obj = resp.candidates;
  var st_asmbly_d5_header = '<div class="election-category-header">' + '<h3>' + resp.raceTitle + '</h3>' +
                            resp.Reporting + '<br>' +
                            resp.ReportingTime + '</div>';

  $('#formatted-sad5-data').append(st_asmbly_d5_header);

  $.each( st_asmbly_d5_obj, function( key, sad5 ){
    var sad5_name = (sad5.Name);
    var sad5_prty = (sad5.Party);
    var sad5_votes = (sad5.Percent);
    var sad5_data = '<div class="election-candidate">' + '<span class="' + sad5_prty + '">' + sad5_name + '</span>:' + ' ' + sad5_votes + '%' + '</div>';

    $('#formatted-sad5-data').append(sad5_data);

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

// City Council District 3

$.ajax({
  url: 'https://res.cloudinary.com/granville-homes/raw/upload/v1541017376/cc3.json'
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#fresno-county-data').append(resp_string);
  var city_council_3 = resp.data;
  $.each( city_council_3, function( key, cc3 ){
    var cc3_index = (cc3.index);
    var cc3_item = (cc3.item);
    var cc3_votes = (cc3.votePrcnt);
    var cc3_num = (cc3.voteNum);
    var cc3_data = '<div class="index-item-' + cc3_index + '">' +
                   '<span>' + cc3_item + '</span>' + (cc3_num != false ? ': ' : "") + ' ' + (cc3_votes != false ? cc3_votes + ' | ' : "") + cc3_num + '</div>';

    $('#formatted-city-council-3-data').append(cc3_data);

  });

});

// City Council District 5

$.ajax({
  url: 'https://res.cloudinary.com/granville-homes/raw/upload/v1541017375/cc5.json'
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#fresno-county-data').append(resp_string);
  var city_council_5 = resp.data;
  $.each( city_council_5, function( key, cc5 ){
    var cc5_index = (cc5.index);
    var cc5_item = (cc5.item);
    var cc5_name = cc5_item.toLowerCase();
    var cc5_votes = (cc5.votePrcnt);
    var cc5_num = (cc5.voteNum);
    var cc5_data = '<div class="index-item-' + cc5_index + '">' +
                   '<span class="item-name">' + cc5_name + '</span>' +
                   (cc5_num != false ? ': ' : "") + ' ' +
                   (cc5_votes != false ? cc5_votes + ' | ' : "") +
                   cc5_num + '</div>';

    $('#formatted-city-council-5-data').append(cc5_data);

  });

});

// City Council District 7

$.ajax({
  url: 'https://res.cloudinary.com/granville-homes/raw/upload/v1541017375/cc7.json'
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#fresno-county-data').append(resp_string);
  var city_council_7 = resp.data;
  $.each( city_council_7, function( key, cc7 ){
    var cc7_index = (cc7.index);
    var cc7_item = (cc7.item);
    var cc7_name = cc7_item.toLowerCase();
    var cc7_votes = (cc7.votePrcnt);
    var cc7_num = (cc7.voteNum);
    var cc7_data = '<div class="index-item-' + cc7_index + '">' +
                   '<span class="item-name">' + cc7_name + '</span>' + 
                   (cc7_num != false ? ': ' : "") + ' ' + 
                   (cc7_votes != false ? cc7_votes + ' | ' : "") + 
                   cc7_num + '</div>';

    $('#formatted-city-council-7-data').append(cc7_data);

  });

});
