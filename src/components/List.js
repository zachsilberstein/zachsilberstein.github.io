import AlbumTile from "./AlbumTile";
import SortMenu from "./SortMenu";
import Button from "./Button";

const List = ({
  albums,
  onDelete,
  isSearched,
  changeSort,
  currentSort,
  saveRating,
  clearAlbums,
}) => {
  return (
    <div className="container">
      {!isSearched && (
        <div>
          <SortMenu changeSort={changeSort} currentSort={currentSort} />
          <Button text="Clear" buttonClick={clearAlbums} />
        </div>
      )}
      <div className="row">
        {albums.map((album) => (
          <div key={album.id} className="col-md-3 col-6 my-2">
            <AlbumTile
              album={album}
              onDelete={onDelete}
              isSearched={isSearched}
              saveRating={saveRating}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
