interface SpringInputFormProps {

    wireDiameter: string
    coilDiameter: string
    activeCoils: string
    force: string
    material: string

    setWireDiameter: (value: string) => void
    setCoilDiameter: (value: string) => void
    setActiveCoils: (value: string) => void
    setForce: (value: string) => void
    setMaterial: (value: string) => void

    onCalculate: () => void
}

function SpringInputForm({
    wireDiameter,
    coilDiameter,
    setWireDiameter,
    setCoilDiameter,
    activeCoils,
    force,
    setActiveCoils,
    setForce,
    material,
    setMaterial,
    onCalculate
}: SpringInputFormProps) {

    return (

        <div>

            <div className="mb-4">
                <p>Wire Diameter</p>

                <input
                    className="border rounded p-2 w-full"
                    value={wireDiameter}
                    onChange={(e) => setWireDiameter(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <p>Coil Diameter</p>

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

            <div className="mb-4">
                <p>Force</p>

                <input
                    className="border rounded p-2 w-full"
                    value={force}
                    onChange={(e) => setForce(e.target.value)}
                />
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