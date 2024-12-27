import { useEffect } from "react";
import "firebaseui/dist/firebaseui.css"; // Import Firebase UI styles
import { firebaseAuth } from "../../config/firebaseConfig"; // Import Firebase config
import firebase from "firebase/compat/app";
import * as firebaseui from "firebaseui";
import { showToast } from "../../utils/utils";
import { db } from "../../App";
import { lookup } from "@instantdb/react";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        // setUser(currentUser);
        navigate("/");
        return;
      }
    });

    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth);

    ui.start("#firebaseui-auth-container", {
      callbacks: {
        uiShown: function () {
          // This is what should happen when the form is full loaded. In this example, I hide the loader element.
          document.getElementById("loader")!.style.display = "none";
        },
        signInSuccessWithAuthResult: (
          authResult: firebase.auth.UserCredential
        ) => {
          // Handle successful sign-in
          console.log(
            `User signed ${
              authResult.additionalUserInfo?.isNewUser ? "up" : "in"
            }:`,
            authResult
          );

          showToast({
            type: "s",
            message: `User signed ${
              authResult.additionalUserInfo?.isNewUser ? "up" : "in"
            }!`,
          });

          const user = authResult.user;
          try {
            db.transact(
              db.tx.users[lookup("uid", user?.uid)].merge({
                displayName: user?.displayName ?? "",
                email: user?.email,
                uid: user?.uid,
                operationType: authResult.operationType ?? "",
                providerId: authResult.credential?.providerId ?? "",
                signInMethod: authResult.credential?.signInMethod ?? "",
                creationTime: user?.metadata.creationTime ?? "",
                lastSignInTime: user?.metadata.lastSignInTime ?? "",
              })
            )
              .then(
                (res) => {
                  console.log("res: ", res);
                  localStorage.setItem("userID", user!.uid);
                  return true;
                },
                (err) => {
                  console.log("err: ", err);
                  return false;
                }
              )
              .catch((err) => {
                console.log("err 1: ", err);
                return false;
              });
          } catch (error) {
            console.log("catch err: ", error);
            return false;
          } finally {
            console.log("log finally");

            return false;
          }
        },
        signInFailure: (error) => {
          // Handle error
          console.error("Sign-in failed", error);
          showToast({
            type: "e",
            message: error.message ?? "Something is wrong!",
          });
        },
      },
      signInSuccessUrl: "/", // This is where should redirect if the sign in is successful.
      signInOptions: [
        // This array contains all the ways an user can authenticate in your application. For this example, is only by email.
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: true,
          forceSameDevice: true,
        },
      ],
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <h1 className="text-center my-3 title">Login Page</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="loader" className="text-center">
        Loading form
      </div>
    </>
  );
};
