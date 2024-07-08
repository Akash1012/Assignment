import React, { useState, useEffect } from "react";
import CircularWithValueLabel from "../ProgressCircle";
import "./style.css";

const Header = (props) => {
  const {
    totalTrip,
    tripDelivered,
    tripDelayed,
    tripReachedDestination,
    tripInTransit,
  } = props?.tripDetails;

  const percentageCalculate = (value) => {
    return parseInt((value / totalTrip) * 100);
  };
  return (
    <>
      <div className="headerInformation">
        <div className="trip_details">
          <div className="total_trip">
            <div className="total_text">Total trips</div>
            <div className="total_number">{totalTrip}</div>
          </div>
        </div>

        <div className="delivered_details">
          <div className="delivered_trip">
            <div className="total_text">Delivered</div>
            <div className="total_number">{tripDelivered}</div>
          </div>
          <div className="right_line"></div>

          <div className="progress">
            <CircularWithValueLabel />
            <p>
              Ontime: <span className="text_ontime">1,23,456</span>
            </p>
          </div>
        </div>
        <div className="trip_all_details">
          <div className="delivered_trip delay">
            <div className="total_text mb">Delayed</div>
            <div className="total_number fnt_size">{tripDelayed}</div>
          </div>
          <div className="red_line"></div>
          <div className="transit_trip">
            <div className="total_text mb">In transit</div>
            <div className="transit">
              <div className="total_number fnt_size">{tripInTransit}</div>
              <div className="transit_per">
                {" "}
                {percentageCalculate(tripInTransit)}%
              </div>
            </div>
          </div>
          <div className="transit_line"></div>
          <div className="transit_trip">
            <div className="total_text mb">Delivered</div>
            <div className="transit">
              <div className="total_number fnt_size">{tripDelivered}</div>
              <div className="transit_per">
                {percentageCalculate(tripDelivered)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
