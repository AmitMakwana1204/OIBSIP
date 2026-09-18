import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Verification token is missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );

        const data = await response.json();

        if (response.ok) {
          setSuccess(true);
          setMessage(data.message);
        } else {
          setMessage(data.message || "Email verification failed.");
        }
      } catch (error) {
        console.error(error);
        setMessage("Unable to connect to server.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>{success ? "Email Verified 🎉" : "Email Verification"}</h1>
      <p>{message}</p>
    </div>
  );
};

export default VerifyEmail;