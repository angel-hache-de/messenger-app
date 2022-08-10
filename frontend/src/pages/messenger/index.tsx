import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";

import Friends from "../../components/friends";
import RightSide from "../../components/right-side";
import { IStoreState } from "../../store/types";
import FriendSectionHeader from "../../components/friend-section-header";

import {
  FRIENDS_ACTION_TYPE,
  IFriendsAction,
  IFriendsObj,
} from "../../store/types/friendsTypes";
import ActiveFriends from "../../components/active-friends";
import {
  IStatusAction,
  STATUS_ACTION_TYPE,
} from "../../store/types/statusTypes";
import {
  IMessage,
  IMessengerAction,
  IUpdateMessageStatusSocket,
  IUpdateMessageStatusSocketRes,
  MESSAGES_SOCKET_EVENTS,
  MESSAGE_STATUS,
  MESSENGER_ACTION_TYPE,
} from "../../store/types/messengerTypes";
import { ITypingMessageResponse } from "../../store/types/socketTypes";
import { IUser } from "../../store/types/authTypes";
import { updateMessage } from "../../store/actions/friendsActions";
import { removeToken } from "../../store/actions/authActions";
import { getTheme } from "../../store/actions/statusActios";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../typings/socket";

import "./messenger.style.scss";

const Messenger = () => {
  const {
    currentFriend,
    friends,
    loading: loadingFriends,
  } = useSelector((state: IStoreState) => state.friends);
  const { error, theme } = useSelector((state: IStoreState) => state.status);
  const { userInf } = useSelector((state: IStoreState) => state.auth);
  const alert = useAlert();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Socket
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  // Validates the session
  useEffect(() => {
    if (!userInf) navigate("/messenger/login");
  }, [userInf, navigate]);

  // Shows an erro  whenever occurs
  useEffect(() => {
    if (!!error) {
      alert.error(error);
      dispatch({
        type: STATUS_ACTION_TYPE.CLEAR_ERROR,
      } as IStatusAction);
    }
  }, [error, dispatch, alert]);

  // Creates the socket connection
  useEffect(() => {
    if(!userInf) return;
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    const token = localStorage.getItem("authToken");
    socketRef.current = io(process.env.REACT_APP_SOCKET_ENDPOINT!, {
      auth: {
        token,
      },
    });

    // Handle errors
    socketRef.current.on(
      MESSAGES_SOCKET_EVENTS.ERROR_WHILE_CONNECTING,
      (err: Error) => {
        if (err.message === "jwt expired") {
          // Disconnects the socket when the componen unmounts
          // dispatch should not change
          socketRef.current?.disconnect();
          socketRef.current = null;
          removeToken(dispatch);
        } else {
          dispatch({
            type: STATUS_ACTION_TYPE.SET_ERROR,
            payload: {
              error: err.message,
            },
          } as IStatusAction);
        }
      }
    );
  }, [dispatch, userInf]);

  /**
   * Disconnects the socket
   */
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Used to update the last message status beetwen the
  // auth user and the current friend
  useEffect(() => {
    if (!currentFriend || !Object.keys(friends).length) return;
    const message = friends[currentFriend.uid].lastMessage;
    if (!message) return;
    if (
      message.emitterId === currentFriend.uid &&
      message.status !== MESSAGE_STATUS.SEEN
    ) {
      // Updates the message state of the message
      socketRef.current?.emit(
        MESSAGES_SOCKET_EVENTS.UPDATE_MESSAGE_STATUS_REQUEST,
        {
          receptorId: currentFriend.uid,
          status: MESSAGE_STATUS.SEEN,
        } as IUpdateMessageStatusSocket
      );

      dispatch({
        type: FRIENDS_ACTION_TYPE.SET_MESSAGES_STATUS,
        payload: {
          messageStatus: {
            friendId: currentFriend.uid,
            status: MESSAGE_STATUS.SEEN,
          },
        },
      } as IFriendsAction);
    }
  }, [currentFriend, friends, dispatch]);

  useEffect(() => {
    // if (!Object.keys(friends).length) return;

    // Incoming message
    socketRef.current
      ?.removeAllListeners(MESSAGES_SOCKET_EVENTS.PRIVATE_MESSAGE_RECEIVED)
      .on(
        MESSAGES_SOCKET_EVENTS.PRIVATE_MESSAGE_RECEIVED,
        (message: IMessage) => {
          const { emitterId } = message;

          toast.success(`${friends[emitterId].userName} sent you a message!`, {
            icon: "🔔",
            duration: 8000,
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });

          // Updates the last message of the emitter
          dispatch({
            type: FRIENDS_ACTION_TYPE.SET_LAST_MESSAGE,
            payload: {
              newMessage: {
                friendId: message.emitterId,
                message,
              },
            },
          } as IFriendsAction);

          // If the emitter is the current friend then
          // will be displayed on screen
          if (currentFriend && currentFriend.uid === emitterId) {
            dispatch({
              type: MESSENGER_ACTION_TYPE.ADD_MESSAGE,
              payload: {
                message,
              },
            } as IMessengerAction);

            // Updates the message state
            dispatch(
              updateMessage(message.id, message.emitterId, MESSAGE_STATUS.SEEN)
            );

            socketRef.current?.emit(
              MESSAGES_SOCKET_EVENTS.UPDATE_MESSAGE_STATUS_REQUEST,
              {
                receptorId: currentFriend?.uid,
                status: MESSAGE_STATUS.SEEN,
              } as IUpdateMessageStatusSocket
            );

            return;
          }

          socketRef.current?.emit(
            MESSAGES_SOCKET_EVENTS.UPDATE_MESSAGE_STATUS_REQUEST,
            {
              receptorId: message.emitterId,
              status: MESSAGE_STATUS.DELIVERED,
            } as IUpdateMessageStatusSocket
          );
          // Updates the message status
          dispatch(
            updateMessage(
              message.id,
              message.emitterId,
              MESSAGE_STATUS.DELIVERED
            )
          );
        }
      );
  }, [dispatch, friends, currentFriend]);

  useEffect(() => {
    if (!userInf) return;

    // removes a friend from active friends section
    socketRef.current?.on(
      MESSAGES_SOCKET_EVENTS.USER_DISCONNECTED,
      (userId: string) => {
        dispatch({
          type: FRIENDS_ACTION_TYPE.REMOVE_ACTIVE_FRIEND,
          payload: {
            activeFriend: userId,
          },
        } as IFriendsAction);
      }
    );
  }, [dispatch, userInf]);

  useEffect(() => {
    // Avoid unexpected behaviors
    if (loadingFriends) return;

    // Add an user to active friends section
    socketRef.current
      ?.removeAllListeners(MESSAGES_SOCKET_EVENTS.USER_CONNECTED)
      .on(MESSAGES_SOCKET_EVENTS.USER_CONNECTED, (user: IUser) => {
        const userId = user.uid;
        if (userId === userInf?.uid) return;

        // If the user has not been fetched yet
        // This occurs when a user sign up
        if (!friends[userId]) {
          dispatch({
            type: FRIENDS_ACTION_TYPE.SET_FRIENDS,
            payload: {
              friends: {
                [userId]: user,
              },
            },
          } as IFriendsAction);
        }

        dispatch({
          type: FRIENDS_ACTION_TYPE.SET_ACTIVE_FRIENDS,
          payload: {
            activeFriends: { [userId]: userId },
          },
        } as IFriendsAction);
      });
  }, [dispatch, userInf, friends, loadingFriends]);

  useEffect(() => {
    // show/hide the typing message animation
    socketRef.current?.on(
      MESSAGES_SOCKET_EVENTS.SHOW_TYPING_MESSAGE,
      ({ emitterId, isTyping }: ITypingMessageResponse) => {
        dispatch({
          type: FRIENDS_ACTION_TYPE.SET_IS_TYPING,
          payload: {
            typing: {
              isTyping,
              userId: emitterId,
            },
          },
        } as IFriendsAction);
      }
    );

    // Updates message status
    socketRef.current?.on(
      MESSAGES_SOCKET_EVENTS.UPDATE_MESSAGE_STATUS,
      ({ emitterId, status }: IUpdateMessageStatusSocketRes) => {
        dispatch({
          type: FRIENDS_ACTION_TYPE.SET_MESSAGES_STATUS,
          payload: {
            messageStatus: {
              friendId: emitterId,
              status,
            },
          },
        } as IFriendsAction);
      }
    );
  }, [dispatch]);

  useEffect(() => {
    if (!userInf) return;
    // Get the active friends to show 'em in active friends section
    socketRef.current?.on(
      MESSAGES_SOCKET_EVENTS.GET_USERS,
      (usersId: IFriendsObj<string>) => {
        // Deletes the current user
        if (!!usersId[userInf.uid]) delete usersId[userInf.uid];

        dispatch({
          type: FRIENDS_ACTION_TYPE.SET_ACTIVE_FRIENDS,
          payload: {
            activeFriends: usersId,
          },
        } as IFriendsAction);
      }
    );
  }, [dispatch, userInf]);

  // Loads the theme from localStorage
  useEffect(() => {
    dispatch(getTheme());
  }, [dispatch]);

  if (!userInf) return <></>;
  return (
    <>
      <Toaster position="top-right" />
      <div className="messenger" dark-theme={theme}>
        <div className="row">
          <div className="col-3">
            <div className="left-side">
              <FriendSectionHeader
                username={userInf.userName}
                image={userInf.image}
              />
              <ActiveFriends />
              <Friends />
            </div>
          </div>

          {!!currentFriend && <RightSide socket={socketRef} />}
        </div>
      </div>
    </>
  );
};

export default Messenger;
