import { useState } from 'preact/hooks';
import './app.css';
import preactLogo from './assets/preact.svg';
import viteLogo from '/vite.svg';

// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { getToken, initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let AppCheckInstance = null;

const appCheck = initializeAppCheck(
  app,
  {
    provider: new ReCaptchaV3Provider('6LfGOVcfAAAAAEBXHgHD2PhenGFz8rvAXLStOpia'),
    isTokenAutoRefreshEnabled: true
  } // ReCaptchaV3Provider or CustomProvider
);

export function App() {
  const [count, setCount] = useState(0)
  console.log(appCheck);

  const callApiWithAppCheckExample = async () => {
    let appCheckTokenResponse;
    try {
      appCheckTokenResponse = await getToken(appCheck, /* forceRefresh= */ true);
      console.log('appCheckTokenResponse', appCheckTokenResponse.token);

      const apiResponse = await fetch('http://localhost:8000/api/v1/login/ping', {
        credentials: 'same-origin',
        headers: {
          'X-Firebase-AppCheck': appCheckTokenResponse.token,
          'Content-Type': 'application/json',

          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        }
      });
      console.log(apiResponse);

    } catch (err) {
      console.log('error', err);

      // Handle any errors if the token was not retrieved.
      return;
    }
    // Handle response from your backend.
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>
      <h1>Vite + Preact</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/app.tsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Preact logos to learn more
      </p>
      <button onClick={callApiWithAppCheckExample}>Call API with App Check</button>
      {/* <GoogleReCaptchaProvider reCaptchaKey="6LfGOVcfAAAAAEBXHgHD2PhenGFz8rvAXLStOpia">
        <GoogleReCaptcha onVerify={token => {
          console.log(token);
        }} />
      </GoogleReCaptchaProvider>, */}
    </>
  )
}
