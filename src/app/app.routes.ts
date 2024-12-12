import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { RestaurantsComponent } from './pages/restaurants/restaurants.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RatingsComponent } from './pages/ratings/ratings.component';

export const routes: Routes = [
    {path: 'login', component:LoginComponent},
    {path: 'signup', component:SignupComponent},
    {path: 'home', component:HomeComponent},
    {path: 'restaurants', component:RestaurantsComponent},
    {path: 'cart', component:CartComponent},
    {path: 'orders', component:OrdersComponent},
    {path: 'profile', component:ProfileComponent},
    {path: 'ratings', component:RatingsComponent},
    {path: '', redirectTo:'home', pathMatch: 'full'}
];
