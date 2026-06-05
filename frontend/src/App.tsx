import { useState } from 'react'

import SpringInputForm from './components/SpringInputForm'
import ResultsPanel from './components/ResultsPanel'

import {
  calculateCompressionSpring,
  type CompressionSpringResult
} from './api/SpringApi'

import {
    inchesToMm,
    lbfToN
} from './utils/unitConversions'

function App() {

  const [wireDiameter, setWireDiameter] = useState("")
  const [coilDiameter, setCoilDiameter] = useState("")
  const [activeCoils, setActiveCoils] = useState("")
  const [force, setForce] = useState("")
  const [material, setMaterial] = useState("Music Wire")
  const [results, setResults] = useState<CompressionSpringResult | null>(null)
  const [unitSystem, setUnitSystem] = useState("Metric")

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

    const parsedWireDiameter = Number(wireDiameter)
    const parsedCoilDiameter = Number(coilDiameter)
    const parsedActiveCoils = Number(activeCoils)
    const parsedForce = Number(force)

    if (
        !Number.isFinite(parsedWireDiameter) ||
        !Number.isFinite(parsedCoilDiameter) ||
        !Number.isFinite(parsedActiveCoils) ||
        !Number.isFinite(parsedForce)
    ) {
        alert("Please enter valid numbers")
        return
    }

    if (
        parsedWireDiameter <= 0 ||
        parsedCoilDiameter <= 0 ||
        parsedActiveCoils <= 0 ||
        parsedForce < 0
    ) {
        alert("Dimensions and active coils must be positive; force cannot be negative")
        return
    }

    if (parsedCoilDiameter <= parsedWireDiameter) {
        alert("Coil diameter must be larger than wire diameter")
        return
    }

    try {

      let convertedWireDiameter = parsedWireDiameter

      let convertedCoilDiameter = parsedCoilDiameter

      let convertedForce = parsedForce

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
        active_coils: parsedActiveCoils,
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
