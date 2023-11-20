import AsyncStorage from "@react-native-async-storage/async-storage";
import { Meal } from "../types";
import {isToday} from 'date-fns';
const MY_FOOD_KEY = '@MYFOOD:KEY'
const MY_TODAY_FOOD_KEY= '@MYTODAYFOOD:KEY';

const useFoodStorage = () => {

    const saveInfoToStorage = async (storageKey: string, meal: Meal) =>{
   try {
            const CurrentSavedFood = await AsyncStorage.getItem(MY_FOOD_KEY);
            if (CurrentSavedFood !== null) {
                const currentSaveFoodParsed = JSON.parse(CurrentSavedFood);
                currentSaveFoodParsed.push(meal);
    
                await AsyncStorage.setItem(
                    storageKey,
                    JSON.stringify(currentSaveFoodParsed));
                    return Promise.resolve();
            }

            await AsyncStorage.setItem(
                storageKey,
                JSON.stringify([meal])
               
            );
           
        } catch (error) {
            return Promise.reject(error);
        }
    
    };

    const handleSaveFood = async ({calories, name, portion}:Meal) => {
      try {
        const result = await saveInfoToStorage(MY_FOOD_KEY, {calories, name, portion});
        return Promise.resolve(result);
      } catch (error) {
        return Promise.reject(error);
      }
      
    };

    const handleGetFoods =  async () => {
        try {
            const foods = await AsyncStorage.getItem(MY_FOOD_KEY);

            if (foods !== null) {
                const parsedFoods  = JSON.parse(foods);
                return Promise.resolve(parsedFoods);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    };
    const handleSaveTodayFood = async ({ calories, name, portion }: Meal) => {
        try {
          const result = await saveInfoToStorage(MY_TODAY_FOOD_KEY, {
            calories,
            name,
            portion,
            date: new Date().toISOString(),
          });
          return Promise.resolve(result);
        } catch (error) {
          return Promise.reject(error);
        }
      };

    const handleGetTodayFoods = async () => {
        try {
          const foods = await AsyncStorage.getItem(MY_TODAY_FOOD_KEY);
      
          if (foods !== null) {
            const parsedFoods = JSON.parse(foods) as Meal[];
            const todayFoods = parsedFoods.filter((meal) => meal.date && isToday(new Date(meal.date)));
          
            return Promise.resolve(todayFoods);
          }
        } catch (error) {

          return Promise.reject(error);
        }
      };
    
    
    return{
        onSaveFood: handleSaveFood,
        onGetFoods: handleGetFoods,
        onSaveTodayFood: handleSaveTodayFood,
        onGetTodayFood: handleGetTodayFoods,
    }
};

export default useFoodStorage;