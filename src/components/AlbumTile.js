import React from "react";
import { FaTimes, FaPlusCircle } from "react-icons/fa";
import { useState } from "react/cjs/react.development";
import Button from "./Button";

const AlbumTile = ({ album, onDelete, isSearched, saveRating }) => {
  const [showRateBox, setRateBox] = useState(false);

  const rateAlbum = () => {
    setRateBox(!showRateBox);
  };

  return (
    <div className="card m-2 h-100">
      <img className="card-img-top" src={album.image} alt="" />
      <div className="card-body text-center col">
        <h5 className="card-title">{album.title}</h5>
        <p className="card-text">{album.artist}</p>
        <small className="card-text mb-5">{album.release}</small>
        {!isSearched && (
          <h3
            className="font-weight-bold"
            onClick={rateAlbum}
            style={{ cursor: "pointer" }}
          >
            {album.rating !== -1 ? (
              album.rating
            ) : (
              <Button text="Rate" buttonClick={rateAlbum} />
            )}
          </h3>
        )}
        {showRateBox && (
          <input
            onKeyUp={(e) => {
              if (e.target.value < 0) {
                e.target.value = 0;
              } else if (e.target.value > 101) {
                e.target.value = 101;
              }
              if (e.key === "Enter") {
                saveRating(album.id, e.target.value);
                e.target.value = "";
              }
            }}
            className="form-control form-control-lg"
            type="number"
            min="0"
            max="101"
          />
        )}
        <br />
        <h1 className="align-botton">
          {onDelete &&
            (isSearched ? (
              !album.alreadyAdded && (
                <FaPlusCircle
                  className="grow"
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                  onClick={() => onDelete(album.id)}
                />
              )
            ) : (
              <FaTimes
                className="grow"
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => onDelete(album.id)}
              />
            ))}
        </h1>
      </div>
    </div>
  );
};

export default AlbumTile;
