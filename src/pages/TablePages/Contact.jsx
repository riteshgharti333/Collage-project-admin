import axios from "axios";
import Table from "../../components/Table/Table";
import "./TablePage.scss";
import { useEffect, useMemo, useState } from "react";
import { baseUrl } from "../../main";

const Contact = () => {
  const [contactData, setContactData] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      const { data } = await axios.get(`${baseUrl}/contact/all-contact`);
      setContactData(data.contacts);
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
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "phoneNumber",
        header: "Phone Number",
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
    [],
  );

  return (
    <div className="staff">
      <h1>Contacts</h1>

      <Table data={contactData} columns={columns} path="contact" />
    </div>
  );
};

export default Contact;
