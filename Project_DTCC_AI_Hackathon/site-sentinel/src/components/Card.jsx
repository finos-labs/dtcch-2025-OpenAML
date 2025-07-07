/* eslint-disable react/prop-types */
const Card = ({ title }) => {
  return (
    <div className="md:w-1/3 w-full flex flex-col items-start gap-2 justify-start px-4 py-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200">
        <h3 className="text-2xl md:text-3xl font-medium">{title}</h3>
        <div className="flex flex-col gap-0 items-start justify-start">
            <span className="font-mono text-xl text-gray-400">10M Wallets</span>
            <span className="font-mono text-xl text-gray-400">U$ 680 Bi</span>
        </div>
        <div className="chart bg-gray-200 h-[300px] w-full"></div>
        <span className="w-full font-mono text-xl text-gray-400 text-center"> Jan 1 / Jan 31</span>
    </div>
  )
}

export default Card