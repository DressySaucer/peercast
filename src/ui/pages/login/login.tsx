import React, { useState } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(password);

        // await new Promise(r => setTimeout(r, 500))

        // navigate('/remote')
    };

    const googleLogin = () => {
        const url = "https://accounts.google.com/o/oauth2/v2/auth";

        const form = document.createElement("form");
        form.setAttribute("method", "GET");
        form.setAttribute("action", url);

        const params = {
            client_id:
                "153453342514-dpdp2bnenfvthtch1uj7cgs5erb462si.apps.googleusercontent.com",
            redirect_uri: "https://youtube.com",
            response_type: "token",
            scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
            include_granted_scopes: "true",
            state: "pass-through value",
        };

        let p: keyof typeof params;
        for (p in params) {
            var input = document.createElement("input");
            input.setAttribute("type", "hidden");
            input.setAttribute("name", p);
            input.setAttribute("value", params[p]);
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    placeholder="Enter email"
                ></input>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    placeholder="Enter password"
                ></input>
                <button type="button" onClick={googleLogin}></button>
                <button type="submit"></button>
            </form>
        </>
    );
};

export default Login;
