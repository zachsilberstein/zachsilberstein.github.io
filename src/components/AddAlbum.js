import React from "react";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import List from "./List";
import Button from "./Button";

const AddAlbum = ({
  addAlbum,
  spotifySearch,
  searchedAlbums,
  spotifySavedAlbums,
  addAlbums,
}) => {
  const [search, setSearch] = useState("");

  const searchSpotify = (text) => {
    setSearch(text);
    spotifySearch(text);
  };

  const spotifySaved = () => {
    spotifySearch("");
    setSearch("My Library");
    spotifySavedAlbums();
  };

  const addAll = () => {
    addAlbums(searchedAlbums);
  };

  return (
    <div className={"container m-2 bg-secondary p-3 rounded"}>
      <div className="row float-right">
        <div className="col">
          <Button text="Saved Albums" buttonClick={spotifySaved} />
          <Button text="Add All" buttonClick={addAll} />
        </div>
      </div>
      <div className="row m-3 p-3 rounded">
        <div className="col-md-2 col-10 m-auto">
          <label className="p-1 text-nowrap">
            Search <FaSearch />
          </label>
        </div>
        <div className="col-md-10 col-12 m-auto">
          <input
            onChange={(e) => searchSpotify(e.target.value)}
            className="form-control form-control-lg"
            type="text"
            value={search}
          />
        </div>
      </div>
      {search && (
        <List albums={searchedAlbums} onDelete={addAlbum} isSearched={true} />
      )}
    </div>
  );
};

export default AddAlbum;
