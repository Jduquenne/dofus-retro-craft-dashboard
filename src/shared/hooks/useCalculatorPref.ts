import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dora_calculator_prof';

export function useCalculatorPref() {
    const [selectedProfId, setSelectedProfIdState] = useState<string>(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) ?? '';
        } catch { /* localStorage indisponible */ }
        return '';
    });

    useEffect(() => {
        try {
            if (selectedProfId) {
                localStorage.setItem(STORAGE_KEY, selectedProfId);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch { /* localStorage indisponible */ }
    }, [selectedProfId]);

    return { selectedProfId, setSelectedProfId: setSelectedProfIdState };
}
