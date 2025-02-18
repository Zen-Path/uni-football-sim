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
