import data from "./events.json"
import { db } from "../../firebase/firebase-config";
import { collection, getDocs, where, query, Query, DocumentData, QueryFieldFilterConstraint, or } from "firebase/firestore";

function tokenize (userInput: string | undefined) {
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

function levenshteinDistance (s: any, t: any):number |undefined  {
    if (s.length || t.length) {
        try {
            if (!s.length) return t?.length;
            if (!t.length) return s?.length;
            const arr = [];
            for (let i = 0; i <= t.length; i++) {
            arr[i] = [i];
            for (let j = 1; j <= s.length; j++) {
                arr[i][j] =
                i === 0
                    ? j
                    : Math.min(
                        arr[i - 1][j] + 1,
                        arr[i][j - 1] + 1,
                        arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
                    );
            }
            }
            return arr[t.length][s.length];
    
        } catch (error: any) {
        }
    }
    return undefined;
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

function constructQuery (searchTerms: any) {
        
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

async function fetchQuery(queryToPerform: Query<DocumentData>) {
    const querySnap = await getDocs(queryToPerform);
    return querySnap;
}

export const getQueryResult = (userInput: string) => {
    const queryToPerform = constructQuery(matchOptions(tokenize(userInput)))
    if (queryToPerform) {
        return fetchQuery(queryToPerform)
    }
    
}

export const getQuery = (userInput: string | undefined) => {
    const query:any = matchOptions(tokenize(userInput))
    if (query) {
        const queryString = query.map((field: any) => 
            field.value.join(', ')
        )

        return queryString.join(', ');
    }
    
}