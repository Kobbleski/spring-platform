import SpringGraph from './SpringGraph'

import {
    mmToInches,
    nToLbf,
} from '../utils/unitConversions'


interface ResultsPanelProps {

    results: any

    unitSystem: string
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

    return (

        <div>

            <h2 className="text-2xl font-bold mb-4">
                Results
            </h2>

            <div className="space-y-2">

                <p>
                    Spring Rate:
                    {" "}
                    {results.spring_rate.toFixed(2)}
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
                    {results.stress.toFixed(2)}
                </p>

            </div>

            <div className="mt-6">

                <SpringGraph
                    graphData={results.graph_data}
                />

            </div>

        </div>
    )
}

export default ResultsPanel