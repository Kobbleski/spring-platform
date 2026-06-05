import SpringGraph from './SpringGraph'

import {
    mmToInches,
    nToLbf,
    nmmToLbfIn,
    nPerMmToLbfPerIn,
    mpaToKsi,
} from '../utils/unitConversions'

import type {
    GraphPoint,
    SpringResult,
} from '../api/SpringApi'


interface ResultsPanelProps {

    results: SpringResult | null

    unitSystem: string
}


const springTypeLabels = {
    compression: "Compression Spring",
    extension: "Extension Spring",
    round_torsion: "Round-Wire Torsion Spring",
    square_torsion: "Square-Section Torsion Spring",
}


function ResultsPanel({
    results,
    unitSystem,
}: ResultsPanelProps) {

    if (!results) {
        return <p>No results yet</p>
    }

    const lengthUnit =
        unitSystem === "Metric" ? "mm" : "in"

    const forceUnit =
        unitSystem === "Metric" ? "N" : "lbf"

    const torqueUnit =
        unitSystem === "Metric" ? "N mm" : "lbf in"

    const springRateUnit =
        unitSystem === "Metric" ? "N/mm" : "lbf/in"

    const torqueRateUnit =
        unitSystem === "Metric" ? "N mm/deg" : "lbf in/deg"

    const stressUnit =
        unitSystem === "Metric" ? "MPa" : "ksi"

    const outsideDiameter =
        unitSystem === "Metric"
            ? results.outside_diameter
            : mmToInches(results.outside_diameter)

    const insideDiameter =
        unitSystem === "Metric"
            ? results.inside_diameter
            : mmToInches(results.inside_diameter)

    const stress =
        "stress" in results
            ? results.stress
            : results.bending_stress

    const displayedStress =
        unitSystem === "Metric"
            ? stress
            : mpaToKsi(stress)

    const isTorsion =
        results.spring_type === "round_torsion" ||
        results.spring_type === "square_torsion"

    const graphData: GraphPoint[] =
        results.graph_data.map((point) => {
            if (isTorsion) {
                return {
                    deflection: point.deflection,
                    force: unitSystem === "Metric" ? point.force : nmmToLbfIn(point.force),
                }
            }

            return {
                deflection: unitSystem === "Metric" ? point.deflection : mmToInches(point.deflection),
                force: unitSystem === "Metric" ? point.force : nToLbf(point.force),
            }
        })

    return (

        <div>

            <h2 className="text-2xl font-bold mb-4">
                Results
            </h2>

            <p className="mb-4 font-semibold">
                {springTypeLabels[results.spring_type]}
            </p>

            <div className="space-y-2">

                {"spring_rate" in results && (
                    <p>
                        Spring Rate:
                        {" "}
                        {(unitSystem === "Metric"
                            ? results.spring_rate
                            : nPerMmToLbfPerIn(results.spring_rate)).toFixed(2)}
                        {" "}
                        {springRateUnit}
                    </p>
                )}

                {"torque_rate" in results && (
                    <p>
                        Torque Rate:
                        {" "}
                        {(unitSystem === "Metric"
                            ? results.torque_rate
                            : nmmToLbfIn(results.torque_rate)).toFixed(2)}
                        {" "}
                        {torqueRateUnit}
                    </p>
                )}

                {"torque" in results && (
                    <p>
                        Torque:
                        {" "}
                        {(unitSystem === "Metric"
                            ? results.torque
                            : nmmToLbfIn(results.torque)).toFixed(2)}
                        {" "}
                        {torqueUnit}
                    </p>
                )}

                <p>
                    Outside Diameter:
                    {" "}
                    {outsideDiameter.toFixed(2)}
                    {" "}
                    {lengthUnit}
                </p>

                <p>
                    Inside Diameter:
                    {" "}
                    {insideDiameter.toFixed(2)}
                    {" "}
                    {lengthUnit}
                </p>

                <p>
                    Spring Index:
                    {" "}
                    {results.spring_index.toFixed(2)}
                </p>

                {"solid_height" in results && (
                    <p>
                        Solid Height:
                        {" "}
                        {(unitSystem === "Metric"
                            ? results.solid_height
                            : mmToInches(results.solid_height)).toFixed(2)}
                        {" "}
                        {lengthUnit}
                    </p>
                )}

                {"initial_tension" in results && (
                    <p>
                        Initial Tension:
                        {" "}
                        {(unitSystem === "Metric"
                            ? results.initial_tension
                            : nToLbf(results.initial_tension)).toFixed(2)}
                        {" "}
                        {forceUnit}
                    </p>
                )}

                {"extension" in results && (
                    <p>
                        Extension At Input Force:
                        {" "}
                        {(unitSystem === "Metric"
                            ? results.extension
                            : mmToInches(results.extension)).toFixed(2)}
                        {" "}
                        {lengthUnit}
                    </p>
                )}

                <p>
                    {isTorsion ? "Bending Stress:" : "Stress:"}
                    {" "}
                    {displayedStress.toFixed(2)}
                    {" "}
                    {stressUnit}
                </p>

            </div>

            {results.spring_type === "square_torsion" && (
                <p className="mt-4 text-sm text-gray-600">
                    Square-section torsion uses an approximate section stiffness factor; validate final designs against a spring design standard or supplier data.
                </p>
            )}

            <div className="mt-6">

                <SpringGraph
                    graphData={graphData}
                    xUnit={isTorsion ? "deg" : lengthUnit}
                    yUnit={isTorsion ? torqueUnit : forceUnit}
                    xLabel={isTorsion ? "Angle" : "Deflection"}
                    yLabel={isTorsion ? "Torque" : "Force"}
                />

            </div>

        </div>
    )
}

export default ResultsPanel
