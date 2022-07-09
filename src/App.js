import { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import TextBox from "./components/TextBox";
import Modal from "./components/Modal";
import Arrows from "./components/Arrows";
import Button from "./components/Button";

import axios from "axios";

const App = () => {
  const [showModal, setShowModal] = useState(null);
  const [inputLanguage, setInputLanguage] = useState("en");
  const [outputLanguage, setOutputLanguage] = useState("de");
  const [languages, setLanguages] = useState(null);
  const [textToTranslate, setTextToTranslate] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const getLanguages = async () => {
    const res = await axios("http://localhost:9000/languages");
    setLanguages(res.data);
  };

  const translate = async () => {
    const data = {
      textToTranslate,
      outputLanguage,
      inputLanguage,
    };

    const response = await axios({
      method: "POST",
      url: "http://localhost:9000/translation",
      data: data,
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    setTranslatedText(
      response.data.data.translations[0].translatedText.toLowerCase()
    );
  };

  useEffect(() => {
    getLanguages();
  }, []);

  const handleClick = () => {
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);
  };
  return (
    <div className="app">
      {!showModal && (
        <>
          <TextBox
            setShowModal={setShowModal}
            selectedLanguage={inputLanguage}
            style={"input"}
            textToTranslate={textToTranslate}
            setTextToTranslate={setTextToTranslate}
            setTranslatedText={setTranslatedText}
          />

          <div className="arrow-container" onClick={handleClick}>
            <Arrows />
          </div>
          <TextBox
            setShowModal={setShowModal}
            selectedLanguage={outputLanguage}
            style={"output"}
            translatedText={translatedText}
          />
          <div className="button-container" onClick={translate}>
            <Button />
          </div>
        </>
      )}
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          languages={languages}
          chosenLanguage={
            showModal === "input" ? inputLanguage : outputLanguage
          }
          setChosenLanguage={
            showModal === "input" ? setInputLanguage : setOutputLanguage
          }
        />
      )}
    </div>
  );
};

export default App;
