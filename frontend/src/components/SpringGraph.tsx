import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'


function SpringGraph({ graphData }: any) {

    return (

        <div style={{ width: '100%', height: 300 }}>

            <ResponsiveContainer>

                <LineChart data={graphData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="deflection" />

                    <YAxis />

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