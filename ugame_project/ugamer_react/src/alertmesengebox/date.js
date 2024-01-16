
import { createContext, useState, useContext } from "react";

// Create a context for datetime
export const DatetimeContext = createContext();

// Create a provider component
export const DatetimeProvider = ({ children }) => {
  const [datetime, setDatetime] = useState(() => {
    // Calculate the initial datetime value
    const showdate = new Date();
    const displaydate =
      showdate.getDate() + "/" + (showdate.getMonth() + 1) + "/" + showdate.getFullYear();
    return displaydate;
  });

  return (
    <DatetimeContext.Provider value={{ datetime, setDatetime }}>
      {children}
    </DatetimeContext.Provider>
  );
};

// Create a custom hook to access the datetime context
export const useDatetime = () => {
  return useContext(DatetimeContext);
};
