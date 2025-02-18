import { TEAMS_DATA } from "../data/teams.js";
import { PlayerCard } from "./player.js";

export class Team {
    static LOGOS_DIR = "../assets/images/teams";
    static SIDE = {
        LEFT: "left",
        RIGHT: "right",
    };

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

        this.positions = [];
        this.winningChance = 50.0;

        this.sidebarElem = null;
    }

    createSidebar() {
        const sidebarElem = document.createElement("div");
        sidebarElem.classList.add("full-cards-container", "hidden-scrollable");

        sidebarElem.append(...this.getFullCards());
        this.sidebarElem = sidebarElem;
        return sidebarElem;
    }

    getFullCards() {
        return this.players.map((player) => new PlayerCard(player).create());
    }

    // TODO: improve this logic
    getMiniCards() {
        return this.positions.map((player) => player.createMiniCard());
    }

    calcWinningChance() {
        const winningChance = Math.random() * 100;
        this.winningChance = winningChance;
        return winningChance;
    }
}

export class TeamBanner {
    static TEAMS_WINNING_CHANCE_ID = "teams-winning-chance";
    static BANNER_CONTAINER_ID = "banner-container";

    constructor(teams) {
        this.teams = teams;
    }

    create() {
        const bannerElem = document.createElement("div");
        bannerElem.classList.add("banner");

        bannerElem.append(
            this.#createTeamBadge(this.teams[0]),
            this.#createRibbon(),
            this.#createTeamBadge(this.teams[1]),
        );

        return bannerElem;
    }

    #createTeamBadge(team) {
        const badgeElem = document.createElement("div");
        badgeElem.classList.add("badge", team.side);

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

        const chanceElem = document.createElement("p");
        chanceElem.id = TeamBanner.TEAMS_WINNING_CHANCE_ID;
        chanceElem.textContent = this.#composeSuccessRate();

        ribbonElem.append(iconElem, chanceElem);
        return ribbonElem;
    }

    updateSuccessRate() {
        const successRateElem = document.querySelector(
            `#${TeamBanner.TEAMS_WINNING_CHANCE_ID}`,
        );
        if (successRateElem) {
            successRateElem.textContent = this.#composeSuccessRate();
        }
    }

    #composeSuccessRate() {
        // TODO: Replace with actual logic
        const teamAChance = this.teams[0].calcWinningChance();
        const teamBChance = 100 - teamAChance;

        return [teamAChance, teamBChance]
            .map((chance) => `${String(chance.toFixed(0)).padStart(2, 0)}`)
            .join(":");
    }
}

export const DEFAULT_TEAMS = TEAMS_DATA.map((team) => {
    return new Team(team.name, `${Team.LOGOS_DIR}/${team.imgName}`);
});
