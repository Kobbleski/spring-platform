interface SpringInputFormProps {

    wireDiameter: string
    coilDiameter: string

    setWireDiameter: (value: string) => void
    setCoilDiameter: (value: string) => void

    onCalculate: () => void
}

function SpringInputForm({
    wireDiameter,
    coilDiameter,
    setWireDiameter,
    setCoilDiameter,
    onCalculate
}: SpringInputFormProps) {

    return (

        <div>

            <div>
                <p>Wire Diameter</p>

                <input
                    value={wireDiameter}
                    onChange={(e) => setWireDiameter(e.target.value)}
                />
            </div>

            <div>
                <p>Coil Diameter</p>

                <input
                    value={coilDiameter}
                    onChange={(e) => setCoilDiameter(e.target.value)}
                />
            </div>

            <button onClick={onCalculate}>
                Calculate
            </button>

        </div>
    )
}

export default SpringInputForm