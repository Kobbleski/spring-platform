import type {
    SpringType,
} from '../api/SpringApi'


interface SpringInputFormProps {

    springType: SpringType
    wireDiameter: string
    coilDiameter: string
    activeCoils: string
    force: string
    initialTension: string
    angleDegrees: string
    material: string
    unitSystem: string

    setSpringType: (value: SpringType) => void
    setWireDiameter: (value: string) => void
    setCoilDiameter: (value: string) => void
    setActiveCoils: (value: string) => void
    setForce: (value: string) => void
    setInitialTension: (value: string) => void
    setAngleDegrees: (value: string) => void
    setMaterial: (value: string) => void
    setUnitSystem: (value: string) => void

    onCalculate: () => void
}


const springTypeLabels: Record<SpringType, string> = {
    compression: "Compression Spring",
    extension: "Extension Spring",
    round_torsion: "Round-Wire Torsion Spring",
    square_torsion: "Square-Section Torsion Spring",
}


function SpringInputForm({
    springType,
    wireDiameter,
    coilDiameter,
    setSpringType,
    setWireDiameter,
    setCoilDiameter,
    activeCoils,
    force,
    initialTension,
    angleDegrees,
    setActiveCoils,
    setForce,
    setInitialTension,
    setAngleDegrees,
    material,
    setMaterial,
    unitSystem,
    setUnitSystem,
    onCalculate
}: SpringInputFormProps) {

    const lengthUnit =
        unitSystem === "Metric" ? "mm" : "in"

    const forceUnit =
        unitSystem === "Metric" ? "N" : "lbf"

    const isTorsion =
        springType === "round_torsion" || springType === "square_torsion"

    const wireLabel =
        springType === "square_torsion" ? "Section Side" : "Wire Diameter"

    return (

        <div>

            <div className="mb-4">

                <p>Spring Type</p>

                <select
                    className="border rounded p-2 w-full"
                    value={springType}
                    onChange={(e) => setSpringType(e.target.value as SpringType)}
                >

                    {Object.entries(springTypeLabels).map(([value, label]) => (
                        <option
                            key={value}
                            value={value}
                        >
                            {label}
                        </option>
                    ))}

                </select>

            </div>

            <div className="mb-4">
                <p>{wireLabel} ({lengthUnit})</p>

                <input
                    className="border rounded p-2 w-full"
                    value={wireDiameter}
                    onChange={(e) => setWireDiameter(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <p>Mean Coil Diameter ({lengthUnit})</p>

                <input
                    className="border rounded p-2 w-full"
                    value={coilDiameter}
                    onChange={(e) => setCoilDiameter(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <p>Active Coils</p>

                <input
                    className="border rounded p-2 w-full"
                    value={activeCoils}
                    onChange={(e) => setActiveCoils(e.target.value)}
                />
            </div>

            {!isTorsion && (
                <div className="mb-4">
                    <p>Force ({forceUnit})</p>

                    <input
                        className="border rounded p-2 w-full"
                        value={force}
                        onChange={(e) => setForce(e.target.value)}
                    />
                </div>
            )}

            {springType === "extension" && (
                <div className="mb-4">
                    <p>Initial Tension ({forceUnit})</p>

                    <input
                        className="border rounded p-2 w-full"
                        value={initialTension}
                        onChange={(e) => setInitialTension(e.target.value)}
                    />
                </div>
            )}

            {isTorsion && (
                <div className="mb-4">
                    <p>Angle (degrees)</p>

                    <input
                        className="border rounded p-2 w-full"
                        value={angleDegrees}
                        onChange={(e) => setAngleDegrees(e.target.value)}
                    />
                </div>
            )}

            <div className="mb-4">

                <p>Unit System</p>

                <select
                    className="border rounded p-2 w-full"
                    value={unitSystem}
                    onChange={(e) => setUnitSystem(e.target.value)}
                >

                    <option>Metric</option>

                    <option>Imperial</option>

                </select>

            </div>

            <div className="mb-4">

                <p>Material</p>

                <select
                    className="border rounded p-2 w-full"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                >

                    <option>Music Wire</option>

                    <option>Stainless Steel</option>

                    <option>Phosphor Bronze</option>

                </select>

            </div>

            <button
                className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                onClick={onCalculate}>
                Calculate
            </button>

        </div>
    )
}

export default SpringInputForm
