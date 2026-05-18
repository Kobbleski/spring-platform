import { useState } from 'react'

import SpringInputForm from './components/SpringInputForm'
import ResultsPanel from './components/ResultsPanel'

import {
  calculateCompressionSpring
} from './api/springApi'

function App() {

  const [wireDiameter, setWireDiameter] = useState("")
  const [coilDiameter, setCoilDiameter] = useState("")
  const [results, setResults] = useState<any>(null)

  async function handleCalculate() {

    try {

      const result = await calculateCompressionSpring({
        wire_diameter: Number(wireDiameter),
        coil_diameter: Number(coilDiameter),
        active_coils: 8,
        shear_modulus: 79000
      })

      setResults(result)

    } catch (error) {

      console.error(error)
      alert("Calculation failed")

    }
  }

  return (

    <div style={{ padding: "30px" }}>

      <h1>Compression Spring Calculator</h1>

      <SpringInputForm
        wireDiameter={wireDiameter}
        coilDiameter={coilDiameter}
        setWireDiameter={setWireDiameter}
        setCoilDiameter={setCoilDiameter}
        onCalculate={handleCalculate}
      />

      <ResultsPanel
        results={results}
      />

    </div>
  )
}

export default App