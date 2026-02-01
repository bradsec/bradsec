// ==========================================================================
// BRADSEC Terminal - Client Information & IP Trace
// ==========================================================================

// Update datetime in status bar
function updateDateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    const formatted = now.toLocaleString('en-US', options).toUpperCase();
    document.getElementById('datetime').textContent = formatted;
}

// Start datetime updates
setInterval(updateDateTime, 1000);
updateDateTime();

// ==========================================================================
// Client Info Collection
// ==========================================================================

function addInfo(infoDiv, label, value) {
    const divRow = document.createElement('div');
    divRow.classList.add('info-row');

    const infoLabel = document.createElement('span');
    infoLabel.classList.add('info-label');
    infoLabel.textContent = `${label}:`;

    const infoValue = document.createElement('span');
    infoValue.classList.add('info-value');
    infoValue.textContent = value || 'N/A';

    divRow.appendChild(infoLabel);
    divRow.appendChild(infoValue);
    infoDiv.appendChild(divRow);

    // Staggered fade-in animation
    divRow.style.opacity = '0';
    divRow.style.transform = 'translateX(-10px)';
    divRow.style.transition = 'all 0.3s ease';

    setTimeout(() => {
        divRow.style.opacity = '1';
        divRow.style.transform = 'translateX(0)';
    }, infoDiv.children.length * 50);
}

async function getClientInfo() {
    const infoDiv = document.getElementById('clientInfo');
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const colorDepth = window.screen.colorDepth;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const cpuCores = navigator.hardwareConcurrency || 'Unknown';
    const cookiesEnabled = navigator.cookieEnabled ? 'Enabled' : 'Disabled';
    const touchSupport = ('ontouchstart' in window) ? 'Yes' : 'No';
    const doNotTrack = navigator.doNotTrack === '1' ? 'Enabled' : 'Disabled';
    const referrer = document.referrer || 'Direct';

    // User Agent in its own block
    document.getElementById('uaInfo').innerHTML = `
        <div class="info-row">
            <span class="info-label">User-Agent:</span>
            <span class="info-value copyToClipboard">${userAgent}</span>
        </div>
    `;

    // Client info grid - only reliable and useful data
    addInfo(infoDiv, 'Platform', platform);
    addInfo(infoDiv, 'Language', language);
    addInfo(infoDiv, 'Screen', `${screenWidth} × ${screenHeight}`);
    addInfo(infoDiv, 'Color Depth', `${colorDepth}-bit`);
    addInfo(infoDiv, 'Timezone', timezone);
    addInfo(infoDiv, 'CPU Cores', cpuCores);
    addInfo(infoDiv, 'Cookies', cookiesEnabled);
    addInfo(infoDiv, 'Touch', touchSupport);
    addInfo(infoDiv, 'Do Not Track', doNotTrack);
    addInfo(infoDiv, 'Referrer', referrer);
}

// ==========================================================================
// IP Address Fetching
// ==========================================================================

function getIPAddress() {
    return fetch('https://ipapi.co/json')
        .then(response => response.json())
        .then((data) => {
            return ipInfoTemplate(data);
        })
        .catch(error => {
            console.error('Error:', error);
            return `
                <div class="info-row" style="border-left-color: var(--red-alert);">
                    <span class="info-label" style="color: var(--red-alert);">Error:</span>
                    <span class="info-value">Service unavailable. Try again later.</span>
                </div>
            `;
        });
}

function ipInfoTemplate(data) {
    const fields = [
        { label: 'IP Address', value: data.ip, copyable: true },
        { label: 'City', value: data.city },
        { label: 'Region', value: data.region },
        { label: 'Country', value: data.country_name },
        { label: 'Postal', value: data.postal },
        { label: 'Provider', value: data.org },
        { label: 'ASN', value: data.asn },
        { label: 'Latitude', value: data.latitude },
        { label: 'Longitude', value: data.longitude }
    ];

    let html = '<p class="system-msg">> IP trace complete<span class="blink">_</span></p>';
    html += '<div class="info-grid">';

    fields.forEach(field => {
        if (field.value) {
            const copyClass = field.copyable ? ' copyToClipboard' : '';
            html += `
                <div class="info-row">
                    <span class="info-label">${field.label}:</span>
                    <span class="info-value${copyClass}">${field.value}</span>
                </div>
            `;
        }
    });

    html += '</div>';
    return html;
}

// IP Button Handler
document.getElementById('getIp').addEventListener('click', async function() {
    const button = this;
    const btnText = button.querySelector('.btn-text');
    const originalText = btnText.textContent;

    // Disable and show loading
    button.disabled = true;
    btnText.textContent = 'TRACING';

    // Animated dots
    let dots = 0;
    const loadingInterval = setInterval(() => {
        dots = (dots + 1) % 4;
        btnText.textContent = 'TRACING' + '.'.repeat(dots);
    }, 300);

    const getIpInfo = await getIPAddress();

    clearInterval(loadingInterval);

    // Fade out button, fade in results
    button.style.transition = 'all 0.3s ease';
    button.style.opacity = '0';

    setTimeout(() => {
        button.remove();
        const ipInfoDiv = document.getElementById('ipInfo');
        ipInfoDiv.innerHTML = getIpInfo;
        ipInfoDiv.style.opacity = '0';
        ipInfoDiv.style.display = 'block';

        setTimeout(() => {
            ipInfoDiv.style.transition = 'opacity 0.5s ease';
            ipInfoDiv.style.opacity = '1';
        }, 50);
    }, 300);
});

// Initialize client info on load
getClientInfo();

// ==========================================================================
// Copy to Clipboard
// ==========================================================================

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback: Unable to copy', err);
    }

    document.body.removeChild(textArea);
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        if (event.target.matches('.copyToClipboard')) {
            const text = event.target.textContent;
            const originalText = text;

            // Visual feedback
            event.target.textContent = '[ COPIED ]';
            event.target.style.color = 'var(--green-bright)';

            setTimeout(() => {
                event.target.textContent = originalText;
                event.target.style.color = '';
            }, 1500);

            if (!navigator.clipboard) {
                fallbackCopyTextToClipboard(text);
                return;
            }

            navigator.clipboard.writeText(text).catch(err => {
                console.error('Could not copy text:', err);
            });
        }
    });
});

// ==========================================================================
// Glitch Effect
// ==========================================================================

let glitchableElements = [];

function addAndRemoveGlitchClass() {
    // Update glitchable elements
    glitchableElements = [
        ...document.querySelectorAll('.info-row'),
        ...document.querySelectorAll('.system-msg'),
        ...document.querySelectorAll('.panel-title')
    ];

    if (glitchableElements.length === 0) return;

    // Select random element
    const randomElement = glitchableElements[Math.floor(Math.random() * glitchableElements.length)];
    const originalClassName = randomElement.className;
    const originalText = randomElement.textContent;

    // Add glitch
    randomElement.classList.add('glitch');
    randomElement.setAttribute('data-text', originalText);

    // Remove after random duration
    const duration = Math.random() * 2000 + 500;
    setTimeout(() => {
        randomElement.className = originalClassName;
        randomElement.removeAttribute('data-text');
    }, duration);
}

// Trigger glitch at random intervals
function scheduleGlitch() {
    const delay = Math.random() * 8000 + 3000;
    setTimeout(() => {
        addAndRemoveGlitchClass();
        scheduleGlitch();
    }, delay);
}

// Start glitch effects after a delay
setTimeout(scheduleGlitch, 2000);

// ==========================================================================
// Boot Sequence Animation (optional enhancement)
// ==========================================================================

function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}
