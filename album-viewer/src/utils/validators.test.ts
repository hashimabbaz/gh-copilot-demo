import {describe, it} from 'mocha';
import {expect} from 'chai';

import {validateFrenchDate, validateGuid} from './validators';

describe('Validators', () => {
  describe('validateFrenchDate', () => {
    it('should return a Date object for valid French date format', () => {
      const result = validateFrenchDate('25/12/2023');
      expect(result).to.be.instanceOf(Date);
      expect(result!.getDate()).to.equal(25);
      expect(result!.getMonth()).to.equal(11); // December (0-indexed)
      expect(result!.getFullYear()).to.equal(2023);
    });

    it('should return null for invalid date format', () => {
      expect(validateFrenchDate('25-12-2023')).to.be.null;
      expect(validateFrenchDate('25/12/23')).to.be.null;
      expect(validateFrenchDate('2023/12/25')).to.be.null;
      expect(validateFrenchDate('')).to.be.null;
    });

    it('should return null for invalid dates', () => {
      expect(validateFrenchDate('32/12/2023')).to.be.null; // Invalid day
      expect(validateFrenchDate('25/13/2023')).to.be.null; // Invalid month
      expect(validateFrenchDate('30/02/2023')).to.be.null; // Feb 30th doesn't exist
    });

    it('should handle edge cases', () => {
      expect(validateFrenchDate('29/02/2024')).to.not.be.null; // Leap year
      expect(validateFrenchDate('28/02/2023')).to.not.be.null; // Non-leap year
      expect(validateFrenchDate('1/1/2023')).to.not.be.null; // Single digit day/month
    });
  });

  describe('validateGuid', () => {
    it('should return true for valid GUID format', () => {
      const validGuid = '12345678-1234-1234-1234-123456789012';
      expect(validateGuid(validGuid)).to.be.true;
    });

    it('should return false for invalid GUID format', () => {
      expect(validateGuid('12345678-1234-1234-1234')).to.be.false; // Too short
      expect(validateGuid('12345678-1234-1234-1234-1234567890123')).to.be.false; // Too long
      expect(validateGuid('gggggggg-gggg-gggg-gggg-gggggggggggg')).to.be.false; // Invalid characters
      expect(validateGuid('')).to.be.false; // Empty string
    });

    it('should handle case insensitive GUIDs', () => {
      const upperGuid = '12345678-ABCD-EFGH-IJKL-123456789012';
      const lowerGuid = '12345678-abcd-efgh-ijkl-123456789012';
      expect(validateGuid(upperGuid)).to.be.true;
      expect(validateGuid(lowerGuid)).to.be.true;
    });
  });
});