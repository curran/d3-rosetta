import { useEffect, useRef } from "react";
import { main } from "./viz";
function App() {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    main(container);
  }, []);

  return <div className="viz-container" ref={ref}></div>;
}

export default App;
