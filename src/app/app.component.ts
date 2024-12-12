import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component'; // Corrected import statement
import { HeaderComponent } from './components/header/header.component'; // Corrected import statement

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent], // Correct usage of imports as an array
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyAngularApp';
  
}
