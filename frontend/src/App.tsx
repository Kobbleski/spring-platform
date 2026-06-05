import { useState } from 'react'

import SpringInputForm from './components/SpringInputForm'
import ResultsPanel from './components/ResultsPanel'

import {
  calculateCompressionSpring,
  calculateExtensionSpring,
  calculateRoundWireTorsionSpring,
  calculateSquareSectionTorsionSpring,
  type SpringResult,
  type SpringType
} from './api/SpringApi'

import {
    inchesToMm,
    lbfToN
} from './utils/unitConversions'

function App() {

  const [springType, setSpringType] = useState<SpringType>("compression")
  const [wireDiameter, setWireDiameter] = useState("")
  const [coilDiameter, setCoilDiameter] = useState("")
  const [activeCoils, setActiveCoils] = useState("")
  const [force, setForce] = useState("")
  const [initialTension, setInitialTension] = useState("")
  const [angleDegrees, setAngleDegrees] = useState("")
  const [material, setMaterial] = useState("Music Wire")
  const [results, setResults] = useState<SpringResult | null>(null)
  const [unitSystem, setUnitSystem] = useState("Metric")

  async function handleCalculate() {

    const isTorsion =
        springType === "round_torsion" || springType === "square_torsion"

    if (
        !wireDiameter ||
        !coilDiameter ||
        !activeCoils ||
        (!isTorsion && !force) ||
        (springType === "extension" && !initialTension) ||
        (isTorsion && !angleDegrees)
    ) {
        alert("Please fill in all fields")
        return
    }

    const parsedWireDiameter = Number(wireDiameter)
    const parsedCoilDiameter = Number(coilDiameter)
    const parsedActiveCoils = Number(activeCoils)
    const parsedForce = Number(force)
    const parsedInitialTension = Number(initialTension)
    const parsedAngleDegrees = Number(angleDegrees)

    const numericValues = [
        parsedWireDiameter,
        parsedCoilDiameter,
        parsedActiveCoils,
        isTorsion ? parsedAngleDegrees : parsedForce,
        springType === "extension" ? parsedInitialTension : 0,
    ]

    if (numericValues.some((value) => !Number.isFinite(value))) {
        alert("Please enter valid numbers")
        return
    }

    if (
        parsedWireDiameter <= 0 ||
        parsedCoilDiameter <= 0 ||
        parsedActiveCoils <= 0 ||
        (!isTorsion && parsedForce < 0) ||
        (springType === "extension" && parsedInitialTension < 0) ||
        (isTorsion && parsedAngleDegrees < 0)
    ) {
        alert("Dimensions and active coils must be positive; loads and angles cannot be negative")
        return
    }

    if (parsedCoilDiameter <= parsedWireDiameter) {
        alert("Mean coil diameter must be larger than the wire or section size")
        return
    }

    try {

      let convertedWireDiameter = parsedWireDiameter

      let convertedCoilDiameter = parsedCoilDiameter

      let convertedForce = parsedForce

      let convertedInitialTension = parsedInitialTension

      if (unitSystem === "Imperial") {

        convertedWireDiameter =
            inchesToMm(convertedWireDiameter)

        convertedCoilDiameter =
            inchesToMm(convertedCoilDiameter)

        convertedForce =
            lbfToN(convertedForce)

        convertedInitialTension =
            lbfToN(convertedInitialTension)
      }

      const baseInputs = {
        wire_diameter: convertedWireDiameter,
        coil_diameter: convertedCoilDiameter,
        active_coils: parsedActiveCoils,
        material: material,
      }

      if (springType === "compression") {
        const result = await calculateCompressionSpring({
            ...baseInputs,
            force: convertedForce,
        })

        setResults(result)
        return
      }

      if (springType === "extension") {
        const result = await calculateExtensionSpring({
            ...baseInputs,
            force: convertedForce,
            initial_tension: convertedInitialTension,
        })

        setResults(result)
        return
      }

      if (springType === "round_torsion") {
        const result = await calculateRoundWireTorsionSpring({
            ...baseInputs,
            angle_degrees: parsedAngleDegrees,
        })

        setResults(result)
        return
      }

      const result = await calculateSquareSectionTorsionSpring({
          ...baseInputs,
          angle_degrees: parsedAngleDegrees,
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
        Spring Calculator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-6">

          <SpringInputForm
            springType={springType}
            wireDiameter={wireDiameter}
            coilDiameter={coilDiameter}
            activeCoils={activeCoils}
            force={force}
            initialTension={initialTension}
            angleDegrees={angleDegrees}

            setSpringType={setSpringType}
            setWireDiameter={setWireDiameter}
            setCoilDiameter={setCoilDiameter}
            setActiveCoils={setActiveCoils}
            setForce={setForce}
            setInitialTension={setInitialTension}
            setAngleDegrees={setAngleDegrees}

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
