import ContextProvider from './context/contextProvider';
import { Provider } from "react-redux"
import * as SecureStore from 'expo-secure-store';
import { ApolloProvider } from '@apollo/client';
import client from './apollo/clientConfig';
import MainStack from './navigations/MainStack';
import store from './stores/store';
import { useEffect } from "react";

export default function App() {

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ContextProvider>
          <MainStack />
        </ContextProvider >
      </Provider>
    </ApolloProvider >
  );
}