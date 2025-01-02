import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = ({ onLoginSuccess }) => {
    const handleGoogleSuccess = (credentialResponse) => {
        const decodedCredential = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
        const userInfo = {
            name: decodedCredential.name,
            email: decodedCredential.email,
        };
        onLoginSuccess(userInfo);
    };

    const handleGoogleFailure = () => {
        console.error('Google Login Failure');
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div className="login-container">
                <h2>Login</h2>
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleFailure}
                />
                <button>Login with Kakao</button>
                <button>Login with Naver</button>
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
