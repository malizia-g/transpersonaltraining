# transpersonaltraining

## Sfondo natura (immagine + video)

- Immagine di fallback: l'hero usa una foto natura royalty-free da Unsplash (foresta/rigagnolo).
- Video opzionale: è predisposto un `<video>` in [index.html](index.html) che si attiva se presente un URL valido. Per impostare un video personalizzato e con licenza libera, puoi definire `window.NATURE_VIDEO_URL` (ad es. in [script.js](script.js)):

```html
<script>
	// Sostituisci con un tuo video MP4 (muted, loop, playsinline)
	window.NATURE_VIDEO_URL = 'https://www.w3schools.com/howto/rain.mp4';
</script>
```

Il video è nascosto se l’utente preferisce “ridurre movimento” (prefers-reduced-motion) o se non disponibile; in quel caso resta l’immagine.

### Fonti consigliate (licenze libere)
- Coverr (video): https://coverr.co/
- Pexels (video): https://www.pexels.com/videos/
- Pixabay (video): https://pixabay.com/videos/
- Unsplash (immagini): https://unsplash.com/

Assicurati che l’asset scelto sia utilizzabile secondo la relativa licenza.

## Anteprima locale

Avvia un server statico e apri il sito:

```bash
python3 -m http.server 8000
# poi apri http://localhost:8000
```
