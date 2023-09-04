import { createContext, useState, useEffect, SetStateAction } from 'react';
import Parse from 'parse/react-native';

interface UserContextProps {
    user: null | Parse.User;
    setUser: React.Dispatch<SetStateAction<Parse.User | null>>;
    handleLogout: (navigation: any) => void;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: any) => {
    const [currentUser, setCurrentUser] = useState<Parse.User | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = await Parse.User.currentAsync();
            setCurrentUser(user || null);
        };

        fetchCurrentUser();
    }, []);

    const handleLogout = async (navigation: any) => {
        await Parse.User.logOut();
        setCurrentUser(null);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <UserContext.Provider value={{ user: currentUser, setUser: setCurrentUser, handleLogout }}>
            {children}
        </UserContext.Provider>

    );
};
