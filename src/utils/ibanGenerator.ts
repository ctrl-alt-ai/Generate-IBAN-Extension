/**
 * Interface for IBAN country configuration
 */
export interface IBANCountryConfig {
  /** Full country name */
  name: string;
  /** Total IBAN length including country code and check digits */
  length: number;
  /** IBAN format specification */
  format: string;
  /** Bank code length */
  bankCodeLength: number;
  /** Account number length */
  accountNumberLength: number;
  /** Sample bank codes for generation */
  sampleBankCodes: string[];
}

/**
 * Supported IBAN country codes
 */
export type IBANCountryCode = 'NL' | 'DE' | 'FR' | 'GB' | 'ES' | 'IT' | 'BE' | 'CH' | 'AT' | 'DK';

/**
 * Country configurations for IBAN generation
 */
export const countries: Record<IBANCountryCode, IBANCountryConfig> = {
  'NL': { 
    name: 'Netherlands', 
    length: 18, 
    format: 'NL2!n4!a10!n', 
    bankCodeLength: 4, 
    accountNumberLength: 10,
    sampleBankCodes: ['ABNA', 'INGB', 'RABO', 'TRIO']
  },
  'DE': { 
    name: 'Germany', 
    length: 22, 
    format: 'DE2!n8!n10!n', 
    bankCodeLength: 8, 
    accountNumberLength: 10,
    sampleBankCodes: ['10010010', '20070024', '37040044', '50010517']
  },
  'FR': { 
    name: 'France', 
    length: 27, 
    format: 'FR2!n5!n5!n11!c2!n', 
    bankCodeLength: 10, 
    accountNumberLength: 13,
    sampleBankCodes: ['2004100005', '3000200009', '1027800002', '2004100005']
  },
  'GB': { 
    name: 'United Kingdom', 
    length: 22, 
    format: 'GB2!n4!a6!n8!n', 
    bankCodeLength: 10, 
    accountNumberLength: 8,
    sampleBankCodes: ['ABBY060001', 'BARC200000', 'HBUK400003', 'LOYD309634']
  },
  'ES': { 
    name: 'Spain', 
    length: 24, 
    format: 'ES2!n4!n4!n1!n1!n10!n', 
    bankCodeLength: 8, 
    accountNumberLength: 12,
    sampleBankCodes: ['21000418', '00720301', '01820200', '21000001']
  },
  'IT': { 
    name: 'Italy', 
    length: 27, 
    format: 'IT2!n1!a5!n5!n12!c', 
    bankCodeLength: 11, 
    accountNumberLength: 12,
    sampleBankCodes: ['X0542811101', 'A0306901691', 'U0301503200', 'C0301503400']
  },
  'BE': { 
    name: 'Belgium', 
    length: 16, 
    format: 'BE2!n3!n7!n2!n', 
    bankCodeLength: 3, 
    accountNumberLength: 9,
    sampleBankCodes: ['539', '096', '001', '068']
  },
  'CH': { 
    name: 'Switzerland', 
    length: 21, 
    format: 'CH2!n5!n12!c', 
    bankCodeLength: 5, 
    accountNumberLength: 12,
    sampleBankCodes: ['00762', '08390', '00230', '00254']
  },
  'AT': { 
    name: 'Austria', 
    length: 20, 
    format: 'AT2!n5!n11!n', 
    bankCodeLength: 5, 
    accountNumberLength: 11,
    sampleBankCodes: ['19043', '32000', '20111', '14000']
  },
  'DK': { 
    name: 'Denmark', 
    length: 18, 
    format: 'DK2!n4!n9!n1!n', 
    bankCodeLength: 4, 
    accountNumberLength: 10,
    sampleBankCodes: ['0040', '5301', '9570', '7311']
  }
}

/**
 * Custom error for IBAN generation
 */
export class IBANGenerationError extends Error {
  constructor(message: string, public readonly countryCode?: string) {
    super(message);
    this.name = 'IBANGenerationError';
  }
}

/**
 * Validates if a country code is supported for IBAN generation
 */
export function isValidCountryCode(countryCode: string): countryCode is IBANCountryCode {
  return countryCode in countries;
}

