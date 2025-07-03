import Table from "../../components/Table/Table";
import "./TablePage.scss";
import { useEffect, useMemo, useState } from "react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import axios from "axios";
import { baseUrl } from "../../main";
import { Link } from "react-router-dom";

const Student = () => {
  const [admissionData, setAdmissionData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleDownloadExcel = () => {
    setLoading(true)
    if (admissionData.length === 0) {
      toast.error("No data to export");
      return;
    }

    const formattedData = admissionData.map((student, index) => ({
      S_No: index + 1,
      Name: student.name,
      "Father Name": student.fatherName,
      "Enrollment ID": student.enrollmentId,
      "Certificate No": student.certificateNo,
      Course: student.course,
      Duration: `${student.duration} Year`,
      Date: new Date(student.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Certificates");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, `Student_Certificates_${Date.now()}.xlsx`);
    setLoading(false)
  };

  return (
    <div className="student">
      <div className="student-top">
        <h1>Certificate</h1>
        <div className="student-btns">
          <button className="second-btn" disabled={loading} onClick={handleDownloadExcel}>
            {loading ? "Downloading..." : "Download Excel"}
          </button>
          <Link to={"/new-student"} className="success-btn">
            Add New Certificate
          </Link>
        </div>
      </div>
      <Table data={admissionData} columns={columns} path="student" />
    </div>
  );
};

export default Student;
