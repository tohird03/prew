import React from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuthDispatch } from "../Contexts/AuthContext";

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      acces_token
    }
  }
`;

export default function Login() {
  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  const navigate = useNavigate();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted(data) {
      dispatch({ type: "LOGIN", payload: data.login });
      navigate("/");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();

    loginUser({ variables });
  };

  return (
    <>
      <div
        className="mt-5"
        width="100%"
        height="100vh"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ boxShadow: "0 0 100px" }}
          className="w-50 p-5 border rounded"
        >
          <div className="">
            <h1 className="text-center">Login</h1>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label
                  htmlFor="validationCustom01"
                  className={
                    errors.username ? "form-label text-danger" : "form-label"
                  }
                >
                  {errors.username ?? "Username"}
                </label>
                <input
                  type="text"
                  className={
                    errors.username ? "form-control is-invalid" : "form-control"
                  }
                  id="validationCustom01"
                  value={variables.username}
                  onChange={(e) =>
                    setVariables({ ...variables, username: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="validationCustom03"
                  className={
                    errors.password ? "form-label text-danger" : "form-label"
                  }
                >
                  {errors.password ?? "password"}
                </label>
                <input
                  type="text"
                  className={
                    errors.password ? "form-control is-invalid" : "form-control"
                  }
                  id="validationCustom03"
                  value={variables.password}
                  onChange={(e) =>
                    setVariables({ ...variables, password: e.target.value })
                  }
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="btn btn-primary"
              >
                {loading ? "loading..." : "Login"}
              </button>
              <p>
                Avval ro'yhatdan o'tmaganmisiz ?{" "}
                <Link to="/register">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
