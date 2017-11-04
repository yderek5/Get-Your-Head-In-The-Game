
var baseUrl = "https://api.mysportsfeeds.com/v1.1/pull/nfl/2017-regular/overall_team_standings.json?teamstats=W,L,T,PF,PA&team="
var rosterUrl = "https://api.mysportsfeeds.com/v1.1/pull/nfl/2017-regular/roster_players.json?fordate=20171001&team=";
var bigRoster = [];

$(document).ready(function(){

    var fromStorage = (localStorage.getItem("nfl-teamname"));
    console.log(fromStorage)

  $(".row").on("click", function(event){
    var newBaseUrl = baseUrl + $(this).attr("data-search");
    var newRosterUrl = rosterUrl + $(this).attr("data-search");
    console.log(newRosterUrl);
    $("#teamStats").empty();
    $("#players").empty();

    localStorage.setItem("nfl-teamname", $(this).attr("data-search")); //key and value  

        $("#whatever").css("display", "none");
        $("#whatever2").css("display", "inline");

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
          gamesTied: result.overallteamstandings.teamstandingsentry[0].stats["Ties"]["#text"],
          pointsScored: result.overallteamstandings.teamstandingsentry[0].stats["PointsFor"]["#text"],
          pointsAllowed: result.overallteamstandings.teamstandingsentry[0].stats["PointsAgainst"]["#text"],
          teamCity: result.overallteamstandings.teamstandingsentry[0]["team"]["City"],
          teamName: result.overallteamstandings.teamstandingsentry[0]["team"]["Name"]
        };

        console.log(team.teamCity);
        console.log(team.teamName);        

        var putStats =  "<p>Team Rank: " + team.teamRank + "<br>"
            putStats += "Games Played: " + team.gamesPlayed + "<br>"
            putStats += "Wins: " + team.gamesWon + "<br>"
            putStats += "Losses: " + team.gamesLost + "<br>"
            putStats += "Ties: " + team.gamesTied + "<br>"
            putStats += "Points Scored: " + team.pointsScored + "<br>"            
            putStats += "Points Allowed: " + team.pointsAllowed + "</p>"            
            $("#teamStats").append(putStats)

        debugger
        }).fail(function(err) {
            throw err;
        }); //end of fail


//get a single player info: https://api.mysportsfeeds.com/v1.1/pull/nfl/2017-regular/cumulative_player_stats.json?playerstats=Att,Comp,Yds,TD&team=ABBREVIATION&player=FirstName-LastName

       $.ajax({
        url: newRosterUrl,
        method: 'GET',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic S1VDb2Rpbmc6ZGx0YUBrdQ==');
          }
        }).done(function(result2) {
          console.log(result2);

          var bigRoster = result2.rosterplayers.playerentry;
          console.log(bigRoster)

            for (var i = 0; i < bigRoster.length; i++) {
              //console.log(bigRoster[i].player.FirstName + " " + bigRoster[i].player.LastName + " #" + bigRoster[i].player.JerseyNumber);
               if (bigRoster[i].player.JerseyNumber !== undefined) {
                  var playerButtons = "<button>" + bigRoster[i].player.FirstName + " " + bigRoster[i].player.LastName + " #" + bigRoster[i].player.JerseyNumber + "</button>"
                  $("#players").append(playerButtons)
               }
            }
        debugger
        }).fail(function(err) {
            throw err;
        }); //end of fail

  }); //end of onclick
});//endof document.ready

  



