import { CartesianGrid, Legend, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts"

import { data01, data02 } from "./behaviorData"

const behaviorChart = () => {
  return (
    
    <ScatterChart
    width={380}
    height={420}
    margin={{
        top: 20,
        right: 20,
        bottom: 10,
        left: 10,
    }}
    >
    <CartesianGrid strokeDasharray="3 2" />
        <XAxis dataKey="x" type="number" name="stature" unit="tx" />
        <YAxis dataKey="y" type="number" name="weight" unit="$" />
        <ZAxis dataKey="z" type="number" range={[64, 144]} name="score" unit="km" />
        <Tooltip cursor={{ strokeDasharray: '3 2' }} />
        <Legend />
                <Scatter name="KYC Behavior" data={data01} fill="#C234E2" />
        <Scatter name="Suspicious" data={data02} fill="#57D4D8" />
    </ScatterChart>
  
  )
}

export default behaviorChart