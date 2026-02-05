# Decap CMS - Guida all'uso

Decap CMS è ora installato nel progetto per permettere a utenti non tecnici di modificare facilmente le biografie dei docenti.

## 🎯 Accesso al CMS

Una volta deployato il sito, il CMS sarà accessibile all'indirizzo:
```
https://tuo-sito.netlify.app/admin/
```

oppure in locale:
```
http://localhost:8080/admin/
```

## 🔐 Configurazione Autenticazione

### Opzione 1: Con Netlify (Consigliato)

1. **Deployla il sito su Netlify** (se non l'hai già fatto)

2. **Abilita Netlify Identity**:
   - Vai su Netlify Dashboard > Il tuo sito > Identity
   - Clicca "Enable Identity"

3. **Configura Identity**:
   - Identity > Settings > Registration preferences
   - Scegli "Invite only" per sicurezza
   - Settings > External providers > Add provider (opzionale: GitHub, Google, etc.)

4. **Abilita Git Gateway**:
   - Identity > Settings > Services
   - Clicca "Enable Git Gateway"

5. **Invita utenti**:
   - Identity > Invite users
   - Inserisci email degli editor
   - Gli utenti riceveranno un'email per impostare la password

### Opzione 2: Autenticazione GitHub diretta (senza Netlify)

Se non usi Netlify, devi configurare OAuth con GitHub:

1. **Crea OAuth App su GitHub**:
   - Vai su GitHub: Settings > Developer settings > OAuth Apps > New OAuth App
   - Application name: `Transpersonal Training CMS`
   - Homepage URL: `https://tuo-dominio.com`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Copia Client ID e Client Secret

2. **Aggiorna config.yml** (in `src/admin/config.yml`):
   ```yaml
   backend:
     name: github
     repo: malizia-g/transpersonaltraining
     branch: working
     # Se NON usi Netlify, rimuovi queste righe:
     # base_url: https://api.netlify.com
     # auth_endpoint: auth
   ```

3. Avrai bisogno di un server OAuth separato (es: netlify-cms-github-oauth-provider)

## 📝 Come modificare una biografia

1. **Accedi al CMS**: Vai su `/admin/` e fai login

2. **Scegli "Biografie Docenti"** dalla sidebar

3. **Seleziona una biografia** esistente o clicca "New Biografie Docenti"

4. **Modifica il contenuto**:
   - Usa Markdown per formattare il testo
   - Usa `## Titolo Sezione` per creare sezioni (es: `## Biography`, `## Credentials`, `## Experience`)
   - Supporta elenchi, grassetto, corsivo, link, etc.

5. **Salva**:
   - **Save**: Crea una bozza
   - **Publish**: Pubblica le modifiche (crea commit su GitHub)

## 📋 Struttura delle biografie

Le biografie usano Markdown con sezioni. Esempio:

```markdown
## Biography

Testo della biografia principale del docente...

## Credentials

- Titolo 1
- Titolo 2
- Certificazione XYZ

## Experience

Descrizione dell'esperienza professionale...

## Realized Projects

- Progetto A
- Progetto B

## Areas and Themes

Ambiti di specializzazione...
```

## 🚀 Build e Deploy

Dopo che un utente salva modifiche tramite il CMS:
- Le modifiche vengono committate su GitHub
- Se hai CI/CD configurato, il sito si rebuilda automaticamente
- Altrimenti, esegui manualmente: `npm run build`

## 🛠️ Comandi utili

```bash
# Build del sito
npm run build

# Serve in locale
npm start

# Il CMS sarà disponibile su:
# http://localhost:8080/admin/
```

## 📁 File e cartelle

- `src/admin/config.yml` - Configurazione del CMS
- `src/admin/index.html` - Interfaccia admin
- `src/_data/bios/` - Cartella con i file .md delle biografie
- `src/_includes/base.njk` - Include gli script di autenticazione

## ⚠️ Note importanti

- **Backup**: Tutti i cambiamenti vengono salvati su GitHub, quindi hai sempre la cronologia
- **Permessi**: Solo gli utenti invitati possono accedere al CMS
- **Branch**: Le modifiche vengono salvate sul branch `working`
- **Markdown**: Gli utenti devono conoscere la sintassi base di Markdown

## 🔗 Risorse

- [Documentazione Decap CMS](https://decapcms.org/docs/)
- [Guida Markdown](https://www.markdownguide.org/basic-syntax/)
- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/)
