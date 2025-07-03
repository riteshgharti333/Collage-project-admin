import axios from "axios";
import { AdmissionData, Staffdata } from "../../assets/data";
import Table from "../../components/Table/Table";
import "./TablePage.scss";
import { useEffect, useMemo, useState } from "react";
import { baseUrl } from "../../main";

const Enquiry = () => {
  const [enquiryData, setEnquiryData] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      const { data } = await axios.get(`${baseUrl}/enquiry/all-enquiry`);
      setEnquiryData(data.enquiry);
    };

    getAllData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "profile",
        header: "Qualification",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "selectCourse",
        header: "Selected Course",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          return date
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(" ", " ");
        },
      },
      {
        accessorKey: "approved",
        header: "Status",
        cell: (info) => {
          const isApproved = info.getValue();
          return (
            <span
              style={{
                color: isApproved ? "green" : "orange",
                fontWeight: 600,
              }}
            >
              {isApproved ? "Approved" : "Pending"}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="staff">
      <h1>Enquiries</h1>

      <Table data={enquiryData} columns={columns} path="enquiry" />
    </div>
  );
};

export default Enquiry;
