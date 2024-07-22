import { QueryDocumentSnapshot, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import data from "./events.json"
import { Button } from "../ui/button";

export function Recommend() {
    const [eventRecValuesLocal, setEventRecValuesLocal] = useState<any>({});


    function averageRating(queryDocs: QueryDocumentSnapshot[] | undefined) {
        var sum = 0;

        if (queryDocs) {
            queryDocs.forEach((event) => {
                if (event.data().ratings) {
                    sum += average(event.data().ratings);
                }
              });
            
            return (sum / queryDocs.length);
        } else {
            return 0;
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
                // console.log(querySnap.docs);
                const avgRating = averageRating(querySnap.docs);
                return avgRating
            }
        } catch (error: any) {
            console.error(error.message);
        }
      }
    
    const calculateValue = async (field: "time" | "setting" | "duration" | "food" | "company", option: string) => {
        // Get the average rating for the option
        const averageRating = await getAverageRating(field, option);
        // Get the weighting for the attribute
        const weighting = data.weightings[field];
    
        if (averageRating) {
            const value = averageRating * weighting / 5;
            console.log(`Average ${field}: "${option}" rating ${averageRating}, weighting ${weighting}, and value ${value}`)
            // console.log(eventRecValuesLocal)
            setEventRecValuesLocal((prevEventRecValuesLocal: any) => ({
                ...prevEventRecValuesLocal,
                [field]: {
                    ...prevEventRecValuesLocal[field],
                    [option]: value
                }
            }))
            await setDoc(doc(db, "Events", "Event Rec Values"), {  
                ...eventRecValuesLocal
            })
        }
        // Calculate the value of the option
      }

      const calculateValues = async () => {
        
        for (const food of data.foodOptions) {
            await calculateValue("food", food);
        }
        for (const company of data.companyOptions) {
            await calculateValue("company", company);
        }

        console.log(eventRecValuesLocal)
        
      }

      const fetchValues = async () => {
        try {
            const valuesRef = doc(db, "Events", "Event Rec Values");
            const valuesSnap = await getDoc(valuesRef);
            console.log(valuesSnap.data())
            setEventRecValuesLocal((prevEventRecValuesLocal: any) => ({
                ...prevEventRecValuesLocal,
                ...valuesSnap.data(),
            }))
        } catch (error: any) {
          console.error(error.message);
        }
      
      }


      
    useEffect(()=> {
        fetchValues().then(() => {
            console.log(eventRecValuesLocal)
        })
    }, [])

      return (
        <>
        <Button size="sm" onClick={calculateValues}>Recommend</Button>
        </>
      )
      
}

  
  