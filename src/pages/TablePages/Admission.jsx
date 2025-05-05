import Table from "../../components/Table/Table";
import "./TablePage.scss";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { baseUrl } from "../../main";

const Admission = () => {
  const [admissionData, setAdmissionData] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      const { data } = await axios.get(`${baseUrl}/admission/all-admission`);
      setAdmissionData(data.admissions);
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
        header: "Qualification ",
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
    ],
    []
  );

  return (
    <div className="admission">
      <div className="admission-top">
        <h1>Admissions</h1>
        <Link to={"/new-admission"} className="success-btn">Add new admission</Link>
      </div>
      <Table data={admissionData} columns={columns} path="admission" />
    </div>
  );
};

export default Admission;
