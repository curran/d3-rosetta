import { useEffect, useRef, useState } from "react";
import { main } from "./viz";
function App() {
  const ref = useRef(null);
  const [state, setState] = useState({});

  useEffect(() => {
    const container = ref.current;
    main(container, { state, setState });
  }, [state]);

  return <div className="viz-container" ref={ref}></div>;
}

export default App;
