import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "./Booking.scss";
import "../HomePages/HomePage.scss";
import Header from "../HomePages/Header";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { format } from "date-fns";

import dropdown from "/img/caret-down.svg";

const Booking = () => {
  const DISABLED_SEAT = "https://futabus.vn/images/icons/seat_disabled.svg";
  const ACTIVATE_SEAT = "https://futabus.vn/images/icons/seat_active.svg";
  const SELECTED_SEAT = "https://futabus.vn/images/icons/seat_selecting.svg";

  //const [item, setItem] = useState({ kindOfStand: "", another: "another" });

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const { id } = useParams();

  const [ghe, setGhe] = useState({ seats: [] });

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/buses/${id}`
        );
        setGhe(response.data);
        if (response.status === 200) {
          console.log(response.data);
          setGhe(response.data);
          setDSDiemDon(response.data["boardingPoints"]);
          setDSDiemTra(response.data["droppingPoints"]);
        }

        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const customerId = localStorage.getItem("customerId");
        console.log(isLoggedIn, customerId);
        if (isLoggedIn === "true" && customerId != null) {
          axios
            .get(`http://localhost:8080/api/customers/${customerId}`)
            .then((response) => {
              setCustomerName(response.data.name);
              setCustomerPhone(response.data.phone);
              setCustomerEmail(response.data.email);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetch();
  }, []);

  const [selectGhe, setSelectGhe] = useState([]);

  const chonGhe = (e, id) => {
    console.log(selectGhe);
    if (e.target.checked === true) {
      if (selectGhe.length >= 5) {
        e.target.checked = false;
        return;
      }
      const temp = [...selectGhe, id];
      setSelectGhe(temp);
    } else {
      const temp = selectGhe.filter((item) => item !== id);
      setSelectGhe(temp);
    }
  };

  const doiNgay = (date = "1/1/1970") => {
    console.log(date);
    const dateTime = new Date(date);
    console.log(dateTime);
    const formattedDateTime = format(dateTime, "HH:mm:ss dd/MM/yy");
    return formattedDateTime;
  };

  const huy = () => {
    navigate("/");
  };

  const thanhtoan = () => {
    const bookingData = {
      busId: id,
      customerId: localStorage.getItem("customerId"),
      seats: selectGhe,
      totalFare: ghe["fare"] * selectGhe.length,
      boardingPoint: DiemDon,
      droppingPoint: DiemTra,
    };
    console.log(bookingData);
    axios
      .post("http://localhost:8080/api/booking/book", bookingData)
      .then((response) => {
        if (response.status === 200) {
          navigate("/payment", {
            state: {
              busId: id,
              customerId: localStorage.getItem("customerId"),
              seats: selectGhe,
              totalFare: ghe["fare"] * selectGhe.length,
              boardingPoint: DiemDon,
              droppingPoint: DiemTra,
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const [DiemDon, setDiemDon] = useState("");
  const [DiemTra, setDiemTra] = useState("");

  const [DSDiemDon, setDSDiemDon] = useState([]);
  const [DSDiemTra, setDSDiemTra] = useState([]);

  const navigate = useNavigate();

  return (
    <React.Fragment>
      <Header />
      <main>
        <section className="booking">
          <div class="tt-dat-ve row">
            <div class="col-7">
              <div class="chon-ghe row">
                <h3>Chọn ghế</h3>

                <div class="col" align="center">
                  <div class="row">
                    {ghe["seats"].map((item, index) => {
                      return (
                        <div class="col-4 ghe">
                          {item["isBooked"] == true ? (
                            <>
                              <div class="ghe-disabled"></div>
                              <h5 class="disabled">{item["seatNumber"]}</h5>
                            </>
                          ) : (
                            <>
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={item["seatNumber"]}
                                onClick={(e) => chonGhe(e, item["seatNumber"])}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={item["seatNumber"]}
                              >
                                <div class="ghe-img"></div>
                                <h5 class="ghe-h5">{item["seatNumber"]}</h5>
                              </label>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div class="col-4 color-detail">
                  <div class="gray"></div>
                  <p>Đã bán</p>
                  <br />

                  <div class="blue"></div>
                  <p>Còn trống</p>
                  <br />
                  <div class="orange"></div>
                  <p>Đang chọn</p>
                </div>
              </div>

              <div className="thong-tin-khach">
                <h3>Thông tin khách hàng</h3>
                <form>
                  <div className="form-group mb-3">
                    <label htmlFor="hoten" className="form-label">
                      Họ tên
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="hoten"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="sdt" className="form-label">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="sdt"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                  </div>
                </form>
              </div>

              <div class="don-tra row">
                <h3>Thông tin đón trả</h3>
                <div class="col">
                  <h4>ĐIỂM ĐÓN</h4>

                  <div class="dropdown">
                    <div class="DiaDiem-btn" data-bs-toggle="dropdown">
                      {DiemDon}
                    </div>

                    <ul class="dropdown-menu">
                      {DSDiemDon.map((item) => (
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setDiemDon(item);
                            }}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="vertical-line"></div>

                <div class="col">
                  <h4>ĐIỂM TRẢ</h4>

                  <div class="dropdown">
                    <div class="DiaDiem-btn" data-bs-toggle="dropdown">
                      {DiemTra}
                    </div>

                    <ul class="dropdown-menu">
                      {DSDiemTra.map((item) => (
                        <li>
                          <a
                            class="dropdown-item"
                            onClick={() => {
                              setDiemTra(item);
                            }}
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div class="thanh-toan row">
                <h3>Thanh toán</h3>
                <div class="col-6">{ghe["fare"] * selectGhe.length}đ</div>

                <div class="col" align="right">
                  <button type="button" class="btn btn-huy" onClick={huy}>
                    Hủy
                  </button>
                </div>

                <div class="col" align="right">
                  <button
                    type="button"
                    class="btn btn-thanhtoan"
                    onClick={thanhtoan}
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>

            <div class="col ">
              <div class="thong-tin-luot-di">
                <h3>Thông tin lượt đi</h3>
                <div class="row">
                  <div class="col field">
                    Tuyến xe đi <br />
                    Tuyến xe tới <br />
                    Thời gian xuất bến <br />
                    Số lượng ghế <br />
                    Số ghế <br />
                    Tổng tiền lượt đi
                  </div>

                  <div class="col info" align="right">
                    {ghe["departureLocation"]} <br />
                    {ghe["arrivalLocation"]} <br />
                    {doiNgay(ghe["departureTime"])} <br />
                    {selectGhe.length} Ghế <br />
                    {selectGhe.map((item) => {
                      return <span key={item}>{item} </span>;
                    })}
                    <br />
                    {ghe["fare"] * selectGhe.length}
                  </div>
                </div>
              </div>

              <div class="chi-tiet-gia">
                <h3>Chi tiết giá</h3>
                <div class="row">
                  <div class="col field">
                    Giá vé <br />
                    <hr id="gach-ngang" />
                    <br />
                    <b> Tổng tiền </b>
                  </div>

                  <div class="col info" align="right">
                    {ghe["fare"] * selectGhe.length}đ <br />
                    <br />
                    <b id="tong-tien"> {ghe["fare"] * selectGhe.length}đ </b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </React.Fragment>
  );
};

export default Booking;
