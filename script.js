// KALAHAN Web Client
const API_BASE = ''; // Same origin

let currentState = {
    connected: false,
    phone: null,
    emoji: '❤️',
    autoRead: true,
    totalReacts: parseInt(localStorage.getItem('totalReacts') || '0'),
    logs: []
};

let eventSource = null;
let uptimeInterval = null;
let startTime = null;

// Initialize particles
function initParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (8 + Math.random() * 12) + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.background = ['#a855f7', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 3)];
        container.appendChild(p);
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Request WhatsApp connection
async function requestConnection() {
    const phone = document.getElementById('phoneInput').value.trim().replace(/\D/g, '');
    const btn = document.getElementById('connectBtn');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    const pairingBox = document.getElementById('pairingBox');
    const statusMsg = document.getElementById('connectStatus');

    if (phone.length < 10 || phone.length > 15) {
        showToast('رقم غير صحيح، لازم يكون من 10 لـ 15 رقم', 'error');
        return;
    }

    btn.disabled = true;
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    statusMsg.classList.add('hidden');

    try {
        const res = await fetch('/api/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        });

        const data = await res.json();

        if (data.success && data.pairingCode) {
            pairingBox.classList.remove('hidden');
            document.getElementById('pairingCode').textContent = data.pairingCode;
            startCountdown(120);
            showToast('كود الربط ظهر! ادخله في واتساب', 'success');
            
            // Start polling for connection
            pollConnection();
        } else {
            throw new Error(data.error || 'فشل في طلب الكود');
        }
    } catch (err) {
        statusMsg.textContent = err.message;
        statusMsg.className = 'status-msg error';
        statusMsg.classList.remove('hidden');
        showToast(err.message, 'error');
    } finally {
        btn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

// Countdown timer
function startCountdown(seconds) {
    const el = document.getElementById('countdown');
    let remaining = seconds;
    
    const interval = setInterval(() => {
        remaining--;
        const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
        const secs = (remaining % 60).toString().padStart(2, '0');
        el.textContent = `${mins}:${secs}`;
        
        if (remaining <= 0) {
            clearInterval(interval);
            el.textContent = 'انتهى الوقت';
            el.style.color = 'var(--danger)';
        }
    }, 1000);
}

// Poll for connection status
async function pollConnection() {
    const maxAttempts = 60;
    let attempts = 0;
    
    const check = async () => {
        if (attempts >= maxAttempts) return;
        attempts++;
        
        try {
            const res = await fetch('/api/status');
            const data = await res.json();
            
            if (data.connected) {
                currentState.connected = true;
                currentState.phone = data.phone;
                currentState.emoji = data.emoji || '❤️';
                showDashboard();
                showToast('✅ تم الربط بنجاح!', 'success');
                return;
            }
        } catch (e) {}
        
        setTimeout(check, 3000);
    };
    
    check();
}

// Show dashboard
function showDashboard() {
    document.getElementById('connectScreen').classList.remove('active');
    document.getElementById('dashboardScreen').classList.add('active');
    
    document.getElementById('phoneDisplay').textContent = currentState.phone || '---';
    document.getElementById('currentEmoji').textContent = currentState.emoji;
    document.getElementById('totalReacts').textContent = currentState.totalReacts;
    
    updateConnectionBadge();
    startUptimeCounter();
    initEventSource();
    loadLogs();
}

// Update connection badge
function updateConnectionBadge() {
    const badge = document.getElementById('connBadge');
    const text = document.getElementById('connText');
    
    if (currentState.connected) {
        badge.classList.add('connected');
        text.textContent = 'متصل';
    } else {
        badge.classList.remove('connected');
        text.textContent = 'غير متصل';
    }
}

// Uptime counter
function startUptimeCounter() {
    startTime = Date.now();
    if (uptimeInterval) clearInterval(uptimeInterval);
    
    uptimeInterval = setInterval(() => {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('uptimeDisplay').textContent = formatUptime(diff);
    }, 1000);
}

function formatUptime(s) {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts = [];
    if (d) parts.push(`${d}ي`);
    if (h) parts.push(`${h}س`);
    if (m) parts.push(`${m}د`);
    if (sec) parts.push(`${sec}ث`);
    return parts.join(' ') || '0ث';
}

// Server-Sent Events for real-time updates
function initEventSource() {
    if (eventSource) eventSource.close();
    
    eventSource = new EventSource('/api/events');
    
    eventSource.onmessage = (e) => {
        try {
            const data = JSON.parse(e.data);
            handleServerEvent(data);
        } catch (err) {}
    };
    
    eventSource.onerror = () => {
        setTimeout(initEventSource, 5000);
    };
}

function handleServerEvent(data) {
    switch (data.type) {
        case 'reaction':
            currentState.totalReacts++;
            localStorage.setItem('totalReacts', currentState.totalReacts);
            document.getElementById('totalReacts').textContent = currentState.totalReacts;
            addLog('reaction', `رياكت بـ ${data.emoji} على ستوري ${data.from}`, data.time);
            if (document.getElementById('soundToggle').checked) playBeep();
            break;
        case 'connected':
            currentState.connected = true;
            updateConnectionBadge();
            addLog('info', 'تم الاتصال بواتساب', data.time);
            showToast('🟢 اتصلنا بواتساب تاني', 'success');
            break;
        case 'disconnected':
            currentState.connected = false;
            updateConnectionBadge();
            addLog('error', 'الاتصال انقطع', data.time);
            showToast('🔴 الاتصال انقطع', 'error');
            break;
        case 'status':
            if (data.phone) {
                currentState.phone = data.phone;
                document.getElementById('phoneDisplay').textContent = data.phone;
            }
            break;
    }
}

function playBeep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    gain.gain.value = 0.05;
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
}

// Emoji selection
function setEmoji(emoji) {
    currentState.emoji = emoji;
    document.getElementById('currentEmoji').textContent = emoji;
    
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.emoji === emoji);
    });
    
    fetch('/api/emoji', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji })
    }).catch(() => {});
    
    showToast(`الإيموجي اتغير لـ ${emoji}`, 'success');
    addLog('info', `تغيير الإيموجي لـ ${emoji}`);
}

