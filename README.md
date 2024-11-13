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
4. 
Da biste dodali Electron u svoj projekat, koristite:
   ```bash
   npm install electron --save-dev
   ```

5. **Kreirajte osnovne fajlove za aplikaciju**
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
Izvršavanjem sledeće linije koda kreira se direktorijum `my_app` sa osnovnom strukturom Electron'a i već postavljenjm Webpack-om za automatsko bundlovanje koda i resursa.
```bash
npm init electron-app@latest my_app -- --template=webpack
cd my_app
```

### Instalacija porebnih Babel alata

Sledeća komanda instalira nekoliko paketa vezanih za Babel, alat koji se koristi za transpilaciju JavaScript koda. U kontekstu Electron aplikacije (ili bilo koje druge aplikacije koja koristi React), ovo se koristi za pretvaranje modernog JavaScript koda i JSX sintakse u kod koji je kompatibilan sa različitim pretraživačima i okruženjima (u ovom slučaju Electron). 
```bash
npm install --save-dev @babel/core @babel/preset-react babel-loader
```
  - `@babel/core` omogućava transpilaciju modernog JavaScript-a u stariji, kompatibilan kod. 
  - `@babel/preset-react` omogućava pretvaranje JSX-a (koji se koristi u React-u) u običan JavaScript. 
  - `babel-loader` povezuje Webpack sa Babel-om, omogućavajući automatsku obrada JavaScript fajlova tokom bundlovanja aplikacije.
    
### Instalacija React i React DOM

Da bi koristili Reat u Electron aplikaciji potrebno ga je instalirati sledećom komandom. 
```bash
npm install --save react react-dom
```
  - `react` omogućava kreiranje i upravljanje React komponentama.
  - `react'dom` omogućava renderovanje React komponenti u HTML-u.
update webpack frm tsx to jsx
moze index.js ili app.js se kreira fajl
u renderer.js promeni se import na ./index.jsx
### Promene u projektu pre pokretanja

Da bi uspešno pokrenuli kreirani projekat moramo izvršiti nekoliko promena.
### Promena u webpack.rules.js

Ispod već postojećeg testa dodati sledeci deo koda. Deo test: /\.jsx?$/ se može zameniti  testČ /\.tsx?$/ u slučaju da se koristi tzpescript.
```javascript
...
{
    test: /\.jsx?$/,
    use: {
      loader: "babel-loader",
      options: {
        exclude: /node_modules/,
        presets: ["@babel/preset-react"],
      },
    },
...
```

```bash
npm start
```
