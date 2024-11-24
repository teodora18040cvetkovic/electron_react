![alt text](https://camo.githubusercontent.com/c6a5b63f3d61c2932806c52e77e0650015d890a182ebc9fc977e4d0cbe826d95/68747470733a2f2f656c656374726f6e6a732e6f72672f696d616765732f656c656374726f6e2d6c6f676f2e737667)

Electron je besplatni softverski framework za kreiranje cross-platform desktop aplikacija koji je razvila i održava OpenJS fondacija.
  Electron je dizajniran za kreiranje desktop aplikacija korišćenjem web tehnologija, uglavnom JavaScript, HTML i CSS-a, moguće je koristiti i druge tehnologije kao sto su front-end framework. Omogućava kreiranje desktop apliakcija koje se mogu pokrenuti na Windows, masOS i Linkux operativnim sistemima. Ugrađivanjem [Chromium](https://www.chromium.org/chromium-projects/)  i [Node.js](https://nodejs.org/en) u svoj binarni program Electron omogućava da održavate jednu bazu koda i kreira aplikacije koje rade na više platforma.

# Preduslovi

Pre nego što započnete sa radom u Electron-u, morate da imate sledeće alate i tehnologije instalirane na svom računaru:

#### 1. **Node.js i npm**

Node.js je JavaScript runtime koji omogućava pokretanje JavaScript-a van web pregledača, dok npm (Node Package Manager) omogućava upravljanje paketima i bibliotekama koje koristite u projektu.
  
Da biste proverili da li su već instalirani, u komandnoj liniji pokrenite:
  ```bash
  node -v
  npm -v
  ```
Ako ne dobijete verziju, preuzmite Node.js sa zvanične stranice: [nodejs.org](https://nodejs.org/).
Potrebno je imati instaliran neki code editor kao što je Visual Studio code. Možete ga preuzeti sa zvanične stranice [code.visualstudio.com](https://code.visualstudio.com/).
  
#### 2. **Pretraga i instalacija Electron-a**
  
Kada imate Node.js i npm, sledeći korak je instalacija Electron-a. Najbolje je instalirati ga kao globalni paket, tako da ga možete koristiti u bilo kom projektu. To možete uraditi pomoću sledeće komande:
  ```bash
  npm install -g electron
  ```

# Kreiranje Electron aplikacije

1. **Inicijalizujte novi projekat**

U terminalu kreirajte novi direktorijum i pređite u njega:
   ```bash
   mkdir my-electron-app
   cd my-electron-app
   ```
   
2. **Inicijalizujte Node.js projekat**

Pokrenite komandu da kreirate `package.json` fajl:
   ```bash
   npm init
   ```
Ova komanda će vas voditi kroz nekoliko pitanja o vašem projektu. Možete pritisnuti Enter da biste prihvatili podrazumevane vrednosti.

3. **Instalirajte Electron kao zavisnost**
   
Da biste dodali Electron u svoj projekat, koristite:
   ```bash
   npm install electron --save-dev
   ```

4. **Kreirajte osnovne fajlove za aplikaciju**
U glavnom direktorijumu vašeg projekta, napravite fajlove kao što su:
  - `index.html`: HTML fajl koji će se koristiti za interfejs aplikacije.  
  - `main.js`: JavaScript fajl koji će sadržati glavni proces vaše aplikacije.

**Primer `index.html` fajla:**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Hello Electron</title>
   </head>
   <body>
     <h1>Hello, Electron!</h1>
     <p>This is your first Electron app.</p>
   </body>
   </html>
   ```

**Primer `main.js` fajla:**

Sledeća linija koda vrši pozivanje modula iz Electron biblioteke.
   ```javascript
   const { app, BrowserWindow } = require('electron')
   ```
   - `app`: Ovaj objekat se koristi za kontrolu životnog ciklusa aplikacije (kao što su pokretanje i zatvaranje aplikacije).
   - `BrowserWindow`: Ovaj objekat je korišćen za kreiranje novih prozora u aplikaciji. Svaka instanca BrowserWindow predstavlja jedan prozor (window) u aplikaciji.

### Funkcija za kreiranje prozora
  ```javascript
   function createWindow() {
     const win = new BrowserWindow({
       width: 800,
       height: 600,
       webPreferences: {
         nodeIntegration: true
       }
     })

     win.loadFile('index.html')
   }
   ```
Funkcija `createWindow`, koristi se za kreiranje novog prozora aplikacije. 
  -	Kreiranje prozora: new BrowserWindow({...}) kreira novi prozor sa određenim opcijama.
      -	`width: 800`: Širina prozora je 800 piksela.
      -	`height: 600`: Visina prozora je 600 piksela.
      - `webPreferences`: Ovaj objekat sadrži dodatne opcije vezane za internetske stranice učitane unutar prozora.
          - `nodeIntegration: true`: Omogućava korišćenje Node.js funkcionalnosti direktno u renderujućem procesu (HTML/JS stranici unutar prozora). Ovo znači da možete koristiti Node.js API-e (npr. fs, path, i druge funkcionalnosti) direktno u vašem front-end kodu. Međutim, ovo može predstavljati sigurnosni rizik, pa se u modernim aplikacijama obično koristi `contextBridge` i `preload` skripte za bolju sigurnost.  
- Učitavanje HTML fajla: `win.loadFile('index.html')` govori Electron-u da učita HTML fajl sa imenom `index.html` u novom prozoru. Ovo je osnovni sadržaj koji će biti prikazan u prozoru.

### Pokretanje aplikacije
Ova linija znači da će se funkcija createWindow() pozvati čim aplikacija bude spremna za rad. app.whenReady() je promise koji se rešava kada Electron završi sa inicijalizacijom i aplikacija je spremna da pokrene GUI (grafički interfejs). Ovo je idealno mesto da se pokrene kreiranje prvog prozora.
```javascript
   app.whenReady().then(createWindow)
```

### Zatvaranje aplikacije
```javascript 
     app.on('window-all-closed', () => {
       if (process.platform !== 'darwin') {
         app.quit()
       }
     })
```
# Kreiranje Electron aplikacije sa React framework-om
1. **Postavljanje React Aplikacije**
Pokretanjem sledeće komande kreira se React aplikacija sa nazivom `my_app`. Potrebno je preći u direktorijum u kome se nalazi aplikacija.
 ```bash
   npx create-react-app my_app
   cd my_app
  ```

2. **Instalacija Electron-a**

Sledeća komanda instalira Electron u React apliakciji.
```bash
  npm install electron --save-dev
```
3. **Postavljanje Electron-a**

U public direktorijumu koji je kreiran prilokom kreiranja React aplikacije potrebno je kreirati fajl: `electron.js`. 

```javascript
// electron.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
    nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'), // opcionalno, za komunikaciju između React-a i Electron-a
    },
  });
  
  mainWindow.loadURL('http://localhost:3000'); // React razvojni server
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  }
  
  app.on('ready', createWindow);
  
  app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
  });
  
  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
  }
});
```
Ako želite da postignete komunikaciju između Vaše React aplikacije (renderer proces) i Electron-a (main proces), možete postaviti `preload.js` skriptu.
```javascript
// preload.js
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  doSomething: () => console.log('Ovo je funkcija koju izlažemo React-u'),
});
```
Ova skripta izlaže specifične Electron funkcionalnosti React renderer procesu. U React-u, možete koristiti `window.electron` da pristupite izloženim funkcijama.

### Priprema aplikacije za pokretanje

1. **Build-ovanje React aplikacije**
Sledeća komanda će build-ovati React alipkaciju i kreirati `build` direktorijum koji sadrži optimizovanu verziju aplikacije.
```bash
npm run build
```
2. **Modifikovanje electron.js fajla**
U `electron.js` promeni liniju koja učitava React aplikaciju:
 ```javascript
 mainWindow.loadURL("http://localhost:3000"); => mainWindow.loadFile(path.join(__dirname,'..' ,'build', 'index.html'));
 ```
Ovo osigurava da kada je Electron aplikacija upakovana, učitaće izgrađenu React aplikaciju iz `build` foldera.

3. **Modifikovanje `package.json`**
   U `package.json` dodaje se skripta za pokretanje Electron apliakcije sa React-om. Prvo je potrebno izvršiti sledeće komande u terminalu:
```bash
   npm install concurrently cross-env wait-on
