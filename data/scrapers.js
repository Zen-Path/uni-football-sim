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

console.log(
    teams
        .map((team) => {
            return `new Team("${team.name}", new TeamLogo(_TEAM_LOGO_DIR + "${team.name
                .toLowerCase()
                .replaceAll(" ", "-")}.png", "${team.logo}"))`;
        })
        .join(",\n"),
);

console.log(
    teams
        .map((team) => {
            return `${team.logo}\n\tout=${team.name
                .toLowerCase()
                .replaceAll(" ", "-")}.png`;
        })
        .join("\n"),
);
