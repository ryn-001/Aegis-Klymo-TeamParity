import {Route,Routes} from "react-router";
import LandingPage from "./components/LandingPage/LandingPage";
import Interests from "./components/Interests/Interests";
import Matching from "./components/Matching/Matching";
import Chat from "./components/Chat/Chat";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<LandingPage />}/>
        <Route path="/matching" element={<Matching />}/>
        <Route path="/interests" element={<Interests />}/>
        <Route path="/chat" element={<Chat />}/>
      </Routes>
    </div>
  );
}

export default App;