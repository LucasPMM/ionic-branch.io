import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import {
  BranchIo,
  BranchIoPromise,
  BranchUniversalObject,
  BranchIoAnalytics,
  BranchIoProperties,
} from "@ionic-native/branch-io/ngx";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private branchIo: BranchIo
  ) {
    this.initializeApp();
  }

  private shareContent() {
    // CREATING DEEP LINKS
    const properties = {
      contentDescription: "Descrição do link",
      canonicalIdentifier: "content/123",
      contentImageUrl:
        "https://be-api-production.s3.eu-central-1.amazonaws.com/staging/upload/user_image_upload/29253/upload",
    };

    // create a branchUniversalObj variable to reference with other Branch methods
    let branchUniversalObj = null;
    this.branchIo
      .createBranchUniversalObject(properties)
      .then((res) => {
        branchUniversalObj = res;
        this.createDeepLink(branchUniversalObj);
        // alert("Response: " + JSON.stringify(res));
      })
      .catch((err) => {
        // alert("Error: " + JSON.stringify(err));
      });
  }

  private createDeepLink(branchUniversalObj: BranchUniversalObject) {
    // optional fields
    const analytics: BranchIoAnalytics = {};

    // optional fields
    const properties: BranchIoProperties = {
      $desktop_url:
        "https://help.branch.io/developers-hub/docs/cordova-phonegap-ionic",
      $android_url: "https://test123321.app.link/content",
      $ios_url:
        "https://help.branch.io/developers-hub/docs/cordova-phonegap-ionic",
      $ipad_url:
        "https://help.branch.io/developers-hub/docs/cordova-phonegap-ionic",
      $match_duration: 2000,
      custom_string: "data",
      contentMetadata: {},
      custom_integer: Date.now(),
      custom_boolean: true,
    };

    branchUniversalObj
      .generateShortUrl(analytics, properties)
      .then((res) => {
        // alert("Response: " + JSON.stringify(res.url));
        console.log("link criado", JSON.stringify(res.url));
      })
      .catch((err) => {
        // alert("Error: " + JSON.stringify(err));
      });
  }

  private async initDeepLinking(): Promise<void> {
    try {
      const data: BranchIoPromise = await this.branchIo.initSession();
      if (!data) {
        return;
      }
      console.log("Data", data);
      if (
        data["~referring_link"] &&
        String(data["~referring_link"]).includes(
          "https://test123321.app.link/test"
        )
      ) {
        alert("test link");
        // if ('/hub')
        // if ('/chat')
      } else if (
        data["$canonical_identifier"] &&
        data["$canonical_identifier"].includes("content")
      ) {
        const parts = data["$canonical_identifier"].split("/");
        const contentId = parts[parts.length - 1];
        alert(contentId);
      }
    } catch (err) {
      console.error(err);
    }
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initDeepLinking();
      this.shareContent();
      this.platform.resume.subscribe(() => {
        this.initDeepLinking();
        this.shareContent();
      });
    });
  }
}
