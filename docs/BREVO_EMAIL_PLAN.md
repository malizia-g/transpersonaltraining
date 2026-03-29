# Piano: Integrazione Email Brevo da Google Spreadsheet

## Sommario

Aggiungere il menu "📧 Email Tools" al Google Spreadsheet del curriculum. Lo script analizza gli eventi in programma, costruisce un'email HTML e la invia tramite Brevo API. Conforme al GDPR con autenticazione del dominio e link di disiscrizione.

## Architettura

```
Spreadsheet → Apps Script (parse events + build HTML) → Brevo API → Email con SPF/DKIM
```

## Prerequisiti (Pablo)

1. **Account Brevo** — gratuito, 300 email/giorno ([brevo.com](https://www.brevo.com))
2. **Verificare email mittente** + configurazione DNS dominio (DKIM / SPF / DMARC)
3. **Aggiungere `BREVO_API_KEY`** nelle Script Properties del progetto Apps Script

## Fasi di Implementazione

### Fase 1 — Core

1. **Tab Contatti** nel foglio di calcolo
   - Colonne: Name, Email, Level, Status, Consent Date
   - Gestione consenso GDPR integrata

2. **Template email HTML** per eventi in programma
   - Parsing degli eventi dal foglio Schedule / Lectures
   - Layout responsive, compatibile con i principali client email

3. **Funzione invio Brevo API**
   - Integrazione via `UrlFetchApp.fetch` verso `https://api.brevo.com/v3/smtp/email`
   - Gestione errori e logging

4. **Menu Google Sheets**: "📧 Email Tools"
   - Send Schedule (prossimi eventi del programma)
   - Send to Level (invio filtrato per livello L1/L2/L3)
   - Test Email (invio di prova al proprio indirizzo)
   - Manage Contacts (gestione lista contatti)

### Fase 2 — Template e Automazione

5. **Template multipli**
   - Schedule Digest (riepilogo settimanale eventi)
   - Lecture Reminder (promemoria 24h prima della lezione)
   - Announcement (comunicazioni generali)

6. **Trigger automatici** (opzionali)
   - Digest settimanale automatico
   - Reminder 24h prima delle lezioni

## Struttura Dati Eventi

### Schedule Events
```json
{
  "date": "range (es. 20-22 June 2025)",
  "facilitator": "nome",
  "title": "titolo evento",
  "description": "descrizione",
  "module": "modulo",
  "location": "luogo",
  "type1": "tipo",
  "type2": "tipo"
}
```

### Lecture Events
```json
{
  "date": "singola data",
  "module": "modulo",
  "title": "titolo",
  "description": "descrizione",
  "teacher1": "docente",
  "teacher2": "docente (opzionale)",
  "startHour": "ora inizio",
  "finishHour": "ora fine",
  "videoLink": "link (opzionale)"
}
```

## Conformità GDPR

- Tracciamento del consenso con data nel tab Contatti
- Link di disiscrizione in ogni email
- Server Brevo nell'UE
- Nessun dato trasferito fuori dall'UE

## Verifica

- [ ] Invio email di test a sé stessi
- [ ] Controllare dashboard Brevo per lo stato di consegna
- [ ] Verificare funzionamento link di disiscrizione
- [ ] Testare rendering su Gmail, Outlook, Apple Mail
- [ ] Controllare che SPF/DKIM/DMARC siano configurati correttamente
