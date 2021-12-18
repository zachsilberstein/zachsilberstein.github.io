import Header from "./components/Header";
import List from "./components/List";
import AddAlbum from "./components/AddAlbum";
import { useState, useEffect } from "react";
import * as $ from "jquery";
import { getUserFirebase, setUserAlbums, setUserData } from "./backend/Users";
import {
  formatSpotifyAlbums,
  getUserSpotifyData,
  getUserSpotifySavedAlbums,
} from "./backend/SpotifyMethods";
import ModalAlbumSlides from "./components/ModalAlbumSlides";

export const authEndpoint = "https://accounts.spotify.com/authorize";
export const tokenEndpoint = "https://accounts.spotify.com/api/token";

// client ID, redirect URI and scopes
export const clientId = "c94f82f4cb2c4e9fa5d2e6f7ce9a4d42";
export const clientSecret = "362d7c48adac4e548cb82abd1d59d91a";
export const redirectUri = "http://localhost:3000";
export const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-email",
  "user-read-private",
  "user-library-read",
];
export const code = "code";

const App = () => {
  // Get the hash of the url
  const hash = window.location.search
    .substring(1)
    .split("&")
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});

  const [albums, setAlbums] = useState(
    JSON.parse(localStorage.getItem("albumsList")) || []
  );
  const [sortMethod, setSortMethod] = useState("Default");

  const [albumsSearch, setAlbumsSearch] = useState([]);
  const [searchLastUpdate, setLastUpdate] = useState(0);

  // Show search area or not
  const [searchBar, setSearch] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  async function getToken(code) {
    $.ajax({
      type: "POST",
      url: `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
      json: true,
      headers: {
        Authorization:
          "Basic " +
          new Buffer(clientId + ":" + clientSecret).toString("base64"),
        "Content-type": "application/x-www-form-urlencoded",
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
      },
      success: async (data) => {
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        localStorage.setItem(
          "expires_at",
          new Date().getTime() + parseInt(data.expires_in) * 1000
        );
        localStorage.setItem("refresh_token", data.refresh_token);
        var user = {
          refresh_token: data.refresh_token,
        };
        var userData = await getUserSpotifyData(data.access_token);

        user.email = userData.email;
        user.name = userData.display_name;
        user.id = userData.id;

        setUser(user); // state
        setUserData(user); // database
        localStorage.setItem("user", JSON.stringify(user)); // localstorage

        user = await getUserFirebase(user.id);
        // console.log(user);
        user.albums && setAlbums(user.albums); // setting albums from db
        user.albums &&
          localStorage.setItem("albumsList", JSON.stringify(user.albums));

        window.history.replaceState({}, document.title, "/");
      },
    });
  }
  async function refreshToken(code) {
    $.ajax({
      type: "POST",
      url: `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${code}`,
      json: true,
      headers: {
        Authorization:
          "Basic " +
          new Buffer(clientId + ":" + clientSecret).toString("base64"),
        "Content-type": "application/x-www-form-urlencoded",
      },
      error: function (xhr, status, error) {
        console.log(xhr.responseText);
        localStorage.removeItem("refresh_token");
      },
      success: function (data) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem(
          "expires_at",
          new Date().getTime() + parseInt(data.expires_in) * 1000
        );
        localStorage.setItem("refresh_token", data.refresh_token);
      },
    });
  }

  useEffect(() => {
    // localStorage.clear();
    // console.log(localStorage);
    // console.log(JSON.parse(localStorage.getItem("albumsList")));
    // console.log(hash);
    if (hash.code && !localStorage.getItem("refresh_token")) {
      getToken(hash.code); // Basically the login method
    }
    // if (hash.access_token) {
    //   localStorage.setItem("token", hash.access_token);
    //   localStorage.setItem(
    //     "expires_at",
    //     new Date().getTime() + parseInt(hash.expires_in) * 1000
    //   );
    //   window.location.hash = "";
    //   setToken(localStorage.getItem("token"));
    // }
    if (
      localStorage.getItem("expires_at") &&
      new Date().getTime() >= localStorage.getItem("expires_at")
    ) {
      if (localStorage.getItem("refresh_token")) {
        refreshToken(localStorage.getItem("refresh_token"));
      } else {
        localStorage.removeItem("expires_at");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        setToken("");
        setSearch(false);
        setUser({});
      }
    }
    // console.log(albums);
    if (albums.length === 0 && user.id) {
      async function getData() {
        var userData = await getUserFirebase(user.id);
        // console.log(userData);
        userData.albums && setAlbums(userData.albums); // setting albums from db
        userData.albums &&
          localStorage.setItem("albumsList", JSON.stringify(userData.albums));
      }
      getData();
    }
    return () => {};
  }, [hash, albums, user]);

  // Add album
  const addAlbum = (albumid) => {
    if (!albums.find((o) => o.id === albumid)) {
      var newAlbums = albums.concat(albumsSearch.find((o) => o.id === albumid));
      setAlbums(newAlbums);

      // Update Search to remove the +
      var a = albumsSearch;
      a[albumsSearch.findIndex((o) => o.id === albumid)].alreadyAdded = true;
      setAlbumsSearch(a);

      // Store for later
      localStorage.setItem("albumsList", JSON.stringify(newAlbums));
      setUserAlbums(user.id, newAlbums);
      setSortMethod("Default");
    }
  };

  // Add multiple album
  const addAlbums = (albumidArray) => {
    if (albumidArray.length > 0) {
      var newAlbums = albums;
      albumidArray.forEach((element) => {
        if (!albums.find((o) => o.id === element.id)) {
          var newAlbum = albumsSearch.find((o) => o.id === element.id);
          if (
            !albums.find((o) => {
              return o.title === newAlbum.title && o.artist === newAlbum.artist;
            })
          )
            newAlbums = newAlbums.concat(newAlbum);
        }
      });

      setAlbums(newAlbums);

      // Update Search to remove the +
      var a = albumsSearch;
      albumidArray.forEach((element) => {
        a[
          albumsSearch.findIndex((o) => o.id === element.id)
        ].alreadyAdded = true;
      });
      setAlbumsSearch(a);

      // Store for later
      localStorage.setItem("albumsList", JSON.stringify(newAlbums));
      setUserAlbums(user.id, newAlbums);
      setSortMethod("Default");
    }
  };

  // Delete album
  const deleteAlbum = (id) => {
    // console.log("Delete", id);
    var newAlbums = albums.filter((album) => album.id !== id);
    setAlbums(newAlbums);
    if (albumsSearch.findIndex((o) => o.id === id) >= 0) {
      var a = albumsSearch;
      a[albumsSearch.findIndex((o) => o.id === id)].alreadyAdded = false;
      setAlbumsSearch(a);
    }
    // Store for later
    localStorage.setItem("albumsList", JSON.stringify(newAlbums));
    setUserAlbums(user.id, newAlbums);
    // console.log(localStorage.getItem("albumsList"));
  };

  const clearAlbums = () => {
    setAlbums([]);
    localStorage.removeItem("albumsList");
    setUserAlbums(user.id, []);
  };

  // Save user's rating
  const saveRating = (id, rating) => {
    // console.log(id + rating);
    rating = parseInt(rating);
    if (rating && albums.findIndex((o) => o.id === id) >= 0) {
      var a = albums;
      a[albums.findIndex((o) => o.id === id)].rating = rating;
      setAlbums(a);
      // Store for later
      localStorage.setItem("albumsList", JSON.stringify(a));
      setUserAlbums(user.id, a);
      // console.log(localStorage.getItem("albumsList"));
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser({});
    setAlbums([]);
    setToken("");
    setSearch(false);
  };

  // Open Search
  const showSearch = () => {
    setSearch(!searchBar);
    // console.log(searchBar);
  };

  // Change Sort
  const changeSort = (sortMode, reverse) => {
    var sorted = albums.sort(function (a, b) {
      var keyA = a[sortMode],
        keyB = b[sortMode];
      // Compare
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    if (reverse) {
      sorted.reverse();
    }
    setAlbums(sorted); // for some reason this is not enough does not consider array changed.
    setSortMethod(sortMode);
  };

  // Make search
  const searchSpotify = (term) => {
    if (!term) {
      setAlbumsSearch([]);
    } else {
      const sentTime = new Date().getTime();
      // Make a call using the token
      $.ajax({
        url: "https://api.spotify.com/v1/search",
        type: "GET",
        data: {
          q: term,
          type: "album",
        },
        beforeSend: (xhr) => {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: (data) => {
          if (sentTime > searchLastUpdate) {
            setLastUpdate(sentTime);
            const result = formatSpotifyAlbums(data.albums.items, albums);
            setAlbumsSearch(result);
          }
        },
      });
    }
  };

  const getSpotifySavedAlbums = async () => {
    var savedList = await getUserSpotifySavedAlbums(token, albums);
    // console.log(savedList);
    if (savedList.length > 0) {
      var sorted = savedList.sort(function (a, b) {
        var keyA = a["artist"],
          keyB = b["artist"];
        // Compare
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
      });
      console.log(sorted);
      setAlbumsSearch(sorted);
    }
  };

  return (
    <div className="container h-100">
      <Header
        title="beats"
        isOpen={searchBar}
        searchBar={showSearch}
        token={token}
        logout={logout}
        user={user}
      />
      {albums && <ModalAlbumSlides albums={albums} saveRating={saveRating} />}
      {searchBar && (
        <AddAlbum
          className={"container m-2"}
          addAlbum={addAlbum}
          addAlbums={addAlbums}
          spotifySearch={searchSpotify}
          searchedAlbums={albumsSearch}
          spotifySavedAlbums={getSpotifySavedAlbums}
        />
      )}
      {albums.length > 0 ? (
        <List
          albums={albums}
          onDelete={deleteAlbum}
          changeSort={changeSort}
          currentSort={sortMethod}
          saveRating={saveRating}
          clearAlbums={clearAlbums}
        />
      ) : (
        <h3 className="text-center font-weight-bold">No Albums... yet</h3>
      )}
    </div>
  );
};

export default App;
