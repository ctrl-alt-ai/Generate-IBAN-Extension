# IBAN Generator Chrome Extension

A Chrome Extension for generating valid IBAN numbers for testing purposes. This extension has been thoroughly refactored for improved security, performance, and maintainability.

## Features

- **Secure IBAN Generation**: Generate valid IBAN numbers for 10+ countries using cryptographically secure random number generation
- **Real-time Validation**: All generated IBANs are validated using the official mod-97 algorithm
- **Multiple Display Formats**: View IBANs in compact or formatted (with spaces) format
- **Copy to Clipboard**: One-click copying with visual feedback
- **TypeScript Support**: Fully typed codebase for better development experience
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Modern UI**: Clean, responsive popup interface

## Supported Countries

- 🇳🇱 Netherlands (NL)
- 🇩🇪 Germany (DE) 
- 🇫🇷 France (FR)
- 🇬🇧 United Kingdom (GB)
- 🇪🇸 Spain (ES)
- 🇮🇹 Italy (IT)
- 🇧🇪 Belgium (BE)
- 🇨🇭 Switzerland (CH)
- 🇦🇹 Austria (AT)
- 🇩🇰 Denmark (DK)

## Installation

1. Clone this repository
2. Run `npm install`
3. Run `npm run build`
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode"
6. Click "Load unpacked" and select the `dist` folder

## Development

```bash
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Build for production
```

## Code Quality Improvements

This extension has been refactored with senior-level code quality improvements:

### 🔒 Security Enhancements
- **Cryptographically Secure Random Generation**: Replaced `Math.random()` with `crypto.getRandomValues()` for secure random number generation
- **Input Validation**: Comprehensive validation of all inputs with proper error handling
- **Type Safety**: Strict TypeScript typing prevents runtime errors

### 🏗️ Architecture Improvements
- **Separation of Concerns**: Clear separation between generation, validation, and UI logic
- **Single Responsibility**: Each function has a single, well-defined purpose
- **Proper Error Handling**: Custom error classes with detailed error messages
- **Modular Design**: Utilities can be easily tested and extended

### 📝 Type System
```typescript
// Strong typing throughout the codebase
export type IBANCountryCode = 'NL' | 'DE' | 'FR' | 'GB' | 'ES' | 'IT' | 'BE' | 'CH' | 'AT' | 'DK';

export interface IBANCountryConfig {
  name: string;
  length: number;
  format: string;
  bankCodeLength: number;
  accountNumberLength: number;
  sampleBankCodes: string[];
}
```

### 🎯 Performance Optimizations
- **Efficient Algorithms**: Optimized mod-97 calculation for IBAN validation
- **Minimal DOM Updates**: React state management prevents unnecessary re-renders
- **Lazy Validation**: Validation only occurs when needed

### 🧪 Reliability
- **IBAN Validation**: All generated IBANs are validated using the official algorithm
- **Realistic Bank Codes**: Uses actual bank codes from real financial institutions
- **Error Recovery**: Graceful handling of all error conditions

### 📚 Documentation
- **JSDoc Comments**: Comprehensive documentation for all functions
- **Type Annotations**: Self-documenting code through TypeScript
- **Clear Function Names**: Descriptive naming throughout the codebase

## API Reference

### Core Functions

```typescript
// Generate a valid IBAN for the specified country
generateIBAN(countryCode: string): string

// Validate an existing IBAN
validateIBAN(iban: string): boolean

// Format IBAN with spaces for readability
formatIBAN(iban: string): string

// Get list of supported countries
getAvailableCountries(): IBANCountryCode[]
```

### Error Handling

```typescript
try {
  const iban = generateIBAN('NL');
  console.log('Generated IBAN:', iban);
} catch (error) {
  if (error instanceof IBANGenerationError) {
    console.error('IBAN Generation Error:', error.message);
  }
}
```

## Building

The extension uses Vite for building:

```bash
npm run build
```

This creates a `dist` folder containing:
- `popup.html` - Extension popup interface
- `popup.js` - Bundled JavaScript code
- `manifest.json` - Extension metadata (copied manually)

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Note**: This extension generates IBANs for testing purposes only. Do not use generated IBANs for actual financial transactions.
