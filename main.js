//GPLv2 ile lisanlanmıştır lütfen LICENSE dosyasını kontrol edin. electron node modules ile uğraşmak istemiyorsanız emin-g.web.app adresinden indirebilirsiniz.
//windows kullanıyorsanız yüksek ihtimalle güvenlik uyarısı verecektir sol üstteki ek bilgiye tıklayın ve yinede çalıştıra tıklayın.

const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
