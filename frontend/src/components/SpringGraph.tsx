import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

import type {
    GraphPoint,
} from '../api/SpringApi'


interface SpringGraphProps {
    graphData: GraphPoint[]
    xUnit: string
    yUnit: string
    xLabel: string
    yLabel: string
}


function SpringGraph({
    graphData,
    xUnit,
    yUnit,
    xLabel,
    yLabel,
}: SpringGraphProps) {

    return (

        <div style={{ width: '100%', height: 300 }}>

            <ResponsiveContainer>

                <LineChart data={graphData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="deflection"
                        label={{
                            value: `${xLabel} (${xUnit})`,
                            position: "insideBottom",
                            offset: -5,
                        }}
                    />

                    <YAxis
                        label={{
                            value: `${yLabel} (${yUnit})`,
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="force"
                        stroke="#2563eb"
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>
    )
}

export default SpringGraph
