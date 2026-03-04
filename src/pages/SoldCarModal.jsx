import { Modal } from '../components/UI'
import { fmtSum, fmtDate } from '../utils/helpers'

export default function SoldCarModal({ car, onClose }) {
  const profit = (car.totalAmount || 0) - (car.buyPrice || 0)
  return (
    <Modal title={`Sotilgan Mashina: ${car.brand} ${car.model}`} onClose={onClose} width={520}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
        <div><strong>Sotuv turi:</strong> {car.saleType}</div>
        <div><strong>Kelishilgan summa:</strong> {fmtSum(car.totalAmount)}</div>
        <div><strong>Oldindan to‘lov:</strong> {fmtSum(car.advance)}</div>
        <div><strong>Haridor:</strong> {car.buyer?.name || '-'} </div>
        <div><strong>Telefon:</strong> {car.buyer?.phone || '-'} </div>
        <div><strong>Manzil:</strong> {car.buyer?.address || '-'} </div>
        <div><strong>Izoh:</strong> {car.buyer?.note || '-'} </div>
        <div><strong>Kim sotgani:</strong> {car.soldByName || '-'}</div>
        <div><strong>Sotilgan sana:</strong> {fmtDate(car.soldDate)}</div>
        <div><strong>Foyda:</strong> <span style={{ color: profit >=0 ? 'green' : 'red' }}>{fmtSum(profit)}</span></div>
      </div>
    </Modal>
  )
}