```
  - `concurrently`:  za pokretanje više skripti paralelno.
  - `cross-env`: za postavljanje promenljivih okruženja na način koji je kompatibilan sa operativnim sistemom
  - `wait-on`: čekanje na dostupnost resursa
  - 
Zatim je potrebno dadati sledeću liniju koda:
 ```javascript
 "scripts": {
    ...
    "electron-react": "concurrently \"cross-env BROWSER=none npm start\" \"wait-on http://localhost:3000 && electron .\"",
  },  
 ```
  - `concurrently`: pokreće dve komande u isto vreme.
  - `"cross-env BROWSER=none npm start"`: pokreće React razvojni server (kroz `npm start`), ali bez otvaranja preglednika (`BROWSER=none`).
  - `"wait-on http://localhost:3000 && electron ."`: čeka da React server bude dostupan na `http://localhost:3000`, a zatim pokreće Electron aplikaciju koja učitava React aplikaciju.
    
4. **Pokretanje aplikacije**
    Prvo je potrebno izvršiti sledeću komandu u terminalu:
    ```bash
    npm run electron-react
    ```
    Ova komanda vrši pokretanje Electron desktop aplikacije sa React-om.
   
### Pakovanje Electron aplikacije
Da bi upakovali Electron aplikaciju u distribucioni format (kao što su `.exe` za Windows, `.dmg` za macOS, ili `.AppImage` za Linux), možete koristiti alate kao što je `electron-builder`.

1. **Instalacija electron-builder**
Sledeća komanda vrši instalaciju electron-builder-a.
```bash
npm install electron-builder --save-dev
```
3. **Konfiguracija `electron-builder`:**
Potrebno je dodati `build` konfiguraciju u `package.json`:
```json
...
"build": {
  "appId": "com.example.myapp",
  "productName": "My Electron App",
  "files": [
    "build/**/*",
    "public/electron.js"
  ],
  "directories": {
    "output": "dist"
  },
  "mac": {
    "target": "dmg"
  },
  "win": {
    "target": "nsis"
  },
  "linux": {
    "target": "AppImage"
  }
}
```
Ova konfiguracija će odrediti kako treba da se pakuje aplikacija, koje platforme treba da se izgrade i gde treba da ide izlaz.
3. **Build-ovanje aplikaciju:**
Sledeće komande će izvršiti izgradnju apliakcije:
```bash
npm run build
npm run electron-builder
```
Ovo će upakovati Vašu Electron aplikaciju i kreirati instalacioni fajl za platformu na kojoj se nalazite. Na primer, za macOS će kreirati `.dmg`, za Windows `.exe`, ili za Linux `.AppImage` u `dist` folderu.

4. **Distribucija Aplikacije**
Nakon što se proces izgradnje završi, možete distribuirati svoju upakovanu aplikaciju. Pakovana aplikacija će biti smeštena u `dist` direktorijumu koji ste definisali u konfiguraciji `build`.


   






