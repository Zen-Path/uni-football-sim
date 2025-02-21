import { PLAYERS_DATA } from "../data/players.js";
import { Element, Stat } from "./utils.js";

class Player {
    static PROFILE_PICTURES_DIR = "../assets/images/players";

    constructor(
        firstName,
        lastName,
        profilePicturePath,
        accuracy = null,
        reach = null,
        capture = null,
        block = null,
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = `${this.firstName} ${this.lastName}`;

        this.profilePicturePath = profilePicturePath;

        this.accuracy = accuracy;
        this.reach = reach;
        this.capture = capture;
        this.block = block;

        this.stats = [this.accuracy, this.reach, this.capture, this.block].map((stat) => {
            if (!stat.value) {
                stat.value = 10 + Math.floor(Math.random() * (100 - 10));
            }
            return stat;
        });

        this.fullCardElem = null;
    }

    calcStrength() {
        return String(Math.floor(Math.random() * 100)).padStart(2, 0);
    }
}

export class PlayerCard extends Element {
    create() {
        const cardElem = document.createElement("div");
        cardElem.classList.add("full-card");

        const profilePictureContainerElem = document.createElement("div");
        profilePictureContainerElem.classList.add("profile-picture-container");

        const profilePictureElem = document.createElement("img");
        profilePictureElem.classList.add("profile-picture");
        profilePictureElem.src = this.data.profilePicturePath;
        profilePictureElem.alt = this.data.fullName;
        profilePictureElem.title = this.data.fullName;
        profilePictureElem.draggable = false;

        profilePictureContainerElem.append(profilePictureElem);

        const lastNameElem = document.createElement("p");
        lastNameElem.classList.add("last-name");
        lastNameElem.textContent = this.data.lastName;

        const statsContainerElem = document.createElement("div");
        statsContainerElem.classList.add("stats-container");

        statsContainerElem.append(
            ...this.data.stats.map((stat) => {
                const statElem = document.createElement("div");
                statElem.classList.add("stat");

                const descriptionElem = document.createElement("p");
                descriptionElem.classList.add("stat-description");
                descriptionElem.title = stat.name;
                descriptionElem.textContent = stat.shortName;

                const valueElem = document.createElement("p");
                valueElem.classList.add("stat-value");
                valueElem.textContent = String(stat.value).padStart(2, 0);

                statElem.append(descriptionElem, valueElem);
                return statElem;
            }),
        );

        const strengthElem = document.createElement("p");
        strengthElem.classList.add("player-strength");
        strengthElem.textContent = this.data.calcStrength();

        cardElem.append(
            profilePictureContainerElem,
            lastNameElem,
            statsContainerElem,
            strengthElem,
        );

        this.data.fullCardElem = cardElem;
        return cardElem;
    }
}

export class MiniCard extends Element {
    create(player, team, playerCount, i) {
        const miniCardElem = document.createElement("div");
        miniCardElem.classList.add(
            "mini-card",
            team.side ? "right" : "left",
            `count-${playerCount}`,
        );

        // If the playerCount is somehow invalid, pick the highest valid one.
        let top, left;
        if (!VALID_PLAYER_COUNTS.includes(playerCount)) {
            [top, left] = POSITIONS[VALID_PLAYER_COUNTS[-1]][i];
        } else {
            [top, left] = POSITIONS[playerCount][i];
        }
        miniCardElem.style.top = i < (playerCount + 1) / 2 ? `${top}%` : `${100 - top}%`;

        miniCardElem.style.left = team.side ? `${100 - left}%` : `${left}%`;

        const profilePictureElem = document.createElement("img");
        profilePictureElem.classList.add("profile-picture");
        profilePictureElem.src = player.profilePicturePath;
        profilePictureElem.title = `${player.firstName} ${player.lastName}`;
        profilePictureElem.draggable = false;

        miniCardElem.append(profilePictureElem);

        return miniCardElem;
    }
}

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

export const VALID_PLAYER_COUNTS = Object.keys(POSITIONS).map((count) => parseInt(count));

export const DEFAULT_PLAYERS = PLAYERS_DATA.map((player) => {
    return new Player(
        player.firstName,
        player.lastName,
        `${Player.PROFILE_PICTURES_DIR}/${player.imgName}`,
        new Stat("Accuracy", null, "acc"),
        new Stat("Reach", null, "rch"),
        new Stat("Capture", null, "cpt"),
        new Stat("Block", null, "blk"),
    );
});
