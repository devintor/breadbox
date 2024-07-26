import { levenshteinDistance } from "./Levenshtein";
import data from "./events.json"
import { db } from "../../config/firebase-config";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { FormEvent, useEffect, useState } from "react";
import { collection, getDocs, where, query, Query, QueryConstraint } from "firebase/firestore";

export function FuzzyishSearchBar() {
    const [userInput, setUserInput] = useState<string>();
    const [query, setQuery] = useState<any>();

    // async function constructQuery(matchedOptions: any) {
    //     const eventsRef = collection(db, "Events");
        
    //     const queryConditions: QueryConstraint[] = matchedOptions.map((field) => 
    //         where(field, "in", )
    //     );


    //     const querySnap = await getDocs(query(eventsRef, where(field, "==", option)));
        
    //     if (matchedOptions.food.length > 0) {
    //       query = query.where('food', 'in', matchedOptions.food);
    //     }
    //     if (matchedOptions.company.length > 0) {
    //       query = query.where('company', 'in', matchedOptions.company);
    //     }
    //     if (matchedOptions.time.length > 0) {
    //       query = query.where('time', 'in', matchedOptions.time);
    //     }
    //     if (matchedOptions.setting.length > 0) {
    //       query = query.where('setting', 'in', matchedOptions.setting);
    //     }
    //     return query;
    //   }

    function tokenize(userInput: string | undefined) {
        if (userInput) {
            // const tokens = userInput.toLowerCase().split(/\W+/)
            // console.log(tokens.filter(token=>token.length>2))
            // return userInput.split(/\W+/);

            const tokens = userInput.toLowerCase().split(/\W+/);
            const result = [];
            for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].length <= 2) {
                if (result.length > 0) {
                result[result.length - 1] += tokens[i];
                }
            } else {
                result.push(tokens[i]);
            }
            }
            console.log(result)
            return result;
        }

        
    }

    function determineMatch(acc: string[], token: string, option: string) {
        let distanceOptions:any[] = [];

        option.split(' ').map((value: string, index: number) => {
            console.log(value)
            distanceOptions.push(levenshteinDistance(token, option.split(' ')[index]?.toLowerCase()))
        })
        const distance = Math.min(...distanceOptions)

        console.log(distance)
        

        const contains = option.toLowerCase().includes(token)
        console.log(distance)
        
        if (distance < 2 || contains) { // adjust the threshold as needed
            acc.push(option);
        }
        return acc;
    }

    function matchOptions(tokens: string[] | undefined) {
        var matchedFood;
        var matchedCompany;
        var matchedTime;
        var matchedSetting;

        if (tokens) {
            tokens.forEach((token) => {
                matchedFood = data.foodOptions.reduce((acc: string[], option) => {
                    return determineMatch(acc, token, option)
                }, []);
                // matchedCompany = data.companyOptions.reduce((acc: string[], option) => {
                //     const distance = (Math.min(
                //         levenshteinDistance(token, option.toLowerCase()), 
                //         levenshteinDistance(token, option[0].toLowerCase()),
                //         levenshteinDistance(token, option[1].toLowerCase())
                //     ));
                        
                //     const contains = option.toLowerCase().includes(token)
                //     console.log(distance)
                //     if (distance < 2 || contains) { // adjust the threshold as needed
                //         acc.push(option);
                //     }
                //     return acc;
                // }, []);

            })
            
            // for each token in tokens
                // if token is found in foodoptions/companyoptions/timeoptions/settingoptions
                    // set keyword match
                // if is within threshold of ...
                    // set keyword match




        }





        // if (userInput) {
        //     const matchedFood = data.foodOptions.reduce((acc: string[], option) => {
        //         const distance = levenshteinDistance(userInput.toLowerCase(), option.toLowerCase());
        //         const contains = new RegExp(userInput.slice(0,3), "i").test(option.toLowerCase())
  
        //         console.log(distance)
        //         if (distance < 3 || contains) { // adjust the threshold as needed
        //             acc.push(option);
        //         }
        //         return acc;
        //       }, []);
    
        //     const matchedCompany = data.companyOptions.reduce((acc: string[], option) => {
        //         const distance = levenshteinDistance(userInput.toLowerCase(), option.toLowerCase());
        //         console.log(distance)
        //         if (distance < 3) { // adjust the threshold as needed
        //             acc.push(option);
        //         }
        //         return acc;
        //       }, []);
    
        //     const matchedTime = data.timeOptions.reduce((acc: string[], option) => {
        //         const distance = levenshteinDistance(userInput.toLowerCase(), option.toLowerCase());
        //         console.log(distance)
        //         if (distance < 3) { // adjust the threshold as needed
        //             acc.push(option);
        //         }
        //         return acc;
        //       }, []);
    
        //     const matchedSetting = data.settingOptions.reduce((acc: string[], option) => {
        //         const distance = levenshteinDistance(userInput.toLowerCase(), option.toLowerCase());
        //         console.log(distance)
        //         if (distance < 3) { // adjust the threshold as needed
        //             acc.push(option);
        //         }
        //         return acc;
        //       }, []);
            
              console.log({ food: matchedFood, company: matchedCompany, time: matchedTime, setting: matchedSetting })
              return { food: matchedFood, company: matchedCompany, time: matchedTime, setting: matchedSetting };
        // }
        
    }

    function handleEventSearch(e: FormEvent<Element>): void {
        e.preventDefault();
    }

    useEffect( ()=> {
        matchOptions(tokenize(userInput))
    }, [userInput])


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