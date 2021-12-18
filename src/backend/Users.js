import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { set, ref, update, get, child } from "@firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCrXxFbXKMr0L_vUyWe7T0HA0HCsunddVw",
  authDomain: "beats-4d5c2.firebaseapp.com",
  databaseURL: "https://beats-4d5c2-default-rtdb.firebaseio.com",
  storageBucket: "bucket.appspot.com",
};

const database = initializeApp(firebaseConfig);

export const setUserData = (user) => {
  const db = getDatabase(database);
  update(ref(db, "users/" + user.id), {
    username: user.name,
    email: user.email,
  });
};

export const getUserFirebase = async (userid) => {
  const db = getDatabase(database);
  return await get(child(ref(db), "users/" + userid))
    .then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
        return snapshot.val();
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const setUserAlbums = (userId, albums) => {
  const db = getDatabase(database);
  update(ref(db, "users/" + userId), {
    albums: albums,
  });
};
