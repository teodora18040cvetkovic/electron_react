![alt text](https://camo.githubusercontent.com/c6a5b63f3d61c2932806c52e77e0650015d890a182ebc9fc977e4d0cbe826d95/68747470733a2f2f656c656374726f6e6a732e6f72672f696d616765732f656c656374726f6e2d6c6f676f2e737667)

Kreiranje aplikacije pomoću Electron-a i React-a. Osnovne karakteristike, prednosti i mane Electron framework-a. Prikaz izgleda desktop aplikacije.

[Šta je Electron framework?](#electron-framework) <br />
[Ključne komponente](#ključne-komponente) <br />
[Procesni model](#procesni-model) <br />
    [Glavni proces (Main porcess)](#glavni-proces-main-process) <br />
    [Renderer proces (Renderer Process)](#renderer-proces-renderer-process) <br />
[Bezbednost](#bezbednost) <br />
[Prednosti i mane](#prednosti-i-mane) <br />
[Preduslovi](#preduslovi) <br />
[Kreiranje Electron aplikacije](#kreiranje-electron-aplikacije) <br />
[Kreiranje Electron aplikacije sa React framework-om](#kreiranje-electron-aplikacije-sa-react-framework-om) <br />


# Electron Framework
Electron je besplatni softverski framework za kreiranje cross-platform desktop aplikacija koji je razvila i održava OpenJS fondacija.
  Electron je dizajniran za kreiranje desktop aplikacija korišćenjem web tehnologija, uglavnom JavaScript, HTML i CSS-a, moguće je koristiti i druge tehnologije kao sto su front-end framework. Omogućava kreiranje desktop apliakcija koje se mogu pokrenuti na Windows, masOS i Linkux operativnim sistemima. Ugrađivanjem [Chromium](https://www.chromium.org/chromium-projects/)  i [Node.js](https://nodejs.org/en) u svoj binarni program Electron omogućava da održavate jednu bazu koda i kreira aplikacije koje rade na više platforma.

# Ključne komponente

**Chromium**

Chromium je web pretraživač otvorenog koda koji koristi Google Chrome, i to je osnovna tehnologija koju Electron koristi za prikazivanje i prikaz korisničkog interfejsa (UI) aplikacije.
Electron povezuje Chromium da bi obezbedio prozor pretraživača sa punim funkcijama za prikazivanje HTML-a, CSS-a i JavaScript-a, baš kao web stranica. To znači da programeri mogu da naprave korisnički interfejs svoje aplikacije koristeći standardne web tehnologije. 

**Node.js**

Node.js je je JavaScript okruženje izgrađen na Chrome-ovom V8 JavaScript engin-u. Omogućava programerima da izvrše JavaScript kod na strani servera i pristupe sistemskim resursima. 
Electron uključuje ugrađenu verziju Node.js-a, omogućavajući programerima da koriste JavaScript za pristup izvornim sistemskim funkcijama, kao što su čitanje i pisanje datoteka, interakcija sa bazama podataka, upravljanje mrežnim vezama itd.

Zajedno, Chromium i Node.js omogućavaju razvoj desktop aplikacija sa web tehnologijama.

# Procesni model
Electron koristi više-procesni (multi-process) arhitektonski model koji potiče iz Chromiuma, što znači da je u tom smislu vrlo sličan modernim web pretraživačima. Ovaj pristup omogućava Electron aplikacijama veću stabilnost i efikasnost. 
Više-procesni modelu Chromiumu omogućava da svaki tab (stranica) ima svoj proces, što znači da problem u jednom tabu ne utiče na ostatak pretraživača. Electron koristi isti pristup, ali sa dva glavna procesa: glavni proces (main process) i  renderer proces (renderer process).

### Glavni proces (Main porcess)

**Glavni proces** je jedinstveni ulazni proces za svaku Electron aplikaciju. On se pokreće u **Node.js** okruženju, što znači da može koristiti sve Node.js module i API-je.

#### Upravljanje Prozorima:
Glavni proces je odgovoran za kreiranje i upravljanje aplikacijskim prozorima pomoću **`BrowserWindow`** modula. Svaki **BrowserWindow** stvara novi prozor u kojem se učitava web stranica u posebnom renderer procesu.

**Primer koda**:
```javascript
const { BrowserWindow } = require('electron');
const win = new BrowserWindow({ width: 800, height: 600 });
win.loadURL('https://github.com');
```
  
  - Svaki prozor (BrowserWindow) pokreće svoj **renderer proces**.
  - Glavni proces može komunicirati s renderer procesom putem objekta `webContents`.

#### Životni ciklus aplikacije:
Glavni proces takođe kontroliše životni ciklus aplikacije, pomoću **`app`** modula. Na primer, možete dodati logiku da aplikacija automatski zatvori kada svi prozori budu zatvoreni (osim na macOS-u).

**Primer**:
```javascript
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

#### Korišćenje Nativnih API-ja:
Glavni proces omogućava pristup nativnim funkcijama operativnog sistema, kao što su **meni**, **dijalozi** i **ikone u sistemskoj traci**.

### Renderer proces (Renderer Process)

**Renderer proces** se pokreće za svaki prozor aplikacije i odgovoran je za renderovanje web sadržaja. On koristi **Chromium** engine, pa se kod u ovom procesu ponaša kao običan web kod (HTML, CSS, JavaScript).

  - Renderer procesi **nemaju pristup Node.js API-jima** direktno.
  - Za interakciju s Node.js funkcionalnostima, koristi se **preload skripta**.

#### Preload Skripte:
**Preload skripta** se pokreće pre nego što se web sadržaj učita u renderer procesu. Ona omogućava renderer procesu da koristi Node.js API-je, ali na siguran način.

**Primer**:
```javascript
const { contextBridge } = require('electron');
contextBridge.exposeInMainWorld('myAPI', {
  desktop: true
});
```

Renderer proces može pristupiti ovom API-ju putem **`window.myAPI`**.

#### Kontekstna izolacija:
Zbog **kontekstne izolacije**, preload skripta ne može direktno menjati globalne promenljive renderer procesa. Umesto toga, koristi se **`contextBridge`** da bi se sigurno izložile funkcionalnosti.

# Bezbednost

Prepopruke za sigurnost: uključavanje `contextIsolation` i sigurno izlaganje funkcionalnosti kroz `contextBridge`.

### **`contextIsolation`**

`contextIsolation` je sigurnosna opcija koja razdvaja dva JavaScript okruženja u Electronu: ono u **rendererskom procesu** (UI) i ono u **glavnom procesu** (Node.js). Ako je `contextIsolation` uključen, kod u rendererskom procesu ne može direktno da koristi Node.js funkcije, kao što su čitanje fajlova ili pokretanje komandi.

Bez ove izolacije, zlonamerni kod u rendererskom procesu može da dobije pristup kritičnim funkcijama sistema (npr. pristup fajlovima), što je vrlo opasno. Korišćenjem `contextIsolation`, omogućavaš sigurniji rad aplikacije.

U konfiguraciji `BrowserWindow`, postavite `contextIsolation: true`, čime omogućavate izolaciju između dva okruženja.

```javascript
const win = new BrowserWindow({
       webPreferences: {
         contextIsolation: true,
         preload: path.join(__dirname, 'preload.js'),  // Preload skripta koja sigurno povezuje renderer sa glavnim procesom
       }
     });
```
### **`contextBridge`**
`contextBridge` je alat koji omogućava sigurno izlaganje funkcionalnosti iz glavnog procesa (Node.js) prema rendererskom procesu (UI). Kada je `contextIsolation` uključen, renderer ne može direktno pristupiti funkcijama glavnog procesa, ali uz pomoć `contextBridge`, sigurno može koristiti određene funkcionalnosti, kao što je čitanje fajlova.

Bez `contextBridge`, renderer proces bi mogao pokušati da koristi opasne funkcije koje ne želimo da izložimo, što bi moglo ugroziti sigurnost aplikacije. Korišćenjem `contextBridge`, ta funkcionalnost se daje samo onima koji su potrebni, a sve ostalo je zaštićeno.

U **`preload.js`** fajlu, koristiš `contextBridge` da izložiš sigurne funkcije za renderer, bez da mu dozvoliš pristup celokupnom Node.js okruženju.

**Primer:**
 ```javascript
     // preload.js
     const { contextBridge, ipcRenderer } = require('electron');

     // Sigurno izlažemo funkcionalnost za čitanje fajlova
     contextBridge.exposeInMainWorld('safeAPI', {
       readFile: (path) => ipcRenderer.invoke('read-file', path)  // Pozivanje funkcije u glavnom procesu
     });
     ```

     Na strani **main.js** (glavni proces), osluškuješ pozive i vraćaš podatke:

     ```javascript
     // main.js
     const { ipcMain, app, BrowserWindow } = require('electron');
     const fs = require('fs');

     ipcMain.handle('read-file', (event, path) => {
       return fs.promises.readFile(path, 'utf-8');  // Čitanje fajla
     });

     app.whenReady().then(() => {
       const win = new BrowserWindow({
         webPreferences: {
           preload: path.join(__dirname, 'preload.js')
         }
       });
       win.loadURL('index.html');
     });
 ```

- **`contextIsolation`** štiti aplikaciju tako što sprečava renderer da direktno koristi opasne funkcije Node.js.
- **`contextBridge`** omogućava sigurno izlaganje funkcionalnosti rendererskom procesu, bez otkrivanja opasnih API-ja.

Ova dva mehanizma zajedno omogućavaju da vaša aplikacija bude sigurna, dok istovremeno pruža potrebnu funkcionalnost za korisnički interfejs.

# Prednosti i mane

**Prednosti:** <br />
        -Jedna baza koda za više platformi (Windows, macOS, Linux). <br />
        -Upotreba web tehnologija (HTML, CSS, JavaScript) što omogućava lakši prelazak sa web developmenta na desktop aplikacije. <br />
        -Velika zajednica i ekosistem alata, pluginova i biblioteka. <br />
        -Brza izrada prototipova zahvaljujući jednostavnom okruženju. <br />
**Mane:**  <br />
        -Visoka potrošnja resursa: Svaka aplikacija dolazi sa sopstvenim Chromium i Node.js instancama, što povećava memorijsku i procesorsku potrošnju.<br />
        -Performanse: Elektron aplikacije mogu biti sporije u odnosu na nativne aplikacije zbog dodatnog sloja Chromium-a.<br />
        -Veći fajlovi: Aplikacije mogu imati veće veličine instalacija zbog uključenih zavisnosti kao što su Chromium i Node.js.<br />


# Preduslovi
Pre nego što započnete sa radom u Electron-u, morate da imate sledeće alate i tehnologije instalirane na svom računaru:

1. **Node.js i npm**

Node.js je JavaScript runtime koji omogućava pokretanje JavaScript-a van web pregledača, dok npm (Node Package Manager) omogućava upravljanje paketima i bibliotekama koje koristite u projektu.
  
Da biste proverili da li su već instalirani, u komandnoj liniji pokrenite:
  ```bash
  node -v
  npm -v
  ```
Ako ne dobijete verziju, preuzmite Node.js sa zvanične stranice: [nodejs.org](https://nodejs.org/).
Potrebno je imati instaliran neki code editor kao što je Visual Studio code. Možete ga preuzeti sa zvanične stranice [code.visualstudio.com](https://code.visualstudio.com/).
  
2. **Pretraga i instalacija Electron-a**
  
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


   






