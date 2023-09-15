import React from "react";
import Card from "react-bootstrap/Card";
import { FiPlus } from "react-icons/fi";

export default function AddCard({ onClick, modal }) {
  return (
    <>
      <Card
        style={{ width: "18rem", height: "100%" }}
        className=" shadow-md border-1 group hover:bg-sky-300 hover:cursor-pointer hover:border-transparent "
        onClick={onClick}
      >
        <Card.Body className="d-flex justify-content-center align-items-center ">
          <Card.Text className="">
            <FiPlus className="group-hover:stroke-white" size={20} />
          </Card.Text>
        </Card.Body>
      </Card>
      {modal}
    </>
  );
}
