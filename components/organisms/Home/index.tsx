import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Header from '../../molecules/user-header';
import AddHeader from '../../molecules/add-home-header';
import useFoodStorage from '../../../hooks/usedFoodStorage';
import { useFocusEffect } from '@react-navigation/native';
import { useState, useCallback, useEffect } from 'react';
import TodayCaloriesList, {TodayCaloriesProps} from '../../molecules/today-calories-list';
import { Meal } from '../../../types';

const totalCaloriesPerDay =2000;

export default function Home({}) {
  const [todayFood, setTodayFood] = useState([]);
  const { onGetTodayFood } = useFoodStorage();
  const [todayStatistics, setTodayStatistics] = useState<TodayCaloriesProps>();
  const calculateTodayStatistics = (meals: Meal[]) => {
    try {
      const caloriesConsumed = meals.reduce((acum, curr) => acum + Number(curr.calories), 0);
      const remainingCalories = totalCaloriesPerDay - caloriesConsumed;
      const percentage = (caloriesConsumed / totalCaloriesPerDay) * 100
      setTodayStatistics({
        consumed: caloriesConsumed,
        percentage,
        remaining: remainingCalories,
      }) 
    } catch (error) {
      console.error(error);
    }
  };


  const loadTodayFood = useCallback(async () => {
    try {
      const todayFoodResponse = (await onGetTodayFood()) as Meal[];
      console.log('Today Food Response:', todayFoodResponse);
      calculateTodayStatistics(todayFoodResponse);
      setTodayFood(todayFoodResponse);
    } catch (error) {
      setTodayFood([]);
      console.error('Error loading today food:', error);
    }
  }, []);
  

  useEffect(() => {
    // This is to ensure that the data is loaded when the component mounts
    loadTodayFood().catch(null);
  }, [loadTodayFood]);

  useFocusEffect(
    useCallback(() => {
      // This will reload the data every time the screen comes into focus
      loadTodayFood().catch(null);
    }, [loadTodayFood])
  );

  return (
    <View style={styles.container}>
     <Header />

    <AddHeader />
   <TodayCaloriesList {...todayStatistics} />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   padding: 12,
   marginTop: 10,
   backgroundColor: '#fff',
    
  },

});
