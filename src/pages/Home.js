import { useEffect, useState, memo } from "react";
import Update from "@material-ui/icons/AddBox";
import Delete from "@material-ui/icons/RemoveCircleOutline";
import Sidebar from "../components/Sidebar";
import MenuOutlined from "@material-ui/icons/MenuOutlined";
import PlusOutlined from "@material-ui/icons/AddOutlined";
import Newpassword from "../components/Newpassword";
import Updatepassword from "../components/UpdatePassword";

const Home = memo(({ socket, axios }) => {
  const [passwords, setPasswords] = useState([]),
    [authUser, setUser] = useState({ username: "..." }),
    [loaderDisplay, setLoaderDisplay] = useState("none"),
    [errors, setErrors] = useState([]),
    authToken = localStorage.getItem("kystTkn"),
    verifyToken = async () => {
      setLoaderDisplay("block");
      await axios
        .post("https://keystore-backend.herokuapp.com/users/verify-token", {
          authToken,
        })
        .then(async (res) => {
          setLoaderDisplay("none");
          if (res.data.found) {
            const { user } = res.data;
            await setUser(user);
            loadPasswords(user._id);
          }
        })
        .catch((err) => setErrors["Connection Failed"]);
    },
    deletePassword = async (_id) => {
      setLoaderDisplay("block");
      await axios
        .post("https://keystore-backend.herokuapp.com/users/deletePassword", {
          _id,
        })
        .then(() => {
          setLoaderDisplay("none");
          socket.emit("loadPasswords");
        })
        .catch((err) => setErrors["Connection Failed"]);
    },
    [NewpasswordDisplay, setNewpasswordDisplay] = useState("none"),
    [UpdatePDisplay, setUpdatePDisplay] = useState("none"),
    [toUpdate, setToUpdate] = useState({}),
    hideNewpassword = () => {
      setNewpasswordDisplay("none");
    },
    hideUpdatepassword = () => {
      setUpdatePDisplay("none");
    },
    loadPasswords = async (uid) => {
      setLoaderDisplay("block");
      await axios
        .post("https://keystore-backend.herokuapp.com/users/loadPasswords", {
          uid,
        })
        .then((res) => {
          setLoaderDisplay("none");
          setPasswords(res.data.passwords);
        })
        .catch((err) => setErrors["Connection Failed"]);
    },
    [sidebarDisplay, setSidebarDisplay] = useState("");
  useEffect(() => {
    verifyToken();
    let { clientWidth } = document.documentElement;
    if (clientWidth > 800) setSidebarDisplay("flex");
    else setSidebarDisplay("none");
  }, [authToken]);
  useEffect(() => {
    socket.on("loadPasswords", () => {
      if ("undefined" !== typeof authUser._id) loadPasswords(authUser._id);
    });
  }, [authUser]);
  window.onresize = () => {
    let { clientWidth } = document.documentElement;
    if (clientWidth > 800) setSidebarDisplay("flex");
    else setSidebarDisplay("none");
  };
  document.title = `Keystore | Stored`;
  return (
    <>
      <div className="Home">
        <Sidebar
          disp={sidebarDisplay}
          setSidebarDisplay={setSidebarDisplay}
          option="stored"
        />
        <section className="Responsive_Header">
          <MenuOutlined
            onClick={() => {
              setSidebarDisplay("flex");
            }}
          />
        </section>
        <div className="Stored Objective" style={{ width: "80vw" }}>
          <h2>Stored passwords</h2>
          <div style={{ width: "80vw" }} className="Table-container">
            <div
              className="pb-3"
              style={{ display: passwords.length !== 0 ? "none" : "" }}
            >
              No passwords registered yet.
            </div>
            <table
              className="table"
              style={{ display: passwords.length === 0 ? "none" : "" }}
            >
              <thead className="table-dark">
                <tr>
                  <th>&nbsp;&nbsp;&nbsp;#</th>
                  <th>App / Website</th>
                  <th>Password</th>
                  <th>Date added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {passwords.map((password, key) => {
                  return (
                    <tr key={key}>
                      <td>&nbsp;&nbsp;&nbsp;{key + 1}</td>
                      <td>{password.site}</td>
                      <td>{password.password}</td>
                      <td>{password.dateAdded}</td>
                      <td>
                        <div title="Update">
                          <Update
                            onClick={() => {
                              setToUpdate(password);
                              setUpdatePDisplay("flex");
                            }}
                          />
                        </div>
                        <div title="Delete">
                          <Delete
                            onClick={() => deletePassword(password._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            className="newpassword"
            onClick={() => {
              setNewpasswordDisplay("flex");
            }}
          >
            <div>
              <PlusOutlined />
            </div>
            <div>New password</div>
          </div>
          {errors.length !== 0 && <p className="form__error">{errors[0]}</p>}
          <div className="Loader" style={{ display: loaderDisplay }}></div>
        </div>
      </div>
      <Newpassword
        display={NewpasswordDisplay}
        hide={hideNewpassword}
        user={authUser}
        Axios={axios}
        skt={socket}
      />
      <Updatepassword
        display={UpdatePDisplay}
        hide={hideUpdatepassword}
        pswd={toUpdate}
        Axios={axios}
        skt={socket}
      />
    </>
  );
});

export default Home;
