import { useState } from 'react'

import SpringInputForm from './components/SpringInputForm'
import ResultsPanel from './components/ResultsPanel'

import {
  calculateCompressionSpring
} from './api/springApi'

function App() {

  const [wireDiameter, setWireDiameter] = useState("")
  const [coilDiameter, setCoilDiameter] = useState("")
  const [activeCoils, setActiveCoils] = useState("")
  const [force, setForce] = useState("")
  const [material, setMaterial] = useState("Music Wire")
  const [results, setResults] = useState<any>(null)

  async function handleCalculate() {

    if (
        !wireDiameter ||
        !coilDiameter ||
        !activeCoils ||
        !force
    ) {
        alert("Please fill in all fields")
        return
    }

    if (Number(coilDiameter) <= Number(wireDiameter)) {
        alert("Coil diameter must be larger than wire diameter")
        return
    }

    try {

      const result = await calculateCompressionSpring({

        wire_diameter: Number(wireDiameter),
        coil_diameter: Number(coilDiameter),
        active_coils: Number(activeCoils),
        shear_modulus: 79000,
        force: Number(force),
        material: material,
      })

      setResults(result)

    } catch (error) {

      console.error(error)
      alert("Calculation failed")

    }
  }

  return (

  <div className="min-h-screen bg-gray-100 p-8">

    <div className="max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-8">
        Compression Spring Calculator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <SpringInputForm
            wireDiameter={wireDiameter}
            coilDiameter={coilDiameter}
            activeCoils={activeCoils}
            force={force}

            setWireDiameter={setWireDiameter}
            setCoilDiameter={setCoilDiameter}
            setActiveCoils={setActiveCoils}
            setForce={setForce}

            material={material}
            setMaterial={setMaterial}

            onCalculate={handleCalculate}
          />

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <ResultsPanel results={results} />

        </div>

      </div>

    </div>

  </div>
)
}

export default App