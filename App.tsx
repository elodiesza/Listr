import {Amplify} from 'aws-amplify';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Auth } from 'aws-amplify';
//import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';


Amplify.configure({...awsconfig, Analytics : {disabled : true}});

function App() {
  
//  const isLoadingComplete = useCachedResources();

//  if (!isLoadingComplete) {
//    return null;
//  } else {


    return (
      <SafeAreaProvider>
        <Navigation/>
        <StatusBar />
      </SafeAreaProvider>
    );
//  }
}

const signUpConfig = {
  header: "Custom Sign-up",
  hideAllDefaults: true,
  signUpFields: [
    {
      label: "Email",
      key: "username",
      required: true,
      displayOrder: 1,
      type: "string",
    },
    {
      label: "Password",
      key: "password",
      required: true,
      displayOrder: 2,
      type: "string",
    },
  ]
};

export default withAuthenticator(App, {signUpConfig});