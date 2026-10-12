const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
// Execute actual numerical helpers without the browser UI. Stable markers bound the extraction.
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const start = source.indexOf('function truncatedSVD(');
const end = source.indexOf('function drawMatrix(', start);
assert.ok(start >= 0 && end > start, 'Numerical helper boundaries must exist');
const context = vm.createContext({ N: 16, Math: Object.create(Math) });
context.Math.random = () => 0.75;
vm.runInContext(source.slice(start, end), context);

test('matrix-vector arithmetic and norm', () => {
    assert.deepEqual(Array.from(context.matMulVec([[1, 2], [3, 4]], [2, 1])), [4, 10]);
    assert.deepEqual(Array.from(context.matTMulVec([[1, 2], [3, 4]], [2, 1])), [5, 8]);
    assert.equal(context.norm([3, 4]), 5);
});
test('rank-one reconstruction recovers a structured matrix', () => {
    const matrix = [[1, 2], [2, 4]];
    const { Us, Ss, Vs } = context.truncatedSVD(matrix, 1);
    const rebuilt = context.reconstruct(Us, Ss, Vs, 1);
    assert.ok(context.frobeniusError(matrix, rebuilt) < 1e-9);
});
test('rank zero and known reconstruction error', () => {
    const zero = context.reconstruct([], [], [], 0);
    assert.equal(zero.length, 16);
    assert.ok(zero.every(row => row.every(value => value === 0)));
    assert.equal(context.frobeniusError([[3, 4]], [[0, 0]]), 5);
});
