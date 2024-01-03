import React, { useEffect, useState } from "react";

const useHook = () => {
  const [check, setCheck] = useState("");
  useEffect(() => {
    alert("hy i run fast");
    setTimeout(() => {
      setCheck(5);
    }, 3000);
  }, []);
  return { check };
};

export default useHook;
