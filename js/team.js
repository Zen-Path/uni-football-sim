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
