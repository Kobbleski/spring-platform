function ResultsPanel({ results }: any) {

    if (!results) {
        return <p>No results yet</p>
    }

    return (

        <div>

            <h2>Results</h2>

            <p>Spring Rate: {results.spring_rate}</p>

            <p>Outside Diameter: {results.outside_diameter}</p>

            <p>Inside Diameter: {results.inside_diameter}</p>

            <p>Spring Index: {results.spring_index}</p>

            <p>Solid Height: {results.solid_height}</p>

            <p>Stress: {results.stress}</p>

        </div>
    )
}

export default ResultsPanel