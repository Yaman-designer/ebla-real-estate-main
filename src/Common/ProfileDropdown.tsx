import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
//import images
import UserAvatar from './UserAvatar';
import avatar1 from "assets/images/users/32/avatar-1.jpg";
import { createSelector } from 'reselect';
import { Link } from 'react-router-dom';

const ProfileDropdown = () => {

    const [userName, setUserName] = useState<any>("Admin");

    const selectUser = createSelector(
        (state: any) => state.Profile,
        (user) => user.user
    );

    const user = useSelector(selectUser);

    useEffect(() => {
        const authUser = localStorage.getItem("authUser");
        if (authUser) {
            const obj = JSON.parse(authUser);
            const defaultAuth = process.env.REACT_APP_DEFAULTAUTH;

            if (defaultAuth === "fake") {
                setUserName(obj.username === undefined ? user?.username || "Admin" : obj.username);
            } else if (defaultAuth === "firebase") {
                setUserName(obj.email || "Admin");
            } else if (defaultAuth === "espocrm") {
                // EspoCRM user display
                setUserName(obj.name || obj.userName || `${obj.firstName} ${obj.lastName}` || "User");
            } else {
                setUserName("Admin"); // Default case
            }
        }
    }, [userName, user]);

    return (
        <React.Fragment>
            <Dropdown className="ms-sm-3 header-item topbar-user">
                <Dropdown.Toggle type="button" className="btn bg-transparent border-0 arrow-none" id="page-header-user-dropdown">
                    <span className="d-flex align-items-center">
                        <div style={{ width: 32, height: 32 }}>
                            <UserAvatar user={user || { name: userName }} size={32} />
                        </div>
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{userName}</span>
                            {/* <span className="d-none d-xl-block ms-1 fs-sm text-muted user-name-sub-text">Founder</span> */}
                        </span>
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                    <h6 className="dropdown-header">Welcome {userName}!</h6>
                    <Dropdown.Item as={Link} to={process.env.PUBLIC_URL + "/user-profile"}><i className="mdi mdi-account-circle text-muted fs-lg align-middle me-1"></i> <span className="align-middle">Profile</span></Dropdown.Item>
                    <Dropdown.Item href={process.env.PUBLIC_URL + "/apps-chat"}><i className="mdi mdi-message-text-outline text-muted fs-lg align-middle me-1"></i> <span className="align-middle">Messages</span></Dropdown.Item>
                    <Dropdown.Item href={process.env.PUBLIC_URL + "/apps-tickets-overview"}><i className="mdi mdi-calendar-check-outline text-muted fs-lg align-middle me-1"></i> <span className="align-middle">Taskboard</span></Dropdown.Item>
                    <Dropdown.Item href={process.env.PUBLIC_URL + "/pages-faqs"}><i className="mdi mdi-lifebuoy text-muted fs-lg align-middle me-1"></i> <span className="align-middle">Help</span></Dropdown.Item>
                    <div className="dropdown-divider"></div>
                    <Dropdown.Item href={process.env.PUBLIC_URL + "/pages-profile"}><i className="mdi mdi-wallet text-muted fs-lg align-middle me-1"></i> <span className="align-middle">Balance : <b>$8451.36</b></span></Dropdown.Item>
                    <Dropdown.Item href={process.env.PUBLIC_URL + "/pages-profile-settings"}><span className="badge bg-soft-success text-success mt-1 float-end">New</span><i className="mdi mdi-cog-outline text-muted fs-lg align-middle me-1"></i> <span className="align-middle">Settings</span></Dropdown.Item>
                    <Dropdown.Item href={process.env.PUBLIC_URL + "/auth-lockscreen"}><i className="mdi mdi-lock text-muted fs-lg align-middle me-1"></i> <span className="align-middle">Lock screen</span></Dropdown.Item>
                    <Dropdown.Item href={process.env.PUBLIC_URL + "/logout"}><i className="mdi mdi-logout text-muted fs-lg align-middle me-1"></i> <span className="align-middle" data-key="t-logout">Logout</span></Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </React.Fragment>
    );
}

export default ProfileDropdown;