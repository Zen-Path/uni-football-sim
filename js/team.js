import { TEAMS_DATA } from "../data/teams.js";
import { PlayerCard } from "./player.js";
import { shuffleArray } from "./utils.js";

export class Team {
    static LOGOS_DIR = "../assets/images/teams";

    static PLAYER_ORDER = {
        MANUAL: 0,
        BEST: 1,
        WORST: 2,
        RANDOM: 3,
    };

    constructor(name, logo, side = null, players = null) {
        this.name = name;
        this.logo = logo;

        this.side = side;
        this.players = players;

        this.score = 0;
    }

    createSidebar() {
        const sidebarElem = document.createElement("div");
        sidebarElem.classList.add("full-cards-container", "hidden-scroll-bar");
        sidebarElem.append(...this.getFullCards());

        return sidebarElem;
    }

    getFullCards() {
        return this.players.map((player) => new PlayerCard(player).create());
    }

    orderPlayers(order) {
        switch (order) {
            case Team.PLAYER_ORDER.BEST:
                this.players = this.#sortPlayersBest().reverse();
                break;
            case Team.PLAYER_ORDER.WORST:
                this.players = this.#sortPlayersBest();
                break;
            case Team.PLAYER_ORDER.RANDOM:
                this.players = shuffleArray(this.players);
                break;
            case Team.PLAYER_ORDER.MANUAL:
                // nothing to do.
                break;
            default:
                break;
        }
    }

    #sortPlayersBest() {
        // TODO: Use proper algorithm.
        return this.players.sort((a, b) => a.strength - b.strength);
    }
}

export class TeamBanner {
    static SCORE_ELEM_ID = "score";
    static BANNER_CONTAINER_ID = "banner-container";

    constructor(teamA, teamB) {
        this.teamA = teamA;
        this.teamB = teamB;

        this.scoreElem = null;
    }

    create() {
        const bannerElem = document.createElement("div");
        bannerElem.classList.add("banner");

        bannerElem.append(
            this.#createTeamBadge(this.teamA),
            this.#createRibbon(),
            this.#createTeamBadge(this.teamB),
        );

        return bannerElem;
    }

    #createTeamBadge(team) {
        const badgeElem = document.createElement("div");
        badgeElem.classList.add("badge", team.side ? "right" : "left");

        const logoElem = document.createElement("img");
        logoElem.classList.add("logo");
        logoElem.alt = `${team.name} Logo`;
        logoElem.draggable = false;
        logoElem.src = team.logo || "";

        const nameElem = document.createElement("p");
        nameElem.textContent = team.name;

        badgeElem.append(logoElem, nameElem);

        return badgeElem;
    }

    #createRibbon() {
        const ribbonElem = document.createElement("div");
        ribbonElem.classList.add("ribbon");

        const iconElem = document.createElement("img");
        iconElem.classList.add("icon");
        iconElem.src = "../assets/icons/icon_gold-ball.png";
        iconElem.alt = "Gold ball";
        iconElem.draggable = false;

        const scoreElem = document.createElement("p");
        scoreElem.textContent = this.#composeScore();
        this.scoreElem = scoreElem;

        ribbonElem.append(iconElem, scoreElem);

        return ribbonElem;
    }

    updateScore() {
        if (this.scoreElem) {
            this.scoreElem.textContent = this.#composeScore();
        }
    }

    #composeScore() {
        return [this.teamA, this.teamB].map((team) => String(team.score)).join(":");
    }
}

export const DEFAULT_TEAMS = TEAMS_DATA.map((team) => {
    return new Team(team.name, `${Team.LOGOS_DIR}/${team.imgName}`);
});
