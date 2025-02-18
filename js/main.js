import { getUniqueRandomElements } from "./utils.js";
import { Team, TeamBanner, DEFAULT_TEAMS } from "./team.js";
import { DEFAULT_PLAYERS } from "./player.js";

const BANNER_CONTAINER = document.getElementById(TeamBanner.BANNER_CONTAINER_ID);
const SIDEBAR_LEFT = document.body.querySelector("#sidebar-left");
const SIDEBAR_RIGHT = document.body.querySelector("#sidebar-right");
const BOARD = document.getElementById("board");
const MINI_CARD_CONTAINER = document.getElementById("mini-card-container");

// TODO: rewrite once logic is discussed
// prettier-ignore
const POSITIONS = {
    5: [
        [50, 14],

        [24, 32],

        [50, 28],
        [50, 42],

        [24, 32],
    ],
    10: [
        [50, 14],

        [24, 20],
        [24, 34],

        [39, 26],
        [39, 44],

        [50, 35],

        [39, 26],
        [39, 44],

        [24, 20],
        [24, 34],
    ],
};

let fullScreenStatus = false;

function toggleFullScreen() {
    const content = document.getElementById("content");
    [content, BOARD].forEach((element) =>
        fullScreenStatus
            ? element.classList.remove("full-screen")
            : element.classList.add("full-screen"),
    );

    const elements = [BANNER_CONTAINER, SIDEBAR_LEFT, SIDEBAR_RIGHT];

    elements.forEach(
        (element) => (element.style.display = fullScreenStatus ? "block" : "none"),
    );

    fullScreenStatus = !fullScreenStatus;
}

function nextStep() {
    console.log("Next step....");
}

function previousStep() {
    console.log("Previous step....");
}

function setup(teams, countA, countB, teamBanner) {
    const players = getUniqueRandomElements(DEFAULT_PLAYERS, countA + countB);
    teams[0].players = players.slice(0, countA);
    teams[1].players = players.slice(countA);

    const leftSidebarElem = teams[0].createSidebar();
    while (SIDEBAR_LEFT.children[0]) {
        SIDEBAR_LEFT.removeChild(SIDEBAR_LEFT.children[0]);
    }
    SIDEBAR_LEFT.appendChild(leftSidebarElem);

    const rightSidebarElem = teams[1].createSidebar();
    while (SIDEBAR_RIGHT.children[0]) {
        SIDEBAR_RIGHT.removeChild(SIDEBAR_RIGHT.children[0]);
    }
    SIDEBAR_RIGHT.appendChild(rightSidebarElem);

    players.forEach((player) => {
        player.fullCardElem.addEventListener("click", () => {
            teamBanner.updateSuccessRate();
        });
    });

    while (MINI_CARD_CONTAINER.children[0]) {
        MINI_CARD_CONTAINER.removeChild(MINI_CARD_CONTAINER.children[0]);
    }

    teams.forEach((team) => {
        team.players.forEach((player, i) => {
            const miniCardElem = document.createElement("div");
            miniCardElem.classList.add("mini-card", team.side);

            const [top, left] = POSITIONS[team.players.length][i];
            miniCardElem.style.top =
                i < (team.players.length + 1) / 2 ? `${top}%` : `${100 - top}%`;

            miniCardElem.style.left =
                team.side === Team.SIDE.LEFT ? `${left}%` : `${100 - left}%`;

            const profilePictureElem = document.createElement("img");
            profilePictureElem.src = player.profilePicturePath;
            profilePictureElem.title = `${player.firstName} ${player.lastName}`;

            miniCardElem.append(profilePictureElem);
            MINI_CARD_CONTAINER.append(miniCardElem);
        });
    });
}

function main() {
    const teams = getUniqueRandomElements(DEFAULT_TEAMS, 2);
    teams[0].side = Team.SIDE.LEFT;
    teams[1].side = Team.SIDE.RIGHT;

    const teamBanner = new TeamBanner(teams);
    const teamBannerElem = teamBanner.create();
    BANNER_CONTAINER.appendChild(teamBannerElem);

    setup(teams, 10, 5, teamBanner);

    document.getElementById("teamForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const teamData = {
            teamA: {
                playerCount: parseInt(formData.get("teamA_player_count")),
                order: formData.get("teamA_order"),
            },
            teamB: {
                playerCount: parseInt(formData.get("teamB_player_count")),
                order: formData.get("teamB_order"),
            },
        };

        setup(teams, teamData.teamA.playerCount, teamData.teamB.playerCount, teamBanner);
    });
}

window.onload = () => {
    main();
};

window.toggleFullScreen = toggleFullScreen;
window.nextStep = nextStep;
window.previousStep = previousStep;
