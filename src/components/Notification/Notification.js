import { Bounce, toast } from 'react-toastify';

export const Success = (message, autoClose=3000) => {

    toast.success(message, {
        position: "top-right",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
    });
};

export const Error = (message, autoClose=5000) => {

    toast.error(message, {
        position: "top-right",
        autoClose: autoClose,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        transition: Bounce
    });
};

