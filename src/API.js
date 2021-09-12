const API_URL = process.env.SERVER_URL;

export async function listLogEntries() {
    const resp = await fetch(API_URL + '/api/logs');
    return resp.json()
}

export async function createLogEntry(entry) {
    const apiKey = entry.apiKey;
    delete entry.apiKey;
    const resp = await fetch(API_URL + '/api/logs', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey,
        },
        body: JSON.stringify(entry)
    });
    const json = await resp.json();
    if(resp.ok) {
        return json;
    } else {
        const error = new Error(json.message);
        error.response = json;
        throw error;
    }
}