/**
 * Validates input for IBAN generation
 */
function validateCountryCode(countryCode: string): asserts countryCode is IBANCountryCode {
  if (!countryCode) {
    throw new IBANGenerationError('Country code is required');
  }
  
  if (typeof countryCode !== 'string') {
    throw new IBANGenerationError('Country code must be a string');
  }
  
  if (!isValidCountryCode(countryCode.toUpperCase())) {
    throw new IBANGenerationError(
      `Country code '${countryCode}' is not supported. Supported codes: ${Object.keys(countries).join(', ')}`,
      countryCode
    );
  }
}

/**
 * Generates a cryptographically secure random integer between min and max (inclusive)
 */
function getSecureRandomInt(min: number, max: number): number {
  if (min > max) {
    throw new Error('Minimum value cannot be greater than maximum value');
  }
  
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValidValue = Math.floor(256 ** bytesNeeded / range) * range - 1;
  
  let randomValue: number;
  do {
    const randomBytes = crypto.getRandomValues(new Uint8Array(bytesNeeded));
    randomValue = randomBytes.reduce((sum, byte, index) => sum + byte * (256 ** index), 0);
  } while (randomValue > maxValidValue);
  
  return min + (randomValue % range);
}

/**
 * Generates a secure random numeric string of specified length
 */
function generateRandomNumericString(length: number): string {
  if (length <= 0) {
    return '';
  }
  
  let result = '';
  for (let i = 0; i < length; i++) {
    result += getSecureRandomInt(0, 9).toString();
  }
  return result;
}

/**
 * Generates a secure random alphanumeric string of specified length
 */
function generateRandomAlphanumericString(length: number): string {
  if (length <= 0) {
    return '';
  }
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[getSecureRandomInt(0, chars.length - 1)];
  }
  return result;
}

/**
 * Generates a realistic bank code for the specified country
 */
function generateBankCode(countryCode: IBANCountryCode): string {
  const config = countries[countryCode];
  const sampleCodes = config.sampleBankCodes;
  
  // Use a realistic sample bank code or generate one with the correct format
  if (sampleCodes.length > 0) {
    const randomIndex = getSecureRandomInt(0, sampleCodes.length - 1);
    return sampleCodes[randomIndex];
  }
  
  // Fallback to generating based on format
  switch (countryCode) {
    case 'NL':
      // 4 letters for Dutch banks
      return generateRandomAlphanumericString(4).replace(/\d/g, () => 
        String.fromCharCode(65 + getSecureRandomInt(0, 25))
      );
    case 'DE':
    case 'ES':
    case 'BE':
    case 'CH':
    case 'AT':
    case 'DK':
      // Numeric bank codes
      return generateRandomNumericString(config.bankCodeLength);
    case 'FR':
      // French format: 5 digits + 5 digits
      return generateRandomNumericString(5) + generateRandomNumericString(5);
    case 'GB':
      // UK format: 4 letters + 6 digits
      return generateRandomAlphanumericString(4).replace(/\d/g, () => 
        String.fromCharCode(65 + getSecureRandomInt(0, 25))
      ) + generateRandomNumericString(6);
    case 'IT':
      // Italian format: 1 letter + 5 digits + 5 digits
      return String.fromCharCode(65 + getSecureRandomInt(0, 25)) + 
             generateRandomNumericString(5) + 
             generateRandomNumericString(5);
    default:
      return generateRandomNumericString(config.bankCodeLength);
  }
}

/**
 * Generates a random account number for the specified country
 */
function generateAccountNumber(countryCode: IBANCountryCode): string {
  const config = countries[countryCode];
  const length = config.accountNumberLength;
  
  switch (countryCode) {
    case 'FR':
      // French format: 11 alphanumeric + 2 digits for key
      return generateRandomAlphanumericString(11) + generateRandomNumericString(2);
    case 'IT':
      // Italian format: 12 alphanumeric characters
      return generateRandomAlphanumericString(12);
    case 'CH':
      // Swiss format: 12 alphanumeric characters
      return generateRandomAlphanumericString(12);
    default:
      // Most countries use numeric account numbers
      return generateRandomNumericString(length);
  }
}

