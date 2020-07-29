import React from 'react';
import Layout from "./layout/index";
import { Provider } from "react-redux";
import store from "./store/index";
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Layout/>
    </Provider>
  );
}

export default App;