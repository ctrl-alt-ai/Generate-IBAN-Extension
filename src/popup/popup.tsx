import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  generateIBAN, 
  countries, 
  IBANCountryCode, 
  IBANGenerationError,
  getAvailableCountries 
} from '../utils/ibanGenerator';

const Popup: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<IBANCountryCode>('NL');
  const [generatedIBAN, setGeneratedIBAN] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setCopySuccess(false);
    
    try {
      const iban = generateIBAN(selectedCountry);
      setGeneratedIBAN(iban);
    } catch (err) {
      if (err instanceof IBANGenerationError) {
        setError(`Error: ${err.message}`);
      } else {
        setError('An unexpected error occurred while generating IBAN');
      }
      setGeneratedIBAN('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedIBAN) return;
    
    try {
      await navigator.clipboard.writeText(generatedIBAN);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Hide success message after 2 seconds
    } catch (err) {
      console.error('Failed to copy IBAN:', err);
      setError('Failed to copy IBAN to clipboard');
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as IBANCountryCode;
    setSelectedCountry(value);
    // Clear previous results when country changes
    setGeneratedIBAN('');
    setError('');
    setCopySuccess(false);
  };

  return (
    <div style={{ 
      padding: '20px', 
      width: '320px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' 
    }}>
      <h1 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'center' }}>
        IBAN Generator
      </h1>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Country:
        </label>
        <select 
          value={selectedCountry}
          onChange={handleCountryChange}
          disabled={isGenerating}
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            backgroundColor: isGenerating ? '#f8f9fa' : 'white',
            cursor: isGenerating ? 'not-allowed' : 'pointer'
          }}
        >
          {getAvailableCountries().map((code) => (
            <option key={code} value={code}>
              {countries[code].name} ({code})
            </option>
          ))}
        </select>
      </div>

      <button 
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: isGenerating ? '#6c757d' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isGenerating ? 'not-allowed' : 'pointer',
          marginBottom: '15px',
          transition: 'background-color 0.2s'
        }}
      >
        {isGenerating ? 'Generating...' : 'Generate IBAN'}
      </button>

      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '15px', 
          padding: '8px', 
          backgroundColor: '#ffe6e6', 
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}

      {generatedIBAN && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Generated IBAN:
          </label>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px' 
          }}>
            <input 
              type="text" 
              value={generatedIBAN}
              readOnly
              style={{ 
                flex: 1, 
                padding: '8px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                backgroundColor: '#f8f9fa'
              }}
            />
            <button 
              onClick={handleCopy}
              disabled={!generatedIBAN || isGenerating}
              style={{
                padding: '8px 12px',
                backgroundColor: copySuccess ? '#28a745' : (generatedIBAN ? '#28a745' : '#6c757d'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (generatedIBAN && !isGenerating) ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s',
                minWidth: '60px'
              }}
            >
              {copySuccess ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {copySuccess && (
        <div style={{ 
          color: '#28a745', 
          marginBottom: '10px', 
          padding: '8px', 
          backgroundColor: '#d4edda', 
          borderRadius: '4px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          IBAN copied to clipboard!
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Popup />);
}