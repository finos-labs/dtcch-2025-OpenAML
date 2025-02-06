/* eslint-disable react/prop-types */
const DataLegend = ({ text, className = "" }) => {
  return (
    <span className={`text-xl text-gray-400 ${className}`}>{text}</span>
  )
}

export default DataLegend