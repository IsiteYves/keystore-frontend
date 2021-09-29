import { Link } from "react-router-dom";
import "../styles/Notfound.css";

const Notfound = () => {
  document.title = "404 | Page not found!";
  return (
    <div className="Notfound">
      <div className="Middle">
        <h2>Not found!</h2>
        <p>The page you were looking for doesn't exist.</p>
        <Link to="/login">Back to Keystore</Link>
      </div>
    </div>
  );
};

export default Notfound;
