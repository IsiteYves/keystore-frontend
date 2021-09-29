import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import ReceivedCode from "../components/ReceivedCode";

const ForgotPassword = (props) => {
  document.title = "Keystore | Forgot password";
  const [errors, setErrors] = useState([]),
    [email, setemail] = useState(""),
    { axios } = props,
    handleChange = (e) => {
      const { value } = e.target;
      setemail(value);
    },
    [loaderDisplay, setLoaderDisplay] = useState("none"),
    [display, setDisplay] = useState("flex"),
    [codeDisplay, setCodeDisplay] = useState("none"),
    [cd, setcd] = useState(""),
    [cdHash, setCdHash] = useState(""),
    [uid, setUid] = useState(""),
    handleSubmit = async (e) => {
      e.preventDefault();
      setLoaderDisplay("block");
      await axios
        .post("https://keystore-backend.herokuapp.com/users/login", {
          email,
          password: "null",
        })
        .then(async (res) => {
          setLoaderDisplay("none");
          let a = res.data.message;
          if (a === 0) setErrors(["Email not registered."]);
          else if (a === 1) setErrors(["Please verify your email first."]);
          else {
            setErrors([]);
            setDisplay("none");
            setLoaderDisplay("block");
            await axios
              .post(
                "https://keystore-backend.herokuapp.com/users/send-reset-code",
                { email }
              )
              .then(async (res) => {
                setLoaderDisplay("none");
                const { emailResetCode, codeHash, _id } = res.data;
                await setcd(emailResetCode);
                await setCdHash(codeHash);
                await setUid(_id);
                setCodeDisplay("flex");
              })
              .catch((err) => setErrors(["Connection Failed"]));
          }
        })
        .catch((err) => setErrors(["Connection Failed"]));
    };
  return (
    <>
      <div className="Forgot__page" style={{ display }}>
        <div className="Forgot__Content">
          <form action="/" autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
            <p>
              You forgot your password. Let's help you get back into your
              account. First type your email down below.
            </p>
            {errors.length !== 0 && <p className="form__error">{errors[0]}</p>}
            <div className="input__field">
              <TextField
                type="email"
                name="email"
                variant="outlined"
                label="Email"
                onChange={(e) => handleChange(e)}
                required
              />
            </div>
            <div className="text-right">
              <Link to="/login">Back to login</Link>
            </div>
            <div className="Loader" style={{ display: loaderDisplay }}></div>
            <div className="input__field">
              <input type="submit" name="next-btn" value="Next" />
            </div>
          </form>
        </div>
      </div>
      <ReceivedCode
        display={codeDisplay}
        resetEmail={email}
        code={cd}
        codeHash={cdHash}
        uid={uid}
        setDisplay1={setDisplay}
        setCodeDisplay={setCodeDisplay}
      />
    </>
  );
};

export default ForgotPassword;
