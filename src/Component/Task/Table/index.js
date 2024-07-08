import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TripList from "../frontendAssignment.json";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import "./style.css";
import CustomModal from "../Modal";
import Header from "../Header";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "_id",
    numeric: false,
    disablePadding: true,
    label: <b>Trip id</b>,
  },
  {
    id: "transporter",
    numeric: true,
    disablePadding: false,
    label: <b>Transporter</b>,
  },
  {
    id: "source",
    numeric: true,
    disablePadding: false,
    label: <b>Source</b>,
  },
  {
    id: "dest",
    numeric: true,
    disablePadding: false,
    label: <b>Destination</b>,
  },
  {
    id: "phoneNumber",
    numeric: true,
    disablePadding: false,
    label: <b>Phone</b>,
  },
  {
    id: "lastPingTime",
    numeric: true,
    disablePadding: false,
    label: <b>ETA</b>,
  },
  {
    id: "distanceRemaining",
    numeric: true,
    disablePadding: false,
    label: <b>Distance remaining</b>,
  },
  {
    id: "currenStatus",
    numeric: true,
    disablePadding: false,
    label: <b>Trip status</b>,
  },
  {
    id: "currenStatus_",
    numeric: true,
    disablePadding: false,
    label: <b>TAT status</b>,
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell, index) => {
          return (
            <TableCell
              key={index}
              // align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const {
    numSelected,
    setOpen,
    open,
    handleClose,
    handleOpen,
    akash,
    setAddNewTrip,
  } = props;
  const updateStatus = numSelected > 0 ? false : true;

  const changeStatus = () => {
    setOpen(true);
    setAddNewTrip("UPDATE");
  };
  return (
    <Toolbar
      sx={{
        pl: { sm: 1 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        style={{
          fontWeight: "800",
          fontSize: "16px",
        }}
        sx={{ flex: "1 1 80%" }}
        id="tableTitle"
        component="div"
      >
        Trip List
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          disabled={updateStatus}
          className="update_status"
          onClick={() => {
            changeStatus();
          }}
        >
          Update Status
        </Button>
        <Button
          className="add_trip"
          variant="contained"
          color={"tripColor"}
          onClick={() => {
            handleOpen();
            setAddNewTrip("ADD");
          }}
        >
          Add Trip
        </Button>
      </Stack>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("transporter");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [allTripData, setTripData] = useState(TripList.data);
  const [rowsPerPage, setRowsPerPage] = React.useState(allTripData?.length);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = allTripData.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const [selectedRow, setSelectedRow] = useState({});
  const handleClick = (event, row, id, index) => {
    // debugger;

    setSelectedRow(row);
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * allTripData.length - 10) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(allTripData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  const { palette } = createTheme();
  const { augmentColor } = palette;
  const createColor = (mainColor) =>
    augmentColor({ color: { main: mainColor } });
  const theme = createTheme({
    palette: {
      anger: createColor("#F40B27"),
      apple: createColor("#5DBA40"),
      steelBlue: createColor("#5C76B7"),
      violet: createColor("#BC00A3"),
      tripColor: createColor("#3388EB"),
    },
  });

  let statusColor = {
    Delayed: {
      color: "#FE9023",
      backgroundColor: "#FE90231A",
    },
    "Reached Destination": {
      color: "#038700",
      backgroundColor: "#0387001A",
    },

    "In Transit": {
      color: "white",
      backgroundColor: "grey",
    },

    Booked: {
      color: "#3388EB",
      background: "#3388EB1A",
    },
  };

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

  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    transporter: "",
    distanceRemaining: "",
    phoneNumber: "",
    source: "",
    currenStatus: "_",
    distanceRemaining: "_",
  });

  const handleClose = () => setOpen(false);
  const [addNewTrip, setAddNewTrip] = useState("");
  const handleOpen = () => {
    setOpen(true);
  };

  const [tripDetails, setTripDetails] = useState({
    totalTrip: 0,
    tripDelivered: 0,
    tripDelayed: 0,
    tripReachedDestination: 0,
    tripInTransit: 0,
  });

  useEffect(() => {
    let totalTrip = 0;
    let tripDelivered = 0;
    let tripDelayed = 0;
    let tripReachedDestination = 0;
    let tripInTransit = 0;

    allTripData.forEach((trip) => {
      totalTrip++;
      switch (trip.currenStatus) {
        case "Delayed":
          tripDelayed++;
          break;
        case "Reached Destination":
          tripReachedDestination++;
          break;
        case "In Transit":
          tripInTransit++;
          break;
        default:
          tripDelivered++;
      }
    });

    setTripDetails({
      totalTrip,
      tripDelivered,
      tripDelayed,
      tripReachedDestination,
      tripInTransit,
    });
  }, [allTripData]);

  return (
    <ThemeProvider theme={theme}>
      <Header tripDetails={tripDetails} />
      <CustomModal
        handleClose={handleClose}
        handleOpen={handleOpen}
        setOpen={setOpen}
        open={open}
        setTripData={setTripData}
        allTripData={allTripData}
        selectedRow={selectedRow}
        updateStatus={Object.keys(selectedRow)?.length}
        addNewTrip={addNewTrip}
      />

      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            setOpen={setOpen}
            open={setOpen}
            handleClose={handleClose}
            handleOpen={handleOpen}
            setSelectedRow={setSelectedRow}
            setAddNewTrip={setAddNewTrip}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={8}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  const {
                    currenStatus,
                    dest,
                    distanceRemaining,
                    lastPingTime,
                    phoneNumber,
                    source,
                    transporter,
                    etaDays,
                    _id,
                    tripStartTime,
                    tripEndTime,
                  } = row;

                  const getDate = new Date(lastPingTime).toLocaleDateString();
                  const getTime = new Date(lastPingTime).toLocaleString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }
                  );

                  let calculateTatStatuts;
                  let statusTatColor = {};

                  let getOnlyDateValue = new Date(lastPingTime).getDate();
                  const Difference_In_Days = (difference_In_Time) => {
                    return Math.round(difference_In_Time / (1000 * 3600 * 24));
                  };

                  let tripStartTime_ = new Date(tripStartTime).getTime();
                  let lastPingTime_ = new Date(lastPingTime).getTime();

                  let calculateTheDateDifference = Difference_In_Days(
                    lastPingTime_ - tripStartTime_
                  );

                  if (etaDays === 0 || etaDays < 0) {
                    calculateTatStatuts = "Others";
                    statusTatColor = {
                      color: "#038700",
                      backgroundColor: "#0387001A",
                    };
                  } else if (etaDays >= calculateTheDateDifference) {
                    calculateTatStatuts = "Delayed";
                    statusTatColor = {
                      color: "#FE9023",
                      backgroundColor: "#FE90231A",
                    };
                  } else {
                    let current_eta;

                    if (tripEndTime) {
                      let timeCalculate =
                        new Date(tripEndTime).getTime() -
                        new Date(tripStartTime).getTime();

                      current_eta = Difference_In_Days(timeCalculate);
                    } else if (lastPingTime) {
                      current_eta =
                        new Date(lastPingTime).getTime() -
                        new Date(tripStartTime).getTime();
                    }

                    if (etaDays <= current_eta) {
                      calculateTatStatuts = "Ontime";
                      statusTatColor = {
                        color: "#038700",
                        backgroundColor: "#0387001A",
                      };
                    }
                  }

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClick(event, row, row._id, index)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={_id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {_id}
                      </TableCell>
                      <TableCell id={labelId}>{transporter}</TableCell>
                      <TableCell id={labelId}>{source}</TableCell>
                      <TableCell id={labelId}>{dest}</TableCell>
                      <TableCell id={labelId}>{phoneNumber}</TableCell>
                      <TableCell id={labelId}>
                        {getDate}, {getTime}
                      </TableCell>
                      <TableCell id={labelId}>{distanceRemaining}</TableCell>
                      <TableCell id={labelId}>
                        <button
                          style={{
                            ...statusColor[currenStatus],
                            border: "none",
                            borderRadius: "4px",
                            padding: "10px",
                            width: "152px",
                          }}
                        >
                          {currenStatus}
                        </button>
                      </TableCell>
                      <TableCell id={labelId}>
                        <button
                          style={{
                            ...statusTatColor,
                            border: "none",
                            borderRadius: "4px",
                            padding: "10px",
                            width: "152px",
                          }}
                        >
                          {calculateTatStatuts}
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={allTripData.length / 10}
            rowsPerPage={10}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default EnhancedTable;
