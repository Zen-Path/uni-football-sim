import { createOption, getUniqueRandomElements, randRange } from "./utils.js";
import { Team, TeamBanner, DEFAULT_TEAMS } from "./team.js";
import { MiniCard, VALID_PLAYER_COUNTS } from "./player.js";
import { DEFAULT_PLAYERS } from "./player.js";

import { monteCarloSimulation, bellmanFordSimulation } from "./move-generator.js";

class Game {
    constructor() {
        this.bannerContainer = document.getElementById(TeamBanner.BANNER_CONTAINER_ID);

        this.sidebarLeft = document.body.querySelector("#sidebar-left");
        this.sidebarRight = document.body.querySelector("#sidebar-right");

        this.field = document.getElementById("board");
        this.miniCardContainer = document.getElementById("mini-card-container");

        this.toggleFullScreenBtn = document.getElementById("toggle-full-screen-btn");
        this.toggleFullScreenBtn.addEventListener("click", () => {
            this.toggleFullScreen();
        });

        this.nextStepBtn = document.getElementById("next-step-btn");
        this.nextStepBtn.addEventListener("click", () => {
            this.updateStep(1);
        });

        this.previousStepBtn = document.getElementById("previous-step-btn");
        this.previousStepBtn.addEventListener("click", () => {
            this.updateStep(-1);
        });

        this.preferences = {
            playerCount: VALID_PLAYER_COUNTS[1],
            playerOrder: Team.PLAYER_ORDER.ASCENDING,
        };

        this.preferencesFormContainer = document.getElementById(
            "preferences-form-container",
        );
        this.preferencesForm = this.createPreferencesForm();
        this.preferencesFormContainer.append(this.preferencesForm);

        this.fieldBall = this.createFieldBall();
        this.goalAnnouncementElem = this.createGoalAnnouncement();
        this.goalAnnouncementElem.classList.add("hidden");

        this.teams = getUniqueRandomElements(DEFAULT_TEAMS, 2).map((team, i) => {
            team.side = i;
            return team;
        });

        this.teamBanner = new TeamBanner(this.teams[0], this.teams[1]);
        const teamBannerElem = this.teamBanner.create();
        this.bannerContainer.appendChild(teamBannerElem);

        this.players = [];
        this.startingTeam = randRange(0, 1);

        this.goalKeeperPositions = [0, 0];
    }

    setup() {
        // Prevent generating new players when simply modifying the player order.
        if (!(this.players.length === 2 * this.preferences.playerCount)) {
            this.players = getUniqueRandomElements(
                DEFAULT_PLAYERS,
                this.preferences.playerCount * 2,
            );

            this.teams[0].players = this.players.slice(0, this.preferences.playerCount);
            this.teams[1].players = this.players.slice(this.preferences.playerCount);

            this.teams.forEach((team) => (team.score = 0));
            this.teamBanner.updateScore();
        }

        this.teams.forEach((team) => team.sortPlayers());

        const leftSidebarElem = this.teams[0].createSidebar();
        this.sidebarLeft.replaceChildren();
        this.sidebarLeft.appendChild(leftSidebarElem);

        const rightSidebarElem = this.teams[1].createSidebar();
        this.sidebarRight.replaceChildren();
        this.sidebarRight.appendChild(rightSidebarElem);

        this.miniCardContainer.replaceChildren();
        this.miniCards = this.teams
            .map((team) => {
                return team.players.map((player, i) => {
                    const miniCardElem = new MiniCard().create(
                        player,
                        team,
                        team.players.length,
                        i,
                    );
                    this.miniCardContainer.append(miniCardElem);
                    return miniCardElem;
                });
            })
            .flat();

        this.steps = null;
        this.stepIdx = 0;

        this.updateStep(0);
        this.startingTeam = Number(!this.startingTeam);
    }

    toggleFullScreen() {
        const content = document.getElementById("content");

        const fullScreenElems = [content, this.field];
        fullScreenElems.forEach((element) => element.classList.toggle("full-screen"));

        const hiddenElems = [this.bannerContainer, this.sidebarLeft, this.sidebarRight];
        hiddenElems.forEach((element) => element.classList.toggle("hidden"));
    }

