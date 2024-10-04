
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { Chat } from './Components/Chat';

function App() {
  return (
    <div className="App">

      <Router>
        <Routes>
    <Route path='/' element={<Chat/>}/>

        </Routes>
      </Router>

    </div>
  );
}

export default App;
