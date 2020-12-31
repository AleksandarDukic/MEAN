import { enableProdMode } from '@angular/core'; // importuje se u typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)     // startuj angular sa ovim MODULOM
  .catch(err => console.error(err));
