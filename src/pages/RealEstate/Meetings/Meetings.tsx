import React, { useMemo } from "react";
import type { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";
import SimpleEntityCrudPage, { type SimpleEntityColumn } from "pages/RealEstate/Shared/SimpleEntityCrudPage";

const Meetings = () => {
    const columns = useMemo<SimpleEntityColumn[]>(
        () => [
            { key: "name", label: "Meeting" },
            { key: "status", label: "Status", type: "status" },
            { key: "dateStart", label: "Start At", type: "datetime" },
            { key: "dateEnd", label: "End At", type: "datetime" },
            { key: "assignedUserName", label: "Organizer" },
            { key: "createdAt", label: "Created At", type: "date" },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            { name: "name", label: "Meeting Name", type: "text", required: true, placeholder: "Enter meeting name" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { label: "Planned", value: "Planned" },
                    { label: "Held", value: "Held" },
                    { label: "Not Held", value: "Not Held" },
                ],
            },
            { name: "dateStart", label: "Start Date", type: "date" },
            { name: "dateEnd", label: "End Date", type: "date" },
        ],
        []
    );

    return (
        <SimpleEntityCrudPage
            entityType="Meeting"
            entityName="Meeting"
            title="Meetings List"
            pageTitle="Meetings"
            pageParentTitle="Real Estate"
            addButtonLabel="Add Meeting"
            searchPlaceholder="Search meetings by name, status, organizer..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,status,dateStart,dateEnd,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name", "status", "dateStart", "dateEnd"]}
        />
    );
};

export default Meetings;
