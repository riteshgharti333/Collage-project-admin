import { useEffect, useState } from "react";
import "./Dashboard.scss";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [admissionCount, setAdmissionCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [admissions, enquiries, contacts, members] = await Promise.all([
          axios.get(`${baseUrl}/admission/all-admission`),
          axios.get(`${baseUrl}/enquiry/all-enquiry`),
          axios.get(`${baseUrl}/contact/all-contact`),
          axios.get(`${baseUrl}/founder/all-founders`),
        ]);

        setAdmissionCount(admissions.data.admissions.length || 0);
        setEnquiryCount(enquiries.data.enquiry.length || 0);
        setContactCount(contacts.data.contacts.length || 0);
        setMemberCount(members.data.founders.length || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-cards">
        <Link to="/admission" className="dashboard-card">
          <h4>Admissions</h4>
          <div className="dashboard-card-desc">
            <h1>{admissionCount}</h1>
            <span>Forms</span>
          </div>
        </Link>

        <Link to="/enquiry" className="dashboard-card">
          <h4>Enquiries</h4>
          <div className="dashboard-card-desc">
            <h1>{enquiryCount}</h1>
            <span>Forms</span>
          </div>
        </Link>

        <Link to="/contact" className="dashboard-card">
          <h4>Contacts</h4>
          <div className="dashboard-card-desc">
            <h1>{contactCount}</h1>
            <span>Forms</span>
          </div>
        </Link>

        <Link to="/members" className="dashboard-card">
          <h4>Members</h4>
          <div className="dashboard-card-desc">
            <h1>{memberCount}</h1>
            <span>Members</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;