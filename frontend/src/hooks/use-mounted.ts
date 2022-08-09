import React, { useRef, useEffect } from "react";

const useMounted = () => {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
};

export default useMounted;
