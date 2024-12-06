![alt text](https://camo.githubusercontent.com/c6a5b63f3d61c2932806c52e77e0650015d890a182ebc9fc977e4d0cbe826d95/68747470733a2f2f656c656374726f6e6a732e6f72672f696d616765732f656c656374726f6e2d6c6f676f2e737667)

Kreiranje aplikacije pomoću Electron-a i React-a. Osnovne karakteristike, prednosti i mane Electron framework-a. Prikaz izgleda desktop aplikacije.

[Šta je Electron framework?](#electron-framework) <br />
[Ključne komponente](#ključne-komponente) <br />
[Procesni model](#procesni-model) <br />
[Glavni proces (Main process)](#glavni-proces-main-process) <br />
[Renderer proces (Renderer Process)](#renderer-proces-renderer-process) <br />
[Prednosti i mane](#prednosti-i-mane) <br />
[Preduslovi](#preduslovi) <br />
[Kreiranje Electron aplikacije](#kreiranje-electron-aplikacije) <br />
[Kreiranje Electron aplikacije sa React framework-om](#kreiranje-electron-aplikacije-sa-react-framework-om) <br />


# Electron Framework
Electron je besplatni softverski framework za kreiranje cross-platform desktop aplikacija koji je razvila i održava OpenJS fondacija.
  Electron je dizajniran za kreiranje desktop aplikacija korišćenjem web tehnologija, uglavnom JavaScript, HTML i CSS-a, moguće je koristiti i druge tehnologije kao sto su front-end framework. Omogućava kreiranje desktop apliakcija koje se mogu pokrenuti na Windows, masOS i Linux operativnim sistemima. Ugrađivanjem [Chromium](https://www.chromium.org/chromium-projects/)  i [Node.js](https://nodejs.org/en) u svoj binarni program Electron omogućava održavanje jedne baze koda i kreira aplikacije koje rade na više platforma.

# Ključne komponente

### Chromium

Chromium je web pretraživač otvorenog koda koji koristi Google Chrome, i to je osnovna tehnologija koju Electron koristi za prikazivanje korisničkog interfejsa (UI) aplikacije.
Electron povezuje Chromium da bi obezbedio prozor pretraživača sa punim funkcijama za prikazivanje HTML-a, CSS-a i JavaScript-a, baš kao web stranica. To znači da programeri mogu da naprave korisnički interfejs svoje aplikacije koristeći standardne web tehnologije. 

### Node.js

Node.js je JavaScript okruženje izgrađen na Chrome-ovom V8 JavaScript engin-u. Omogućava programerima da izvrše JavaScript kod na strani servera i pristupe sistemskim resursima. 
Electron uključuje ugrađenu verziju Node.js-a, omogućavajući programerima da koriste JavaScript za pristup izvornim sistemskim funkcijama, kao što su čitanje i pisanje datoteka, interakcija sa bazama podataka, upravljanje mrežnim vezama itd.

Zajedno, Chromium i Node.js omogućavaju razvoj desktop aplikacija sa web tehnologijama.

# Procesni model

Electron koristi više-procesni (multi-process) arhitektonski model koji potiče iz Chromiuma, što znači da je u tom smislu vrlo sličan modernim web pretraživačima. Ovaj pristup omogućava Electron aplikacijama veću stabilnost i efikasnost. 
Više-procesni modelu Chromiumu omogućava da svaki tab (stranica) ima svoj proces, što znači da problem u jednom tabu ne utiče na ostatak pretraživača. Electron koristi isti pristup, ali sa dva glavna procesa: **glavni proces (main process)** i  **renderer proces (renderer process)**.

### Glavni proces (Main process)

**Glavni proces** u Electron-u je odgovoran za nekoliko ključnih funkcionalnosti koje omogućavaju pravilno funkcionisanje desktop aplikacije. On pokreće Node.js okruženje, kreira i upravlja prozorima pomoću `BrowserWindow` modula i kontroliše životni ciklus aplikacije. <br />
**1. Pokreće Node.js okruženje**<br />
Glavni proces u Electron-u koristi Node.js kao runtime okruženje, što znači da je u mogućnosti da koristi sve funkcionalnosti koje nudi Node.js. To uključuje pristup lokalnim resursima računara, kao što su fajl sistem, mrežni zahtevi, baze podataka i druge sistemske funkcije.<br />
  * Node.js omogućava glavnom procesu da obavlja operacije koje zahtevaju pristup računarskim resursima, kao što su otvaranje fajlova, rad sa direktorijumima, pokretanje eksternih programa, pristup mreži i mnoge druge operacije koje nisu dozvoljene u render procesu (iz sigurnosnih razloga).<br />
  * Korišćenjem Node.js u glavnom procesu, Electron aplikacija može da koristi `npm` pakete i biblioteke koje nisu dostupne u standardnim web okruženjima, čime se omogućava rad sa lokalnim resursima i proširenje funkcionalnosti aplikacije.<br />
  
**2. Kreira i upravlja prozorima pomoću `BrowserWindow` modula**<br />
U Electron-u, prozor aplikacije je zapravo instanca klase `BrowserWindow`. Glavni proces koristi ovu klasu da kreira i kontroliše prozore (Windows) u aplikaciji.<br />
  *	**Kreiranje prozora:** Glavni proces koristi `BrowserWindow` objekat za kreiranje novih prozora aplikacije. Ovaj objekat omogućava da se postave osnovna svojstva prozora, kao što su veličina, pozicija, naslov, ponašanje pri minimizaciji ili zatvaranju itd.<br />
  * **Renderovanje sadržaja:** `BrowserWindow` učitava i prikazuje HTML, CSS i JavaScript sadržaj koji dolazi iz render procesa. U većini slučajeva, render proces učitava lokalnu HTML stranicu (ako koristite statički sadržaj) ili pokreće aplikaciju kao web aplikaciju (ako koristite dinamički generisan sadržaj iz servisa ili API-ja).<br />
  *	**Mogućnosti kontrole:** Glavni proces može da menja ponašanje prozora u bilo kom trenutku. Na primer, može da minimizuje prozor, zatvori ga, promeni njegovu veličinu, skupi ga u sistemsku traku (system tray), doda menije i obavštenja, ili izvrši bilo koju drugu operaciju.<br />
Primer kreiranja prozora u glavnom procesu:
```javascript
const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

// Funkcija za kreiranje prozora
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 890,

    webPreferences: {
      nodeIntegration: false,
    },
  });

  // Učitaj sadržaj u prozor
  mainWindow.loadURL("http://localhost:3000"); // React aplikacija
  //mainWindow.loadFile("index.html"); // Lokalna html stranica

  // Kada se prozor zatvori, postavi mainWindow na null (čišćenje resursa)
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Kada je aplikacija spremna
app.on("ready", createWindow);

// Kada su svi prozori zatvoreni, zatvori aplikaciju
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

```

**3. Kontroliše životni ciklus aplikacije**<br />
Životni ciklus aplikacije u Electron-u obuhvata sve faze tokom kojih se aplikacija pokreće, izvršava i zatvara. Glavni proces je odgovoran za praćenje i upravljanje tim fazama.<br />
  *	**Pokretanje aplikacije:** Kada korisnik pokrene aplikaciju, glavni proces je prvi koji se aktivira i započinje izvršavanje. U ovoj fazi, glavni proces kreira početne prozore i omogućava sve inicijalizacione procese.<br />
  *	**Čekanje na zatvaranje aplikacije:** Glavni proces nadgleda sve prozore i kada svi prozori budu zatvoreni, on takođe zatvara aplikaciju. Na nekim platformama (npr. macOS), aplikacija može ostati aktivna čak i kada su svi prozori zatvoreni, ali je glavni proces i dalje odgovoran za prepoznavanje kada je aplikacija spremna da se zatvori.<br />
  *	**Preporučeni postupci pri zatvaranju:** Elektron omogućava da se kod za čišćenje ili završne operacije (kao što su snimanje podataka, završavanje pozadinskih zadataka itd.) izvrši pre nego što aplikacija bude potpuno zatvorena.<br />
Kontrola životnog ciklusa aplikacije u glavnom procesu:
```javascript
const { app } = require('electron');

// Kada je aplikacija spremna, pokreće se glavni proces
app.whenReady().then(() => {
  console.log("Aplikacija je spremna!");
});

// Kada su svi prozori zatvoreni, zatvori aplikaciju
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // Na macOS-u, aplikacija ostaje u Dock-u
    app.quit();  // Izlazak iz aplikacije na Windows/Linux
  }
});


```
### Renderer proces (Renderer Process)

**Renderer proces** u Electron aplikaciji je odgovoran za renderovanje web sadržaja, kao što su HTML, CSS, i JavaScript, unutar aplikacije. Svaki prozor aplikacije pokreće svoj vlastiti renderer proces, što znači da više prozora može biti povezano sa različitim renderer procesima, a svi oni komuniciraju sa glavnim procesom putem IPC (inter-process communication) mehanizama.<br />
**1. Renderovanje web sadržaja**<br />
  *	**Renderovanje HTML, CSS i JavaScript:** Renderer proces koristi Chromium engine za renderovanje sadržaja unutar aplikacije, kao što bi to radio bilo koji web browser. Zadatak renderer procesa je da prikaže korisnički interfejs, bilo da je statički (HTML + CSS) ili dinamički (JavaScript koji komunicira sa serverom ili backendom).<br />
  *	**Izolacija i sigurnost:** Renderer proces se pokreće unutar izolovanog okruženja kako bi se povećala sigurnost. To znači da ne može direktno pristupiti sistemskim resursima ili Node.js API-jima. Da bi komunicirao sa sistemom, koristi **preload skripte** ili **IPC** mehanizme za slanje i primanje podataka između glavnog procesa i renderer procesa.<br />
  *	**Context Isolation:** Electron pruža kontekstnu izolaciju koja sprečava da renderer proces menja globalne varijable i direktno manipuliše sa kodom glavnog procesa. Ova zaštita pomaže da se aplikacije zaštite od napada kao što su Cross-Site Scripting (XSS). Preload skripte omogućavaju sigurno izlaganje API-ja.<br />
  
**2. Komunikacija sa glavnim procesom**<br />
*	**IPC (Inter-Process Communication):** Renderer proces komunicira sa glavnim procesom koristeći IPC (Inter-Process Communication). Kroz IPC, renderer proces može da šalje poruke glavnom procesu, na primer, da otvori fajl, da pošalje korisničke podatke, ili da pokrene neku sistemsku funkciju koja nije dozvoljena unutar renderer procesa.<br />
Primer IPC komunikacije:<br />
Renderer proces (JavaScript kod u aplikaciji):
```javascript
const { ipcRenderer } = require('electron');

// Poslati poruku glavnom procesu
ipcRenderer.send('pozdrav', 'Zdravo iz renderer procesa!');

// Primanje odgovora od glavnog procesa
ipcRenderer.on('odgovor', (event, message) => {
  console.log(message); // 'Zdravo od glavnog procesa!'
});
```
Glavni proces (JavaScript kod u glavnom procesu):
```javascript
const { ipcMain } = require('electron');

// Prihvatiti poruku od renderer procesa
ipcMain.on('pozdrav', (event, arg) => {
  console.log(arg); // 'Zdravo iz renderer procesa!'
  
  // Poslati odgovor nazad renderer procesu
  event.reply('odgovor', 'Zdravo od glavnog procesa!');
});
```
**3. Preload skripte i sigurnost**<br />
  *	**Preload skripta:** Renderer proces ne može direktno koristiti Node.js API-je zbog sigurnosnih razloga. Međutim, preload skripta omogućava renderer procesu da pristupi Node.js funkcijama u kontrolisanom okruženju. Preload skripte se učitavaju pre nego što bilo koji web sadržaj postane dostupan, čime se omogućava sigurna izloženost API-ja i funkcionalnosti.<br />
Primer preload skripte:
```javascript
// preload.js
const { contextBridge } = require('electron');

// Izlaganje sigurno kontrolisanih funkcionalnosti renderer procesu
contextBridge.exposeInMainWorld('myAPI', {
  desktop: true,
  sayHello: () => 'Hello from preload script!'
});
```
Renderer proces (JavaScript u aplikaciji):
```javascript
console.log(window.myAPI.desktop); // true
console.log(window.myAPI.sayHello()); // 'Hello from preload script!'
```
Na ovaj način, renderer proces može koristiti sigurno izložene funkcije, dok je pristup Node.js API-ju kontrolisan i zaštićen.<br />
**4. Sigurnost i izolacija**<br />
  *	**Kontekstna izolacija (Context Isolation):** Sa uključenom kontekstnom izolacijom (koja je podrazumevano omogućena u novijim verzijama Electron-a), renderer proces je potpuno izolovan od main procesa i sistema. Ne može direktno manipulisati globalnim varijablama ili pristupiti Node.js API-jima bez prethodnog izlaganja putem preload skripte.<br />
Ovaj model čini aplikaciju sigurnijom jer sprečava zlonamerni JavaScript kod u renderer procesu da ima direktan pristup sistemskim resursima.<br />
  *	**nodeIntegration:** Preporučuje se da nodeIntegration bude isključen u renderer procesu, jer omogućavanje nodeIntegration-a bi omogućilo renderer procesu da direktno koristi Node.js API-je, što može biti opasno, posebno kada se aplikacija povezuje sa nesigurnim web sadržajem.<br />
Primer onemogućavanja nodeIntegration:
```javascript
win = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    nodeIntegration: false, // Isključuje Node.js integraciju
    contextIsolation: true, // Omogućava izolaciju konteksta
    preload: path.join(__dirname, 'preload.js') // Specifikacija preload skripte
  }
});
```
**5. Životni ciklus renderer procesa**<br />
  *	**Pokretanje i zatvaranje prozora:** Renderer proces se pokreće kada se stvori novi prozor u glavnom procesu pomoću `BrowserWindow`. Svaki prozor ima svoj vlastiti renderer proces. Kada se prozor zatvori, renderer proces se takođe uništava, čime se oslobađaju svi resursi koji su bili povezani sa tim procesom.<br />
  *	**Rad sa više prozora:** Electron omogućava kreiranje više prozora u aplikaciji, a svaki prozor može imati svoj vlastiti renderer proces. Ovaj pristup omogućava veću fleksibilnost i performanse aplikacije.<br />

# Prednosti i mane

### Prednosti:
  * **Jedan kod za sve platforme:** aplikacija se jednom razvija i može raditi na Windowsu, macOS-u i Linux-u, čime se smanjuje potreba za održavanjem različitih kodnih baza za svaku platformu.<br />
  * **Brzi razvoj:** korišćenje web tehnologija znači da se već mogu koristiti popularne biblioteke i alati koji se koriste za web razvoj, kao što su React, Vue.js, Redux, Axios i drugi.<br />
  * **Laka distribucija:** Electron omogućava lako pakovanje i distribuciju aplikacija kao izvršnih fajlova za sve glavne platforme, što čini jednostavnijim proces postavljanja aplikacije za krajnje korisnike.<br />
  * **Pristup lokalnim resursima:** korišćenjem Node.js, Electron omogućava jednostavan pristup lokalnim resursima, poput fajl sistema, baza podataka, sistemskih funkcionalnosti itd.<br />
  * **Brza prototipizacija:** ako ste već upoznati sa React-om i web tehnologijama, možete brzo napraviti prototipove desktop aplikacija.<br />

### Mane:
  * **Veća veličina aplikacije:** Electron aplikacije obično imaju veće veličine od tradicionalnih desktop aplikacija jer moraju uključivati Chromium i Node.js runtime zajedno sa kodom. Na primer, jednostavna aplikacija može zauzimati više od 100 MB prostora. <br />
  * **Potrošnja resursa:** zbog Chromium-a, Electron aplikacije mogu koristiti više memorije i CPU resursa nego native aplikacije. Ovo je izraženo kod manjih aplikacija ili uređaja sa ograničenim resursima. <br />
  * **Nedostatak native feel-a:** iako Electron omogućava kreiranje aplikacija koje izgledaju kao desktop aplikacije, korisnički interfejs može delovati „teže“ ili „ne prirodno“, jer se oslanja na Chromium za rendering. <br />
  * **Potreba za ažuriranjem Chromium-a:** ako se koristi najnovija verzija Electron-a, možda ćete morati redovno ažurirati Chromium (i Node.js), što može doneti izazove u kompatibilnosti sa određenim bibliotekama ili funkcionalnostima. <br />
  * **Sigurnosni izazovi:** korišćenje Node.js i web tehnologija u istoj aplikaciji može dovesti do sigurnosnih izazova, naročito u kontekstu manipulacije sa sistemskim resursima. <br />
     

# Preduslovi
Pre nego što započnete sa radom u Electron-u, morate da imate sledeće alate i tehnologije instalirane na svom računaru:

**1. Node.js i npm**

Node.js je JavaScript runtime koji omogućava pokretanje JavaScript-a van web pregledača, dok npm (Node Package Manager) omogućava upravljanje paketima i bibliotekama koje koristite u projektu.
  
Da biste proverili da li su već instalirani, u komandnoj liniji pokrenite:
```bash
node -v
npm -v
```
Ako ne dobijete verziju, preuzmite Node.js sa zvanične stranice: [nodejs.org](https://nodejs.org/).
Potrebno je imati instaliran neki code editor kao što je Visual Studio code. Možete ga preuzeti sa zvanične stranice [code.visualstudio.com](https://code.visualstudio.com/).
  
**2. Pretraga i instalacija Electron-a**
  
Kada imate Node.js i npm, sledeći korak je instalacija Electron-a. Najbolje je instalirati ga kao globalni paket, tako da ga možete koristiti u bilo kom projektu. To možete uraditi pomoću sledeće komande:
```bash
npm install -g electron
```
# Kreiranje Electron aplikacije

**1.  Inicijalizujte novi projekat**

U terminalu kreirajte novi direktorijum i pređite u njega:
```bash
mkdir my-electron-app
cd my-electron-app
```
   
**2. Inicijalizujte Node.js projekat**

Pokrenite komandu da kreirate `package.json` fajl:
```bash
npm init
```
Ova komanda će vas voditi kroz nekoliko pitanja o vašem projektu. Možete pritisnuti Enter da biste prihvatili podrazumevane vrednosti.

**3. Instalirajte Electron kao zavisnost**
   
Da biste dodali Electron u svoj projekat, koristite:
```bash
npm install electron --save-dev
```

**4. Kreirajte osnovne fajlove za aplikaciju**
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
**1. Postavljanje React Aplikacije**
Pokretanjem sledeće komande kreira se React aplikacija sa nazivom `my_app`. Potrebno je preći u direktorijum u kome se nalazi aplikacija.
```bash
 npx create-react-app my_app
 cd my_app
```

**2. Instalacija Electron-a**

Sledeća komanda instalira Electron u React apliakciji.
```bash
npm install electron --save-dev
```
**3. Postavljanje Electron-a**

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

**1. Build-ovanje React aplikacije**
Sledeća komanda će build-ovati React alipkaciju i kreirati `build` direktorijum koji sadrži optimizovanu verziju aplikacije.
```bash
npm run build
```
**2. Modifikovanje electron.js fajla**
U `electron.js` promeni liniju koja učitava React aplikaciju:
 ```javascript
 mainWindow.loadURL("http://localhost:3000"); => mainWindow.loadFile(path.join(__dirname,'..' ,'build', 'index.html'));
 ```
Ovo osigurava da kada je Electron aplikacija upakovana, učitaće izgrađenu React aplikaciju iz `build` foldera.

**3. Modifikovanje `package.json`**
   U `package.json` dodaje se skripta za pokretanje Electron apliakcije sa React-om. Prvo je potrebno izvršiti sledeće komande u terminalu:
```bash
   npm install concurrently cross-env wait-on
```
  - `concurrently`:  za pokretanje više skripti paralelno.
  - `cross-env`: za postavljanje promenljivih okruženja na način koji je kompatibilan sa operativnim sistemom
  - `wait-on`: čekanje na dostupnost resursa
    
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
    
**4. Pokretanje aplikacije**
    Prvo je potrebno izvršiti sledeću komandu u terminalu:
    ```bash
    npm run electron-react
    ```
    Ova komanda vrši pokretanje Electron desktop aplikacije sa React-om.
   
### Pakovanje Electron aplikacije
Da bi upakovali Electron aplikaciju u distribucioni format (kao što su `.exe` za Windows, `.dmg` za macOS, ili `.AppImage` za Linux), možete koristiti alate kao što je `electron-builder`.

**1. Instalacija electron-builder**
Sledeća komanda vrši instalaciju electron-builder-a.
```bash
npm install electron-builder --save-dev
```
**3. Konfiguracija `electron-builder`:**
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
**4. Build-ovanje aplikaciju:**
U package.json dodati liniju:
```javascript
 "scripts": {
    ...
    "electron-pack": "electron-builder"
  },  
 ```
Sledeće komande će izvršiti izgradnju apliakcije:
```bash
npm run build
npm run electron-pack
```
Ovo će upakovati Vašu Electron aplikaciju i kreirati instalacioni fajl za platformu na kojoj se nalazite. Na primer, za macOS će kreirati `.dmg`, za Windows `.exe`, ili za Linux `.AppImage` u `dist` folderu.

**5. Distribucija Aplikacije**
Nakon što se proces izgradnje završi, možete distribuirati svoju upakovanu aplikaciju. Pakovana aplikacija će biti smeštena u `dist` direktorijumu koji ste definisali u konfiguraciji `build`.


   






