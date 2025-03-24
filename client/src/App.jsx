import React from "react";
import { Route, Switch } from "wouter";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Booking from "./pages/Booking";
import Order from "./pages/Order";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import AdminDashboard from "./pages/Admin";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/booking" component={Booking} />
          <Route path="/order" component={Order} />
          <Route path="/contact" component={Contact} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/account" component={Account} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </AuthProvider>
  );
}

export default App;