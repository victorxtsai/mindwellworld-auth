import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccountAccess from './pages/AccountAccess';

// path "/" means default, if you want another ending, then like "/profile" or something...
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccountAccess />} />
      </Routes>
    </Router>
  );
}

export default App;