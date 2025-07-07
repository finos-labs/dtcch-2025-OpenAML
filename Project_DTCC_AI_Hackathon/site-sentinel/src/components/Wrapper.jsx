import Badgde from "./Badgde"
import Bottom from "./Bottom"
import DataLegend from "./DataLegend"
import BehaviorChart from "./charts/behaviorChart"
import LiquidityChart from "./charts/liquidityChart"
import PredictionChart from "./charts/predictionChart"


const Main = () => {
  return (
    <section className="min-h-screen py-24 md:py-20 bg-gradient-to-tr from-gray-50 to-purple-50 dark:from-gray-950 dark:to-purple-950/50">
        <div className="px-8 flex flex-col md:flex-row gap-6 items-start justify-center">
            
            <div className="md:w-1/2 lg:w-1/3 w-full flex flex-col items-start grow gap-2 justify-start px-4 py-6 bg-white dark:bg-gray-900/50 rounded-2xl hover:shadow-sm transition-all duration-300 border border-gray-200 dark:border-gray-800 relative">
                <h3 className="text-2xl md:text-3xl font-medium">Wallet clusters</h3>
                <div className="flex flex-col gap-0 items-start justify-start">
                <ul className="flex gap-8 items-center justify-start my-2">
                    <li>
                    <DataLegend text={"Transactions"}  className="textSmall" /><br/>
                    <DataLegend text={"958M"}  className="textMedium" />
                        </li>
                        
                        <li>
                    <DataLegend text={"Wallets"}  className="textSmall" /><br/>
                    <DataLegend text={"533k"}  className="textMedium" />
                        </li>
                        <li>
                    <DataLegend text={"Tokens"}  className="textSmall" /><br/>
                    <DataLegend text={"11k"}  className="textMedium" />
                        </li>
                        <li>
                    <DataLegend text={"Scam Reports"}  className="textSmall" /><br/>
                    <DataLegend text={"34k"}  className="textMedium" />
                        </li>
                    
                        <li>
                    <DataLegend text={"KYC Contracts"}  className="textSmall" /><br/>
                    <DataLegend text={"42"}  className="textMedium" />
                        </li>
                    
                    </ul>
                </div>
                <div className="w-full flex items-center justify-center mt-4">
                    <BehaviorChart />
                </div>
               
            </div>
            
            <div className="md:w-1/2 lg:w-1/3 w-full grow flex flex-col items-start gap-2 justify-between px-4 py-6 bg-white dark:bg-gray-900/50 rounded-2xl hover:shadow-sm transition-all duration-300 border border-gray-200 dark:border-gray-800 relative">
                <h3 className="text-2xl md:text-3xl font-medium">Risk Score</h3>
                <div className="w-full" >
                <DataLegend text="Check wallet KYC & Suspicius score" />
                </div>
                <div className="flex flex-col gap-0 items-start justify-start">
                <ul className="flex gap-8 items-center justify-start my-2">
                    <li>
                    <DataLegend text={"Transactions"}  className="textSmall" /><br/>
                    <DataLegend text={"1677"}  className="textMedium" />
                        </li>
                        
                        <li>
                    <DataLegend text={"Tokens"}  className="textSmall" /><br/>
                    <DataLegend text={"<10"}  className="textMedium" />
                        </li>

                    
                        <li>
                    <DataLegend text={"KYC Tx"}  className="textSmall" /><br/>
                    <DataLegend text={"32"}  className="textMedium" />
                        </li>

                        <li>
                    <DataLegend text={"Last Activity"}  className="textSmall" /><br/>
                    <DataLegend text={"36h"}  className="textMedium" />
                        </li>


                        <li>
                    <DataLegend text={"Suspicius activity"}  className="textSmall" /><br/>
                    <DataLegend text={"-"}  className="textMedium" />
                        </li>
                    </ul>
                <div className="w-full mb-6" style={{zIndex:1}}>
                <div className="w-full" style={{height: "180px"}}>
                 
                    <PredictionChart />
                </div>
                <ul className="flex gap-8 items-center justify-start my-2">
                    <li>
                    <input type="text" id="default-input"  className="bg-gray-50 border border-gray-300 text-gray-900 text-base font-mono rounded-lg focus:ring-1 focus:ring-purple-400 dark:focus:ring-purple-800 focus:outline-none block w-full p-2.5 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-gray-200  dark:focus:border-purple-500"   />
                   </li><li>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Check wallet
                </button>
                </li></ul>
                </div>
                <div className="w-full flex flex-col gap-1">
                <div className="block">
                    <DataLegend text={"Account Balance"} />
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">$ 1,3325.22</h3>
                    <ul className="flex gap-2 items-center justify-start my-2">
                        <li><Badgde text="Kyc like" type="positive" /></li>    
                        <li><Badgde text="Active" type="neutral" /></li>    
                        <li><Badgde text="No flagged" type="negative" /></li>    
                    </ul>
                </div>
                </div>
                </div>
            </div>
            
            <div className="md:w-1/2 lg:w-1/3 w-full flex flex-col items-start h-[450px] md:h-[500px] gap-2 justify-start px-4 py-6 bg-white dark:bg-gray-900/50 rounded-2xl hover:shadow-sm transition-all duration-300 border border-gray-200 dark:border-gray-800 relative">
                <h3 className="text-2xl md:text-3xl font-medium">Stablecoins Volumes</h3>
                
                <div className="flex flex-col gap-0 items-start justify-start">
                <ul className="flex gap-8 items-center justify-start my-2">
                    <li>
                    <DataLegend text={"Market Cap"}  className="textSmall" /><br/>
                    <DataLegend text={"$218.43B"}  className="textMedium" />
                        </li>
                        
                        <li>
                    <DataLegend text={"Monthly Transfer Volume"}  className="textSmall" /><br/>
                    <DataLegend text={"$2.90T"}  className="textMedium" />
                        </li>

                    
                        <li>
                    <DataLegend text={"Active Addresses"}  className="textSmall" /><br/>
                    <DataLegend text={"26.54M"}  className="textMedium" />
                        </li>

                        <li>
                    <DataLegend text={"Holders"}  className="textSmall" />
                    <DataLegend text={"+3.65"}  className="textSmallGreen" /><br/>
                    <DataLegend text={"147.07M"}  className="textMedium" />
                        </li>

                    </ul>
                </div>
                <div className="w-full flex items-center justify-center my-4">
                <LiquidityChart />
                </div>
            </div>
        
        </div>
        <Bottom />
    </section>
  )
}

export default Main