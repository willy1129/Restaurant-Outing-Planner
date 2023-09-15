import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

// import axios from "axios";
// import server from "../../utils/constants/server";
import dayjs from "dayjs";

export default function AddScheduleModal({ show, onHide, data, setData }) {
  // const [scheduleInfo, setScheduleInfo] = useState({}); // Todo: Form should establishes this info

  const [dateSelected, setDateSelected] = useState(dayjs());
  const [timeSelected, setTimeSelected] = useState(dayjs());

  const handleAdd = () => {
    let date = dayjs(dateSelected.$d).format("MMM D, YYYY");
    let time = dayjs(timeSelected.$d).format("h:mm A");
    setData({ date: date, time: time });

    onHide();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className=" "
        style={{ height: "300px" }}
      >
        <Modal.Header closeButton>
          <h3>Propose a Schedule</h3>
        </Modal.Header>
        <Modal.Body className="">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="d-flex flex-row justify-content-lg-around">
              <div>
                {/* <h5 className=" text-gray-700">Select a date</h5> */}
                <DatePicker
                  label="Select a date"
                  format="MMM D, YYYY"
                  value={dateSelected}
                  onChange={setDateSelected}
                />
              </div>
              <div>
                {/* <h5 className=" text-gray-700">Select a time</h5> */}
                <TimePicker label="Select a time" format="hh:mm A" value={timeSelected} onChange={setTimeSelected} />
              </div>
            </div>
          </LocalizationProvider>
        </Modal.Body>
        <Modal.Footer className="">
          <button
            className="text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-indigo-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 shadow-md"
            onClick={handleAdd}
          >
            Add
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
