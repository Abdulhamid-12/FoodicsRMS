import Vue from 'vue';

const snackbar = Vue.observable({
    open: false,
    message: '',
    color: 'var(--success-color)',
    time: 5000
});

export const useSnackbar = () => {

    const show = (message, color, time = 5000) => {
        snackbar.open = true;
        snackbar.message = message;
        snackbar.color = color;
        
        setTimeout(() => {
            snackbar.open = false;
        }, time);
    }

    return { snackbar, show };
};