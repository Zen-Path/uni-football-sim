import { PLAYERS_DATA } from "../data/players.js";
import { Element, Stat, randRange } from "./utils.js";

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
                stat.value = randRange(20, 100);
            }
            return stat;
        });

        this.fullCardElem = null;

        this.strength = this.calcStrength();
    }

    fmtStrength() {
        return String(this.strength).padStart(2, 0);
    }

    calcStrength() {
        // TODO: Use proper algorithm.
        return randRange(30, 99);
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
        strengthElem.textContent = this.data.strength;

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
            [top, left] =
                POSITIONS[VALID_PLAYER_COUNTS[VALID_PLAYER_COUNTS.length - 1]][i];
        } else {
            [top, left] = POSITIONS[playerCount][i];
        }
        miniCardElem.style.top = `${top}%`;

        miniCardElem.style.left = team.side ? `${100 - left}%` : `${left}%`;

        const profilePictureElem = document.createElement("img");
        profilePictureElem.classList.add("profile-picture");
        profilePictureElem.src = player.profilePicturePath;
        profilePictureElem.title = `${player.fullName} (${team.side * playerCount + i})`;
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

        [100 - 24, 32],
    ],
    10: [
        [50, 13],

        [24, 20],
        [24, 34],

        [39, 26],
        [39, 44],

        [50, 35],

        [100 - 39, 26],
        [100 - 39, 44],

        [100 - 24, 20],
        [100 - 24, 34],
    ],
    20: [
        [50, 11],

        [22, 21],
        [22, 21 + 8],
        [22, 21 + 8 * 2],
        [22, 21 + 8 * 3],

        [36, 18],
        [36, 18 + 8],
        [36, 18 + 8 * 2],
        [36, 18 + 8 * 3],

        [50, 16 + 8],
        [50, 16 + 8 * 2],
        [50, 16 + 8 * 3],

        [100 - 36, 18],
        [100 - 36, 18 + 8],
        [100 - 36, 18 + 8 * 2],
        [100 - 36, 18 + 8 * 3],

        [100 - 22, 21],
        [100 - 22, 21 + 8],
        [100 - 22, 21 + 8 * 2],
        [100 - 22, 21 + 8 * 3],
    ],
    50: [
        [50, 11],

        [21, 15],
        [20, 15 + 5],
        [19, 15 + 5 * 2],
        [18, 15 + 5 * 3],
        [17, 15 + 5 * 4],
        [16, 15 + 5 * 5],
        [15, 15 + 5 * 6],

        [31, 16],
        [30, 16 + 5],
        [29, 16 + 5 * 2],
        [28, 16 + 5 * 3],
        [27, 16 + 5 * 4],
        [26, 16 + 5 * 5],
        [25, 16 + 5 * 6],

        [41, 17],
        [40, 17 + 5],
        [39, 17 + 5 * 2],
        [38, 17 + 5 * 3],
        [37, 17 + 5 * 4],
        [36, 17 + 5 * 5],
        [35, 17 + 5 * 6],

        // Middle
        [50, 15 + 5],
        [50, 15 + 5 * 2],
        [50, 15 + 5 * 3],
        [50, 15 + 5 * 4],
        [50, 15 + 5 * 5],
        [50 - 5, 16 + 5 * 6],
        [50 + 5, 16 + 5 * 6],

        [100 - 41, 17],
        [100 - 40, 17 + 5],
        [100 - 39, 17 + 5 * 2],
        [100 - 38, 17 + 5 * 3],
        [100 - 37, 17 + 5 * 4],
        [100 - 36, 17 + 5 * 5],
        [100 - 35, 17 + 5 * 6],

        [100 - 31, 16],
        [100 - 30, 16 + 5],
        [100 - 29, 16 + 5 * 2],
        [100 - 28, 16 + 5 * 3],
        [100 - 27, 16 + 5 * 4],
        [100 - 26, 16 + 5 * 5],
        [100 - 25, 16 + 5 * 6],

        [100 - 21, 15],
        [100 - 20, 15 + 5],
        [100 - 19, 15 + 5 * 2],
        [100 - 18, 15 + 5 * 3],
        [100 - 17, 15 + 5 * 4],
        [100 - 16, 15 + 5 * 5],
        [100 - 15, 15 + 5 * 6],
    ]
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
