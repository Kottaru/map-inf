// Inicializa mapa
const map = L.map('map').setView([0, 0], 13);

// Tile layer (mapa base)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Detecta localização do usuário
navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  map.setView([lat, lon], 14);
  L.marker([lat, lon]).addTo(map).bindPopup("📍 Você está aqui").openPopup();
}, () => {
  alert("Não foi possível obter sua localização.");
});

// Busca serviços próximos (usando Overpass API do OpenStreetMap)
document.getElementById("search").addEventListener("click", () => {
  const category = document.getElementById("category").value;

  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    // Query Overpass para buscar pontos próximos
    const query = `
      [out:json];
      (
        node["amenity"="${category}"](around:2000,${lat},${lon});
        node["shop"="${category}"](around:2000,${lat},${lon});
      );
      out;
    `;

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query
    })
    .then(res => res.json())
    .then(data => {
      data.elements.forEach(el => {
        if (el.lat && el.lon) {
          L.marker([el.lat, el.lon]).addTo(map)
            .bindPopup(el.tags.name || "Local encontrado");
        }
      });
    })
    .catch(() => alert("Erro ao buscar serviços."));
  });
});
