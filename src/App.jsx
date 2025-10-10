import { useContext } from "react";
import { RoutesMain } from "./routes";
import { ToastContainer } from "react-toastify";
import { UserContext } from "./providers/UserContext";
import { Loading } from "./components/Loading";
import { ModelDetailsModal } from "./components/modals/ModelDetailsModal";

function App() {
  const { loading } = useContext(UserContext);

  return (
    <>
      {loading ? <Loading /> : <RoutesMain />}
      <ToastContainer autoClose={3 * 1000} />
      <ModelDetailsModal />
    </>
  );
}

export default App;
