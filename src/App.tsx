import { Routes, Route } from "react-router-dom"
import Layout from "./pages/Layout"
import Cocomo from "./pages/Cocomo"
import CocomoTwo from "./pages/CocomoTwo"
import FunctionPoint from "./pages/FunctionPoint"
import NoPage from "./pages/NoPage"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Cocomo/>}/>
          <Route path="cocomo" element={<Cocomo/>}/>
          <Route path="cocomo-two" element={<CocomoTwo/>}/>
          <Route path="function-point" element={<FunctionPoint/>}/>
          <Route path="*" element={<NoPage/>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
