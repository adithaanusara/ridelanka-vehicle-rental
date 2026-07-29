const vehicles = [
  { name: 'Toyota Raize', type: 'suv', district: 'Colombo', category: 'SUV', seats: '5 seats · Auto', price: '8,500', rating: '4.9', image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=700&q=85' },
  { name: 'Suzuki Alto', type: 'car', district: 'Kandy', category: 'City car', seats: '4 seats · Auto', price: '4,200', rating: '4.8', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=85' },
  { name: 'Toyota KDH', type: 'van', district: 'Galle', category: 'Van', seats: '10 seats · Manual', price: '12,000', rating: '5.0', image: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=700&q=85' },
  { name: 'Honda Dio', type: 'bike', district: 'Negombo', category: 'Motorbike', seats: '2 seats · Auto', price: '2,500', rating: '4.7', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=85' },
  { name: 'Mitsubishi Montero', type: 'suv', district: 'Matara', category: 'SUV', seats: '7 seats · Auto', price: '15,500', rating: '4.9', image: 'https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?auto=format&fit=crop&w=700&q=85' },
  { name: 'Nissan Caravan', type: 'van', district: 'Colombo', category: 'Van', seats: '12 seats · Manual', price: '13,500', rating: '4.8', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=700&q=85' },
];

const grid = document.querySelector('#vehicleGrid');
const resultCount = document.querySelector('#resultCount');
function renderVehicles(items) {
  grid.innerHTML = items.length ? items.map((vehicle) => `
    <article class="vehicle-card">
      <div class="vehicle-image"><img src="${vehicle.image}" alt="${vehicle.name}" /><span class="vehicle-tag">${vehicle.category}</span><button class="heart" aria-label="Save ${vehicle.name}">♡</button></div>
      <div class="vehicle-info"><h3>${vehicle.name}</h3><p class="vehicle-meta">${vehicle.district} · ${vehicle.seats}</p><div class="vehicle-bottom"><span>Rs. ${vehicle.price} <small>/ day</small></span><span class="rating"><b>★</b> ${vehicle.rating}</span></div></div>
    </article>`).join('') : '<p class="no-results">No matching rides yet. Try another district or vehicle type.</p>';
  grid.querySelectorAll('.heart').forEach((button) => button.addEventListener('click', () => { button.classList.toggle('liked'); button.textContent = button.classList.contains('liked') ? '♥' : '♡'; }));
}
renderVehicles(vehicles.slice(0, 4));

document.querySelector('#searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const district = document.querySelector('#district').value;
  const type = document.querySelector('#vehicleType').value;
  const found = vehicles.filter((vehicle) => (district === 'all' || vehicle.district === district) && (type === 'all' || vehicle.type === type));
  resultCount.textContent = found.length ? `${found.length} ride${found.length > 1 ? 's' : ''} available${district === 'all' ? ' across Sri Lanka' : ` in ${district}`}` : 'No matching rides found';
  renderVehicles(found);
  document.querySelector('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const periods = { monthly: { suffix: '/ month' }, sixMonths: { suffix: '/ 6 months' }, yearly: { suffix: '/ year' } };
document.querySelectorAll('.billing-toggle button').forEach((button) => button.addEventListener('click', () => {
  const period = button.dataset.period;
  document.querySelectorAll('.billing-toggle button').forEach((item) => item.classList.toggle('selected', item === button));
  document.querySelectorAll('.price').forEach((price) => { price.textContent = `Rs. ${price.dataset[period.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]}`; });
  document.querySelectorAll('.period').forEach((label) => { label.textContent = periods[period].suffix; });
}));
