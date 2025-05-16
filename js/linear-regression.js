/**
 * Multiple Linear Regression with Feature Normalization
 *
 * Features: [accuracy, reach, capture, block]
 * Target: strength
 */
class LinearRegression {
    /**
     * @param {number} learningRate – step size for gradient descent
     * @param {number} iterations – number of passes over the data
     */
    constructor(learningRate = 0.01, iterations = 5000) {
        this.learningRate = learningRate;
        this.iterations = iterations;
        this.weights = null; // length = nFeatures
        this.bias = 0;
        this.means = null; // for normalization
        this.stds = null;
    }

    /**
     * Fit the model to your data.
     * Automatically normalizes each feature.
     * @param {number[][]} X    – m×n matrix of raw features
     * @param {number[]} y      – length-m array of targets
     */
    fit(X, y) {
        const m = X.length;
        if (!m) throw new Error("No training data");
        const n = X[0].length;

        // 1. Compute mean & std for each feature column
        this.means = new Array(n).fill(0);
        this.stds = new Array(n).fill(0);
        // sum
        for (let j = 0; j < n; j++) {
            for (let i = 0; i < m; i++) {
                this.means[j] += X[i][j];
            }
            this.means[j] /= m;
        }
        // variance
        for (let j = 0; j < n; j++) {
            for (let i = 0; i < m; i++) {
                const diff = X[i][j] - this.means[j];
                this.stds[j] += diff * diff;
            }
            this.stds[j] = Math.sqrt(this.stds[j] / m) || 1; // avoid div0
        }

        // 2. Normalize inputs
        const Xn = X.map((row) =>
            row.map((val, j) => (val - this.means[j]) / this.stds[j]),
        );

        // 3. Initialize parameters
        this.weights = new Array(n).fill(0);
        this.bias = 0;

        // 4. Gradient descent
        for (let iter = 0; iter < this.iterations; iter++) {
            const gradW = new Array(n).fill(0);
            let gradB = 0;

            // accumulate gradients over batch
            for (let i = 0; i < m; i++) {
                // prediction on normalized features
                let pred = this.bias;
                for (let j = 0; j < n; j++) {
                    pred += this.weights[j] * Xn[i][j];
                }
                const err = pred - y[i];
                gradB += err;
                for (let j = 0; j < n; j++) {
                    gradW[j] += err * Xn[i][j];
                }
            }

            // average + update
            gradB /= m;
            for (let j = 0; j < n; j++) {
                gradW[j] /= m;
                this.weights[j] -= this.learningRate * gradW[j];
            }
            this.bias -= this.learningRate * gradB;
        }
    }

    /*
     * Predict a single sample’s strength (clamped ≥ 1).
     * Automatically normalizes with the same means & stds.
     * @param {number[]} xRaw – raw [accuracy, reach, capture, block]
     * @returns {number}
     */
    predict(xRaw) {
        if (!this.weights) throw new Error("Model not trained");
        // normalize
        const x = xRaw.map((v, j) => (v - this.means[j]) / this.stds[j]);
        // raw linear sum
        const raw = this.weights.reduce((sum, wj, j) => sum + wj * x[j], this.bias);
        // clamp to at least 1
        return Math.max(raw, 1);
    }
}

// DATA
const TRAINING_FEATURES = [
    [99, 99, 99, 99],
    [99, 99, 99, 50],
    [99, 99, 50, 99],
    [99, 50, 99, 99],
    [50, 99, 99, 99],
    [30, 78, 40, 40],
    [70, 40, 65, 88],
];
const TRAINING_STRENGTH = [99, 83, 80, 86, 70, 34, 66];

export const LINEAR_REGRESSION_MODEL = new LinearRegression(0.05, 10000);
LINEAR_REGRESSION_MODEL.fit(TRAINING_FEATURES, TRAINING_STRENGTH);

// SANITY CHECK
const testPlayerStats = [80, 32, 52, 60];
console.log(
    "Linear Regression - Player Strength:",
    LINEAR_REGRESSION_MODEL.predict(testPlayerStats).toFixed(0),
);
