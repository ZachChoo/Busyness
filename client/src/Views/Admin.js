import React, { useEffect, useState } from 'react';
import AdminBuildingActions from '../Components/AdminBuildingActions';
import AdminRoomActions from '../Components/AdminRoomActions';
import AdminTable from '../Components/AdminTable';
import AdminLogin from '../Components/AdminLogin'
import Header from '../Components/Header';
import MobileMenu from '../Components/MobileMenu';

import {api} from '../Api/api';

export default function Admin() {

    let [isAuthenticated, setAuthenticated] = useState(false);
    let [token, setToken] = useState("");

    api.interceptors.response.use(response => {
        return response;
     }, error => {
       if (error.response.status === 401) {
        setAuthenticated(false);
        setToken("");
       }
       return error;
     });

     useEffect(() => {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
     }, [token]);

    useEffect(async () => {
        api.get("/api/is_authenticated",{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then((res) => {
              if (res.data.authenticated) setAuthenticated(true);
        }).catch((err) => null);
    }, []);

    return (
    <div>
        <Header />
        <MobileMenu />
        <div className='text-center text-4xl border-t p-3 pb-8'>Admin Page</div>
        {!isAuthenticated ? 
        <AdminLogin isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} api={api} setToken={setToken}/>
        : 
        <>
            <AdminBuildingActions api={api}/>
            <AdminRoomActions api={api}/>
            <AdminTable />
        </>}
    </div>
    );
}