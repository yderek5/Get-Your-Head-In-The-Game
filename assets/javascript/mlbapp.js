
var baseUrl = "https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/overall_team_standings.json?teamstats=W,L,RF,RA&team=";
var rosterUrl = "https://api.mysportsfeeds.com/v1.1/pull/mlb/2017-regular/roster_players.json?fordate=20171101&team=";
var bigRoster = [];


$(document).ready(function(){

  

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

                for (var i = 0; i < bigRoster.length; i++) {

                   if ((bigRoster[i].player.JerseyNumber !== undefined) && (bigRoster[i].player["Position"] !== undefined)) {

                      var playerInfo = "<tr>";
                         playerInfo += "<td>" + bigRoster[i].player.FirstName + " " + bigRoster[i].player.LastName + "</td>";
                         playerInfo += "<td>" + bigRoster[i].player.JerseyNumber + "</td>";
                         playerInfo += "<td>" + result2.rosterplayers.playerentry[i].player["Height"] + "</td>";
                         playerInfo += "<td>" + result2.rosterplayers.playerentry[i].player["Weight"] + "</td>";

                            if (result2.rosterplayers.playerentry[i].player["Age"] !== undefined) {
                                       playerInfo += "<td>" + result2.rosterplayers.playerentry[i].player["Age"] + "</td>";
                            } else {
                                       playerInfo += "<td>Not Listed</td>";
                            }

                            if (result2.rosterplayers.playerentry[i].player["IsRookie"] !== "false") {
                                       playerInfo += "<td>Veteran</td>";
                            } else {
                                       playerInfo += "<td>Rookie</td>";
                            }

                         playerInfo += "<td>" + result2.rosterplayers.playerentry[i].player["Position"] + "</td></tr>";
                         $("tbody").append(playerInfo);
                   }
                }

            //debugger

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

  })
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
