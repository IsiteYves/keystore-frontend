import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import { Link, Redirect } from "react-router-dom";

export default function ReceivedCode(props) {
  const [code, setCode] = useState(""),
    [uid, setUid] = useState(),
    [codeHash, setCodeHash] = useState(),
    [resetEmail, setResetEmail] = useState(""),
    [display, setDisplay2] = useState(""),
    [inCode, setInCode] = useState(""),
    [correctCode, setCorrectCode] = useState(false),
    [errors, setErrors] = useState([]),
    handleChange = (e) => {
      setInCode(e.target.value);
    },
    handleSubmit = (e) => {
      e.preventDefault();
      if (inCode.toUpperCase() !== code) setErrors(["Incorrect code."]);
      else {
        setErrors([]);
        setCorrectCode(true);
      }
    };
  useEffect(() => {
    const { uid, code, codeHash, resetEmail, display } = props;
    setUid(uid);
    setCode(code);
    setCodeHash(codeHash);
    setResetEmail(resetEmail);
    setDisplay2(display);
  }, [props]);
  return (
    <>
      {correctCode && <Redirect to={`/password-reset/${uid}/${codeHash}`} />}
      <div className="Forgot__page" style={{ display }}>
        <div className="Forgot__Content">
          <form action="/" autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
            <p>
              Enter the password reset code sent to <span>{resetEmail}</span>
            </p>
            {errors.length !== 0 && <p className="form__error">{errors[0]}</p>}
            <div className="input__field">
              <TextField
                type="text"
                name="code"
                variant="outlined"
                label="Received code"
                value={inCode}
                onChange={(e) => handleChange(e)}
                required
              />
            </div>
            <div className="text-right">
              <Link
                to="/forgotpassword"
                onClick={() => {
                  setCode("");
                  props.setCodeDisplay("none");
                  props.setDisplay1("flex");
                }}
              >
                Back
              </Link>
            </div>
            <div className="input__field">
              <input type="submit" name="next-btn" value="Final step" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
