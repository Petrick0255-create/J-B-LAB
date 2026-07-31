import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

const OWNER_EMAIL = "parkjunbum0255@gmail.com";

const firebaseConfig = {
  apiKey: "AIzaSyDgPkwWzHr0zT8-_l-rmGnHMFk-5bmrf0M",
  authDomain: "jb-lab-pro.firebaseapp.com",
  projectId: "jb-lab-pro",
  storageBucket: "jb-lab-pro.firebasestorage.app",
  messagingSenderId: "131784025040",
  appId: "1:131784025040:web:0004d132c6ae5071214fd5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
let deniedMessage = "";

function publishAuthState(detail) {
  window.dispatchEvent(new CustomEvent("jnb-auth-change", { detail }));
}

function publishError(error) {
  const wasCancelled = [
    "auth/cancelled-popup-request",
    "auth/popup-closed-by-user"
  ].includes(error?.code);

  publishAuthState({
    ready: true,
    isOwner: false,
    userEmail: "",
    message: wasCancelled
      ? "로그인이 취소되었습니다."
      : "Google 로그인에 실패했습니다."
  });
}

window.jnbAuth = {
  async signIn() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error?.code === "auth/popup-blocked") {
        await signInWithRedirect(auth, provider);
        return;
      }
      publishError(error);
    }
  },

  async signOut() {
    deniedMessage = "";
    await signOut(auth);
  }
};

getRedirectResult(auth).catch(publishError);

onAuthStateChanged(auth, async user => {
  if (!user) {
    publishAuthState({
      ready: true,
      isOwner: false,
      userEmail: "",
      message: deniedMessage ||
        "본인 Google 계정으로 로그인해야 모든 기능을 사용할 수 있습니다."
    });
    deniedMessage = "";
    return;
  }

  const email = (user.email || "").toLowerCase();
  const isOwner = email === OWNER_EMAIL && user.emailVerified;

  if (!isOwner) {
    deniedMessage = "허용되지 않은 Google 계정입니다.";
    await signOut(auth);
    return;
  }

  publishAuthState({
    ready: true,
    isOwner: true,
    userEmail: user.email,
    message: `${user.email} 로그인됨`
  });
});
