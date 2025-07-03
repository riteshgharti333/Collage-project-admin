import React, { useState, useEffect } from "react";
import "./ContactDetails.scss";
import axios from "axios";
import { baseUrl } from "../../main";
import { toast } from "sonner";

const ContactDetails = () => {
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    instagramLink: "",
    facebookLink: "",
  });

  const [originalData, setOriginalData] = useState({ ...formData });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/contact-details/only`);
        if (data?.contact) {
          const contact = {
            phone: data.contact.phoneNumber || "",
            email: data.contact.email || "",
            address: data.contact.address || "",
            instagramLink: data.contact.instagramLink || "",
            facebookLink: data.contact.facebookLink || "",
          };
          setFormData(contact);
          setOriginalData(contact);
        }
      } catch (err) {
        console.error("Error fetching contact details:", err);
      }
    };

    fetchContactDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        phoneNumber: formData.phone,
        email: formData.email,
        address: formData.address,
        instagramLink: formData.instagramLink,
        facebookLink: formData.facebookLink,
      };

      const { data } = await axios.put(
        `${baseUrl}/contact-details/update`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (data?.success) {
        toast.success(data.message);
        setOriginalData(formData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating contact details:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contactDetails">
      <div className="homeContent-top">
        <h1>Contact Details</h1>
      </div>

      <div className="home-content-detail">
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter phone number..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter email..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Business Address</label>
          <textarea
            name="address"
            id="address"
            rows="4"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter business address..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="instagramLink">Instagram Link</label>
          <input
            type="url"
            name="instagramLink"
            id="instagramLink"
            value={formData.instagramLink}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter Instagram URL..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="facebookLink">Facebook Link</label>
          <input
            type="url"
            name="facebookLink"
            id="facebookLink"
            value={formData.facebookLink}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Enter Facebook URL..."
          />
        </div>

        <div className="home-content-detail-btns">
          {isEditing ? (
            <>
              <button className="delete-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button className="success-btn" onClick={handleSave}>
                Save
              </button>
            </>
          ) : (
            <button
              className="success-btn"
              disabled={loading}
              onClick={handleEdit}
            >
              {loading ? " Updating..." : " Update"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactDetails;
