import Table from "../../components/Table/Table";
import "./TablePage.scss";
import { useEffect, useMemo, useState } from "react";

import axios from "axios";
import { baseUrl } from "../../main";
import { Link } from "react-router-dom";

const Student = () => {
  const [admissionData, setAdmissionData] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      const { data } = await axios.get(`${baseUrl}/student/all-students`);
      setAdmissionData(data.students);
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
        accessorKey: "enrollmentId",
        header: "Enrollment Id",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "certificateNo",
        header: "Certificate No",
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
    <div className="student">
      <div className="student-top">
        <h1>Students</h1>
        <Link to={"/new-student"} className="success-btn">Add New Certificate</Link>
      </div>
      <Table data={admissionData} columns={columns} path="student" />
    </div>
  );
};

export default Student;
