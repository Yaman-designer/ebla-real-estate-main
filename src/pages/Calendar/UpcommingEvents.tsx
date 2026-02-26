import React, { useMemo } from "react";
import { Badge, Card } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import type { EspoActivity } from "helpers/espocrm";

interface UpcommingEventsProps {
    activities: EspoActivity[];
    loading: boolean;
    error: string;
}

const renderStatusBadge = (status?: string | null) => {
    const normalized = (status || "").toLowerCase();
    if (normalized.includes("held") || normalized.includes("done") || normalized.includes("complete")) {
        return <Badge bg="success-subtle" text="success">{status || "Done"}</Badge>;
    }
    if (normalized.includes("plan") || normalized.includes("pending") || normalized.includes("new")) {
        return <Badge bg="warning-subtle" text="warning">{status || "Planned"}</Badge>;
    }
    if (normalized.includes("cancel") || normalized.includes("not held")) {
        return <Badge bg="danger-subtle" text="danger">{status || "Canceled"}</Badge>;
    }
    return <Badge bg="secondary-subtle" text="secondary">{status || "-"}</Badge>;
};

const formatDateTime = (value?: string | null) => {
    if (!value) return "-";
    const parsed = new Date(value.replace(" ", "T"));
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString();
};

const UpcommingEvents = ({ activities, loading, error }: UpcommingEventsProps) => {
    const sortedActivities = useMemo(
        () => [...activities].sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime()),
        [activities]
    );

    return (
        <React.Fragment>
            <h5 className="mb-3">Upcoming Activities</h5>

            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : null}

            {!loading && error ? (
                <div className="alert alert-warning mb-3" role="alert">
                    {error}
                </div>
            ) : null}

            {!loading && !error ? (
                <SimpleBar className="px-1" style={{ maxHeight: "520px" }}>
                    {sortedActivities.length === 0 ? (
                        <div className="text-muted py-3 px-2">No activities in selected range.</div>
                    ) : (
                        <div className="vstack gap-2 pe-2">
                            {sortedActivities.map((item) => (
                                <Card key={item.id} className="shadow-none border mb-0">
                                    <Card.Body className="py-2 px-3">
                                        <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                                            <h6 className="mb-0 text-truncate">{item.name || "Untitled activity"}</h6>
                                            {renderStatusBadge(item.status)}
                                        </div>
                                        <div className="d-flex flex-wrap gap-2 align-items-center mb-1">
                                            <Badge bg="light" text="dark">{item.scope || "Activity"}</Badge>
                                            {item.parentType ? <span className="text-muted small">{item.parentType}</span> : null}
                                        </div>
                                        <div className="text-muted small">
                                            <i className="ri-time-line align-bottom me-1"></i>
                                            {formatDateTime(item.dateStart)}
                                            {item.dateEnd ? ` - ${formatDateTime(item.dateEnd)}` : ""}
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </SimpleBar>
            ) : null}
        </React.Fragment>
    );
};

export default UpcommingEvents;