function setCustomEmoji() {
    const emoji = prompt('اكتب الإيموجي اللي عايزه:');
    if (emoji && emoji.length <= 4) {
        setEmoji(emoji);
    } else if (emoji) {
        showToast('الإيموجي طويل أوي', 'error');
    }
}

// Logs
function addLog(type, text, time = null) {
    const container = document.getElementById('logContainer');
    const empty = container.querySelector('.log-empty');
    if (empty) empty.remove();
    
    const t = time || new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const item = document.createElement('div');
    item.className = `log-item ${type}`;
    item.innerHTML = `<span class="log-time">${t}</span><span class="log-text">${text}</span>`;
    
    container.insertBefore(item, container.firstChild);
    
    // Keep max 50 logs
    while (container.children.length > 50) {
        container.removeChild(container.lastChild);
    }
    
    currentState.logs.unshift({ type, text, time: t });
    localStorage.setItem('logs', JSON.stringify(currentState.logs.slice(0, 50)));
}

function loadLogs() {
    const saved = localStorage.getItem('logs');
    if (saved) {
        currentState.logs = JSON.parse(saved);
        const container = document.getElementById('logContainer');
        container.innerHTML = '';
        currentState.logs.forEach(log => addLog(log.type, log.text, log.time));
    }
}

function clearLogs() {
    document.getElementById('logContainer').innerHTML = '<div class="log-empty">مفيش نشاط لسه...</div>';
    currentState.logs = [];
    localStorage.removeItem('logs');
}

// Settings modal
function toggleSettings() {
    document.getElementById('settingsModal').classList.toggle('hidden');
}

function toggleNotifications() {
    if (document.getElementById('notifToggle').checked) {
        Notification.requestPermission();
    }
}

function toggleAutoRead() {
    currentState.autoRead = document.getElementById('readToggle').checked;
    fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoRead: currentState.autoRead })
    }).catch(() => {});
}

// Logout
async function logout() {
    if (!confirm('متأكد انك عايز تفصل الحساب؟')) return;
    
    try {
        await fetch('/api/logout', { method: 'POST' });
    } catch (e) {}
    
    if (eventSource) eventSource.close();
    if (uptimeInterval) clearInterval(uptimeInterval);
    
    localStorage.removeItem('totalReacts');
    localStorage.removeItem('logs');
    
    location.reload();
}

// Check existing session on load
async function checkSession() {
    try {
        const res = await fetch('/api/status');
        const data = await res.json();
        
        if (data.connected) {
            currentState.connected = true;
            currentState.phone = data.phone;
            currentState.emoji = data.emoji || '❤️';
            showDashboard();
        }
    } catch (e) {
        // No existing session
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    checkSession();
    
    // Enter key on phone input
    document.getElementById('phoneInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') requestConnection();
    });
});
