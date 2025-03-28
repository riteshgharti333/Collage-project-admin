import { Staffdata } from "../../assets/data";
import Table from "../../components/Table/Table";
import "./TablePage.scss";
import { useMemo } from "react";

const No = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "department",
        header: "Department",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "joinDate",
        header: "Joining Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      },
    ],
    []
  );

  return (
    <div className="staff">
      <h1>Staff</h1>

      <Table data={Staffdata} columns={columns} />
    </div>
  );
};

export default No;
