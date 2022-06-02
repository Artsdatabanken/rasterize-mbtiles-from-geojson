# build

Krever en fil polygon.4326.geojson i samme katalog - trolig den samme som LA_4326.geojson? Trolig output fra landskap-kart-lastejobb?

Installere pakker med npm og kjør js fila med node.

```bash
npm install

node buildtileset.js
```

Output : raster_indexed.3857.mbtiles skal trolig kopieres ut i katalogstrukturen..

```bash
scp raster_indexed.3857.mbtiles grunnkart@hydra:~/tilesdata/Natur_i_Norge/Landskap/Typeinndeling
```
