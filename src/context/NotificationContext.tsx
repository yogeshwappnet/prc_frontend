import React, { useState } from "react";
// interface IContextProps {
//   message: string;
//   setMessage: ({ type }: { type: string }) => void;
//   typemessage: string;
//   setTypeMessage: ({ type }: { type: string }) => void;
//   loading: string;
//   setLoading: ({ type }: { type: string }) => void;
// }

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
