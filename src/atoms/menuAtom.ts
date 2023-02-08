import { IconType } from "react-icons";
import { CgFeed } from "react-icons/cg";
import { atom } from "recoil";


export type MenuItem = {
    icon: IconType;
    textShown: string;
    link: string;
    imageURL?: string;
    iconColor: string;
};


interface MenuState {
    open: boolean;
    clickedMenuItem: MenuItem;
};

export const defaultItem: MenuItem = {
    textShown: "Your Feed",
    link: "/",
    icon: CgFeed,
    iconColor: "black",
};

export const defaultMenuState: MenuState = {
    open: false,
    clickedMenuItem: defaultItem,
};

export const menuState = atom<MenuState> ({
    key: "menuState",
    default: defaultMenuState,
})