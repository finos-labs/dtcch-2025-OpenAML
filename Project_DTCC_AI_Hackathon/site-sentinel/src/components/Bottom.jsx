import DataLegend from "./DataLegend"

const Bottom = () => {
  return (
    <section className="w-full py-10 flex flex-col lg:flex-row items-start justify-start lg:items-center lg:justify-center px-4 md:px-8 gap-8">
        <div className="flex flex-col lg:items-start lg:justify-start items-center justify-center gap-4 w-full lg:w-4/12">
            <h2 className="text-3xl md:text-4xl text-gray-800 dark:text-gray-100">API Usage</h2>
            <span className="bg-white dark:bg-gray-900 rounded-xl px-4 py-2 font-mono text-md md:text-lg text-purple-400 dark:text-purple-300 border border-gray-200 dark:border-gray-800 inset-1">https:api.sentinel.com/predict/[wallet]</span>
        </div>
        <div className="w-full lg:w-8/12 flex flex-col lg:items-start lg:justify-center items-center justify-center gap-4">
            <h4 className="text-xl uppercase">Response</h4>
            <div className="px-4 py-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 ring-2 dark:ring-purple-800 ring-purple-400 font-mono text-md md:text-lg w-full dark:border-gray-800">
            <DataLegend text={"RiskLevel: 0.3, Info: AML_Flagge, Vol: 200k, Transactions: 1200, chain: Ethereum, BnbChain"} className="text-purple-400 dark:text-purple-300" />
            </div>
        </div>
    </section>
  )
}

export default Bottom