import { useState, useEffect } from "react";

export default function UpdatePassword(props) {
  const hideForm = () => {
      props.hide();
      setInputData({ ...inputData, site: "", password: "" });
      setErrors([]);
    },
    handleChange = (e) => {
      const { name, value } = e.target;
      setInputData({ ...inputData, [name]: value });
    },
    [errors, setErrors] = useState([]),
    [inputData, setInputData] = useState({
      site: "",
      password: "",
    }),
    [display, setDisplay] = useState(""),
    [loaderDisplay, setLoaderDisplay] = useState("none"),
    handleSubmit = async (e) => {
      e.preventDefault();
      const { Axios } = props;
      if (inputData.site.length < 2)
        setErrors(["The App must be at least 2 characters long."]);
      else if (inputData.site.length > 30)
        setErrors(["The App name must not be beyond 30 characters."]);
      else if (inputData.site.length > 50)
        setErrors(["The password must not be beyond 50 characters."]);
      else if (
        inputData.site === props.pswd.site &&
        inputData.password === props.pswd.password
      )
        setErrors(["No changes were made."]);
      else {
        let allData = inputData;
        allData.fullPswd = props.pswd;
        props.skt.emit("loadPasswords", {});
        setLoaderDisplay("block");
        await Axios.post(
          "https://keystore-backend.herokuapp.com/users/updatepassword",
          {
            allData,
          }
        )
          .then((res) => {
            setLoaderDisplay("none");
            if (res.data.exists)
              setErrors(["Password already added for that App."]);
            else {
              hideForm();
            }
          })
          .catch((err) => setErrors(["Connection Failed"]));
      }
    };
  useEffect(() => {
    setDisplay(props.display);
    const { site, password } = props.pswd;
    setInputData({ site, password });
  }, [props]);
  return (
    <div className="Updatepassword" style={{ display }}>
      <form
        action="/"
        method="POST"
        onSubmit={(e) => handleSubmit(e)}
        autoComplete="false"
      >
        <h2>Update password</h2>
        {errors.length !== 0 && <p className="form__error">{errors[0]}</p>}
        <div className="InputItem">
          <label htmlFor="site">Website / App</label>
          <input
            type="text"
            name="site"
            id="site"
            value={inputData.site}
            maxLength="30"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </div>
        <div className="InputItem">
          <label htmlFor="password">Password</label>
          <input
            type="text"
            name="password"
            id="password"
            value={inputData.password}
            maxLength="50"
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </div>
        <div className="Loader" style={{ display: loaderDisplay }}></div>
        <div className="InputItem">
          <input type="button" value="Cancel" onClick={() => hideForm()} />
          <input type="submit" value="Update" />
        </div>
      </form>
    </div>
  );
}
