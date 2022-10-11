import React, { useState, useEffect, useRef } from "react";
import { Container, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";

import "./Login.css";
import $ from "jquery";

function Login() {
  const navigate = useNavigate();
  const initialValues = { username: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [validate, setValidate] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [intial, setIntial] = useState(false);

  const onChange = (e) => {
    setIntial(true);
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(formValues));
    setIsSubmit(true);

    if (Object.keys(formErrors).length === 0 && isSubmit) {
      //TODO: ADD API CALL FUNCTION
    }
  };

  useEffect(() => {
    if (intial) {
      setFormErrors(validateForm(formValues));
      return;
    }
  }, [formValues]);

  const validateForm = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Invalid username";
    }
    if (!values.password) {
      errors.password = "Invalid Password";
    }
    return errors;
  };

  return (
    <>
      <section className="loggin">
        <Container>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="log_area">
                <h1 className="log_title">
                  Start your future from <span>here</span>
                </h1>
                <p>
                  The foundation of the world's future with the best education
                  from the best lecturers
                </p>
                <div className="form-area">
                  <form onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                      <label>USER ID</label>
                      <input
                        type="text"
                        name="username"
                        id="uname"
                        className={
                          formErrors.username
                            ? "form-control red"
                            : "form-control"
                        }
                        onChange={onChange}
                        value={formValues.username}
                        required
                      />
                      {formErrors.username ? (
                        <p style={{ color: "red" }}>{formErrors.username}</p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="form-group">
                      <label>PASSWORD</label>
                      <input
                        type="password"
                        name="password"
                        id="pass"
                        className={
                          formErrors.password
                            ? "form-control red"
                            : "form-control"
                        }
                        onChange={onChange}
                        value={formValues.password}
                        required
                      />
                      {formErrors.password ? (
                        <p style={{ color: "red" }}>{formErrors.password}</p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="button-group d-flex">
                      <button type="submit" className="login-btn">
                        Login
                      </button>
                    </div>
                    <p className="signin">
                      Need an Account? <a href="#">Sing in</a>
                    </p>
                  </form>
                  {/* <img className="bg-study" src={require('../../Assets/study.png')}/> */}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 vid">
              <div className="video_layer">
                <video
                  src={require("../../Assets/production ID_5192067.mp4")}
                  autoPlay="autoplay"
                  loop="true"
                  muted
                ></video>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Login;
