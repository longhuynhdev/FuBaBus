import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./HomePage.scss";
import Header from "../HomePages/Header";
import dropdown from "/img/caret-down.svg";
import axios from "axios";
import bannerImage from "../../assets/banner.png";

const HomePage = () => {
  const [item, setItem] = useState({ kindOfStand: "", another: "another" });
  const { kindOfStand } = item;

  const today = new Date(); // Lấy ngày hôm nay
  const [selectedDate, setSelectedDate] = useState(today);

  const handleChange = (e) => {
    e.persist();
    console.log(e.target.value);

    setItem((prevState) => ({
      ...prevState,
      kindOfStand: e.target.value,
    }));
  };

  const navigate = useNavigate();

  const huongdan = () => {
    navigate("/huongdan");
  };

  const dienthongtin = (id) => {
    navigate(`/thong-tin-ve/${id}`);
  };

  const [DiemDi, setDiemDi] = useState("");
  const [DiemDen, setDiemDen] = useState("");
  const [SoVe, setSoVe] = useState(1);

  const swapDiaDiem = () => {
    const temp = DiemDi;
    setDiemDi(DiemDen);
    setDiemDen(temp);
  };

  const [DSDiemDi, setDSDiemDi] = useState([
    "TP Hồ Chí Minh",
    "Đà Lạt",
    "Đà Nẵng",
  ]);
  const [DSDiemDen, setDSDiemDen] = useState([
    "TP Hồ Chí Minh",
    "Khánh Hoà",
    "Đà Lạt",
    "Đà Nẵng",
  ]);

  const [LoaiVe, setLoaiVe] = useState("MotChieu");

  const [startDate, setStartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());

  const [DSChuyenXe, setDSChuyenXe] = useState([]);

  const [TimChuyen, setTimChuyen] = useState(0);

  const locationMapping = {
    "TP Hồ Chí Minh": "Ho Chi Minh City",
    "Khánh Hoà": "Khanh Hoa",
    "Đà Lạt": "Da Lat",
    "Đà Nẵng": "Da Nang",
  };

  const getBuses = async (
    departureLocation,
    arrivalLocation,
    departureTime,
    sortByFare = null,
    sortByDepartureTime = null,
    busType = null,
    timeType = null
  ) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/buses/search`,
        {
          params: {
            departureLocation: departureLocation,
            arrivalLocation: arrivalLocation,
            departureTime: departureTime,
            sortByFare: sortByFare,
            sortByDepartureTime: sortByDepartureTime,
            busType: busType,
            timeType: timeType,
          },
        }
      );
      console.log("Called");
      if (response.status === 200) {
        console.log(response.data);
        setDSChuyenXe(response.data);
        return response.data;
      } else {
        console.error("Error fetching buses");
      }
    } catch (error) {
      console.error("Error during API request:", error);
    }
  };

  const getFormattedDate = (date) => {
    let year = date.getFullYear();
    let month = 1 + date.getMonth();
    month = month >= 10 ? month : "0" + month;
    let day = date.getDate();
    day = day >= 10 ? day : "0" + day;
    return year + "-" + month + "-" + day;
  };

  const [FastFilVal, setFastFilVal] = useState("");
  const handleSortByFareAscending = (e) => {
    if (e.target.id == FastFilVal) {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate)
      );
      e.target.checked = false;
      setFastFilVal("");
    } else {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        "ASCENDING"
      );
      setFastFilVal(e.target.id);
    }
  };

  const handleSortByFareDescending = (e) => {
    if (e.target.id == FastFilVal) {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate)
      );
      e.target.checked = false;
      setFastFilVal("");
    } else {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        "DESCENDING"
      );
      setFastFilVal(e.target.id);
    }
  };

  const handleSortByDepartureTimeAscending = (e) => {
    console.log(e.target.value);
    if (e.target.id == FastFilVal) {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate)
      );
      e.target.checked = false;
      setFastFilVal("");
    } else {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        null,
        "ASCENDING"
      );
      setFastFilVal(e.target.id);
    }
  };

  const handleSortByDepartureTimeDescending = (e) => {
    if (e.target.id == FastFilVal) {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate)
      );
      e.target.checked = false;
      setFastFilVal("");
    } else {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        null,
        "DESCENDING"
      );
      setFastFilVal(e.target.id);
    }
  };

  const [busType, setBusType] = useState("");
  const handleFilterByBusType = (e) => {
    if (e.target.value == busType) {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate)
      );
      e.target.checked = false;
      setBusType("");
      return;
    } else if (e.target.value == "GHẾ") {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        null,
        null,
        "GHẾ"
      );
    } else if (e.target.value == "GIƯỜNG") {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        null,
        null,
        "GIƯỜNG"
      );
    } else if (e.target.value == "LIMOUSINE") {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        null,
        null,
        "LIMOUSINE"
      );
    }
    setBusType(e.target.value);
  };

  const [timeType, setTimeType] = useState("");
  const handleFilterByTimeType = (e) => {
    if (e.target.value == timeType) {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate)
      );
      e.target.checked = false;
      setTimeType("");
      return;
    } else if (e.target.value == "EARLY_MORNING") {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        null,
        null,
        null,
        "EARLY_MORNING"
      );
    } else if (e.target.value == "MORNING") {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        null,
        null,
        null,
        "MORNING"
      );
    } else if (e.target.value == "AFTERNOON") {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        null,
        null,
        null,
        "AFTERNOON"
      );
    } else if (e.target.value == "NIGHT") {
      getBuses(
        locationMapping[DiemDi],
        locationMapping[DiemDen],
        getFormattedDate(startDate),
        null,
        null,
        null,
        "NIGHT"
      );
    }
    setTimeType(e.target.value);
  };

  const timchuyen = () => {
    // Call the getBuses function with the selected locations and date
    console.log(
      locationMapping[DiemDi],
      locationMapping[DiemDen],
      getFormattedDate(startDate)
    );
    getBuses(
      locationMapping[DiemDi],
      locationMapping[DiemDen],
      getFormattedDate(startDate)
    );
    setTimChuyen(1);
  };

  return (
    <React.Fragment>
      <Header />
      <main>
        <section className="main-layout">
          <div className="banner-search">
            <div className="homepage-banner">
              <img src={bannerImage} />
            </div>

            <form className="Home">
              <div className="LoaiVe row">
                <div className="col-2 form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="MotChieu"
                    onClick={() => setLoaiVe("MotChieu")}
                    checked={LoaiVe === "MotChieu"}
                  />
                  <label
                    className="form-check-label"
                    for="MotChieu"
                    onClick={() => setLoaiVe("MotChieu")}
                  >
                    Một Chiều
                  </label>
                </div>

                <div className="col-2 form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="KhuHoi"
                    onClick={() => setLoaiVe("KhuHoi")}
                    checked={LoaiVe === "KhuHoi"}
                  />
                  <label
                    className="form-check-label"
                    for="KhuHoi"
                    onClick={() => setLoaiVe("KhuHoi")}
                  >
                    Khứ Hồi
                  </label>
                </div>

                <div className="col Huongdan" align="right">
                  <p onClick={huongdan}>Hướng dẫn mua vé</p>
                </div>
              </div>

              <div className="DiaDiem row">
                <div class="dropdown col-3">
                  <p>Điểm đi</p>

                  <div class="DiaDiem-btn" data-bs-toggle="dropdown">
                    {DiemDi}
                  </div>

                  <ul class="dropdown-menu">
                    {DSDiemDi.map((item) =>
                      item != DiemDen ? (
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setDiemDi(item);
                            }}
                          >
                            {item}
                          </a>
                        </li>
                      ) : (
                        <></>
                      )
                    )}
                  </ul>
                </div>

                <img
                  class="col-1"
                  src={"https://futabus.vn/images/icons/switch_location.svg"}
                  onClick={swapDiaDiem}
                />

                <div class="dropdown col-3">
                  <p>Điểm đến</p>

                  <div class="DiaDiem-btn" data-bs-toggle="dropdown">
                    {DiemDen}
                  </div>

                  <ul class="dropdown-menu">
                    {DSDiemDen.map((item) =>
                      item != DiemDi ? (
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setDiemDen(item);
                            }}
                          >
                            {item}
                          </a>
                        </li>
                      ) : (
                        <></>
                      )
                    )}
                  </ul>
                </div>
                {LoaiVe == "MotChieu" ? (
                  <>
                    <div class="col-3">
                      <p>Ngày đi</p>
                      <DatePicker
                        className="NgayDi"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                    </div>

                    <div class="dropdown col-2">
                      <p>Số vé</p>
                      <button
                        class="SoVe-btn"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <p>{SoVe}</p>
                        <img src={dropdown} align="right" />
                      </button>

                      <ul class="dropdown-menu">
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setSoVe(1);
                            }}
                          >
                            1
                          </a>
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setSoVe(2);
                            }}
                          >
                            2
                          </a>
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setSoVe(3);
                            }}
                          >
                            3
                          </a>
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setSoVe(4);
                            }}
                          >
                            4
                          </a>
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setSoVe(5);
                            }}
                          >
                            5
                          </a>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div class="dropdown col-2">
                      <p>Ngày đi</p>
                      <DatePicker
                        className="NgayDi"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                    </div>

                    <div class="dropdown col-2">
                      <p>Ngày về</p>
                      <DatePicker
                        className="NgayDi"
                        selected={returnDate}
                        onChange={(date) => setReturnDate(date)}
                      />
                    </div>

                    <div class="dropdown col-1">
                      <p>Số vé</p>
                      <button
                        class="SoVe-btn"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <p>{SoVe}</p>
                        <img src={dropdown} align="right" />
                      </button>

                      <ul class="dropdown-menu">
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setSoVe(1);
                            }}
                          >
                            1
                          </a>
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setSoVe(2);
                            }}
                          >
                            2
                          </a>
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setSoVe(3);
                            }}
                          >
                            3
                          </a>
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setSoVe(4);
                            }}
                          >
                            4
                          </a>
                        </li>
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setSoVe(5);
                            }}
                          >
                            5
                          </a>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>

              <div class="TimChuyen-btn" align="center" onClick={timchuyen}>
                Tìm Chuyến
              </div>
            </form>
          </div>

          {TimChuyen == 0 ? (
            <></>
          ) : (
            <div class="DSContainer row">
              <div class="Filter col-3">
                <h2>Bộ lọc tìm kiếm</h2>
                <div>
                  <h3>Giờ đi</h3>

                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="EARLY_MORNING"
                      id="FilterGioDi1"
                      name="FliterGioDi"
                      onClick={(e) => {
                        handleFilterByTimeType(e);
                      }}
                    />
                    <label class="form-check-label" for="FilterGioDi1">
                      Sáng sớm 00:00 - 06:00
                    </label>
                  </div>

                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="MORNING"
                      id="FilterGioDi2"
                      name="FliterGioDi"
                      onClick={(e) => {
                        handleFilterByTimeType(e);
                      }}
                    />
                    <label class="form-check-label" for="FilterGioDi2">
                      Buổi sáng 06:00 - 12:00
                    </label>
                  </div>

                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="AFTERNOON"
                      id="FilterGioDi3"
                      name="FliterGioDi"
                      onClick={(e) => {
                        handleFilterByTimeType(e);
                      }}
                    />
                    <label class="form-check-label" for="FilterGioDi3">
                      Buổi chiều 12:00 - 18:00
                    </label>
                  </div>

                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="NIGHT"
                      id="FilterGioDi4"
                      name="FliterGioDi"
                      onClick={(e) => {
                        handleFilterByTimeType(e);
                      }}
                    />
                    <label class="form-check-label" for="FilterGioDi4">
                      Buổi tối 18:00 - 24:00
                    </label>
                  </div>
                </div>

                <hr />

                <div class="row">
                  <h3>Loại xe</h3>

                  <div class="col-2 form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="GHẾ"
                      id="FilterLoaiXe1"
                      name="FliterLoaiXe"
                      onClick={(e) => {
                        handleFilterByBusType(e);
                      }}
                    />
                    <label class="form-check-label" for="FilterLoaiXe1">
                      Ghế
                    </label>
                  </div>

                  <div class="col-2 form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="GIƯỜNG"
                      id="FilterLoaiXe2"
                      name="FliterLoaiXe"
                      onClick={(e) => {
                        handleFilterByBusType(e);
                      }}
                    />
                    <label class="form-check-label" for="FilterLoaiXe2">
                      Giường
                    </label>
                  </div>

                  <div class="col-2 form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      value="LIMOUSINE"
                      id="FilterLoaiXe3"
                      name="FliterLoaiXe"
                      onClick={(e) => {
                        handleFilterByBusType(e);
                      }}
                    />
                    <label class="form-check-label" for="FilterLoaiXe3">
                      Limousine
                    </label>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="FastFilter row">
                  <input
                    className="form-check-input"
                    type="radio"
                    value=""
                    name="FastFil"
                    id="FastFilter1"
                    onClick={(e) => handleSortByFareAscending(e)}
                  />
                  <label
                    className="icon col-2 row form-check-label"
                    htmlFor="FastFilter1"
                  >
                    <img
                      className="col-2"
                      src={"https://futabus.vn/images/icons/save_money.svg"}
                    />
                    <div className="col">Giá tăng dần</div>
                  </label>

                  <input
                    className="form-check-input"
                    type="radio"
                    value=""
                    name="FastFil"
                    id="FastFilter2"
                    onClick={(e) => handleSortByFareDescending(e)}
                  />
                  <label
                    className="icon col-2 row form-check-label"
                    htmlFor="FastFilter2"
                  >
                    <img
                      className="col-2"
                      src={"https://futabus.vn/images/icons/save_money.svg"}
                    />
                    <div className="col">Giá giảm dần</div>
                  </label>

                  <input
                    className="form-check-input"
                    type="radio"
                    value=""
                    name="FastFil"
                    id="FastFilter3"
                    onClick={(e) => handleSortByDepartureTimeAscending(e)}
                  />
                  <label
                    className="icon row form-check-label"
                    htmlFor="FastFilter3"
                  >
                    <img
                      className="col-2"
                      src={"https://futabus.vn/images/icons/clock.svg"}
                    />
                    <div className="col">Giờ sớm nhất</div>
                  </label>

                  <input
                    className="form-check-input"
                    type="radio"
                    value=""
                    name="FastFil"
                    id="FastFilter4"
                    onClick={(e) => handleSortByDepartureTimeDescending(e)}
                  />
                  <label
                    className="icon row col-2 form-check-label"
                    htmlFor="FastFilter4"
                  >
                    <img
                      className="col-2"
                      src={"https://futabus.vn/images/icons/clock.svg"}
                    />
                    <div className="col">Giờ muộn nhất</div>
                  </label>
                </div>

                <div className="DanhSach">
                  {DSChuyenXe.map((bus, index) => {
                    // Chuyển đổi departureTime và arrivalTime thành đối tượng Date
                    const departureDateTime = new Date(bus.departureTime);
                    const arrivalDateTime = new Date(bus.arrivalTime);

                    // Trích xuất giờ từ departureTime và arrivalTime
                    const departureHour =
                      ("0" + departureDateTime.getHours()).slice(-2) +
                      ":" +
                      ("0" + departureDateTime.getMinutes()).slice(-2);
                    const arrivalHour =
                      ("0" + arrivalDateTime.getHours()).slice(-2) +
                      ":" +
                      ("0" + arrivalDateTime.getMinutes()).slice(-2);

                    const timeDifference =
                      (arrivalDateTime - departureDateTime) / 3600000; // chuyển đổi sang giờ

                    console.log(bus.id);

                    return (
                      <div
                        key={index}
                        className="ChuyenXe row"
                        onClick={() => dienthongtin(bus.id)}
                      >
                        <div className="TGDi col-1">
                          <h1>{departureHour}</h1>
                          <p>{bus.boardingPoints[0]}</p>
                        </div>
                        <div className="DiChuyen col-1">
                          <img
                            src={"https://futabus.vn/images/icons/pickup.svg"}
                          />
                          <p>----------</p>
                          <p>{timeDifference} giờ </p>
                          <p>----------</p>
                          <img
                            src={"https://futabus.vn/images/icons/station.svg"}
                          />
                        </div>
                        <div className="TGDi col-1">
                          <h1>{arrivalHour}</h1>
                          <p>{bus.droppingPoints[0]}</p>
                        </div>
                        <div className="col-1">{bus.busType}</div>
                        <div className="col-1">
                          Còn chỗ <br />
                          <p className="Gia">{bus.fare}đ</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </React.Fragment>
  );
};

export default HomePage;
