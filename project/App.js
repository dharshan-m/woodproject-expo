// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import Calculator from './App/Calculator';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       {/* <Text>Open up App.js to start working on your !</Text>
//       <StatusBar style="auto" /> */}
//       <Calculator/>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


// import React from 'react';
// import { View } from 'react-native';
// import Calculate from './android/Calculator';

// const App = () => {
//   return (
//     <View>
//       <Calculate />
//     </View>
//   );
// };

// export default App;


// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import Calculator from './android/Calculator';
// import Invoice from './android/Invoice'; // Import Invoice component

// const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen name="Calculator" component={Calculator} />
//         <Stack.Screen name="Invoice" component={Invoice} /> {/* Add Invoice screen */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Calculator from './App/Calculator';
import Invoice from './App/Invoice';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calculator">
        <Stack.Screen
          name="Calculator"
          component={Calculator}
          options={{ title: 'Wood Calculator' }}
        />
        <Stack.Screen
          name="Invoice"
          component={Invoice}
          options={{ title: 'Generated Invoice' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
