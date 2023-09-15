import React from "react";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import {BsThreeDotsVertical} from "react-icons/bs";
import { AiOutlineCheckCircle } from "react-icons/ai";

/**
 *
 * @param {*} place: [{ proposer_name, address, restaurant_name, rating, total_votes, user_voted }]
 * @param {int} highestVote
 * @param {bool} userSuggested
 */
export default function PlaceCard({ place, highestVote, userSuggested, undoAdd, onClick, selected, deletePlace }) {
  const handleUndo = () => {
    undoAdd(place, true);
  };

  const handleDelete = () => {
    deletePlace(place.place_id);
  };

  return (
    <>
      {place === undefined ? null : (
        <Card
          style={{
            width: "18rem",
            height: "100%",
            backgroundColor: selected && selected.place_id === place.place_id ? "#E0E7FF" : "#fff",
          }}
          className={`
          hover:bg-indigo-100 border-0 shadow-md hover:cursor-pointer ${
            place.total_votes === highestVote ? "shadow-yellow-500" : "shadow-slate-300"
          }`}
          onClick={() => {
            onClick();
          }}
        >
          <Card.Body className="d-flex flex-column  ">
            <DropdownButton className="d-flex flex-row-reverse" size="sm" variant="Secondary" title="" drop="end"> 
              <Dropdown.Item  id="dropdown-basic" size="sm" onClick={()=>handleDelete()} variant="danger">
                Delete
              </Dropdown.Item>
            </DropdownButton>
            <div className="d-flex justify-content-between">
              <Card.Subtitle className="">
                <h5>{place.restaurant_name}</h5>
              </Card.Subtitle>

              <Card.Subtitle className="">
                {place.user_voted ? <AiOutlineCheckCircle size="25px" color="#16A34A" /> : null}
              </Card.Subtitle>
            </div>

            <Card.Subtitle className="  text-muted ">
              <h6 className="p-0 m-0">{place.address}</h6>
            </Card.Subtitle>

            <div className="d-flex justify-content-between align-items-end h-100 mt-2 mr-1">
              <div>
                <Card.Text className=" text-uppercase text-gray-400 text-sm">{place.proposer_name}</Card.Text>
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center  bg-blue-50 text-blue-600"
                style={{ height: "25px", width: "25px" }}
              >
                <Card.Subtitle className="">{place.total_votes}</Card.Subtitle>
              </div>
            </div>

            {userSuggested ? (
              <div className="mt-2 ">
                <button
                  className="text-white bg-gradient-to-r  from-red-600 via-red-700 to-orange-800 hover:from-orange-800 hover:via-red-700 hover:to-red-600 font-medium rounded-lg text-sm px-2 py-1 text-center mr-2 mb-2 shadow-md"
                  onClick={handleUndo}
                >
                  Undo
                </button>
              </div>
            ) : null}
          </Card.Body>
        </Card>
      )}
    </>
  );
}
