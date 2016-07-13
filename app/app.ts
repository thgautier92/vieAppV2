import {Component, ViewChild} from '@angular/core';
import {ionicBootstrap, Platform, MenuController, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {CouchDbServices} from './providers/couch/couch';
import {HomePage} from './pages/home/home';
import {AuthPage} from './pages/auth/auth';
import {SynchroPage} from './pages/synchro/synchro';


@Component({
  templateUrl: 'build/app.html',
  providers: [CouchDbServices]
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HomePage;
  pages: Array<{ title: string, component: any, icon: any }>;
  isAut: boolean;
  userData: any = {};

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private couch: CouchDbServices
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Acceuil', component: HomePage, icon: "home" },
      { title: 'Synchronisation', component: SynchroPage, icon: "sync" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.verif();
    });
  };
  verif() {
    this.couch.verifSession(true).then(response => {
      console.log(response);
      this.userData = response;
      this.isAut = true;
      this.nav.setRoot(HomePage);
    }, error => {
      console.log(error);
      this.isAut = false;
      this.disConnect();
    });
  };
  connect() {
    this.menu.close();
    this.nav.setRoot(AuthPage);
  };
  disConnect() {
    this.menu.close();
    this.isAut = false;
    this.nav.setRoot(AuthPage);
  };
  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
ionicBootstrap(MyApp);
