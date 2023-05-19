// Client info        
function addInfo(infoDiv, label, value) {
    const divRow = document.createElement('div');
    divRow.classList.add('info-row');

    const infoLabel = document.createElement('strong');
    infoLabel.classList.add('info-label');
    infoLabel.textContent = `${label}: `;

    const infoValue = document.createElement('span');
    infoValue.classList.add('info-value', 'fade');
    infoValue.textContent = value;

    divRow.appendChild(infoLabel);
    divRow.appendChild(infoValue);
    infoDiv.appendChild(divRow);
}

    function getIPAddress() {
      return fetch('https://ipapi.co/json')
        .then(response => response.json())
        .then((data) => {
            return ipInfoTemplate(data);
        })
        .catch(error => {
          console.error('Error:', error);
          return '<div class="info-row"><strong class="info-label">IP Address: </strong><span class="info-value">Service unavailable.</div>';
        });
    }

    // Template for IP address info data.
    function ipInfoTemplate(data) {
    let resultData = "";
      resultData += '<p class="fade mb20">> Detected IP address information...</p>';
      if (data.ip) {
        var ipAddress = data.ip;
        var ipCountry = data.country_name;
        var ipCity = data.city;
        var ipRegion = data.region;
        var ipProvider = data.org;
      }
      resultData += `
        ${ipAddress ? `<div class="info-row"><strong class="info-label">IP Address: </strong><span class="info-value copyToClipboard">${ipAddress}</div>` : ""}
        ${ipCity ? `<div class="info-row"><strong class="info-label">City: </strong><span class="info-value fade">${ipCity}</span></div>` : ""}
        ${ipRegion ? `<div class="info-row"><strong class="info-label">Region: </strong><span class="info-value fade">${ipRegion}</span></div>` : ""}
        ${ipCountry ? `<div class="info-row"><strong class="info-label">Country: </strong><span class="info-value fade">${ipCountry}</span></div>` : ""}
        ${ipProvider ? `<div class="info-row"><strong class="info-label">Provider: </strong><span class="info-value fade">${ipProvider}</span></div>` : ""}`;
      return resultData;
    }

    async function getClientInfo() {
      const infoDiv = document.getElementById('clientInfo');
      const userAgent = navigator.userAgent;
      const platform = navigator.platform;
      const language = navigator.language;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const colorDepth = window.screen.colorDepth;
      const currentUrl = window.location.href;
      const referrerUrl = document.referrer;
      const cookiesEnabled = navigator.cookieEnabled;
      const onlineStatus = navigator.onLine;
      const pluginsCount = navigator.plugins.length;
      const javaEnabled = navigator.javaEnabled();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const localStorage = !!window.localStorage;
      const sessionStorage = !!window.sessionStorage;
      const touchSupport = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
      const cpuCores = navigator.hardwareConcurrency || 'N/A';
      const visibilityState = document.visibilityState;

      document.getElementById('uaInfo').innerHTML = `<div class="info-row"><strong class="info-label">User-Agent: </strong><span class="info-value copyToClipboard">${userAgent}</span></div>`;
      addInfo(infoDiv, 'Platform', platform);
      addInfo(infoDiv, 'Language', language);
      addInfo(infoDiv, 'Screen Width', screenWidth);
      addInfo(infoDiv, 'Screen Height', screenHeight);
      addInfo(infoDiv, 'Color Depth', colorDepth + ' bits');
      addInfo(infoDiv, 'Current URL', currentUrl);
      addInfo(infoDiv, 'Referrer URL', referrerUrl);
      addInfo(infoDiv, 'Cookies Enabled', cookiesEnabled);
      addInfo(infoDiv, 'Online Status', onlineStatus);
      addInfo(infoDiv, 'Number of Plugins', pluginsCount);
      addInfo(infoDiv, 'Java Enabled', javaEnabled);
      addInfo(infoDiv, 'Timezone', timezone);
      addInfo(infoDiv, 'Local Storage Support', localStorage);
      addInfo(infoDiv, 'Session Storage Support', sessionStorage);
      addInfo(infoDiv, 'Touch Support', touchSupport);
      addInfo(infoDiv, 'CPU Cores', cpuCores);
      addInfo(infoDiv, 'Page Visibility', visibilityState);
    }

    document.getElementById('getIp').addEventListener('click', async function() {
    const button = document.getElementById('getIp');
    button.disabled = true; // Disable the button

    const getIpInfo = await getIPAddress();
    document.getElementById('ipInfo').innerHTML = `${getIpInfo}`;
    button.remove();

    const ipInfoDiv = document.getElementById('ipInfo');
    ipInfoDiv.style.display = 'block';
    });

    getClientInfo();

    // Copy to clipboard
    function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Workaround for some mobile device copy to clipboard issues
  // Ensure the textarea element is not visible.
  textArea.style.position='fixed';
  textArea.style.top=0;
  textArea.style.left=0;
  textArea.style.width='2em';
  textArea.style.height='2em';
  textArea.style.padding=0;
  textArea.style.border='none';
  textArea.style.outline='none';
  textArea.style.boxShadow='none';
  textArea.style.background='transparent';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

// Main copy to clipboard function
document.addEventListener('DOMContentLoaded', (event) => {
  document.body.addEventListener('click', (event) => {
    if (event.target.matches('.copyToClipboard')) {
      const text = event.target.textContent;
      const originalText = event.target.textContent;
      event.target.textContent = 'Copied';
      setTimeout(() => {
        event.target.textContent = originalText;
      }, 1000);
      if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
      }
      navigator.clipboard.writeText(text).then(() => {}, (err) => {
        console.error('Could not copy text: ', err);
      });
    }
  });
});

// Glitch CSS functions
// Function to add and remove glitch class
function addAndRemoveGlitchClass() {
  // Update glitchableElements
  glitchableElements = [...document.getElementsByClassName('info-row'), ...document.getElementsByTagName('p')];

  // Select a random element
  var randomElement = glitchableElements[Math.floor(Math.random() * glitchableElements.length)];

  // Save the original class name
  var originalClassName = randomElement.className;
  
  // Save the original text
  var originalText = randomElement.textContent;

  // Add the glitch class
  randomElement.className += ' glitch';
  
  // Add the data-text attribute
  randomElement.setAttribute('data-text', originalText);

  // Remove the glitch class and data-text attribute after a random time between 3 to 10 seconds
  setTimeout(function() {
      randomElement.className = originalClassName;
      randomElement.removeAttribute('data-text');
  }, Math.random() * (10000 - 3000) + 3000);
}

// Call the function at random intervals between 3 to 10 seconds
setInterval(addAndRemoveGlitchClass, Math.random() * (10000 - 3000) + 3000);