/**
 * Converts a character to its numeric representation for IBAN calculation
 * A=10, B=11, ..., Z=35
 */
function charToNumber(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 48 && code <= 57) {
    // Numbers 0-9 stay the same
    return char;
  } else if (code >= 65 && code <= 90) {
    // Letters A-Z become 10-35
    return (code - 55).toString();
  } else {
    throw new IBANGenerationError(`Invalid character '${char}' in IBAN calculation`);
  }
}

/**
 * Calculates IBAN check digits using the mod-97 algorithm
 */
function calculateCheckDigits(countryCode: IBANCountryCode, bankCode: string, accountNumber: string): string {
  try {
    // Step 1: Move the first 4 characters to the end and replace check digits with '00'
    const rearranged = bankCode + accountNumber + countryCode + '00';
    
    // Step 2: Replace each letter with its numeric equivalent
    let numericString = '';
    for (const char of rearranged) {
      numericString += charToNumber(char.toUpperCase());
    }
    
    // Step 3: Calculate mod 97 using BigInt to handle large numbers
    const remainder = BigInt(numericString) % 97n;
    
    // Step 4: Calculate check digits (98 - remainder)
    const checkDigits = 98 - Number(remainder);
    
    // Step 5: Ensure we always return 2 digits (pad with leading zero if needed)
    return checkDigits.toString().padStart(2, '0');
  } catch (error) {
    throw new IBANGenerationError(
      `Failed to calculate check digits: ${error instanceof Error ? error.message : 'Unknown error'}`,
      countryCode
    );
  }
}

/**
 * Validates the generated IBAN by checking its length and structure
 */
function validateGeneratedIBAN(iban: string, countryCode: IBANCountryCode): void {
  const config = countries[countryCode];
  
  if (iban.length !== config.length) {
    throw new IBANGenerationError(
      `Generated IBAN has incorrect length. Expected ${config.length}, got ${iban.length}`,
      countryCode
    );
  }
  
  if (!iban.startsWith(countryCode)) {
    throw new IBANGenerationError(
      `Generated IBAN does not start with country code ${countryCode}`,
      countryCode
    );
  }
  
  // Verify check digits are numeric
  const checkDigits = iban.substring(2, 4);
  if (!/^\d{2}$/.test(checkDigits)) {
    throw new IBANGenerationError(
      `Invalid check digits: ${checkDigits}`,
      countryCode
    );
  }
}

/**
 * Generates a valid IBAN for the specified country
 * @param countryCode - The ISO 3166-1 alpha-2 country code
 * @returns A valid IBAN string
 * @throws {IBANGenerationError} If the country code is invalid or generation fails
 */
export function generateIBAN(countryCode: string): string {
  // Normalize and validate input
  const normalizedCountryCode = countryCode.toUpperCase().trim();
  validateCountryCode(normalizedCountryCode);
  
  try {
    // Generate components
    const bankCode = generateBankCode(normalizedCountryCode);
    const accountNumber = generateAccountNumber(normalizedCountryCode);
    
    // Calculate check digits
    const checkDigits = calculateCheckDigits(normalizedCountryCode, bankCode, accountNumber);
    
    // Construct IBAN
    const iban = `${normalizedCountryCode}${checkDigits}${bankCode}${accountNumber}`;
    
    // Validate the generated IBAN
    validateGeneratedIBAN(iban, normalizedCountryCode);
    
    return iban;
  } catch (error) {
    if (error instanceof IBANGenerationError) {
      throw error;
    }
    throw new IBANGenerationError(
      `Unexpected error during IBAN generation: ${error instanceof Error ? error.message : 'Unknown error'}`,
      normalizedCountryCode
    );
  }
}

/**
 * Returns a list of available country codes for IBAN generation
 */
export function getAvailableCountries(): IBANCountryCode[] {
  return Object.keys(countries) as IBANCountryCode[];
}

/**
 * Returns the configuration for a specific country
 */
export function getCountryConfig(countryCode: IBANCountryCode): IBANCountryConfig {
  return countries[countryCode];
}
