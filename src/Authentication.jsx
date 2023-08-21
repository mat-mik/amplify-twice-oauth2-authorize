import {Amplify, Auth} from 'aws-amplify';
import {useEffect, useState} from "react";

window.LOG_LEVEL = 'DEBUG';

const amplify_config = {
    Auth: {
        region: process.env.REACT_APP_AMPLIFY_CONFIG_AUTH_REGION,
        userPoolId: process.env.REACT_APP_AMPLIFY_CONFIG_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_AMPLIFY_CONFIG_USER_POOL_WEB_CLIENT_ID,
        oauth: {
            domain: process.env.REACT_APP_AMPLIFY_CONFIG_OAUTH_DOMAIN,
            scope: ['email', 'openid'],
            redirectSignIn: process.env.REACT_APP_AMPLIFY_CONFIG_OAUTH_REDIRECT_SIGN_IN_URL,
            redirectSignOut: process.env.REACT_APP_AMPLIFY_CONFIG_OAUTH_REDIRECT_SIGN_OUT_URL,
            responseType: 'code',
        }
    },
};
Amplify.configure(amplify_config);

const Authentication = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const isValidSession = async () => {
            try {
                const session = await Auth.currentSession();
                return session.isValid();
            } catch {
                return false;
            }
        };

        const login = async () => {
            Auth.signOut({global: true}).finally(() => {
                const customProvider = process.env.REACT_APP_AMPLIFY_CONFIG_USER_POOL_PROVIDER || '';
                Auth.federatedSignIn({customProvider});
            });
        }

        const initiateOAuth = async () => {
            if (await isValidSession()) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                login();
            }
        };

        initiateOAuth();
    }, []);

    return <>{isLoggedIn && children}</>;
}

export default Authentication;