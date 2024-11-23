import { BrowserRouter, Routes, Route } from "react-router";
import Home from '../src/pages/home/Home';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
