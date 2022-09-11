import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const REGISTER_USER = gql`
  mutation (
    $username: String!
    $email: String!
    $password: String!
    $confrimPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confrimPassword: $confrimPassword
    ) {
      username
      email
    }
  }
`;

export default function Register(props) {
  const [variables, setVariables] = useState({
    username: "",
    email: "",
    password: "",
    confrimPassword: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, __) => navigate("/login"),

    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
  });

  const handleRegister = (e) => {
    e.preventDefault();

    registerUser({ variables });
  };

  return (
    <>
      <div
        className="mt-5"
        width="100%"
        height="100%"
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
          <div className="col">
            <h1 className="text-center">register</h1>
            <form onSubmit={handleRegister}>
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
                  htmlFor="validationCustom02"
                  className={
                    errors.email ? "form-label text-danger" : "form-label"
                  }
                >
                  {errors.email ?? "Email"}
                </label>
                <input
                  type="text"
                  className={
                    errors.email ? "form-control is-invalid" : "form-control"
                  }
                  id="validationCustom02"
                  value={variables.email}
                  onChange={(e) =>
                    setVariables({ ...variables, email: e.target.value })
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
              <div className="mb-3">
                <label
                  htmlFor="validationCustom04"
                  className={
                    errors.confrimPassword
                      ? "form-label text-danger"
                      : "form-label"
                  }
                >
                  {errors.confrimPassword ?? "Confrim password"}
                </label>
                <input
                  type="text"
                  className={
                    errors.confrimPassword
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="validationCustom04"
                  value={variables.confrimPassword}
                  onChange={(e) =>
                    setVariables({
                      ...variables,
                      confrimPassword: e.target.value,
                    })
                  }
                />
              </div>
              <button
                disabled={loading}
                type="submit"
                className="btn btn-primary"
              >
                {loading ? "loading..." : "register"}
              </button>
              <p>
                Avval ro'yhatdan o'tganmisiz ? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
