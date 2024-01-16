import { createContext } from "react";
import Swal from "sweetalert2";

export const AlertContext = createContext();

export const msgbox = async () => {
    const CFR = await Swal.fire({
        title: 'Do you want to update the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Update',
        denyButtonText: `Don't Update`,
        color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
        background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
    return CFR;
};
export const logoutsuccess = async () => {
    const CFR = await Swal.fire({
        title: 'You Have Been Logout!',
        icon: 'success',
        color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
        background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
    return CFR;
};
export const logoutmsg = async () => {
    const CFR = await Swal.fire({
        title: 'Are you sure?',
        text: "Logout Your Account",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Logout',
        color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
        background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
    return CFR;
};

export const alertInsert = async () => {
    const CFR = await Swal.fire({
        title: 'Do you wish save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Dont save`,
        color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
        background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
    return CFR;
}

export const Remove = async () => {
    const CFR = await Swal.fire({
        title: 'Do you wish delete the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: `Dont Delete`,
        color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
        background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
    return CFR;
}
//////////// response control//////////////////////////
export const save = () => {
    Swal.fire({
        title: 'Saved!',
        icon: 'success',
        color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
        background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
};

export const unsave = () => {
    Swal.fire({
        title: 'Changes are not saved!',
        icon: 'info',
        color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
        background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
};
export const error = () => {
    Swal.fire({

        title: 'Something went wrong please check the issue !',
        icon: 'error',
        color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
        background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
};
export const errorOutStock = () => {
    Swal.fire({
        title: 'OutStock !',
        icon: 'error',
        color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
        background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
};
export const organize = () => {
    Swal.fire({
        title: 'Please insert all values!',
        icon: 'warning',
        color: localStorage.getItem('darkMode') === 'true' ? 'white' : '',
        background: localStorage.getItem('darkMode') === 'true' ? '#555555' : '#fff',
    });
};

export const AlertProvider = ({ children }) => {
    // Provide the context values here
    const value = {
        logoutmsg,
        logoutsuccess,
        msgbox,
        alertInsert,
        save,
        unsave,
        Remove,
        error,
        errorOutStock,
        organize,
    };

    return (
        <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
    );
};