const fs = require('fs');
const { randomUUID } = require('crypto');

// Constants
const KM_PER_DEG_LAT = 111;
const KM_PER_DEG_LON = 85;

// Neighborhood centers and ATM counts
const neighborhoods = {
    "Центр": { count: 30, center: [49.233124, 28.467532], radius_km: 1.5 },
    "Замостя": { count: 25, center: [49.242897, 28.497886], radius_km: 1.2 },
    "Вишенька": { count: 20, center: [49.226811, 28.420314], radius_km: 1.3 },
    "Поділля": { count: 20, center: [49.220193, 28.444439], radius_km: 1.2 },
    "Сабарів": { count: 15, center: [49.219480, 28.492303], radius_km: 1.5 },
    "П'ятничани": { count: 15, center: [49.247755, 28.455789], radius_km: 1.0 },
    "Інше": { count: 25, center: [49.230000, 28.500000], radius_km: 2.5 }
};

const banks = [
    "PrivatBank", "Oschadbank", "Raiffeisen Bank", "UkrSibbank", "PUMB", "OTP Bank"
];
const services = ["Cash Withdrawal", "Balance Inquiry", "Cash Deposit", "Pin Change", "Check Deposit"];
const networks = ["VISA", "MASTERCARD"];
const cashDenoms = ["50 UAH", "100 UAH", "200 UAH", "500 UAH"];

// Random coordinate generator within circular radius
function generateCoordinates(center, radius_km) {
    const r = radius_km * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const dlat = r / KM_PER_DEG_LAT;
    const dlon = r / KM_PER_DEG_LON;
    const lat = center[0] + dlat * Math.sin(theta);
    const lon = center[1] + dlon * Math.cos(theta);
    return [parseFloat(lat.toFixed(6)), parseFloat(lon.toFixed(6))];
}

// Generate ATMs
let atmIndex = 1;
const atms = [];

for (const [name, { count, center, radius_km }] of Object.entries(neighborhoods)) {
    for (let i = 0; i < count; i++) {
        const [lat, lon] = generateCoordinates(center, radius_km);

        const atm = {
            id: randomUUID(),
            name: `${banks[Math.floor(Math.random() * banks.length)]} ATM #${atmIndex}`,
            address: `${Math.floor(Math.random() * 200) + 1} ${name} St.`,
            city: "Vinnytsia",
            state: name,
            postalCode: "21000",
            coordinates: { latitude: lat, longitude: lon },
            networks,
            services: services.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * services.length) + 1),
            hours: "24/7",
            phoneNumber: `+380 (432) ${Math.floor(300000 + Math.random() * 99999)}`,
            availableCash: cashDenoms.sort(() => 0.5 - Math.random()).slice(0, 2)
        };
        atms.push(atm);
        atmIndex++;
    }
}

// Save to JSON file
fs.writeFileSync('src/vinnytsia_atms.json', JSON.stringify(atms, null, 2), 'utf8');
console.log("✅ File saved as vinnytsia_atms_updated.json");
