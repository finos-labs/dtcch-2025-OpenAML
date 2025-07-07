import Header from "./components/Header"
import Wrapper from "./components/Wrapper"
import ThemeContextProvider from "./hooks/useTheme"

function App() {

  return (
    <>
    <ThemeContextProvider>
      <Header />
      <Wrapper />
    </ThemeContextProvider>
    </>
  )
}

export default App
