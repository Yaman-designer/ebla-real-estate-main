import React, { useMemo } from "react";
import type { CrudFieldConfig } from "Common/EntityCrud/EntityCrudList";
import SimpleEntityCrudPage, { type SimpleEntityColumn } from "pages/RealEstate/Shared/SimpleEntityCrudPage";

const Tasks = () => {
    const columns = useMemo<SimpleEntityColumn[]>(
        () => [
            { key: "name", label: "Task" },
            { key: "status", label: "Status", type: "status" },
            { key: "priority", label: "Priority" },
            { key: "dateStart", label: "Start At", type: "datetime" },
            { key: "dateEnd", label: "End At", type: "datetime" },
            { key: "assignedUserName", label: "Assignee" },
            { key: "createdAt", label: "Created At", type: "date" },
        ],
        []
    );

    const formFields = useMemo<CrudFieldConfig[]>(
        () => [
            { name: "name", label: "Task Name", type: "text", required: true, placeholder: "Enter task name" },
            {
                name: "status",
                label: "Status",
                type: "select",
                options: [
                    { label: "Not Started", value: "Not Started" },
                    { label: "Started", value: "Started" },
                    { label: "Completed", value: "Completed" },
                    { label: "Canceled", value: "Canceled" },
                    { label: "Deferred", value: "Deferred" },
                ],
            },
            {
                name: "priority",
                label: "Priority",
                type: "select",
                options: [
                    { label: "Low", value: "Low" },
                    { label: "Normal", value: "Normal" },
                    { label: "High", value: "High" },
                    { label: "Urgent", value: "Urgent" },
                ],
            },
            { name: "dateStart", label: "Start Date", type: "date" },
            { name: "dateEnd", label: "End Date", type: "date" },
        ],
        []
    );

    return (
        <SimpleEntityCrudPage
            entityType="Task"
            entityName="Task"
            title="Tasks List"
            pageTitle="Tasks"
            pageParentTitle="Real Estate"
            addButtonLabel="Add Task"
            searchPlaceholder="Search tasks by name, status, priority, assignee..."
            columns={columns}
            formFields={formFields}
            attributeSelect="id,name,status,priority,dateStart,dateEnd,assignedUserName,createdAt,modifiedAt"
            allowedPayloadFields={["name", "status", "priority", "dateStart", "dateEnd"]}
        />
    );
};

export default Tasks;
