# CMS con GitHub Backend — Confronto

## Il problema
Serve un modo per editare contenuti (bio docenti, corsi, pagine) senza toccare codice.
OAuth è un ostacolo: cerchiamo soluzioni che non richiedano di gestirlo.

## Opzioni senza OAuth

| Soluzione | OAuth? | Complessità setup | Chi edita |
|-----------|--------|-------------------|-----------|
| **Pipeline GAS** | No | Media (GAS + Action) | Chiunque ha accesso al Google Doc |
| **Pages CMS** | Gestito da loro | Bassissima | Chi ha account GitHub |
| **Sveltia CMS** | OAuth App GitHub (no server) | Bassa | Chi ha account GitHub |
| **Decap CMS** | Serve server OAuth | Alta | Chi ha account GitHub |
| **Keystatic** | Keystatic Cloud (no server) | Media | Chi ha account GitHub |

## Keystatic vs Pages CMS — Confronto dettagliato

| | **Keystatic** | **Pages CMS** |
|---|---|---|
| **Cos'è** | CMS strutturato con schema tipizzato, sviluppato da Thinkmill | CMS leggero che edita file direttamente nel repo, open source |
| **Setup** | Installi pacchetto npm, definisci schema in `keystatic.config.ts` | Aggiungi un `.pages.yml` nel repo, vai su pagescms.org |
| **Tempo di setup** | 30-60 min | 5-10 min |
| **Auth** | GitHub App (Keystatic Cloud free) oppure token personale | Gestito interamente da loro (login con GitHub) |
| **Hosting UI** | Keystatic Cloud oppure self-host (route nella tua app) | Hosted su pagescms.org |
| **Editing** | UI ricca: form strutturati, campi tipizzati, relazioni tra contenuti, editor rich-text | UI semplice: editor Markdown, editor JSON/YAML, upload media |
| **Schema** | Definito in codice TypeScript — collections, singletons, campi custom | Definito in `.pages.yml` — indica quali file/cartelle sono editabili |
| **Validazione** | Forte: campi obbligatori, tipi, select, relazioni | Basica: segue la struttura del file |
| **Immagini** | Upload e gestione integrata, campi image tipizzati | Upload nella cartella del repo, gestione basica |
| **Markdown** | Editor WYSIWYG integrato con toolbar | Editor Markdown con preview |
| **Supporto SSG** | Ottimo per Astro, Next.js. Eleventy supportato ma non ufficiale | Agnostico — lavora su file, non gli importa del SSG |
| **Commit** | Committa su GitHub via API (branch, PR, o diretto) | Committa su GitHub via API (diretto su branch) |
| **Costo** | Free (cloud e self-host) | Free e open source |
| **Dipendenze** | Aggiunge pacchetti npm al progetto | Zero dipendenze nel progetto (solo un file YAML) |
| **Lock-in** | Medio: schema in codice, ma i file generati sono standard .md/.json | Zero: solo un `.pages.yml`, rimovibile in 2 secondi |
| **Maturità** | Stabile, team dedicato (Thinkmill), buoni docs | Più giovane, community più piccola, ma funzionale |

## Per il nostro caso (Eleventy + bio docenti)

| Criterio | Vincitore |
|----------|-----------|
| Velocità di setup | Pages CMS — 5 minuti |
| Zero dipendenze nel progetto | Pages CMS — solo un file YAML |
| Esperienza editing non-tecnici | Keystatic — UI più guidata |
| Struttura bio con sezioni | Keystatic — campi strutturati per sezione |
| Manutenzione a lungo termine | Pages CMS — nulla da mantenere |
| Estensibilità futura (corsi, pagine) | Keystatic — schema tipizzato cresce meglio |
| Provarlo subito senza toccare codice | Pages CMS |

## Raccomandazione

Partire con **Pages CMS** (5 min setup, zero rischi).
Se servisse più struttura/validazione, migrare a **Keystatic**.
Entrambi lavorano su file nel repo, passaggio indolore.

Esempio `.pages.yml`:
```yaml
content:
  - name: teachers
    label: Teacher Bios
    path: src/_data/bios
    filename: "{slug}.md"
    type: document
  - name: coreTeachers
    label: Core Teachers Data
    path: src/_data
    filename: coreTeachers.json
    type: file
  - name: guestTeachers
    label: Guest Teachers Data
    path: src/_data
    filename: guestTeachers.json
    type: file
```

## Sveltia CMS — Nota
Drop-in replacement di Decap/Netlify CMS. Abbiamo già la config in `src/admin/`.
Basta cambiare il tag `<script>` e fornisce proxy auth gratuito senza server.
Potrebbe essere un'alternativa intermedia.
