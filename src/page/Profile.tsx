import useAuthStore from "../store/auth";

function Profile(){
    const { email, token } = useAuthStore();

    return (
        <>
            <h1>{email}</h1>
            <h1>{token}</h1>
        </>
    );
}

export default Profile;