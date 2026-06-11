import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    fetch("/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching message:", error));
  }, []);

  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline">
        {message || "Loading..."}
      </h1>
      <Button className="mt-4" onClick={() => alert("Button clicked!")}>
        Click Me
      </Button>
    </div>
  );
}

export default App;
