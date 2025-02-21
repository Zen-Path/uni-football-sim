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

/**
 * Returns a random integer between min and max (inclusive).
 * @param {number} min - The lower bound (inclusive).
 * @param {number} max - The upper bound (inclusive).
 * @returns {number} A random integer between min and max.
 */
export function randRange(min, max) {
    // Ensure min and max are integers
    min = Math.ceil(min);
    max = Math.floor(max);

    // Generate a random integer between min and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createOption(value, text = null) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = text ? text : value;
    return option;
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
