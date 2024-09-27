import React, { useEffect, useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";

const useLoggedinuser = () => {
  const { user } = useUserAuth();
  const email = user?.email;
  const [loggedinuser, setloggedinuser] = useState({});

  useEffect(() => {
    if (email) {
      fetch(`http://localhost:5000/loggedinuser?email=${email}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          setloggedinuser(data);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, [email]);

  return [loggedinuser, setloggedinuser];
};

export default useLoggedinuser;
