let tabCount = 1;
let activeTabId = 1;

const urlInput = document.getElementById('url-input');
const webviewsContainer = document.getElementById('webviews-container');
const tabsContainer = document.getElementById('tabs-container');

function handleUrlKey(event) {
    if (event.key === 'Enter') {
        let url = urlInput.value.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.includes('.') && !url.includes(' ')) {
                url = 'https://' + url;
            } else {
                url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
            }
        }
        const activeWebview = document.getElementById(`webview-${activeTabId}`);
        if (activeWebview) activeWebview.src = url;
    }
}

function switchTab(id) {
    activeTabId = id;
    
    // webview yok et
    document.querySelectorAll('webview').forEach(wv => wv.style.display = 'none');
    document.querySelectorAll('[id^="tab-"]').forEach(t => {
        t.classList.remove('bg-zinc-800', 'border-blue-500');
        t.classList.add('bg-zinc-900');
    });

    // seçilemi göster
    const currentWv = document.getElementById(`webview-${id}`);
    const currentTab = document.getElementById(`tab-${id}`);
    
    if (currentWv && currentTab) {
        currentWv.style.display = 'block';
        currentTab.classList.remove('bg-zinc-900');
        currentTab.classList.add('bg-zinc-800', 'border-t-2', 'border-blue-500');
        urlInput.value = currentWv.getURL() || currentWv.src;
    }
}

// yeni sekme
function createNewTab() {
    tabCount++;
    const newId = tabCount;

    // sekme butonu olustur
    const tabHTML = `
      <div id="tab-${newId}" onclick="switchTab(${newId})" class="bg-zinc-900 px-4 py-1.5 rounded-t-lg text-sm flex items-center gap-2 cursor-pointer transition">
        <span class="truncate max-w-[100px]" id="tab-title-${newId}">Yeni Sekme</span>
        <button onclick="event.stopPropagation(); closeTab(${newId})" class="hover:bg-zinc-700 rounded p-0.5 text-xs">✕</button>
      </div>
    `;
    const plusButton = tabsContainer.lastElementChild;
    plusButton.insertAdjacentHTML('beforebegin', tabHTML);

    // webview yeni
    const wv = document.createElement('webview');
    wv.id = `webview-${newId}`;
    wv.src = 'https://google.com';
    wv.className = 'w-full h-full absolute inset-0';
    wv.style.display = 'none';
    webviewsContainer.appendChild(wv);

    bindWebviewEvents(wv, newId);

    switchTab(newId);
}

// ctrl + w işlevi
function closeTab(id) {
    const tab = document.getElementById(`tab-${id}`);
    const wv = document.getElementById(`webview-${id}`);
    if (tab) tab.remove();
    if (wv) wv.remove();

    if (activeTabId === id) {
        const remainingTabs = document.querySelectorAll('[id^="tab-"]');
        if (remainingTabs.length > 0) {
            const nextId = parseInt(remainingTabs[remainingTabs.length - 1].id.replace('tab-', ''));
            switchTab(nextId);
        }
    }
}

function bindWebviewEvents(wv, id) {
    wv.addEventListener('did-start-loading', () => {
        if(id === activeTabId) urlInput.value = wv.src;
    });
    
    wv.addEventListener('page-title-updated', (e) => {
        document.getElementById(`tab-title-${id}`).innerText = e.title;
    });

    wv.addEventListener('did-navigate', (e) => {
        if (id === activeTabId) urlInput.value = e.url;
    });
}

bindWebviewEvents(document.getElementById('webview-1'), 1);

function goBack() { const wv = document.getElementById(`webview-${activeTabId}`); if(wv && wv.canGoBack()) wv.goBack(); }
function goForward() { const wv = document.getElementById(`webview-${activeTabId}`); if(wv && wv.canGoForward()) wv.goForward(); }
function reloadPage() { const wv = document.getElementById(`webview-${activeTabId}`); if(wv) wv.reload(); }
