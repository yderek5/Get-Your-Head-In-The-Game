
var baseUrl = "https://api.mysportsfeeds.com/v1.1/pull/nfl/2017-regular/overall_team_standings.json?teamstats=W,L,T,PF,PA&team="
var rosterUrl = "https://api.mysportsfeeds.com/v1.1/pull/nfl/2017-regular/roster_players.json?fordate=20171001&team=";

$(document).ready(function(){
  $(".row").on("click", function(event){
    var newBaseUrl = baseUrl + $(this).attr("data-search");
    var newRosterUrl = rosterUrl + $(this).attr("data-search");
    console.log(newRosterUrl);

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
          pointsAllowed: result.overallteamstandings.teamstandingsentry[0].stats["PointsAgainst"]["#text"]
        }


        }).fail(function(err) {
            throw err;
        }); //end of fail
      }); //end of onclick
  });//endof document.ready

  


