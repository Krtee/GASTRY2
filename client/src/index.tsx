import { ReactKeycloakProvider } from "@react-keycloak/web";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import "./i18n";
import App from "./pages/App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./styles/index.scss";
import keycloakInstance from "./utils/Keycloak";
import "./utils/FirebaseUtil";

ReactDOM.render(
  <ReactKeycloakProvider
    authClient={keycloakInstance}
    LoadingComponent={<div>TEST</div>}
  >
    <RecoilRoot>
      <React.StrictMode>
        <Suspense fallback={<div>...</div>}>
          <App />
        </Suspense>
      </React.StrictMode>
    </RecoilRoot>
  </ReactKeycloakProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.debug);
