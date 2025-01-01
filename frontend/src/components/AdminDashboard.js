import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import seniorImage from './senior-admin.jpg';
import caregiverImage from './caregiver-admin.jpg';

const AdminDashboard = () => {
  const [seniors, setSeniors] = useState([]);
  const [toggleSection, setToggleSection] = useState("Senior");
  const [caregivers, setCaregivers] = useState([]);
  const [newSenior, setNewSenior] = useState({
    name: "",
    age: "",
    gender: "",
    contactDetails: "",
    address: "",
    emergencyContact: "",
    caregiverID: "",
    medicalHistory: "",
  });
  const [newCaregiver, setNewCaregiver] = useState({
    name: "",
    contactDetails: "",
    gmailID: "",
  });

  const [showSeniorsList, setShowSeniorsList] = useState(false);
  const [showCaregiversList, setShowCaregiversList] = useState(false);

  useEffect(() => {
    fetchSeniors();
    fetchCaregivers();
  }, []);

  const fetchSeniors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/reports");
      setSeniors(response.data);
    } catch (error) {
      console.error("Error fetching seniors:", error);
    }
  };

  const fetchCaregivers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/caregivers");
      setCaregivers(response.data);
    } catch (error) {
      console.error("Error fetching caregivers:", error);
    }
  };

  const handleSeniorChange = (e) => {
    const { name, value } = e.target;
    setNewSenior((prev) => ({ ...prev, [name]: value }));
  };

  const handleCaregiverChange = (e) => {
    const { name, value } = e.target;
    setNewCaregiver((prev) => ({ ...prev, [name]: value }));
  };

  const addSenior = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/senior", newSenior);
      fetchSeniors();
      setNewSenior({
        name: "",
        age: "",
        gender: "",
        contactDetails: "",
        address: "",
        emergencyContact: "",
        caregiverID: "",
        medicalHistory: "",
      });
    } catch (error) {
      console.error("Error adding senior:", error);
      alert("Failed to add senior. Please try again.");
    }
  };

  const addCaregiver = async (e) => {
    e.preventDefault();
    if (!newCaregiver.name || !newCaregiver.contactDetails || !newCaregiver.gmailID) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/admin/caregiver", newCaregiver);
      fetchCaregivers();
      setNewCaregiver({ name: "", contactDetails: "", gmailID: "" });
    } catch (error) {
      console.error("Error adding caregiver:", error);
      alert("Failed to add caregiver. Please try again.");
    }
  };

  const deleteSenior = async (seniorID) => {
    try {
      await axios.post("http://localhost:5000/api/admin/remove-senior", { seniorID });
      fetchSeniors(); // Refresh the list of seniors after deletion
    } catch (error) {
      console.error("Error deleting senior:", error);
      alert("Failed to delete senior. Please try again.");
    }
  };

  const deleteCaregiver = async (caregiverID) => {
    try {
      await axios.post("http://localhost:5000/api/admin/remove-caregiver", { caregiverID });
      fetchCaregivers(); // Refresh the list of caregivers after deletion
    } catch (error) {
      console.error("Error deleting caregiver:", error);
      alert("Failed to delete caregiver. Please try again.");
    }
  };

  return (
<div className="container mt-5">
  <h2 className="mb-4 text-center text-primary">Admin Dashboard</h2>

  {/* Toggle Slider */}
  <div className="d-flex justify-content-center align-items-center mb-4">
    <button
      className={`btn ${toggleSection === "Senior" ? "btn-primary" : "btn-outline-primary"} mx-2`}
      onClick={() => setToggleSection("Senior")}
    >
      Senior
    </button>
    <button
      className={`btn ${toggleSection === "Caregiver" ? "btn-success" : "btn-outline-success"} mx-2`}
      onClick={() => setToggleSection("Caregiver")}
    >
      Caregiver
    </button>
  </div>

  {toggleSection === "Senior" ? (
    <div className="row">
      {/* Add Senior Section */}
<div className="col-12 mb-4">
  <div className="card border-primary shadow-sm">
    <div className="card-header bg-primary text-white">
      <h4>Add Senior</h4>
    </div>
    <div className="card-body d-flex">
      {/* Image on the left side covering 40% of the card */}
      <div className="pr-3" style={{ flex: "0 0 40%" }}>
        <img
          src={seniorImage}
          alt="Senior"
          className="img-fluid rounded"
          style={{ width: "100%", height: "auto", objectFit: "cover" }} // Fill the left 40% of the card
        />
      </div>

      {/* Form on the right side covering 60% of the card */}
      <div className="w-60" style={{ flex: "0 0 60%" }}>
        <form onSubmit={addSenior}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="name"
              placeholder="Name"
              value={newSenior.name}
              onChange={handleSeniorChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="number"
              className="form-control"
              name="age"
              placeholder="Age"
              value={newSenior.age}
              onChange={handleSeniorChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="gender"
              placeholder="Gender"
              value={newSenior.gender}
              onChange={handleSeniorChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="contactDetails"
              placeholder="Contact Details"
              value={newSenior.contactDetails}
              onChange={handleSeniorChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="address"
              placeholder="Address"
              value={newSenior.address}
              onChange={handleSeniorChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              name="emergencyContact"
              placeholder="Emergency Contact"
              value={newSenior.emergencyContact}
              onChange={handleSeniorChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <textarea
              className="form-control"
              name="medicalHistory"
              placeholder="Medical History"
              value={newSenior.medicalHistory}
              onChange={handleSeniorChange}
            />
          </div>
          <div className="form-group mb-3">
            <select
              name="caregiverID"
              className="form-control"
              value={newSenior.caregiverID}
              onChange={handleSeniorChange}
              required
            >
              <option value="">Assign Caregiver</option>
              {caregivers.map((caregiver) => (
                <option key={caregiver.CaregiverID} value={caregiver.CaregiverID}>
                  {caregiver.Name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Add Senior
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

      {/* Seniors List Section */}
      <div className="col-12 mb-4">
        <div className="card border-info shadow-sm">
          <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <h4>Seniors List</h4>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setShowSeniorsList(!showSeniorsList)}
            >
              {showSeniorsList ? "Hide" : "Show"}
            </button>
          </div>
          {showSeniorsList && (
            <div className="card-body table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Emergency Contact</th>
                    <th>Caregiver ID</th>
                    <th>Medical History</th>
                  </tr>
                </thead>
                <tbody>
                  {seniors.map((senior) => (
                    <tr key={senior.SeniorID}>
                      <td>{senior.SeniorID}</td>
                      <td>{senior.Name}</td>
                      <td>{senior.Age}</td>
                      <td>{senior.Gender}</td>
                      <td>{senior.ContactDetails}</td>
                      <td>{senior.Address}</td>
                      <td>{senior.EmergencyContact}</td>
                      <td>{senior.CaregiverID}</td>
                      <td>{senior.MedicalHistory}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteSenior(senior.SeniorID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="row">
    {/* Add Caregiver Section */}
    <div className="col-12 mb-4">
      <div className="card border-success shadow-sm">
        <div className="card-header bg-success text-white">
          <h4>Add Caregiver</h4>
        </div>
        <div className="card-body d-flex">
          {/* Image on the left side covering 40% of the card */}
          <div className="pr-3" style={{ flex: "0 0 40%" }}>
            <img
              src={caregiverImage} // Import or reference the image URL here
              alt="Caregiver"
              className="img-fluid rounded"
              style={{ width: "100%", height: "auto", objectFit: "cover" }} // Fill the left 40% of the card
            />
          </div>

          {/* Form on the right side covering 60% of the card */}
          <div className="w-60" style={{ flex: "0 0 60%" }}>
            <form onSubmit={addCaregiver}>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Name"
                  value={newCaregiver.name}
                  onChange={handleCaregiverChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="contactDetails"
                  placeholder="Contact Details"
                  value={newCaregiver.contactDetails}
                  onChange={handleCaregiverChange}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  name="gmailID"
                  placeholder="Gmail ID"
                  value={newCaregiver.gmailID}
                  onChange={handleCaregiverChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Add Caregiver
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

      {/* Caregiver List Section */}
      <div className="col-12 mb-4">
        <div className="card border-warning shadow-sm">
          <div className="card-header bg-warning text-white d-flex justify-content-between align-items-center">
            <h4>Caregivers List</h4>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => setShowCaregiversList(!showCaregiversList)}
            >
              {showCaregiversList ? "Hide" : "Show"}
            </button>
          </div>
          {showCaregiversList && (
            <div className=" card-body table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Gmail ID</th>
                  </tr>
                </thead>
                <tbody>
                  {caregivers.map((caregiver) => (
                    <tr key={caregiver.CaregiverID}>
                      <td>{caregiver.CaregiverID}</td>
                      <td>{caregiver.Name}</td>
                      <td>{caregiver.ContactDetails}</td>
                      <td>{caregiver.GmailID}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteCaregiver(caregiver.CaregiverID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )}
</div>

);
};

export default AdminDashboard;
