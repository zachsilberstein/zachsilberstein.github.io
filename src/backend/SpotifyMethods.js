import * as $ from "jquery";

export const formatSpotifyAlbums = (items, currentAlbums) => {
  // console.log(currentAlbums);
  var nested = false; // albums from library are nested inside the array
  if (items.length > 0) {
    if (items[0].added_at) {
      nested = true;
    }
    var result = [];
    items.map((album) => {
      if (nested) {
        album = album.album;
      }
      album.album_type === "album" &&
        result.push({
          id: album.id,
          artist: album.artists[0].name,
          title: album.name,
          image: album.images[0].url,
          release: album.release_date.substring(0, 4),
          alreadyAdded:
            currentAlbums.findIndex((o) => o.id === album.id) >= 0 ||
            currentAlbums.findIndex((o) => {
              return (
                o.title === album.name && o.artist === album.artists[0].name
              );
            }) >= 0
              ? true
              : false,
          rating: -1,
        });
      return result;
    });
    return result;
  }
  return [];
};

export async function getUserSpotifyData(token) {
  return $.ajax({
    url: "https://api.spotify.com/v1/me",
    type: "GET",
    beforeSend: (xhr) => {
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    success: async (data) => {
      // console.log(data);
      return data;
    },
  });
}

export async function getUserSpotifySavedAlbums(token, currentAlbums) {
  var albums = [];
  var iterations = 0;
  var done = false;
  var tempList;
  while (!done && iterations < 8) {
    // console.log(iterations);
    tempList = $.ajax({
      url:
        "https://api.spotify.com/v1/me/albums?limit=50&offset=" +
        iterations * 50,
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: async (data) => {
        return data;
      },
    });
    albums = albums.concat(
      formatSpotifyAlbums((await tempList).items, currentAlbums).filter(
        function (element) {
          return element !== undefined;
        }
      )
    );
    iterations++;
  }
  // console.log(await albums);
  return albums;
}
