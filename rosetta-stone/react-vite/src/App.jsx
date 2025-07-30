import { useEffect, useRef, useState } from 'react';
import { viz } from './viz';
function App() {
  const ref = useRef(null);
  const [state, setState] = useState({});

  useEffect(() => {
    const container = ref.current;
    viz(container, { state, setState });
  }, [state, setState]); // Added setState to dependency array as it's used in the effect

  return <div className="viz-container" ref={ref}></div>;
}

export default App;
