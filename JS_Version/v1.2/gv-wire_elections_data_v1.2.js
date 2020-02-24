///////////////////////////////////////////
//
//   2019 Hannah Reilly
//
///////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////

// AJAX loading animation

// $body = $("body");

// $(document).on({
    // ajaxStart: function() { $body.addClass("ajax-loading");    },
     // ajaxStop: function() { $body.removeClass("ajax-loading"); }    
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// This script pulls raw election data parsed from the Fresno County Registrar of Voters and prints it. JSON is refreshed every 10 minutes during election reporting.

////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////
// Parse JSON data with JQuery
///////////////////////////////////////////

// Overview Data

$.ajax({
  url: '/wp-content/elections/08_2019/data/overview.json'
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
  url: '/wp-content/elections/08_2019/data/time.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var fresnoTime = resp.data;
  $.each( fresnoTime, function( key, fresnoTime ){
    var fresnoTime_time = (fresnoTime.time);
    var time_data = fresnoTime_time;

    $('#fresno-county-time').append(time_data);

  });

});

//////////////////////////////////////////////////////////////////////////////////////

// Fresno City Council

///////////////////////////////////////////

// City Council District 3

$.ajax({
  url: '/wp-content/elections/08_2019/data/cc2.json'
}).done(function(resp){
  //var resp_string = JSON.stringify(resp);
  //$('#fresno-county-data').append(resp_string);
  var cc2 = resp.data;
  $.each( cc2, function( key, cc2 ){
    var cc2_index = (cc2.index);
    var cc2_item = (cc2.item);
    var cc2_name = cc2_item.toLowerCase();
    var cc2_votes = (cc2.votePrcnt);
    var cc2_num = (cc2.voteNum);
    var cc2_data = '<div class="fresno-item index-item-' + cc2_index + (cc2_index > '6' ? ' fresno-candidate"' + ' data-value="' + cc2_num + '">' : '">') +
                   '<span class="item-name">' + cc2_name + '</span>' +
                   (cc2_index != '0' ? ': ' : "") + ' ' +
                   (cc2_votes != false ? cc2_votes + ' &nbsp;|&nbsp; ' : "") +
                   cc2_num + '</div>';

    $('#formatted-cc2-data').append(cc2_data);

    $('#formatted-cc2-data').find('.fresno-candidate').sort(function (a, b) {
      return $(b).attr('data-value') - $(a).attr('data-value');
    })
    .appendTo('#formatted-cc2-data');

  });

});

///////////////////////////////////////////
