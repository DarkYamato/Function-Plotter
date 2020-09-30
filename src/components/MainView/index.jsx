import React, { useEffect, useState } from "react";
import Input from "../Input";
import Plot from "../Plot";

import "./index.css";

import { appId, allowedSymbols } from "../utils";

const MainView = () => {
  const [wolfram, setWolfram] = useState(false);
  const [expression, setExpression] = useState("");
  const [rangeFrom, setRangeFrom] = useState("");
  const [rangeTo, setRangeTo] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    checkExpression();
  }, [expression]);

  const checkExpression = () => {
    const expr = expression.replace(/(sqrt\(.*\))/, "");
    const found = expr.split("").every((r) => allowedSymbols.indexOf(r) >= 0);
    if (found) {
      setIsValid(true);
      parseExpression();
    } else {
      setIsValid(false);
    }
  };

  const parseExpression = () => {
    const expr = `return ${expression
      .replace("sqrt", "Math.sqrt")
      .replace("^", "**")}`;
    try {
      new Function("x", expr);
      setIsValid(true);
    } catch (e) {
      setIsValid(false);
    }
  };

  const onChange = () => {
    setWolfram(!wolfram);
    setLoad(false);
  };

  const wolframExpressin = expression.replace(/\+/g, "%2B");
  const wolframLink = `http://api.wolframalpha.com/v2/simple?appid=${appId}&i=plot+${wolframExpressin}+from+x=${rangeFrom}
  +to+${rangeTo}%3F`;
  const inputsFilled = expression && rangeFrom && rangeTo;

  return (
    <div className="main-container">
      <h1>function plotter</h1>
      <div className="inputs-container">
        <Input
          type="expression"
          name="Expression"
          value={expression}
          onChange={setExpression}
          error={!isValid}
        />
        <Input
          type="number"
          name="X Range From"
          value={rangeFrom}
          onChange={setRangeFrom}
        />
        <Input
          type="number"
          name="X Range To"
          value={rangeTo}
          onChange={setRangeTo}
        />
      </div>
      <div className="toggle-container">
        <span>Use WolframAlpha API</span>
        <label className="switch">
          <input type="checkbox" checked={wolfram} onChange={onChange} />
          <div className="slider"></div>
        </label>
      </div>
      {inputsFilled && isValid ? (
        wolfram ? (
          <>
            {!load && <div>Loading...</div>}
            <img alt="" src={wolframLink} onLoad={() => setLoad(true)} />
          </>
        ) : (
          <Plot
            expression={expression}
            from={rangeFrom}
            to={rangeTo}
            setIsValid={setIsValid}
          />
        )
      ) : (
        <div>Please enter valid data</div>
      )}
    </div>
  );
};

export default MainView;
