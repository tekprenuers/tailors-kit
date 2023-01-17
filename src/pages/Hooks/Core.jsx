import { useEffect, useState } from "react";

export default function Core() {

    const LoadExternalScript = (url) => {
        let [state, setState] = useState(url ? "loading" : "idle");

        useEffect(() => {
            if (!url) {
                setState("idle");
                return;
            }
            let script = document.querySelector(`script[src="${url}"]`);

            const handleScript = (e) => {
                setState(e.type === "load" ? "ready" : "error");
            };

            if (!script) {
                script = document.createElement("script");
                script.type = "application/javascript";
                script.src = url;
                script.async = false;
                document.body.appendChild(script);
                script.addEventListener("load", handleScript);
                script.addEventListener("error", handleScript);
            }

            script.addEventListener("load", handleScript);
            script.addEventListener("error", handleScript);

            return () => {
                script.removeEventListener("load", handleScript);
                script.removeEventListener("error", handleScript);
            };
        }, [url]);

        return state;
    }

    const loadExternalStyle = (url) => {
        useEffect(() => {
            var head = document.head;
            var link = document.createElement("link");
        
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
        
            head.appendChild(link);
        
            return () => { head.removeChild(link); }
        }, [url]);
    }

    const isAuthenticated = async () => {
        const token = getToken()
        if(token){
            return await fetch(import.meta.env.VITE_BACKEND_URL+`check_token.php?token=${token}`, {
                method: "get",
                mode: "cors"
            })
            .then(res => res.json())
            .then(res => {
                // console.log(res);
                if(res.success){
                    return true
                }else{
                    //delete token
                    localStorage.removeItem('TK::DATA')
                    return false
                }
            })
            .catch(err => {
                console.log(err)
                return false
            })
        }else{
            return false
        }
    }

    const getToken = () => {
        if(localStorage.getItem('TK::DATA')){
            const d = JSON.parse(localStorage.getItem('TK::DATA'));
            if(d['TK::TOKEN']){
                return d['TK::TOKEN']
            }
            return;
        }else{
            return;
        }
    }
    const getUserData = () => {
        if(localStorage.getItem('TK::DATA')){
            const d = JSON.parse(localStorage.getItem('TK::DATA'));
            if(d['TK::USER']){
                return d['TK::USER']
            }
            return;
        }else{
            return;
        }
    }

    const updateUserData = (obj) => {
        if(localStorage.getItem('TK::DATA')){
            const d = JSON.parse(localStorage.getItem('TK::DATA'));
            if(d['TK::USER']){
                //spread and join again
                d['TK::USER'] = {...d['TK::USER'], ...obj};
                localStorage.setItem('TK::DATA', JSON.stringify(d));
                return true
            }
            return;
        }else{
            return;
        }
    }

    const doLogOut = () => {
        localStorage.removeItem('TK::DATA')
        window.location.href = import.meta.env.VITE_FRONTEND_URL+'/login'
    }
    
    const Preloader = () => {
        return(
            <div className="preloader">
                <img src="/loading.webp" width={"200px"} />
            </div>
        )
    }
    return {
        LoadExternalScript, loadExternalStyle, isAuthenticated, getToken, getUserData, updateUserData, doLogOut, Preloader
    }
}