    generateSteps() {
        let steps = [];

        this.goalKeeperPositions = [0, this.players.length / 2];
        steps.push(this.goalKeeperPositions[this.startingTeam]);

        let moves = [];
        switch (this.preferences.playerOrder) {
            case Team.PLAYER_ORDER.MONTE_CARLO:
                moves = monteCarloSimulation(10, 1000, () => this.validator(steps));
                break;
            case Team.PLAYER_ORDER.BELLMAN_FORD:
                moves = bellmanFordSimulation(this.players, () => this.validator(steps));
                break;
            default:
                moves = this.validator(steps);
                break;
        }

        console.log("Steps", steps);

        steps.push(
            this.goalKeeperPositions[
                Number(steps[steps.length - 1] < this.preferences.playerCount)
            ],
        );

        return steps;
    }

    validator(steps) {
        for (let i = 0; i < randRange(3, this.players.length * 1.5); i++) {
            let playerIdx = randRange(1, this.players.length - 1);
            while (
                steps[steps.length - 1] === playerIdx ||
                this.goalKeeperPositions.includes(playerIdx)
            ) {
                playerIdx = randRange(1, this.players.length - 1);
            }
            steps.push(playerIdx);
        }
    }

    updateStep(value) {
        if (!this.steps) {
            this.steps = this.generateSteps();
        }

        if (this.stepIdx === 0) {
            this.previousStepBtn.setAttribute("disabled", true);
            if (value < 0) {
                return;
            }
        } else {
            this.previousStepBtn.removeAttribute("disabled");
        }

        if (this.stepIdx === this.steps.length - 1) {
            this.teams[
                Number(this.steps[this.stepIdx] < (this.players.length - 1) / 2)
            ].score += 1;
            this.goalAnnouncementElem.classList.remove("hidden");
            this.restartMatch();
        } else {
            this.stepIdx += value;
            this.goalAnnouncementElem.classList.add("hidden");
        }

        this.miniCards[this.steps[Math.max(this.stepIdx - 1, 0)]].classList.remove(
            "active",
        );
        this.miniCards[this.steps[this.stepIdx]].classList.add("active");
        this.miniCards[this.steps[this.stepIdx]].appendChild(this.fieldBall);
    }

    restartMatch() {
        this.stepIdx = 0;
        this.startingTeam = Number(!this.startingTeam);
        this.steps = this.generateSteps();

        this.teamBanner.updateScore();
    }

    createFieldBall() {
        const result = document.createElement("img");
        result.classList.add("ball");
        result.src = "../assets/icons/icon_football-ball.svg";
        result.alt = "Football ball";
        result.draggable = false;

        return result;
    }

    createGoalAnnouncement() {
        const result = document.createElement("div");
        result.classList.add("goal-announcement");
        result.textContent = "Goal";
        this.field.append(result);

        return result;
    }

    createPreferencesForm() {
        const formElem = document.createElement("form");
        formElem.id = "preferences-form";

        const preferencesContainer = document.createElement("div");
        preferencesContainer.classList.add("preferences-container");

        const playerCountPreference = document.createElement("select");
        playerCountPreference.name = "player-count";
        playerCountPreference.title = "Player Count";
        playerCountPreference.append(
            ...VALID_PLAYER_COUNTS.map((value) => createOption(value)),
        );
        playerCountPreference.selectedIndex = VALID_PLAYER_COUNTS.indexOf(
            this.preferences.playerCount,
        );

        const playerOrderPreference = document.createElement("select");
        playerOrderPreference.name = "player-order";
        playerOrderPreference.title = "Player Order";
        playerOrderPreference.append(
            ...Object.entries(Team.PLAYER_ORDER).map(([text, value]) =>
                createOption(value, text),
            ),
        );
        playerOrderPreference.selectedIndex = Object.values(Team.PLAYER_ORDER).indexOf(
            this.preferences.playerOrder,
        );

        preferencesContainer.append(playerCountPreference, playerOrderPreference);

        const submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.classList.add("submit-btn");
        submitBtn.textContent = "Apply";

        formElem.append(preferencesContainer, submitBtn);

        return formElem;
    }
}

function main() {
    const game = new Game();

    game.setup();

    game.preferencesForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        game.preferences = {
            playerCount: parseInt(formData.get("player-count")),
            playerOrder: parseInt(formData.get("player-order")),
        };
        game.setup();
    });
}

window.onload = () => {
    main();
};
