import { QueryDocumentSnapshot, collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useEffect, useState } from "react";
import data from "./events.json"

export function Recommend() {
    const [events, setEvents] = useState<QueryDocumentSnapshot[]>();
    const [histRating, setHistRating] = useState<number | undefined>();
    const [value, setValue] = useState<number | undefined>();

    function averageRating(collection: QueryDocumentSnapshot[] | undefined) {
        var sum = 0;
        
        if (collection) {
            collection.forEach(document => {
                sum += average(document.data().ratings);
              });
            
            setHistRating(sum / collection.length);
            return (sum / collection.length);
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
        // Get the historical (filtered) event data
        const eventsRef = collection(db, "Events");

        const querySnap = await getDocs(query(eventsRef, where(field, "==", option)));
    
        setEvents(querySnap.docs)
    
        return averageRating(events);
      }
    
    const calculateValue = async (field: "time" | "setting" | "duration" | "food" | "company", option: string) => {
        // Get the average rating for the option
        const averageRating = await getAverageRating(field, option);
        // Get the weighting for the attribute
        const weighting = data.weightings[field];
    
        if (averageRating) {
            const value = averageRating * weighting / 5;
            setValue(value);
            await setDoc(doc(db, "Event Rec Values", field), {
                [option]: value
            })
        }
        // Calculate the value of the option
      }

      const fetchValues = () => {
        
        data.foodOptions.map((food: string) => {
            calculateValue("food", food)
        })
        data.companyOptions.map((company: string) => {
            calculateValue("company", company)
        })
        
      }


    // fetchValues();

      return (
        <>
        <p>Avg Rating: {histRating}</p>
        <p>Value: {value}</p>
        </>
      )
      
}

  
  