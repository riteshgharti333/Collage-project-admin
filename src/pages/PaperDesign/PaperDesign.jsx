import { Link, useNavigate } from "react-router-dom";
import "./PaperDesign.scss";
import Table from "../../components/Table/Table";
import { useEffect, useMemo, useState } from "react";
import { paperData } from "../../assets/data";

import axios from "axios";
import { baseUrl } from "../../main";

const PaperDesign = () => {
  const [examData, setExamData] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      const { data } = await axios.get(`${baseUrl}/exam/all-exams`);
      setExamData(data.exams);
    };
    getAllData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "courseCode",
        header: "Course Code",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "courseName",
        header: "Course Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "marks",
        header: "Course Marks",
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
    <div className="paperDesign">
      <div className="paperDesign-top">
        <h1>Paper Design</h1>
        <Link to={"/new-paper"} className="success-btn">
          Add new Paper
        </Link>
      </div>

      <Table data={examData} columns={columns} path="paper" />
    </div>
  );
};

export default PaperDesign;
