// Country configurations for IBAN generation
export const countries = {
  'NL': { name: 'Netherlands', length: 18, format: 'NL2!n4!a10!n' },
  'DE': { name: 'Germany', length: 22, format: 'DE2!n8!n10!n' },
  'FR': { name: 'France', length: 27, format: 'FR2!n5!n5!n11!c2!n' },
  'GB': { name: 'United Kingdom', length: 22, format: 'GB2!n4!a6!n8!n' },
  'ES': { name: 'Spain', length: 24, format: 'ES2!n4!n4!n1!n1!n10!n' },
  'IT': { name: 'Italy', length: 27, format: 'IT2!n1!a5!n5!n12!c' },
  'BE': { name: 'Belgium', length: 16, format: 'BE2!n3!n7!n2!n' },
  'CH': { name: 'Switzerland', length: 21, format: 'CH2!n5!n12!c' },
  'AT': { name: 'Austria', length: 20, format: 'AT2!n5!n11!n' },
  'DK': { name: 'Denmark', length: 18, format: 'DK2!n4!n9!n1!n' }
}

// Generate random bank code based on country
const generateBankCode = (countryCode: string): string => {
  switch (countryCode) {
    case 'NL':
      return 'ABNA'; // ABN AMRO example
    case 'DE':
      return Math.random().toString().substring(2, 10);
    case 'FR':
      return Math.random().toString().substring(2, 7) + Math.random().toString().substring(2, 7);
    case 'GB':
      return 'ABCD' + Math.random().toString().substring(2, 8);
    default:
      return Math.random().toString().substring(2, 10);
  }
}

// Generate random account number
const generateAccountNumber = (countryCode: string): string => {
  const country = countries[countryCode as keyof typeof countries];
  const accountLength = country.length - 4 - (countryCode === 'NL' ? 4 : countryCode === 'GB' ? 10 : 8);
  return Math.random().toString().substring(2, 2 + accountLength).padEnd(accountLength, '0');
}

// Calculate IBAN check digits
const calculateCheckDigits = (countryCode: string, bankCode: string, accountNumber: string): string => {
  // Move country code and '00' to end
  const rearranged = bankCode + accountNumber + countryCode + '00';
  
  // Replace letters with numbers (A=10, B=11, etc.)
  const numericString = rearranged.replace(/[A-Z]/g, (char) => 
    (char.charCodeAt(0) - 55).toString()
  );
  
  // Calculate mod 97
  let remainder = BigInt(numericString) % BigInt(97);
  const checkDigits = 98 - Number(remainder);
  
  return checkDigits.toString().padStart(2, '0');
}

// Main IBAN generation function
export const generateIBAN = (countryCode: string): string => {
  if (!countries[countryCode as keyof typeof countries]) {
    throw new Error(`Country code ${countryCode} not supported`);
  }
  
  const bankCode = generateBankCode(countryCode);
  const accountNumber = generateAccountNumber(countryCode);
  const checkDigits = calculateCheckDigits(countryCode, bankCode, accountNumber);
  
  return `${countryCode}${checkDigits}${bankCode}${accountNumber}`;
}
