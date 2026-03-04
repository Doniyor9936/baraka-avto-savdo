export const initUsers = [
  { id: 1, name: 'Admin', login: 'admin', password: 'admin123', role: 'admin', active: true, joined: '2024-01-01' },
  { id: 2, name: 'Jasur Mirzayev', login: 'jasur', password: 'jasur123', role: 'xodim', active: true, joined: '2024-01-10' },
  { id: 3, name: 'Malika Hasanova', login: 'malika', password: 'malika123', role: 'xodim', active: true, joined: '2024-02-01' },
]

export const initCars = [
  { id: 1, brand: 'Chevrolet', model: 'Malibu', year: 2023, color: 'Oq', bodyType: 'Sedan', fuelType: 'Benzin', mileage: 0, buyPrice: 450000000, sellPrice: 520000000, arrivedDate: '2024-01-10', status: 'Sotilgan', referralId: 2, soldById: 2, soldDate: '2024-02-15', deleted: false },
  { id: 2, brand: 'Hyundai', model: 'Tucson', year: 2022, color: 'Kumush', bodyType: 'SUV', fuelType: 'Benzin', mileage: 25000, buyPrice: 380000000, sellPrice: 440000000, arrivedDate: '2024-01-20', status: 'Sotilgan', referralId: 3, soldById: 3, soldDate: '2024-02-20', deleted: false },
  { id: 3, brand: 'Toyota', model: 'Camry', year: 2023, color: 'Qora', bodyType: 'Sedan', fuelType: 'Gibrid', mileage: 5000, buyPrice: 520000000, sellPrice: 610000000, arrivedDate: '2024-02-01', status: 'Sotuvda', referralId: 2, soldById: null, soldDate: null, deleted: false },
  { id: 4, brand: 'Kia', model: 'Sportage', year: 2022, color: "Ko'k", bodyType: 'SUV', fuelType: 'Dizel', mileage: 30000, buyPrice: 320000000, sellPrice: 390000000, arrivedDate: '2024-02-10', status: 'Sotuvda', referralId: 3, soldById: null, soldDate: null, deleted: false },
  { id: 5, brand: 'BMW', model: '5 Series', year: 2021, color: 'Qora', bodyType: 'Sedan', fuelType: 'Benzin', mileage: 40000, buyPrice: 580000000, sellPrice: 720000000, arrivedDate: '2024-02-15', status: 'Sotilgan', referralId: 2, soldById: 2, soldDate: '2024-03-01', deleted: false },
  { id: 6, brand: 'Daewoo', model: 'Nexia 3', year: 2023, color: 'Oq', bodyType: 'Sedan', fuelType: 'Benzin', mileage: 0, buyPrice: 130000000, sellPrice: 158000000, arrivedDate: '2024-03-01', status: 'Sotuvda', referralId: null, soldById: null, soldDate: null, deleted: false },
]

export const initExpenses = [
  { id: 1, name: 'Ofis ijarasi', type: 'Ofis xarajati', amount: 5000000, date: '2024-01-01', note: 'Yanvar oyi', deleted: false },
  { id: 2, name: 'Instagram reklama', type: 'Reklama', amount: 2000000, date: '2024-01-15', note: '', deleted: false },
  { id: 3, name: 'Mashina transporti', type: 'Transport', amount: 1500000, date: '2024-02-05', note: '', deleted: false },
  { id: 4, name: 'Ofis ijarasi', type: 'Ofis xarajati', amount: 5000000, date: '2024-02-01', note: 'Fevral oyi', deleted: false },
  { id: 5, name: "Dvigatel ta'miri", type: 'Remont', amount: 3500000, date: '2024-02-20', note: '', deleted: false },
  { id: 6, name: 'TV reklama', type: 'Reklama', amount: 8000000, date: '2024-03-01', note: '', deleted: false },
]

export const initAudit = [
  { id: 1, userId: 1, userName: 'Admin', action: "Mashina qo'shildi", target: 'BMW 5 Series', date: '2024-02-15T10:23:00' },
  { id: 2, userId: 2, userName: 'Jasur Mirzayev', action: 'Mashina sotildi', target: 'Chevrolet Malibu', date: '2024-02-15T14:45:00' },
]
