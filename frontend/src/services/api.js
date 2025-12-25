
const API_BASE = 'http://localhost:8000';

// Allowed emails for Health Official role
export const OFFICIAL_WHITELIST = new Set([
    'soham.pethkar1710@gmail.com',
    'dcharshvardhanpondkule@gmail.com',
]);

export const api = {
    async get(endpoint) {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
    },
    async post(endpoint, data) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
    },
    async postForm(endpoint, formData) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            body: formData
        });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
    }
};
