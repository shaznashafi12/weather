import './App.css';
import Weath from './Weath';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Routes>     
       <Route path='/' element={<Weath/>}></Route>
      </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;
