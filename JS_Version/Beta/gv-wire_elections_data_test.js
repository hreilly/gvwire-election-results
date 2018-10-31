///////////////////////////////////////////
//
//   2018 Hannah Reilly
//
///////////////////////////////////////////

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
  var msr_header = '<div class="election-category-header">' + resp.raceTitle + '<br>' +
                       resp.Reporting + '<br>' +
                       resp.ReportingTime + '</div>';

  // Print the data to the specified div id
  $('#formatted-msr-data').append(msr_header);

  // Loop through the array for each object in the 'msr_obj' array
  $.each( msr_obj, function( key, msr ){
    var msr_num = (msr.Number);
    var msr_name = (msr.Name);
    var msr_yes = (msr.yesPercent);
    var msr_no = (msr.noPercent);
    var msr_data = '<h3>Measure&nbsp;' + msr_num + ':&nbsp;' + msr_name + '</h3>' +
                  '<div>' + 'Yes:&nbsp;' + msr_yes + '%' + '<br>' +
                  'No:&nbsp;' + msr_no + '%' + '</div>' +
                  '<hr>';

    $('#formatted-msr-data').append(msr_data);
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
    var gov_data = '<div>' + '<span class="' + gov_prty + '">' + gov_name + '</span>:' + ' ' + gov_votes + '%' + '</div>';

    $('#formatted-gov-data').append(gov_data);

  });

});

///////////////////////////////////////////

// State Assembly District 1

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/1"
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#raw-data').append(resp_string);
  var st_asmbly_d1_obj = resp.candidates;
  var st_asmbly_d1_header = '<div class="election-category-header">' + resp.raceTitle + '<br>' +
                            resp.Reporting + '<br>' +
                            resp.ReportingTime + '</div>';

  $('#formatted-st-asmbly-d1-data').append(st_asmbly_d1_header);

  $.each( st_asmbly_d1_obj, function( key, sad1 ){
    var sad1_name = (sad1.Name);
    var sad1_prty = (sad1.Party);
    var sad1_votes = (sad1.Percent);
    var sad1_data = '<div>' + '<span class="' + sad1_prty + '">' + sad1_name + '</span>:' + ' ' + sad1_votes + '%' + '</div>';

    $('#formatted-st-asmbly-d1-data').append(sad1_data);

  });

});

// End data from CA SoS

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// This script pulls raw election data from the Fresno County Registrar of Voters and prints it. JSON is refreshed every 10 minutes during election reporting.

////////////////////////////////////////////////////////////////////////////////////

var request = new XMLHttpRequest();

request.open('GET', 'https://res.cloudinary.com/granville-homes/raw/upload/v1540426126/fcrov_data.csv', true);
request.onload = function () {

  if (request.status >= 200 && request.status < 400) {
    console.log('Connection to FCROV CSV successful!');
  } else {
    console.log('Error, no connection.');
  }
}

request.send();

///////////////////////////////////////////
// Parse JSON data with JQuery
///////////////////////////////////////////

$.ajax({
  url: 'https://res.cloudinary.com/granville-homes/raw/upload/v1540948443/city_council_3.json'
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#fresno-county-data').append(resp_string);
  var city_council_3 = resp.data;
  $.each( city_council_3, function( key, cc3 ){
    var cc3_item = (cc3.item);
    var cc3_votes = (cc3.votePrcnt);
    var cc3_num = (cc3.voteNum);
    var cc3_data = '<div>' + '<span>' + cc3_item + '</span>:' + ' ' + cc3_votes + ' ' + cc3_num + '</div>';

    $('#formatted-city-council-3-data').append(cc3_data);

  });

});
