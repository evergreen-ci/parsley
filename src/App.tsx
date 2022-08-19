import { useState } from "react";
import SearchBar from "components/SearchBar";

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button
          data-cy="app-button"
          onClick={() => setCount((c) => c + 1)}
          type="submit"
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <SearchBar />
    </div>
  );
};

export default App;
