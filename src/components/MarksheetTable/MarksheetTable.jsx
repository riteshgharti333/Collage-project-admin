import axios from "axios";
import { AdmissionData, Staffdata } from "../../assets/data";
import Table from "../../components/Table/Table";
import "./MarksheetTable.scss";
import { useEffect, useMemo, useState } from "react";
import { baseUrl } from "../../main";
import { Link } from "react-router-dom";

const MarkSheetTable = () => {
  const [marksheetsData, setMarksheetsData] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      const { data } = await axios.get(`${baseUrl}/marksheet/all-marksheets`);
      setMarksheetsData(data.marksheets);
    };

    getAllData();
  }, []);

  const columns = useMemo(
  () => [
    {
      accessorKey: "student",
      header: "Name",
      cell: (info) => info.getValue()?.name || "N/A", // Accessing student.name
    },
    {
      accessorKey: "totalMaxMarks",
      header: "Total Marks",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "totalObtainedMarks",
      header: "Obtained Marks",
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
    <div className="markSheet-table">
      <div className="markSheet-table-top">
        <h1>MarkSheets</h1>

        <Link to={"/new-markSheet"} className="success-btn">
          Add new marksheet
        </Link>
      </div>

      <Table data={marksheetsData} columns={columns} path="marksheet" />
    </div>
  );
};

export default MarkSheetTable;
