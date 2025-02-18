export function getUniqueRandomElements(array, n) {
    if (n > array.length) {
        throw new Error("n cannot be larger than the array length");
    }
    const shuffled = array.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

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
