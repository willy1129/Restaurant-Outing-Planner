import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/esm/Stack";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
// import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

// import {
//   createUserWithEmailAndPassword,
// } from "firebase/auth";

import axios from "axios";
// My imports
import { auth } from "../../config/firebase";
import server from "../../utils/constants/server";
import { UserAuth } from "../../contexts/AuthContext";

export default function SignupForm() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const { signup } = UserAuth();

  const addUserToDb = async () => {
    try {
      const uid = auth.currentUser.uid;
      let data = {
        firstname: firstname,
        lastname: lastname,
        email: email,
      };
      let response = await axios.post(server.url + `/users/create/${uid}`, data);
      if (response.status === 201) {
        console.log("User created successfully in the database");
      } else {
        console.log("User has not been created in the database");
      }
    } catch (err) {
      throw err;
    }
  };

  const handleSubmit = async (event) => {
    if (!isValid) {
      console.error("Sign up form validation failed");
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    event.preventDefault();
    try {
      await signup(email, password1);
      await addUserToDb();
      console.log("You have successfully signed up.");

      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        alert("Invalid email: email already exist.");
      }
    }
  };

  const isValid = () => {
    if (
      firstname.length === 0 ||
      lastname.length === 0 ||
      email.length === 0 ||
      password1.length === 0 ||
      password2.length === 0
    ) {
      return false;
    }

    if (password1 !== password2) {
      return false;
    }

    return true;
  };

  const goBack = () => {
    navigate("/");
  };

  return (
    <>
      <div className="w-100">
        <p className=" text-center fs-1 fw-bold mb-5">Sign Up</p>
        <Form validated={validated}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="validationCustomFirstname">
              {/* First name */}
              <Form.Label>First Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="First name"
                defaultValue=""
                onChange={(e) => setFirstname(e.target.value)}
              />
              {/* <Form.Control.Feedback></Form.Control.Feedback> */}
            </Form.Group>

            {/* Last name */}
            <Form.Group as={Col} controlId="validationCustomLastname">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Last name"
                defaultValue=""
                onChange={(e) => setLastname(e.target.value)}
              />
              {/* <Form.Control.Feedback></Form.Control.Feedback> */}
            </Form.Group>
          </Row>

          {/* Second row */}
          <Row className="mb-3">
            <Form.Group as={Col} controlId="validationCustomEmail">
              {/* Email */}
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Email address"
                defaultValue=""
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
          </Row>

          {/* Third row */}
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label htmlFor="inputPassword1">Password</Form.Label>
              <Form.Control
                type="password"
                id="inputPassword1"
                placeholder="Password"
                aria-describedby="passwordHelpBlock"
                onChange={(e) => setPassword1(e.target.value)}
              />
              <Form.Text id="passwordHelpBlock" muted>
                Your password must be 6-20 characters long, contain letters and numbers, and must not contain spaces,
                special characters, or emoji.
              </Form.Text>
            </Form.Group>
          </Row>

          {/* Fourth row */}
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label htmlFor="inputPassword2">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                id="inputPassword2"
                placeholder="Confirm Password"
                aria-describedby="passwordHelpBlock"
                onChange={(e) => setPassword2(e.target.value)}
              />
            </Form.Group>
          </Row>
        </Form>
      </div>

      <Stack gap={3} className="col-md-5 mx-auto mt-5">
        <Button className="btn-lg text-center" type="btn" onClick={handleSubmit}>
          Sign up
        </Button>

        <Button className=" text-center btn-danger mt-2" type="button" onClick={goBack}>
          Return
        </Button>
      </Stack>
    </>
  );
}
