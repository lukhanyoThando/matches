import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "./App.css";
import Papa from "papaparse";
import Button from "@mui/material/Button";

function App() {
  // ====================================================================================================================================================
  // Allowed extensions for input file
  const allowedExtensions = ["csv"];

  // This state will store the parsed data
  const [data, setData] = useState([]);

  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState("");

  // It will store the file uploaded by the user
  const [file, setFile] = useState("");

  // This function will be called when
  // the file input changes
  const handleFileChange = (e) => {
    setError("");

    // Check if user has entered the file
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }

      // If input type is correct set the state
      setFile(inputFile);
    }
  };
  const handleParse = () => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return setError("Enter a valid file");

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      setData(columns);
    };
    reader.readAsText(file);
  };
  // =============================================================================================================================================================

  //
  // Matching code
  // =========================================================================================================================

  const [value, setValue] = useState("");
  const [secondWord, setSecondWord] = useState("");

  // Setting text that should be allowed in my textfields
  const isLetters = (str) => /^[A-Za-z]*$/.test(str);

  function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength === 0) {
      return 0;
    }
    return (
      ((longerLength - editDistance(longer, shorter)) /
        parseFloat(longerLength)) *
      100
    );
  }
  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
    var costs = [];
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }

      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
  // console.log(similarity("Stack Overflow", "Stack Ovrflow"));-
  // ==========================================================================================================================================
  return (
    <div>
      <AppBar>
        <Toolbar>
          <Typography variant="h4" component="div">
            Technincal Assessment
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="App">
        <h1>Enter two words </h1>
        <div className="text">
          <TextField
            value={value}
            type={"string"}
            label="First Word"
            onChange={(e) => {
              if (isLetters(value)) {
                setValue(e.target.value);
              } else setValue("");
            }}
          />
          <TextField
            value={secondWord}
            label="Second Word"
            onChange={(e) => {
              // const { secondWord } = e.target;
              // setSecondWord(e.target.value);
              if (isLetters(secondWord)) {
                setSecondWord(e.target.value);
              } else setSecondWord("");
            }}
          />
        </div>
        <h1>Word Matches {similarity(value, secondWord)}%</h1>
        <div>
          <hr />
          <h1>Task 2</h1>
          <label htmlFor="csvInput" style={{ display: "block" }}>
            Enter CSV File
          </label>
          <input
            onChange={handleFileChange}
            id="csvInput"
            name="file"
            type="File"
          />
          <div>
            <Button variant="contained" onClick={handleParse}>
              Parse
            </Button>
          </div>
          <div style={{ marginTop: "150px" }}>
            {error ? error : data.map((col, idx) => <div key={idx}>{col}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
