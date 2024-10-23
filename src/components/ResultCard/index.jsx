import React from "react";
import styled from "styled-components";

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 5px;
  width: 150px;
  text-align: center;
  background-color: ${({ isTrue }) => (isTrue ? "lightgreen" : "lightcoral")};
`;

const CountryName = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
`;

const ResultText = styled.div`
  font-size: 14px;
`;

const ResultCard = ({ country, isTrue }) => {
  return (
    <Card isTrue={isTrue}>
      <CountryName>{country}</CountryName>
      <ResultText>{isTrue ? "Correct" : "Incorrect"}</ResultText>
    </Card>
  );
};

export default ResultCard;
