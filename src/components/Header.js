import Button from "./Button";
import { authEndpoint, clientId, redirectUri, scopes } from "../App";

const Header = (props) => {
  return (
    <header>
      <div className="container">
        <div className="row justify-content-between mt-3">
          <div className="col">
            <h1>{props.title}</h1>
          </div>
          <div className="col">
            <div className="float-right">
              {props.token ? (
                <div className="row">
                  {props.user && (
                    <div className="m-2">
                      <h4>Hello, {props.user.name}</h4>
                    </div>
                  )}
                  <p className="btn btn-secondary" onClick={props.logout}>
                    Logout
                  </p>
                </div>
              ) : (
                <a
                  className="btn btn-secondary"
                  href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                    "%20"
                  )}&response_type=code&show_dialog=true`}
                >
                  Login with Spotify
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      {props.token && (
        <Button
          text={props.isOpen ? "Close" : "Search"}
          buttonClick={props.searchBar}
        />
      )}
    </header>
  );
};

export default Header;
