// TEAMS

// Source: https://footballdatabase.com/ranking/world/1

var teams = [...document.body.querySelectorAll(".club.text-left")].map((teamElem) => {
    const name = teamElem.querySelector(".limittext").textContent;

    return {
        name: name,
        imgUrl: `https://footballdatabase.com${
            teamElem
                .querySelector(".logo-md")
                .style.backgroundImage.match(/url\("(.*)"\)/)[1]
        }`,
        imgName: `${name.toLowerCase().replaceAll(" ", "-")}.png`,
    };
});

var teamsFmt = JSON.stringify(teams, null, 4);
console.log(teamsFmt);
copy(teamsFmt);

// PLAYERS

// Source: https://www.footballcritic.com/players
var players = [...document.body.querySelector(".ais-hits").children]
    .map((playerDiv) => {
        const name = playerDiv.querySelector(".name a").textContent;
        const nameParts = name.split(" ");

        // Avoid complicated names.
        if (name.split(" ").length !== 2 || name.includes("-")) {
            return null;
        }

        const firstName = nameParts[0];
        const lastName = nameParts[1];

        return {
            firstName,
            lastName,
            imgUrl: playerDiv.querySelector(".player img").src,
            imgName: `${[firstName, lastName].join("-").replaceAll("'", "-").trim().toLowerCase()}.png`,
        };
    })
    .filter(Boolean);

var playersFmt = JSON.stringify(players, null, 4);
console.log(playersFmt);
copy(playersFmt);
