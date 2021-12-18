import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import AlbumTile from "./AlbumTile";

const ModalAlbumSlides = ({ albums, saveRating }) => {
  const [show, setShow] = useState(false);
  const [currentIndex, setCurrent] = useState(-1);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setCurrent(-1);
  };

  const nextAlbum = () => {
    var newIndex = currentIndex + 1;
    while (newIndex < albums.length && albums[newIndex].rating !== -1) {
      newIndex++;
    }
    setCurrent(newIndex);
  };

  const saveRatingAndNext = (id, rating) => {
    saveRating(id, rating);
    nextAlbum();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Quick Rate
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Album Quick Rate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentIndex === -1 ? (
            <Button className="col-12" variant="primary" onClick={nextAlbum}>
              Begin Quick Rate
            </Button>
          ) : currentIndex >= albums.length ? (
            <h3>All done!</h3>
          ) : (
            <AlbumTile
              album={albums[currentIndex]}
              saveRating={saveRatingAndNext}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalAlbumSlides;
