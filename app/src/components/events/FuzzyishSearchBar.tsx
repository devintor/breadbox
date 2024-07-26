import { levenshteinDistance } from "./Levenshtein";
import data from "./events.json"
import { db } from "../../config/firebase-config";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { FormEvent, useEffect, useState } from "react";
import { collection, getDocs, where, query, Query, DocumentData, QueryFieldFilterConstraint, or } from "firebase/firestore";

export function FuzzyishSearchBar() {
    const [userInput, setUserInput] = useState<string>();
    const [queryToPerform, setQueryToPerform] = useState<Query<DocumentData>>();

    async function fetchQuery(queryToPerform: Query<DocumentData>) {
        const querySnap = await getDocs(queryToPerform);
        console.log(querySnap.docs)
    }


    function constructQuery(searchTerms: any) {
        
        if (searchTerms) {
            const queryConstraints: QueryFieldFilterConstraint[] = searchTerms.map((condition:any) =>
                where(condition.property, "in", condition.value)
            )

            const eventsRef = collection(db, "Events");
            const queryToPerform: Query<DocumentData> = query(
                eventsRef,
                or(...queryConstraints)
            )
            return queryToPerform
        }
    }

    function tokenize(userInput: string | undefined) {
        if (userInput) {
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
            return result;
        }

        
    }

    function determineMatch(acc: string[], token: string, option: string) {
        let distanceOptions:any[] = [];

        option.split(' ').map((_value: string, index: number) => {
            distanceOptions.push(levenshteinDistance(token, option.split(' ')[index]?.toLowerCase()))
        })
        const distance = Math.min(...distanceOptions)
        
        const contains = option.toLowerCase().includes(token)
        
        if (distance < 2 || contains) { 
            acc.push(option);
        }
        return acc;
    }

    function matchOptions(tokens: string[] | undefined) {
        var matchedFood:string[] = [];
        var matchedCompany:string[] = [];
        var matchedTime:string[] = [];
        var matchedSetting:string[] = [];

        if (tokens) {
            tokens.forEach((token) => {
                matchedFood.push(...data.foodOptions.reduce((acc: string[], option) => {
                    return determineMatch(acc, token, option)
                }, []));
                matchedCompany.push(...data.companyOptions.reduce((acc: string[], option) => {
                    return determineMatch(acc, token, option)
                }, []));
                matchedTime.push(...data.timeOptions.reduce((acc: string[], option) => {
                    return determineMatch(acc, token, option)
                }, []));
                matchedSetting.push(...data.settingOptions.reduce((acc: string[], option) => {
                    return determineMatch(acc, token, option)
                }, []));
            })

            var keywordsList:{}[] = [];

            if (matchedFood.length > 0) {
                keywordsList.push({ property: "food", value: matchedFood })
            }
            if (matchedCompany.length > 0) {
                keywordsList.push({ property: "company", value: matchedCompany })
            }
            if (matchedTime.length > 0) {
                keywordsList.push({ property: "time", value: matchedTime })
            }
            if (matchedSetting.length > 0) {
                keywordsList.push({ property: "setting", value: matchedSetting })
            }

            return keywordsList;
            
        }
        
    }

    function handleEventSearch(e: FormEvent<Element>): void {
        e.preventDefault();
        if (queryToPerform) {
            fetchQuery(queryToPerform)
        }
        
    }

    useEffect( ()=> {
        setQueryToPerform(constructQuery(matchOptions(tokenize(userInput))))
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
                    }}
                />
            </div>
        </form>
    )
}