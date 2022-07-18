import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./navbar";
const Register = () => {
  const [loading, setLoding] = useState(true);
  const [data, setData] = useState({
    name: "",
    phone: 0,
    country: "",
    city: "",
    governorate: "",
    mainService: "",
    subService: "",
  });
  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !data.name ||
      !data.phone ||
      !data.country ||
      !data.city ||
      !data.governorate ||
      !data.mainService ||
      !data.subService
    ) {
      return toast.error("Please fill all fields");
    }
    await axios
      .post(`/api/users`, data)
      .then((response) => {
        toast.success(`user added successfully!`);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  const [countries, setCountries] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  useEffect(() => {
    axios
      .get("/api/countries")
      .then((res) => {
        setCountries(res.data);

        setLoding(false);
      })
      .catch((err) => {
        setLoding(false);
        toast.error(err.message);
      });
    axios
      .get("/api/main-services")
      .then((response) => {
        setMainServices(response.data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
    axios
      .get("/api/sub-services")
      .then((response) => {
        setSubServices(response.data);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, []);
  const [governorates, setGovernorates] = useState([]);
  const handleChangeCountry = ({ target }) => {
    const options = target.options;
    const countryID = options[options.selectedIndex].id;
    setData({ ...data, country: countryID });
    setLoding(true);
    axios
      .get(`/api/goves/`, { params: { countryID } })
      .then((res) => {
        setGovernorates(res.data.goves);
        setLoding(false);
      })
      .catch((err) => {
        setLoding(false);
        toast.error(err.message);
      });
  };
  const [cities, setCities] = useState([]);
  const handleChangeGov = ({ target }) => {
    const options = target.options;
    const govID = options[options.selectedIndex].id;
    setLoding(true);
    setData({ ...data, governorate: govID });
    axios
      .get(`/api/cities`, { params: { govID } })
      .then((res) => {
        setCities(res.data.cities);
        setLoding(false);
      })
      .catch((err) => {
        toast.error(err.message);
        setLoding(false);
      });
  };
  const handleChangeCity = ({ target }) => {
    const options = target.options;
    const cityID = options[options.selectedIndex].id;
    setData({ ...data, city: cityID });
    return;
  };
  const handleChangeService = ({ target }) => {
    const options = target.options;
    const subServiceID = options[options.selectedIndex].id;
    if (!subServiceID) toast.error("please select a service");
    const mainServiceID = target.id;
    for (const e of mainServices) {
      if (e._id !== target.id) {
        document.getElementById(e._id).value = "";
      }
    }
    setData({ ...data, subService: subServiceID, mainService: mainServiceID });

    return;
  };
  return (
    <div className="container-fluid">
      <Navbar />
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label htmlFor="validationDefault01" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            id="name"
            onChange={handleChange}
            required
          ></input>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationDefault02" className="form-label">
            Phone Number
          </label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            onChange={handleChange}
            required
          ></input>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationDefault04" className="form-label">
            country
          </label>
          <select
            className="form-select"
            required
            name="country"
            onChange={handleChangeCountry}
          >
            <option selected disabled value="">
              choose
            </option>
            {countries
              ? countries.map((c) => (
                  <option key={c._id} id={c._id}>
                    {c.name}
                  </option>
                ))
              : ""}
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationDefault04" className="form-label">
            Governorate
          </label>
          <select
            className="form-select"
            id="governorate"
            required
            name="governorate"
            onChange={handleChangeGov}
          >
            <option selected disabled value="">
              choose
            </option>
            {governorates
              ? governorates.map((g) => (
                  <option key={g.id} id={g.id}>
                    {g.governorate_name_en}
                  </option>
                ))
              : ""}
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="validationDefault04" className="form-label">
            City
          </label>
          <select
            className="form-select"
            id="city"
            required
            name="city"
            onChange={handleChangeCity}
          >
            <option defaultValue disabled value="">
              choose
            </option>
            {cities
              ? cities.map((c) => (
                  <option key={c.id} id={c.id}>
                    {c.city_name_en}
                  </option>
                ))
              : ""}
          </select>
        </div>
        <hr></hr>
        <h4>select only one of below main services:</h4>
        {mainServices.length > 0
          ? mainServices.map((s) => (
              <div
                className="col-md-4"
                id={`${s._id}-container`}
                key={`${s._id}-container`}
              >
                <label className="form-label">{s.name}</label>

                <select
                  className="form-select"
                  id={s._id}
                  name="mainService"
                  onChange={handleChangeService}
                >
                  <option value="" disabled selected>
                    choose
                  </option>
                  {subServices.length > 0
                    ? subServices.map((sub) => (
                        <>
                          {sub.mainID === s._id ? (
                            <option key={sub._id} id={sub._id}>
                              {sub.name}
                            </option>
                          ) : (
                            ""
                          )}
                        </>
                      ))
                    : ""}
                </select>
              </div>
            ))
          : ""}

        <div className="col-12">
          <button className="btn btn-primary" type="submit">
            Confirm
          </button>
        </div>
      </form>
      {loading ? (
        <div
          className="loader"
          style={{
            backgroundColor: "#000bff",
            height: "100%",
            width: "101%",
            zIndex: "1",
            position: "fixed",
            top: "0rem",
            left: "0",
            opacity: "0.55",
          }}
        >
          <div
            className="spinner-border text-danger"
            style={{ position: "fixed", left: "50%", top: "50%" }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Register;
