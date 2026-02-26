import React, { useMemo } from 'react';
import TableContainer from "Common/TableContainer";
import { PropertyData } from 'Common/data';
import { Link } from 'react-router-dom';
import { Badge } from 'react-bootstrap';

const PropertyTable = () => {

  const columns = useMemo(() => [
    {
      header: "#",
      accessorKey: "id",
      cell: (cell: any) => {
        return (
          <Link to={"/apps-ecommerce-order-overview"} className="fw-medium link-primary">{cell.getValue()}</Link>
        );
      },
      enableColumnFilter: false,
    },
    {
      header: "Property Type",
      accessorKey: "propertyType",
      enableColumnFilter: false,
    },
    {
      header: "Property Name",
      accessorKey: "propertyName",
      enableColumnFilter: false,
      cell: (cell: any) => (
        <>
          <div className="d-flex align-items-center gap-2">
            <img src={cell.row.original.image} alt="react.png" height='35px' className="rounded" />
            <Link to={"/pages-profile"} className="text-reset contact_name">{cell.getValue()}</Link>
          </div>
        </>
      ),
    },
    {
      header: "Address",
      accessorKey: "country",
      enableColumnFilter: false,
    },
    {
      header: "Agent Name",
      accessorKey: "agentName",
      enableColumnFilter: false,
    },
    {
      header: "Price",
      accessorKey: "price",
      enableColumnFilter: false,
    },
    {
      header: "Status",
      accessorKey: "status",
      enableColumnFilter: false,
      cell: (cell: any) => {
        switch (cell.getValue()) {
          case "Rent":
            return (<Badge bg="info-subtle" text='info' className="status"> {cell.getValue()}</Badge>);
          case "Sale":
            return (<Badge bg="danger-subtle" text='danger' className="status"> {cell.getValue()}</Badge>);
        }
      },
    },
    {
      header: "Action",
      enableColumnFilter: false,
      cell: () => {
        return (
          <React.Fragment>
            <ul className="d-flex gap-2 list-unstyled mb-0">
              <li>
                <Link to="#" className="btn btn-subtle-primary btn-icon btn-sm "><i className="ph-eye"></i></Link>
              </li>
              <li>
                <Link to="#" className="btn btn-subtle-secondary btn-icon btn-sm edit-item-btn"><i className="ph-pencil"></i></Link>
              </li>
              <li>
                <Link to="#" className="btn btn-subtle-danger btn-icon btn-sm remove-item-btn"><i className="ph-trash"></i></Link>
              </li>
            </ul>
          </React.Fragment>
        );
      },
    },
  ], []
  );

  return (
    <React.Fragment>
      <TableContainer
        isPagination={false}
        columns={(columns || [])}
        data={(PropertyData || [])}
        isBordered={false}
        customPageSize={6}
        divClassName="table-responsive table-card mt-0"
        tableClass="table-borderless table-centered align-middle table-nowrap mb-0"
        theadClass="text-muted table-light"
      />
    </React.Fragment>
  );
};

export { PropertyTable };