import { createContext, useContext, useState } from 'react'
import { initUsers, initCars, initExpenses, initAudit } from '../data/mockData'
import { uid } from '../utils/helpers'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [cars, setCars] = useState(initCars)
  const [users, setUsers] = useState(initUsers)
  const [expenses, setExpenses] = useState(initExpenses)
  const [audit, setAudit] = useState(initAudit)

  const addAudit = (user, action, target) => {
    setAudit(p => [...p, {
      id: uid(), userId: user.id, userName: user.name,
      action, target, date: new Date().toISOString()
    }])
  }

  return (
    <AppCtx.Provider value={{
      currentUser, setCurrentUser,
      cars, setCars,
      users, setUsers,
      expenses, setExpenses,
      audit, addAudit
    }}>
      {children}
    </AppCtx.Provider>
  )
}
