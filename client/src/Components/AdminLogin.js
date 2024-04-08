import React, {useState, useRef} from "react";

export default function AdminLogin({isAuthenticated, setAuthenticated, setToken, api}) {

    let [password, setPassword] = useState("");
    let password_input = useRef(null);

    let handleLogin = (e)=> {
        e.preventDefault();

        api.post("/api/get_token", {
            password
        }).then((res) => {
            if(res.status == 200){
                setToken(res.data.token);
                setAuthenticated(true);
            } else {
                alert("Login failed. Please try again.")
            }
        }).catch((err) => {
            alert(err)
        })

        password_input.current.value = "";
        setPassword("");
        // alert(password + isAuthenticated);
    }

    return (
    <div className="text-center ">
        <div className='text-center text-2xl border-t p-3 '>Log in</div>

        <form onSubmit={handleLogin} className="p-3" target="">
            <input type="password" ref={password_input} placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="rounded-lg border-2 my-2 mx-4"/>
            <button type="submit" className="rounded-lg bg-sky-500 py-1 px-2">Login</button>
        </form>
    </div>
    );
}