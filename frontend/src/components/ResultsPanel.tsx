import SpringGraph from './SpringGraph'

import {
    mmToInches,
    nToLbf,
} from '../utils/unitConversions'

import type {
    CompressionSpringResult,
    GraphPoint,
} from '../api/SpringApi'


interface ResultsPanelProps {

    results: CompressionSpringResult | null

    unitSystem: string
}


function nPerMmToLbfPerIn(value: number): number {

    return nToLbf(value) * 25.4
}


function mpaToKsi(value: number): number {

    return value * 0.145038
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

    const springRateUnit =
        unitSystem === "Metric" ? "N/mm" : "lbf/in"

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

    const solidHeight =
        unitSystem === "Metric"
            ? results.solid_height
            : mmToInches(results.solid_height)

    const springRate =
        unitSystem === "Metric"
            ? results.spring_rate
            : nPerMmToLbfPerIn(results.spring_rate)

    const stress =
        unitSystem === "Metric"
            ? results.stress
            : mpaToKsi(results.stress)

    const graphData: GraphPoint[] =
        unitSystem === "Metric"
            ? results.graph_data
            : results.graph_data.map((point) => ({
                deflection: mmToInches(point.deflection),
                force: nToLbf(point.force),
            }))

    return (

        <div>

            <h2 className="text-2xl font-bold mb-4">
                Results
            </h2>

            <div className="space-y-2">

                <p>
                    Spring Rate:
                    {" "}
                    {springRate.toFixed(2)}
                    {" "}
                    {springRateUnit}
                </p>

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

                <p>
                    Solid Height:
                    {" "}
                    {solidHeight.toFixed(2)}
                    {" "}
                    {lengthUnit}
                </p>

                <p>
                    Stress:
                    {" "}
                    {stress.toFixed(2)}
                    {" "}
                    {stressUnit}
                </p>

            </div>

            <div className="mt-6">

                <SpringGraph
                    graphData={graphData}
                    xUnit={lengthUnit}
                    yUnit={forceUnit}
                />

            </div>

        </div>
    )
}

export default ResultsPanel
