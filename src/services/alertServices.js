import { useSnackbar } from "@/composables/snackbar";

class AlertService {
    constructor() {
        this.snackbar = useSnackbar();
    }

    success(message){
        this.snackbar.show(message, 'var(--success-color)');
    }

    warning(message){
        this.snackbar.show(message, 'var(--warning-color)');
    }

    info(message){
        this.snackbar.show(message, 'var(--info-color)');
    }

    error(message) {
        this.snackbar.show(message, 'var(--error-color)'); 
    }

    clear(){
        this.snackbar.snackbar.open = false;
    }
}

export const alertService = new AlertService();