import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { data } from "./predictionData"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', "#FF0000"];

const predictionChart = () => {
  return (
    <ResponsiveContainer 
    width="100%"
    height={250}
    >
        <PieChart>
            <Pie
            data={data}
            innerRadius={70}
            stroke="#999999"
            paddingAngle={2}
            startAngle={180}
            endAngle={0}
            dataKey={"value"}
            >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
    
        </PieChart>

    </ResponsiveContainer>
    
  )
}

export default predictionChart