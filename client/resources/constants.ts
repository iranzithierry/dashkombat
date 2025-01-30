export const PAYMENT_PROVIDERS = [
    { id: 'MTN', name: 'MTN Mobile Money' },
    { id: 'AIRTEL', name: 'Airtel Money' }
] as const;

export type PaymentProvider = typeof PAYMENT_PROVIDERS[number]['id'];
