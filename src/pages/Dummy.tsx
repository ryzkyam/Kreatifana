import React from 'react';
import useDummyAuth from '../hooks/useDummyAuth';// Sesuaikan path dengan lokasi file useDummyAuth

const MyComponent = () => {
  const { user, login, logout, isLoading } = useDummyAuth();

  // ... logika komponen Anda

  const handleLogin = () => {
    const dummyUserData = {
      id: '123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      isAdmin: false,
    };
    login(dummyUserData);
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return <div>Loading authentication status...</div>;
  }

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};

export default MyComponent;