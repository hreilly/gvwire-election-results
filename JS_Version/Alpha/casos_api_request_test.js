// Hannah Reilly, 2018

// This script pulls raw election data from the CA Secretary of State API and prints it. API is refreshed every 5 minutes.

// Vanilla JS test request to verify connection to API. All GET requests should return a value of 200.

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

// Parse data with JQuery

// Ballot Measures

$.ajax({
  url: "https://api.sos.ca.gov/returns/ballot-measures"
}).done(function(resp) {
  var resp_string = JSON.stringify(resp);
  $('#raw-data').append(resp_string);
  var msr_obj = resp['ballot-measures'];
  var msr_header = '<div>' + resp.raceTitle + '<br>' +
                       resp.Reporting + '<br>' +
                       resp.ReportingTime + '</div>';

  $('#formatted-msr-data').append(msr_header);

  $.each( msr_obj, function( key, msr ){
    var msr_num = (msr.Number);
    var msr_name = (msr.Name);
    var msr_yes = (msr.yesPercent);
    var msr_no = (msr.noPercent);
    var msr_data = '<div>Measure&nbsp;' + msr_num + ':&nbsp;' + msr_name + '<br>' +
                  'Yes:&nbsp;' + msr_yes + '%' + '<br>' +
                  'No:&nbsp;' + msr_no + '%' + '</div>';

    $('#formatted-msr-data').append(msr_data);
  });

});

// Gubernatorial Candidates

$.ajax({
  url: "https://api.sos.ca.gov/returns/governor"
}).done(function(resp) {
  var resp_string = JSON.stringify(resp);
  $('#raw-data').append(resp_string);
  var gov_obj = resp.candidates;
  var gov_header = '<div>' + resp.raceTitle + '<br>' +
                       resp.Reporting + '<br>' +
                       resp.ReportingTime + '</div>';
  $('#formatted-gov-data').append(gov_header);

  $.each( gov_obj, function( key, gov ){
    var gov_name = (gov.Name);
    var gov_prty = (gov.Party);
    var gov_data = '<div class="' + gov_prty + '">Candidate:&nbsp;' + gov_name + '</div>';

    $('#formatted-gov-data').append(gov_data);

  });

});

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/1"
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#raw-data').append(resp_string);
  var st_asmbly_d1_obj = resp.candidates;
  var st_asmbly_d1_header = '<div>' + resp.raceTitle + '<br>' +
                            resp.Reporting + '<br>' +
                            resp.ReportingTime + '</div>';

  $('#formatted-st-asmbly-d1-data').append(st_asmbly_d1_header);

  $.each( st_asmbly_d1_obj, function( key, sad1 ){
    var sad1_name = (sad1.Name);
    var sad1_prty = (sad1.Party);
    var sad1_votes = (sad1.Percent);
    var sad1_data = '<div class="' + sad1_prty + '">Candidate:&nbsp;' + sad1_name + ' ' + sad1_votes + '%' + '</div>';

    $('#formatted-st-asmbly-d1-data').append(sad1_data);

  });

});