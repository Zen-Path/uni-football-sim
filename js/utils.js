
export class Element {
    constructor(data) {
        this.data = data;
    }

    create() {}
}

export class Stat {
    constructor(name, value = null, shortName = null) {
        this.name = name;
        this.value = value;
        this.shortName = shortName.toUpperCase();
    }
}
