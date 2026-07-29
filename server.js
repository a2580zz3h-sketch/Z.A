/**
 * KALAHAN Server
 * Express + Baileys WhatsApp Engine
 */

const express = require('express');
const path = require('path');
const fs = require('fs-extra');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// State
let sock = null;
let saveCreds = null;
let currentPhone = null;
let currentEmoji = '❤️';
let autoRead = true;
let totalReacts = 0;
let connectionState = 'disconnected';
let eventClients = [];
let reconnectTimer = null;

const SESSION_DIR = path.join(__dirname, 'sessions', 'web_session');
const DATA_FILE = path.join(__dirname, 'data', 'session.json');

// Ensure dirs
fs.ensureDirSync(SESSION_DIR);
fs.ensureDirSync(path.join(__dirname, 'data'));

// Load saved data
try {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readJsonSync(DATA_FILE);
        currentEmoji = data.emoji || '❤️';
        totalReacts = data.totalReacts || 0;
        autoRead = data.autoRead !== false;
    }
} catch (e) {}

function saveData() {
    try {
        fs.writeJsonSync(DATA_FILE, { emoji: currentEmoji, totalReacts, autoRead, phone: currentPhone });
    } catch (e) {}
}

// Broadcast to SSE clients
function broadcastEvent(data) {
    const msg = `data: ${JSON.stringify(data)}\n\n`;
    eventClients = eventClients.filter(client => {
        try {
            client.res.write(msg);
            return true;
        } catch (e) {
            return false;
        }
    });
}

// Start WhatsApp Session
async function startWhatsApp(phoneNumber) {
    if (sock) {
        try { sock.ev.removeAllListeners(); } catch (e) {}
        try { sock.ws.close(); } catch (e) {}
        sock = null;
    }

    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    currentPhone = phoneNumber;

    try {
        const { state, saveCreds: save } = await useMultiFileAuthState(SESSION_DIR);
        saveCreds = save;
        const { version } = await fetchLatestBaileysVersion();

        sock = makeWASocket({
            version,
            auth: state,
            logger: pino({ level: 'silent' }),
            browser: Browsers.macOS('Chrome'),
            syncFullHistory: false
        });

        // Request pairing code
        if (!sock.authState.creds.registered && phoneNumber) {
            await new Promise(r => setTimeout(r, 2000));
            let cleanPhone = phoneNumber.replace(/\D/g, '');
            
            try {
                const code = await sock.requestPairingCode(cleanPhone);
                return { success: true, pairingCode: code };
            } catch (err) {
                return { success: false, error: 'فشل في توليد كود الربط: ' + err.message };
            }
        }

        return { success: true };

    } catch (err) {
        return { success: false, error: err.message };
    }
}

// Setup listeners
function setupListeners() {
    if (!sock) return;

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            connectionState = 'connected';
            saveData();
            broadcastEvent({ type: 'connected', time: new Date().toISOString() });
            console.log('[+] WhatsApp Connected');
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            
            connectionState = 'disconnected';
            broadcastEvent({ type: 'disconnected', reason: statusCode, time: new Date().toISOString() });
            console.log(`[!] WhatsApp Disconnected (Code: ${statusCode})`);

            if (shouldReconnect) {
                reconnectTimer = setTimeout(() => {
                    if (currentPhone) startWhatsApp(currentPhone);
                }, 5000);
            }
        }
    });

    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m || !m.message) return;

            const chatId = m.key?.remoteJid;
            if (chatId !== 'status@broadcast') return;

            const participant = m.key?.participant || m.participant;
            if (!participant) return;

            // Auto-read
            if (autoRead) {
                try { await sock.readMessages([m.key]); } catch (e) {}
            }

            // Auto-react
            try {
                await sock.sendMessage('status@broadcast', {
                    react: { text: currentEmoji, key: m.key }
                }, { statusJidList: [participant] });

                totalReacts++;
                saveData();

                broadcastEvent({
                    type: 'reaction',
                    emoji: currentEmoji,
                    from: participant.split('@')[0],
                    time: new Date().toLocaleTimeString('ar-EG')
                });

                console.log(`[+] Reacted with ${currentEmoji} to ${participant}`);
            } catch (err) {
                console.log('[x] Reaction failed:', err.message);
            }
        } catch (err) {
            console.log('[x] Message handler error:', err.message);
        }
    });
}

// API Routes

app.post('/api/connect', async (req, res) => {
    const { phone } = req.body;
    if (!phone || phone.length < 10) {
        return res.json({ success: false, error: 'رقم غير صحيح' });
    }

    const result = await startWhatsApp(phone);
    
    if (result.success) {
        setupListeners();
    }
    
    res.json(result);
});

app.get('/api/status', (req, res) => {
    res.json({
        connected: connectionState === 'connected',
        phone: currentPhone,
        emoji: currentEmoji,
        totalReacts,
        uptime: process.uptime()
    });
});

app.post('/api/emoji', (req, res) => {
    const { emoji } = req.body;
    if (emoji && emoji.length <= 10) {
        currentEmoji = emoji;
        saveData();
    }
    res.json({ success: true, emoji: currentEmoji });
});

app.post('/api/settings', (req, res) => {
    if (req.body.autoRead !== undefined) autoRead = req.body.autoRead;
    saveData();
    res.json({ success: true });
});

app.post('/api/logout', async (req, res) => {
    connectionState = 'disconnected';
    currentPhone = null;
    totalReacts = 0;
    
    if (sock) {
        try { sock.logout(); } catch (e) {}
        try { sock.ev.removeAllListeners(); } catch (e) {}
        sock = null;
    }
    
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    
    try {
        await fs.remove(SESSION_DIR);
        await fs.remove(DATA_FILE);
    } catch (e) {}
    
    res.json({ success: true });
});

// SSE Endpoint
app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const client = { res, id: Date.now() };
    eventClients.push(client);

    req.on('close', () => {
        eventClients = eventClients.filter(c => c.id !== client.id);
    });
});

// Restore session on startup
async function restoreSession() {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readJsonSync(DATA_FILE);
            if (data.phone && fs.existsSync(SESSION_DIR)) {
                console.log('[i] Restoring session...');
                const result = await startWhatsApp(data.phone);
                if (result.success) {
                    setupListeners();
                }
            }
        }
    } catch (e) {
        console.log('[!] Restore failed:', e.message);
    }
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[+] KALAHAN Server running on http://localhost:${PORT}`);
    restoreSession();
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n[!] Shutting down...');
    saveData();
    if (sock) try { sock.ws.close(); } catch (e) {}
    process.exit(0);
});
