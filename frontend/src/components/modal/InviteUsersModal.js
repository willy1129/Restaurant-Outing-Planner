import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import toast, { Toaster, ToastBar } from "react-hot-toast";

import { ImSearch } from "react-icons/im";

import { UserAuth } from "../../contexts/AuthContext";

import axios from "axios";
import server from "../../utils/constants/server";

/**
 * This List UI component is adapted from "https://tailwindcomponents.com/component/item-list-search"
 */
export default function InviteUsersModal({ show, onHide, eventId, handleAdd }) {
  const { user } = UserAuth();

  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedUser, setSelectedUser] = useState({});

  useEffect(() => {
    const retrieveUsers = async () => {
      try {
        console.log("Retrieving users with query " + query);
        const response = await axios.get(server.url + `/users/${user.uid}/?q=${query}`);
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (query.length > 0) {
      retrieveUsers();
    }
  }, [query]);

  const handleQuery = (e) => {
    setQuery(e.target.value);
  };

  const handleInvite = () => {
    const inviteUser = async () => {
      try {
        const response = await axios.post(server.url + `/events/${eventId}/invite/${selectedUser.uid}`);
        if (response.status === 202) {
          notifyToastSuccess();
          if (handleAdd) {
            handleAdd({ name: selectedUser.name });
          }
        }
        reset();
      } catch (err) {
        if (err.response.status === 409) {
          notifyDuplicateEntryToastError();
          return;
        } else {
          notifyError();
          console.error(err);
        }
      }
    };

    const notifyToastSuccess = () => toast.success("User invited successfully!", { duration: 5000, className: "text-white" });

    const notifyDuplicateEntryToastError = () =>
      toast.error("User has already been invited!", { duration: 5000, className: "text-white" });

    const notifyError = () => toast.error("Unable to add user", { duration: 5000, className: "text-white" });

    inviteUser();
  };

  const reset = () => {
    setQuery("");
    setUsers([]);
    setSelectedIndex(-1);
    setSelectedUser({});
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          onHide();
          reset();
        }}
        className=""
      >
        <div className="bg-white shadow-md rounded-lg px-3 py-2">
          <div className="block text-gray-700 text-lg font-semibold py-2 px-2">Users</div>
          <div className="flex items-center bg-gray-200 rounded-md">
            <div className="pl-3">
              <ImSearch className="text-gray-500" />
            </div>
            <input
              className="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
              id="search"
              type="text"
              placeholder="Search for users"
              autoComplete="off"
              value={query}
              onChange={(e) => handleQuery(e)}
            />
          </div>

          {/* User List */}
          <div className="py-3 text-sm overflow-y-auto" style={{ minHeight: "220px", maxHeight: "350px" }}>
            {users &&
              users.map((user, index) => (
                <div
                  key={index}
                  className=" cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2"
                  onClick={() => {
                    if (selectedIndex === index) {
                      setSelectedIndex(-1);
                      setSelectedUser({});
                    } else {
                      setSelectedIndex(index);
                      setSelectedUser(user);
                    }
                  }}
                >
                  {/* Full Name */}
                  <div className="flex justify-start">
                    {selectedIndex === index ? (
                      <span className="bg-green-400 h-2 w-2 m-2 rounded-full"></span>
                    ) : (
                      <span className="bg-gray-400 h-2 w-2 m-2 rounded-full"></span>
                    )}
                    <div className="flex-grow font-medium px-2">{user.name}</div>
                  </div>

                  {/* Email */}
                  <div className="flex justify-start">
                    <span className=" bg-transparent h-2 w-2 m-2 rounded-full"></span>
                    <div className="flex-grow px-2 text-gray-500">{user.email}</div>
                  </div>
                </div>
              ))}
          </div>

          {/* Footer */}
          <div className="block bg-gray-200 text-sm text-right py-2 px-3 -mx-3 -mb-2 rounded-b-lg">
            <button className="hover:text-gray-600 text-gray-500 font-bold py-2 px-4" onClick={onHide}>
              Cancel
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleInvite}>
              Invite
            </button>
          </div>
        </div>
      </Modal>
      <Toaster>
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              backgroundColor: "#4F46E5",
            }}
            position="top-right"
          />
        )}
      </Toaster>
      ;
    </>
  );
}
