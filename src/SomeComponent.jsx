import {Auth} from "aws-amplify";

const SomeComponent = () => {

    const someAlert = async () => {
        const cognitoUserSession = await Auth.currentSession();
        alert(cognitoUserSession.getAccessToken().getJwtToken());
    }


    return (
        <button onClick={someAlert}/>
    )
}

export default SomeComponent;