import { QueryDocumentSnapshot, Timestamp, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import data from "./events.json"
import { Button } from "../ui/button";

export function Recommend() {
    const [eventRecValuesLocal, setEventRecValuesLocal] = useState<any>({});


    function averageRating(queryDocs: QueryDocumentSnapshot[] | undefined, adjust: boolean) {
        var rCount = 0;
        var qCount = 0;
        var sum = 0;

        try {
            queryDocs?.forEach((event) => {
                qCount++;
                if (event.data().ratings) {
                    sum += average(event.data().ratings)
                    rCount++;
                }
            })

            if (rCount > 0) {
                var avgRating = (sum / rCount);
                if (adjust) {
                    var adjRating = avgRating * (Math.pow((4.5 + avgRating)/10, qCount - 1))
                    var adjRating = Math.round(adjRating * 1000) / 1000;
                    return adjRating
                }
                var avgRating = Math.round(avgRating * 1000) / 1000;
                return avgRating;
            }
            else {
                return 2.5;
            }

        }
        catch (error: any) {
            console.error(error.message);
        }
      }
    
    const average = (array: number[]) => {
        var sum = 0;
    
        array.forEach(element => {
          sum += element;
        });
        
        return (sum / array.length);
      }
    
    const getAverageRating = async (field: string, option: string) => {
        try {
            const eventsRef = collection(db, "Events");
            const querySnap = await getDocs(query(eventsRef, where(field, "==", option)));
            
            if (querySnap.docs.length != 0) {
                console.log(querySnap.docs);
                const avgRating = averageRating(querySnap.docs, field=="food");
                return avgRating;
            } else {
                return 2.5; // no data yet -> mid rating
            }
        } catch (error: any) {
            console.error(error.message);
        }
      }
    
    const calculateValue = async (field: "time" | "setting" | "food" | "company", option: string) => {
        // Get the average rating for the option
        const averageRating = await getAverageRating(field, option);
        // Get the weighting for the attribute
        const weight = data.weights[field];
    
        if (averageRating) {
            const value = Math.round(averageRating * weight / 5 * 1000) / 1000;
            console.log(`Average ${field}: "${option}" rating ${averageRating}, weighting ${weight}, and value ${value}`)
            setEventRecValuesLocal((prevEventRecValuesLocal: any) => ({
                ...prevEventRecValuesLocal,
                [field]: {
                    ...prevEventRecValuesLocal[field],
                    [option]: value
                },
                calculatedAt: Timestamp.fromDate(new Date())
            }))
        } else {
            console.log(`No rating for: ${option}`)
        }
        // Calculate the value of the option
      }

    const calculateValues = async () => {
        window.localStorage.removeItem("Event Rec Values");
        setEventRecValuesLocal({});
        
        for (const food of data.foodOptions) {
            await calculateValue("food", food);
        }
        for (const company of data.companyOptions) {
            console.log(company);
            await calculateValue("company", company);
        }
        for (const time of data.timeOptions) {
            console.log(time);
            await calculateValue("time", time);
        }
        for (const setting of data.settingOptions) {
            console.log(setting);
            await calculateValue("setting", setting);
        }
        
      }

    const fetchValues = async () => {
        try {
            let localVals = window.localStorage.getItem("Event Rec Values")
            
            if (localVals && localVals != "{}") { // null and empty check
                // if there is data in local storage
                setEventRecValuesLocal({
                    ...JSON.parse(localVals)
                })
            } else {
                // if there is no data in local storage
                const valuesRef = doc(db, "Recommendations", "Event Rec Values");
                const valuesSnap = await getDoc(valuesRef);
                console.log(valuesSnap.data())
                if (JSON.stringify(valuesSnap.data()) != '{}') {
                    setEventRecValuesLocal((prevEventRecValuesLocal: any) => ({
                        ...prevEventRecValuesLocal,
                        ...valuesSnap.data(),
                    }))
                } else {
                    calculateValues();
                }

            }
            
        } catch (error: any) {
          console.error(error.message);
        }
      
      }

    useEffect( () => {
        (async () => {
            eventRecValuesLocal.food && eventRecValuesLocal.company && console.log(eventRecValuesLocal)
            await updateDoc(doc(db, "Recommendations", "Event Rec Values"), {  
                ...eventRecValuesLocal
            })
            window.localStorage.setItem("Event Rec Values", JSON.stringify(eventRecValuesLocal))
        })()
    }, [eventRecValuesLocal])

    useEffect( () => {
        fetchValues()
    }, [])

      return (
        <>
        <Button size="sm" onClick={async () => {
            await calculateValues();
            window.localStorage.setItem("Event Rec Values", JSON.stringify(eventRecValuesLocal))
        }}>Recommend</Button>
        </>
      )
      
}

  
  