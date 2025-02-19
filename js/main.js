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
const VALID_PLAYER_COUNTS = Object.keys(POSITIONS).map((count) => parseInt(count));

class TeamPreferences {
    // NOTE: playerCount must be included in VALID_PLAYER_COUNTS.
    constructor(playerCount = null, playerOrder = null) {
        if (!playerCount || !VALID_PLAYER_COUNTS.includes(playerCount)) {
            this.playerCount = VALID_PLAYER_COUNTS[1];
        } else {
            this.playerCount = playerCount;
        }
        this.playerOrder = playerOrder ? playerOrder : Team.PLAYER_ORDER.BEST;
    }
}

let PREFERENCES = {
    teamA: new TeamPreferences(),
    teamB: new TeamPreferences(),
};

function toggleFullScreen() {
    const content = document.getElementById("content");

    const fullScreenElems = [content, BOARD];
    fullScreenElems.forEach((element) => element.classList.toggle("full-screen"));

    const hiddenElems = [BANNER_CONTAINER, SIDEBAR_LEFT, SIDEBAR_RIGHT];
    hiddenElems.forEach((element) => element.classList.toggle("hidden"));
}

function nextStep() {
    console.log("Next step....");
}

function previousStep() {
    console.log("Previous step....");
}

function setup(teams, preferences, teamBanner) {
    const players = getUniqueRandomElements(
        DEFAULT_PLAYERS,
        preferences.teamA.playerCount + preferences.teamB.playerCount,
    );
    teams[0].players = players.slice(0, preferences.teamA.playerCount);
    teams[1].players = players.slice(preferences.teamA.playerCount);

    const leftSidebarElem = teams[0].createSidebar();
    SIDEBAR_LEFT.replaceChildren();
    SIDEBAR_LEFT.appendChild(leftSidebarElem);

    const rightSidebarElem = teams[1].createSidebar();
    SIDEBAR_RIGHT.replaceChildren();
    SIDEBAR_RIGHT.appendChild(rightSidebarElem);

    players.forEach((player) => {
        player.fullCardElem.addEventListener("click", () => {
            teamBanner.updateSuccessRate();
        });
    });

    MINI_CARD_CONTAINER.replaceChildren();

    teams.forEach((team) => {
        const playerCount = team.players.length;

        team.players.forEach((player, i) => {
            const miniCardElem = document.createElement("div");
            miniCardElem.classList.add("mini-card", team.side, `count-${playerCount}`);

            // If the playerCount is somehow invalid, pick the highest valid one.
            let top, left;
            if (!VALID_PLAYER_COUNTS.includes(playerCount)) {
                [top, left] = POSITIONS[VALID_PLAYER_COUNTS[-1]][i];
            } else {
                [top, left] = POSITIONS[playerCount][i];
            }
            miniCardElem.style.top =
                i < (playerCount + 1) / 2 ? `${top}%` : `${100 - top}%`;

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

    setup(teams, PREFERENCES, teamBanner);

    document.getElementById("teamForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        PREFERENCES = {
            teamA: new TeamPreferences(
                parseInt(formData.get("teamA_player_count")),
                formData.get("teamA_order"),
            ),
            teamB: new TeamPreferences(
                parseInt(formData.get("teamB_player_count")),
                formData.get("teamB_order"),
            ),
        };

        setup(teams, PREFERENCES, teamBanner);
    });
}

window.onload = () => {
    main();
};

window.toggleFullScreen = toggleFullScreen;
window.nextStep = nextStep;
window.previousStep = previousStep;
