import { createContext, use, useContext, useEffect, useState } from 'react';
import type { User } from '~/types';
import { queryClient } from './React-query-provider';
import { useLocation, useNavigate } from 'react-router';
import { publicRoutes } from '~/lib';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const navigate = useNavigate();
    const cuurrentPath = useLocation().pathname;
    const ispublicRoute = publicRoutes.includes(cuurrentPath);

    //check if user is authenticated
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);


            const userInfo = localStorage.getItem('user');
            if (userInfo) {
                setUser(JSON.parse(userInfo));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                if (!ispublicRoute) {
                    navigate('/signin');
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);


    useEffect(() => {
        const handleLogout = () => {
            logout();
            navigate('/signin');
        };
        window.addEventListener('force-logout', handleLogout);
        return () => {
            window.removeEventListener('force-logout', handleLogout);
        };
    }, []);


    const login = async (data: any) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        // console.log('User logged in:', data.user);
    };
    const logout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        queryClient.clear();
        // console.log('User logged out');
    };

    const values = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout
    };

    return (<AuthContext.Provider value={values}>
        {children}
    </AuthContext.Provider>);
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};