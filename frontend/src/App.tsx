import { useState } from 'react'

import SpringInputForm from './components/SpringInputForm'
import ResultsPanel from './components/ResultsPanel'

import {
  calculateCompressionSpring
} from './api/springApi'

import {
    inchesToMm,
    lbfToN,
    mmToInches,
    nToLbf
} from './utils/unitConversions'

function App() {

  const [wireDiameter, setWireDiameter] = useState("")
  const [coilDiameter, setCoilDiameter] = useState("")
  const [activeCoils, setActiveCoils] = useState("")
  const [force, setForce] = useState("")
  const [material, setMaterial] = useState("Music Wire")
  const [results, setResults] = useState<any>(null)
  const [unitSystem, setUnitSystem] = useState("Metric")

  let convertedWireDiameter = Number(wireDiameter)

  let convertedCoilDiameter = Number(coilDiameter)

  let convertedForce = Number(force)

  if (unitSystem === "Imperial") {

    convertedWireDiameter =
        inchesToMm(convertedWireDiameter)

    convertedCoilDiameter =
        inchesToMm(convertedCoilDiameter)

    convertedForce =
        lbfToN(convertedForce)
  }

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

      let convertedWireDiameter = Number(wireDiameter)

      let convertedCoilDiameter = Number(coilDiameter)

      let convertedForce = Number(force)

      if (unitSystem === "Imperial") {

        convertedWireDiameter =
            inchesToMm(convertedWireDiameter)

        convertedCoilDiameter =
            inchesToMm(convertedCoilDiameter)

        convertedForce =
            lbfToN(convertedForce)
      }

      const result = await calculateCompressionSpring({

        wire_diameter: convertedWireDiameter,
        coil_diameter: convertedCoilDiameter,
        active_coils: Number(activeCoils),
        shear_modulus: 79000,
        force: convertedForce,
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

            unitSystem={unitSystem}
            setUnitSystem={setUnitSystem}

            onCalculate={handleCalculate}
          />

        </div>

        <div className="bg-white rounded-xl shadow p-6">

          <ResultsPanel
            results={results}
            unitSystem={unitSystem}
          />

        </div>

      </div>

    </div>

  </div>
)
}

export default App