import { useState, useEffect } from "react";
interface User {
     id: string;
     name: string;
     email: string;
     isAdmin: boolean;
     // ... properti lain
   }
   
   const useDummyAuth = () => {
     const [user, setUser] = useState<User | null>(null); // Tipe eksplisit untuk user
     const [isLoading, setIsLoading] = useState(true);
   
     useEffect(() => {
       const storedUser = localStorage.getItem('dummyUser');
       if (storedUser) {
         setUser(JSON.parse(storedUser) as User); // Type assertion saat parsing
       }
       setIsLoading(false);
     }, []);
   
     const login = (userData: User) => { // Menentukan tipe userData
       setUser(userData);
       localStorage.setItem('dummyUser', JSON.stringify(userData));
     };
   
     const logout = () => {
       setUser(null);
       localStorage.removeItem('dummyUser');
     };
   
     return { user, login, logout, isLoading };
   };
   
   export default useDummyAuth;