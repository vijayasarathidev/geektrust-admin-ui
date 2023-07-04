import { useEffect, useState } from "react";
import LandingPage from "./components/LandingPage";
import config from "./conf/config.js";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsersData();
  }, []);

  const getUsersData = async () => {
    try {
      const response = await axios.get(config.endpoint);
      console.log(response.data);
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  return <LandingPage users={users} setUsers={setUsers} />;
}

export default App;
