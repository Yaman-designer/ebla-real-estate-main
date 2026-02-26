import React, { useEffect, useState } from "react";

const Navdata = () => {
    //state data
    const [isReferralNetwork, setIsReferralNetwork] = useState(false);
    const [isActivities, setIsActivities] = useState(false);
    const [isCompany, setIsCompany] = useState(false);
    const [isSupport, setIsSupport] = useState(false);
    const [isTools, setIsTools] = useState(false);
    const [isAllProperties, setIsAllProperties] = useState(false);

    // Authentication
    const [iscurrentState, setIscurrentState] = useState('Home');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems: any = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id: any = item.getAttribute("sub-items");
                var menusId = document.getElementById(id);
                if (menusId) {
                    (menusId.parentElement as HTMLElement).classList.remove("show");
                }
            });
            e.target.classList.add("active");
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');

        if (iscurrentState !== 'ReferralNetwork') {
            setIsReferralNetwork(false);
        }
        if (iscurrentState !== 'Activities') {
            setIsActivities(false);
        }
        if (iscurrentState !== 'Company') {
            setIsCompany(false);
        }
        if (iscurrentState !== 'Support') {
            setIsSupport(false);
        }
        if (iscurrentState !== 'Tools') {
            setIsTools(false);
        }
        if (iscurrentState !== 'AllProperties') {
            setIsAllProperties(false);
        }

    }, [
        iscurrentState,
        isReferralNetwork,
        isActivities,
        isCompany,
        isSupport,
        isSupport,
        isTools,
        isAllProperties,
    ]);

    const menuItems: any = [
        {
            id: "home",
            label: "Home",
            icon: "ph-house", // ph-gauge is also an option, but house matches 'Home' better
            link: "/dashboard",
        },
        {
            id: "my-properties",
            label: "Τα ακίνητα μου",
            icon: "ph-house-line", // Mapped from fas fa-house-user
            link: "/my-properties",
        },
        {
            id: "all-properties",
            label: "Όλα τα ακίνητα",
            icon: "ph-house", // Mapped from fas fa-house-damage
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsAllProperties(!isAllProperties);
                setIscurrentState('AllProperties');
                updateIconSidebar(e);
            },
            stateVariables: isAllProperties,
            subItems: [
                { id: "real-estate-grid", label: "Grid", link: "/properties", parentId: "all-properties" },
                { id: "real-estate-map", label: "Map", link: "/properties-map", parentId: "all-properties" },
            ],
        },
        {
            id: "ceauction",
            label: "Ακίνητα Δημοπρασιών",
            icon: "ph-gavel", // Mapped from fas fa-gavel
            link: "/ceauction",
        },
        {
            id: "portals-properties",
            label: "FSBO",
            icon: "ph-fire", // Mapped from fas fa-fire
            link: "/portals-properties",
        },
        {
            id: "real-estate-request",
            label: "Requests",
            icon: "ph-hand-palm", // Mapped from fas fa-hand-holding
            link: "/real-estate-request",
        },
        {
            id: "call",
            label: "Calls",
            icon: "ph-phone-call", // Mapped from fas fa-phone
            link: "/call",
        },
        {
            id: "ebla-contract",
            label: "Contracts",
            icon: "ph-file-text", // Mapped from fas fa-file-contract
            link: "/ebla-contract",
        },
        {
            id: "referral-network",
            label: "Referral Network",
            icon: "ph-share-network", // Mapped from fas fa-folder-tree
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsReferralNetwork(!isReferralNetwork);
                setIscurrentState('ReferralNetwork');
                updateIconSidebar(e);
            },
            stateVariables: isReferralNetwork,
            subItems: [
                { id: "creferral", label: "Referrals", link: "/creferral", parentId: "referral-network", icon: "ph-user-focus" }, // Mapped from fas fa-person-arrow-down-to-line
                { id: "cdealref", label: "DealRefs", link: "/cdealref", parentId: "referral-network", icon: "ph-folder-notch" }, // Mapped from fas fa-folder-tree
            ],
        },
        {
            id: "collaborations",
            label: "Συνεργασίες",
            icon: "ph-handshake", // Mapped from fas fa-hands-helping
            link: "/collaborations",
        },
        {
            id: "creference",
            label: "Συστάσεις",
            icon: "ph-thumbs-up", // Mapped from fas fa-hand-peace
            link: "/creference",
        },
        {
            id: "contact",
            label: "Contacts",
            icon: "ph-address-book", // Mapped from fas fa-id-badge
            link: "/contact",
        },
        {
            id: "cpipeline",
            label: "Pipeline",
            icon: "ph-funnel", // Mapped from fas fa-cubes-stacked
            link: "/cpipeline",
        },
        {
            id: "activities",
            label: "Δραστηριότητες",
            icon: "ph-calendar-check", // Mapped from fas fa-calendar-check
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsActivities(!isActivities);
                setIscurrentState('Activities');
                updateIconSidebar(e);
            },
            stateVariables: isActivities,
            subItems: [
                { id: "task", label: "Tasks", link: "/task", parentId: "activities", icon: "ph-check-square" }, // Mapped from fas fa-hammer
                { id: "meeting", label: "Meetings", link: "/meeting", parentId: "activities", icon: "ph-users" }, // Mapped from fas fa-calendar-check
                { id: "calendar", label: "Calendar", link: "/calendar", parentId: "activities", icon: "ph-calendar" }, // Mapped from far fa-calendar-alt
            ],
        },
        {
            id: "company",
            label: "Η εταιρεία",
            icon: "ph-buildings", // Mapped from fas fa-archway
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsCompany(!isCompany);
                setIscurrentState('Company');
                updateIconSidebar(e);
            },
            stateVariables: isCompany,
            subItems: [
                { id: "user", label: "Users", link: "/user", parentId: "company", icon: "ph-user-circle" }, // Mapped from fas fa-user-circle
                { id: "team", label: "Teams", link: "/team", parentId: "company", icon: "ph-users-three" }, // Mapped from fas fa-users
            ],
        },
        {
            id: "support",
            label: "Υποστήριξη",
            icon: "ph-headphones", // Mapped from fas fa-headphones
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsSupport(!isSupport);
                setIscurrentState('Support');
                updateIconSidebar(e);
            },
            stateVariables: isSupport,
            subItems: [
                { id: "case", label: "Cases", link: "/case", parentId: "support", icon: "ph-briefcase" }, // Mapped from fas fa-briefcase
                { id: "knowledge-base-article", label: "Knowledge Base", link: "/knowledge-base-article", parentId: "support", icon: "ph-book" }, // Mapped from fas fa-book
            ],
        },
        {
            id: "document",
            label: "Documents",
            icon: "ph-file", // Mapped from far fa-file-alt
            link: "/document",
        },
        {
            id: "tools",
            label: "Εργαλεία",
            icon: "ph-wrench", // Mapped from fas fa-tools
            link: "/#",
            click: function (e: any) {
                e.preventDefault();
                setIsTools(!isTools);
                setIscurrentState('Tools');
                updateIconSidebar(e);
            },
            stateVariables: isTools,
            subItems: [
                { id: "email-template", label: "Email Templates", link: "/email-template", parentId: "tools", icon: "ph-envelope-open" }, // Mapped from fas fa-envelope-square
                { id: "template", label: "PDF Templates", link: "/template", parentId: "tools", icon: "ph-file-pdf" }, // Mapped from fas fa-file-pdf
                { id: "cchangelog", label: "Changelogs", link: "/cchangelog", parentId: "tools", icon: "ph-newspaper" }, // Mapped from fas fa-newspaper
                { id: "stream", label: "Stream", link: "/stream", parentId: "tools", icon: "ph-rss" }, // Mapped from fas fa-rss
            ],
        },
        {
            id: "report",
            label: "Reports",
            icon: "ph-chart-bar", // Mapped from fas fa-chart-bar
            link: "/report",
        },
        // Separator logic would typically be CSS/Layout handled, but if needed as item:
        // { label: "Separator", isHeader: true } // or similar if supported
        {
            id: "chat",
            label: "Chat",
            icon: "ph-chat-circle-dots", // Mapped from fas fa-comments
            link: "/chat",
        },
        {
            id: "email",
            label: "Emails",
            icon: "ph-envelope", // Mapped from fas fa-envelope
            link: "/email",
        },
        {
            label: "Άλλα εργαλεία",
            isHeader: true,
        },
        {
            id: "academy",
            label: "Academy newdeal",
            icon: "ph-graduation-cap", // Mapped from fas fa-university
            link: "/academy",
        },
        {
            id: "price-my-property",
            label: "Price my Property",
            icon: "ph-calculator", // Mapped from fas fa-calculator
            link: "/price-my-property",
        },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;