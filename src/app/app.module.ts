import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { LocationComponent } from "./location.component";
import { ErrorDisplayingInputComponent } from "./error-displaying-input.component";

@NgModule({
  declarations: [
    AppComponent,
    ErrorDisplayingInputComponent,
    LocationComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
