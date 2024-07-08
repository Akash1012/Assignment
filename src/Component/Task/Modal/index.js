import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const CustomModal = (props) => {
  const [formData, setFormData] = useState({
    _id: "",
    transporter: "",
    phoneNumber: "",
    source: "",
    currenStatus: "_",
    distanceRemaining: "_",
    dest: "",
  });

  useEffect(() => {
    if (props.addNewTrip === "UPDATE") {
      setFormData({
        ...props.selectedRow,
      });
    } else {
      setFormData({
        _id: "",
        transporter: "",
        phoneNumber: "",
        source: "",
        currenStatus: "_",
        distanceRemaining: "_",
        dest: "",
      });
    }
  }, [props.addNewTrip]);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 604,
    borderRadius: "10px",
    bgcolor: "background.paper",
    boxShadow: 24,
    padding: 3,
  };

  const {
    setOpen,
    open,
    handleClose,
    handleOpen,
    setTripData,
    allTripData,
    updateStatus,
  } = props;

  const handleValueChange = (event) => {
    console.log("akaaaa", event.target);
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  console.log("formData", props);
  const [error, setError] = React.useState(false);

  const submitForm = (e) => {
    e.preventDefault();
    if (
      formData._id !== "" ||
      formData.transporter !== "" ||
      formData.dest !== "" ||
      formData.phoneNumber !== "" ||
      formData.source !== "" ||
      formData.currenStatus !== ""
    ) {
      console.log("Submit Data");
      setTripData([formData, ...allTripData]);
      setError(false);
      handleClose();
    }
    setError(true);
  };

  const updateTime = () => {
    let temp = {
      ...props.selectedRow,
      lastPingTime: value.format("YYYY-MM-DD HH:mm:ss"),
      currenStatus: formData.currenStatus,
    };

    let updateData = allTripData.map((data) => {
      if (data._id === props.selectedRow._id) {
        return {
          ...data,
          ...temp,
        };
      } else {
        return {
          ...data,
        };
      }
    });

    setTripData(updateData);
    handleClose();
  };

  const [value, setValue] = useState(dayjs(props.selectedRow.lastPingTime));

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: "12px" }}
          >
            {updateStatus ? "Update Status" : "Add Trip"}
          </Typography>
          <form onSubmit={submitForm} error>
            {props.addNewTrip !== "UPDATE" && (
              <Stack spacing={2}>
                <Stack direction="row" spacing={4}>
                  <TextField
                    //   style={{
                    //     border: error && formData.tripId === "" && "1px solid red",
                    //     borderRadius: "4px",
                    //   }}
                    label="Trip Id"
                    size="small"
                    fullWidth
                    required
                    value={formData._id}
                    name="_id"
                    onChange={handleValueChange}
                  />
                  <TextField
                    fullWidth
                    label="Transporter"
                    size="small"
                    required
                    select
                    value={formData.transporter}
                    name="transporter"
                    onChange={handleValueChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"FedEx"}>Fed Ex</MenuItem>
                    <MenuItem value={"Bluedart"}>Bluedart</MenuItem>
                    <MenuItem value={"DHL"}>DHL</MenuItem>
                    <MenuItem value={"DTDC"}>DTDC</MenuItem>
                    <MenuItem value={"Delhivery"}>Delhivery</MenuItem>
                    <MenuItem value={"Merks"}>Merks</MenuItem>
                  </TextField>
                </Stack>

                <Stack direction="row" spacing={4}>
                  <TextField
                    fullWidth
                    label="Source"
                    size="small"
                    required
                    value={formData.source}
                    name="source"
                    onChange={handleValueChange}
                  />
                  <TextField
                    fullWidth
                    label="Destination"
                    size="small"
                    required
                    value={formData.dest}
                    name="dest"
                    onChange={handleValueChange}
                  />
                </Stack>

                <Box width="48%">
                  <TextField
                    fullWidth
                    label="Phone"
                    size="small"
                    required
                    value={formData.phoneNumber}
                    name="phoneNumber"
                    onChange={handleValueChange}
                  />
                </Box>
                <Divider />
              </Stack>
            )}

            {props.addNewTrip === "UPDATE" && (
              <Stack spacing={2}>
                <Stack direction="row" spacing={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date Time"
                      fullWidth
                      value={value}
                      onChange={(newValue) => setValue(newValue)}
                    />
                  </LocalizationProvider>

                  <TextField
                    fullWidth
                    label="Transporter"
                    size="small"
                    required
                    select
                    value={formData.currenStatus}
                    name="currenStatus"
                    onChange={handleValueChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={"Reached Destination"}>
                      Reached Destination
                    </MenuItem>
                    <MenuItem value={"In Transit"}>In Transit</MenuItem>
                    <MenuItem value={"Delivered"}>Delivered</MenuItem>
                  </TextField>
                </Stack>
              </Stack>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "end",
                marginTop: "20px",
              }}
            >
              <Stack direction="row" spacing={2}>
                <Button className="update_status" onClick={() => handleClose()}>
                  Cancel
                </Button>
                {props.addNewTrip === "UPDATE" && (
                  <Button className="update_status" onClick={updateTime}>
                    Update Status
                  </Button>
                )}

                {props.addNewTrip !== "UPDATE" && (
                  <Button
                    type="submit"
                    className="add_trip"
                    variant="contained"
                    color={"tripColor"}
                  >
                    Add Trip
                  </Button>
                )}
              </Stack>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CustomModal;
