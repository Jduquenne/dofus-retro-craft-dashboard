import bankItemIndexData from './bank/bank-item-index.json';
import type { BankIndexEntry } from '../types/bank';

export const bankItemIndex: Record<string, BankIndexEntry> = bankItemIndexData as Record<string, BankIndexEntry>;
