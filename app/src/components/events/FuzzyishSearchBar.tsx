import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

export function FuzzyishSearchBar() {
    const [userInput, setUserInput] = useState<string>();
    const navigate = useNavigate();

    function handleEventSearch(e: FormEvent<Element>): void {
        e.preventDefault();
        console.log(userInput)
        navigate(`/events/search/${userInput}`)
        window.location.reload()
        
    }

    return (
        <form name="event-query" className="ml-auto flex-1 sm:flex-initial" onSubmit={(e: FormEvent) => handleEventSearch(e)}>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
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