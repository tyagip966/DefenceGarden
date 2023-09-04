import 'react-native-get-random-values';
import React, { useState, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import LoginPage from './src/components/LoginPage';
import NormalUserDashboard from './src/components/NormalUserDashboard';
import PlotDetailsPage from './src/components/PlotDetailsPage';
import AdminDashboard from './src/components/AdminDashboard';
import UserDetailsPage from './src/components/UserDetailsPage';
import { UserContext } from './src/components/UserContext';
import Parse from "parse/react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProvider } from './src/components/UserContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LogoutButton from './src/components/LogoutButton';  // Adjust the import path

//Initializing the SDK. 
Parse.setAsyncStorage(AsyncStorage);
//You need to copy BOTH the the Application ID and the Javascript Key from: Dashboard->App Settings->Security & Keys 
Parse.initialize('JGLijWLCwsZZP5EyBuABIVVvWwfu7wLA945AODgW', 'HKxHbQL6E4U1xgHqN910Ym0nlbQfn7w17zIbuguu');
Parse.serverURL = 'https://parseapi.back4app.com/';



type RootParamList = {
  Login: undefined;
  NormalUserDashboard: undefined;
  PlotDetailsPage: undefined;
  AdminDashboard: undefined;
  UserDetailsPage: undefined;
};

const Stack = createStackNavigator<RootParamList>();
const Drawer = createDrawerNavigator<RootParamList>();

const App: React.FC = () => {

  const [user, setUser] = useState<Parse.User | null>(null);

  const userProviderValue = useMemo(() => ({ user, setUser, handleLogout }), [user, setUser]);



  const handleLogout = (navigation: any) => {
    // Clear Parse session and any other necessary cleanup
    Parse.User.logOut()
      .then(() => {
        // Navigate to LoginPage
        setUser(null);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch(error => {
        console.error("Error logging out", error);
      });
  };

  return (
    <UserContext.Provider value={userProviderValue}>
      <SafeAreaProvider>
        <UserProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Login"
                component={LoginPage}
                options={{
                  headerShown: false
                }}
              />
              <Stack.Screen
                name="NormalUserDashboard"
                component={NormalUserDashboard}
                options={({ navigation }) => ({
                  headerRight: () => <LogoutButton onLogout={() => handleLogout(navigation)} />
                })}
              />
              <Stack.Screen
                name="PlotDetailsPage"
                component={PlotDetailsPage}
                options={({ navigation }) => ({
                  headerRight: () => <LogoutButton onLogout={() => handleLogout(navigation)} />
                })}
              />
              <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboard}
                options={({ navigation }) => ({
                  headerRight: () => <LogoutButton onLogout={() => handleLogout(navigation)} />
                })}
              />
              <Stack.Screen
                name="UserDetailsPage"
                component={UserDetailsPage}
                options={({ navigation }) => ({
                  headerRight: () => <LogoutButton onLogout={() => handleLogout(navigation)} />
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </UserProvider>
      </SafeAreaProvider>

    </UserContext.Provider>
  );
};

export default App;

// const App = () => {
//   return (
//     <SafeAreaProvider>
//       <UserProvider>
//         <NavigationContainer>
//           <Drawer.Navigator
//             drawerContent={SideBar}
//             initialRouteName="Login"
//           >
//             <Drawer.Screen
//               name="Login"
//               component={LoginPage}
//               options={{
//                 headerShown: false,
//                 swipeEnabled: false,
//               }}
//             />
//             <Drawer.Screen
//               name="NormalUserDashboard"
//               component={NormalUserDashboard}
//             />
//             <Drawer.Screen name="PlotDetailsPage" component={PlotDetailsPage} />
//             <Drawer.Screen name="AdminDashboard" component={AdminDashboard} />
//             <Drawer.Screen name="UserDetailsPage" component={UserDetailsPage} />
//           </Drawer.Navigator>
//         </NavigationContainer>
//       </UserProvider>
//     </SafeAreaProvider>
//   );
// };

// export default App;
