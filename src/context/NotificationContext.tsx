import React, { useState } from "react";

export const NotificationContext = React.createContext<any>({});

export const NotificationContextProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const [typeMessage, setTypeMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <NotificationContext.Provider
      value={{
        message,
        setMessage,
        typeMessage,
        setTypeMessage,
        loading,
        setLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
