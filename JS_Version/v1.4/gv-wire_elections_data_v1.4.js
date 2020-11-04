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

// President

$.ajax({
  url: "https://api.sos.ca.gov/returns/president"
}).done(function(resp) {
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);

  // Only needed once per category
  var statewide_header = resp.Reporting + '<br>' + resp.ReportingTime;
  $('#statewide-reporting-content').append(statewide_header);

  var pres_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' + '</div>';
  $('#formatted-pres-data').append(pres_header);

  var pres_obj = resp.candidates;

  $.each( pres_obj, function( key, pres ){
    var pres_name = (pres.Name);
    var pres_prty = (pres.Party);
    var pres_votes = (pres.Percent);
    var pres_data = '<div class="election-candidate" data-value="' + pres_votes + '">' + '<span class="' + pres_prty + '">' + pres_name + '</span>:' + ' ' + pres_votes + '%' + '</div>';

    $('#formatted-pres-data').append(pres_data);

    $('#formatted-pres-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-pres-data');

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

///////////////////////////////////////////

// State Assembly 26

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/26"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var ad26_obj = resp.candidates;
  var ad26_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-ad26-data').append(ad26_header);

  $.each( ad26_obj, function( key, ad26 ){
    var ad26_name = (ad26.Name);
    var ad26_prty = (ad26.Party);
    var ad26_votes = (ad26.Percent);
    var ad26_data = '<div class="election-candidate" data-value="' + ad26_votes + '">' + '<span class="' + ad26_prty + '">' + ad26_name + '</span>:' + ' ' + ad26_votes + '%' + '</div>';

    $('#formatted-ad26-data').append(ad26_data);

    $('#formatted-ad26-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-ad26-data');

  });

});

///////////////////////////////////////////

// State Assembly 31

$.ajax({
  url: "https://api.sos.ca.gov/returns/state-assembly/district/31"
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#raw-data').append(resp_string);
  var ad31_obj = resp.candidates;
  var ad31_header = '<div class="election-overview">' + '<div class="election-title">' + resp.raceTitle + '</div>' +
                            '<div class="election-details">' + resp.Reporting + '<div>' + '</div>';

  $('#formatted-ad31-data').append(ad31_header);

  $.each( ad31_obj, function( key, ad31 ){
    var ad31_name = (ad31.Name);
    var ad31_prty = (ad31.Party);
    var ad31_votes = (ad31.Percent);
    var ad31_data = '<div class="election-candidate" data-value="' + ad31_votes + '">' + '<span class="' + ad31_prty + '">' + ad31_name + '</span>:' + ' ' + ad31_votes + '%' + '</div>';

    $('#formatted-ad31-data').append(ad31_data);

    $('#formatted-ad31-data').find('.election-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-ad31-data');

  });

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// This script pulls raw election data parsed from the Fresno County Registrar of Voters and prints it. JSON is refreshed every 10 minutes during election reporting.

////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////
// Parse JSON data with JQuery
///////////////////////////////////////////

// Overview Data

$.ajax({
  url: '/wp-content/elections/11_2020/data/overview.json'
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

// Fresno County Board of Education

///////////////////////////////////////////

// FCBOE 2

$.ajax({
  url: '/wp-content/elections/11_2020/data/fcboe2.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fcboe2 = resp.data;
  $.each( fcboe2, function( key, fcboe2 ){
    var fcboe2_index = (fcboe2.index);
    var fcboe2_item = (fcboe2.item);
    var fcboe2_name = fcboe2_item.toLowerCase();
    var fcboe2_votes = (fcboe2.votePrcnt);
    var fcboe2_num = (fcboe2.voteNum);
    var fcboe2_data = '<div class="fresno-item index-item-' + fcboe2_index + ' fresno-candidate"' + ' data-value="' + fcboe2_num + '">' +
                   '<span class="item-name">' + fcboe2_name + '</span>' +
                   (fcboe2_index != '0' ? ': ' : "") + ' ' +
                   (fcboe2_votes != null ? fcboe2_votes + ' &nbsp;|&nbsp; ' : "") +
                   fcboe2_num + '</div>';

    $('#formatted-fcboe2-data').append(fcboe2_data);

    $('#formatted-fcboe2-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-fcboe2-data');

  });

});

///////////////////////////////////////////

// FCBOE 3

$.ajax({
  url: '/wp-content/elections/11_2020/data/fcboe3.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fcboe3 = resp.data;
  $.each( fcboe3, function( key, fcboe3 ){
    var fcboe3_index = (fcboe3.index);
    var fcboe3_item = (fcboe3.item);
    var fcboe3_name = fcboe3_item.toLowerCase();
    var fcboe3_votes = (fcboe3.votePrcnt);
    var fcboe3_num = (fcboe3.voteNum);
    var fcboe3_data = '<div class="fresno-item index-item-' + fcboe3_index + ' fresno-candidate"' + ' data-value="' + fcboe3_num + '">' +
                   '<span class="item-name">' + fcboe3_name + '</span>' +
                   (fcboe3_index != '0' ? ': ' : "") + ' ' +
                   (fcboe3_votes != null ? fcboe3_votes + ' &nbsp;|&nbsp; ' : "") +
                   fcboe3_num + '</div>';

    $('#formatted-fcboe3-data').append(fcboe3_data);

    $('#formatted-fcboe3-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-fcboe3-data');

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// State Center Community College District

///////////////////////////////////////////

// SCCCD 2

$.ajax({
  url: '/wp-content/elections/11_2020/data/scccd2.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var scccd2 = resp.data;
  $.each( scccd2, function( key, scccd2 ){
    var scccd2_index = (scccd2.index);
    var scccd2_item = (scccd2.item);
    var scccd2_name = scccd2_item.toLowerCase();
    var scccd2_votes = (scccd2.votePrcnt);
    var scccd2_num = (scccd2.voteNum);
    var scccd2_data = '<div class="fresno-item index-item-' + scccd2_index + ' fresno-candidate"' + ' data-value="' + scccd2_num + '">' +
                   '<span class="item-name">' + scccd2_name + '</span>' +
                   (scccd2_index != '0' ? ': ' : "") + ' ' +
                   (scccd2_votes != null ? scccd2_votes + ' &nbsp;|&nbsp; ' : "") +
                   scccd2_num + '</div>';

    $('#formatted-scccd2-data').append(scccd2_data);

    $('#formatted-scccd2-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-scccd2-data');

  });

});

///////////////////////////////////////////

// SCCCD 3

$.ajax({
  url: '/wp-content/elections/11_2020/data/scccd3.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var scccd3 = resp.data;
  $.each( scccd3, function( key, scccd3 ){
    var scccd3_index = (scccd3.index);
    var scccd3_item = (scccd3.item);
    var scccd3_name = scccd3_item.toLowerCase();
    var scccd3_votes = (scccd3.votePrcnt);
    var scccd3_num = (scccd3.voteNum);
    var scccd3_data = '<div class="fresno-item index-item-' + scccd3_index + ' fresno-candidate"' + ' data-value="' + scccd3_num + '">' +
                   '<span class="item-name">' + scccd3_name + '</span>' +
                   (scccd3_index != '0' ? ': ' : "") + ' ' +
                   (scccd3_votes != null ? scccd3_votes + ' &nbsp;|&nbsp; ' : "") +
                   scccd3_num + '</div>';

    $('#formatted-scccd3-data').append(scccd3_data);

    $('#formatted-scccd3-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-scccd3-data');

  });

});

///////////////////////////////////////////

// SCCCD 6

$.ajax({
  url: '/wp-content/elections/11_2020/data/scccd6.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var scccd6 = resp.data;
  $.each( scccd6, function( key, scccd6 ){
    var scccd6_index = (scccd6.index);
    var scccd6_item = (scccd6.item);
    var scccd6_name = scccd6_item.toLowerCase();
    var scccd6_votes = (scccd6.votePrcnt);
    var scccd6_num = (scccd6.voteNum);
    var scccd6_data = '<div class="fresno-item index-item-' + scccd6_index + ' fresno-candidate"' + ' data-value="' + scccd6_num + '">' +
                   '<span class="item-name">' + scccd6_name + '</span>' +
                   (scccd6_index != '0' ? ': ' : "") + ' ' +
                   (scccd6_votes != null ? scccd6_votes + ' &nbsp;|&nbsp; ' : "") +
                   scccd6_num + '</div>';

    $('#formatted-scccd6-data').append(scccd6_data);

    $('#formatted-scccd6-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-scccd6-data');

  });

});

///////////////////////////////////////////

// SCCCD 7

$.ajax({
  url: '/wp-content/elections/11_2020/data/scccd7.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var scccd7 = resp.data;
  $.each( scccd7, function( key, scccd7 ){
    var scccd7_index = (scccd7.index);
    var scccd7_item = (scccd7.item);
    var scccd7_name = scccd7_item.toLowerCase();
    var scccd7_votes = (scccd7.votePrcnt);
    var scccd7_num = (scccd7.voteNum);
    var scccd7_data = '<div class="fresno-item index-item-' + scccd7_index + ' fresno-candidate"' + ' data-value="' + scccd7_num + '">' +
                   '<span class="item-name">' + scccd7_name + '</span>' +
                   (scccd7_index != '0' ? ': ' : "") + ' ' +
                   (scccd7_votes != null ? scccd7_votes + ' &nbsp;|&nbsp; ' : "") +
                   scccd7_num + '</div>';

    $('#formatted-scccd7-data').append(scccd7_data);

    $('#formatted-scccd7-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-scccd7-data');

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Central Unified School District

///////////////////////////////////////////

// CENUSD 3

$.ajax({
  url: '/wp-content/elections/11_2020/data/cenusd3.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cenusd3 = resp.data;
  $.each( cenusd3, function( key, cenusd3 ){
    var cenusd3_index = (cenusd3.index);
    var cenusd3_item = (cenusd3.item);
    var cenusd3_name = cenusd3_item.toLowerCase();
    var cenusd3_votes = (cenusd3.votePrcnt);
    var cenusd3_num = (cenusd3.voteNum);
    var cenusd3_data = '<div class="fresno-item index-item-' + cenusd3_index + ' fresno-candidate"' + ' data-value="' + cenusd3_num + '">' +
                   '<span class="item-name">' + cenusd3_name + '</span>' +
                   (cenusd3_index != '0' ? ': ' : "") + ' ' +
                   (cenusd3_votes != null ? cenusd3_votes + ' &nbsp;|&nbsp; ' : "") +
                   cenusd3_num + '</div>';

    $('#formatted-cenusd3-data').append(cenusd3_data);

    $('#formatted-cenusd3-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-cenusd3-data');

  });

});

///////////////////////////////////////////

// CENUSD 4

$.ajax({
  url: '/wp-content/elections/11_2020/data/cenusd4.json'
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
    var cenusd4_data = '<div class="fresno-item index-item-' + cenusd4_index + ' fresno-candidate"' + ' data-value="' + cenusd4_num + '">' +
                   '<span class="item-name">' + cenusd4_name + '</span>' +
                   (cenusd4_index != '0' ? ': ' : "") + ' ' +
                   (cenusd4_votes != null ? cenusd4_votes + ' &nbsp;|&nbsp; ' : "") +
                   cenusd4_num + '</div>';

    $('#formatted-cenusd4-data').append(cenusd4_data);

    $('#formatted-cenusd4-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-cenusd4-data');

  });

});

///////////////////////////////////////////

// CENUSD 6

$.ajax({
  url: '/wp-content/elections/11_2020/data/cenusd6.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cenusd6 = resp.data;
  $.each( cenusd6, function( key, cenusd6 ){
    var cenusd6_index = (cenusd6.index);
    var cenusd6_item = (cenusd6.item);
    var cenusd6_name = cenusd6_item.toLowerCase();
    var cenusd6_votes = (cenusd6.votePrcnt);
    var cenusd6_num = (cenusd6.voteNum);
    var cenusd6_data = '<div class="fresno-item index-item-' + cenusd6_index + ' fresno-candidate"' + ' data-value="' + cenusd6_num + '">' +
                   '<span class="item-name">' + cenusd6_name + '</span>' +
                   (cenusd6_index != '0' ? ': ' : "") + ' ' +
                   (cenusd6_votes != null ? cenusd6_votes + ' &nbsp;|&nbsp; ' : "") +
                   cenusd6_num + '</div>';

    $('#formatted-cenusd6-data').append(cenusd6_data);

    $('#formatted-cenusd6-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-cenusd6-data');

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Clovis Unified School District

///////////////////////////////////////////

// CUSD 2

$.ajax({
  url: '/wp-content/elections/11_2020/data/cusd2.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cusd2 = resp.data;
  $.each( cusd2, function( key, cusd2 ){
    var cusd2_index = (cusd2.index);
    var cusd2_item = (cusd2.item);
    var cusd2_name = cusd2_item.toLowerCase();
    var cusd2_votes = (cusd2.votePrcnt);
    var cusd2_num = (cusd2.voteNum);
    var cusd2_data = '<div class="fresno-item index-item-' + cusd2_index + ' fresno-candidate"' + ' data-value="' + cusd2_num + '">' +
                   '<span class="item-name">' + cusd2_name + '</span>' +
                   (cusd2_index != '0' ? ': ' : "") + ' ' +
                   (cusd2_votes != null ? cusd2_votes + ' &nbsp;|&nbsp; ' : "") +
                   cusd2_num + '</div>';

    $('#formatted-cusd2-data').append(cusd2_data);

    $('#formatted-cusd2-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-cusd2-data');

  });

});

///////////////////////////////////////////

// CUSD 4

$.ajax({
  url: '/wp-content/elections/11_2020/data/cusd4.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cusd4 = resp.data;
  $.each( cusd4, function( key, cusd4 ){
    var cusd4_index = (cusd4.index);
    var cusd4_item = (cusd4.item);
    var cusd4_name = cusd4_item.toLowerCase();
    var cusd4_votes = (cusd4.votePrcnt);
    var cusd4_num = (cusd4.voteNum);
    var cusd4_data = '<div class="fresno-item index-item-' + cusd4_index + ' fresno-candidate"' + ' data-value="' + cusd4_num + '">' +
                   '<span class="item-name">' + cusd4_name + '</span>' +
                   (cusd4_index != '0' ? ': ' : "") + ' ' +
                   (cusd4_votes != null ? cusd4_votes + ' &nbsp;|&nbsp; ' : "") +
                   cusd4_num + '</div>';

    $('#formatted-cusd4-data').append(cusd4_data);

    $('#formatted-cusd4-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-cusd4-data');

  });

});

///////////////////////////////////////////

// CUSD 7

$.ajax({
  url: '/wp-content/elections/11_2020/data/cusd7.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cusd7 = resp.data;
  $.each( cusd7, function( key, cusd7 ){
    var cusd7_index = (cusd7.index);
    var cusd7_item = (cusd7.item);
    var cusd7_name = cusd7_item.toLowerCase();
    var cusd7_votes = (cusd7.votePrcnt);
    var cusd7_num = (cusd7.voteNum);
    var cusd7_data = '<div class="fresno-item index-item-' + cusd7_index + ' fresno-candidate"' + ' data-value="' + cusd7_num + '">' +
                   '<span class="item-name">' + cusd7_name + '</span>' +
                   (cusd7_index != '0' ? ': ' : "") + ' ' +
                   (cusd7_votes != null ? cusd7_votes + ' &nbsp;|&nbsp; ' : "") +
                   cusd7_num + '</div>';

    $('#formatted-cusd7-data').append(cusd7_data);

    $('#formatted-cusd7-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-cusd7-data');

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Fresno Unified School District

///////////////////////////////////////////

// FUSD 5

$.ajax({
  url: '/wp-content/elections/11_2020/data/fusd5.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fusd5 = resp.data;
  $.each( fusd5, function( key, fusd5 ){
    var fusd5_index = (fusd5.index);
    var fusd5_item = (fusd5.item);
    var fusd5_name = fusd5_item.toLowerCase();
    var fusd5_votes = (fusd5.votePrcnt);
    var fusd5_num = (fusd5.voteNum);
    var fusd5_data = '<div class="fresno-item index-item-' + fusd5_index + ' fresno-candidate"' + ' data-value="' + fusd5_num + '">' +
                   '<span class="item-name">' + fusd5_name + '</span>' +
                   (fusd5_index != '0' ? ': ' : "") + ' ' +
                   (fusd5_votes != null ? fusd5_votes + ' &nbsp;|&nbsp; ' : "") +
                   fusd5_num + '</div>';

    $('#formatted-fusd5-data').append(fusd5_data);

    $('#formatted-fusd5-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-fusd5-data');

  });

});

///////////////////////////////////////////

// FUSD 6

$.ajax({
  url: '/wp-content/elections/11_2020/data/fusd6.json'
}).done(function(resp){
  // var resp_string = JSON.stringify(resp);
  // $('#fresno-county-data').append(resp_string);
  var fusd6 = resp.data;
  $.each( fusd6, function( key, fusd6 ){
    var fusd6_index = (fusd6.index);
    var fusd6_item = (fusd6.item);
    var fusd6_name = fusd6_item.toLowerCase();
    var fusd6_votes = (fusd6.votePrcnt);
    var fusd6_num = (fusd6.voteNum);
    var fusd6_data = '<div class="fresno-item index-item-' + fusd6_index + ' fresno-candidate"' + ' data-value="' + fusd6_num + '">' +
                   '<span class="item-name">' + fusd6_name + '</span>' +
                   (fusd6_index != '0' ? ': ' : "") + ' ' +
                   (fusd6_votes != null ? fusd6_votes + ' &nbsp;|&nbsp; ' : "") +
                   fusd6_num + '</div>';

    $('#formatted-fusd6-data').append(fusd6_data);

    $('#formatted-fusd6-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-fusd6-data');

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Ballot Measures

///////////////////////////////////////////

// Measure A

$.ajax({
  url: '/wp-content/elections/11_2020/data/msrA.json'
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#fresno-county-data').append(resp_string);
  var msrA = resp.data;
  $.each( msrA, function( key, msrA ){
    var msrA_index = (msrA.index);
    var msrA_item = (msrA.item);
    var msrA_name = msrA_item.toLowerCase();
    var msrA_votes = (msrA.votePrcnt);
    var msrA_num = (msrA.voteNum);
    var msrA_data = '<div class="fresno-item ballot-index-item-' + msrA_index + ' fresno-measure"' + ' data-value="' + msrA_num + '">' +
                    '<div class="' + (msrA_name == 'bonds-yes' ? 'yesPercent' : " ") + (msrA_name == 'bonds-no' ? 'noPercent' : " ") + '">' + '<span class="item-name ' + '">' + msrA_name + '</span>' + 
                    (msrA_index != '0' ? ': ' : "") + ' ' + 
                    (msrA_votes != null ? msrA_votes + ' &nbsp;|&nbsp; ' : "") + 
                    msrA_num + '</div>' + '</div>';

    $('#formatted-bondmeasa-data').append(msrA_data);

    $('#formatted-bondmeasa-data').find('.fresno-measure').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-bondmeasa-data');

  });

});

///////////////////////////////////////////

// Measure D

$.ajax({
  url: '/wp-content/elections/11_2020/data/msrD.json'
}).done(function(resp){
  var resp_string = JSON.stringify(resp);
  $('#fresno-county-data').append(resp_string);
  var msrD = resp.data;
  $.each( msrD, function( key, msrD ){
    var msrD_index = (msrD.index);
    var msrD_item = (msrD.item);
    var msrD_name = msrD_item.toLowerCase();
    var msrD_votes = (msrD.votePrcnt);
    var msrD_num = (msrD.voteNum);
    var msrD_data = '<div class="fresno-item ballot-index-item-' + msrD_index + ' fresno-measure"' + ' data-value="' + msrD_num + '">' +
                    '<div class="' + (msrD_name == 'bonds-yes' ? 'yesPercent' : " ") + (msrD_name == 'bonds-no' ? 'noPercent' : " ") + '">' + '<span class="item-name ' + '">' + msrD_name + '</span>' + 
                    (msrD_index != '0' ? ': ' : "") + ' ' + 
                    (msrD_votes != null ? msrD_votes + ' &nbsp;|&nbsp; ' : "") + 
                    msrD_num + '</div>' + '</div>';

    $('#formatted-bondmeasd-data').append(msrD_data);

    $('#formatted-bondmeasd-data').find('.fresno-measure').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-bondmeasd-data');

  });

});

///////////////////////////////////////////