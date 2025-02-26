import { BrowserRouter as Router } from "react-router-dom";
import AppLayout from "./applayout/applayout";

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
