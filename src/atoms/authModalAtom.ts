import { atom } from "recoil";

export interface AuthModalState {
    open: boolean; // is it open T or F
    view: "login" | "signup" | "resetPassword"; // view avaliable when pressed
}

// on default: modal is closed
const defaultMState: AuthModalState = {
    open: false,
    view: "login",
};

export const authModalState = atom<AuthModalState>({
    key: 'authModalState',
    default: defaultMState,
});