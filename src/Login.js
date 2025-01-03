import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = ({ onLoginSuccess }) => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Decode the credential JWT to extract user info
      const decodedCredential = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      const userInfo = {
        name: decodedCredential.name,
        email: decodedCredential.email,
      };

      console.log('Decoded User Info:', userInfo);

      // Send the credential to the backend for further verification
      const response = await fetch('http://localhost:5000/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Backend Authentication Success:', data);
        onLoginSuccess(userInfo); // Trigger the parent component's login success handler
      } else {
        console.error('Backend Authentication Failed:', await response.text());
      }
    } catch (error) {
      console.error('Error during Google Login:', error);
    }
  };

  const handleGoogleFailure = () => {
    console.error('Google Login Failure');
  };

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REACT_APP_KAKAO_REDIRECT_URI)}&response_type=code`;
    window.location.href = kakaoAuthUrl; // Redirect to Kakao Auth URL
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
        <button onClick={() => console.log('Naver Login not implemented yet')}>Login with Naver</button>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
