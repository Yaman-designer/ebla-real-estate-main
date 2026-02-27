import React, { useEffect, useState } from "react";
import { Button, Col, Dropdown, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

// SimpleBar
import SimpleBar from "simplebar-react";

// API
import {
  getUnreadCount,
  getNotifications,
  markAllAsRead,
} from "../api/notifications";

const NotificationDropdown: React.FC = () => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      const [count, notifRes] = await Promise.all([
        getUnreadCount(),
        getNotifications(),
      ]);
      const list = (notifRes && notifRes.list) || [];
      setNotifications(list);
      setUnreadCount(Number(count) || list.length);
    } catch (error) {
      console.error("Notification load error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      const ok = await markAllAsRead();
      if (ok === true) {
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((n) => ({
            ...n,
            read: true,
          })),
        );
      }
    } catch (error) {
      console.error("markAllAsRead error:", error);
    }
  }

  return (
    <React.Fragment>
      <Dropdown
        className="topbar-head-dropdown ms-1 header-item"
        id="notificationDropdown"
      >
        {/* زر الجرس */}
        <Dropdown.Toggle
          id="notification"
          type="button"
          className="btn btn-icon btn-topbar btn-ghost-dark rounded-circle arrow-none"
        >
          <i className="bi bi-bell fs-2xl"></i>
          {unreadCount > 0 && (
            <span className="position-absolute topbar-badge fs-3xs translate-middle badge rounded-pill bg-danger">
              <span className="notification-badge">{unreadCount}</span>
              <span className="visually-hidden">unread messages</span>
            </span>
          )}
        </Dropdown.Toggle>

        {/* القائمة المنسدلة */}
        <Dropdown.Menu
          className="dropdown-menu-lg dropdown-menu-end p-0"
          aria-labelledby="page-header-notifications-dropdown"
        >
          {/* الهيدر */}
          <div className="dropdown-head rounded-top">
            <div className="p-3 border-bottom border-bottom-dashed">
              <Row className="align-items-center">
                <Col>
                  <h6 className="mb-0 fs-lg fw-semibold">
                    Notifications{" "}
                    <span className="badge bg-danger-subtle text-danger fs-sm notification-badge">
                      {unreadCount}
                    </span>
                  </h6>
                  <p className="fs-md text-muted mt-1 mb-0">
                    You have{" "}
                    <span className="fw-semibold notification-unread">
                      {unreadCount}
                    </span>{" "}
                    unread messages
                  </p>
                </Col>

                <Dropdown className="col-auto">
                  <Dropdown.Toggle
                    as="button"
                    data-bs-toggle="dropdown"
                    className="link-secondary fs-md bg-transparent border-0 arrow-none"
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <li>
                      <Dropdown.Item href="#!">All Clear</Dropdown.Item>
                    </li>
                    <li>
                      <Dropdown.Item href="#!" onClick={handleMarkAllAsRead}>
                        Mark all as read
                      </Dropdown.Item>
                    </li>
                    <li>
                      <Dropdown.Item href="#!">Archive All</Dropdown.Item>
                    </li>
                  </Dropdown.Menu>
                </Dropdown>
              </Row>
            </div>
          </div>

          {/* قائمة الإشعارات */}
          <div className="py-2 ps-2" id="notificationItemsTabContent">
            <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
              {loading && (
                <p className="fs-sm text-muted px-3 py-2">Loading...</p>
              )}

              {!loading && notifications.length === 0 && (
                <p className="fs-sm text-muted px-3 py-2">No notifications</p>
              )}

              {!loading &&
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={
                      "text-reset notification-item d-block dropdown-item position-relative" +
                      (n.read ? "" : " unread-message")
                    }
                  >
                    <div className="d-flex">
                      <div className="avatar-xs me-3 flex-shrink-0">
                        <span className="avatar-title bg-info-subtle text-info rounded-circle fs-lg">
                          <i className="bx bx-bell"></i>
                        </span>
                      </div>
                      <div className="flex-grow-1">
                        <Link to="#!" className="stretched-link">
                          <h6 className="mt-0 fs-md mb-1 lh-base">
                            {n.noteData?.createdByName ||
                              n.userName ||
                              "Message"}
                          </h6>
                        </Link>
                        <p className="mb-0 fs-sm text-muted">
                          {n.noteData?.post ||
                            n.message ||
                            n.noteData?.parentName}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </SimpleBar>
            <div className="notification-actions" id="notification-actions">
              <div className="d-flex text-muted justify-content-center align-items-center">
                Select
                <div id="select-content" className="text-body fw-semibold px-1">
                  0
                </div>
                Result
                <Button
                  variant="link-danger"
                  className="btn-link p-0 ms-2"
                  data-bs-toggle="modal"
                  data-bs-target="#removeNotificationModal"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NotificationDropdown;
