import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../ui/searchbar";

export function FuzzyishSearchBar() {
    const [userInput, setUserInput] = useState<string>();
    const navigate = useNavigate();

    function handleEventSearch(e: FormEvent<Element>): void {
        e.preventDefault();
        navigate(`/events/search/${userInput}`)

    }

    return (
        <form name="event-query" className="ml-auto flex-1 sm:flex-initial" onSubmit={(e: FormEvent) => handleEventSearch(e)}>
            <div className="relative flex items-center text-muted-foreground focus-within:text-black">
                <SearchBar
                    id="event-query"
                    type="search"
                    className="pl-8 left-2.5 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    defaultValue={userInput || ''}
                    placeholder="Search for events..."
                    onChange={(e)=>{
                        setUserInput(e.target.value)
                    }}
                />
            </div>
        </form>
    )
}