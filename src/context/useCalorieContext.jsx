import { useContext } from 'react'
import CalorieContext from './calorie-context'

export default function useCalorieContext() {
  const context = useContext(CalorieContext)
  if (!context) {
    throw new Error('useCalorieContext must be used inside CalorieProvider')
  }
  return context
}
