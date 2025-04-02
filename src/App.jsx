import { RoutesMain } from "./routes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <RoutesMain />
      <ToastContainer autoClose={3 * 1000} />
    </>
  );
}

export default App;
