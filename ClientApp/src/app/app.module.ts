import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { GuestHomeComponent } from './guest-home/guest-home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { CatalogComponent } from './catalog/catalog.component';
import { GuestAboutUsComponent } from './guest-about-us/guest-about-us.component';
import { GuestBlogComponent } from './guest-blog/guest-blog.component';
import { GuestContactComponent } from './guest-contact/guest-contact.component';
import { GuestSolutionsComponent } from './guest-solutions/guest-solutions.component';
import { StripHtmlPipe } from './pipes/strip-html.pipe';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SharedModalComponent } from './shared-modal/shared-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    GuestHomeComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    CatalogComponent,
    GuestAboutUsComponent,
    GuestBlogComponent,
    GuestContactComponent,
    GuestSolutionsComponent,
    StripHtmlPipe,
    VerifyEmailComponent,
    SharedModalComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: GuestHomeComponent, pathMatch: 'full' },
      { path: 'about', component: GuestAboutUsComponent },
      { path: 'blog', component: GuestBlogComponent },
      { path: 'contact', component: GuestContactComponent },
      { path: 'solutions', component: GuestSolutionsComponent },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'catalog', component: CatalogComponent, canActivate: [AuthGuard] },
      { path: 'verify-email', component: VerifyEmailComponent },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    FooterComponent,
    HeaderComponent
  ]
})
export class AppModule { }
