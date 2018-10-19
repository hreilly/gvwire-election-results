var request = new XMLHttpRequest();

request.open('GET', 'https://api.sos.ca.gov/returns/ballot-measures', true);
request.onload = function () {

  var data = JSON.parse(this.response);

  if (request.status >= 200 && request.status < 400) {
    console.log('Connection successful!');
  } else {
    console.log('Error, no connection.');
  }
}

$.ajax({
  url: "https://api.sos.ca.gov/returns/ballot-measures"
}).done(function(resp) {
  var resp_string = JSON.stringify(resp);
  $('#raw-data').append(resp_string);
  var msr_obj = resp['ballot-measures'];
  var msr_header = "<p>" + resp.raceTitle + "<br>" +
                       resp.Reporting + "<br>" +
                       resp.ReportingTime + "</p>";

  $('#formatted-data').append(msr_header);

  $.each( msr_obj, function( key, msr ){
    var msr_name = (msr.Name);
    var msr_yes = (msr.yesPercent);
    var msr_no = (msr.noPercent);
    var msr_data = "<p>" + msr_name + "<br>" +
                  "Yes: " + msr_yes + "%" + "<br>" +
                  "No: " + msr_no + "%" + "</p>";

    $('#formatted-data').append(msr_data);
  });

});

request.send();