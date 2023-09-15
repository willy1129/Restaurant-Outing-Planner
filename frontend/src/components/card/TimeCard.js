import React from "react";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { AiOutlineCheckCircle } from "react-icons/ai";

/**
 *
 * @param {*} schedule: [{ proposer_name, date, time, total_votes, user_voted }]
 * date: e.g. "AUGUEST 20, 2023"
 * time: e.g. "5:30 PM"
 */
export default function TimeCard({ schedule, highestVote, userSuggested, undoAdd, deleteSchedule }) {
  const handleUndo = () => {
    undoAdd(schedule, true);
  };

  const handleDelete = async () => {
    await deleteSchedule(schedule.date, schedule.time);
  };

  return (
    <>
      {schedule === undefined ? null : (
        <Card
          style={{ width: "18rem", height: "100%" }}
          border="warning"
          className={` hover:bg-indigo-100 border-0 shadow-md ${
            schedule.total_votes === highestVote ? "shadow-yellow-500" : "shadow-slate-300"
          }`}
        >
          <Card.Body className="d-flex flex-column">
            <DropdownButton className="d-flex flex-row-reverse" size="sm" variant="Secondary" title="" drop="end"> 
              <Dropdown.Item  id="dropdown-basic" size="sm" variant="danger" onClick={handleDelete}>
                Delete
              </Dropdown.Item>
            </DropdownButton>
            <div className="d-flex justify-content-between">
              <Card.Subtitle className="mb-1 ">
                <h5>{schedule.date}</h5>
              </Card.Subtitle>

              <Card.Subtitle className="">
                {schedule.user_voted ? <AiOutlineCheckCircle size="25px" color="#16A34A" /> : null}
              </Card.Subtitle>
            </div>
            <Card.Subtitle className="mb-0 text-muted">
              <h6 className="p-0 m-0">{schedule.time}</h6>
            </Card.Subtitle>

            <div className="d-flex justify-content-between align-items-end h-100 mt-2 mr-1">
              <div>
                <Card.Text className=" text-uppercase text-gray-400 text-sm">{schedule.proposer_name}</Card.Text>
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center  bg-blue-50 text-blue-600"
                style={{ height: "25px", width: "25px" }}
              >
                <Card.Subtitle className="">{schedule.total_votes}</Card.Subtitle>
              </div>
            </div>

            {userSuggested ? (
              <div className="mt-2">
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
