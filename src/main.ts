import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { JwtInterceptor, ServerErrorInterceptor } from './app/lib/interceptors';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule,BrowserModule,RouterModule.forRoot(routes)),


    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    importProvidersFrom(AngularFireModule.initializeApp(environment.firebase)),

  ],
}).catch((error) => console.error(error));
