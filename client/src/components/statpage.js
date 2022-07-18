import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "./navbar";
const Statpage = () => {
  const [countries, setCountries] = useState([]);
  const [mainServices, setMainServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [mainCounts, setMainCounts] = useState({});
  const [subCounts, setSubCounts] = useState({});
  const [loading, setLoding] = useState(true);
  const [data, setData] = useState({
    countryID: "",
    govID: "",
    cityID: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.countryID || !data.govID || !data.cityID) {
      return toast.error("Please fill all fields");
    }
    await axios
      .get(`/api/allusers`, {
        params: {
          countryID: data.countryID,
          govID: data.govID,
          cityID: data.cityID,
        },
      })
      .then((response) => {
        setMainServices(response.data.mainservicesData);
        setSubServices(response.data.submainservicesData);
        setMainCounts(response.data.Maincounts);
        setSubCounts(response.data.Subcounts);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
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
  }, []);
  const [governorates, setGovernorates] = useState([]);
  const handleChangeCountry = ({ target }) => {
    const options = target.options;
    const countryID = options[options.selectedIndex].id;
    setData({ ...data, countryID: countryID });
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
    setData({ ...data, govID: govID });
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
    setData({ ...data, cityID: cityID });
    return;
  };

  return (
    <div>
      <div className="container-fluid">
        <Navbar />
        <form className="row g-3" onSubmit={handleSubmit}>
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

          <div className="col-12">
            <button className="btn btn-primary" type="submit">
              Confirm
            </button>
          </div>
          <hr></hr>
          <h4>statistcies results</h4>

          {mainServices.length > 0
            ? mainServices.map((m) => (
                <div className="col-md-4 card" key={m._id}>
                  <div className="card-header d-flex justify-content-between">
                    <div> {m.name} </div>
                    <span className="">
                      {mainCounts[m._id] ? mainCounts[m._id] : ""}
                    </span>
                  </div>

                  {subServices.length > 0
                    ? subServices.map((s) =>
                        s.mainID === m._id ? (
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                              <span> {s.name} </span>
                              <span className="text-end">
                                {subCounts[s._id] ? subCounts[s._id] : ""}
                              </span>
                            </li>
                          </ul>
                        ) : (
                          ""
                        )
                      )
                    : ""}
                </div>
              ))
            : ""}
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
    </div>
  );
};

export default Statpage;
