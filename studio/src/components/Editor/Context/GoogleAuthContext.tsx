import { GoogleOAuthProvider, hasGrantedAllScopesGoogle } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import React from 'react';

interface GoogleAuthContextProps {
    signedIn: boolean;
    setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    credetials: string;
    setCredentials: React.Dispatch<React.SetStateAction<string>>;
}

const context = React.createContext<GoogleAuthContextProps>({} as GoogleAuthContextProps);

export function GoogleAuthContext(props: { children: React.ReactNode }) {
    const [signedIn, setSignedIn] = React.useState(false);
    const [credetials, setCredentials] = React.useState<string>('');

    //TODO remove hardceded api key

    return (
        <context.Provider
            value={{
                signedIn,
                setSignedIn,
                credetials,
                setCredentials,
            }}
        >
            <GoogleOAuthProvider clientId="638999767324-78f7eknctpeohqkr6dd7grdml3n136eu.apps.googleusercontent.com">
                {props.children}
            </GoogleOAuthProvider>
        </context.Provider>
    );
}

export function useUserSignIn(): [boolean, (credential: any) => void] {
    const ctx = React.useContext(context);

    const signIn = async (credentials: any) => {
        ctx.setCredentials(credentials);
        ctx.setSignedIn(true);
        console.log(credentials);
        console.log(hasGrantedAllScopesGoogle(credentials, 'auth/drive.file'));

        //use the google.client library
        gapi.load('client', async () => {
            console.log('loaded client', gapi.client);
            //load the sheets api
            await gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4');
            console.log(gapi.client.sheets);

            const table = await gapi.client.sheets.spreadsheets.get({
                key: //insert API key here
                spreadsheetId: '1QrmnalohimhIqQ_3xQTBjZmEj5yjjsvDXy4O_H2-jWU',
                access_token: credentials.access_token,
            });

            console.log(JSON.parse(table.body));
        });
    };

    return [ctx.signedIn, signIn];
}
