import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from './screens/LoginScreen';
import Dashboard from './screens/Dashboard';
import WelcomeScreen from "./screens/Welcomescreen";  
import Rooms from "./screens/Rooms";
import RoomDetails from "./screens/Details";
import Floors from "./screens/floors";
import Info from "./screens/Info";
import PaymentSuccessful from "./screens/PaymentSuccessful";
import Directions from "./screens/Directions";
import Visitors from './screens/Visitors';  
import Approval from './screens/Approval';
import NewVisitorReg from './screens/NewVisitorReg';
import NewCheckin from "./screens/NewCheckin";

const Stack = createNativeStackNavigator();

export default function App() {
  console.log('App is running'); // This will show in terminal

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Rooms" component={Rooms} />
        <Stack.Screen name="Details" component={RoomDetails} />
        <Stack.Screen name="Floors" component={Floors} />
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="PaymentSuccessful" component={PaymentSuccessful} />
        <Stack.Screen name="Directions" component={Directions} />
        <Stack.Screen name="Visitors" component={Visitors} />
        <Stack.Screen name="Approval" component={Approval} />
        <Stack.Screen name="NewVisitorReg" component={NewVisitorReg} />
        <Stack.Screen name="NewCheckin" component={NewCheckin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}