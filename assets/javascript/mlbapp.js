
var baseUrl = "https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/overall_team_standings.json?teamstats=W,L,RF,RA&team=";
var rosterUrl = "https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/roster_players.json?fordate=20171101&team=";
var bigRoster = [];
var table;

$(document).ready(function(){

  $("img").addClass("img-responsive");


     var fromStorage = (localStorage.getItem("mlb-teamname"));

      $(".row").on("click", function(event){

        if($(this).parent().attr('id') == 'contain1'){

        var newBaseUrl = baseUrl + $(this).attr("data-search");
        var newRosterUrl = rosterUrl + $(this).attr("data-search");

        $("#teamStats").empty();
        $("#players").empty();

        localStorage.setItem("mlb-teamname", $(this).attr("data-search")); //key and value

           $.ajax({
            url: newBaseUrl,
            method: 'GET',
              beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic S1VDb2Rpbmc6ZGx0YUBrdQ==');
              }
            }).done(function(result) {

              var team = {
              teamRank: result.overallteamstandings.teamstandingsentry[0].rank,
              gamesPlayed: result.overallteamstandings.teamstandingsentry[0].stats["GamesPlayed"]["#text"],
              gamesWon: result.overallteamstandings.teamstandingsentry[0].stats["Wins"]["#text"],
              gamesLost: result.overallteamstandings.teamstandingsentry[0].stats["Losses"]["#text"],
              pointsScored: result.overallteamstandings.teamstandingsentry[0].stats["RunsFor"]["#text"],
              pointsAllowed: result.overallteamstandings.teamstandingsentry[0].stats["RunsAgainst"]["#text"],
              teamCity: result.overallteamstandings.teamstandingsentry[0]["team"]["City"],
              teamName: result.overallteamstandings.teamstandingsentry[0]["team"]["Name"]
            };

            //console.log(team.teamCity);
            //console.log(team.teamName);

            var putStats =  "<p>Name: " + team.teamName + "<br>";
                putStats += "Team Rank: " + team.teamRank + "<br>";
                putStats += "Games Played: " + team.gamesPlayed + "<br>";
                putStats += "Wins: " + team.gamesWon + "<br>";
                putStats += "Losses: " + team.gamesLost + "<br>";
                putStats += "Runs Scored: " + team.pointsScored + "<br>";
                putStats += "Runs Allowed: " + team.pointsAllowed + "</p>";
                console.log(putStats);
                $("#teamStats").append(putStats);
    //debugger


            showMap(team.teamCity + ' ' + team.teamName);
            showWeather(team.teamCity);
            //debugger

            }).fail(function(err) {
                throw err;
            }); //end of fail

           $.ajax({
            url: newRosterUrl,
            method: 'GET',
              beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic S1VDb2Rpbmc6ZGx0YUBrdQ==');
              }
            }).done(function(result2) {

              var bigRoster = result2.rosterplayers.playerentry;
              var dataSet = [];
              var name;
              var jerseyNumber = '';
              var height = '';
              var weight = '';
              var age= '';
              var status = '';
              var position = '';

                for (var i = 0; i < bigRoster.length; i++) {

                   if ((bigRoster[i].player.JerseyNumber !== undefined) && (bigRoster[i].player["Position"] !== undefined)) {
                      var thisRow = [];
                      name = bigRoster[i].player.FirstName + ' ' + bigRoster[i].player.LastName;
                        jerseyNumber = bigRoster[i].player.JerseyNumber;
                        height = result2.rosterplayers.playerentry[i].player["Height"];
                        weight = result2.rosterplayers.playerentry[i].player["Weight"];
                        age = result2.rosterplayers.playerentry[i].player["Age"];
                        status = result2.rosterplayers.playerentry[i].player["IsRookie"];
                        position = result2.rosterplayers.playerentry[i].player["Position"];
                            if (name == undefined) {
                              name = 'Not Listed';
                            } 

                            if (height == undefined) {
                              height = 'Not Listed';
                            } 

                            if (weight == undefined) {
                              weight = 'Not Listed';
                            } 

                            if (age == undefined) {
                              age = 'Not Listed';
                            } 

                            if (status !== "false") {
                              status = 'Rookie';
                            } else {
                              status = 'Veteran';
                            }
                        thisRow.push(name,jerseyNumber,height,weight,age,status,position); 
                        dataSet.push(thisRow);
                  }
                }

                table = $('#player-data').DataTable( {
                data: dataSet,
                columns: [
                    { title: "Name" },
                    { title: "Jersey Number" },
                    { title: "Height" },
                    { title: "Weight" },
                    { title: "Age" },
                    { title: "Rookie Status" },
                    { title: "Position" }
                  ]
                });

            }).fail(function(err) {
                throw err;
            }); //end of fail



            console.log($(this).parent().attr('id'));



           $(".contain1").toggle(); //.css("display", "none");
           $(".contain2").toggle(); //.css("display", "inline");
      }//end IF statement



  }); //end of onclick

  $("#backToTeams").on("click", function(event){
    $(".contain1").toggle(); //.css("display", "none");
    $(".contain2").toggle(); //.css("display", "inline");
    $("#weather").empty();
    table.destroy();
  });
});//endof document.ready


var showMap = function(teamName) {

      var geoCoder = new google.maps.Geocoder();
      var address = teamName + " Stadium";
      var map;
      var service;
      var infowindow;
      var test;
      var mapCenter;
      $("#map").addClass('mapHeight');
      //console.log(address);
        geocoder = new google.maps.Geocoder();
         geocoder.geocode( { 'address': address}, function(results, status) {
          //console.log(status);
          if (status == 'OK') {
            mapCenter = results[0].geometry.location;
            map = new google.maps.Map(document.getElementById('map'), {
                center: mapCenter,
                zoom: 18,
                mapTypeId: "hybrid"
            });
            var marker = new google.maps.Marker({
                map: map,
                position: mapCenter
            });
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
};
var showWeather = function(teamCity) {
  //weather API
  var weatherKey = "&APPID=fbf10f731d36577dc93b21fa47885eab";
  var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + teamCity + "&units=imperial" + weatherKey;
  $.ajax({
    url: weatherURL,
    method: 'GET',
  }).done(function(result) {
    console.log(result);
    $("#weather").append("<p>" + "Temperature: "+ result.main.temp + "°"+ "F" + "</p>");
    $("#weather").append("<p>" + result.weather[0].description + "</p>");
    $("#weather").append("<img src='" + "https://openweathermap.org/img/w/" + result.weather[0].icon + ".png" + "'>" + "</img>");
  }); //end of weather ajax
};
