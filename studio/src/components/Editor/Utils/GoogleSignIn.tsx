import { useGoogleLogin } from '@react-oauth/google';

import { useUserSignIn } from '@editor/Context/GoogleAuthContext';

export function GoogleSignInScreen() {
    const [signedIn, signIn] = useUserSignIn();

    const handleError = () => {
        //TODO handle this
        console.log('Google login failed');
    };

    const googleLogin = useGoogleLogin({
        onSuccess: signIn,
        onError: handleError,
        scope: 'https://www.googleapis.com/auth/drive.file',
    });

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <button onClick={() => googleLogin()}>Login with google</button>
        </div>
    );
}
