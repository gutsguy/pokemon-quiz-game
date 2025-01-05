import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const query = new URLSearchParams(window.location.search);
  const handleGoogleSuccess = async credentialResponse => {
    try {
      // Decode the credential JWT to extract user info
      const decodedCredential = JSON.parse(
        atob(credentialResponse.credential.split(".")[1])
      );
      const userInfo = {
        name: decodedCredential.name,
        email: decodedCredential.email,
      };

      console.log("Decoded User Info:", userInfo);

      // Send the credential to the backend for further verification
      const response = await fetch(
        "http://localhost:5000/auth/google/callback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Backend Authentication Success:", data);
      } else {
        console.error("Backend Authentication Failed:", await response.text());
      }
    } catch (error) {
      console.error("Error during Google Login:", error);
    }
  };

  const handleGoogleFailure = () => {
    console.error("Google Login Failure");
  };

  const handleKakaoLogin = () => {
    // 서버 로그인 URL로 리다이렉트
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/kakao?redirect=${
      window.location.origin + (query.get("redirect") || "/")
    }`;
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="login-container">
        <h2>Login</h2>
        {/* Google Login */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
        />
        {/* Kakao Login */}
        <button onClick={handleKakaoLogin}>Login with Kakao</button>
        <button onClick={() => console.log("Naver Login not implemented yet")}>
          Login with Naver
        </button>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
