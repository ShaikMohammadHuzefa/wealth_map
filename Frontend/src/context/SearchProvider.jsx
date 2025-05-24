import { useState } from "react";
import { SearchContext } from "./SearchContext"; // Importing context

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
            {children}
        </SearchContext.Provider>
    );
}
