import React, { useState, useEffect, useRef } from "react";
import { Container, Row } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { endpoints } from "../../endpoints/endpoints";
import "./Login.css";
import $ from "jquery";
import BeatLoader from "react-spinners/BeatLoader";
import Lottie from "lottie-react";
import LottieAnime from "../../Assets/90714-online-learning.json";

function Login() {
  const navigate = useNavigate();
  const initialValues = { username: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [validate, setValidate] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [intial, setIntial] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (e) => {
    setIntial(true);
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      setIsLoading(true);
      loginUser();
    }
  }, [isSubmit]);

  function loginUser() {
    if (formValues.username && formValues.password) {
      const payload = {
        username: formValues.username,
        password: formValues.password,
      };

      $.ajax({
        url: endpoints.userLogin,
        dataType: "json",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(payload),
        processData: false,
        success: function (data, textStatus, jQxhr) {
          if (data && data.accessToken) {
            localStorage.setItem("loginResponse", JSON.stringify(data));
            navigate("/classes");
          }
        },
        error: function (jqXhr, textStatus, errorThrown) {
          console.error(jqXhr.responseJSON);
        },
        complete: function () {
          setIsLoading(false);
        },
      });
    }
  }

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
                <div className="logo_area">
                  <img src={require("../../Assets/learning.png")} />
                </div>
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
                      <button className="login-btn">
                        {!isLoading ? (
                          "Login"
                        ) : (
                          <BeatLoader
                            loading={isLoading}
                            color={"white"}
                            size={10}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                          />
                        )}
                      </button>
                    </div>
                  </form>
                  {/* <img className="bg-study" src={require('../../Assets/study.png')}/> */}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 vid">
              <div className="video_layer">
              <Lottie className="lottie" animationData={LottieAnime}></Lottie>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default Login;
