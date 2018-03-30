var expect = require('expect');
var {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var response = isRealString(98);
        expect(response).toBe(false);
    });

    it('should reject string with only spaces', () => {
        var response = isRealString('        ');
        expect(response).toBe(false);
    });

    it('should allow string with non-space characters', () => {
        var response = isRealString('andrew');
        expect(response).toBe(true);
    })
});