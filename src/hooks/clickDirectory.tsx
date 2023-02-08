import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { AiOutlineStock } from 'react-icons/ai';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MenuItem, menuState } from '../atoms/menuAtom';
import { trackerCurrent } from '../atoms/trackerAtom';



const clickDirectory = () => {
    
    const [directoryState, setDirectoryState] = useRecoilState(menuState);
    const router = useRouter();
    const trackerStateValue = useRecoilValue(trackerCurrent);


    const clickedMenuItem = (menuItem: MenuItem) => {
        setDirectoryState((prev) => ({
            ...prev,
            clickedMenuItem: menuItem
        }));

        router.push(menuItem.link); // go to page
        if (directoryState.open) {
            makeMenuOpen(); // close the menu
        }

    }


    const makeMenuOpen = () => {
        setDirectoryState((prev) => ({
            ...prev,
            open: !directoryState.open,
        }))
    }


    useEffect(() => {

        const { currentTracker } = trackerStateValue;

        if (currentTracker) {
            setDirectoryState((prev) => ({
                ...prev,
                clickedMenuItem: { 
                    textShown: `@${currentTracker.id}`, 
                    link:  `/$/${currentTracker.id}`,
                    imageURL: currentTracker.imageURL,
                    icon: AiOutlineStock,
                    iconColor: "blue.500",
                },
            }))
        }


    }, [trackerStateValue.currentTracker]);



    return { directoryState, makeMenuOpen, clickedMenuItem };
}
export default clickDirectory;