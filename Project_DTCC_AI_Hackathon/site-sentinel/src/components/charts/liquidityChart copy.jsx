import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { liquidityData } from "./liquidityData"

const liquidityChart = () => {
  return (

  
        <ResponsiveContainer
        width="100%"
        height={220}
        margin={{
            top: 10,
            right: 8,
            left: 8,
            bottom: 0,
          }}
        >
        <LineChart
        data={liquidityData}
        >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey={"name"} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line connectNulls type="monotone" dataKey="actual" stroke="#C234E2" />
            <Line connectNulls type="monotone" dataKey="prediction" stroke="#57D4D8" />

        </LineChart>
        </ResponsiveContainer>
  )
}

export default liquidityChart