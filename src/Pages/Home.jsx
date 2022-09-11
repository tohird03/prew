import React, { useState } from "react";
import { gql, useQuery, useMutation, useSubscription } from "@apollo/client";
import { useAuthDispatch } from "../Contexts/AuthContext";
import "./Home.css";

import jwtDecode from "jwt-decode";
import { useRef } from "react";

const GET_USERS = gql`
  query users {
    users {
      id
      username
      email
      latestMessage {
        id
        from
        to
        content
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query messages($from: String!) {
    messages(from: $from) {
      id
      from
      to
      content
    }
  }
`;

const SUB_MESSAGES = gql`
  subscription messages($from: String!) {
    messages(from: $from) {
      id
      from
      to
      content
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      id
      from
      to
      content
    }
  }
`;

function Home() {
  const dispatch = useAuthDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [content, setContent] = useState("");
  const messageInput = useRef();

  let user;
  const token = window.localStorage.getItem("acces_token");

  if (token) {
    const decodedToken = jwtDecode(token);

    user = decodedToken;
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

  const {
    data: getUsers,
    loading: getUsersLoading,
    error: getUsersError,
  } = useQuery(GET_USERS);

  const { data: getMessagesData, loading: getMsgLoading } = useQuery(
    GET_MESSAGES,
    {
      variables: {
        from: selectedUser,
      },
    }
  );

  const [sendMessage, { loading: sendMsgLoading }] = useMutation(SEND_MESSAGE);

  const { data: subMessagesData, loading: subMsgLoading } = useSubscription(
    SUB_MESSAGES,
    {
      variables: {
        from: selectedUser,
      },
    }
  );

  const sendMessageSubmit = (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    sendMessage({
      variables: { to: selectedUser, content: content.trim() },
    });

    messageInput.current.value = "";
  };

  return (
    <>
      {getUsers && (
        <>
          <div id="container">
            <div id="search-box">
              <div id="burger">
                <i className="fa fa-bars"></i>
              </div>
              <div id="search">
                <input id="search-input" type="text" placeholder="Search" />
              </div>
            </div>
            <div id="chat-list">
              {getUsers?.users &&
                getUsers?.users.map((user) => (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedUser(user.username)}
                    key={user.id}
                    className={
                      selectedUser === user.username
                        ? "chat-list-item active"
                        : "chat-list-item"
                    }
                  >
                    <div className="avatar">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "50px",
                          height: "50px",
                          fontSize: "26px",
                          borderRadius: "50%",
                          background: `#${Math.random()
                            .toString(16)
                            .substring(2, 8)}`,
                        }}
                      >
                        {user.username
                          .split("")
                          .filter((e, index) => index === 0)}
                      </div>
                    </div>
                    <div className="name">{user.username}</div>
                    <div className="last-message">
                      {" "}
                      {user.latestMessage
                        ? user.latestMessage.content
                        : "You are now connected!"}
                    </div>
                  </div>
                ))}
            </div>

            <div id="chat-header">
              <div className="name fs-4">
                {selectedUser ? selectedUser : "Telegram"}
              </div>
              <div className="action">
                <div className="phone">
                  <i className="fa fa-phone"></i>
                </div>
                <div className="find">
                  <i className="fa fa-search"></i>
                </div>
                <div className="hide-info">
                  <i className="fa fa-caret-square-o-right active"></i>
                </div>
                <div className="more">
                  <i className="fa fa-ellipsis-v"></i>
                </div>
              </div>
            </div>
            <div id="chat-info">
              <div className="info-head">
                <div className="title bold">User Info</div>
                <div className="close btn">
                  <i className="fa fa-close"></i>
                </div>
              </div>
              <div className="info-body">
                <div className="summary">
                  <img
                    src="https://www.w3schools.com/howto/img_avatar.png"
                    alt="avatar"
                  />
                  <div className="name bold">{user.username}</div>
                </div>
                <div className="contact">
                  <div className="info-icon">
                    <i className="fa fa-info-circle"></i>
                  </div>
                  <div className="mobile">
                    <span>+998 99 999 9999</span>
                    <span className="gray">Mobile</span>
                  </div>
                  <div className="username">
                    <span>@{user.username}</span>
                    <span className="gray">Username</span>
                  </div>
                  <div className="notification-icon">
                    <i className="fa fa-bell-o"></i>
                  </div>
                  <div
                    onClick={logout}
                    style={{ cursor: "pointer" }}
                    className="notifications text-primary fs-3"
                  >
                    Logout
                  </div>
                </div>
                <div className="resource">
                  <div className="item photos">
                    <div className="icon">
                      <i className="fa fa-photo"></i>
                    </div>
                    <div className="stat">10 photos</div>
                  </div>
                  <div className="item files">
                    <div className="icon">
                      <i className="fa fa-file-pdf-o"></i>
                    </div>
                    <div className="stat">1 file</div>
                  </div>
                  <div className="item links">
                    <div className="icon">
                      <i className="fa fa-external-link"></i>
                    </div>
                    <div className="stat">12 shared links</div>
                  </div>
                  <div className="item groups">
                    <div className="icon">
                      <i className="fa fa-group"></i>
                    </div>
                    <div className="stat">4 groups in common</div>
                  </div>
                </div>
                <div className="action"></div>
              </div>
            </div>
            <div id="chat-content">
              {subMessagesData || getMessagesData ? (
                subMessagesData?.messages ? (
                  subMessagesData?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        selectedUser === message.to
                          ? "message me"
                          : "message guest"
                      }
                    >
                      <div>{message.content}</div>
                    </div>
                  ))
                ) : (
                  getMessagesData?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={
                        selectedUser === message.to
                          ? "message me"
                          : "message guest"
                      }
                    >
                      <div>{message.content}</div>
                    </div>
                  ))
                )
              ) : subMsgLoading || getMsgLoading ? (
                <div
                  style={{ width: "100%", height: "100vh" }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <div
                    style={{ width: "3rem", height: "3rem" }}
                    className="spinner-border"
                    role="status"
                  >
                    <span className="visually-hidden text-secondary">
                      Loading...
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                  <h1>You are now connected {selectedUser}</h1>
                </div>
              )}
            </div>
            <form onSubmit={(e) => sendMessageSubmit(e)} id="chat-input">
              <div className="attachment">
                <i className="fa fa-plus"></i>
              </div>
              <div className="textarea w-100">
                <input
                  className="form-control w-100"
                  ref={messageInput}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    sendMsgLoading ? "Is being sent" : "Writing message..."
                  }
                  name="input-message"
                  id="input-message"
                />
              </div>

              <div className="emoji">
                <i className="bi bi-emoji-smile"></i>
              </div>

              {!sendMsgLoading ? (
                <button type="submit" className="voice">
                  <i className="bi bi-send-fill"></i>
                </button>
              ) : (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </form>
          </div>
        </>
      )}
      {getUsersLoading && (
        <div
          style={{ width: "100%", height: "100vh" }}
          className="d-flex align-items-center justify-content-center"
        >
          <div
            style={{ width: "6rem", height: "6rem" }}
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {getUsersError && (
        <div>
          <h1>NETWORK NOT CONNECTION :(</h1>
        </div>
      )}
    </>
  );
}

export default Home;
