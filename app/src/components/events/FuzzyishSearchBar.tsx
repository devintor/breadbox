import { levenshteinDistance } from "./Levenshtein";
import data from "./events.json"
import { db } from "../../config/firebase-config";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { FormEvent, useState } from "react";

export function FuzzyishSearchBar() {
    const [userInput, setUserInput] = useState<string>();

    function handleEventSearch(e: FormEvent<Element>): void {
        e.preventDefault();
        const matchedFood = data.foodOptions.reduce((acc: string[], option) => {
            const distance = levenshteinDistance(userInput, option);
            if (distance < 3) { // adjust the threshold as needed
                acc.push(option);
            }
            return acc;
          }, []);

        const matchedCompany = data.companyOptions.reduce((acc: string[], option) => {
            const distance = levenshteinDistance(userInput, option);
            if (distance < 3) { // adjust the threshold as needed
                acc.push(option);
            }
            return acc;
          }, []);

        const matchedTime = data.timeOptions.reduce((acc: string[], option) => {
            const distance = levenshteinDistance(userInput, option);
            if (distance < 3) { // adjust the threshold as needed
                acc.push(option);
            }
            return acc;
          }, []);

        const matchedSetting = data.settingOptions.reduce((acc: string[], option) => {
            const distance = levenshteinDistance(userInput, option);
            if (distance < 3) { // adjust the threshold as needed
                acc.push(option);
            }
            return acc;
          }, []);
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
                        console.log(e.target.value)
                    }}
                />
            </div>
        </form>
    )
}