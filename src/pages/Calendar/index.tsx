import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import UpcommingEvents from "./UpcommingEvents";
import { espoClient } from "helpers/espocrm";
import type { EspoActivity } from "helpers/espocrm";

type ViewMode = "month" | "week";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad2 = (value: number): string => String(value).padStart(2, "0");

const formatUtcDateTime = (date: Date): string => {
    return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())} ${pad2(date.getUTCHours())}:${pad2(date.getUTCMinutes())}`;
};

const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
};

const parseEspoDate = (value?: string | null): Date | null => {
    if (!value) return null;
    const parsed = new Date(value.replace(" ", "T"));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const startOfWeek = (value: Date): Date => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - date.getDay());
    return date;
};

const getCalendarRange = (viewMode: ViewMode, anchorDate: Date): { start: Date; end: Date; agenda: boolean } => {
    if (viewMode === "week") {
        const weekStart = startOfWeek(anchorDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return { start: weekStart, end: weekEnd, agenda: true };
    }

    const monthStart = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
    const monthEnd = new Date(anchorDate.getFullYear(), anchorDate.getMonth() + 1, 0);

    const gridStart = startOfWeek(monthStart);
    const gridEnd = startOfWeek(monthEnd);
    gridEnd.setDate(gridEnd.getDate() + 7);

    return { start: gridStart, end: gridEnd, agenda: false };
};

const getEventBadgeVariant = (status?: string | null): { bg: string; text: string } => {
    const normalized = (status || "").toLowerCase();
    if (normalized.includes("held") || normalized.includes("done") || normalized.includes("complete")) {
        return { bg: "success-subtle", text: "success" };
    }
    if (normalized.includes("plan") || normalized.includes("pending") || normalized.includes("new")) {
        return { bg: "warning-subtle", text: "warning" };
    }
    if (normalized.includes("cancel") || normalized.includes("not held")) {
        return { bg: "danger-subtle", text: "danger" };
    }
    return { bg: "secondary-subtle", text: "secondary" };
};

const Calendar = () => {
    document.title = "Calendar | Steex - Admin & Dashboard Template";

    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [anchorDate, setAnchorDate] = useState<Date>(new Date());
    const [activities, setActivities] = useState<EspoActivity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const range = useMemo(() => getCalendarRange(viewMode, anchorDate), [viewMode, anchorDate]);

    useEffect(() => {
        let mounted = true;

        const fetchActivities = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await espoClient.getActivities({
                    from: formatUtcDateTime(range.start),
                    to: formatUtcDateTime(range.end),
                    agenda: range.agenda,
                });

                if (!mounted) return;
                setActivities(Array.isArray(response) ? response : []);
            } catch (fetchError: any) {
                if (!mounted) return;
                const message =
                    fetchError?.response?.data?.message ||
                    fetchError?.response?.data ||
                    fetchError?.message ||
                    "Failed to load activities.";
                setActivities([]);
                setError(String(message));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchActivities();

        return () => {
            mounted = false;
        };
    }, [range]);

    const eventsByDate = useMemo(() => {
        const map = new Map<string, EspoActivity[]>();

        activities.forEach((item) => {
            const key = item.dateStartDate || (parseEspoDate(item.dateStart) ? formatDateKey(parseEspoDate(item.dateStart) as Date) : "");
            if (!key) return;
            if (!map.has(key)) map.set(key, []);
            map.get(key)?.push(item);
        });

        map.forEach((items, key) => {
            map.set(
                key,
                [...items].sort((a, b) => {
                    const first = parseEspoDate(a.dateStart)?.getTime() || 0;
                    const second = parseEspoDate(b.dateStart)?.getTime() || 0;
                    return first - second;
                })
            );
        });

        return map;
    }, [activities]);

    const monthDays = useMemo(() => {
        if (viewMode !== "month") return [] as Date[];
        const days: Date[] = [];
        const cursor = new Date(range.start);
        while (cursor < range.end) {
            days.push(new Date(cursor));
            cursor.setDate(cursor.getDate() + 1);
        }
        return days;
    }, [range, viewMode]);

    const weekDays = useMemo(() => {
        if (viewMode !== "week") return [] as Date[];
        return Array.from({ length: 7 }, (_, index) => {
            const date = new Date(range.start);
            date.setDate(range.start.getDate() + index);
            return date;
        });
    }, [range, viewMode]);

    const monthTitle = useMemo(
        () => anchorDate.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
        [anchorDate]
    );

    const weekTitle = useMemo(() => {
        const start = range.start.toLocaleDateString();
        const endDate = new Date(range.end);
        endDate.setDate(endDate.getDate() - 1);
        const end = endDate.toLocaleDateString();
        return `${start} - ${end}`;
    }, [range]);

    const handlePrevious = () => {
        setAnchorDate((prev) => {
            const next = new Date(prev);
            if (viewMode === "month") {
                next.setMonth(next.getMonth() - 1);
            } else {
                next.setDate(next.getDate() - 7);
            }
            return next;
        });
    };

    const handleNext = () => {
        setAnchorDate((prev) => {
            const next = new Date(prev);
            if (viewMode === "month") {
                next.setMonth(next.getMonth() + 1);
            } else {
                next.setDate(next.getDate() + 7);
            }
            return next;
        });
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="calendar-wrapper d-xl-flex gap-4">
                        <div className="w-100">
                            <Card className="card-h-100">
                                <Card.Header>
                                    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-2">
                                            <Button variant="light" size="sm" onClick={handlePrevious}>
                                                <i className="ri-arrow-left-s-line"></i>
                                            </Button>
                                            <Button variant="light" size="sm" onClick={() => setAnchorDate(new Date())}>
                                                Today
                                            </Button>
                                            <Button variant="light" size="sm" onClick={handleNext}>
                                                <i className="ri-arrow-right-s-line"></i>
                                            </Button>
                                        </div>

                                        <h5 className="mb-0">{viewMode === "month" ? monthTitle : weekTitle}</h5>

                                        <div className="btn-group" role="group" aria-label="calendar-views">
                                            <Button
                                                size="sm"
                                                variant={viewMode === "month" ? "primary" : "light"}
                                                onClick={() => setViewMode("month")}
                                            >
                                                Month
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={viewMode === "week" ? "primary" : "light"}
                                                onClick={() => setViewMode("week")}
                                            >
                                                Week
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Header>

                                <Card.Body>
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : null}

                                    {!loading && error ? (
                                        <div className="alert alert-warning mb-0" role="alert">
                                            {error}
                                        </div>
                                    ) : null}

                                    {!loading && !error && viewMode === "month" ? (
                                        <div className="table-responsive">
                                            <table className="table table-bordered align-middle mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        {WEEK_DAYS.map((day) => (
                                                            <th key={day} className="text-center">{day}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Array.from({ length: Math.ceil(monthDays.length / 7) }, (_, weekIndex) => {
                                                        const weekRow = monthDays.slice(weekIndex * 7, weekIndex * 7 + 7);
                                                        return (
                                                            <tr key={`week-${weekIndex}`}>
                                                                {weekRow.map((day) => {
                                                                    const dayKey = formatDateKey(day);
                                                                    const dayEvents = eventsByDate.get(dayKey) || [];
                                                                    const isCurrentMonth = day.getMonth() === anchorDate.getMonth();
                                                                    return (
                                                                        <td key={dayKey} style={{ minWidth: "160px", verticalAlign: "top", height: "130px" }}>
                                                                            <div className={`small fw-semibold mb-2 ${isCurrentMonth ? "text-body" : "text-muted"}`}>
                                                                                {day.getDate()}
                                                                            </div>
                                                                            <div className="d-flex flex-column gap-1">
                                                                                {dayEvents.slice(0, 3).map((event) => {
                                                                                    const badgeStyle = getEventBadgeVariant(event.status);
                                                                                    return (
                                                                                        <Badge key={event.id} bg={badgeStyle.bg as any} text={badgeStyle.text as any} className="text-truncate">
                                                                                            {event.name}
                                                                                        </Badge>
                                                                                    );
                                                                                })}
                                                                                {dayEvents.length > 3 ? (
                                                                                    <span className="text-muted small">+{dayEvents.length - 3} more</span>
                                                                                ) : null}
                                                                            </div>
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : null}

                                    {!loading && !error && viewMode === "week" ? (
                                        <Row className="g-3">
                                            {weekDays.map((day) => {
                                                const dayKey = formatDateKey(day);
                                                const dayEvents = eventsByDate.get(dayKey) || [];
                                                return (
                                                    <Col lg={12} key={dayKey}>
                                                        <Card className="shadow-none border mb-0">
                                                            <Card.Header className="py-2">
                                                                <strong>{day.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</strong>
                                                            </Card.Header>
                                                            <Card.Body className="py-2">
                                                                {dayEvents.length === 0 ? (
                                                                    <span className="text-muted small">No activities</span>
                                                                ) : (
                                                                    <div className="vstack gap-2">
                                                                        {dayEvents.map((event) => {
                                                                            const badgeStyle = getEventBadgeVariant(event.status);
                                                                            return (
                                                                                <div key={event.id} className="d-flex flex-wrap align-items-center justify-content-between gap-2 border rounded px-2 py-1">
                                                                                    <div className="d-flex flex-column">
                                                                                        <span className="fw-medium">{event.name}</span>
                                                                                        <span className="text-muted small">
                                                                                            {parseEspoDate(event.dateStart)?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "-"}
                                                                                            {event.dateEnd ? ` - ${parseEspoDate(event.dateEnd)?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) || "-"}` : ""}
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center gap-2">
                                                                                        <Badge bg="light" text="dark">{event.scope || "Activity"}</Badge>
                                                                                        <Badge bg={badgeStyle.bg as any} text={badgeStyle.text as any}>{event.status || "-"}</Badge>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </Card.Body>
                                                        </Card>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    ) : null}
                                </Card.Body>
                            </Card>
                        </div>

                        <Card className="mb-0 calendar-event-card">
                            <Card.Body>
                                <UpcommingEvents activities={activities} loading={loading} error={error} />
                            </Card.Body>
                        </Card>
                    </div>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Calendar;
